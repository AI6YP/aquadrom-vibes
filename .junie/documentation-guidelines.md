# Documentation Guidelines

Standards for markdown documentation.

## Markdown

**Headings**: H1 for title, H2 for sections  
**Line breaks**: One between sections, two between blocks  
**Code**: Triple backticks with language  
**Inline code**: Single backticks  
**Emphasis**: **bold** for important, _italic_ for emphasis

## Tables

Space-aligned for consistent rendering:

```markdown
| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Data 1   | Data 2   | Data 3   |
```

## Cross-References

**Relative paths**:

```markdown
[TypeScript Guidelines](./typescript-guidelines.md)
[NestJS Architecture](./nestjs-architecture.md#module-structure)
```

**Link to sections**:

```markdown
See [forRoot Pattern](./nestjs-architecture.md#use-forroot-pattern)
```

## Structure

```
.junie/
├── README.md              # Entry point
├── prompt.md              # AI essentials
├── quick-reference.md     # Fast lookups
├── typescript-guidelines.md  # TS patterns
├── nestjs-architecture.md    # NestJS
├── testing-standards.md      # Testing
└── [other files...]
```

## Writing Style

- Active voice: "Create a service" not "A service should be created"
- Present tense: "handles" not "will handle"
- Concise: avoid unnecessary words
- Bullet points for lists
- Numbered lists for steps

## Code Documentation

**JSDoc for public APIs**:

```typescript
/**
 * Service for user operations
 * @example const user = await userService.findById('123')
 */
@Injectable()
export class UserService {
  /**
   * Find user by ID
   * @param id - User identifier
   * @returns Promise<User | null>
   */
  async findById(id: string): Promise<User | null> {}
}
```

**Inline comments for complex logic**:

```typescript
// Build config from env vars and defaults
const config = {
  host: this.config.get<string>('SERVER_HOST', 'localhost'),
  // SSL only if certificates provided
  ssl: sslCert ? { key, cert } : undefined,
};
```

## Maintenance

- Keep docs synced with code
- Update examples when APIs change
- Review during code reviews
- Version for major changes

## Automation Tools

- `markdownlint` - Style consistency
- `markdown-link-check` - Broken links
- `cspell` - Spelling
- Automated table alignment

[typescript-guidelines.md](typescript-guidelines.md) | [nestjs-architecture.md](nestjs-architecture.md) | [testing-standards.md](testing-standards.md) | [operational-rules.md](operational-rules.md) | [quick-reference.md](quick-reference.md)
