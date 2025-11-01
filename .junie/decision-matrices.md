# Decision Matrices

Quick reference tables for architectural choices.

## Module Patterns

| Scenario       | Pattern      | When             | Example     |
| -------------- | ------------ | ---------------- | ----------- |
| Global config  | `forRoot()`  | App-wide         | DB, logging |
| Feature        | `register()` | Feature-specific | User module |
| Shared utility | `forRoot()`  | Cross-cutting    | Logging     |
| Domain         | `@Module()`  | Business logic   | User mgmt   |

## Configuration

| Need     | Solution          | When       | Example            |
| -------- | ----------------- | ---------- | ------------------ |
| Env vars | Config Service    | Runtime    | DB URLs, API keys  |
| CLI args | CLI Config        | Dev/test   | Debug flags        |
| Defaults | Constants + Joi   | Fallbacks  | Ports, timeouts    |
| Complex  | Factory functions | Multi-step | Connection strings |

See [nestjs-examples.md](nestjs-examples.md) for code samples.

## Error Handling

| Type       | Pattern           | When           | Example           |
| ---------- | ----------------- | -------------- | ----------------- |
| Expected   | Result Pattern    | Business logic | Validation, rules |
| Unexpected | Exception Filters | System errors  | DB, network       |
| Config     | Validation + Fail | Startup        | Missing config    |
| Input      | DTO Validation    | API input      | Invalid email     |

## Testing

| Scenario       | Type        | Coverage      | When            |
| -------------- | ----------- | ------------- | --------------- |
| Business logic | Unit        | 90%+          | Services, utils |
| API endpoints  | Integration | 80%+          | Controllers     |
| Database       | Integration | 85%+          | Repositories    |
| External APIs  | Contract    | 70%+          | Third-party     |
| Performance    | Benchmark   | Critical only | High-traffic    |

## Mocking

| Dependency    | Strategy     | When        | Example              |
| ------------- | ------------ | ----------- | -------------------- |
| Database      | Test DB      | Integration | PostgreSQL container |
| External APIs | Mock Service | Unit        | HTTP mocks           |
| File System   | In-Memory    | File ops    | Log testing          |
| Time/Date     | Mock Date    | Time logic  | Scheduled tasks      |

## Performance

### Caching

| Data     | Type        | When      | Example      |
| -------- | ----------- | --------- | ------------ |
| Sessions | Redis       | High-freq | Auth tokens  |
| Queries  | Query Cache | Expensive | Aggregations |
| Static   | CDN         | Public    | Images, CSS  |
| API      | In-Memory   | Frequent  | Config data  |

### Database

| Scenario       | Strategy        | When        | Example   |
| -------------- | --------------- | ----------- | --------- |
| Read-heavy     | Read Replicas   | High read   | Analytics |
| Write-heavy    | Connection Pool | High write  | Logging   |
| Complex        | Indexing        | Performance | Search    |
| Large datasets | Pagination      | Retrieval   | Lists     |

## Security

### Authentication

| Use Case       | Method             | When          | Example       |
| -------------- | ------------------ | ------------- | ------------- |
| Stateless APIs | JWT                | Microservices | REST auth     |
| Stateful       | Session            | Web apps      | Admin         |
| External       | OAuth              | Third-party   | Social login  |
| Internal       | Service-to-Service | Microservices | Internal APIs |

### Data Protection

| Data      | Protection  | When         | Example        |
| --------- | ----------- | ------------ | -------------- |
| Passwords | Hash + Salt | Auth         | bcrypt, argon2 |
| API Keys  | Env Vars    | Integrations | Third-party    |
| Sensitive | Encryption  | At rest      | PII, financial |
| Network   | HTTPS/TLS   | In transit   | All external   |

## Code Organization

| Component | Location     | When          | Example         |
| --------- | ------------ | ------------- | --------------- |
| Business  | Services     | Core          | UserService     |
| Data      | Repositories | DB ops        | UserRepository  |
| API       | Controllers  | HTTP          | UserController  |
| Shared    | Tools        | Cross-cutting | Logging, config |

## Deployment

### Environments

| Env         | Purpose   | Config      | When         |
| ----------- | --------- | ----------- | ------------ |
| Development | Local dev | .env        | Dev machines |
| Testing     | Automated | Containers  | CI/CD        |
| Staging     | Pre-prod  | Prod-like   | QA           |
| Production  | Live      | Secure mgmt | End users    |

### Scaling

| Load    | Method          | When           | Example          |
| ------- | --------------- | -------------- | ---------------- |
| CPU     | Horizontal      | High compute   | Image processing |
| Memory  | Vertical        | Large datasets | Data analysis    |
| I/O     | Connection Pool | DB ops         | High-traffic     |
| Network | Load Balancing  | High requests  | Public APIs      |

[typescript-guidelines.md](typescript-guidelines.md) | [nestjs-architecture.md](nestjs-architecture.md) | [testing-standards.md](testing-standards.md) | [quick-reference.md](quick-reference.md)
