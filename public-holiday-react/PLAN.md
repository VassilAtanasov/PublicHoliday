# public-holiday-react plan

This folder is reserved for a step-by-step React version of the existing public holiday app.

## Progress summary

- Overall status: Phases 1 to 3 completed, phase 4 pending
- Last updated: 2026-03-12

## Checklist

- [x] Phase 1: Simplest version
- [x] Phase 2: First test
- [x] Phase 3: Component with props and hooks
- [ ] Phase 4: Store recent results

## Scope for now

Create only the React learning app as a sibling project.

Out of scope for the initial phases:
- Android
- Capacitor
- PWA parity
- Live API integration
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
- [x] Move loading logic into a custom hook such as `useMockHoliday`

Completed result:
- Result rendering extracted into a props-based component
- Mock holiday state and loading flow moved into a custom hook
- Existing test and build both verified successfully after the refactor

Learning focus:
- Props
- Custom hooks
- Parent and child data flow
- Separation of concerns

### Phase 4: Store recent results

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

## Suggested verification per phase

1. Simplest version renders and refreshes mock data correctly.
2. The first unit test passes.
3. Extracted component renders correctly from props.
4. The custom hook preserves the same behavior.
5. Recent results are stored and displayed in the expected order.

## Tracking notes

- Update this file at the end of each phase.
- Mark checklist items instead of rewriting the whole plan.
- Keep later ideas separate from the current learning path.

## Later follow-up ideas

After these phases are complete, the next learning steps can be:
- connect the live holiday API
- convert the app to TypeScript
- replace the built-in store with Redux
- add deployment updates for the React app