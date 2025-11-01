# Quick Reference

Fast lookups for common tasks. See [prompt.md](prompt.md) for AI rules.

## Naming Conventions

| Type                | Convention | Example                 |
| ------------------- | ---------- | ----------------------- |
| Classes             | PascalCase | `UserService`           |
| Variables/Functions | camelCase  | `getUserById`           |
| Files/Directories   | kebab-case | `user-service.ts`       |
| Environment Vars    | UPPERCASE  | `SERVER_HOST`           |
| Booleans            | Verbs      | `isLoading`, `hasError` |

## Function Guidelines

- **Length**: <20 instructions
- **Naming**: Start with verb (`execute`, `save`, `validate`)
- **Params**: Use objects (RO-RO pattern)
- **Booleans**: `isX`, `hasX`, `canX`

## TypeScript Patterns

```typescript
// Branded Types
type UserId = string & { readonly __brand: 'UserId' };

// Discriminated Unions
type Result<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// Mapped Types
type CreateDto = Omit<User, 'id' | 'createdAt'>;
```

## Testing (AAA Pattern)

```typescript
it('should create user', async () => {
  // Arrange
  const inputData = { name: 'John' };

  // Act
  const result = await service.create(inputData);

  // Assert
  expect(result).toEqual(expectedUser);
});
```

**Coverage**: Unit 90%+ | Integration 80%+ | E2E 70%+

## Decision Matrix

| Need           | Solution           | When            |
| -------------- | ------------------ | --------------- |
| Data Access    | Repository Pattern | Complex ops     |
| Error Handling | Result Pattern     | Expected errors |
| Type Safety    | Branded Types      | Domain values   |
| Testing        | AAA Pattern        | All tests       |

## Mandatory Workflow

```bash
pnpm run check:types && pnpm run lint:check && pnpm run lint:fix && pnpm test
```

See [post-code-workflow.md](post-code-workflow.md).

## Common Commands

```bash
# Development
pnpm run start:dev
pnpm test
pnpm run test:watch

# Quality
pnpm run check:types
pnpm run lint:fix

# Database
pnpm run migrations:generate -- --name=YourMigration
pnpm run migrations:run
```

## File Structure

```
src/
├── admin-api/      # API modules
├── proxy-server/   # Proxy
├── tools/         # Utilities
│   ├── config/
│   ├── database/
│   └── logger/
└── migrations/    # DB migrations
```

[typescript-guidelines.md](typescript-guidelines.md) | [testing-standards.md](testing-standards.md) | [post-code-workflow.md](post-code-workflow.md) | [decision-matrices.md](decision-matrices.md)
