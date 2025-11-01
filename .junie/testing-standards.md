# Testing Standards

Testing patterns and coverage targets. See [design-principles.md](design-principles.md).

## Core Principles

- **Framework**: Jest
- **Convention**: Arrange-Act-Assert (AAA)
- **Coverage**: 80%+ (unit 90%+, integration 80%+, E2E 70%+)
- **Naming**: `inputX`, `mockX`, `actualX`, `expectedX`
- **Smoke Test**: Add `admin/test` endpoint to each controller

## Test Structure (AAA)

```typescript
describe('ServiceClass', () => {
  it('should handle success case', async () => {
    // Arrange
    const inputData = { name: 'John' };
    const expectedResult = { id: 1, name: 'John' };

    // Act
    const actualResult = await service.method(inputData);

    // Assert
    expect(actualResult).toEqual(expectedResult);
  });
});
```

## Test Types

| Type        | Purpose        | Tool              | Coverage      |
| ----------- | -------------- | ----------------- | ------------- |
| Unit        | Business logic | Jest              | 90%+          |
| Integration | API endpoints  | Jest + Supertest  | 80%+          |
| E2E         | Critical paths | Jest + Playwright | 70%+          |
| Contract    | External APIs  | Jest + Schema     | 70%+          |
| Performance | Benchmarks     | Jest + perf API   | Critical only |
| Snapshot    | Config objects | Jest              | 100%          |

## Advanced Patterns

### Property-Based Testing

```typescript
import fc from 'fast-check';
fc.assert(
  fc.property(fc.array(fc.integer()), (arr) => {
    expect(sort(arr)).toHaveLength(arr.length);
  }),
);
```

### Contract Testing

```typescript
it('should match API schema', async () => {
  const response = await api.getData();
  expect(response).toMatchSchema(expectedSchema);
});
```

### Performance Testing

```typescript
it('should process within 1s', async () => {
  const start = performance.now();
  await service.process(data);
  expect(performance.now() - start).toBeLessThan(1000);
});
```

### Integration DB

```typescript
beforeEach(async () => {
  await testDb.clean();
  await testDb.seed(testData);
});
```

## Test Doubles

- **Mock**: Replace with test object
- **Stub**: Return predefined data
- **Spy**: Track calls
- **Fake**: Simplified implementation

**Avoid mocking**: Third-party deps that are fast/cheap to execute.

## CI/CD Integration

```yaml
test:
  script:
    - npm run check:types
    - npm run lint:check
    - npm test
```

[typescript-guidelines.md](typescript-guidelines.md) | [nestjs-architecture.md](nestjs-architecture.md) | [quick-reference.md](quick-reference.md) | [post-code-workflow.md](post-code-workflow.md)
