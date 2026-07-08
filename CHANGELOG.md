# CHANGELOG

## [v1.0-dev] - 2026-07-09

### Added
- **.prettierrc**: Added Prettier configuration to enforce code formatting rules (single quotes, semicolons, 2-space indent, crlf end-of-line) (`e:\Custom Client\launcher\.prettierrc`, lines 1-7). Reason: Consistent code style across the project as per Phase 0 plan.
- **.env.development & .env.production**: Added environment variable templates for different build environments (`e:\Custom Client\launcher\.env.development`, lines 1-3; `e:\Custom Client\launcher\.env.production`, lines 1-3). Reason: Required for standardizing API endpoints and environment-specific settings.
- **docs/ directory**: Structured `docs/` directory for ADRs, guides, and architecture records.

### Changed
- **tsconfig.app.json & tsconfig.node.json**: Enabled strict TypeScript type checking (`"strict": true`) (`e:\Custom Client\launcher\tsconfig.app.json`, line 10; `e:\Custom Client\launcher\tsconfig.node.json`, line 8). Reason: Ensure type safety and catch errors early as defined in Phase 0 plan.
- **.oxlintrc.json**: Updated oxlint configuration to include strict TypeScript ESLint rules (`@typescript-eslint/no-explicit-any` as error and `@typescript-eslint/explicit-function-return-type` as warn) (`e:\Custom Client\launcher\.oxlintrc.json`, lines 7-8). Reason: Prevent usage of `any` types and enforce better type definitions.
- **All Source Files**: Formatted all existing files using Prettier. Reason: Bring the codebase into compliance with the new formatting rules.

### Removed/Moved
- **Scaffolding Directories**: Deleted `e:\Custom Client\client\` and `e:\Custom Client\backend\` directories. Reason: Dead code and empty scaffolding from previous iterations, no longer needed for V2.0 blueprint implementation.
- **Removed Files Directory**: Deleted `e:\Custom Client\removed file\` directory. Reason: Cleanup of old backup artifacts.
- **Dead Assets**: Removed `e:\Custom Client\launcher\src\assets\hero.png`. Reason: Asset was unused in the codebase.
- **Old Plans and Logs**: Moved `implementation_plan before phase 2` to `e:\Custom Client\docs\implementation_plan-before-phase-2.md`, moved `CHANGELOG.md` to `e:\Custom Client\docs\CHANGELOG-pre-v1.md`. Reason: Archiving old context to start fresh for v1.0 development.
- **Scripts**: Moved `e:\Custom Client\launcher\test-memory.cjs` and `test-metrics.cjs` to `e:\Custom Client\launcher\scripts\`. Reason: Organizational cleanup.
