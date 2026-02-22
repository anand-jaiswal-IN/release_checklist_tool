# Testing Guide

This document provides comprehensive information about testing the Release Checklist Tool.

## Overview

The project includes comprehensive tests for both frontend and backend:

- **Backend Tests**: API integration tests and database tests using Bun's test runner
- **Frontend Tests**: Component tests, service tests, and integration tests using Vitest and React Testing Library

## Backend Testing

### Test Files

- `backend/src/__tests__/releases.test.ts` - API endpoint integration tests
- `backend/src/__tests__/database.test.ts` - Database operations tests

### Running Backend Tests

```bash
cd backend

# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Run specific test file
bun test src/__tests__/releases.test.ts
```

### Backend Test Coverage

The backend tests cover:

#### API Endpoints
- ✅ GET /api/releases - Fetch all releases
- ✅ GET /api/releases/:id - Fetch single release
- ✅ POST /api/releases - Create new release
- ✅ PUT /api/releases/:id - Update release
- ✅ DELETE /api/releases/:id - Delete release
- ✅ GET /health - Health check

#### Database Operations
- ✅ INSERT operations with JSONB fields
- ✅ SELECT queries with filtering
- ✅ UPDATE operations (partial and full)
- ✅ DELETE operations
- ✅ Data integrity and validation

#### Error Handling
- ✅ 404 Not Found responses
- ✅ Invalid ID formats
- ✅ Missing required fields
- ✅ Database constraint violations

### Prerequisites for Backend Tests

1. **Database**: PostgreSQL must be running
2. **Environment**: DATABASE_URL must be configured
3. **Server**: Backend server should be running on `http://localhost:5000`

To run tests:

````bash
# Terminal 1: Start the backend server
cd backend
bun run dev

# Terminal 2: Run tests
cd backend
bun test
```

## Frontend Testing

### Test Files

```
frontend/src/
├── components/
│   ├── __tests__/
│   │   ├── Home.test.tsx
│   │   ├── Releases.test.tsx
│   │   ├── NewRelease.test.tsx
│   │   └── ViewRelease.test.tsx
│   └── common/
│       └── __tests__/
│           └── BreadcrumbNav.test.tsx
├── services/
│   └── __tests__/
│       └── api.test.ts
└── test/
    ├── setup.ts
    ├── mockData.ts
    └── integration.test.ts
```

### Running Frontend Tests

```bash
cd frontend

# Run all tests
bun test

# Run tests in UI mode
bun test:ui

# Run tests with coverage
bun test:coverage

# Run specific test file
bun test src/components/__tests__/Home.test.tsx

# Run tests in watch mode (default)
bun test
```

### Frontend Test Coverage

#### Component Tests
- ✅ **Home Component**
  - Renders heading and navigation
  - Displays "New Release" button
  - Renders Releases component

- ✅ **Releases Component**
  - Fetches and displays releases
  - Shows loading state
  - Handles errors
  - Displays status chips (Planned/Ongoing/Done)
  - Shows progress percentages
  - Delete functionality

- ✅ **NewRelease Component**
  - Form rendering and validation
  - Checklist item toggling
  - Form submission
  - Progress calculation
  - Error handling
  - Loading states

- ✅ **ViewRelease Component**
  - Release details display
  - Edit mode functionality
  - Save/Cancel operations
  - Delete confirmation dialog
  - Checklist updates
  - Progress tracking

- ✅ **BreadcrumbNav Component**
  - Breadcrumb rendering
  - Active/inactive states
  - Navigation links

#### Service Tests
- ✅ **API Service**
  - calculateReleaseStatus function
  - getAllReleases
  - getReleaseById
  - createRelease
  - updateRelease
  - deleteRelease
  - Error handling
  - Network error handling

#### Integration Tests
- ✅ Full release lifecycle (Create → Read → Update → Delete)
- ✅ Status calculation flows
- ✅ Error handling scenarios

### Test Configuration

Frontend tests use:
- **Vitest** - Test runner
- **React Testing Library** - Component testing
- **jsdom** - Browser environment simulation
- **@testing-library/user-event** - User interaction simulation

Configuration file: `frontend/vitest.config.ts`

## Test Utilities

### Mock Data

The `frontend/src/test/mockData.ts` file provides:
- `mockRelease` - Single release object for testing
- `mockReleases` - Array of releases with different statuses

### Test Setup

The `frontend/src/test/setup.ts` file configures:
- Global test utilities (jest-dom matchers)
- Cleanup after each test
- Environment variable mocking
- `window.matchMedia` mock for Material-UI

## Writing New Tests

### Backend Test Example

```typescript
import { describe, test, expect } from "bun:test";

describe("My API Endpoint", () => {
  test("should return expected data", async () => {
    const response = await fetch("http://localhost:5000/api/endpoint");
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
```

### Frontend Component Test Example

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(
      <BrowserRouter>
        <MyComponent />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Best Practices

### General
1. Write tests alongside features
2. Test behavior, not implementation
3. Keep tests focused and isolated
4. Use descriptive test names
5. Clean up after tests (especially database operations)

### Backend Tests
1. Use beforeAll/afterAll for setup/cleanup
2. Test both success and error cases
3. Verify API response structure
4. Test database constraints
5. Mock external dependencies

### Frontend Tests
1. Use data-testid for complex queries
2. Prefer user-centric queries (getByRole, getByLabelText)
3. Test user interactions with userEvent
4. Mock API calls in component tests
5. Wait for async operations with waitFor
6. Clean up React components with cleanup()

## Continuous Integration

### Pre-commit Checks

```bash
# Backend
cd backend
bun test

# Frontend
cd frontend
bun test
bun run lint
```

### CI Pipeline Example

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: cd backend && bun install
      - run: cd backend && bun test
  
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: cd frontend && bun install
      - run: cd frontend && bun test
```

## Debugging Tests

### Backend
```bash
# Run specific test with verbose output
bun test --verbose src/__tests__/releases.test.ts

# Run single test case
bun test --test-name-pattern "should create a new release"
```

### Frontend
```bash
# Run with UI for interactive debugging
bun test:ui

# Run with coverage to see untested code
bun test:coverage

# Debug specific test
bun test src/components/__tests__/Home.test.tsx
```

## Test Coverage Goals

- **Backend**: Aim for >80% coverage of controllers and routes
- **Frontend**: Aim for >70% coverage of components and services
- **Critical Paths**: 100% coverage for authentication, data validation, and CRUD operations

## Common Issues

### Backend
- **Database connection errors**: Ensure PostgreSQL is running
- **Port conflicts**: Check if port 5000 is available
- **Migration issues**: Run `bun run db:push` before tests

### Frontend
- **Module not found**: Install missing dependencies with `bun install`
- **Router errors**: Wrap components in `<BrowserRouter>`
- **Async errors**: Use `waitFor` for async operations
- **Material-UI warnings**: Check mock setup in `test/setup.ts`

## Resources

- [Bun Test Documentation](https://bun.sh/docs/cli/test)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Integration Test Notes

Integration tests require the backend server to be running. Set `TEST_BACKEND=true` environment variable to run integration tests:

```bash
# Run integration tests with live backend
TEST_BACKEND=true bun test src/test/integration.test.ts
```

Without this flag, integration tests will be skipped.
````
