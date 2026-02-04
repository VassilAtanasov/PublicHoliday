# GitHub Pages Deployment Guide

This guide explains how to deploy the Public Holiday app to GitHub Pages.

## Prerequisites

- Repository pushed to GitHub
- GitHub Actions enabled in repository settings

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (top right)
3. In the left sidebar, click on **Pages**
4. Under "Build and deployment":
   - Source: Select **GitHub Actions**
   - This allows the GitHub Actions workflow to deploy the site

### 2. Workflow Configuration

The deployment is configured in `.github/workflows/deploy.yml`. This workflow:

- Triggers on push to `main` branch
- Can also be manually triggered from the Actions tab
- Builds the Vue.js app
- Deploys to GitHub Pages

### 3. First Deployment

To trigger the first deployment:

1. Merge your PR to the `main` branch, OR
2. Go to the **Actions** tab in your GitHub repository
3. Select the "Deploy to GitHub Pages" workflow
4. Click "Run workflow" and select the `main` branch

### 4. Access Your App

Once deployed, your app will be available at:

```
https://<username>.github.io/PublicHoliday/
```

For example: `https://vassilatanasov.github.io/PublicHoliday/`

## Deployment Status

You can monitor deployment status:

1. Go to the **Actions** tab in your repository
2. Click on the latest "Deploy to GitHub Pages" workflow run
3. View the build and deploy logs

## Troubleshooting

### Build Fails

If the build fails:
1. Check the workflow logs in the Actions tab
2. Ensure all dependencies are listed in `package.json`
3. Try building locally first: `cd public-holiday-app && npm run build`

### 404 Error After Deployment

If you get a 404 error:
1. Verify the `base` path in `vite.config.ts` matches your repository name
2. Wait a few minutes after deployment completes
3. Try accessing the full path: `https://<username>.github.io/PublicHoliday/`

### Pages Not Showing

If GitHub Pages doesn't appear in Settings:
1. Ensure GitHub Pages is enabled for your account/organization
2. Check repository visibility (public repositories work best)
3. Verify GitHub Actions has Pages write permissions

## Manual Deployment

If you prefer to deploy manually without GitHub Actions:

1. Build the app locally:
   ```bash
   cd public-holiday-app
   npm run build
   ```

2. The `dist` folder contains the production build

3. Deploy the `dist` folder contents to any static hosting service

## Updating the App

After merging changes to `main`:

1. The workflow automatically builds and deploys
2. Changes appear within 1-2 minutes
3. You may need to hard refresh (Ctrl+F5) to see updates

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file in `public-holiday-app/public/` with your domain
2. Configure DNS settings with your domain provider
3. Enable "Enforce HTTPS" in GitHub Pages settings

## API Configuration

The app calls this API endpoint:
```
https://funcapp-hnn5vijj5yj7e.azurewebsites.net/api/Function1
```

To change the API endpoint, edit `src/App.vue` and update the fetch URL.
