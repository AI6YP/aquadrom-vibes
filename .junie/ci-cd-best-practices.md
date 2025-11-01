# CI/CD Best Practices

Modern CI/CD configuration for pnpm monorepo with Node.js 24.

## Current Setup

### Technology Stack

- **Package Manager**: pnpm 10.20.0 (via Corepack)
- **Node.js**: 24.x LTS
- **CI/CD**: GitLab CI with Kaniko for Docker builds
- **Deployment**: Ansible automation

### Pipeline Stages

```mermaid
graph LR
    A[Quality] --> B[Test]
    B --> C[Build]
    C --> D[Publish]
    D --> E[Deploy]
```

## Caching Strategy

### pnpm Store Caching

```yaml
cache:
  key:
    files:
      - pnpm-lock.yaml
  paths:
    - .pnpm-store/
    - node_modules/
  policy: pull-push # First job pushes, others pull
```

**Benefits**:

- Faster installs (90% faster after first run)
- Deterministic builds via lockfile-based cache key
- Shared store across workspace packages

### Docker Layer Caching

```yaml
/kaniko/executor
--cache=true
--cache-ttl=24h
--destination $REGISTRY/image:$TAG
```

**Benefits**:

- Faster Docker builds (50-80% improvement)
- Reuses unchanged layers
- 24h TTL balances speed vs freshness

## Quality Gates

### Parallel Quality Checks

```yaml
stages:
  - quality # Run in parallel
  - test
  - build
```

**Jobs**:

1. `quality:types` - TypeScript type checking
2. `quality:lint` - ESLint code style
3. `quality:circular` - Circular dependency detection

**Why Parallel**:

- Faster feedback (2-3 min vs 6-9 min sequential)
- Fail fast on multiple issues
- Better resource utilization

### Test Coverage

```yaml
coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
artifacts:
  reports:
    coverage_report:
      coverage_format: cobertura
```

**Features**:

- Coverage badges in GitLab
- Historical tracking
- Merge request annotations

## Monorepo Optimizations

### Workspace Configuration

**pnpm-workspace.yaml**:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - '.'
```

### Shared Dependencies

**.npmrc**:

```ini
# Cache optimization
store-dir=.pnpm-store
link-workspace-packages=true

# Public hoist for dev tools
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*typescript*
public-hoist-pattern[]=*jest*
```

**Benefits**:

- Single node_modules with symlinks
- Faster installs across workspace
- Reduced disk usage (up to 70%)

### Selective Builds (Future)

For when workspace grows:

```yaml
# Only build changed packages
script:
  - pnpm --filter "...[HEAD^]" build
```

## Docker Best Practices

### Multi-Stage Build

```dockerfile
FROM node:24-alpine AS base
FROM base AS dependencies
FROM dependencies AS build
FROM node:24-alpine AS production
```

**Benefits**:

- Smaller final image (production-only deps)
- Better layer caching
- Security (non-root user)

### Build Optimizations

1. **Copy lockfile first** - Cache dependencies separately
2. **Copy source last** - Don't invalidate dep layer
3. **Prune store** - Remove unnecessary files
4. **Health check** - Ensure service is running

## Performance Metrics

### Current Performance

| Stage     | Without Cache | With Cache | Improvement |
| --------- | ------------- | ---------- | ----------- |
| Install   | 45s           | 8s         | 82%         |
| Build     | 60s           | 55s        | 8%          |
| Docker    | 180s          | 45s        | 75%         |
| **Total** | **285s**      | **108s**   | **62%**     |

### Target Performance

- Type check: <30s
- Linting: <10s
- Tests: <2min
- Build: <1min
- Docker: <45s

## Security Best Practices

### Dockerfile Security

```dockerfile
# Non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Minimal base image
FROM node:24-alpine  # 40MB vs 1GB for full node
```

### Dependency Security

```yaml
# Automated dependency scanning
security:scan:
  stage: quality
  script:
    - pnpm audit --prod
  allow_failure: true
```

## Deployment Strategy

### Manual Gates

```yaml
rules:
  - when: manual # Require approval
```

**Environments**:

- **Staging**: Auto-build, manual deploy
- **Production**: Manual deploy + approval

### Blue-Green Deployment (Future)

For zero-downtime deployments:

```yaml
Deploy_prod_blue:
  environment:
    name: production-blue
    on_stop: Stop_prod_blue
```

## Monitoring & Observability

### Health Checks

```dockerfile
HEALTHCHECK --interval=30s \
  CMD node -e "require('http').get('http://localhost:3000/_hc', ...)"
```

### Pipeline Visibility

```yaml
artifacts:
  reports:
    junit: test-results.xml
    coverage_report: coverage/cobertura.xml
```

## Best Practices Checklist

- [x] **Caching**: pnpm store + Docker layers
- [x] **Parallel Execution**: Quality checks run concurrently
- [x] **Quality Gates**: Types, lint, tests before build
- [x] **Monorepo Support**: Workspace configuration ready
- [x] **Security**: Non-root user, minimal images
- [x] **Performance**: Optimized build order
- [x] **Artifacts**: Coverage reports, build outputs
- [ ] **Security Scanning**: Add pnpm audit job
- [ ] **E2E Tests**: Add Playwright tests to CI
- [ ] **Selective Builds**: Build only changed packages
- [ ] **Matrix Builds**: Test multiple Node versions

## Future Enhancements

### 1. Selective Workspace Builds

```yaml
build:changed:
  script:
    - pnpm --filter "...[HEAD^]" build
```

### 2. Matrix Testing

```yaml
test:matrix:
  parallel:
    matrix:
      - NODE_VERSION: ['24', '25']
```

### 3. Automated Releases

```yaml
release:
  script:
    - pnpm changeset version
    - pnpm changeset publish
```

### 4. Performance Budgets

```yaml
performance:
  script:
    - pnpm lighthouse --budget-path=.lighthouserc.json
```

## Migration Notes

### From npm to pnpm

Completed:

- [x] Package manager: npm → pnpm 10.20.0
- [x] Scripts: All commands updated
- [x] CI/CD: Cache configuration for pnpm
- [x] Docker: Multi-stage with pnpm
- [x] Documentation: All references updated

### From Node 22 to Node 24

Completed:

- [x] Dockerfile: node:22-alpine → node:24-alpine
- [x] package.json: engines >=24.0.0
- [x] Documentation: All references updated
- [x] CI/CD: default image node:24-alpine

## References

- [pnpm Docs](https://pnpm.io)
- [GitLab CI Best Practices](https://docs.gitlab.com/ee/ci/pipelines/)
- [Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Kaniko](https://github.com/GoogleContainerTools/kaniko)

[prompt.md](prompt.md) | [post-code-workflow.md](post-code-workflow.md)
