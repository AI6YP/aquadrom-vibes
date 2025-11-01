# Token Economy Rules

Optimize AI context usage for cost and performance.

## Core Principles

**Minimize Redundancy**

- No duplicate content across files
- Cross-link instead of copying
- Reference examples, don't inline them

**Maximize Density**

- Tables over prose
- Code samples in separate files
- Brief descriptions with links

**Strategic Loading**

- Load only files needed for task
- Use task maps to guide reading
- Read examples only when implementing

## File Organization

**Meta Files (Essential - Always Load)**

- `README.md` (31 lines) - Entry point
- `prompt.md` (43 lines) - AI essentials
- `quick-reference.md` (170 lines) - Quick lookups

**Framework Files (Load on Demand)**

- `typescript-guidelines.md` (125 lines) - TS tasks only
- `nestjs-architecture.md` (252 lines) - NestJS tasks only
- `nestjs-examples.md` (72 lines) - When implementing NestJS
- `testing-standards.md` (84 lines) - Testing tasks only

**Reference Files (Load When Needed)**

- `design-principles.md` (640 lines) - Code review, refactoring
- `decision-matrices.md` (121 lines) - Architecture decisions
- `documentation-guidelines.md` (79 lines) - Writing docs

**Specialized (Rare)**

- `ai-library-creation-guidelines.md` (779 lines) - Library creation only

## Token Budget

| Task Type     | Typical Files                          | Est. Tokens |
| ------------- | -------------------------------------- | ----------- |
| Bug fix       | prompt + quick-ref + testing           | ~300        |
| New feature   | prompt + typescript + nestjs + testing | ~600        |
| Architecture  | prompt + design + decision + architect | ~1,200      |
| Documentation | prompt + doc-guidelines                | ~150        |
| Code review   | prompt + design + quick-ref            | ~400        |

## Best Practices

**For AI Agents:**

1. Start with `README.md` task map
2. Load only files listed for task type
3. Load examples file only when writing code
4. Don't re-read files in same session
5. Use grep/codebase_search over reading large files

**For Documentation Writers:**

1. Put principles in main file
2. Put code samples in separate `-examples.md`
3. Use tables for reference data
4. Link, don't duplicate
5. Keep files under 300 lines when possible
6. Avoid emojis (3-4 tokens each, no semantic value)

**Anti-Patterns:**

- Inline code examples in principle docs
- Duplicate decision tables
- Copy-paste framework specifics
- Load all files for simple tasks
- Verbose explanations when tables work
- Emojis in documentation (unless explicitly requested)

## Metrics

**Target:**

- Keep meta docs under 500 lines total
- Keep individual files under 300 lines (except specialized)
- Maintain <200 tokens for common tasks

[prompt.md](prompt.md) | [README.md](README.md) | [quick-reference.md](quick-reference.md)
