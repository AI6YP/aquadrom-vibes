# AI Library Creation Guidelines

Production-ready library development patterns. Uses [design-principles.md](design-principles.md), [typescript-guidelines.md](typescript-guidelines.md), [nestjs-architecture.md](nestjs-architecture.md).

## Core Principles

1. **Modern Tooling**: tsup, ESLint 9, Jest 30
2. **Dual Package**: ESM + CommonJS
3. **Framework Agnostic**: Core independent, optional wrappers
4. **Production Ready**: 80%+ coverage, CI/CD, quality gates

## Directory Structure

```
src/tools/{library}/
├── core/                    # Pure TypeScript
│   ├── interfaces/
│   ├── services/
│   ├── utils/
│   ├── constants/
│   └── index.ts
├── nestjs/                  # Optional NestJS wrapper
│   ├── config/
│   ├── *.module.ts
│   └── index.ts
├── __tests__/
│   ├── core/               # Unit tests
│   ├── integration/        # E2E tests
│   └── benchmarks/         # Performance
├── package.json
├── tsup.config.ts
├── jest.config.ts
├── eslint.config.mts
└── README.md
```

## Package Configuration

### Dual Package Exports

```json
{
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./nestjs": {
      "types": "./dist/nestjs/index.d.ts",
      "import": "./dist/nestjs/index.mjs",
      "require": "./dist/nestjs/index.cjs"
    }
  }
}
```

### Essential Scripts

```json
{
  "scripts": {
    "build": "tsup",
    "test": "jest",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "lint": "eslint --fix",
    "check:types": "tsc --noEmit",
    "check:circular": "dpdm ./core ./nestjs --exit-code circular:1",
    "check:all": "npm run check:types && npm run lint && npm run test:ci",
    "prepublishOnly": "npm run check:all && npm run build"
  }
}
```

## Build System

### tsup (Modern Build)

```typescript
// tsup.config.ts
export default {
  entry: ['index.ts', 'nestjs/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  treeshake: true,
  target: 'es2020',
  external: ['@nestjs/common', '@nestjs/config'],
};
```

### TypeScript (Strict)

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "declaration": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Quality Tools

### ESLint 9 (Flat Config)

```typescript
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  ...tseslint.configs.recommended,
  {
    plugins: { 'unused-imports': unusedImports },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'unused-imports/no-unused-imports': 'error',
    },
  },
];
```

### Jest (80%+ Coverage)

```typescript
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
};
```

## Testing Strategy

| Type        | Location                 | Purpose         | Coverage       |
| ----------- | ------------------------ | --------------- | -------------- |
| Unit        | `__tests__/core/`        | Services, utils | 90%+           |
| Integration | `__tests__/integration/` | E2E flows       | 80%+           |
| Performance | `__tests__/benchmarks/`  | Benchmarks      | Critical paths |

See [testing-standards.md](testing-standards.md) for patterns.

## Documentation Structure

### README.md Sections

1. **Overview**: Purpose, key features (3-5 bullets)
2. **Installation**: Prerequisites, `npm install`
3. **Quick Start**: Standalone + NestJS examples
4. **Configuration**: Env vars table
5. **API Reference**: Core interfaces (brief)
6. **Architecture**: Mermaid diagram
7. **Troubleshooting**: Common issues
8. **Related Files**: Cross-links

See [documentation-guidelines.md](documentation-guidelines.md) for standards.

### MIGRATION.md Template

```markdown
## Breaking Changes

- API changes (old → new)
- Config changes

## Step-by-Step

1. Install: `npm install @org/new-lib`
2. Update imports
3. Update config
4. Run tests

## Checklist

- [ ] Install, imports, config, tests, docs, remove old
```

## Performance Best Practices

| Strategy           | When                 | Benefit         |
| ------------------ | -------------------- | --------------- |
| Connection Pooling | Reusable connections | Reduce overhead |
| Streaming          | Large data           | Low memory      |
| Caching            | Expensive ops        | Fast response   |
| Lazy Loading       | Optional features    | Fast startup    |

## Migration Patterns

### From Custom → Library

```typescript
// Before: Custom
class Custom {
  async method() {
    /* ... */
  }
}

// After: Library
import { Service } from '@org/lib';
const service = new Service();
await service.request(options);
```

### From Framework-Specific → Agnostic

```typescript
// Before: NestJS-only
@Injectable()
class Old {
  /* NestJS-coupled */
}

// After: Core + Wrapper
// core/service.ts - Pure TypeScript
// nestjs/wrapper.ts - NestJS @Injectable wrapper
```

## Implementation Checklist

### Pre-Development

- [ ] Define scope and boundaries
- [ ] Core + wrapper architecture
- [ ] Modern, stable dependencies
- [ ] Testing strategy (unit/integration/performance)

### Development

- [ ] Follow directory structure
- [ ] Core: pure TypeScript business logic
- [ ] Framework: optional NestJS wrapper (`forRoot()`)
- [ ] Tests: 80%+ coverage
- [ ] Benchmarks: compare alternatives
- [ ] Config: env vars + Joi validation
- [ ] Logging: configurable levels

### Quality

- [ ] ESLint 9 + Prettier + TypeScript strict
- [ ] tsup build (dual package)
- [ ] Git hooks (pre-commit)
- [ ] Circular dependency detection (dpdm)
- [ ] Architecture validation (dependency-cruiser)

### Documentation

- [ ] README: install, usage, examples
- [ ] API: all interfaces
- [ ] MIGRATION: step-by-step
- [ ] Performance: benchmarks
- [ ] Troubleshooting: common issues

### Validation

- [ ] `npm run check:all` passes
- [ ] `npm run build` succeeds
- [ ] `npm pack` and test install
- [ ] Benchmarks meet targets
- [ ] No security vulnerabilities

### Post-Development

- [ ] Semantic versioning
- [ ] Automated publishing
- [ ] Error tracking
- [ ] Maintenance plan

## Key Decisions

| Decision          | Choice         | Rationale                   |
| ----------------- | -------------- | --------------------------- |
| Build Tool        | tsup           | Fast, modern, simple config |
| Package Format    | Dual (ESM+CJS) | Maximum compatibility       |
| Architecture      | Core + Wrapper | Framework independence      |
| Testing Framework | Jest 30        | Industry standard, great DX |
| Linting           | ESLint 9       | Modern flat config          |
| Coverage Target   | 80%+           | Production quality          |
| TypeScript Mode   | Strict         | Catch errors early          |

[typescript-guidelines.md](typescript-guidelines.md) | [nestjs-architecture.md](nestjs-architecture.md) | [testing-standards.md](testing-standards.md) | [documentation-guidelines.md](documentation-guidelines.md) | [design-principles.md](design-principles.md)
