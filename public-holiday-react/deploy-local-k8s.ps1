param(
    [string]$ImageName    = "public-holiday-react",
    [string]$ImageTag     = "latest",
    [string]$Namespace    = "default",
    [string]$DeploymentName = "holiday-frontend",

    # Where /api/holiday should be proxied to.
    # Default: in-cluster aiservice backend endpoint.
    # Fallback: Lambda URL if the backend service is not deployed yet.
    [string]$ApiUpstream  = "http://aiservice:8080/api/ask",

    # Where /api/ask/stream should be proxied to for SSE.
    [string]$ApiStreamUpstream = "http://aiservice:8080/api/ask/stream",

    [switch]$SkipBuild,
    [switch]$SkipApply
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Require-Command {
    param([string]$Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' was not found in PATH."
    }
}

function Ensure-Namespace {
    param([string]$TargetNamespace)
    if ($TargetNamespace -eq "default") { return }

    $found = kubectl get namespace $TargetNamespace --ignore-not-found -o name 2>$null
    if ([string]::IsNullOrWhiteSpace($found)) {
        Write-Step "Creating namespace '$TargetNamespace'"
        kubectl create namespace $TargetNamespace | Out-Null
    }
}

function Import-ImageToKindNodes {
    param([string]$ImageRef)

    $tarName = ($ImageRef -replace '[:/]', '-') + ".tar"
    $tarPath = Join-Path $env:TEMP $tarName
    $remoteTarPath = "/kind/$tarName"

    Write-Step "Saving image '$ImageRef' to $tarPath"
    docker save -o $tarPath $ImageRef | Out-Null

    $nodeNames = kubectl get nodes -o name |
        ForEach-Object { $_.Trim() -replace '^node/', '' } |
        Where-Object { $_ }

    if (-not $nodeNames) {
        throw "No Kubernetes nodes found. Confirm Docker Desktop Kubernetes is running."
    }

    foreach ($nodeName in $nodeNames) {
        Write-Step "Importing image into node '$nodeName'"
        docker cp $tarPath "${nodeName}:$remoteTarPath" | Out-Null
        docker exec $nodeName ctr -n k8s.io images import $remoteTarPath | Out-Null
    }

    Remove-Item $tarPath -ErrorAction SilentlyContinue
}

# ── Prerequisites ──────────────────────────────────────────────────────────────
Require-Command docker
Require-Command kubectl

$frontendRoot = Split-Path -Parent $PSCommandPath
$imageRef     = "$ImageName`:$ImageTag"

# ── Cluster context check ──────────────────────────────────────────────────────
Write-Step "Checking Kubernetes context"
$currentContext = kubectl config current-context 2>$null
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($currentContext)) {
    throw "kubectl has no current context. Confirm Docker Desktop Kubernetes is running."
}
if ($currentContext.Trim() -ne "docker-desktop") {
    Write-Warning "Current context is '$($currentContext.Trim())', not 'docker-desktop'."
}

Ensure-Namespace -TargetNamespace $Namespace

# ── Build ──────────────────────────────────────────────────────────────────────
if (-not $SkipBuild) {
    Write-Step "Building $imageRef"
    # Dockerfile and build context are both in the frontend root folder
    docker build -t $imageRef "$frontendRoot"
}

# ── Load image into kind node runtime ─────────────────────────────────────────
Write-Step "Loading $imageRef into Docker Desktop kind nodes"
Import-ImageToKindNodes -ImageRef $imageRef

# ── Apply ConfigMap with runtime nginx config ──────────────────────────────────
Write-Step "Applying nginx ConfigMap (API upstream: $ApiUpstream, stream upstream: $ApiStreamUpstream)"

$templatePath = Join-Path $frontendRoot "k8s\nginx.conf.template"
$nginxConf    = (Get-Content $templatePath -Raw) `
    -replace '__API_UPSTREAM__', $ApiUpstream `
    -replace '__API_STREAM_UPSTREAM__', $ApiStreamUpstream

# Use a temp file for kubectl stdin apply
$tmpConf = Join-Path $env:TEMP "holiday-frontend-nginx.conf"
# PowerShell 5.1 Set-Content -Encoding UTF8 writes a BOM which breaks nginx.
# Write via .NET directly to guarantee UTF-8 without BOM.
[System.IO.File]::WriteAllText($tmpConf, $nginxConf, [System.Text.UTF8Encoding]::new($false))

kubectl create configmap holiday-frontend-nginx `
    --from-file=default.conf=$tmpConf `
    --namespace $Namespace `
    --dry-run=client -o yaml | kubectl apply -f -

Remove-Item $tmpConf -ErrorAction SilentlyContinue

# ── Apply manifests ────────────────────────────────────────────────────────────
if (-not $SkipApply) {
    Write-Step "Applying Kubernetes manifests"
    kubectl apply -n $Namespace -f "$frontendRoot\k8s\deployment.yaml"
    kubectl apply -n $Namespace -f "$frontendRoot\k8s\service.yaml"
}

# ── Rollout ────────────────────────────────────────────────────────────────────
Write-Step "Restarting deployment '$DeploymentName' to pick up the local image"
kubectl rollout restart deployment/$DeploymentName -n $Namespace

Write-Step "Waiting for rollout to complete"
kubectl rollout status deployment/$DeploymentName -n $Namespace --timeout=180s

# ── Status ─────────────────────────────────────────────────────────────────────
Write-Step "Current workload status"
kubectl get pods,svc -n $Namespace

Write-Host "`nFrontend deployment complete." -ForegroundColor Green
Write-Host "Access the app at: http://localhost" -ForegroundColor Yellow
Write-Host "API upstream configured as: $ApiUpstream" -ForegroundColor Yellow
Write-Host "API stream upstream configured as: $ApiStreamUpstream" -ForegroundColor Yellow
