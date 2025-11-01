# Post-Code Workflow

Mandatory quality checks after code changes. See [design-principles.md](design-principles.md).

## Required Steps (In Order)

| Step          | Command                          | Purpose              | On Failure   |
| ------------- | -------------------------------- | -------------------- | ------------ |
| 1. Type Check | `pnpm run check:types`           | Catch type errors    | Fix types    |
| 2. Lint       | `pnpm run lint:check`            | Code style           | Fix manually |
| 3. Format     | `pnpm run lint:fix`              | Auto-fix style       | Rerun lint   |
| 4. Test       | `pnpm test`                      | Verify functionality | Fix tests    |
| 5. App Test   | `pnpm run start:test` (optional) | Manual/E2E testing   | Debug        |

## One-Line Workflow

```bash
pnpm run check:types && pnpm run lint:check && pnpm run lint:fix && pnpm test
```

## Pre-Commit Checklist

- [ ] Type checking passes
- [ ] Linting passes
- [ ] All tests pass
- [ ] Code formatted
- [ ] Documentation updated (if API changed)
- [ ] No `console.log` (use logger)
- [ ] No `TODO` comments

## Common Issues

### Type Errors

```typescript
// Error
const userName = user.name;

// Fix
const userName = user.name || 'Unknown';
```

### Linting Errors

```typescript
// Missing semicolon
const name = 'John';

// Fixed
const name = 'John';
```

### Test Failures

- Update tests or fix implementation
- Check for path issues (Windows vs Unix)
- Ignore Jest ESM warnings (lodash-es)

### App Startup

- Wait ~30 seconds for startup
- Use `pnpm run start:test:e2e` for longer timeout
- Check for "Application successfully started" message

## Quality Gates

**Coverage**: Unit 90%+ | Integration 80%+ | E2E 70%+  
**Performance**: Type check <30s | Lint <10s | Tests <2min

## IDE Setup (VS Code)

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

**Extensions**: ESLint, Prettier, TypeScript Hero, Jest Runner

[typescript-guidelines.md](typescript-guidelines.md) | [testing-standards.md](testing-standards.md) | [operational-rules.md](operational-rules.md)
