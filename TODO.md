# Custom Client - Master TODO List

*Prioritized list based on the Project Health Audit.*

## Phase 1 — UI/UX Completion (Critical Polish)
- [ ] **ModpackWindow.tsx**: Replace "coming soon" in `Resource Packs` with a UI list for managing packs.
- [ ] **ModpackWindow.tsx**: Replace "coming soon" in `Server Packs` with a UI list.
- [ ] **ModpackWindow.tsx**: Replace "coming soon" in `Screenshots` with a grid layout identical to `Screenshots.tsx`.
- [ ] **ModpackWindow.tsx**: Replace "coming soon" in `Java Environment` with inputs for Java Executable Path and JVM Arguments.
- [ ] **ModpackWindow.tsx**: Replace "coming soon" in `Versions` with a dropdown to select Game Version and Mod Loader.
- [ ] **ModpackWindow.tsx**: Replace "coming soon" in `Export` with an export profile settings UI.
- [ ] **Settings.tsx**: Implement `localStorage` or context state persistence so settings don't reset on reload.
- [ ] **Library.tsx & InstallModal.tsx**: Extract the hardcoded profiles array into a shared state manager or `localStorage` so they stay in sync.
- [ ] **Marketplace.tsx**: Add an Error Boundary or fallback UI in case the Modrinth API fails/rate-limits.
- [ ] **Library.tsx**: Add an "Empty State" UI if the user has 0 profiles.

## Phase 2 — Core Functionality (Backend Bridge)
- [ ] **Filesystem IPC**: Hook up all "Change Directory" and "Open Folder" buttons to trigger Electron `dialog.showOpenDialog`.
- [ ] **Screenshots Reader**: Update `Screenshots.tsx` to read actual `.png` files from the Minecraft folder via Node.js `fs`.
- [ ] **Microsoft Auth**: Implement OAuth2 login flow for the Account Center (`RightSidebar.tsx`).
- [ ] **Create Profile**: Wire up the "+ New Profile" and "Create" buttons to actually append a new profile to the state.

## Phase 3 — Game Execution (The Launcher Core)
- [ ] **Minecraft Downloader**: Download version manifests, assets, libraries, and natives based on selected version.
- [ ] **Mod Loader Downloader**: Download Fabric/Forge/Quilt installer jars and process them.
- [ ] **Launch Process**: Spawn the Java process with the configured JVM arguments, RAM limits, and classpath.
- [ ] **Console/Log Viewer**: Add a terminal/console window to see the game's stdout logs in real-time.

## Phase 4 — Future Features (Post-Release)
- [ ] Implement a full Discord Rich Presence integration.
- [ ] Add auto-updating functionality to the launcher itself.
- [ ] Add a global theme/color customizer.
