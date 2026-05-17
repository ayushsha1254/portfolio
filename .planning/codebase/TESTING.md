# Testing Patterns
*Last mapped: 2026-05-17*

## Summary

**No meaningful tests exist.** CRA boilerplate test file only. Zero coverage of application logic.

## Test Framework

| Tool | Version | Notes |
|------|---------|-------|
| Jest | via CRA (react-scripts) | Bundled, no separate config |
| @testing-library/react | via CRA | Included but unused |
| @testing-library/user-event | via CRA | Included but unused |
| @testing-library/jest-dom | via CRA | Included in `setupTests.js` |

## Existing Tests

### `src/App.test.js` (boilerplate — stale, will fail)

```js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

This test is the unmodified CRA starter. It will fail because:
- App no longer renders "learn react" text
- App uses Redux Provider — test would need a store wrapper
- App initializes `localStorage` reads on mount — needs mock

## Setup File

`src/setupTests.js` — standard CRA setup, imports `@testing-library/jest-dom` matchers only.

## What Needs Mocking (for any real tests)

| Dependency | Mock approach |
|-----------|--------------|
| Redux store | Wrap with `<Provider store={testStore}>` |
| `localStorage` | `jest.spyOn(window.localStorage, 'getItem')` |
| `axios` instance | `jest.mock('../Utility/Axios/axios')` |
| Lottie animations | `jest.mock('lottie-react')` |
| Canvas/WebGL (Globe) | `jest.mock` or skip in jsdom |
| `window.alert` | `jest.spyOn(window, 'alert')` |

## Most Testable Units (start here)

1. **`src/Utility/state/toggle.js`** — Pure reducer, no side effects. Easy to unit test all 6 action types.
2. **`src/Utility/state/action.js`** — Action creator output assertions.
3. **`src/Utility/chars.js`**, **`circle.js`** — Pure utility functions.
4. **`src/Components/Explorer/` panel components** — Mostly presentational, easy to snapshot.

## Coverage

**Current: 0%** (no tests run against application code)

## To Run Tests

```bash
npm test
```

Will execute only `App.test.js` — expect failure due to missing Redux Provider wrapper and stale assertion.
