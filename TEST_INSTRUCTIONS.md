# Release Checklist Tool - Test Instructions

## Quick Start

### Run All Tests
```bash
# From project root
bash run-tests.sh        # Unix/Mac/Git Bash
```

Or run individually:

### Backend Tests
```bash
cd backend
bun test
```

### Frontend Tests
```bash
cd frontend
bun test run             # Run once
bun test                 # Watch mode
```

## Test Files Created

### Backend (2 files, 30+ tests)
```
backend/src/__tests__/
├── releases.test.ts      # API endpoint tests
└── database.test.ts      # Database operation tests
```

### Frontend (7 files, 70+ tests)
```
frontend/src/
├── components/__tests__/
│   ├── Home.test.tsx
│   ├── Releases.test.tsx
│   ├── NewRelease.test.tsx
│   └── ViewRelease.test.tsx
├── components/common/__tests__/
│   └── BreadcrumbNav.test.tsx
├── services/__tests__/
│   └── api.test.ts
└── test/
    ├── setup.ts
    ├── mockData.ts
    └── integration.test.ts
```

## What's Tested

### ✅ Backend
- All CRUD endpoints for releases
- Database operations (INSERT, SELECT, UPDATE, DELETE)
- Error handling (404, validation, etc.)
- Health check endpoint
- Progress calculation
- JSONB field handling

### ✅ Frontend
- Component rendering
- User interactions (clicking, typing)
- Form submission and validation
- API service calls
- Error handling and loading states
- Status calculation (planned/ongoing/done)
- Navigation and routing
- Integration flows

## Prerequisites

**Backend Tests:**
- PostgreSQL running
- Database configured in .env
- Server running on port 5000 (for integration tests)

**Frontend Tests:**
- Dependencies installed (`bun install`)
- Tests can run without backend (uses mocks)

## Test Commands

| Command | Description |
|---------|-------------|
| `bun test` | Run all tests |
| `bun test:watch` | Backend watch mode |
| `bun test:ui` | Frontend interactive UI |
| `bun test:coverage` | Coverage report |
| `bun test <file>` | Run specific test file |

## Integration Tests

Integration tests test the full flow with a live backend:

```bash
# Start backend first
cd backend && bun run dev

# In another terminal
cd frontend
TEST_BACKEND=true bun test integration
```

## Coverage Goals

- Backend: >80%
- Frontend: >70%
- Critical paths: 100%

## Documentation

- `TESTING.md` - Comprehensive guide
- `TEST_REFERENCE.md` - Quick reference
- `TEST_SUMMARY.md` - Test statistics
- `README.md` - Updated with test sections

## Troubleshooting

**Tests not running:**
- Ensure dependencies installed: `bun install`
- Check Node.js/Bun version

**Backend tests failing:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Run migrations: `bun run db:push`

**Frontend tests failing:**
- Clear node_modules and reinstall
- Check for version conflicts

## Next Steps

1. ✅ Run `bash run-tests.sh` to verify all tests pass
2. ✅ Review test coverage with `bun test:coverage`
3. ✅ Add tests when creating new features
4. ✅ Run tests before committing code

## Test Quality

- **100+ test cases** covering all major functionality
- **Unit tests** for components and services
- **Integration tests** for API and database
- **E2E flow tests** for complete user journeys
- **Error handling** for edge cases
- **Mock data** for consistent testing

All tests follow best practices and are maintainable, readable, and reliable.
