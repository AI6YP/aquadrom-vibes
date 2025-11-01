# Design Principles

This document defines core design principles and patterns for code quality, maintainability, and architectural excellence.

## Overview

All code must follow these fundamental principles:

- **DRY** (Don't Repeat Yourself)
- **KISS** (Keep It Simple, Stupid)
- **YAGNI** (You Aren't Gonna Need It)
- **SOLID** (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion)

## DRY (Don't Repeat Yourself)

**Core Principle:** Every piece of knowledge should have a single, unambiguous representation in the system.

### Detection Patterns

- **Code duplication**: Same or similar code blocks in multiple locations
- **Logic duplication**: Different implementations of the same business logic
- **Configuration duplication**: Repeated values, constants, or settings
- **Structure duplication**: Similar class/function patterns across modules

### Application Strategies

1. **Extract to Functions/Methods**

   ```typescript
   // Before (Duplication)
   const userAge = new Date().getFullYear() - user.birthYear;
   const adminAge = new Date().getFullYear() - admin.birthYear;

   // After (DRY)
   const calculateAge = (birthYear: number) =>
     new Date().getFullYear() - birthYear;
   const userAge = calculateAge(user.birthYear);
   const adminAge = calculateAge(admin.birthYear);
   ```

2. **Configuration Centralization**

   ```typescript
   // Before (Repeated values)
   const timeout1 = 5000;
   const timeout2 = 5000;

   // After (Centralized)
   const CONFIG = { DEFAULT_TIMEOUT: 5000 };
   const timeout1 = CONFIG.DEFAULT_TIMEOUT;
   const timeout2 = CONFIG.DEFAULT_TIMEOUT;
   ```

3. **Template/Generic Patterns**

   ```typescript
   // Before (Repeated patterns)
   interface UserRepository {
     findById(id: string): User;
     save(user: User): void;
   }
   interface ProductRepository {
     findById(id: string): Product;
     save(product: Product): void;
   }

   // After (Generic)
   interface Repository<T> {
     findById(id: string): T;
     save(entity: T): void;
   }
   ```

4. **Shared Utilities**

- Extract common validation logic
- Create reusable formatters and parsers
- Build shared error handling utilities
- Develop common transformation functions

### When to Duplicate

Sometimes duplication is acceptable:

- **Different contexts**: Similar code serving different purposes
- **Independent evolution**: Code that will change for different reasons
- **Clear boundaries**: Across bounded contexts or services
- **Premature abstraction**: When the pattern isn't clear yet

## KISS (Keep It Simple, Stupid)

**Core Principle:** Simplicity should be a key goal in design; unnecessary complexity should be avoided.

### Complexity Indicators

- Functions > 20 lines
- Nested logic > 3 levels deep
- Cyclomatic complexity > 10
- Multiple return paths for unclear reasons
- Clever tricks instead of straightforward logic

### Simplification Strategies

1. **Break Down Complex Functions**

   ```typescript
   // Before (Complex)
   function processUser(user: User) {
     // 50 lines of mixed responsibilities
     // validation, transformation, persistence, notification
   }

   // After (Simple, focused)
   function processUser(user: User) {
     const validated = validateUser(user);
     const transformed = transformUser(validated);
     persistUser(transformed);
     notifyUser(transformed);
   }
   ```

2. **Reduce Nesting**

   ```typescript
   // Before (Deep nesting)
   if (user) {
     if (user.isActive) {
       if (user.hasPermission) {
         // do something
       }
     }
   }

   // After (Early returns)
   if (!user || !user.isActive || !user.hasPermission) {
     return;
   }
   // do something
   ```

3. **Clear Over Clever**

   ```typescript
   // Before (Clever but obscure)
   const result = arr.reduce(
     (a, b) => [...a, ...b.items.map((i) => ({ ...i, parent: b.id }))],
     [],
   );

   // After (Clear and readable)
   const result = [];
   for (const parent of arr) {
     for (const item of parent.items) {
       result.push({ ...item, parent: parent.id });
     }
   }
   ```

4. **Straightforward Logic**

- Use clear variable names
- Avoid boolean flags that control multiple behaviors
- Prefer explicit over implicit
- Document only non-obvious logic

### Guidelines

- Prefer readability over brevity
- Use standard patterns over custom solutions
- Avoid premature optimization
- Question complexity: "Is there a simpler way?"

## YAGNI (You Aren't Gonna Need It)

**Core Principle:** Don't implement functionality until it's actually needed.

### Red Flags

- "We might need this later"
- "This could be useful someday"
- Implementing features not in current requirements
- Over-generalized solutions for specific problems
- Extensive configuration for single use case

### Application Guidelines

1. **Implement for Current Requirements**

   ```typescript
   // Before (Over-engineered)
   interface PaymentProcessor {
     processPayment(amount: number): Promise<void>;
     processRefund(amount: number): Promise<void>;
     processPartialRefund(amount: number): Promise<void>;
     schedulePayment(amount: number, date: Date): Promise<void>;
     // ... 10 more methods we don't use
   }

   // After (Only what's needed)
   interface PaymentProcessor {
     processPayment(amount: number): Promise<void>;
   }
   ```

2. **Avoid Speculative Generalization**

   ```typescript
   // Before (Unnecessary abstraction)
   class ConfigurableValidator<T, R, E> {
     // Complex generic solution for single use case
   }

   // After (Simple, specific)
   class UserValidator {
     validate(user: User): ValidationResult {
       // Straightforward validation
     }
   }
   ```

3. **Remove Dead Code**

- Delete unused functions and classes
- Remove commented-out code
- Eliminate unreachable code paths
- Clean up unused imports and dependencies

### When to Prepare

Acceptable forward-thinking:

- **Known immediate future**: Feature planned for next sprint
- **Interface stability**: Public APIs needing stability
- **Technical debt prevention**: Avoiding costly refactoring
- **Performance requirements**: Measured bottlenecks

## SOLID Principles

### S - Single Responsibility Principle (SRP)

**Principle:** A class should have one, and only one, reason to change.

**Detection:**

- Class name has "and" or "manager"
- Method names indicate multiple concerns
- Changes in different features affect same class
- Difficult to name the class clearly

**Example:**

```typescript
// Before (Multiple responsibilities)
class UserService {
  validateUser(user: User) {
    /* ... */
  }
  saveToDatabase(user: User) {
    /* ... */
  }
  sendWelcomeEmail(user: User) {
    /* ... */
  }
  generateReport(user: User) {
    /* ... */
  }
}

// After (Single responsibility)
class UserValidator {
  validate(user: User): ValidationResult {
    /* ... */
  }
}

class UserRepository {
  save(user: User): Promise<void> {
    /* ... */
  }
}

class EmailService {
  sendWelcome(user: User): Promise<void> {
    /* ... */
  }
}

class ReportGenerator {
  generate(user: User): Report {
    /* ... */
  }
}
```

### O - Open/Closed Principle (OCP)

**Principle:** Software entities should be open for extension but closed for modification.

**Detection:**

- Modifying existing code to add new behavior
- Long switch/if-else chains for types
- Direct instantiation of concrete classes
- Hard to add new features without changing existing code

**Example:**

```typescript
// Before (Requires modification)
class PaymentProcessor {
  process(type: string, amount: number) {
    if (type === 'credit') {
      // credit card logic
    } else if (type === 'paypal') {
      // paypal logic
    } else if (type === 'crypto') {
      // crypto logic - requires modifying this file
    }
  }
}

// After (Open for extension)
interface PaymentMethod {
  process(amount: number): Promise<void>;
}

class CreditCardPayment implements PaymentMethod {
  process(amount: number): Promise<void> {
    /* ... */
  }
}

class PayPalPayment implements PaymentMethod {
  process(amount: number): Promise<void> {
    /* ... */
  }
}

class PaymentProcessor {
  constructor(private method: PaymentMethod) {}

  process(amount: number): Promise<void> {
    return this.method.process(amount);
  }
}
```

### L - Liskov Substitution Principle (LSP)

**Principle:** Derived classes must be substitutable for their base classes.

**Detection:**

- Subclass throws "not supported" exceptions
- Override methods change expected behavior
- Subclass requires more preconditions
- Subclass provides fewer postconditions

**Example:**

```typescript
// Before (Violates LSP)
class Bird {
  fly(): void {
    /* ... */
  }
}

class Penguin extends Bird {
  fly(): void {
    throw new Error('Penguins cannot fly!');
  }
}

// After (Follows LSP)
interface Bird {
  move(): void;
}

class FlyingBird implements Bird {
  move(): void {
    this.fly();
  }
  private fly(): void {
    /* ... */
  }
}

class Penguin implements Bird {
  move(): void {
    this.swim();
  }
  private swim(): void {
    /* ... */
  }
}
```

### I - Interface Segregation Principle (ISP)

**Principle:** Clients should not be forced to depend on interfaces they don't use.

**Detection:**

- Interfaces with many methods
- Implementing classes with empty methods
- "Fat" interfaces
- Clients using only subset of interface

**Example:**

```typescript
// Before (Fat interface)
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
  fileReport(): void;
}

class Robot implements Worker {
  work(): void {
    /* ... */
  }
  eat(): void {
    /* Robot doesn't eat! */
  }
  sleep(): void {
    /* Robot doesn't sleep! */
  }
  fileReport(): void {
    /* ... */
  }
}

// After (Segregated interfaces)
interface Workable {
  work(): void;
}

interface Reportable {
  fileReport(): void;
}

interface LivingBeing {
  eat(): void;
  sleep(): void;
}

class Robot implements Workable, Reportable {
  work(): void {
    /* ... */
  }
  fileReport(): void {
    /* ... */
  }
}

class Human implements Workable, Reportable, LivingBeing {
  work(): void {
    /* ... */
  }
  eat(): void {
    /* ... */
  }
  sleep(): void {
    /* ... */
  }
  fileReport(): void {
    /* ... */
  }
}
```

### D - Dependency Inversion Principle (DIP)

**Principle:** Depend on abstractions, not concretions.

**Detection:**

- Direct instantiation of concrete classes
- Tight coupling to specific implementations
- Hard to test due to concrete dependencies
- Changes in low-level modules affect high-level modules

**Example:**

```typescript
// Before (Depends on concretions)
class EmailService {
  constructor() {
    this.client = new SendGridClient(); // Direct dependency
  }

  send(to: string, message: string): void {
    this.client.sendEmail(to, message);
  }
}

// After (Depends on abstractions)
interface EmailClient {
  sendEmail(to: string, message: string): Promise<void>;
}

class SendGridClient implements EmailClient {
  sendEmail(to: string, message: string): Promise<void> {
    /* ... */
  }
}

class EmailService {
  constructor(private client: EmailClient) {} // Depends on interface

  send(to: string, message: string): Promise<void> {
    return this.client.sendEmail(to, message);
  }
}
```

## Code Review Checklist

### Pre-Change Validation

- Understand existing patterns and conventions
- Identify dependencies and affected areas
- Assess impact and risk of changes
- Consider simpler alternatives
- Check for similar existing solutions

### Post-Change Validation

- Verify DRY compliance (no unnecessary duplication)
- Confirm KISS compliance (no unnecessary complexity)
- Validate YAGNI compliance (only required features)
- Check SOLID compliance (all five principles)
- Ensure consistency with codebase patterns
- Verify adequate test coverage
- Update documentation if needed

## Refactoring Triggers

Refactor when you see:

- **Duplication**: Same logic in 3+ places
- **Long methods**: Functions > 30 lines
- **Large classes**: Classes > 300 lines or > 10 methods
- **Long parameter lists**: > 5 parameters
- **Deep nesting**: > 3 levels of indentation
- **Primitive obsession**: Using primitives instead of domain objects
- **Tight coupling**: Changing one class requires changing others
- **God objects**: Classes that know/do too much

## Implementation Patterns

### NestJS-Specific

**Service Organization (SRP):**

```typescript
// Each service has single responsibility
@Injectable()
class UserRepository {
  // Only data access
}

@Injectable()
class UserValidator {
  // Only validation
}

@Injectable()
class UserService {
  constructor(
    private repo: UserRepository,
    private validator: UserValidator,
  ) {}
}
```

**Dependency Injection (DIP):**

```typescript
// Depend on interfaces, not implementations
interface IUserRepository {
  findById(id: string): Promise<User>;
}

@Injectable()
class UserService {
  constructor(
    @Inject('IUserRepository')
    private repo: IUserRepository,
  ) {}
}
```

**Module Structure (ISP, OCP):**

```typescript
@Module({
  imports: [
    // Focused, single-purpose modules
    AuthModule,
    UserModule,
    NotificationModule,
  ],
})
export class AppModule {}
```

### TypeScript-Specific

**Interface Segregation:**

```typescript
// Multiple small interfaces
interface Readable {
  read(): Promise<Data>;
}

interface Writable {
  write(data: Data): Promise<void>;
}

// Compose as needed
class FileStore implements Readable, Writable {
  // ...
}
```

**Generic Constraints (DRY):**

```typescript
// Reusable with type safety
interface Repository<T extends Entity> {
  findById(id: string): Promise<T>;
  save(entity: T): Promise<void>;
}
```

**Type Composition (LSP):**

```typescript
// Prefer composition over inheritance
type WithTimestamps = {
  createdAt: Date;
  updatedAt: Date;
};

type User = WithTimestamps & {
  id: string;
  name: string;
};
```

## Prioritization Guidelines

When applying principles, follow this order:

1. **SRP First**: Ensure each class/function has one clear responsibility
2. **DRY Second**: Eliminate duplication through appropriate abstraction
3. **KISS Always**: Keep solutions as simple as possible
4. **OCP When Needed**: Design for extension in volatile areas
5. **LSP Carefully**: Validate inheritance hierarchies
6. **ISP Gradually**: Split interfaces when they become unwieldy
7. **DIP Strategically**: Use dependency injection for better testability

## Context-Aware Application

### Legacy Code

- Apply principles gradually
- Focus on new code and critical paths
- Refactor when touching existing code
- Don't rewrite working code for principle compliance alone

### Performance-Critical Code

- Balance principles with performance needs
- Measure before optimizing
- Document trade-offs
- Maintain readability even in optimized code

### Third-Party Integration

- Adapt principles to external constraints
- Use adapters to isolate external dependencies
- Keep integration code separate
- Document deviations from principles

### Team Considerations

- Consider team skill level
- Provide examples and guidance
- Gradual adoption over big-bang rewrites
- Code reviews for principle enforcement

## Anti-Patterns to Avoid

- **God Objects**: Classes that do everything
- **Anemic Domain Model**: Objects with no behavior, only data
- **Spaghetti Code**: Tangled, hard-to-follow logic
- **Big Ball of Mud**: No clear structure or organization
- **Premature Optimization**: Optimizing before measuring
- **Overengineering**: Complex solutions for simple problems
- **Not Invented Here**: Reinventing existing solutions
- **Copy-Paste Programming**: Duplicating code instead of abstracting

## Summary

**Key Takeaways:**

1. **DRY** reduces duplication and maintenance burden
2. **KISS** improves readability and reduces bugs
3. **YAGNI** prevents wasted effort and bloat
4. **SOLID** creates flexible, maintainable architectures

**Remember:**

- Principles are guidelines, not laws
- Context matters - be pragmatic
- Maintainability is the ultimate goal
- Simple, clear code beats clever code

**Cross-References:**

- [Software Architect Guidelines](prompt-software-architect.md)
- [NestJS Architecture Patterns](nestjs-architecture.md)
- [TypeScript Guidelines](typescript-guidelines.md)
- [Code Review Standards](operational-rules.md)
