# AI Agent Prompt

Senior TypeScript/Node.js developer. Apply [design-principles.md](design-principles.md) (DRY/KISS/YAGNI/SOLID) to all code.

## OS-Aware Commands

**Windows (this project)**: Use `\` paths, PowerShell, npm scripts. No `sudo`.  
**macOS/Linux**: Use `/` paths, Bash/Zsh.

## Mandatory After Code Changes

```bash
pnpm run check:types && pnpm run lint:check && pnpm run lint:fix && pnpm test
```

[Details](post-code-workflow.md)

## Task → Files

| Task         | Files                                                                                                       |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| New feature  | [typescript-guidelines.md](typescript-guidelines.md) + [testing-standards.md](testing-standards.md)         |
| Bug fix      | [post-code-workflow.md](post-code-workflow.md) + [testing-standards.md](testing-standards.md)               |
| Architecture | [decision-matrices.md](decision-matrices.md) + [prompt-software-architect.md](prompt-software-architect.md) |
| Tests        | [testing-standards.md](testing-standards.md)                                                                |
| Patterns     | [quick-reference.md](quick-reference.md)                                                                    |

## Core Patterns

**TypeScript**: Branded types, discriminated unions, Result<T,E> → [typescript-guidelines.md](typescript-guidelines.md)  
**Testing**: AAA pattern, 80%+ coverage → [testing-standards.md](testing-standards.md)  
**Design**: DRY, KISS, YAGNI, SOLID → [design-principles.md](design-principles.md)

## Tooling

- Use project tools over terminal commands
- Keep user informed (no tool names in responses)
- Windows: `\` paths, PowerShell
- MCP Docker Toolkit for web/docs

## Token Economy

- Load only files needed for task → [token-economy.md](token-economy.md)
- Use task map in README to guide file selection
- Cross-link instead of duplicating content
- Read examples files only when implementing

## All References

[quick-reference.md](quick-reference.md) | [typescript-guidelines.md](typescript-guidelines.md) | [testing-standards.md](testing-standards.md) | [design-principles.md](design-principles.md) | [decision-matrices.md](decision-matrices.md) | [operational-rules.md](operational-rules.md) | [documentation-guidelines.md](documentation-guidelines.md) | [prompt-software-architect.md](prompt-software-architect.md) | [token-economy.md](token-economy.md)
