# Project Guidelines

## Project Overview

This project is a specialized proxy service application built with NestJS and TypeScript, designed primarily for online gaming platforms. The proxy service intercepts HTTP requests, forwards them to target servers, and modifies both requests and responses to maintain proxy functionality.

### Key Features

- **Proxy Routing**: Intercepts HTTP requests and forwards them to target servers
- **Content Modification**: Modifies request/response headers and content
- **URL Rewriting**: Rewrites URLs to maintain proxy functionality
- **Geolocation Support**: Uses MaxMind GeoIP for geolocation-based routing
- **Session Management**: Tracks and manages user sessions
- **Provider-Specific Patches**: Implements specialized patches for different gaming providers (Pragmatic, Hacksaw, Push Gaming)
- **JavaScript Injection**: Injects code into HTML responses for network interception
- **Metrics Collection**: Tracks and logs proxy activity

### Project Structure

The project follows a modular NestJS architecture:

- **src/api**: Contains API modules
  - **proxy**: Main proxy module with controller and service
- **src/dto**: Data transfer objects and entities
- **src/tools**: Utility functions and shared code
- **src/front**: Frontend component built with Vite
- **dist**: Compiled output
- **geo**: Geolocation database files

## TypeScript General Guidelines

### Basic Principles

- Use English for all code and documentation.
- Always declare the type of each variable and function (parameters and return value).
  - Avoid using any.
  - Create necessary types.
- Use JSDoc to document public classes and methods.
- Don't leave blank lines within a function.
- One export per file.

### Nomenclature

- Use PascalCase for classes.
- Use camelCase for variables, functions, and methods.
- Use kebab-case for file and directory names.
- Use UPPERCASE for environment variables.
  - Avoid magic numbers and define constants.
- Start each function with a verb.
- Use verbs for boolean variables. Example: isLoading, hasError, canDelete, etc.
- Use complete words instead of abbreviations and correct spelling.
  - Except for standard abbreviations like API, URL, etc.
  - Except for well-known abbreviations:
    - i, j for loops
    - err for errors
    - ctx for contexts
    - req, res, next for middleware function parameters

### Functions

- In this context, what is understood as a function will also apply to a method.
- Write short functions with a single purpose. Less than 20 instructions.
- Name functions with a verb and something else.
  - If it returns a boolean, use isX or hasX, canX, etc.
  - If it doesn't return anything, use executeX or saveX, etc.
- Avoid nesting blocks by:
  - Early checks and returns.
  - Extraction to utility functions.
- Use higher-order functions (map, filter, reduce, etc.) to avoid function nesting.
  - Use arrow functions for simple functions (less than 3 instructions).
  - Use named functions for non-simple functions.
- Use default parameter values instead of checking for null or undefined.
- Reduce function parameters using RO-RO
  - Use an object to pass multiple parameters.
  - Use an object to return results.
  - Declare necessary types for input arguments and output.
- Use a single level of abstraction.

### Data

- Don't abuse primitive types and encapsulate data in composite types.
- Avoid data validations in functions and use classes with internal validation.
- Prefer immutability for data.
  - Use readonly for data that doesn't change.
  - Use as const for literals that don't change.

### Classes

- Follow SOLID principles.
- Prefer composition over inheritance.
- Declare interfaces to define contracts.
- Write small classes with a single purpose.
  - Less than 200 instructions.
  - Less than 10 public methods.
  - Less than 10 properties.

### Exceptions

- Use exceptions to handle errors you don't expect.
- If you catch an exception, it should be to:
  - Fix an expected problem.
  - Add context.
  - Otherwise, use a global handler.

### Testing

- Follow the Arrange-Act-Assert convention for tests.
- Name test variables clearly.
  - Follow the convention: inputX, mockX, actualX, expectedX, etc.
- Write unit tests for each public function.
  - Use test doubles to simulate dependencies.
    - Except for third-party dependencies that are not expensive to execute.
- Write acceptance tests for each module.
  - Follow the Given-When-Then convention.

## Specific to NestJS

### Architecture and Code Organization

- **Adopt Modular Design**: Organize your application into modules to promote separation of concerns.
  - One module per main domain/route.
  - Use dynamic modules for configurable behaviors and lazy loading to optimize performance in large apps.
  - Avoid the "Big Ball of Mud" anti-pattern by limiting module dependencies.
  - Use global modules sparingly for shared utilities like configuration or logging.

- **Implement Clean Architecture Layers**:
  - Presentation layer: Controllers, guards, interceptors
  - Application layer: Services, use cases
  - Domain layer: Entities, business logic
  - Infrastructure layer: Repositories, adapters
  - This decouples business logic from frameworks, making it easier to test and migrate.
  - Use dependency inversion to inject interfaces rather than concrete implementations.

- **Domain-Driven Design (DDD)**: For complex domains, apply DDD principles:
  - Aggregates, entities, value objects, and repositories
  - Bounded contexts to break down monoliths into microservices
  - NestJS supports this natively with decorators

- **Module Structure**:
  - One controller for its route (and other controllers for secondary routes).
  - A models folder with data types.
    - DTOs validated with class-validator for inputs.
    - Declare simple types for outputs.
  - A services module with business logic and persistence.
    - Entities with MikroORM/TypeORM for data persistence.
    - One service per entity.
  - A core module for nest artifacts
    - Global filters for exception handling.
    - Global middlewares for request management.
    - Guards for permission management.
    - Interceptors for request management.
  - A shared module for services shared between modules.
    - Utilities
    - Shared business logic

### API Design and Development

- **REST API Best Practices**:
  - Use versioning (e.g., `/v1/users`)
  - Consistent error responses (HTTP status codes with JSON payloads)
  - Pagination for large datasets
  - Implement rate limiting and CORS properly
  - For advanced scenarios, use patterns like HATEOAS for self-discoverable APIs

- **GraphQL and WebSockets**:
  - Integrate GraphQL for flexible querying or WebSockets for real-time features
  - Combine with REST in hybrid setups
  - Use schema-first design for GraphQL to avoid over-fetching

- **Validation and DTOs**:
  - Always use class-validator and class-transformer for input validation
  - Define DTOs (Data Transfer Objects) for requests/responses to enforce types and strip sensitive data

- **Authentication and Authorization**:
  - Use JWT with Passport.js for stateless auth
  - Implement RBAC (Role-Based Access Control) via guards and interceptors
  - For security, rotate tokens and use refresh mechanisms

### Error Handling and Logging

- **Centralized Error Handling**:
  - Use exception filters to catch and standardize errors globally
  - Include context like stack traces, request IDs, and user info in logs for better debugging
  - NestJS's built-in HttpException is a good starting point, but extend it for custom error types

- **Logging and Monitoring**:
  - Integrate Winston or Pino for structured logging
  - Use tools like ELK Stack (Elasticsearch, Logstash, Kibana) or Sentry for monitoring in large apps
  - Log at appropriate levels (debug, info, error) and correlate logs with traces in distributed systems

### Performance and Scalability

- **Caching Strategies**:
  - Use Redis or in-memory caching for frequent queries
  - Implement cache invalidation patterns like write-through or cache-aside to maintain data consistency

- **Microservices Migration**:
  - Start with a monolith and split into microservices using a single API Gateway (e.g., NestJS Gateway)
  - Use message queues like Kafka or RabbitMQ for inter-service communication
  - Focus on domain boundaries to avoid tight coupling

- **Optimization Patterns**:
  - Leverage design patterns like Singleton for shared resources, Factory for dynamic object creation
  - Use Observer for event-driven flows, and Strategy for interchangeable algorithms
  - Use clustering for multi-core utilization and PM2 for production deployment

### Security and Maintainability

- **Security Best Practices**:
  - Sanitize inputs
  - Use helmet for HTTP headers
  - Rate-limit endpoints
  - For databases, use ORM like TypeORM or Prisma to prevent SQL injection

- **TypeScript Leverage**:
  - Enforce strict typing
  - Use constants as constant objects instead of enums if possible
  - Avoid `any` types to reduce runtime errors in large codebases

### Testing

- **Comprehensive Testing**:
  - Use the standard Jest framework for testing
  - Write unit tests for services
  - Write integration tests for modules
  - Write E2E tests for APIs
  - Aim for 80%+ coverage, mocking dependencies where needed
  - Follow the Arrange-Act-Assert convention for tests
  - Add a admin/test method to each controller as a smoke test

- **API Documentation**:
  - Use Swagger (via @nestjs/swagger) for interactive docs
  - Enhance with rich HTML descriptions, dynamic JSON examples
  - Auto-generate Postman collections

- **CI/CD Integration**:
  - Set up pipelines with GitLub Actions for automated testing, linting (ESLint/Prettier), and deployment
