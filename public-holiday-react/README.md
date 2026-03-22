# Public Holiday React

Phase 1 of the React learning app.

## Current scope

This version intentionally keeps the app small:
- React with Vite
- JavaScript instead of TypeScript
- React components plus a custom hook
- Live AWS Lambda holiday data
- Tailwind CSS for styling

## Run locally

```bash
npm install
npm run dev
```

## Run in Docker Desktop

Build the container image:

```bash
docker build -t public-holiday-react:local .
```

The Docker build uses a root base path (`/`) so local container assets load correctly on `localhost`.

Run the container and expose it on localhost port 8080:

```bash
docker run --name public-holiday-react --rm -p 8080:80 public-holiday-react:local
```

Then open:

```text
http://localhost:8080
```

Stop the running container:

```bash
docker stop public-holiday-react
```

## Current API contract

- Endpoint: `https://obeo6mf6wgez53kqen5bcjfyou0pfmem.lambda-url.eu-north-1.on.aws/`
- Method: `POST`
- Input: a `question` query parameter containing the generated holiday prompt
- Response: plain text where the first line becomes the title and the remaining lines become the description

### Local development CORS behavior

- In local development (`npm run dev`), the app calls `/api/holiday`.
- Vite proxies that path to the AWS Lambda URL, so requests originate from the dev server and avoid browser CORS blocks on `localhost`.
- In GitHub Pages production builds, the app calls the Lambda URL directly.
- In Docker Desktop builds, the app also calls `/api/holiday`, and nginx inside the container proxies it to AWS Lambda.

The endpoint is hardcoded for now as requested in the plan discussion.

## Run the first unit test

```bash
npm run test:unit
```

## Phase 1 learning goals

- JSX
- `useState`
- Event handling
- Conditional rendering

## Current learning focus

- Custom hooks for live data loading
- Async request state
- Error handling for failed API calls

For the full step-by-step roadmap, see `PLAN.md`.