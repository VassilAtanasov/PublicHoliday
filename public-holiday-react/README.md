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

## Current API contract

- Endpoint: `https://45f2opaos26j5odxxk3ldbjs5q0zavtg.lambda-url.eu-north-1.on.aws/`
- Method: `POST`
- Input: a `question` query parameter containing the generated holiday prompt
- Response: plain text where the first line becomes the title and the remaining lines become the description

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