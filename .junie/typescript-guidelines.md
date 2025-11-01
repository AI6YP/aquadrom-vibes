# TypeScript Guidelines

TypeScript coding standards. See [design-principles.md](design-principles.md) for SOLID/DRY/KISS.

## Basic Rules

- English only
- Strict typing (`strict: true`)
- Avoid `any` (create types)
- JSDoc for public classes/methods
- No blank lines within functions
- One export per file

## Naming

| Type                | Convention           | Example                              |
| ------------------- | -------------------- | ------------------------------------ |
| Classes             | PascalCase           | `UserService`                        |
| Variables/Functions | camelCase            | `getUserById`                        |
| Files/Directories   | kebab-case           | `user-service.ts`                    |
| Environment Vars    | UPPERCASE            | `SERVER_HOST`                        |
| Constants           | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT`                    |
| Booleans            | Verb prefix          | `isLoading`, `hasError`, `canDelete` |

**Abbreviations**: i/j (loops), err (errors), ctx (contexts), req/res/next (middleware)

## Functions

- **Length**: <20 instructions
- **Naming**: Verb + noun (`executeQuery`, `saveUser`)
- **Booleans**: `isX`, `hasX`, `canX`
- **Early returns**: Avoid nesting
- **Single responsibility**: One purpose per function
- **RO-RO**: Receive object, return object for multiple params/returns

```typescript
// Good
function createUser(params: { name: string; email: string }): {
  id: number;
  name: string;
} {
  if (!params.name) return { id: 0, name: '' };
  return { id: 1, name: params.name };
}

// Avoid
function createUser(
  name: string,
  email: string,
  age: number,
  role: string,
): any {
  // Multiple params, no types, returns any
}
```

## Data

- Encapsulate in composite types
- Use classes with internal validation
- Prefer immutability (`readonly`, `as const`)
- Avoid primitive obsession

```typescript
// Good
type UserId = string & { readonly __brand: 'UserId' };
readonly config: { timeout: number } as const;

// Avoid
let userId: string;
config.timeout = 500; // Mutable
```

## Classes

- **SOLID principles** → [design-principles.md](design-principles.md)
- **Composition > Inheritance**
- **Interfaces** for contracts
- **Size**: <200 instructions, <10 public methods, <10 properties

## Exceptions

- Use for **unexpected** errors only
- Catch to: fix expected problems, add context, or use global handler
- Don't catch and ignore

## Advanced Patterns

```typescript
// Branded Types (domain values)
type Email = string & { readonly __brand: 'Email' };

// Discriminated Unions (type-safe state)
type ApiResponse<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// Template Literals (API endpoints)
type ApiEndpoint = `/api/v${number}/${string}`;

// Conditional Types (generic constraints)
type NonNullable<T> = T extends null | undefined ? never : T;

// Mapped Types (DTO transformations)
type CreateUserDto = Omit<User, 'id' | 'createdAt'>;
type UpdateUserDto = Partial<Pick<User, 'name' | 'email'>>;

// Result Pattern (error handling)
type Result<T, E = Error> = Success<T> | Failure<E>;
```

## Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node"
  }
}
```

- Prefer **const objects** over enums
- Enable all strict flags

[nestjs-architecture.md](nestjs-architecture.md) | [nestjs-examples.md](nestjs-examples.md) | [testing-standards.md](testing-standards.md) | [quick-reference.md](quick-reference.md) | [design-principles.md](design-principles.md)
