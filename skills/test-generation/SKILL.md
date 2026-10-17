---
name: test-generation
description: Generates unit, integration, and e2e tests following best practices. Use when adding test coverage, creating test files, or improving existing tests.
---

# Test Generation Skill

## Testing Pyramid

```
        E2E Tests (few)
       /              \
  Integration Tests
 /                    \
Unit Tests (many)
```

## Unit Test Patterns

### AAA Pattern (Arrange-Act-Assert)
```typescript
describe("UserService", () => {
  it("should return user by id", async () => {
    // Arrange
    const mockRepo = createMockRepository();
    mockRepo.findById.mockResolvedValue(user);
    const service = new UserService(mockRepo);

    // Act
    const result = await service.getUser(1);

    // Assert
    expect(result).toEqual(user);
    expect(mockRepo.findById).toHaveBeenCalledWith(1);
  });
});
```

### Test Naming
```typescript
// Format: should_<expected behavior>_when_<condition>
it("should_return_user_when_id_exists", () => {});
it("should_throw_not_found_when_id_missing", () => {});
```

### Edge Cases to Cover
- Null/undefined inputs
- Empty collections
- Boundary values (0, -1, max int)
- Invalid formats
- Concurrency (race conditions)
- Timeouts/retries

## Integration Test Patterns

### Database Tests
```typescript
describe("UserRepository", () => {
  let db: TestDatabase;

  beforeAll(async () => {
    db = await TestDatabase.create();
    await db.migrate();
  });

  afterAll(async () => {
    await db.destroy();
  });

  beforeEach(async () => {
    await db.truncate("users");
  });

  it("should persist and retrieve user", async () => {
    const repo = new UserRepository(db);
    await repo.save(user);
    const found = await repo.findById(user.id);
    expect(found).toEqual(user);
  });
});
```

### API Tests
```typescript
describe("POST /api/users", () => {
  it("should create user and return 201", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ name: "John", email: "john@example.com" })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: "John",
      email: "john@example.com"
    });
  });
});
```

## E2E Test Patterns (Playwright)

```typescript
test("user can login and view dashboard", async ({ page }) => {
  await page.goto("/login");
  await page.fill('[name="email"]', "user@example.com");
  await page.fill('[name="password"]', "password123");
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("/dashboard");
  await expect(page.locator("h1")).toContainText("Dashboard");
});
```

## Test Utilities

### Factory Functions
```typescript
function createTestUser(overrides: Partial<User> = {}): User {
  return {
    id: "test-id",
    name: "Test User",
    email: "test@example.com",
    createdAt: new Date(),
    ...overrides
  };
}
```

### Mock Helpers
```typescript
function createMockRepository<T>() {
  return {
    findById: vi.fn<T, [string]>(),
    findAll: vi.fn<T[], []>(),
    save: vi.fn<Promise<void>, [T]>(),
    delete: vi.fn<Promise<void>, [string]>()
  };
}
```

## Coverage Targets

| Layer | Target | Notes |
|-------|--------|-------|
| Unit | 80%+ | Business logic, pure functions |
| Integration | 60%+ | DB, external APIs, message queues |
| E2E | 20%+ | Critical user journeys only |

## When to Use

- Adding tests for new features
- Improving coverage on existing code
- Creating test utilities/factories
- Setting up test infrastructure
- Converting manual tests to automated