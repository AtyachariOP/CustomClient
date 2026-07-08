# Custom Client Launcher

## Setup Instructions

1. **Prerequisites**: Ensure you have Node.js 20+ installed.
2. **Install Dependencies**: Run `npm install` in the `launcher` directory.
3. **Run Development Mode**: Run `npm run start` to start the Vite dev server and Electron.

## Development Workflow

- The project uses Vite + React + TypeScript for the renderer.
- Electron's main process and preload scripts are in the `electron/` folder.
- Formatting is enforced via Prettier (`npm run prettier`).
- Linting is enforced via Oxlint (`npm run lint`).
- Ensure all commits follow the branching and commit strategy outlined in the Phase Plan.

For detailed architecture, refer to `docs/architecture/blueprint-v2.0.md`.
