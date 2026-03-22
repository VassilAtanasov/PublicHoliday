# public-holiday-react plan

This folder is reserved for a step-by-step React version of the existing public holiday app.

## Progress summary

- Overall status: Phases 1 to 6 completed, phase 7 pending
- Last updated: 2026-03-22

## Checklist

- [x] Phase 1: Simplest version
- [x] Phase 2: First test
- [x] Phase 3: Component with props and hooks
- [x] Phase 4: Replace Vue GitHub Pages deployment with React
- [x] Phase 5: Replace mock holiday data with real AWS Lambda API call
- [x] Phase 6: Deploy locally in a Docker Desktop container
- [ ] Phase 7: Store recent results

## Scope for now

Create only the React learning app as a sibling project.

Out of scope for the initial phases:
- Android
- Capacitor
- PWA parity
- TypeScript conversion
- Redux migration

## Learning phases

### Phase 1: Simplest version

Status: completed

Goal: build the smallest working React app with mocked holiday data.

Planned work:
- [x] Scaffold a standalone Vite React app in this folder
- [x] Use JavaScript first to reduce concepts
- [x] Keep the first version in a single `App` component
- [x] Render a title, description, and a button to load or refresh mock data
- [x] Reuse the existing app's general visual style where useful

Completed result:
- Minimal Vite React app created
- Mocked holiday loading flow implemented
- Production build verified successfully

Learning focus:
- JSX
- `useState`
- Event handlers
- Conditional rendering

### Phase 2: First test

Status: completed

Goal: add one small automated test after the simplest app works.

Planned work:
- [x] Add Vitest and React Testing Library
- [x] Test that the main heading renders
- [x] Test that mocked holiday content appears after interaction or initial load

Completed result:
- Vitest and React Testing Library configured
- First unit test added for render and interaction flow
- Test run verified successfully

Learning focus:
- Component testing
- Rendering assertions
- Verifying state updates

### Phase 3: Component with props and hooks

Status: completed

Goal: separate rendering from behavior.

Planned work:
- [x] Extract a reusable result component such as `HolidayResult`
- [x] Pass data from `App` to the component through props
- [x] Move loading logic into a custom hook such as `useAIService`

Completed result:
- Result rendering extracted into a props-based component
- Mock holiday state and loading flow moved into a custom hook
- Existing test and build both verified successfully after the refactor

Learning focus:
- Props
- Custom hooks
- Parent and child data flow
- Separation of concerns

### Phase 4: Replace Vue GitHub Pages deployment with React

Status: completed

Goal: make GitHub Pages serve the React app instead of the current Vue app.

Planned work:
- [x] Update the existing GitHub Actions workflow to install dependencies from `public-holiday-react`
- [x] Build `public-holiday-react` instead of `public-holiday-app`
- [x] Upload `public-holiday-react/dist` instead of the Vue dist output
- [x] Update the React Vite config so the production base path works on the repository GitHub Pages URL
- [x] Update documentation so the repo clearly states that GitHub Pages now serves the React app

Completed result:
- GitHub Pages workflow switched from the Vue app to the React app
- React production base path configured for the repository Pages URL
- Root deployment documentation updated to describe React as the deployed app while keeping Vue in the repository
- Editor validation passed for the changed files
- Local production build re-run was skipped during this step, so GitHub Actions is the remaining deployment-path verification

Learning focus:
- Deployment workflows
- Production build configuration
- GitHub Pages base paths
- Replacing an existing deployment target safely

### Phase 5: Replace mock holiday data with real AWS Lambda API call

Status: completed

Goal: replace the mock holiday loading flow with a real API call to AWS Lambda.

Planned work:
- [x] Update the custom hook so it calls the real AWS Lambda endpoint instead of cycling through mock data
- [x] Preserve the existing loading and success UI states
- [x] Add explicit error handling for failed responses
- [x] Read the Lambda endpoint from configuration instead of hardcoding it into the component tree when possible
- [x] Define and document the expected API contract
- [x] Parse the returned payload into the existing title and description UI shape

Completed result:
- The custom hook now calls the AWS Lambda URL with a generated `question` query parameter using `POST`
- The plain-text Lambda response is parsed into the existing title and description UI
- An explicit error state is rendered when the request fails
- React tests now cover both successful and failed Lambda requests with mocked fetch responses
- Production build completed successfully after the live-data integration

Learning focus:
- Real API calls in React hooks
- Async state handling
- Error handling
- API contract design
- Configuration management

### Phase 6: Deploy locally in a Docker Desktop container

Status: completed

Goal: run the React app in a local Docker Desktop container with a stable browser URL.

Planned work:
- [x] Add a production-ready `Dockerfile` with a multi-stage build
- [x] Add a `.dockerignore` file to keep the image context small
- [x] Serve the built app from a lightweight web server in the container
- [x] Expose the container web port and document host mapping for local access
- [x] Add simple build and run commands to project documentation

Completed result:
- Multi-stage Docker image build added using Node for build and Nginx for runtime
- Local Docker Desktop commands documented in README and package scripts
- Production app build verified successfully after Docker setup changes
- Docker image build validated locally and the container served HTTP 200 on localhost:8080

Learning focus:
- Container image lifecycle
- Multi-stage Docker builds
- Port binding from container to host
- Local runtime parity across environments

### Phase 7: Store recent results

Status: not started

Goal: keep a history of recently loaded holiday results.

Planned work:
- [ ] Use built-in React state tools first
- [ ] Add a small Context-based store or reducer-based store
- [ ] Save recent results as plain objects with fields like `id`, `title`, `description`, and `loadedAt`
- [ ] Show a recent results list in the UI

Learning focus:
- Shared state
- Context
- Reducer patterns
- State updates across components

## Relevant files

- `c:\r\v\PublicHoliday\public-holiday-app\src\App.vue` — reference the existing UI states, layout, refresh interaction, and current holiday content presentation to mirror in React
- `c:\r\v\PublicHoliday\public-holiday-app\src\main.ts` — reuse the simple entry-point pattern when creating the React entry file
- `c:\r\v\PublicHoliday\public-holiday-app\src\assets\base.css` — reuse only the global reset ideas that still make sense
- `c:\r\v\PublicHoliday\public-holiday-app\package.json` — mirror script naming and tooling patterns where useful
- `c:\r\v\PublicHoliday\public-holiday-app\vite.config.ts` — reference the existing production base-path handling for the GitHub Pages replacement
- `c:\r\v\PublicHoliday\public-holiday-react\src\hooks\useAIService.js` — replace the mock cycling logic here with the real AWS Lambda request
- `c:\r\v\PublicHoliday\public-holiday-react\src\App.jsx` — keep this focused on wiring hook output into the page
- `c:\r\v\PublicHoliday\public-holiday-react\vite.config.js` — update this during the deployment phase for the GitHub Pages base path
- `c:\r\v\PublicHoliday\public-holiday-react\package.json` — add or update environment-aware scripts only if needed for the Lambda integration
- `c:\r\v\PublicHoliday\public-holiday-react\Dockerfile` — define the multi-stage container build and runtime image
- `c:\r\v\PublicHoliday\public-holiday-react\.dockerignore` — reduce Docker build context and avoid copying local artifacts
- `c:\r\v\PublicHoliday\public-holiday-react\README.md` — add local Docker Desktop build, run, and cleanup commands
- `c:\r\v\PublicHoliday\.github\workflows\deploy.yml` — switch the GitHub Pages workflow from Vue to React
- `c:\r\v\PublicHoliday\README.md` — update later to reflect the React deployment and live API wiring

## Suggested verification per phase

1. Simplest version renders and refreshes mock data correctly.
2. The first unit test passes.
3. Extracted component renders correctly from props.
4. The custom hook preserves the same behavior.
5. During the deployment phase, verify the React app builds with the correct GitHub Pages base path and that the GitHub Actions workflow installs, builds, and uploads from `public-holiday-react` rather than `public-holiday-app`.
6. After the deployment switch, confirm the repository GitHub Pages site serves the React app at the existing site URL instead of the Vue app.
7. During the AWS Lambda phase, verify the mock logic has been removed from the hook, the real endpoint is called, loading and error states are visible, and the returned data is parsed into the current title and description UI.
8. Add or update tests around the hook or UI so the live-data path is covered without making brittle real-network assumptions during normal test runs.
9. During the Docker phase, verify `docker build` completes, the container starts, the app loads at the mapped host URL, and a stop or cleanup command is documented.
10. After the recent-results store step, verify newly loaded results are appended, ordering is correct, and duplicate-handling behavior is defined.
11. Run linting and the chosen test commands for the new app only.

## Tracking notes

- Update this file at the end of each phase.
- Mark checklist items instead of rewriting the whole plan.
- Keep later ideas separate from the current learning path.

## Later follow-up ideas

After these phases are complete, the next learning steps can be:
- convert the app to TypeScript
- replace the built-in store with Redux
- add more deployment hardening or environment separation