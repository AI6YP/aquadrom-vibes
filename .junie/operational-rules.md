# Operational Rules

Follow [design-principles.md](design-principles.md) for all code.

## Core Rules

- Minimal changes to satisfy requirements
- No files outside project directory
- Use project tools: `read_file`, `search_replace`, `write`, `grep`, `codebase_search`
- PowerShell + Windows paths (`\`)
- No multi-line/interactive commands

## Workflow

1. Reproduce issues with scripts
2. Write/run tests (80%+ coverage, AAA pattern)
3. Respect module boundaries → [nestjs-architecture.md](nestjs-architecture.md)
4. Small functions (< 20 instructions)
5. Run [post-code-workflow.md](post-code-workflow.md)

## Safety

- No secrets (use env vars)
- Security: sanitization, secure headers, rate limiting
- English only

## Quick Patterns

| Need     | Solution           | Ref                                                  |
| -------- | ------------------ | ---------------------------------------------------- |
| Config   | ConfigModule       | [nestjs-architecture.md](nestjs-architecture.md)     |
| Data     | Repository Pattern | [nestjs-architecture.md](nestjs-architecture.md)     |
| Errors   | Result Pattern     | [typescript-guidelines.md](typescript-guidelines.md) |
| Types    | Branded Types      | [typescript-guidelines.md](typescript-guidelines.md) |
| Tests    | AAA Pattern        | [testing-standards.md](testing-standards.md)         |
| Examples | Code Samples       | [nestjs-examples.md](nestjs-examples.md)             |

## Common Workflows

**New Feature**: Branch → Architecture → Tests → Docs → [post-code-workflow.md](post-code-workflow.md)  
**Bug Fix**: Reproduce → Fix → Regression test → [post-code-workflow.md](post-code-workflow.md)  
**Refactor**: Ensure tests → Incremental changes → Test after each

[prompt.md](prompt.md) | [typescript-guidelines.md](typescript-guidelines.md) | [nestjs-architecture.md](nestjs-architecture.md) | [testing-standards.md](testing-standards.md) | [design-principles.md](design-principles.md) | [quick-reference.md](quick-reference.md)
