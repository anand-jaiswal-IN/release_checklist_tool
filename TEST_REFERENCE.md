# Test Quick Reference

## 🚀 Quick Start

### Backend Tests
```bash
cd backend
bun test                 # Run all tests
bun test:watch          # Watch mode
```

### Frontend Tests
```bash
cd frontend
bun test                 # Run all tests (watch mode)
bun test:ui             # Interactive UI
bun test:coverage       # With coverage report
```

## 📊 Test Coverage

### Backend (Bun Test)
✅ **API Endpoints** (releases.test.ts)
- GET /api/releases
- GET /api/releases/:id
- POST /api/releases
- PUT /api/releases/:id
- DELETE /api/releases/:id
- GET /health

✅ **Database** (database.test.ts)
- INSERT operations
- SELECT queries
- UPDATE operations
- DELETE operations
- JSONB handling

### Frontend (Vitest + RTL)
✅ **Components**
- Home.test.tsx - Main page
- Releases.test.tsx - Table view
- NewRelease.test.tsx - Create form
- ViewRelease.test.tsx - Detail/Edit page
- BreadcrumbNav.test.tsx - Navigation

✅ **Services**
- api.test.ts - API client & status calculator

✅ **Integration**
- integration.test.ts - Full user flows

## 🎯 Test Commands

| Command | Description |
|---------|-------------|
| `bun test` | Run all tests |
| `bun test:watch` | Backend watch mode |
| `bun test:ui` | Frontend interactive UI |
| `bun test:coverage` | Coverage report |
| `bun test <file>` | Run specific file |

## 📝 Test File Locations

```
backend/src/__tests__/
├── releases.test.ts      # API tests
└── database.test.ts      # DB tests

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
    ├── setup.ts          # Test configuration
    ├── mockData.ts       # Mock data
    └── integration.test.ts
```

## ✅ Test Checklist

Before committing code:
- [ ] All backend tests pass
- [ ] All frontend tests pass
- [ ] No linting errors
- [ ] Tests added for new features
- [ ] Coverage meets requirements (>70%)

## 🔧 Prerequisites

**Backend:**
- PostgreSQL running
- `DATABASE_URL` configured
- Server running on port 5000

**Frontend:**
- Dependencies installed
- API mocked in tests

## 🐛 Debugging

**Backend:**
```bash
bun test --verbose
bun test --test-name-pattern "test name"
```

**Frontend:**
```bash
bun test:ui           # Interactive debugging
bun test <file>       # Single file
```

## 📈 Coverage Goals

- **Backend**: >80% (controllers, routes)
- **Frontend**: >70% (components, services)
- **Critical**: 100% (CRUD, validation)

## 🔗 Integration Tests

Run with live backend:
```bash
TEST_BACKEND=true bun test integration
```

## 📚 More Info

See [TESTING.md](./TESTING.md) for comprehensive documentation.
