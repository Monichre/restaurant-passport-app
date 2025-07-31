# Agents Configuration

## Commands
- **dev**: `bun run dev`
- **build**: `bun run build`
- **lint**: `bun run lint`
- **storybook**: `bun run storybook`
- **generate**: `bun run new`
- **drizzle:generate**: `bun run drizzle:generate`
- **drizzle:migrate**: `bun run drizzle:migrate`
- **scrape**: `bun run scrape`
- **test**: `bun run test`
- **test (single)**: `bun run test <path/to/test.spec.ts>`

## Code Style Guidelines
- **TypeScript**: strict mode, explicit return types
- **Imports**: group (React, third-party, internal) with blank lines
- **Formatting**: 2-space indent, avoid `console.log`
- **Components**: functional with `React.forwardRef` when needed
- **Naming**: PascalCase for components, camelCase for functions, kebab-case for files
- **Error Handling**: use try/catch with specific error types

## Cursor Rules
See definitions in `.cursor/rules/*.mdc`

## Copilot Rules
See `.github/copilot-instructions.md` (if present)
