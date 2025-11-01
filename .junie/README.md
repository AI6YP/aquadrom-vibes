# .junie - AI Development Guidelines

**START HERE**: [prompt.md](prompt.md) for AI agents | [quick-reference.md](quick-reference.md) for developers

## Priority Reading Order

**Level 1 (Essential)**

1. [prompt.md](prompt.md) - AI behavior, OS commands, workflow
2. [quick-reference.md](quick-reference.md) - Patterns, decisions
3. [post-code-workflow.md](post-code-workflow.md) - Mandatory QA

**Level 2 (Framework)**

4. [typescript-guidelines.md](typescript-guidelines.md) - TS patterns
5. [testing-standards.md](testing-standards.md) - Testing
6. [design-principles.md](design-principles.md) - DRY/KISS/YAGNI/SOLID

**Level 3 (Advanced)**

7. [operational-rules.md](operational-rules.md) - Workflow rules
8. [prompt-software-architect.md](prompt-software-architect.md) - Architecture
9. [decision-matrices.md](decision-matrices.md) - Decision tables
10. [documentation-guidelines.md](documentation-guidelines.md) - Docs

**Level 4 (Specialized)**

11. [ai-library-creation-guidelines.md](ai-library-creation-guidelines.md) - Libraries
12. [token-economy.md](token-economy.md) - AI context optimization

## Quick Task Map

| Task          | Files                                                             |
| ------------- | ----------------------------------------------------------------- |
| New feature   | typescript-guidelines + testing-standards + design-principles     |
| Bug fix       | post-code-workflow + testing-standards                            |
| Architecture  | decision-matrices + prompt-software-architect + design-principles |
| Code review   | design-principles + typescript-guidelines + post-code-workflow    |
| Library       | ai-library-creation-guidelines                                    |
| Documentation | documentation-guidelines                                          |

## Mandatory Workflow

After code changes: `pnpm run check:types && pnpm run lint:check && pnpm run lint:fix && pnpm test`

Details: [post-code-workflow.md](post-code-workflow.md)

## Token Efficiency

Load only files needed for your task. See [token-economy.md](token-economy.md) for guidance.
