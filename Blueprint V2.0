# Custom Client — Definitive Production Blueprint V2.0

> **Role**: Lead Software Architect & Technical Director  
> **Date**: July 6, 2026  
> **Version**: 2.0 — Final Master Blueprint  
> **Scope**: Complete redesign and implementation roadmap to transform a UI prototype into a shipping Minecraft launcher  
> **Status**: APPROVED FOR IMPLEMENTATION

---

## EXECUTIVE SUMMARY

I have read every file, every component, every line of code in this project. Here is my honest assessment:

**What exists today is a React UI demo running inside an Electron shell.** It is visually polished but architecturally hollow. There is no authentication, no download pipeline, no launch engine, no real profile system, no filesystem abstraction, and no security model. The previous architecture document (1,537 lines) was thorough in its analysis but made a critical mistake: it planned too many features before establishing what a launcher *actually needs to do*.

This document takes a fundamentally different approach. I will:

1. **Kill scope creep** — defer everything that doesn't serve the core mission
2. **Challenge every architectural decision** the project has made so far
3. **Redesign from the inside out** — start with what makes a launcher *work*, then layer features on top
4. **Design systems that don't exist yet** — modpack ecosystem, social hub, mission center, monetization
5. **Provide the exact build order** so no engineer ever asks "what do I build next?"

---

## PART 1: BRUTAL HONEST CRITIQUE

### What's Wrong — Things I'm Challenging

| Decision | My Verdict | Why |
|----------|-----------|-----|
| **Electron framework** | ⚠️ Keep, but with caveats | Electron is the right choice for time-to-market. Tauri would be better for performance/size but the ecosystem knowledge isn't there yet. Accept the 150MB+ binary size. |
| **CEF integration for in-game UI** | 🔴 **Kill it. Immediately.** | CEF inside Minecraft is a massive security and performance liability. Lunar Client uses it because they have a dedicated native engineering team. This project doesn't. Use Fabric's built-in rendering API instead. |
| **Dynamic Java compilation (Janino)** | 🔴 **Kill it.** | Runtime Java compilation is a malware vector. No mainstream launcher does this. Use standard Fabric mod API instead. |
| **Editor Studio (separate Electron app)** | 🟡 **Defer to Year 2.** | Building two Electron apps simultaneously is a resource drain. The launcher must ship first. Studio can be a future product. |
| **Custom Marketplace backend** | 🟡 **Defer. Use Modrinth + CurseForge APIs first.** | Building a marketplace from scratch before having users is premature. Aggregate existing mod sources, then build your own marketplace once you have traction. |
| **`contextIsolation: false` + `nodeIntegration: true`** | 🔴 **Critical security vulnerability.** | This must be fixed in Sprint 1. Any loaded URL or injected script can run `require('child_process').exec('rm -rf /')`. |
| **`webSecurity: false`** | 🔴 **Critical.** | Disabling CORS globally is never acceptable in production. |
| **All state in `localStorage`** | 🔴 **Will fail at scale.** | 5-10MB limit. Wiped on cache clear. Inaccessible from main process. Must migrate to file-based storage. |
| **722-line god component (Marketplace.tsx)** | 🟡 **Refactor required.** | But not now. This works for the UI. Refactor when building real mod management. |
| **Fabric-only loader support** | 🟡 **Wrong constraint.** | A commercial launcher *must* support Forge, NeoForge, Quilt, and Vanilla. Fabric-first is fine, but the architecture must be loader-agnostic from day one. |
| **Friends/Chat system** | 🟡 **Premature.** | Building a social system before the launcher can launch Minecraft is backwards. The mock data is fine for now. Real social features need a backend. |
| **50ms API debounce on Modrinth search** | 🔴 **Will get rate-limited.** | Modrinth rate limits at 300 req/min. Increase to 300ms minimum. |
| **Synchronous `fs` calls in Screenshots.tsx** | 🟡 **Will freeze UI with 1000+ files.** | Switch to async `fs.promises` operations. |
| **1.87MB + 1.44MB PNG images** | 🟢 **Cosmetic, fix later.** | Convert to WebP when packaging. |
| **Multiple avatar API services (mc-heads.net, minotar.net)** | 🟢 **Consolidate to one.** | Pick one avatar provider. mc-heads.net is more reliable. |

### What's Actually Good

- **Visual design quality** — The glassmorphism, animations, and color palette are premium. Keep all of it.
- **Virtual scrolling in Marketplace** — Smart performance decision with `@tanstack/react-virtual`.
- **Performance mode toggle** — Genuine accessibility feature. Expand it.
- **Developer Options window** — Useful for debugging. Keep but improve.
- **Modrinth API integration** — Working search, filtering, pagination. Good foundation.
- **Screenshot gallery with real FS operations** — Proves Electron FS access works.
- **`useLocalStorage` hook** — Clean abstraction. Will be replaced but the pattern is correct.

---

## PART 2: WHAT ABSOLUTELY MUST EXIST BEFORE LAUNCH

### The Dependency Pyramid

Every feature in the launcher depends on lower layers. You cannot build upward without the foundation.

```mermaid
graph TB
    subgraph "Layer 5: User-Facing Features"
        L5A["Mod Management"]
        L5B["Resource/Shader Packs"]
        L5C["Profile Import/Export"]
        L5D["Modpack System"]
    end

    subgraph "Layer 4: THE LAUNCH ENGINE"
        L4A["🎮 Launch Game"]
        L4B["Classpath Builder"]
        L4C["Argument Builder"]
        L4D["Process Manager"]
    end

    subgraph "Layer 3: Game Infrastructure"
        L3A["Minecraft Version Manager"]
        L3B["Asset Manager"]
        L3C["Library Manager"]
        L3D["Mod Loader Installers"]
        L3E["Java Runtime Manager"]
        L3F["Authentication"]
    end

    subgraph "Layer 2: Core Services"
        L2A["Download Manager"]
        L2B["Hash Verifier"]
        L2C["Profile Manager"]
        L2D["Settings Store"]
        L2E["Event Bus"]
    end

    subgraph "Layer 1: Infrastructure"
        L1A["Secure IPC Bridge"]
        L1B["Filesystem Service"]
        L1C["Path Resolver"]
        L1D["Structured Logger"]
        L1E["State Management"]
        L1F["Error Handling"]
    end

    L5A --> L4A
    L5B --> L4A
    L5C --> L2C
    L5D --> L5A

    L4A --> L4B & L4C & L4D
    L4B --> L3A & L3B & L3C & L3D
    L4C --> L3F & L2D & L2C
    L4D --> L1B & L1D

    L3A --> L2A & L2B
    L3B --> L2A & L2B
    L3C --> L2A & L2B
    L3D --> L2A & L3A
    L3E --> L2A & L1B
    L3F --> L1A & L1B

    L2A --> L1A & L1B & L2B
    L2C --> L1B & L2D
    L2D --> L1B & L1C
    L2E --> L1A

    L1A --> L1F
    L1B --> L1C & L1D
    L1E --> L1A
```

### What Can Be Delayed

| Feature | Why It Can Wait |
|---------|----------------|
| Social Hub (real backend) | Requires backend infrastructure. Mock UI is sufficient for launch. |
| Mission Center | Content feature, not core functionality. |
| Custom Marketplace | Use Modrinth/CurseForge APIs first. Build your own when you have users. |
| Cloud Sync | Requires backend. Profile import/export covers the use case initially. |
| Themes/Cosmetics | Aesthetic feature. Current design is already premium. |
| Plugin/Extension System | Architecture complexity. Defer to post-1.0. |
| Editor Studio | Separate product. Ship the launcher first. |
| CEF In-Game Overlay | Killed. Use Fabric rendering API instead. |
| Dynamic Java Compilation | Killed. Use standard mod API. |
| Auto-Updater | Important but not blocking v1.0. Manual updates are acceptable for beta. |
| Discord Rich Presence | Nice-to-have. Not blocking. |

### What Should Be Rewritten

| Component | Reason | Rewrite Scope |
|-----------|--------|--------------|
| `electron/main.cjs` | Security violations, no IPC infrastructure | Full rewrite to TypeScript with proper security |
| `electron/preload.js` | Empty, must become the secure API bridge | Full rewrite |
| All `localStorage` usage | Must migrate to file-based JSON storage | Systematic migration |
| `Marketplace.tsx` | God component, needs service extraction | Extract API calls to service, decompose UI |
| `Screenshots.tsx` | Synchronous FS, direct `require` | Migrate to async IPC-based FS |
| Profile data model | Hardcoded, no real persistence | New `ProfileManager` service |

### What Should Be Removed

| Item | Reason |
|------|--------|
| `src/assets/hero.png` | Unused dead asset |
| `InspectorApp.tsx` (235 lines) | Defer. Nice but not blocking launch. Keep InspectorBridge for telemetry. |
| `inspector.html` + `inspector.tsx` | Same — defer the standalone debugger window |
| `removed file/` directory | Dead files cluttering the repo |
| `implementation_plan before phase 2` | Superseded by this document |
| CEF architecture references in `ReadmefirstAi.md` | Dead architecture decision |
| `client/` directory scaffolding | Empty. Remove until Fabric mod development actually begins. |
| `backend/` directory scaffolding | Empty. Remove until backend development begins. |

---

## PART 3: ARCHITECTURE THAT WILL SCALE

### 3.1 Process Architecture

```mermaid
graph LR
    subgraph "Electron Main Process (Node.js)"
        direction TB
        BOOT["Bootstrap & Window Management"]
        IPC_REG["IPC Handler Registry"]
        
        subgraph "Service Layer"
            AUTH["AuthService"]
            DL["DownloadManager"]
            VERSION["VersionManager"]
            ASSET["AssetManager"]
            LIBRARY["LibraryManager"]
            LOADER["LoaderService"]
            JAVA["JavaManager"]
            LAUNCH["LaunchEngine"]
            PROFILE["ProfileManager"]
            INSTANCE["InstanceManager"]
            MOD["ModManager"]
            FS["FileSystemService"]
            SETTINGS["SettingsStore"]
            LOG["Logger"]
        end
    end

    subgraph "Electron Renderer Process (React)"
        direction TB
        APP["App.tsx"]
        STORES["Zustand Stores"]
        COMPONENTS["UI Components"]
        IPC_CLIENT["IPC Client (typed)"]
    end

    subgraph "preload.ts (contextBridge)"
        BRIDGE["Typed API Surface"]
    end

    COMPONENTS --> STORES
    STORES --> IPC_CLIENT
    IPC_CLIENT --> BRIDGE
    BRIDGE --> IPC_REG
    IPC_REG --> AUTH & DL & VERSION & LAUNCH & PROFILE & MOD & FS & SETTINGS
```

### 3.2 Why This Architecture

1. **Security**: `contextIsolation: true` + `sandbox: true` + typed `contextBridge`. The renderer process cannot access Node.js APIs directly. Every filesystem, network, and process operation goes through a vetted IPC channel.

2. **Separation of Concerns**: UI components never touch `fs`, `child_process`, or `net`. They call typed IPC methods and receive typed responses. This makes the UI testable without Electron.

3. **Scalability**: Adding a new service (e.g., `CloudSyncService`) means:
   - Create the service class in main process
   - Add IPC handlers
   - Add the API to the preload bridge
   - Create a Zustand store in the renderer
   - Zero changes to existing code

4. **Maintainability**: Each service has a single responsibility. `DownloadManager` downloads files. `HashVerifier` verifies hashes. `LaunchEngine` orchestrates the launch. No god classes.

### 3.3 Data Directory Design

```
%APPDATA%/.customclient/                    # Windows: AppData/Roaming
├── config/
│   ├── settings.json                       # Global launcher settings
│   ├── accounts.json                       # Encrypted auth tokens
│   └── profiles.json                       # Profile metadata index
├── instances/
│   ├── {profile-uuid}/
│   │   ├── instance.json                   # Per-instance config (JVM args, Java path, etc.)
│   │   ├── .minecraft/                     # Isolated game directory
│   │   │   ├── mods/
│   │   │   ├── config/
│   │   │   ├── resourcepacks/
│   │   │   ├── shaderpacks/
│   │   │   ├── saves/
│   │   │   ├── screenshots/
│   │   │   └── logs/
│   │   └── .content-lock.json              # Tracks installed mod versions, hashes
├── versions/
│   ├── 1.20.4/
│   │   ├── 1.20.4.json                    # Version manifest
│   │   └── 1.20.4.jar                     # Client JAR
│   ├── fabric-loader-0.15.11-1.20.4/
│   │   └── fabric-loader-0.15.11-1.20.4.json
│   └── ...
├── libraries/                              # Shared library JARs (deduplicated)
│   └── {maven-path}/{artifact}.jar
├── assets/                                 # Shared game assets (deduplicated)
│   ├── indexes/
│   │   └── 17.json
│   └── objects/
│       ├── 00/
│       │   └── 00a3f2...                   # Content-addressed storage
│       └── ...
├── java/                                   # Auto-downloaded Java runtimes
│   ├── java-17/
│   │   └── bin/java.exe
│   └── java-21/
│       └── bin/java.exe
├── cache/
│   ├── modrinth/                           # Cached Modrinth API responses
│   └── mojang/                             # Cached Mojang manifests
├── logs/
│   ├── launcher-2026-07-06.log
│   └── launcher-2026-07-05.log
└── temp/                                   # Temporary downloads, extraction workspace
```

**Why this structure:**
- **Instance isolation**: Each profile gets its own `.minecraft` equivalent. Mods, configs, worlds, and screenshots are completely separate. No cross-contamination.
- **Shared deduplication**: `libraries/` and `assets/` are shared across all instances. A library JAR downloaded for one profile is reused by all others. This saves gigabytes of disk space.
- **Content-addressed assets**: Mojang's asset system uses SHA1 hashes as filenames. We follow this convention for integrity verification.
- **Separate Java runtimes**: Multiple Java versions can coexist. A 1.8.9 profile uses Java 8, a 1.20.4 profile uses Java 17.
- **Encrypted accounts**: Auth tokens are encrypted at rest using DPAPI (Windows) or Keychain (macOS).
- **Not `.minecraft`**: Using a dedicated `.customclient` directory avoids conflicts with the official launcher and other third-party launchers.

### 3.4 State Management Architecture

```mermaid
graph TD
    subgraph "Zustand Stores (Renderer)"
        PS["useProfileStore"]
        AS["useAuthStore"]
        SS["useSettingsStore"]
        DS["useDownloadStore"]
        LS["useLaunchStore"]
    end

    subgraph "IPC Layer"
        IPC["Typed IPC Channels"]
    end

    subgraph "Main Process Services"
        PM["ProfileManager"]
        AUTH["AuthService"]
        SETTINGS["SettingsStore"]
        DLM["DownloadManager"]
        LE["LaunchEngine"]
    end

    PS <-->|"profile:list, profile:create, profile:update, profile:delete"| IPC
    AS <-->|"auth:login, auth:logout, auth:refresh, auth:status"| IPC
    SS <-->|"settings:get, settings:set, settings:getAll"| IPC
    DS <-->|"download:progress, download:complete, download:error"| IPC
    LS <-->|"launch:start, launch:progress, launch:status, launch:stop"| IPC

    IPC <--> PM & AUTH & SETTINGS & DLM & LE
```

**Key principle**: Stores are the *single source of truth* in the renderer. Components read from stores and dispatch actions. Stores communicate with the main process via IPC. This eliminates the current problem of duplicated state across `Home.tsx`, `Library.tsx`, and `InstallModal.tsx`.

### 3.5 Recommended Folder Structure

```
launcher/
├── electron/                               # MAIN PROCESS
│   ├── main.ts                             # Bootstrap, window creation, IPC registration
│   ├── preload.ts                          # contextBridge — the ONLY bridge to Node.js
│   ├── ipc/
│   │   ├── channels.ts                     # Channel name constants + type definitions
│   │   └── handlers/
│   │       ├── auth.handler.ts
│   │       ├── download.handler.ts
│   │       ├── filesystem.handler.ts
│   │       ├── java.handler.ts
│   │       ├── launch.handler.ts
│   │       ├── mod.handler.ts
│   │       ├── profile.handler.ts
│   │       └── settings.handler.ts
│   ├── services/
│   │   ├── auth/
│   │   │   ├── AuthService.ts              # Microsoft OAuth2 → MC token chain
│   │   │   ├── TokenStore.ts               # Encrypted persistence
│   │   │   └── auth.types.ts
│   │   ├── download/
│   │   │   ├── DownloadManager.ts          # Queue + concurrency + retry + progress
│   │   │   ├── HashVerifier.ts             # SHA1/SHA256/SHA512
│   │   │   └── download.types.ts
│   │   ├── minecraft/
│   │   │   ├── VersionManager.ts           # Mojang manifest resolution
│   │   │   ├── AssetManager.ts             # Asset index + object download
│   │   │   ├── LibraryManager.ts           # Library download + rule evaluation
│   │   │   ├── NativeExtractor.ts          # Platform native extraction
│   │   │   └── minecraft.types.ts
│   │   ├── loader/
│   │   │   ├── LoaderService.ts            # Abstract interface
│   │   │   ├── FabricLoader.ts
│   │   │   ├── ForgeLoader.ts
│   │   │   ├── NeoForgeLoader.ts
│   │   │   ├── QuiltLoader.ts
│   │   │   └── loader.types.ts
│   │   ├── java/
│   │   │   ├── JavaDetector.ts             # System scan
│   │   │   ├── JavaDownloader.ts           # Adoptium/Temurin API
│   │   │   └── java.types.ts
│   │   ├── launch/
│   │   │   ├── LaunchEngine.ts             # Orchestrator: validate → prepare → launch
│   │   │   ├── ClasspathBuilder.ts
│   │   │   ├── ArgumentBuilder.ts
│   │   │   ├── ProcessManager.ts           # Spawn + monitor + kill
│   │   │   └── launch.types.ts
│   │   ├── profile/
│   │   │   ├── ProfileManager.ts           # CRUD, persistence, migration
│   │   │   ├── InstanceManager.ts          # Instance directory lifecycle
│   │   │   └── profile.types.ts
│   │   ├── mod/
│   │   │   ├── ModManager.ts               # Install/remove/update/toggle
│   │   │   ├── ModResolver.ts              # Version + dependency resolution
│   │   │   ├── ModrinthClient.ts           # Typed Modrinth API wrapper
│   │   │   └── mod.types.ts
│   │   └── core/
│   │       ├── FileSystemService.ts        # Async FS abstraction
│   │       ├── PathResolver.ts             # Platform paths
│   │       ├── Logger.ts                   # File + console logging
│   │       ├── EventBus.ts                 # Typed EventEmitter
│   │       └── CacheManager.ts             # Response and file caching
│   └── utils/
│       ├── crypto.ts                       # Encryption helpers
│       └── platform.ts                     # OS detection
├── src/                                    # RENDERER PROCESS
│   ├── main.tsx
│   ├── App.tsx
│   ├── stores/
│   │   ├── useProfileStore.ts
│   │   ├── useAuthStore.ts
│   │   ├── useSettingsStore.ts
│   │   ├── useDownloadStore.ts
│   │   └── useLaunchStore.ts
│   ├── hooks/
│   │   ├── useIPC.ts                       # Typed IPC client hook
│   │   ├── useProfiles.ts
│   │   └── useLaunch.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── RightSidebar.tsx
│   │   │   └── TitleBar.tsx
│   │   ├── home/
│   │   │   └── Home.tsx
│   │   ├── library/
│   │   │   ├── Library.tsx
│   │   │   ├── ProfileCard.tsx
│   │   │   ├── ProfileDetails.tsx
│   │   │   └── CreateProfileModal.tsx
│   │   ├── marketplace/
│   │   │   ├── Marketplace.tsx
│   │   │   ├── ModCard.tsx
│   │   │   ├── ModDetails.tsx
│   │   │   └── FilterSidebar.tsx
│   │   ├── modpack/
│   │   │   ├── ModpackWindow.tsx
│   │   │   ├── ModsTab.tsx
│   │   │   ├── ResourcePacksTab.tsx
│   │   │   ├── VersionsTab.tsx
│   │   │   ├── JavaTab.tsx
│   │   │   └── ExportTab.tsx
│   │   ├── settings/
│   │   │   └── Settings.tsx                # Keep monolithic for now, decompose later
│   │   ├── social/
│   │   │   └── FriendsHub.tsx              # Keep as-is (mock data)
│   │   ├── screenshots/
│   │   │   └── Screenshots.tsx
│   │   ├── launch/
│   │   │   ├── LaunchButton.tsx
│   │   │   ├── LaunchProgress.tsx
│   │   │   └── ConsoleViewer.tsx
│   │   └── common/
│   │       ├── CustomDropdown.tsx
│   │       ├── ProgressBar.tsx
│   │       ├── Toast.tsx
│   │       ├── Modal.tsx
│   │       └── ErrorBoundary.tsx
│   ├── styles/
│   │   ├── index.css                       # Keep current single file until > 800 lines
│   │   └── variables.css                   # Extract CSS custom properties
│   ├── types/
│   │   ├── profile.ts
│   │   ├── minecraft.ts
│   │   ├── auth.ts
│   │   ├── ipc.ts
│   │   └── mod.ts
│   └── utils/
│       ├── defaultProfiles.ts
│       └── avatars.ts                      # Consolidate mc-heads.net helper
├── package.json
├── vite.config.ts
└── tsconfig.*.json
```

---

## PART 4: LAUNCH ENGINE — DEEP DESIGN

This is the most important system in the entire launcher. Everything else exists to support this.

### 4.1 Launch Lifecycle (Detailed)

```mermaid
sequenceDiagram
    participant User
    participant UI as LaunchButton
    participant Store as useLaunchStore
    participant IPC
    participant Engine as LaunchEngine
    participant Auth as AuthService
    participant Java as JavaManager
    participant Version as VersionManager
    participant DL as DownloadManager
    participant Classpath as ClasspathBuilder
    participant Args as ArgumentBuilder
    participant Proc as ProcessManager

    User->>UI: Click "LAUNCH GAME"
    UI->>Store: dispatch(startLaunch(profileId))
    Store->>IPC: launch:start(profileId)
    IPC->>Engine: launch(profileId)

    Note over Engine: PHASE 1: VALIDATION
    Engine->>Engine: Load profile from profiles.json
    Engine->>Engine: Validate profile has version + loader

    alt Profile invalid
        Engine-->>IPC: launch:error("Invalid profile")
        IPC-->>Store: setError(msg)
        Store-->>UI: Show error toast
    end

    Note over Engine: PHASE 2: AUTHENTICATION
    Engine->>Auth: getValidToken()
    Auth->>Auth: Check stored token expiry

    alt Token valid
        Auth-->>Engine: {accessToken, uuid, username}
    else Token expired
        Auth->>Auth: Refresh via Microsoft OAuth
        alt Refresh successful
            Auth-->>Engine: {accessToken, uuid, username}
        else Refresh failed
            Auth-->>Engine: NEEDS_REAUTH
            Engine-->>IPC: launch:needsAuth
            IPC-->>Store: setNeedsAuth(true)
            Store-->>UI: Show "Please re-login" modal
        end
    end

    alt Offline mode
        Engine->>Engine: Generate offline UUID
        Note over Engine: Skip auth entirely
    end

    Note over Engine: PHASE 3: JAVA
    Engine->>Java: findJava(profile.javaVersion)
    
    alt Java found
        Java-->>Engine: /path/to/java
    else Not found
        Java->>DL: downloadJRE(requiredVersion)
        DL-->>IPC: download:progress(...)
        IPC-->>Store: updateProgress(...)
        Store-->>UI: Show "Downloading Java 17..."
        DL-->>Java: /path/to/downloaded/java
        Java-->>Engine: /path/to/java
    end

    Note over Engine: PHASE 4: GAME FILES
    Engine->>Version: ensureInstalled(versionId, loader)
    
    par Download client JAR
        Version->>DL: downloadIfMissing(clientJar)
    and Download libraries
        Version->>DL: downloadAll(libraries[])
    and Download assets
        Version->>DL: downloadAll(assetObjects[])
    and Install mod loader
        Version->>DL: installLoader(fabric/forge/quilt/neoforge)
    end

    DL-->>IPC: download:progress(total, completed, currentFile)
    IPC-->>Store: updateProgress(...)
    Store-->>UI: "Downloading: 847/1203 files"

    Version->>Version: extractNatives(platform)
    Version-->>Engine: installationReady

    Note over Engine: PHASE 5: BUILD LAUNCH COMMAND
    Engine->>Classpath: build(version, loader, libraries)
    Classpath-->>Engine: classpathString

    Engine->>Args: build(profile, auth, classpath)
    Args-->>Engine: {jvmArgs[], gameArgs[]}

    Note over Engine: PHASE 6: SPAWN
    Engine->>Proc: spawn(javaPath, jvmArgs, mainClass, gameArgs, {cwd: instanceDir})
    Proc-->>IPC: launch:started(pid)
    IPC-->>Store: setRunning(pid)
    Store-->>UI: "Game Running ●"

    loop While game is running
        Proc-->>IPC: launch:stdout(line)
        IPC-->>Store: appendLog(line)
        Store-->>UI: Console Viewer updates
    end

    Proc-->>IPC: launch:exited(code)
    IPC-->>Store: setStopped(exitCode)
    Store-->>UI: "Game Closed" or "Game Crashed (exit 1)"
```

### 4.2 Authentication Chain (Microsoft → Minecraft)

```mermaid
graph TD
    A["User clicks 'Sign In'"] --> B["Open system browser to Microsoft OAuth2"]
    B --> C["User signs in with Microsoft account"]
    C --> D["Receive authorization code via localhost redirect"]
    D --> E["Exchange code for Microsoft access token"]
    E --> F["Authenticate with Xbox Live"]
    F --> G["Obtain XSTS token"]
    G --> H["Authenticate with Minecraft Services API"]
    H --> I["Receive Minecraft access token + UUID + username"]
    I --> J["Check game ownership via /entitlements endpoint"]
    
    J -->|"Owns game"| K["Store encrypted tokens to accounts.json"]
    J -->|"Does NOT own game"| L["Show 'Game Not Owned' error"]
    
    K --> M["Ready to launch"]
    
    style A fill:#a855f7
    style M fill:#10b981
    style L fill:#ef4444
```

### 4.3 Argument Construction

The launch command follows Mojang's version JSON specification exactly:

```
java
  -Xmx{ram}G                              # RAM allocation from settings
  -Xms{ram/2}G                            # Minimum heap (half of max)
  -XX:+UseG1GC                            # GC from JVM args
  {custom JVM args}                       # User-defined JVM args
  -Djava.library.path={natives-dir}       # Native libraries path
  -cp {classpath}                         # All library JARs + client JAR
  {main-class}                            # net.minecraft.client.main.Main (or loader main)
  --username {username}                   # From auth
  --version {version}                     # e.g., "1.20.4"
  --gameDir {instance-dir}                # Profile's .minecraft directory
  --assetsDir {assets-dir}                # Shared assets directory
  --assetIndex {asset-index}              # e.g., "17"
  --uuid {uuid}                           # From auth
  --accessToken {token}                   # From auth
  --userType msa                          # Microsoft account type
  --versionType release                   # release/snapshot
  --width {width}                         # Window width from settings
  --height {height}                       # Window height from settings
```

---

## PART 5: MODPACK ECOSYSTEM DESIGN

### 5.1 Core Concepts (Original Design — NOT a copy of Modrinth or CurseForge)

The Custom Client modpack system is built around the concept of **Profiles** — first-class citizens that own everything.

```mermaid
graph TD
    subgraph "Profile (the atomic unit)"
        PROF["Profile"]
        PROF --> MC_VER["Minecraft Version"]
        PROF --> LOADER["Mod Loader + Version"]
        PROF --> MODS["Mod List (with versions + hashes)"]
        PROF --> RP["Resource Packs"]
        PROF --> SP["Shader Packs"]
        PROF --> WORLDS["Worlds/Saves"]
        PROF --> CONFIGS["Mod Configs"]
        PROF --> JVM["JVM Configuration"]
        PROF --> JAVA["Java Runtime"]
        PROF --> SCREENSHOTS["Screenshots"]
    end

    subgraph "Modpack (a shareable profile snapshot)"
        MP["Modpack Archive (.ccpack)"]
        MP --> MANIFEST["manifest.json"]
        MP --> MOD_REFS["Mod references (not JARs)"]
        MP --> CONFIG_FILES["Config overrides"]
        MP --> META["Metadata (name, author, description, icon)"]
    end

    PROF -->|"Export"| MP
    MP -->|"Import"| PROF
```

### 5.2 `.ccpack` Format (Custom Client Pack)

Instead of copying `.mrpack` or CurseForge's format, define our own that is:
- **Lightweight**: Contains mod *references* (source URL + version + hash), not the actual JARs. This avoids redistribution issues.
- **Complete**: Includes config files, resource pack references, shader references, and world save options.
- **Versionable**: Each `.ccpack` has a schema version so older launchers can gracefully handle newer formats.

```json
{
  "formatVersion": 1,
  "name": "ATYACHARI PRIV.",
  "version": "2.1.0",
  "author": "Atyachari",
  "description": "Custom PvP-focused modpack with enhanced visuals",
  "icon": "icon.png",
  "minecraft": {
    "version": "1.20.4",
    "loader": "fabric",
    "loaderVersion": "0.15.11"
  },
  "content": {
    "mods": [
      {
        "source": "modrinth",
        "projectId": "P7dR8mSH",
        "versionId": "abc123",
        "sha512": "deadbeef...",
        "required": true
      }
    ],
    "resourcePacks": [],
    "shaderPacks": [],
    "configs": ["options.txt", "config/sodium.json"]
  },
  "jvm": {
    "minMemoryMB": 2048,
    "recommendedMemoryMB": 4096,
    "args": ["-XX:+UseG1GC"]
  },
  "includes": {
    "worlds": false,
    "screenshots": false
  }
}
```

### 5.3 Profile Versioning & Updates

- Every profile change creates an internal version snapshot (stored in `instance.json` history).
- Modpack authors can publish updates. The launcher checks the modpack source for newer versions.
- Updates show a diff: "3 mods updated, 1 mod added, 0 removed, 2 configs changed."
- Users can accept or reject individual changes.
- World saves and screenshots are never overwritten by updates.

### 5.4 Dependency Resolution

```mermaid
graph LR
    USER["User installs Mod A"] --> CHECK["Check Mod A's dependencies"]
    CHECK --> DEP1["Requires Fabric API >= 0.90"]
    CHECK --> DEP2["Requires Mod B (library)"]
    DEP1 --> RESOLVE1["Find latest compatible Fabric API"]
    DEP2 --> RESOLVE2["Find latest compatible Mod B"]
    RESOLVE1 --> INSTALL1["Auto-install Fabric API"]
    RESOLVE2 --> INSTALL2["Auto-install Mod B"]
    INSTALL1 --> DONE["All dependencies satisfied"]
    INSTALL2 --> DONE
    
    style DONE fill:#10b981
```

- Dependencies are resolved recursively using Modrinth's dependency API.
- Circular dependencies are detected and reported.
- Users are shown what will be auto-installed before confirmation.
- Removing a mod offers to remove its exclusive dependencies (dependencies not used by other mods).

---

## PART 6: SOCIAL HUB — REDESIGNED

### 6.1 Architecture Decision

> **Challenge**: Building a real-time social system requires a backend (WebSocket server, database, user accounts). The project has no backend yet.

**My recommendation**: Design the Social Hub with two tiers:

| Tier | Features | Backend Required? |
|------|---------|------------------|
| **Tier 1 (Launch Day)** | Local friend list (manual add by username), Discord Rich Presence, Minecraft server status checking, activity tracking (local), recently played servers | ❌ No |
| **Tier 2 (Post-Launch)** | Real-time presence, messaging, party launching, shared instances, communities, activity feed | ✅ Yes |

### 6.2 Tier 1 Features (No Backend)

- **Friend List**: Add friends by Minecraft username. Their avatar loads from mc-heads.net. No online/offline status (requires backend).
- **Activity Feed (Local)**: Track which profiles the user launched, when, and for how long. "You played ATYACHARI PRIV. for 2h 14m yesterday."
- **Server Status**: Ping Minecraft servers to show player count and MOTD. "Hypixel: 47,293 players online."
- **Discord Rich Presence**: Show "Playing Minecraft 1.20.4 via Custom Client" on Discord.
- **Recently Played**: Show last 5 profiles launched with play time.

### 6.3 Tier 2 Features (With Backend — Future)

- **Real-time Presence**: Show actual online/offline/in-game status.
- **Rich Status**: "Playing Bedwars on Hypixel (17 kills, 3 deaths)" — pulled from in-game mod.
- **Chat**: Encrypted DMs between friends.
- **Groups/Communities**: Create and join communities. Share modpacks within communities.
- **Party Launching**: Invite friends to launch the same profile and join the same server.
- **Activity Feed (Social)**: See what friends are playing, recent achievements, new profiles created.
- **Privacy Controls**: Per-friend visibility settings, invisible mode, blocking.
- **Cross-Profile Messaging**: Messages persist across profile switches.

---

## PART 7: MISSION CENTER — REIMAGINED

### 7.1 What It Should Become

The Mission Center is the launcher's **engagement hub** — the reason users come back even when they're not playing Minecraft.

| Section | Content | Source |
|---------|---------|--------|
| **News** | Minecraft updates, Mojang announcements, launcher patch notes | RSS/API |
| **Your Stats** | Play time per profile, total mods installed, screenshots taken | Local tracking |
| **Challenges** | "Play 10 hours this week", "Try 3 new mods", "Launch 5 different profiles" | Local gamification |
| **Creator Spotlights** | Featured modpack creators and their builds | Curated (future backend) |
| **Learning Center** | Guides: "How to optimize Minecraft", "Setting up Optifine alternatives", "Fabric vs Forge" | Static content |
| **Changelog** | Launcher version history with visual diffs | Bundled with launcher |

### 7.2 Implementation Approach

**Phase 1 (Launch)**: Static content — Launcher changelog, hardcoded tips, local play statistics.  
**Phase 2 (Post-Launch)**: Dynamic content — RSS feed for Minecraft news, challenge system with progress tracking.  
**Phase 3 (With Backend)**: Community content — Creator spotlights, user-submitted guides, achievement sharing.

---

## PART 8: MONETIZATION — ETHICAL DESIGN

### 8.1 Revenue Strategy Comparison

| Strategy | Revenue Potential | User Experience Impact | Recommendation |
|----------|------------------|----------------------|----------------|
| **Banner ads** | Low-Medium | 🔴 Negative — degrades premium feel | ❌ Avoid |
| **Video ads** | Medium | 🔴 Very Negative — hostile | ❌ Never |
| **Premium membership (Client+)** | High | 🟢 Positive — users opt in | ✅ **Primary revenue** |
| **Marketplace commission** | Medium-High (long-term) | 🟢 Neutral — standard platform fee | ✅ **Secondary revenue** |
| **Cosmetics (capes, launcher themes)** | Medium | 🟢 Positive — fun, optional | ✅ Tertiary |
| **Promoted content in Mission Center** | Low | 🟡 Neutral if not intrusive | 🟡 Maybe |
| **Affiliate links (server hosting)** | Low | 🟡 Neutral if relevant | 🟡 Maybe |
| **Telemetry data sales** | Medium | 🔴 Very Negative — trust killer | ❌ Never |

### 8.2 Recommended Model: **Custom Client+**

A voluntary premium tier. **The free launcher must be fully functional.** Premium adds convenience and cosmetics, never gates core functionality.

| Feature | Free | Client+ |
|---------|------|---------|
| Launch Minecraft | ✅ | ✅ |
| All mod loaders | ✅ | ✅ |
| Modrinth integration | ✅ | ✅ |
| Unlimited profiles | ✅ | ✅ |
| Profile import/export | ✅ | ✅ |
| Cloud sync | ❌ | ✅ |
| Priority download servers | ❌ | ✅ |
| Custom launcher themes | Basic (3) | Unlimited |
| Cosmetics (capes via mod) | ❌ | ✅ |
| Ad-free experience | Has subtle "Client+" promo | ✅ |
| Early access to features | ❌ | ✅ |
| Support priority | Community | Direct |

### 8.3 Current Ad Placement

The existing `RightSidebar.tsx` has an ad placeholder with a "Subscribe to Client+" CTA and a "Remove Ads" link. **This is the correct pattern.** Keep it, but ensure:
- The ad area is never larger than the current 120px height.
- The ad never auto-plays video or audio.
- The "Remove Ads" button actually removes it (store preference).
- Consider replacing the ad space with "Your Stats" or "Recently Played" for free users instead of actual advertising.

---

## PART 9: IMPLEMENTATION ROADMAP

### Milestone Overview

```mermaid
gantt
    title Custom Client Implementation Roadmap
    dateFormat  YYYY-MM-DD
    axisFormat  %b %d

    section Milestone 1: Foundation
    Security & IPC           :m1a, 2026-07-07, 7d
    Filesystem & Config      :m1b, after m1a, 7d

    section Milestone 2: Core Services
    State Centralization     :m2a, after m1b, 7d
    Download Engine          :m2b, after m2a, 10d

    section Milestone 3: Game Infrastructure
    Minecraft Versions       :m3a, after m2b, 14d
    Java Management          :m3b, after m3a, 7d
    Authentication           :m3c, after m3a, 14d

    section Milestone 4: Loaders & Launch
    Mod Loader Installers    :m4a, after m3b, 10d
    Launch Engine            :m4b, after m4a, 14d
    MINECRAFT LAUNCHES 🎮   :milestone, after m4b, 0d

    section Milestone 5: Content Management
    Real Mod Management      :m5a, after m4b, 14d
    Resource/Shader Packs    :m5b, after m5a, 7d
    Profile Import/Export    :m5c, after m5a, 7d

    section Milestone 6: Polish & Ship
    UI Decomposition         :m6a, after m5c, 10d
    Testing                  :m6b, after m6a, 14d
    Packaging & Release      :m6c, after m6b, 7d
    V1.0 RELEASE 🚀         :milestone, after m6c, 0d
```

---

### Milestone 1: Foundation
**Duration**: ~2 weeks | **Risk**: Low | **Complexity**: Medium

#### Purpose
Establish the security model, IPC bridge, filesystem abstraction, and configuration system that every future feature depends on. Without this, nothing else can be built safely.

#### Deliverables
1. `contextIsolation: true` + `sandbox: true` in Electron config
2. Typed `preload.ts` with `contextBridge` exposing only necessary APIs
3. `FileSystemService` — async file operations via IPC
4. `PathResolver` — platform-specific path computation
5. `SettingsStore` — JSON file-based settings persistence
6. `Logger` — structured file + console logging
7. All existing `localStorage` settings migrated to file-based storage
8. Zustand installed and configured with initial store shells
9. All components refactored to use centralized state (no more scattered `useLocalStorage`)

#### Success Criteria
- [ ] Renderer process cannot access `require`, `fs`, `child_process`, or `os`
- [ ] All file operations go through IPC channels
- [ ] Settings persist across Electron cache clears
- [ ] Zero `localStorage` usage for launcher configuration

#### Testing Strategy
- Manual: Clear Electron cache → settings survive
- Manual: Open DevTools in renderer → `require` is undefined
- Manual: All existing UI functionality works identically

---

### Milestone 2: Core Services
**Duration**: ~2.5 weeks | **Risk**: Medium | **Complexity**: High

#### Purpose
Build the download engine and profile system that all content acquisition and game launching depends on.

#### Deliverables
1. `DownloadManager` — queue-based with concurrency control (max 8 parallel), retry with backoff, progress tracking, SHA hash verification, resume support
2. `HashVerifier` — SHA1 (Mojang), SHA256, SHA512 (Modrinth)
3. `ProfileManager` — CRUD operations, `profiles.json` persistence, UUIDs for profile IDs
4. `InstanceManager` — create/delete instance directories
5. `useProfileStore` — Zustand store in renderer
6. `useDownloadStore` — progress state in renderer
7. `ProgressBar`, `Toast`, `ErrorBoundary` common components
8. Profile creation UI flow (Name → Version → Loader → Create)
9. Profile deletion with confirmation

#### Success Criteria
- [ ] Can create, edit, and delete profiles that persist across restarts
- [ ] Download manager can download 100 files concurrently with progress reporting
- [ ] Hash verification catches corrupted downloads
- [ ] Toast notifications appear for success/error states

#### Testing Strategy
- Unit test: `DownloadManager` with mock HTTP (happy path, retry, failure)
- Unit test: `HashVerifier` with known SHA hashes
- Unit test: `ProfileManager` CRUD operations
- Manual: Create profile → restart launcher → profile still exists

---

### Milestone 3: Game Infrastructure
**Duration**: ~5 weeks | **Risk**: High | **Complexity**: Very High

#### Purpose
Download and manage vanilla Minecraft installations, detect/download Java runtimes, and authenticate with Microsoft.

#### Deliverables
1. `VersionManager` — fetch Mojang `version_manifest_v2.json`, parse version JSONs
2. `AssetManager` — download asset index + all asset objects (content-addressed)
3. `LibraryManager` — download libraries with Mojang rule evaluation, platform filtering
4. `NativeExtractor` — extract platform-specific natives (LWJGL, OpenAL)
5. `JavaDetector` — scan PATH, registry (Windows), common dirs for Java installations
6. `JavaDownloader` — download Adoptium JRE via their API
7. `AuthService` — complete Microsoft OAuth2 → Xbox Live → XSTS → Minecraft token chain
8. `TokenStore` — encrypted token persistence
9. Multi-account support in UI
10. Offline mode option

#### Dependencies
- Milestone 2 (DownloadManager, ProfileManager, FileSystemService)

#### Success Criteria
- [ ] Can download a complete vanilla Minecraft 1.20.4 installation (client JAR + libraries + assets)
- [ ] Java 17 is auto-detected or auto-downloaded
- [ ] User can sign in with Microsoft account and token persists across restarts
- [ ] User can switch between multiple accounts
- [ ] Offline mode generates a valid offline UUID

#### Testing Strategy
- Integration test: Download full vanilla 1.20.4 → verify all files exist with correct hashes
- Manual: Sign in with Microsoft → sign out → token is wiped
- Manual: Sign in → restart launcher → still authenticated (token refresh)
- Manual: Test on machine with no Java installed → auto-download triggers

#### Risks
- Microsoft OAuth2 requires an Azure AD app registration. The user needs to create this.
- Mojang's version manifest format may change (rare but possible).
- Java detection on Linux is complex (multiple package managers, multiple locations).

---

### Milestone 4: Loaders & Launch Engine ⭐ **THE CRITICAL PATH**
**Duration**: ~3.5 weeks | **Risk**: Very High | **Complexity**: Very High

#### Purpose
Install mod loaders and build the complete launch pipeline. **This milestone ends with Minecraft actually launching.**

#### Deliverables
1. `LoaderService` — abstract interface for all loaders
2. `FabricLoader` — Fabric Meta API integration, loader + intermediary download
3. `ForgeLoader` — Forge installer processing
4. `NeoForgeLoader` — NeoForge artifact resolution
5. `QuiltLoader` — Quilt Meta API integration
6. `ClasspathBuilder` — assemble all JARs into classpath string
7. `ArgumentBuilder` — construct full JVM + game argument arrays from version JSON template
8. `LaunchEngine` — orchestrator that validates, prepares, and launches
9. `ProcessManager` — spawn Java, capture stdout/stderr, monitor lifecycle
10. `ConsoleViewer` — real-time log viewer in the launcher UI
11. `LaunchProgress` — download/preparation progress indicator
12. Wire `LAUNCH GAME` buttons to the real pipeline

#### Dependencies
- Milestone 3 (VersionManager, JavaManager, AuthService)

#### 🎮 Success Criteria
- [ ] **User clicks "LAUNCH GAME" → Minecraft opens and runs**
- [ ] Works with Fabric loader on 1.20.4
- [ ] Works with Forge on 1.20.4
- [ ] Works with vanilla (no loader)
- [ ] Console viewer shows game logs in real-time
- [ ] Exit code is captured and displayed
- [ ] Crash is detected and user is notified

#### Testing Strategy
- **End-to-end**: Click Launch → Minecraft main menu appears → join single player → quit
- Test each loader: Vanilla, Fabric, Forge, NeoForge, Quilt
- Test each version: 1.8.9 (Java 8), 1.19.4 (Java 17), 1.20.4 (Java 17), 1.21.1 (Java 21)
- Test offline mode launch
- Test crash scenario (corrupt JAR → graceful error)

#### Risks
- **Classpath ordering matters** — some mods require specific library ordering
- **Forge installer is complex** — it patches the client JAR and generates a custom version JSON
- **Native extraction varies by platform** — Windows (.dll), macOS (.dylib), Linux (.so)
- **JVM argument templates in version JSON use variable substitution** — must implement the template engine correctly

---

### Milestone 5: Content Management
**Duration**: ~3.5 weeks | **Risk**: Medium | **Complexity**: High

#### Purpose
Make mod, resource pack, and shader pack management real (actual file downloads, not localStorage ID tracking).

#### Deliverables
1. `ModManager` — download mod JARs to profile `mods/` directory
2. `ModResolver` — resolve compatible mod versions for profile's MC version + loader
3. `ModrinthClient` — typed wrapper around Modrinth API v2
4. Dependency auto-resolution (install required library mods)
5. Mod toggle (rename `.jar` ↔ `.jar.disabled`)
6. Mod update checking
7. Resource pack filesystem management
8. Shader pack filesystem management
9. `.ccpack` export format
10. `.ccpack` + `.mrpack` import support

#### Success Criteria
- [ ] Install a mod from Marketplace → JAR appears in profile's `mods/` folder
- [ ] Launch game → mod is active in-game
- [ ] Remove mod → JAR is deleted
- [ ] Disable mod → JAR is renamed to `.disabled`
- [ ] Export profile → `.ccpack` file is created
- [ ] Import `.ccpack` → new profile is created with all mods installed

---

### Milestone 6: Polish & Ship
**Duration**: ~4.5 weeks | **Risk**: Low | **Complexity**: Medium

#### Purpose
Decompose large components, add error handling, test thoroughly, and package for distribution.

#### Deliverables
1. Decompose `Marketplace.tsx` (722 lines) into `ModCard`, `ModDetails`, `FilterSidebar`
2. Decompose `ModpackWindow.tsx` (364 lines) into tab components
3. Add error boundaries to every route-level component
4. Add markdown rendering for Modrinth mod descriptions
5. Compress images to WebP
6. Remove dead assets and empty scaffolding directories
7. Full test suite (unit + integration)
8. Cross-platform testing (Windows 10/11, macOS, Linux)
9. `electron-builder` configuration for Windows NSIS, macOS DMG, Linux AppImage
10. Release workflow (GitHub Actions)

#### Success Criteria
- [ ] Zero unhandled exceptions in normal usage
- [ ] All Milestone 4 launch tests pass on Windows, macOS, and Linux
- [ ] Installer size < 200MB
- [ ] Cold start time < 3 seconds

---

## PART 10: NEW DEPENDENCIES REQUIRED

| Package | Purpose | Phase |
|---------|---------|-------|
| `zustand` | Lightweight state management | Milestone 1 |
| `electron-store` or custom | File-based settings (or build custom with `fs`) | Milestone 1 |
| `got` or `undici` | HTTP client with retry, streams, progress | Milestone 2 |
| `adm-zip` or `yauzl` | ZIP extraction for natives + modpack import | Milestone 3 |
| `keytar` | OS keychain integration for token encryption | Milestone 3 |
| `marked` or `markdown-it` | Markdown rendering for mod descriptions | Milestone 6 |
| `electron-updater` | Auto-update support | Post-v1.0 |
| `discord-rpc` | Discord Rich Presence | Post-v1.0 |

---

## PART 11: WHAT I ADDED THAT YOU FORGOT

| Feature | Why It's Important |
|---------|-------------------|
| **Config schema migration** | When the launcher updates, old `settings.json` may be incompatible. Need versioned schemas with automatic migration. |
| **Crash report parser** | When Minecraft crashes, parse the crash log to show the user what went wrong (mod conflict, out of memory, etc.) in human-readable format. |
| **Instance directory locking** | Prevent launching two instances of the same profile simultaneously. Use file locks. |
| **Download resume** | If the launcher closes mid-download, resume from where it left off using HTTP Range headers. |
| **Rate limiting for Modrinth** | Current 50ms debounce will hit their 300 req/min limit. Implement proper rate limiting with token bucket. |
| **Startup migration wizard** | First-launch experience: detect existing `.minecraft` installation, offer to import vanilla profiles. |
| **Profile templates** | Pre-built templates: "PvP Optimized", "Creative Building", "Modded Adventure", "Vanilla+" that auto-install recommended mods. |
| **Disk space checking** | Before downloading 2GB of assets, check if the user has enough disk space. |
| **Network connectivity detection** | Gracefully handle offline scenarios — show cached data, allow offline launches, queue downloads. |
| **Platform-specific keyboard shortcuts** | Ctrl on Windows/Linux, Cmd on macOS. Current code ignores this. |
| **Accessibility** | Keyboard navigation, screen reader labels, high contrast mode, reduced motion preference (not just "performance mode"). |
| **Localization infrastructure** | i18n system from the start. Don't hardcode English strings. Use message keys. |

---

## OPEN QUESTIONS FOR YOUR REVIEW

> [!IMPORTANT]
> These questions directly impact implementation decisions. Please provide direction.

1. **Microsoft Azure AD Application**: Launching Minecraft online requires a registered Azure AD app for OAuth2. Do you have one, or should the roadmap include creating one?

2. **State Management Library**: I recommend **Zustand** (lightweight, TypeScript-native, no boilerplate). Do you have a preference for Redux, Jotai, or another library?

3. **Auth Flow UX**: Two options:
   - **Device Code Flow**: Show a code in the launcher, user opens browser to log in. Simpler, more secure, works everywhere.
   - **Embedded Browser**: Open Microsoft login inside the launcher window. More seamless but more complex and potential security concern.
   
   I recommend Device Code Flow. Your preference?

4. **CurseForge Integration**: Should the Marketplace also search CurseForge, or Modrinth-only? CurseForge requires an API key and has stricter redistribution rules.

5. **Launcher Name**: "Custom Client" is a working title. For branding, SEO, and marketplace presence, a unique name would help. Is the final name decided?

6. **Target Audience**: Is this launcher aimed at:
   - (a) Technical users who want full control (like Prism Launcher / MultiMC)
   - (b) Casual players who want easy modpacks (like CurseForge App / Modrinth App)
   - (c) Competitive/PvP players who want performance (like Lunar Client / Badlion)
   - (d) All of the above
   
   This determines UI complexity, default settings, and onboarding flow.

7. **Scope Confirmation**: Do you agree with killing the CEF in-game overlay and dynamic Java compilation features? These were core to the original vision but add massive complexity for questionable value. Standard Fabric modding achieves the same goals with vastly less engineering effort.

---

> [!CAUTION]
> **Do NOT begin implementation until these questions are answered.** The answers directly determine Sprint 1 implementation details.

---
---

# ARCHITECTURE REVIEW APPENDIX

> **Senior Architecture Review**  
> **Date**: July 6, 2026  
> **Purpose**: Final design-quality audit before implementation begins. Every recommendation answers: *why it should exist, what problem it solves, how it improves the launcher, and what future issue it prevents.*

---

## SECTION 1: PRODUCT VISION

### 1.1 Who Is This Launcher Built For?

**Primary audience**: Minecraft Java Edition players who want a **single app that replaces the official launcher, CurseForge App, and Prism Launcher combined** — but with a visual experience that rivals Lunar Client.

**Psychographic profile**:
- Ages 14-28, technically literate enough to install mods, but don't want to manage folder structures manually.
- Frustrated by the official launcher's lack of mod support and ugly UI.
- Want Lunar's polish without Lunar's restrictions (Lunar locks you to their mod set).
- Want Prism's power without Prism's intimidating UI.
- Want CurseForge/Modrinth's mod catalog without needing a separate app.

### 1.2 Why Should Someone Use This Over Competitors?

| Competitor | Their Weakness | Our Advantage |
|-----------|---------------|--------------|
| **Official Launcher** | No mod support, slow, ugly, no profile isolation | Full mod ecosystem, premium UI, instance isolation |
| **Lunar Client** | Locked mod set, no custom mods, no Forge, proprietary | Open mod ecosystem, all loaders, user freedom |
| **Badlion Client** | Same restrictions as Lunar, declining community | Same advantages as above |
| **Prism Launcher** | Functional but visually austere, intimidating for new users | Premium glassmorphism UI, guided onboarding, integrated marketplace |
| **MultiMC** | Dated UI, manual mod management, no integrated search | Integrated Modrinth browser, auto-dependency resolution |
| **CurseForge App** | Bloated (Overwolf), ads, tracks users, slow | Lightweight, no spyware, no ads in core experience |
| **Modrinth App** | Young project, limited features, no social layer | Social hub, mission center, premium membership model |

### 1.3 Core Principles

1. **The launcher must be invisible.** The best launcher is one you forget exists. Click launch, Minecraft runs. Everything else is convenience.
2. **User freedom above all.** Never restrict which mods, loaders, or versions a user can run. We are a launcher, not a walled garden.
3. **Premium by default.** Every screen, every animation, every interaction should feel like it belongs in a $60 product — even though it's free.
4. **Privacy is not negotiable.** No telemetry without explicit consent. No selling data. Ever.
5. **Fail gracefully.** The launcher should never show a white screen, an unhandled exception, or a cryptic error message.

### 1.4 What Will NOT Exist (Intentional Exclusions)

| Excluded Feature | Reason |
|-----------------|--------|
| CEF in-game overlay | Massive engineering cost, security liability, performance hit. Standard Fabric rendering API achieves the same result. |
| Runtime Java compilation | Malware vector. No mainstream launcher does this. Use standard mod API. |
| Built-in code editor / Studio | Scope creep. Ship the launcher first. An IDE-like editor is a separate product. |
| Server hosting integration | Out of scope. Launchers launch games, they don't host servers. |
| Blockchain / NFT anything | Hostile to users, damages trust, adds zero value. |
| In-game anti-cheat | Not a client mod's responsibility. Servers handle anti-cheat. |
| Built-in VPN | Out of scope and a legal minefield. |
| Video recording / streaming | Minecraft itself and OBS handle this. Don't duplicate. |

### 1.5 Long-Term Vision (3 Years)

**Year 1**: Ship a fully functional launcher that can launch any Minecraft Java version with any loader and any mod. Achieve 10,000 active users.

**Year 2**: Launch the custom marketplace. Modpack creators can publish and share curated experiences. Introduce Client+ premium tier. Social Hub goes live with real backend. Launch on macOS and Linux.

**Year 3**: Become a recognized name alongside Prism and Modrinth App. Editor Studio ships as a companion app. Community features (groups, servers, events) go live. 100,000+ active users.

---

## SECTION 2: PRODUCT DESIGN — USER JOURNEYS

### 2.1 First Launch (New User)

```mermaid
stateDiagram-v2
    [*] --> SplashScreen: App opens
    SplashScreen --> WelcomeWizard: First run detected

    state WelcomeWizard {
        W1: "Welcome to Custom Client"
        W2: Detect existing .minecraft
        W3: Offer import (worlds, screenshots, resource packs)
        W4: Detect Java installations
        W5: Recommend RAM allocation (based on system RAM)
        W6: Choose data directory
        W7: Sign in with Microsoft (optional, can skip)
        W8: Choose starter template or blank profile
        W9: Download required files
        
        W1 --> W2
        W2 --> W3: Found .minecraft
        W2 --> W4: No .minecraft
        W3 --> W4
        W4 --> W5
        W5 --> W6
        W6 --> W7
        W7 --> W8
        W8 --> W9
    }

    WelcomeWizard --> Ready: Setup complete
    Ready --> [*]
```

### 2.2 Returning User (Normal Session)

```mermaid
stateDiagram-v2
    [*] --> Boot
    Boot --> LoadConfig: Read settings.json
    LoadConfig --> LoadAccounts: Read accounts.json
    LoadAccounts --> RefreshTokens: Silently refresh expired tokens
    RefreshTokens --> LoadProfiles: Read profiles.json
    LoadProfiles --> CheckUpdates: Check for launcher updates (background)
    CheckUpdates --> Ready: Home screen displayed

    Ready --> SelectProfile: User clicks a profile
    SelectProfile --> ClickLaunch: User clicks LAUNCH
    ClickLaunch --> ValidateFiles: Quick hash check
    ValidateFiles --> Launch: All files OK
    ValidateFiles --> Repair: Files missing/corrupt
    Repair --> Launch: Repair complete
    Launch --> Running: Minecraft window opens
    Running --> GameClosed: User quits Minecraft
    GameClosed --> Ready: Return to launcher
```

### 2.3 Offline User

```mermaid
stateDiagram-v2
    [*] --> Boot
    Boot --> DetectNetwork: Check connectivity
    DetectNetwork --> OfflineMode: No internet

    state OfflineMode {
        O1: Load cached settings
        O2: Load cached profiles
        O3: Show "Offline" indicator in UI
        O4: Disable Marketplace (gray out)
        O5: Disable auth-dependent features
        O6: Allow launching with cached auth token OR offline UUID
        O7: Queue any pending downloads for when online
        
        O1 --> O2 --> O3 --> O4 --> O5 --> O6
    }

    OfflineMode --> OfflineReady
    OfflineReady --> Launch: Launch with existing files
    Launch --> Running: Game starts (if files exist)
    
    DetectNetwork --> OnlineMode: Internet available
    OnlineMode --> Ready: Normal flow
```

### 2.4 Microsoft Login Flow

```mermaid
stateDiagram-v2
    [*] --> ClickSignIn: User clicks "Sign In"
    ClickSignIn --> ShowDeviceCode: Display code + URL

    state "Device Code Flow" as DCF {
        DC1: Show code (e.g., "ABCD-EFGH")
        DC2: Show URL (microsoft.com/link)
        DC3: Open system browser automatically
        DC4: Poll Microsoft token endpoint every 5s
        DC5: User enters code in browser
        DC6: User authenticates with Microsoft
        DC7: Polling receives authorization code
        
        DC1 --> DC2 --> DC3 --> DC4
        DC4 --> DC4: Still waiting...
        DC5 --> DC6 --> DC7
    }

    ShowDeviceCode --> DCF
    DCF --> ExchangeTokens: Auth code received
    ExchangeTokens --> XboxLive: MS token → XBL token
    XboxLive --> XSTS: XBL → XSTS token
    XSTS --> MinecraftAuth: XSTS → MC access token + UUID
    MinecraftAuth --> CheckOwnership: Verify game entitlement
    CheckOwnership --> StoreTokens: Game owned ✓
    CheckOwnership --> ShowError: Game NOT owned ✗
    StoreTokens --> Ready: "Welcome, {username}!"
    ShowError --> [*]: "You don't own Minecraft Java Edition"

    note right of DCF: Timeout after 15 minutes.\nShow "Code expired, try again."
```

### 2.5 Creating First Profile

```mermaid
stateDiagram-v2
    [*] --> ClickNewProfile: User clicks "+ New Profile"

    state CreateProfileModal {
        S1: Enter profile name
        S2: Select Minecraft version (dropdown, fetched from Mojang)
        S3: Select mod loader (Vanilla / Fabric / Forge / NeoForge / Quilt)
        S4: Select loader version (auto-populated)
        S5: (Optional) Choose template (PvP, Creative, Vanilla+)
        S6: (Optional) Set custom game directory
        S7: Review summary
        S8: Click "Create"
        
        S1 --> S2 --> S3 --> S4 --> S5 --> S6 --> S7 --> S8
    }

    ClickNewProfile --> CreateProfileModal
    CreateProfileModal --> CreateInstanceDir: mkdir instances/{uuid}
    CreateInstanceDir --> DownloadVersion: Download MC version JSON + client JAR
    DownloadVersion --> DownloadLibraries: Download all required libraries
    DownloadLibraries --> DownloadAssets: Download asset index + objects
    DownloadAssets --> InstallLoader: Install selected mod loader
    InstallLoader --> ProfileReady: Profile appears in Library
    ProfileReady --> [*]: Ready to launch
```

### 2.6 Error Recovery (User Perspective)

```mermaid
stateDiagram-v2
    [*] --> ClickLaunch
    ClickLaunch --> PreflightCheck

    state PreflightCheck {
        PC1: Validate profile config
        PC2: Check Java availability
        PC3: Verify core game files (quick hash spot-check)
        PC4: Verify auth token validity
    }

    PreflightCheck --> LaunchOK: All checks pass
    PreflightCheck --> ShowError: Check failed

    state ShowError {
        E1: "Java 17 not found" → Auto-download Java
        E2: "Game files corrupted" → Auto-repair (re-download)
        E3: "Authentication expired" → Re-login prompt
        E4: "Disk full" → Show space needed, suggest cleanup
        E5: "Profile corrupted" → Offer repair or recreate
    }

    ShowError --> Repair: User clicks "Repair"
    Repair --> PreflightCheck: Re-run checks
    LaunchOK --> Running: Game launches
    Running --> Crashed: Exit code ≠ 0
    Crashed --> CrashReport: Parse crash-reports/ and logs/
    CrashReport --> ShowCrashUI: Show human-readable diagnosis
    ShowCrashUI --> SuggestFix: "Mod X caused OutOfMemoryError. Try allocating more RAM."
    SuggestFix --> [*]
```

---

## SECTION 3: APPLICATION STATE MACHINE

### 3.1 Complete State Diagram

```mermaid
stateDiagram-v2
    [*] --> BOOT

    state "BOOT" as BOOT
    state "INITIALIZING" as INIT
    state "FIRST_RUN" as FIRST
    state "CHECKING_UPDATES" as UPDATE
    state "LOADING_CONFIG" as CONFIG
    state "LOADING_ACCOUNTS" as ACCOUNTS
    state "LOADING_PROFILES" as PROFILES
    state "READY" as READY
    state "INSTALLING_CONTENT" as INSTALLING
    state "PREFLIGHT" as PREFLIGHT
    state "DOWNLOADING" as DOWNLOADING
    state "VERIFYING" as VERIFYING
    state "LAUNCHING" as LAUNCHING
    state "RUNNING" as RUNNING
    state "GAME_EXITED" as EXITED
    state "GAME_CRASHED" as CRASHED
    state "REPAIRING" as REPAIRING
    state "ERROR" as ERROR
    state "OFFLINE" as OFFLINE
    state "AUTH_REQUIRED" as AUTH_REQ

    BOOT --> INIT: App window created
    INIT --> FIRST: First run detected (no settings.json)
    INIT --> CONFIG: Existing installation

    FIRST --> CONFIG: Wizard completed

    CONFIG --> ACCOUNTS: settings.json loaded
    CONFIG --> ERROR: settings.json corrupted

    ACCOUNTS --> PROFILES: accounts.json loaded or empty
    ACCOUNTS --> ERROR: accounts.json corrupted (attempt repair first)

    PROFILES --> UPDATE: profiles.json loaded
    PROFILES --> ERROR: profiles.json corrupted (attempt repair first)

    UPDATE --> READY: Update check complete (or skipped)
    UPDATE --> OFFLINE: No network (degrade gracefully)

    OFFLINE --> READY: Continue with cached data

    READY --> PREFLIGHT: User clicks LAUNCH
    READY --> INSTALLING: User installs mod/version/loader
    READY --> AUTH_REQ: User clicks Sign In
    READY --> REPAIRING: User clicks Repair

    AUTH_REQ --> READY: Auth successful
    AUTH_REQ --> ERROR: Auth failed (user cancelled or network error)

    INSTALLING --> DOWNLOADING: Content needs downloading
    DOWNLOADING --> VERIFYING: Download complete
    VERIFYING --> INSTALLING: Hash mismatch → re-download
    VERIFYING --> READY: All content verified

    PREFLIGHT --> DOWNLOADING: Missing files detected
    PREFLIGHT --> LAUNCHING: All files present
    PREFLIGHT --> AUTH_REQ: Token expired
    PREFLIGHT --> ERROR: Unrecoverable preflight failure

    DOWNLOADING --> LAUNCHING: All downloads complete + verified

    LAUNCHING --> RUNNING: Java process spawned, Minecraft window detected
    LAUNCHING --> ERROR: Java process failed to start

    RUNNING --> EXITED: Exit code 0
    RUNNING --> CRASHED: Exit code ≠ 0

    EXITED --> READY: Return to launcher
    CRASHED --> READY: After showing crash report

    REPAIRING --> READY: Repair succeeded
    REPAIRING --> ERROR: Repair failed

    ERROR --> READY: After user acknowledges or fix applied
    ERROR --> REPAIRING: User chooses repair
```

### 3.2 Invalid State Transitions (Must Be Prevented)

| From | To | Why It's Invalid |
|------|-----|-----------------|
| RUNNING → LAUNCHING | Cannot launch while a game is already running for the same profile |
| DOWNLOADING → LAUNCHING | Cannot launch while critical files are still downloading |
| BOOT → RUNNING | Cannot run game before initialization completes |
| RUNNING → INSTALLING | Cannot modify a profile's mods while the game is using them |
| FIRST_RUN → LAUNCHING | Cannot launch before first-run wizard completes |
| ERROR → RUNNING | Cannot transition from error directly to running without going through READY |

### 3.3 State Persistence Rules

| State | Persisted Across Restarts? | Why |
|-------|--------------------------|-----|
| READY | ✅ Yes — last active profile, window position | Resume where user left off |
| DOWNLOADING | ✅ Yes — download queue, progress per file | Resume interrupted downloads |
| RUNNING | ❌ No — but we detect orphaned Java processes on boot | Process state is OS-level, not launcher-level |
| ERROR | ❌ No — errors are transient | Stale errors are confusing |
| INSTALLING | ✅ Partially — track incomplete installations to clean up on boot | Prevent half-installed states |

> **Why this matters**: Without explicit state persistence rules, the launcher could boot into an undefined state after a crash (e.g., files half-downloaded, profile half-created). Every state transition must leave the filesystem in a consistent state. Use write-ahead logging for multi-file operations: write intentions to a journal file, execute, then clear the journal. On boot, replay any incomplete journal entries.

---

## SECTION 4: ERROR RECOVERY ARCHITECTURE

### 4.1 Error Taxonomy

Every error in the launcher falls into one of four severity levels:

| Level | Meaning | User Impact | Example |
|-------|---------|------------|---------|
| **Recoverable** | Auto-fixable, user may not even notice | None to minimal | Missing asset → re-download silently |
| **Degraded** | Feature unavailable, core works | Single feature disabled | Modrinth API down → marketplace grayed out |
| **Blocking** | Cannot proceed with current action | Blocks launch but launcher works | Auth token expired → must re-login |
| **Fatal** | Launcher itself is broken | Must restart launcher | settings.json schema unreadable after botched migration |

### 4.2 Error Recovery Matrix

| Failure | Detection | Diagnosis | Auto Repair | Manual Repair | User Notification | Logging |
|---------|-----------|-----------|-------------|---------------|-------------------|---------|
| **Missing asset files** | SHA1 spot-check during preflight | Compare asset index vs disk | Re-download missing assets | "Repair Profile" button | Toast: "Repairing game files..." | `WARN: asset {hash} missing, re-queuing` |
| **Corrupted library JAR** | SHA1 mismatch during preflight | Hash comparison against version manifest | Delete + re-download | "Verify Files" in profile settings | Progress bar: "Verifying: 847/1203" | `ERROR: library {path} hash mismatch expected={e} got={g}` |
| **Missing Java** | `JavaDetector.findJava()` returns null | Check PATH, registry, common dirs | Download Adoptium JRE | Settings → Java → Browse | Modal: "Java 17 required. Download now?" | `WARN: No compatible Java found for MC {version}` |
| **Corrupted profile** | JSON parse failure on `instance.json` | Syntax error location in JSON | Attempt JSON recovery (trailing comma fix, etc.) | Delete + recreate profile | Modal: "Profile corrupted. Repair or recreate?" | `ERROR: Failed to parse instance.json for profile {id}` |
| **Corrupted settings** | JSON parse failure on `settings.json` | Same as above | Replace with defaults, log old file as `.backup` | Auto-handled | Toast: "Settings were reset to defaults" | `ERROR: settings.json corrupted, backed up and reset` |
| **Broken version manifest** | HTTP error or JSON parse failure | Network vs parse error | Re-fetch from Mojang | Clear cache, retry | Toast: "Couldn't fetch version list. Retrying..." | `ERROR: version_manifest_v2.json fetch failed: {statusCode}` |
| **Interrupted download** | Download journal shows incomplete entry | Check journal file on boot | Resume download from last byte (HTTP Range) | "Retry Downloads" button | Progress resumes automatically | `INFO: Resuming download {url} from byte {offset}` |
| **Mod conflict** | Minecraft crash with `ModResolutionException` in log | Parse crash report for conflicting mod IDs | None (requires user decision) | Show conflicting mods, offer to disable one | Modal: "Mod A conflicts with Mod B. Disable one?" | `ERROR: Mod conflict detected: {modA} vs {modB}` |
| **Auth failure** | HTTP 401/403 from Minecraft Services | Token expired vs revoked vs network | Attempt silent token refresh | "Sign In Again" button | Modal: "Session expired. Please sign in again." | `WARN: Auth token refresh failed: {reason}` |
| **Network failure** | `fetch` throws or times out | Differentiate DNS vs timeout vs refused | Switch to offline mode, use cached data | "Retry" button on affected features | Banner: "You're offline. Some features unavailable." | `WARN: Network unreachable: {error}` |
| **Disk full** | `ENOSPC` error during write | Check available space vs required space | None | Show how much space is needed, suggest cleanup | Modal: "Need {n}GB free. You have {m}GB." | `ERROR: Disk full during write to {path}` |
| **Insufficient RAM** | Minecraft exits with `OutOfMemoryError` in crash log | Parse crash report | Suggest increasing allocation | Settings → Game → Allocated Memory | Modal: "Minecraft ran out of memory. Increase from 4GB to 6GB?" | `ERROR: OOM detected in crash report` |
| **Launcher crash** | Uncaught exception in main/renderer | Stack trace + process memory dump | Restart launcher, replay journal | Launcher auto-restarts | Crash reporter dialog on restart | `FATAL: Uncaught exception: {stack}` |
| **Minecraft crash** | Exit code ≠ 0 + crash report file exists | Parse `crash-reports/crash-*.txt` | None (game-level issue) | Show parsed crash report with suggestions | Crash viewer with "Copy to Clipboard" for support | `ERROR: Minecraft exited with code {code}` |
| **Profile migration failure** | Schema version mismatch + migration throws | Compare schema versions | Rollback to backup, try again | Manual JSON editing (advanced users only) | Modal: "Profile upgrade failed. Backup preserved." | `ERROR: Migration from v{old} to v{new} failed: {reason}` |

> **Why this matters**: Without a systematic error taxonomy, error handling becomes ad-hoc. Each developer invents their own way to show errors. Users see inconsistent messages. Some errors are silently swallowed. This matrix ensures every failure mode has a designed response.

---

## SECTION 5: SELF-HEALING SYSTEM

### 5.1 Architecture

The self-healing system is a dedicated service (`IntegrityService`) that can be invoked on-demand ("Repair Profile" button) or automatically during preflight checks.

```mermaid
graph TD
    subgraph "IntegrityService"
        TRIGGER["Trigger: User clicks 'Repair' OR preflight check"]
        
        TRIGGER --> CHECK_VERSION["1. Verify version JSON exists + valid"]
        CHECK_VERSION --> CHECK_CLIENT["2. Verify client.jar SHA1"]
        CHECK_CLIENT --> CHECK_LIBS["3. Verify all libraries SHA1"]
        CHECK_LIBS --> CHECK_ASSETS["4. Spot-check assets (random 5%)"]
        CHECK_ASSETS --> CHECK_NATIVES["5. Verify natives extracted"]
        CHECK_NATIVES --> CHECK_LOADER["6. Verify mod loader installed"]
        CHECK_LOADER --> CHECK_JAVA["7. Verify Java path valid"]
        CHECK_JAVA --> CHECK_CONFIG["8. Verify profile config parseable"]
        CHECK_CONFIG --> REPORT["Generate integrity report"]
    end

    REPORT --> HEALTHY["✅ All checks passed"]
    REPORT --> DEGRADED["⚠️ Issues found"]
    DEGRADED --> AUTO_REPAIR["Auto-repair: re-download missing/corrupt files"]
    AUTO_REPAIR --> VERIFY["Re-verify repaired files"]
    VERIFY --> HEALTHY
    VERIFY --> MANUAL["❌ Auto-repair failed → show manual steps"]
```

### 5.2 One-Click Profile Repair

**User flow**: Library → Select Profile → Settings (gear icon) → "Repair Profile"

**What it does**:
1. Re-downloads the version manifest for the profile's Minecraft version
2. Verifies every library JAR against expected SHA1 hashes; re-downloads mismatches
3. Spot-checks 5% of asset objects (full verification would take minutes for large asset indexes); if any fail, re-verifies all
4. Re-extracts native libraries
5. Re-installs the mod loader if its files are missing
6. Validates all installed mod JARs exist in `mods/` directory
7. Resets `instance.json` to defaults if it's unparseable (preserving a `.backup`)
8. Reports results: "Repaired 3 libraries, 12 assets. Profile is healthy."

### 5.3 Startup Health Check

On every launcher boot, a lightweight check runs:
1. Verify `settings.json` is parseable → if not, reset to defaults (keep backup)
2. Verify `accounts.json` is parseable → if not, clear accounts (user must re-login)
3. Verify `profiles.json` is parseable → if not, start with empty profiles
4. Check for incomplete download journal entries → resume or clean up
5. Check for orphaned temp files in `temp/` → delete anything older than 24 hours
6. Check disk space → warn if < 1GB free

> **Why this matters**: Users will inevitably encounter corrupted files — from antivirus quarantine, unexpected shutdowns, disk errors, or manual file editing. A self-healing system transforms "my launcher is broken, I need to reinstall" into "click Repair, wait 30 seconds, done." This is the difference between a hobbyist tool and a professional product.

---

## SECTION 6: PROFILE LIFECYCLE — COMPLETE INTERNALS

### 6.1 Profile Data Model

```typescript
interface Profile {
  id: string;                    // UUID v4, immutable after creation
  name: string;
  icon: string;                  // Path to icon file or URL
  createdAt: string;             // ISO 8601
  lastPlayedAt: string | null;
  totalPlayTimeMs: number;
  
  minecraft: {
    version: string;             // e.g., "1.20.4"
    loader: "vanilla" | "fabric" | "forge" | "neoforge" | "quilt";
    loaderVersion: string | null;
  };
  
  java: {
    path: string | null;         // null = use auto-detected/global default
    jvmArgs: string[];
    memoryMB: number;
  };
  
  window: {
    width: number;
    height: number;
    fullscreen: boolean;
  };
  
  instanceDir: string;           // Absolute path to instance directory
  gameDir: string;               // Absolute path to .minecraft within instance
  
  content: {
    mods: InstalledMod[];
    resourcePacks: InstalledPack[];
    shaderPacks: InstalledPack[];
  };
  
  metadata: {
    schemaVersion: number;       // For future migrations
    source: "user" | "import" | "template";
    templateId: string | null;
  };
}
```

### 6.2 Full Lifecycle Diagram

```mermaid
stateDiagram-v2
    [*] --> Creating

    state "Creating" as Creating {
        C1: Generate UUID
        C2: Write to profiles.json
        C3: mkdir instances/{uuid}
        C4: mkdir instances/{uuid}/.minecraft
        C5: Create instance.json with defaults
        C6: Download MC version + libs + assets (background)
        C7: Install mod loader (if not vanilla)

        C1 --> C2 --> C3 --> C4 --> C5 --> C6 --> C7
    }

    Creating --> Active: Creation complete

    state "Active" as Active {
        A_IDLE: Idle (not running)
        A_RUNNING: Game running
        A_MODIFYING: User editing settings/mods
        
        A_IDLE --> A_RUNNING: Launch
        A_RUNNING --> A_IDLE: Game exits
        A_IDLE --> A_MODIFYING: Open profile settings
        A_MODIFYING --> A_IDLE: Close settings
    }

    Active --> Duplicating: User clicks "Duplicate"
    Duplicating --> Active: New profile created

    state "Duplicating" as Duplicating {
        D1: Generate new UUID
        D2: Deep copy instance directory
        D3: Create new entry in profiles.json
        D4: Rename profile to "{name} (Copy)"
    }

    Active --> Exporting: User clicks "Export"
    Exporting --> Active: .ccpack file saved

    state "Exporting" as Exporting {
        EX1: Build manifest.json from profile
        EX2: Collect mod references (source + version + hash)
        EX3: Include config/ directory
        EX4: Optionally include worlds/
        EX5: Package as .ccpack (ZIP with manifest)
    }

    Active --> Backing_Up: Manual or scheduled
    Backing_Up --> Active

    state "Backing_Up" as Backing_Up {
        BK1: Snapshot worlds/saves
        BK2: Snapshot config/
        BK3: Record mod list with versions
        BK4: Write backup manifest
        BK5: Compress to .zip in backups/ dir
    }

    Active --> Validating: Integrity check
    Validating --> Active: Check complete
    Validating --> Repairing: Issues found

    state "Repairing" as Repairing {
        R1: Re-download missing/corrupt files
        R2: Re-install loader if missing
        R3: Reset broken config files
        R4: Report results to user
    }

    Repairing --> Active: Repair complete

    Active --> Migrating: Launcher update changes schema
    Migrating --> Active: Migration complete

    state "Migrating" as Migrating {
        M1: Backup instance.json
        M2: Read current schemaVersion
        M3: Apply migration functions sequentially
        M4: Write new schemaVersion
        M5: Verify migrated data
    }

    Active --> Upgrading: User changes MC version
    Upgrading --> Active: Upgrade complete

    state "Upgrading" as Upgrading {
        U1: Backup current mods + configs
        U2: Download new MC version files
        U3: Re-install loader for new version
        U4: Check mod compatibility with new version
        U5: Warn about incompatible mods
        U6: Update profile metadata
    }

    Active --> Deleting: User clicks "Delete"
    Deleting --> [*]: Profile removed

    state "Deleting" as Deleting {
        DEL1: Show confirmation dialog ("Delete profile and all files?")
        DEL2: Option to keep worlds/saves
        DEL3: Remove from profiles.json
        DEL4: Delete instances/{uuid}/ directory
        DEL5: Clean up orphaned library/asset references (if not used by other profiles)
    }

    [*] --> Importing: User imports .ccpack/.mrpack
    Importing --> Active: Import complete

    state "Importing" as Importing {
        I1: Extract archive to temp/
        I2: Parse manifest.json
        I3: Create new profile entry
        I4: Create instance directory
        I5: Resolve mod references → download JARs
        I6: Copy configs
        I7: Optionally import worlds
    }

    Restoring --> Active: Restore complete
    [*] --> Restoring: User restores backup

    state "Restoring" as Restoring {
        RS1: Select backup .zip
        RS2: Extract to temp/
        RS3: Replace saves/, config/ in instance dir
        RS4: Re-install mods from backup manifest
    }
```

> **Why this level of detail**: Every profile operation is a multi-step filesystem mutation. Without explicit design, developers will implement these ad-hoc, leading to partially-created profiles, orphaned files, and data corruption. Each operation must be atomic (succeed fully or rollback) and journaled.

---

## SECTION 7: PERFORMANCE ARCHITECTURE

### 7.1 Performance Budget

| Metric | Target | Why |
|--------|--------|-----|
| Cold start to READY state | < 2 seconds | Users expect desktop apps to be fast. Electron is already slow. |
| Profile list render (100 profiles) | < 100ms | Virtual scrolling not needed at 100, but keep DOM small |
| Marketplace search response | < 500ms (including network) | Perceived as instant |
| Launch button to Java process spawned | < 10 seconds (first launch) / < 3 seconds (cached) | After files are downloaded, launching should be near-instant |
| Memory usage (idle) | < 200MB RSS | Electron floor is ~80MB. Stay under 200MB. |
| Memory usage (downloading) | < 400MB RSS | Download buffers consume memory |
| Installer package size | < 150MB | Users on slow connections. Electron is ~90MB alone. |

### 7.2 Background Task Architecture

```mermaid
graph TD
    subgraph "Main Process Task Scheduler"
        QUEUE["Task Queue (Priority-Ordered)"]
        WORKERS["Worker Pool (configurable, default 4)"]
        
        QUEUE --> WORKERS
    end

    subgraph "Task Types"
        DL["Download Task (Priority: varies)"]
        HASH["Hash Verification Task (Priority: High)"]
        EXTRACT["Native Extraction Task (Priority: High)"]
        CLEANUP["Cache Cleanup Task (Priority: Low)"]
        UPDATE["Update Check Task (Priority: Low)"]
        INDEX["Mod Index Rebuild Task (Priority: Medium)"]
    end

    DL & HASH & EXTRACT & CLEANUP & UPDATE & INDEX --> QUEUE

    subgraph "Renderer Updates"
        PROGRESS["Progress events via IPC (throttled to 10/sec)"]
        TOAST["Toast notifications for completion/failure"]
    end

    WORKERS --> PROGRESS --> TOAST
```

### 7.3 Download Performance

| Strategy | Implementation | Why |
|----------|---------------|-----|
| **Concurrent downloads** | Max 8 simultaneous HTTP connections | Saturate bandwidth without overwhelming OS |
| **Connection reuse** | HTTP/2 + keep-alive where server supports | Reduce TCP handshake overhead. Mojang CDN supports HTTP/2. |
| **Resume support** | Track bytes received in download journal. Use HTTP `Range` header on resume. | Don't re-download 500MB of assets if user closes launcher at 80% |
| **Priority queue** | Client JAR and version JSON download first; assets download last | User sees "Preparing..." faster if core files arrive first |
| **Deduplication** | Content-addressed storage for assets. Libraries stored by Maven coordinates. | A library used by 5 profiles is stored once. Assets are inherently deduplicated by Mojang's hash scheme. |
| **Progress throttling** | IPC progress events capped at 10/sec per download | Flooding the renderer with 1000 events/sec during 8 parallel downloads would freeze the UI |

### 7.4 Caching Strategy

| Cache | Storage | TTL | Invalidation |
|-------|---------|-----|-------------|
| Mojang version manifest | `cache/mojang/version_manifest_v2.json` | 1 hour | Re-fetch on manual refresh or profile creation |
| Modrinth search results | In-memory LRU (100 entries) | 5 minutes | New search invalidates matching query |
| Modrinth project details | `cache/modrinth/{projectId}.json` | 1 hour | Manual refresh |
| Player avatars | `cache/avatars/{username}.png` | 24 hours | On account switch |
| Mod loader version lists | `cache/loaders/{loader}.json` | 6 hours | Manual refresh |

### 7.5 Image Loading

| Strategy | Where | Why |
|----------|-------|-----|
| **Lazy loading** | Marketplace mod icons, profile backgrounds | Don't load 100 images on page render. Use `IntersectionObserver`. |
| **Placeholder shimmer** | All images | Already implemented (`.skeleton` class). Keep it. |
| **Resize on load** | Downloaded avatar images | mc-heads.net returns 100px heads. Don't render 100px images in 32px containers. Request the correct size. |
| **Cache in memory** | Avatars for the current friend list | Avoid re-fetching the same 10 avatars every tab switch |

### 7.6 Identified Bottlenecks

| Bottleneck | Scenario | Mitigation |
|-----------|----------|------------|
| **Asset download count** | 1.20.4 has ~4,500 asset objects. Downloading 4,500 files sequentially takes 20+ minutes. | Parallel downloads (8 concurrent) + skip if hash matches existing file. Most assets are shared across MC versions, so after the first install, subsequent versions download almost nothing. |
| **Startup config loading** | Reading 3 JSON files synchronously blocks the renderer | Read config files in main process before creating the window. Window opens already with data loaded. |
| **Modrinth API rate limiting** | 300 req/min. Current 50ms debounce on search = 1200 req/min in theory. | Increase debounce to 300ms. Implement request queue with rate limiter (max 250 req/min with 50 buffer). |
| **Large modpack import** | Importing a 200-mod modpack triggers 200 sequential Modrinth API calls for version resolution | Batch resolve using Modrinth's `/v2/projects?ids=[...]` bulk endpoint. Max 10 concurrent download streams for the actual JAR files. |
| **Profile list with many entries** | 100+ profiles rendering simultaneously | Virtual scrolling (already used in Marketplace). Apply to Library grid if > 50 profiles. |

> **Why this matters**: Performance issues discovered after implementation require expensive refactoring. Designing the performance strategy upfront — especially download concurrency, caching, and UI throttling — avoids the most common performance pitfalls in Electron apps.

---

## SECTION 8: PLUGIN ARCHITECTURE (FUTURE-PROOF DESIGN)

> **Note**: Plugins are deferred to post-1.0. This section designs the *extension points* so the codebase doesn't need refactoring when plugins are eventually added.

### 8.1 Why Design This Now

Even though plugins won't ship in v1.0, certain architectural decisions made now will either enable or permanently block plugin support later. Specifically:

1. **Event bus design** — If the event bus is internal and untyped, plugins can't subscribe to events.
2. **Service interfaces** — If services are concrete classes with no interfaces, plugins can't provide alternative implementations.
3. **UI extension points** — If the UI has no slot/portal system, plugins can't add sidebar tabs, settings sections, or context menu items.

### 8.2 Extension Points to Design Now

| Extension Point | What It Enables | Implementation Now |
|----------------|----------------|--------------------|
| **Typed Event Bus** | Plugins subscribe to events like `profile:created`, `launch:started`, `mod:installed` | Use TypeScript discriminated union for event types. `EventBus.on<T>(event: T, handler)`. |
| **Service interfaces** | Plugins provide alternative download backends, auth providers, mod sources | Define interfaces for `IDownloadProvider`, `IAuthProvider`, `IModSource`. Current implementations are the defaults. |
| **Content Source abstraction** | Add CurseForge, custom mod repos, or community sources without modifying core code | `IContentSource` interface with `search()`, `getProject()`, `getVersions()`, `download()`. Modrinth is the default implementation. |
| **Settings schema registration** | Plugins register their own settings sections | Settings store accepts `registerSection(id, schema, component)`. Core sections are registered the same way. |

### 8.3 Plugin Lifecycle (Future Reference)

```mermaid
stateDiagram-v2
    [*] --> Discovered: Scan plugins/ directory
    Discovered --> Validated: Check manifest.json, permissions
    Validated --> Loaded: Import plugin module
    Loaded --> Initialized: Call plugin.init(api)
    Initialized --> Active: Plugin running

    Active --> Disabled: User disables in settings
    Disabled --> Active: User re-enables
    Active --> Unloaded: Launcher shutdown
    Unloaded --> [*]

    Validated --> Rejected: Incompatible version or missing deps
    Rejected --> [*]
```

### 8.4 Security Model (Future Reference)

Plugins MUST run in a sandboxed environment:
- **No direct filesystem access** — all file operations go through the launcher's `FileSystemService`, scoped to the plugin's own directory.
- **No network access** — all HTTP requests go through the launcher's `DownloadManager`, which enforces domain allowlists declared in the plugin manifest.
- **No IPC access** — plugins cannot send arbitrary IPC messages. They interact only through the plugin API surface.
- **Capability-based permissions** — each plugin declares required permissions in its manifest. Users approve permissions on install.

> **Why this matters**: Not designing extension points now means the entire service layer would need refactoring when plugins are added. By defining interfaces and using the event bus pattern from day one, the plugin system becomes a natural extension of existing infrastructure rather than a bolt-on rewrite.

---

## SECTION 9: ABSTRACTION LAYER — EXTERNAL DEPENDENCY ISOLATION

### 9.1 Design Principle

Every external API or service dependency must be accessed through an abstraction layer so that:
1. **Provider changes don't cascade** — If mc-heads.net goes down, swap to crafatar.com by changing one implementation, not 12 component files.
2. **Testing is possible** — Mock the interface, not the HTTP client.
3. **Rate limiting is centralized** — One rate limiter per provider, shared across all call sites.
4. **Caching is consistent** — One cache strategy per provider.

### 9.2 Abstraction Map

| External Dependency | Abstraction Interface | Default Implementation | Alternate Providers |
|--------------------|-----------------------|----------------------|---------------------|
| **Mojang Version Manifest** | `IVersionProvider` | `MojangVersionProvider` (piston-meta.mojang.com) | Could add Fabric's mirrored manifest |
| **Mojang Asset CDN** | `IAssetProvider` | `MojangAssetProvider` (resources.download.minecraft.net) | Mirror CDN for faster downloads |
| **Microsoft OAuth2** | `IAuthProvider` | `MicrosoftAuthProvider` | Offline auth provider (for offline mode) |
| **Modrinth API** | `IContentSource` | `ModrinthContentSource` | CurseForge, custom repos |
| **Player Avatars** | `IAvatarProvider` | `McHeadsAvatarProvider` (mc-heads.net) | Crafatar, Minotar, Visage |
| **Java Runtime Downloads** | `IJavaProvider` | `AdoptiumJavaProvider` (api.adoptium.net) | Azul Zulu, Amazon Corretto |
| **Fabric Loader Meta** | `ILoaderProvider` | `FabricLoaderProvider` (meta.fabricmc.net) | — |
| **Forge Installer** | `ILoaderProvider` | `ForgeLoaderProvider` (files.minecraftforge.net) | — |
| **Quilt Loader Meta** | `ILoaderProvider` | `QuiltLoaderProvider` (meta.quiltmc.org) | — |
| **NeoForge Installer** | `ILoaderProvider` | `NeoForgeLoaderProvider` (maven.neoforged.net) | — |
| **Launcher Update Server** | `IUpdateProvider` | `GitHubReleasesUpdateProvider` | Custom update server |
| **News Feed** | `INewsProvider` | `StaticNewsProvider` (bundled JSON) | RSS feed, custom API |

### 9.3 Content Source Interface

```typescript
interface IContentSource {
  readonly id: string;           // "modrinth", "curseforge", etc.
  readonly displayName: string;
  
  search(query: SearchQuery): Promise<SearchResult>;
  getProject(projectId: string): Promise<ProjectDetail>;
  getVersions(projectId: string, filters: VersionFilter): Promise<ProjectVersion[]>;
  getDownloadUrl(versionId: string): Promise<DownloadInfo>;
  getDependencies(versionId: string): Promise<Dependency[]>;
  
  // Rate limiting is internal to each implementation
  // Caching is internal to each implementation
}
```

> **Why this matters**: The current codebase has Modrinth API URLs hardcoded directly in `Marketplace.tsx` component code. If Modrinth changes their API path or version, every call site must be updated. If CurseForge support is added later, the entire Marketplace component needs rewriting. An abstraction layer isolates these changes to a single file per provider.

---

## SECTION 10: DEBUGGING ARCHITECTURE

### 10.1 Approach

Instead of the current standalone Inspector window (which is a separate Electron window with its own React app), redesign debugging as an **integrated developer panel** accessible via `Ctrl+Shift+D` (or `Win+F1` as currently implemented). This avoids maintaining a second entry point and keeps debugging context-aware.

### 10.2 Developer Panel Tabs

| Tab | Contents | Why It's Useful |
|-----|----------|----------------|
| **State Viewer** | Live Zustand store state (profiles, auth, settings, downloads, launch) with JSON tree view | Inspect application state without console.log. Identify stale state, wrong values, missing updates. |
| **Task Manager** | All active background tasks: downloads, hash checks, loader installations. Shows progress, status, duration. Kill button per task. | When "something is stuck," this shows exactly what. Users can self-diagnose "my download is stuck at 99%." |
| **Download Inspector** | Detailed per-file download log: URL, status, speed, retries, hash result. Filterable by status (pending, active, complete, failed). | Debug download failures. Show which exact file failed and why. |
| **IPC Inspector** | Live log of all IPC messages between renderer and main process. Direction (→ main, ← renderer), channel name, payload size, duration. | Debug communication issues. Detect missing responses, slow handlers, oversized payloads. |
| **Launch Timeline** | Gantt-style visualization of the last launch sequence: auth (200ms), Java check (50ms), download (8.2s), classpath build (15ms), spawn (800ms). | Identify exactly where launch time is spent. Is it auth? Downloads? Java? |
| **Network Inspector** | All outgoing HTTP requests: URL, method, status, duration, response size. Grouped by host. Rate limit status per provider. | Debug API failures, identify rate limiting, find slow endpoints. |
| **Performance** | Live graphs: FPS, frame time, memory (JS heap + RSS), DOM node count. The current `InspectorBridge.tsx` telemetry feeding into a proper UI. | Already partially built. Formalize it into the developer panel. |
| **Event Log** | Chronological log of all `EventBus` events with timestamps and payloads. Filterable by event type. | Trace complex workflows: "What happened between clicking Launch and the error?" |
| **Crash Analyzer** | Parses Minecraft `crash-reports/` and `logs/latest.log`. Highlights: exception class, mod name if present, JVM flags, memory state. | Transform cryptic Java stack traces into actionable information. |
| **Console** | Traditional log viewer (stdout/stderr from both launcher and game process). Severity filtering, search, copy. | The current Inspector's log relay, but integrated. |

### 10.3 Production vs Development Mode

| Feature | Development | Production |
|---------|------------|------------|
| Developer Panel shortcut | Always available | Hidden behind `Ctrl+Shift+D` (no visible UI button) |
| IPC Inspector | Full payload logging | Disabled (security: payloads contain auth tokens) |
| State Viewer | Full state tree | Read-only, no token values shown |
| Performance graphs | Always visible | Only in Developer Panel |
| Console | Auto-opens on errors | Silent unless user opens it |
| Crash Analyzer | Verbose mode | User-friendly mode with "Copy Report" button |

> **Why this matters**: Debugging is 50% of development time. Professional debugging tools reduce investigation time from hours to minutes. They also enable users to self-diagnose issues and provide useful bug reports ("here's my Launch Timeline showing the download failed at file X").

---

## SECTION 11: FIRST-RUN EXPERIENCE

### 11.1 Design Goals

1. **Zero to playing in under 5 minutes** — including Microsoft login and first game download.
2. **Never overwhelm** — show only what's necessary at each step. Advanced options are discoverable later.
3. **Detect everything possible** — don't ask the user what we can detect automatically.
4. **Respect user agency** — always allow skipping optional steps.

### 11.2 Wizard Steps

| Step | What Happens | Skippable? | Auto-detected? |
|------|-------------|-----------|----------------|
| 1. **Welcome** | Show launcher name, version, brief tagline. "Let's set up your launcher." | No (it's the intro) | — |
| 2. **Import Detection** | Scan for existing `.minecraft`. If found: "We found your Minecraft installation. Import worlds, screenshots, and resource packs?" Checkboxes for each. | Yes (skip import) | ✅ Auto-scans `.minecraft` |
| 3. **Java Detection** | Scan system for Java. Show found installations. If none found: "We'll download Java for you automatically when needed." | No (but auto-handled) | ✅ Auto-scans PATH, registry |
| 4. **System Assessment** | Detect total RAM, recommend allocation (half of system RAM, max 8GB). Detect GPU for shader compatibility note. | Yes (use defaults) | ✅ Auto-detected |
| 5. **Data Directory** | Show default path (`%APPDATA%/.customclient`). "Change" button for power users. | Yes (use default) | ✅ Default path |
| 6. **Microsoft Sign In** | "Sign in with Microsoft to play online." Device code flow. Prominent "Skip for now (offline only)" button. | ✅ Yes | — |
| 7. **First Profile** | "Choose a starting point:" Three cards: (a) "Vanilla" — pure Minecraft, (b) "Performance" — Fabric + Sodium + Lithium, (c) "Custom" — choose everything yourself. | No (need at least one profile) | — |
| 8. **Done** | "You're all set! Click Launch to play." Confetti animation. Button: "Launch Game" / "Go to Library". | No | — |

### 11.3 What Gets Imported from `.minecraft`

| Content | Import Method | Risk |
|---------|--------------|------|
| Worlds (`saves/`) | Copy to first profile's instance | Low — read-only copy |
| Screenshots (`screenshots/`) | Copy to first profile's instance | Low |
| Resource packs (`resourcepacks/`) | Copy to first profile's instance | Low |
| Server list (`servers.dat`) | Copy to first profile's instance | Low |
| Options (`options.txt`) | Copy selectively (keybinds, video settings, NOT path-dependent settings) | Medium — some settings are path-specific |
| Mods (`mods/`) | Do NOT import. Mod JARs without context (loader, MC version) are dangerous. | High — wrong loader/version causes crashes |
| Configs (`config/`) | Do NOT import. Configs without their corresponding mods are useless. | High |

> **Why this matters**: The first-run experience determines whether a user stays or uninstalls. Every unnecessary question is friction. Every undetected setting is a support ticket. The wizard should make the user feel like the launcher already knows what they need.

---

## SECTION 12: QUALITY ASSURANCE — TESTING MATRIX

### 12.1 Unit Tests

| Service | Test Cases | Priority |
|---------|-----------|----------|
| `DownloadManager` | Happy path, retry on failure, max retries exceeded, resume from offset, concurrent limit respected, cancel mid-download | Critical |
| `HashVerifier` | SHA1 match, SHA1 mismatch, SHA256, SHA512, empty file, large file (>1GB stream), file not found | Critical |
| `ClasspathBuilder` | Vanilla classpath, Fabric classpath, Forge classpath, library rule evaluation (OS filtering), correct ordering | Critical |
| `ArgumentBuilder` | Template variable substitution, auth token injection, custom JVM args merge, resolution args, gameDir arg | Critical |
| `ProfileManager` | Create, read, update, delete, duplicate, concurrent modification, corrupted JSON recovery | Critical |
| `SettingsStore` | Read, write, default values, schema migration, corrupted file recovery | High |
| `JavaDetector` | Found in PATH, found in registry, found in common dirs, not found, multiple versions, version parsing | High |
| `ModResolver` | Compatible version found, no compatible version, dependency chain, circular dependency detection | High |
| `PathResolver` | Windows paths, macOS paths, Linux paths, spaces in path, Unicode in path | High |
| `TokenStore` | Encrypt, decrypt, token refresh, expired token detection, corrupted store recovery | High |

### 12.2 Integration Tests

| Scenario | What It Tests | Environment |
|----------|--------------|-------------|
| Full vanilla 1.20.4 download | VersionManager + AssetManager + LibraryManager + DownloadManager + HashVerifier | Network (can mock HTTP) |
| Full Fabric install on 1.20.4 | FabricLoader + VersionManager + DownloadManager | Network |
| Full launch (mocked Java) | LaunchEngine + ClasspathBuilder + ArgumentBuilder + ProcessManager. Mock Java binary that validates arguments and exits 0. | Local |
| Profile create → launch → exit lifecycle | ProfileManager + InstanceManager + LaunchEngine | Full integration |
| Mod install → launch → verify in-game | ModManager + ModResolver + LaunchEngine (with real Minecraft) | Full integration (manual) |
| Import .ccpack → launch | Import flow + ModResolver + DownloadManager + LaunchEngine | Full integration |
| Auth → token expire → auto-refresh → launch | AuthService + TokenStore + LaunchEngine | Network (mock Microsoft API) |

### 12.3 Stress Tests

| Test | Parameters | Pass Criteria |
|------|-----------|---------------|
| 100 concurrent downloads | 100 files, 10MB each, 8 concurrent workers | All files downloaded, all hashes verified, < 2 minutes |
| 500 profiles | Create 500 profiles programmatically | Library renders in < 200ms, no memory leak on scroll |
| 200 mods in one profile | Install 200 mods via ModManager | Mod list renders, launch doesn't fail from classpath length |
| Rapid launch/stop | Launch and kill Minecraft 10 times in 30 seconds | No orphaned processes, no file locks, no state corruption |
| Low disk scenario | Start download with < 100MB free | Graceful error before disk full, no partial corrupt files |
| Slow network | Throttle to 100KB/s | Downloads complete (slowly), progress updates, no timeouts |

### 12.4 Platform Matrix

| Test Area | Windows 10 | Windows 11 | macOS (Intel) | macOS (ARM) | Ubuntu 22.04 | Fedora 40 |
|-----------|-----------|-----------|--------------|------------|-------------|-----------|
| Install & boot | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Microsoft auth | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Java detection | ✅ (registry) | ✅ (registry) | ✅ (java_home) | ✅ (java_home) | ✅ (alternatives) | ✅ (alternatives) |
| Launch vanilla | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Launch Fabric | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Launch Forge | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Native extraction | ✅ (.dll) | ✅ (.dll) | ✅ (.dylib) | ✅ (.dylib) | ✅ (.so) | ✅ (.so) |
| 4K / HiDPI display | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dark mode integration | — | — | ✅ (respects system) | ✅ | — | — |
| File paths with spaces | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| File paths with Unicode | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### 12.5 Accessibility Tests

| Test | Expectation |
|------|-------------|
| Keyboard-only navigation | Every interactive element reachable via Tab. Enter/Space activates. Escape closes modals. |
| Screen reader (NVDA/VoiceOver) | All buttons have labels, images have alt text, dynamic content announced |
| Reduced motion (prefers-reduced-motion) | All animations disabled, similar to current Performance Mode but triggered by OS setting |
| High contrast | Text remains readable, interactive elements have visible focus rings |
| Font scaling (125%, 150%) | Layout doesn't break, text doesn't overflow containers |

> **Why this matters**: A testing matrix designed upfront becomes the acceptance criteria for each milestone. Without it, "is this done?" is a subjective question. With it, "does it pass the matrix?" is objective.

---

## SECTION 13: FEATURE PRIORITY MATRIX

### 13.1 Priority Definitions

| Priority | Meaning | Milestone Target |
|----------|---------|-----------------|
| **Critical** | Launcher cannot ship without this. Core functionality. | Milestones 1-4 |
| **High** | Expected by users. Missing this feels like a bug. | Milestone 5 |
| **Medium** | Differentiator. Makes the launcher better than alternatives. | Milestone 6 or post-1.0 |
| **Low** | Nice-to-have. Can live without it. | Post-1.0 |
| **Future** | Planned but requires backend or major infrastructure. | Year 2+ |
| **Experimental** | Worth exploring but unproven value. | Prototype only |
| **Rejected** | Evaluated and intentionally excluded. | Never |

### 13.2 Full Matrix

| Feature | Priority | Justification |
|---------|----------|---------------|
| **Secure IPC bridge (contextIsolation)** | Critical | Security vulnerability. Must be fixed before any other work. |
| **File-based settings (replace localStorage)** | Critical | Current storage will fail. Foundation for everything else. |
| **Centralized state management (Zustand)** | Critical | Cannot build complex features without shared state. |
| **Download Manager** | Critical | Every content feature depends on downloading files. |
| **Hash verification** | Critical | Without integrity checking, corrupted files cause silent failures. |
| **Mojang version manifest parsing** | Critical | Cannot install Minecraft without this. |
| **Asset downloading** | Critical | Game won't run without assets. |
| **Library downloading + native extraction** | Critical | Game won't run without libraries. |
| **Java detection** | Critical | Game won't run without Java. |
| **Java auto-download** | Critical | Most users don't have Java installed. |
| **Microsoft OAuth2 authentication** | Critical | Cannot play online without this. |
| **Classpath builder** | Critical | Game won't launch without correct classpath. |
| **Argument builder** | Critical | Game won't launch without correct arguments. |
| **Process spawning + lifecycle** | Critical | The actual launch operation. |
| **Profile creation (real)** | Critical | Users need to create profiles to launch. |
| **Fabric loader installation** | Critical | Primary mod loader. |
| **Offline mode** | Critical | Users without internet or Microsoft account must still be able to play. |
| **Forge loader installation** | High | Second most popular loader. Large mod ecosystem. |
| **NeoForge loader installation** | High | Growing community, Forge successor. |
| **Quilt loader installation** | High | Niche but expected by power users. |
| **Mod installation (real file download)** | High | Current "install" only saves an ID to localStorage. Must become real. |
| **Mod dependency resolution** | High | Installing Mod A without its required library Mod B causes crashes. |
| **Console log viewer** | High | Users need to see why their game crashed. |
| **Profile deletion** | High | Users accumulate profiles. Must be able to clean up. |
| **Profile duplication** | High | Common workflow: "I want this profile but with different mods." |
| **Error boundaries** | High | Unhandled React errors currently crash the entire app. |
| **Toast notifications** | High | User needs feedback for async operations (install, download, error). |
| **Token refresh (silent)** | High | Tokens expire every 24 hours. Users shouldn't re-login daily. |
| **Multi-account support** | High | Alt accounts are common in Minecraft. |
| **Structured file logging** | High | Cannot debug user issues without logs. |
| **Resource pack management** | Medium | Less urgent than mods, but expected. |
| **Shader pack management** | Medium | Less urgent, but shader players expect this. |
| **Profile import (.ccpack, .mrpack)** | Medium | Key differentiator for sharing modpacks. |
| **Profile export** | Medium | Paired with import. |
| **Mod update checking** | Medium | Users want to know when mods have updates. |
| **Crash report parser** | Medium | Transform stack traces into human-readable diagnoses. |
| **First-run wizard** | Medium | Critical for user retention, but the app works without it. |
| **Profile repair (self-healing)** | Medium | Saves users from reinstalling. |
| **Marketplace component decomposition** | Medium | Maintainability improvement, not user-facing. |
| **World management** | Medium | Users want to see/backup/delete worlds per profile. |
| **Discord Rich Presence** | Low | Nice social feature, not core functionality. |
| **Keyboard shortcuts** | Low | Power user feature. |
| **Image compression (WebP)** | Low | Performance improvement, not blocking. |
| **Startup migration wizard (import .minecraft)** | Low | First-run only. Manual setup is acceptable. |
| **Profile templates** | Low | Convenience feature. Users can configure manually. |
| **News feed** | Low | Content feature, not core functionality. |
| **Play time tracking** | Low | Stats feature. Doesn't affect functionality. |
| **Mission Center** | Future | Requires content infrastructure. |
| **Social Hub (real backend)** | Future | Requires backend. Mock UI is sufficient for 1.0. |
| **Cloud sync** | Future | Requires backend. Profile export/import covers the use case. |
| **Custom marketplace** | Future | Use Modrinth API. Build your own when you have users. |
| **Themes / color customizer** | Future | Current design is premium. Customization is Year 2. |
| **Client+ premium tier** | Future | Need users first, then monetize. |
| **Auto-updater** | Future | Manual updates acceptable for beta. Critical for public release. |
| **Plugin system** | Future | Massive engineering. Post-1.0. |
| **CurseForge integration** | Experimental | Requires API key. Evaluate user demand. |
| **In-game overlay via Fabric mod** | Experimental | Standard Fabric mod, not CEF. Evaluate feasibility. |
| **CEF in-game overlay** | Rejected | Security risk, performance hit, maintenance burden. |
| **Dynamic Java compilation** | Rejected | Malware vector. Use standard Fabric API. |
| **Editor Studio** | Rejected (for now) | Separate product. Ship launcher first. |
| **Built-in server hosting** | Rejected | Out of scope. |
| **Blockchain/NFT** | Rejected | Hostile to users. |

---

## SECTION 14: MISSING FEATURES — EXPERT REVIEW

After reviewing the codebase, the existing plan, and the features of every major Minecraft launcher, here are features that are genuinely missing and worth adding:

### 14.1 Features That Must Exist

| Feature | Why It's Critical | What Happens Without It |
|---------|------------------|------------------------|
| **Instance locking** | Prevent launching two instances of the same profile simultaneously | File corruption, world save corruption, mod config conflicts |
| **Classpath length limit handling** | Windows has a ~32,000 character command line limit. 200+ mods can exceed it. | Minecraft silently fails to launch with `CreateProcess error=87` |
| **Log rotation** | Launcher logs grow indefinitely | Disk space consumed over months |
| **Orphaned process detection** | If the launcher crashes while Minecraft runs, the Java process is orphaned | User can't launch again ("already running"), wastes system resources |
| **Version JSON template variable engine** | Mojang's version JSONs use `${...}` template variables in arguments | Arguments are wrong without proper substitution, game crashes |
| **Mod loader version compatibility checking** | Fabric 0.15.x only supports MC 1.20.x, not 1.8.9 | User selects incompatible combo, gets cryptic crash |
| **Library rule evaluation** | Mojang version JSONs have `rules` arrays with OS/arch/feature conditions for libraries | Wrong libraries included/excluded, crash on launch |
| **Download journal / write-ahead log** | Track in-progress multi-file operations | Interrupted downloads leave half-installed states |
| **Graceful shutdown** | On window close: cancel active downloads, save state, kill child processes | Orphaned downloads, corrupted partial files, zombie processes |
| **Concurrent profile access prevention** | Lock instance directory while game is running | Mod modifications during gameplay corrupt state |

### 14.2 Features That Should Exist (Quality Differentiators)

| Feature | Why It Matters | Competitive Advantage |
|---------|---------------|----------------------|
| **Smart RAM recommendation** | Detect system RAM, suggest allocation. "You have 16GB. We recommend 4GB for this modpack (53 mods)." | Prism doesn't do this. CurseForge doesn't. Official launcher allocates too little by default. |
| **Mod compatibility pre-check** | Before launch, scan `mods/` directory for known incompatible mod pairs | Prevents the #1 support question: "Why does my game crash?" |
| **Launch time estimation** | "First launch: ~2 minutes (downloading 847 files). Subsequent launches: ~3 seconds." | Sets user expectations. Reduces "is it broken?" anxiety. |
| **Changelog viewer per mod** | When a mod update is available, show what changed | Users can make informed decisions about updating |
| **Profile snapshot before upgrade** | Auto-backup before changing MC version or loader | Users can rollback if upgrade breaks things |
| **Server join shortcut** | Profile can have a "default server" → game auto-connects on launch | One-click to play on your favorite server. Lunar has this. |
| **JVM crash vs Minecraft crash detection** | Differentiate between JVM-level segfault and Minecraft-level exception | Different diagnosis path for each |
| **Post-crash mod bisection tool** | If crash detected, offer to binary-search which mod causes it by disabling half at a time | Automated debugging that would take users hours manually |

### 14.3 Features That Should Be Removed or Deferred

| Feature | Current State | Recommendation | Reason |
|---------|-------------|----------------|--------|
| `InspectorApp.tsx` (235 lines) | Standalone Electron window | Defer to post-1.0, merge into integrated Developer Panel | Maintaining two Electron entry points doubles complexity |
| `inspector.html` + `inspector.tsx` | Second Vite entry point | Remove | Same as above |
| `test-memory.cjs` + `test-metrics.cjs` | Root-level test scripts | Move to `scripts/` or delete | Cluttering the project root |
| `CHANGELOG.md` (49KB) | Massive development log | Archive, start fresh for v1.0 | Historical log is noise for new contributors |
| `Guide images/` directory | Contains one subdirectory | Remove from repo, use documentation platform | Binary assets don't belong in source control |
| `removed file/` directory | Old removed code | Delete entirely | Dead code in version control |
| `implementation_plan before phase 2` | Previous architecture document | Archive or delete | Superseded by this document |
| Hardcoded "By Atyachari" branding | In Home.tsx, Settings.tsx headers | Move to a `branding.ts` config file | Hardcoded strings prevent customization and complicate white-labeling |

---

## SECTION 15: FINAL ARCHITECTURE AUDIT

### 15.1 Architectural Weaknesses

| Weakness | Severity | Resolution |
|----------|----------|-----------|
| **No transaction/journal system for multi-file operations** | High | Profile creation, mod installation, and version downloads are multi-step filesystem mutations. If the process is interrupted halfway, the state is inconsistent. Implement write-ahead logging: write intentions to a journal file → execute each step → mark complete → delete journal. On boot, replay incomplete journals. |
| **No schema versioning for config files** | High | When `settings.json` or `profiles.json` format changes between launcher versions, old files break. Add a `schemaVersion` field to every JSON config. Write migration functions: `migrate_v1_to_v2(data)`. Run migrations on boot. |
| **No cancellation mechanism for long operations** | Medium | Downloads, installations, and verifications should be cancellable. Use `AbortController` for fetch requests. Check cancellation flag between steps in multi-step operations. Propagate cancellation through the entire task chain. |
| **Windows command line length limit** | Medium | With 200+ mods, the classpath string can exceed Windows' 32,767 character limit. Solution: Write classpath to a temporary file, pass `@classpath.txt` to Java (supported since Java 9). For Java 8 profiles, use classpath wildcards or a custom classloader. |
| **No process group management** | Medium | When Minecraft spawns child processes (native audio, crash reporter), killing the main process doesn't kill children. Use `spawn` with `detached: false` and `tree-kill` for cleanup. |
| **Single-threaded asset verification** | Low | Verifying 4,500 asset hashes sequentially is slow. Use worker threads for parallel hashing. Node.js `worker_threads` or compute hashes in a separate process. |

### 15.2 Security Weaknesses

| Weakness | Severity | Resolution |
|----------|----------|-----------|
| **Auth tokens stored as plain JSON** | Critical | Must encrypt `accounts.json` at rest. Use OS keychain (`keytar`) for the encryption key, or DPAPI on Windows. Never log token values. |
| **No CSP (Content Security Policy)** | High | Electron window loads external images (mc-heads.net). Without CSP, any injected script can load arbitrary remote resources. Set CSP header in BrowserWindow: `default-src 'self'; img-src 'self' https://mc-heads.net; connect-src https://api.modrinth.com https://piston-meta.mojang.com` |
| **Modrinth API calls from renderer** | Medium | Currently `Marketplace.tsx` calls `fetch()` directly to Modrinth. After enabling `contextIsolation`, this must go through the IPC bridge → main process. Benefit: rate limiting, caching, and error handling are centralized. |
| **No input validation on settings** | Medium | RAM allocation accepts any string via `onChange`. User could enter "999" (gigabytes) or negative numbers. Validate all settings before persisting: RAM within 1-32GB, resolution within 320x240 to 7680x4320, JVM args don't contain shell escapes. |
| **Downloaded mod JARs are not sandboxed** | Low (accepted risk) | Mods are arbitrary Java code. This is inherent to Minecraft modding. Mitigate by only downloading from trusted sources (Modrinth, CurseForge) and verifying hashes. Document the risk to users. |

### 15.3 Performance Weaknesses

| Weakness | Severity | Resolution |
|----------|----------|-----------|
| **Modrinth API debounce too short (50ms)** | High | Increase to 300ms. Implement a proper rate limiter (token bucket, 250 req/min). |
| **Synchronous FS calls in Screenshots.tsx** | Medium | `readdirSync` and `statSync` block the UI thread. Convert to async `fs.promises` operations. After IPC migration, this is handled naturally (main process is non-blocking from renderer's perspective). |
| **No image lazy loading in Marketplace** | Medium | 20 mod icons load simultaneously. With virtual scrolling, only visible items should load images. Use `loading="lazy"` on `<img>` elements or `IntersectionObserver`. |
| **CSS duplicate declarations** | Low | `input[type=range]` is styled twice in `index.css` (lines 169-197 and 247-269). Second declaration overrides first. Remove the duplicate. |
| **Electron app size** | Low | Electron 43 base is ~90MB. With assets (~3.3MB of PNGs), the installer will be ~95MB. Acceptable for now. Compress images to WebP before v1.0 release to shave 2MB. |

### 15.4 UX Weaknesses

| Weakness | Severity | Resolution |
|----------|----------|-----------|
| **No loading state for launch** | High | Clicking "LAUNCH GAME" currently does nothing. When the launch pipeline is built, there must be a multi-phase progress indicator: "Authenticating... Checking files... Downloading 3 assets... Launching..." |
| **No empty state for Home page** | Medium | If the user has no profiles (after deleting all), the Home page shows an empty grid with no guidance. Add: "Create your first profile to get started" CTA. |
| **Settings don't indicate what requires restart** | Medium | If the user changes Hardware Acceleration, it takes effect on restart. The setting should show "(requires restart)" label. |
| **No confirmation for destructive actions** | Medium | "Clear Cache" and profile deletion should require confirmation ("Are you sure? This will delete X files."). Profile deletion exists in the design but must be implemented. |
| **Hardcoded "Atyachari" username throughout** | Low | `RightSidebar.tsx` shows "Atyachari" and loads avatar from mc-heads.net. After auth is implemented, this must read from `useAuthStore`. Until then, show "Sign In" placeholder. |
| **No visual feedback for non-functional buttons** | Low | "LAUNCH GAME", "New Profile", "Add Account" buttons exist but do nothing. Add `cursor: not-allowed` and tooltip "Coming soon" for unimplemented features, or disable them. |

### 15.5 Maintainability Issues

| Issue | Impact | Resolution |
|-------|--------|-----------|
| **`any` type used extensively** | TypeScript's safety is negated | Define interfaces for `Profile`, `Mod`, `InstalledMod`, `Account`, `Settings`. Replace all `any` with concrete types. |
| **Inline styles dominate** | Every component uses `style={{...}}` objects. Changes require finding the exact component, exact line. | Acceptable for now (the UI works and looks good). When decomposing components in Milestone 6, extract repeated style patterns to CSS classes. Do not refactor styles before core functionality ships. |
| **No code formatting standard** | Mix of single/double quotes, inconsistent semicolons, mixed line endings (CRLF in some files) | Add `.prettierrc` and format all files. Add to git pre-commit hook. |
| **No `.env` for configuration** | Hardcoded paths, API URLs | Create `.env.development` and `.env.production`. Move all environment-specific values there. |

### 15.6 Missing Abstractions

| Abstraction | Why It's Needed | Impact of Not Having It |
|------------|----------------|------------------------|
| **`IContentSource`** | Modrinth API is hardcoded. Adding CurseForge means duplicating all logic. | Feature lock-in to single provider |
| **`ILoaderProvider`** | Each loader has a different installation process. Need a common interface. | Can't add new loaders without modifying core code |
| **`IAuthProvider`** | Microsoft auth is the only provider. Offline mode is a separate code path. | Auth logic scatters across components |
| **`IJavaProvider`** | Java download source could change (Adoptium, Azul, Corretto). | Locked to single provider |
| **`EventBus` with typed events** | Components communicate via scattered IPC messages and state updates. | Adding new cross-cutting concerns (logging, analytics, plugins) requires modifying every call site |

### 15.7 Final Verdict

The existing implementation plan is **architecturally sound** for its stated scope. The dependency pyramid is correct. The milestone ordering is correct. The technology choices are defensible.

The additions in this appendix address the gaps between "a good architecture document" and "a production engineering specification":

1. **Product vision** gives the team a north star for every decision
2. **User journeys** prevent UX gaps from being discovered during implementation
3. **State machine** prevents impossible states and race conditions
4. **Error recovery matrix** ensures no failure mode is unhandled
5. **Self-healing** differentiates from every competitor except Lunar
6. **Performance budget** prevents the #1 Electron complaint: "it's slow"
7. **Plugin architecture (future-proof)** prevents architectural lock-in
8. **Abstraction layers** prevent provider lock-in
9. **Debugging tools** cut investigation time by 10x
10. **First-run wizard** determines user retention
11. **Testing matrix** makes "done" objective, not subjective
12. **Priority matrix** prevents scope creep during implementation
13. **Missing features** catches gaps before they become support tickets
14. **Final audit** catches the last architectural weaknesses

**This document, combined with the original blueprint, is now the complete engineering specification. Implementation can begin.**

---
---

# V2.0 ADDITIONS — FINAL MASTER BLUEPRINT

> **V2.0 Addendum Date**: July 6, 2026  
> **Purpose**: Elevate the blueprint from an architecture document to a lifetime engineering specification. Every section below was written to survive years of development without revision to its core principles.

---

## SECTION 16: PROJECT PHILOSOPHY

### 16.1 Why Does This Launcher Exist?

The Minecraft launcher ecosystem is fractured. The official launcher is neglected. Lunar Client is a walled garden. Prism Launcher is powerful but intimidating. CurseForge is adware. Modrinth App is early-stage. No single launcher combines **power, beauty, and openness**.

Custom Client exists to be the launcher that doesn't force tradeoffs. It must be:
- As powerful as Prism Launcher
- As beautiful as Lunar Client
- As open as MultiMC
- As easy as the official launcher

### 16.2 Who Is the Target Audience?

| Audience | Description | Why They Choose Us |
|----------|-------------|-------------------|
| **Modded players** | Install Fabric/Forge mods, use 20-100 mods per profile | Integrated Modrinth browser, auto-dependency resolution, per-profile isolation |
| **PvP/competitive** | Play Hypixel, Bedwars, practice servers | Performance-first profiles, one-click server join, optimized defaults |
| **Casual modpack users** | Download and play curated modpacks | One-click `.ccpack` import, auto-updates, no manual file management |
| **Content creators** | Stream/record Minecraft, need multiple setups | Fast profile switching, clean UI for streams, Discord Rich Presence |
| **Power users** | Want full control over JVM, Java versions, instance directories | Every setting exposed, CLI-friendly, extensible |

### 16.3 Who Is NOT the Target Audience?

| Non-Audience | Why |
|-------------|-----|
| Bedrock Edition players | Java Edition only. Bedrock has completely different architecture. |
| Users who want a cheat client | This is not a hacked client. We do not bypass server anti-cheat. |
| Users who want built-in server hosting | Launchers launch games. Server hosting is a separate product. |
| Enterprise/education deployments | We don't target classrooms or corporate Minecraft setups. |

### 16.4 Permanent Engineering Principles

These principles are immutable. They apply to every commit, every PR, every design decision.

| # | Principle | Meaning |
|---|----------|--------|
| 1 | **Ship the launcher, not the vision** | A working launcher with 10 features beats a broken launcher with 100 features. |
| 2 | **Security is not optional** | Every IPC channel is typed. Every file path is validated. Every token is encrypted. No exceptions. |
| 3 | **Every state must be recoverable** | If the launcher crashes, no data is lost. If a download is interrupted, it resumes. If a config is corrupted, it self-heals. |
| 4 | **The user never sees a stack trace** | Every error has a human-readable message, a suggested action, and a log entry. |
| 5 | **Dependencies are interfaces, not implementations** | Modrinth, Mojang, Microsoft — all accessed through abstractions. Swapping providers changes one file. |
| 6 | **Measure before optimizing** | No performance work without profiling data. No "I think this is slow." |
| 7 | **One source of truth** | Profiles live in `profiles.json`. Settings live in `settings.json`. State lives in Zustand. Never duplicate. |
| 8 | **Offline is a first-class mode** | The launcher must be fully functional without internet, minus features that inherently require it. |
| 9 | **Test the boundaries, not the middle** | Unit test services. Integration test the launch pipeline. Don't test React component internals. |
| 10 | **Document decisions, not code** | Code should be self-documenting. Architecture decisions need ADRs. |

---

## SECTION 17: PRODUCT IDENTITY

### 17.1 What Makes This Launcher Unique

**The hybrid thesis**: Every existing launcher optimizes for one axis — power (Prism), beauty (Lunar), or convenience (CurseForge). Custom Client is the first launcher designed from the ground up to score highly on all three simultaneously.

```
                    POWER
                      ▲
                      │
           Prism ●    │    ● Custom Client (target)
                      │
       MultiMC ●      │
                      │
    ──────────────────┼──────────────────► BEAUTY
                      │
          Official ●  │         ● Lunar
                      │
     CurseForge ●     │   ● Modrinth App
                      │
```

### 17.2 Mission, Vision, Values

**Mission**: Make Minecraft Java Edition modding accessible to everyone without sacrificing power or aesthetics.

**Vision**: Become the default launcher for modded Minecraft — the way VS Code became the default editor for web development.

**Core Values**:
1. **Openness** — Open mod ecosystem, no locked mod sets, no walled garden
2. **Quality** — Every pixel, every interaction, every error message is crafted
3. **Respect** — No adware, no spyware, no dark patterns, no data sales
4. **Resilience** — Self-healing, auto-recovery, graceful degradation
5. **Speed** — Sub-second UI responses, efficient downloads, fast launches

### 17.3 Long-Term Ecosystem

```mermaid
graph TD
    subgraph "Year 1: The Launcher"
        LAUNCHER["Custom Client Launcher"]
        MODRINTH["Modrinth Integration"]
        PROFILES["Profile System"]
    end

    subgraph "Year 2: The Platform"
        MARKETPLACE["Custom Marketplace"]
        PREMIUM["Client+ Premium"]
        SOCIAL["Social Hub"]
        API["Public API"]
    end

    subgraph "Year 3: The Ecosystem"
        STUDIO["Editor Studio"]
        COMMUNITIES["Communities"]
        CREATOR_PROGRAM["Creator Program"]
        MOBILE["Mobile Companion App"]
    end

    LAUNCHER --> MARKETPLACE & PREMIUM & SOCIAL
    MARKETPLACE --> STUDIO & COMMUNITIES & CREATOR_PROGRAM
    SOCIAL --> COMMUNITIES
    API --> MOBILE
```

---

## SECTION 18: ARCHITECTURE DECISION RECORDS

Every major technology choice must be documented as an ADR. This prevents future developers from asking "why did we choose X?" and accidentally reversing a deliberate decision.

### ADR-001: Electron as Desktop Framework

| Field | Content |
|-------|--------|
| **Decision** | Use Electron 43+ as the desktop application framework |
| **Reason** | Fastest time-to-market with existing React/TypeScript skills. Mature ecosystem. Proven by VS Code, Discord, Slack. |
| **Alternatives Considered** | **Tauri** (Rust, smaller binary, better perf) — rejected due to less mature ecosystem and no team Rust experience. **NW.js** — declining community. **Native (C++/Qt)** — too expensive for a small team. |
| **Tradeoffs** | ~150MB binary size. Higher RAM baseline (~80MB idle). Slower cold start vs native. |
| **Future Impact** | If Electron becomes untenable (performance, size), Tauri migration is possible because the main process service layer is framework-agnostic TypeScript. |

### ADR-002: IPC with contextBridge

| Field | Content |
|-------|--------|
| **Decision** | `contextIsolation: true` + `sandbox: true` + typed `contextBridge` in `preload.ts` |
| **Reason** | Security. The renderer must never access Node.js APIs directly. Any XSS or malicious content could execute arbitrary system commands. |
| **Alternatives Considered** | **`nodeIntegration: true`** (current state) — rejected, critical security flaw. **`MessagePort` channels** — more complex, less ergonomic. |
| **Tradeoffs** | Every new main-process capability requires adding an IPC handler + preload bridge entry. Slightly more boilerplate. |
| **Future Impact** | This is the correct long-term architecture. Electron is moving toward stricter sandboxing. |

### ADR-003: Zustand for State Management

| Field | Content |
|-------|--------|
| **Decision** | Use Zustand for renderer-side state management |
| **Reason** | Lightweight (~1KB), TypeScript-native, no boilerplate (vs Redux), no provider wrapping (vs Context), supports middleware and devtools. |
| **Alternatives Considered** | **Redux Toolkit** — too much boilerplate for this project size. **Jotai** — atom-based model is less intuitive for service-oriented state. **MobX** — decorator-heavy, less TypeScript-friendly. **React Context** — doesn't scale past 5 contexts without performance issues. |
| **Tradeoffs** | Less opinionated than Redux. Team must establish their own patterns. |
| **Future Impact** | Zustand stores can be composed. Adding new stores for plugins, cloud sync, etc. requires zero changes to existing stores. |

### ADR-004: File-Based Configuration (not localStorage)

| Field | Content |
|-------|--------|
| **Decision** | Store all configuration in JSON files under `app.getPath('userData')` |
| **Reason** | `localStorage` is browser-scoped, volatile (cleared with cache), size-limited (5-10MB), and inaccessible from the main process. JSON files on disk are persistent, unlimited, and accessible from both processes. |
| **Alternatives Considered** | **SQLite** — overkill for key-value config. **electron-store** — viable, but adds a dependency for something achievable with `fs.writeFile`. **IndexedDB** — same limitations as localStorage. |
| **Tradeoffs** | Must implement schema versioning and migration manually. Must handle concurrent writes carefully. |
| **Future Impact** | JSON files are human-readable and debuggable. Users can manually edit settings if needed. Migration system handles schema evolution. |

### ADR-005: Process Architecture (Main Process Services)

| Field | Content |
|-------|--------|
| **Decision** | All business logic, filesystem operations, network requests, and process management run in the Electron main process, not the renderer |
| **Reason** | Security (renderer is sandboxed), reliability (renderer crashes don't lose state), testability (services can be unit-tested without Electron). |
| **Alternatives Considered** | **Utility processes** — Electron supports spawning utility processes. Good for CPU-intensive work (hashing). Defer until profiling shows main process bottleneck. **Web Workers** — renderer-only, can't access Node APIs. |
| **Tradeoffs** | Main process is single-threaded. CPU-intensive operations (hashing large files) block IPC. Mitigation: use worker_threads for hashing. |
| **Future Impact** | If main process becomes a bottleneck, offload specific services to utility processes without changing the IPC contract. |

### ADR-006: Content-Addressed Asset Storage

| Field | Content |
|-------|--------|
| **Decision** | Follow Mojang's content-addressed asset storage scheme (files named by SHA1 hash, stored in `objects/{first2chars}/{hash}`) |
| **Reason** | Automatic deduplication across Minecraft versions. Integrity verification built into the naming scheme. Compatible with Mojang's asset index format. |
| **Alternatives Considered** | **Version-scoped directories** — wastes disk space, duplicates shared assets. **Database-tracked** — adds complexity for no benefit. |
| **Tradeoffs** | Asset directories are not human-browsable (filenames are hashes). |
| **Future Impact** | This scheme scales to infinite Minecraft versions with constant marginal disk cost. |

### ADR-007: Profile = Instance Isolation

| Field | Content |
|-------|--------|
| **Decision** | Each profile gets its own isolated instance directory (`instances/{uuid}/.minecraft/`) |
| **Reason** | Mod conflicts, config conflicts, and world corruption are the #1 source of user frustration in shared-directory launchers. Isolation eliminates this entire class of bugs. |
| **Alternatives Considered** | **Shared `.minecraft` with profile switching** — the official launcher's approach. Causes mod conflicts, config bleed, and is the reason launchers like Prism exist. |
| **Tradeoffs** | Higher disk usage (each profile has its own configs, saves). Mitigated by shared libraries/assets. |
| **Future Impact** | Instance isolation enables safe experimentation. Users can break one profile without affecting others. |

### ADR-008: Loader-Agnostic Architecture

| Field | Content |
|-------|--------|
| **Decision** | Define an `ILoaderProvider` interface. Implement Fabric, Forge, NeoForge, Quilt as separate providers behind this interface. |
| **Reason** | The Minecraft modding ecosystem is fragmented. Locking to one loader alienates users. Each loader has different installation mechanics but the same conceptual steps. |
| **Alternatives Considered** | **Fabric-only** (original plan) — rejected. Forge has the largest mod library. **Hard-coded per-loader** — rejected, duplicates code. |
| **Tradeoffs** | Must maintain 4 loader implementations. Forge installation is significantly more complex than Fabric. |
| **Future Impact** | New loaders (e.g., a future Fabric fork) can be added by implementing `ILoaderProvider` without touching core code. |

### ADR-009: Download Manager with Write-Ahead Journal

| Field | Content |
|-------|--------|
| **Decision** | All multi-file download operations use a write-ahead journal (WAL) file to track intent, progress, and completion |
| **Reason** | Downloads can be interrupted by network loss, user closing the app, crashes, or power loss. Without a journal, partially-downloaded states are unrecoverable without starting from scratch. |
| **Alternatives Considered** | **Rely on hash verification on next boot** — works but wastes bandwidth by re-downloading already-complete files. **SQLite WAL** — overkill for this use case. |
| **Tradeoffs** | Journal file must be written synchronously (fsync). Small performance cost per download batch. |
| **Future Impact** | Journal enables resume-on-restart, progress reporting across restarts, and integrity auditing. |

### ADR-010: Microsoft Device Code Auth Flow

| Field | Content |
|-------|--------|
| **Decision** | Use Microsoft's Device Code OAuth2 flow for authentication |
| **Reason** | Simpler than embedded browser auth. More secure (no in-app browser for credentials). Works on systems without a GUI browser embedded in Electron. Avoids CSP issues with loading Microsoft's login page. |
| **Alternatives Considered** | **Authorization Code Flow with PKCE + localhost redirect** — viable but requires opening a local HTTP server. More complex. **Embedded BrowserView** — security concern (in-app browser for password entry). |
| **Tradeoffs** | User must switch to their system browser to enter the code. Slightly more friction. |
| **Future Impact** | Device Code flow is stable and unlikely to be deprecated by Microsoft. It's the recommended flow for CLI and desktop apps. |

### ADR-011: Encrypted Token Storage

| Field | Content |
|-------|--------|
| **Decision** | Encrypt `accounts.json` at rest using OS keychain (via `keytar` or `safeStorage`) |
| **Reason** | Auth tokens grant access to the user's Microsoft account and Minecraft profile. Storing them as plaintext JSON is a security vulnerability. |
| **Alternatives Considered** | **Electron `safeStorage`** — built-in, uses OS keychain. Preferred over `keytar` since it requires no native compilation. **AES-256 with hardcoded key** — useless, the key is in the source code. **OS credential manager directly** — platform-specific code for each OS. |
| **Tradeoffs** | `safeStorage` requires the main process. Encrypted data is not human-readable for debugging. |
| **Future Impact** | If switching to a more secure token storage (e.g., hardware security module), only `TokenStore.ts` changes. |

### ADR-012: TypeScript Throughout

| Field | Content |
|-------|--------|
| **Decision** | All new code in both main and renderer processes must be TypeScript with strict mode |
| **Reason** | Type safety catches bugs at compile time. Typed IPC channels prevent message format mismatches. Typed event bus prevents typos in event names. |
| **Alternatives Considered** | **JavaScript + JSDoc** — less enforcement. **ReScript/Elm** (renderer only) — too niche. |
| **Tradeoffs** | Slightly slower development due to type annotations. Compilation step. |
| **Future Impact** | TypeScript types serve as living documentation. New developers can understand the system by reading types. |

---

## SECTION 19: CONFIGURATION VERSIONING

### 19.1 Schema Version System

Every JSON configuration file contains a `schemaVersion` field at the root level:

```json
{
  "schemaVersion": 3,
  "data": { ... }
}
```

### 19.2 Migration Chain

```mermaid
graph LR
    V1["Schema V1"] -->|"migrate_v1_v2()"| V2["Schema V2"]
    V2 -->|"migrate_v2_v3()"| V3["Schema V3"]
    V3 -->|"migrate_v3_v4()"| V4["Schema V4"]
```

Migrations run sequentially. If the file is at V1 and the launcher expects V4, it runs V1→V2→V3→V4 in order.

### 19.3 Migration Rules

| Rule | Why |
|------|-----|
| Migrations MUST be **idempotent** | Running the same migration twice produces the same result |
| Migrations MUST **never delete data** | Rename deprecated fields to `_deprecated_{name}` instead |
| Migrations MUST **create a backup** before running | Write `{file}.backup.v{old}` before applying |
| Migrations MUST be **unit tested** | Each migration function has tests with real V(N) data |
| The **current schema version** is defined as a constant in code | `SETTINGS_SCHEMA_VERSION = 4` |
| **Unknown higher versions** are rejected | If the file says V5 but code only knows V4, show "Please update your launcher" |

### 19.4 Files That Require Versioning

| File | Current Schema | Likely Changes |
|------|---------------|----------------|
| `settings.json` | V1 | New settings added, deprecated settings removed, restructuring |
| `profiles.json` | V1 | New profile fields, content tracking evolution |
| `instance.json` | V1 | Per-instance settings additions |
| `accounts.json` | V1 | Token format changes, additional auth providers |
| `.content-lock.json` | V1 | Mod tracking metadata evolution |
| `.ccpack` manifest | V1 | New content types, new metadata fields |

### 19.5 Validation

Every config file is validated on load:
1. Is it valid JSON? → If not, attempt repair (backup + reset to defaults)
2. Does it have `schemaVersion`? → If not, assume V1
3. Is `schemaVersion` ≤ current? → If not, reject ("update your launcher")
4. Is `schemaVersion` < current? → Run migration chain
5. Does the data match the expected TypeScript interface? → If not, log warning, use defaults for missing fields

---

## SECTION 20: PROFILE MIGRATION SYSTEM

### 20.1 When Migration Happens

| Trigger | What Migrates |
|---------|---------------|
| Launcher update changes `profiles.json` schema | Profile metadata (names, IDs, paths, settings) |
| Launcher update changes `instance.json` schema | Per-instance JVM, Java, window, content tracking |
| User changes Minecraft version on a profile | Nothing migrates — it's a new version install. Old files remain. |
| User changes mod loader | Loader files change. Mods may become incompatible. User is warned. |
| Profile import from older launcher version | Imported profile is migrated to current schema on import. |

### 20.2 World Migration Safety

Minecraft worlds are the most valuable user data. Migration rules:

| Rule | Why |
|------|-----|
| **Never modify worlds during migration** | Worlds are opaque binary data. Any modification risks corruption. |
| **Never delete worlds during migration** | Even if a profile is deleted, offer to keep worlds. |
| **Auto-backup worlds before MC version upgrade** | Upgrading MC versions can change world format. Backup first. |
| **Store world backups in `instances/{uuid}/backups/`** | Colocated with the profile for easy discovery. |

### 20.3 Settings Migration

When global settings schema changes:
1. Read `settings.json` with old schema
2. Backup as `settings.backup.v{old}.json`
3. Apply migration functions sequentially
4. Validate migrated data against new TypeScript interface
5. Write migrated `settings.json` with new `schemaVersion`
6. Log: `INFO: Migrated settings from v{old} to v{new}`

### 20.4 Rollback

If migration fails:
1. Restore from backup file
2. Log the failure with full stack trace
3. Show user: "Settings migration failed. Your previous settings have been preserved. Please update to the latest launcher version."
4. Continue with the old-schema data (best-effort compatibility)

---

## SECTION 21: OBSERVABILITY & DIAGNOSTICS

### 21.1 Log Architecture

```
[2026-07-06T17:15:32.847Z] [INFO]  [LaunchEngine] Starting launch for profile "ATYACHARI PRIV." (id: a1b2c3d4)
[2026-07-06T17:15:32.850Z] [INFO]  [AuthService] Token valid, expires in 47 minutes
[2026-07-06T17:15:32.855Z] [INFO]  [JavaDetector] Found Java 17.0.11 at C:\Program Files\Eclipse Adoptium\jdk-17\bin\java.exe
[2026-07-06T17:15:32.860Z] [INFO]  [VersionManager] Version 1.20.4 already installed, skipping download
[2026-07-06T17:15:32.870Z] [DEBUG] [ClasspathBuilder] Classpath: 147 entries, 12,847 characters
[2026-07-06T17:15:32.875Z] [INFO]  [ProcessManager] Spawned java.exe (PID: 14872)
[2026-07-06T17:15:35.102Z] [INFO]  [ProcessManager] Minecraft window detected
```

### 21.2 Log Categories & Levels

| Category | Examples | Default Level |
|----------|---------|---------------|
| `LaunchEngine` | Launch phases, timing | INFO |
| `AuthService` | Login, refresh, token status (NEVER log token values) | INFO |
| `DownloadManager` | Download start/complete/fail, progress, retry | INFO |
| `HashVerifier` | Verification results | DEBUG |
| `ProfileManager` | CRUD operations | INFO |
| `SettingsStore` | Read/write, migration | INFO |
| `JavaDetector` | Scan results, version parsing | INFO |
| `ProcessManager` | Spawn, exit, signals | INFO |
| `IPC` | Channel calls (DEBUG only — payload may contain secrets) | WARN |
| `FileSystem` | File operations | DEBUG |
| `ModManager` | Install, remove, resolve | INFO |
| `IntegrityService` | Repair actions | INFO |
| `Renderer` | React errors, store updates | WARN |

### 21.3 Log Rotation

| Setting | Value | Why |
|---------|-------|-----|
| Max file size | 10MB | Prevent unbounded growth |
| Max files kept | 7 | One week of daily logs |
| File naming | `launcher-{YYYY-MM-DD}.log` | Easy to find by date |
| Rotation trigger | New day or max size exceeded | |
| Old log action | Compress to `.log.gz` | Save disk space |

### 21.4 Crash Dumps

On unhandled exception in the main process:
1. Capture full stack trace
2. Capture process memory usage
3. Capture current state (active profile, launch state, download state)
4. Write to `logs/crash-{timestamp}.json`
5. On next boot, detect crash dump → show "The launcher crashed. Send report?" dialog
6. Report includes: crash dump (sanitized — no tokens), log tail (last 100 lines), OS/hardware info

### 21.5 Structured Telemetry Events (Opt-In Only)

| Event | Data | Purpose |
|-------|------|--------|
| `launcher:boot` | OS, version, cold/warm start time | Track startup performance |
| `launch:start` | MC version, loader, mod count | Know what players use |
| `launch:success` | Time to launch | Performance tracking |
| `launch:crash` | Exit code, crash type (OOM, mod conflict, JVM) | Identify common failures |
| `download:complete` | File count, total bytes, duration | Network performance |
| `profile:create` | Loader type, template used | Feature usage |
| `error:unhandled` | Error class, stack trace (no user data) | Bug detection |

**Privacy rules**: All telemetry is opt-in. No personal data. No IP logging. No user tracking. Users can disable at any time. Data is anonymous and aggregated.

---

## SECTION 22: RELEASE ENGINEERING

### 22.1 Versioning

Follow **Semantic Versioning 2.0.0** (`MAJOR.MINOR.PATCH`):

| Component | When to Increment | Example |
|-----------|-------------------|--------|
| **MAJOR** | Breaking changes to profiles, settings, or plugin API | 1.0.0 → 2.0.0 |
| **MINOR** | New features, new loader support, new UI sections | 1.0.0 → 1.1.0 |
| **PATCH** | Bug fixes, security patches, performance improvements | 1.0.0 → 1.0.1 |

### 22.2 Release Channels

| Channel | Audience | Stability | Update Frequency | Auto-Update |
|---------|----------|-----------|-------------------|-------------|
| **Stable** | All users | Production-ready | Monthly | Yes (optional) |
| **Beta** | Opt-in testers | Feature-complete, may have bugs | Bi-weekly | Yes (optional) |
| **Alpha** | Internal testers | Work-in-progress features | Weekly | Manual |
| **Nightly** | Developers only | May be broken | Daily (automated) | Manual |

### 22.3 Feature Flags

New features are gated behind feature flags stored in `settings.json`:

```json
{
  "featureFlags": {
    "newMarketplaceUI": false,
    "cloudSync": false,
    "socialHub": false
  }
}
```

- Flags default to `false` in Stable, `true` in Alpha/Nightly
- Flags can be toggled in Developer Panel (`Ctrl+Shift+D`)
- Flags are removed once the feature ships to Stable

### 22.4 Git Strategy

| Branch | Purpose | Merges Into |
|--------|---------|-------------|
| `main` | Stable releases only | — |
| `develop` | Integration branch | `main` (via release) |
| `feature/{name}` | Individual features | `develop` |
| `fix/{name}` | Bug fixes | `develop` or `main` (hotfix) |
| `release/{version}` | Release preparation | `main` + `develop` |

### 22.5 CI/CD Pipeline

```mermaid
graph LR
    PUSH["Push to develop"] --> LINT["Lint (oxlint)"]
    LINT --> TYPE["Type Check (tsc)"]
    TYPE --> TEST["Unit Tests"]
    TEST --> BUILD["Build (Vite + Electron)"]
    BUILD --> PACKAGE["Package (electron-builder)"]
    PACKAGE --> ARTIFACT["Upload artifacts"]
    
    RELEASE["Merge to main"] --> SIGN["Code Sign"]
    SIGN --> PUBLISH["Publish to GitHub Releases"]
    PUBLISH --> NOTIFY["Notify update server"]
```

### 22.6 Code Signing

| Platform | Certificate | Why |
|----------|-----------|-----|
| Windows | EV Code Signing Certificate | Prevents SmartScreen warnings. Users trust signed apps. |
| macOS | Apple Developer ID | Required for Gatekeeper. Unsigned apps are blocked by default. |
| Linux | GPG signature on AppImage | Verifiable integrity. |

---

## SECTION 23: UPDATE SYSTEM

### 23.1 Update Architecture

```mermaid
sequenceDiagram
    participant App as Launcher
    participant Server as Update Server
    participant FS as Filesystem
    participant User

    Note over App: On boot (background check)
    App->>Server: GET /updates/latest?channel=stable&current=1.2.0&os=win64
    Server-->>App: {version: "1.3.0", url, sha256, size, releaseNotes, mandatory: false}

    alt No update available
        App->>App: Continue normally
    else Update available
        App->>User: Show notification: "Update 1.3.0 available"
        
        alt User clicks "Update Now"
            App->>Server: Download update package
            Server-->>App: Streamed binary
            App->>FS: Write to temp/update-1.3.0.exe
            App->>App: Verify SHA256 hash
            
            alt Hash matches
                App->>FS: Backup current settings + profiles
                App->>User: "Restarting to apply update..."
                App->>App: Quit and launch installer
            else Hash mismatch
                App->>User: "Update download corrupted. Try again?"
                App->>FS: Delete temp file
            end
        else User clicks "Later"
            App->>App: Remind in 24 hours
        else User clicks "Skip This Version"
            App->>FS: Store skipped version in settings
        end
    end
```

### 23.2 Update Strategy Comparison

| Strategy | Description | Pros | Cons | Recommendation |
|----------|------------|------|------|----------------|
| **Full update** | Download entire new installer (~100MB) | Simple, reliable, guaranteed clean state | Large download, slow on poor connections | ✅ **Use for v1.0** — simplicity wins |
| **Delta update** | Download only changed files (~5-20MB) | Smaller download, faster update | Complex diffing logic, harder to verify integrity | 🟡 Consider for v2.0 |
| **Binary patching** (bsdiff) | Patch the existing binary in-place | Smallest download (~1-5MB) | Very complex, risk of corruption, hard to rollback | ❌ Overkill |
| **ASAR replacement** | Replace only the `app.asar` file (~5MB) | Fast, preserves Electron binary | Electron version updates still need full update | 🟡 Use for minor updates |
| **Background update** | Download while user works, apply on restart | Zero downtime | Complex state management, risk of file locking | 🟡 Consider for v2.0 |

### 23.3 What Survives Updates

| Item | Survives? | How |
|------|----------|-----|
| Settings | ✅ Yes | Stored in `%APPDATA%/.customclient/config/`, installer doesn't touch it |
| Profiles | ✅ Yes | Stored in `%APPDATA%/.customclient/instances/`, installer doesn't touch it |
| Accounts | ✅ Yes | Stored in `%APPDATA%/.customclient/config/accounts.json` |
| Downloaded versions/libraries/assets | ✅ Yes | Stored in `%APPDATA%/.customclient/versions/`, `libraries/`, `assets/` |
| Logs | ✅ Yes | Stored in `%APPDATA%/.customclient/logs/` |
| Cache | ❌ Cleared | Cache is ephemeral by definition |
| Temp files | ❌ Cleared | Temp directory is cleaned on update |

### 23.4 Mandatory vs Optional Updates

| Type | When | User Can Skip? | UI |
|------|------|----------------|----|
| **Optional** | Feature updates, minor improvements | ✅ Yes | Notification banner, dismissible |
| **Recommended** | Important bug fixes, performance improvements | ✅ Yes (with warning) | Modal with "Update" and "Remind Later" |
| **Mandatory** | Security vulnerabilities, broken launch pipeline | ❌ No | Full-screen modal, blocks launcher until updated |
| **Emergency** | Critical security patch (e.g., token leak) | ❌ No | Auto-downloads, shows "Updating..." screen, auto-restarts |

### 23.5 Rollback

Before every update:
1. Copy current `app.asar` to `backups/app-{version}.asar`
2. Copy current `settings.json` to `backups/settings-{version}.json`
3. If update fails → restore from backup
4. Keep last 3 update backups
5. Rollback is automatic on update failure, manual via Developer Panel for user-initiated rollback

---

## SECTION 24: ARCHITECTURE GUARDRAILS

These rules are **permanent**. They apply to every line of code, every PR, every architectural decision. Violating a guardrail requires an ADR explaining why.

### Security Guardrails

| # | Rule | Why |
|---|------|-----|
| S1 | **Never enable `nodeIntegration` in any BrowserWindow** | Any XSS can execute arbitrary system commands |
| S2 | **Never disable `contextIsolation`** | Same as above |
| S3 | **Never disable `webSecurity`** | Allows cross-origin attacks |
| S4 | **Never store auth tokens as plaintext** | Tokens grant access to Microsoft accounts |
| S5 | **Never log auth tokens, access keys, or passwords** | Logs are stored on disk and could be shared in bug reports |
| S6 | **Never load remote URLs in BrowserWindows** | Only load local `file://` URLs. External content opens in system browser. |
| S7 | **Never execute user-supplied strings as code** | No `eval()`, no `new Function()`, no `child_process.exec(userInput)` |

### Data Guardrails

| # | Rule | Why |
|---|------|-----|
| D1 | **Never modify world save files** | Worlds are the user's most valuable data. Any modification risks corruption. |
| D2 | **Never delete user data without explicit confirmation** | Profiles, worlds, screenshots — always confirm before delete |
| D3 | **Never write to instance directories while the game is running** | File locking and corruption risks |
| D4 | **Always backup before migration** | If migration fails, the original data must be recoverable |
| D5 | **Every JSON config file must have a `schemaVersion` field** | Enables forward-compatible migrations |
| D6 | **Every destructive filesystem operation must be journaled** | Write intent to journal → execute → clear journal. Enables crash recovery. |

### Code Guardrails

| # | Rule | Why |
|---|------|-----|
| C1 | **Never access Node.js APIs from the renderer process** | All fs/net/process operations go through IPC |
| C2 | **Never duplicate business logic between main and renderer** | Logic lives in services (main process). UI calls services via IPC. |
| C3 | **Never hardcode API URLs** | All external endpoints must be constants in a dedicated file, behind abstraction interfaces |
| C4 | **Never create components over 400 lines** | Decompose into sub-components when approaching this limit |
| C5 | **Never use `any` type in new code** | Define proper TypeScript interfaces. Existing `any` is technical debt to be resolved. |
| C6 | **Never create circular dependencies between services** | Use dependency injection or event bus for cross-service communication |
| C7 | **Never import from `electron` in renderer code** | The preload bridge is the only sanctioned bridge |

### Process Guardrails

| # | Rule | Why |
|---|------|-----|
| P1 | **Never ship without running the full test suite** | Regressions caught before users see them |
| P2 | **Never merge to `main` without code review** | Even solo developers should self-review with a time gap |
| P3 | **Never release without update rollback capability** | If the update breaks something, users must be able to recover |
| P4 | **Never skip code signing for releases** | Unsigned binaries trigger OS warnings and erode trust |
| P5 | **Every architectural decision must have an ADR** | Prevents "why did we do this?" questions and accidental reversals |

### API Guardrails

| # | Rule | Why |
|---|------|-----|
| A1 | **Every IPC channel must have TypeScript type definitions** | Prevents message format mismatches between processes |
| A2 | **Every external API must be behind an abstraction interface** | Provider changes don't cascade through the codebase |
| A3 | **Every HTTP request must have a timeout (30s default)** | Prevent indefinite hangs on network issues |
| A4 | **Every API integration must implement rate limiting** | Respect provider limits, avoid bans |

---

## SECTION 25: IMPLEMENTATION CHECKLIST

Every task is actionable. Tasks are ordered so each completed task unlocks the next. Check marks track progress.

### Milestone 1: Foundation

- [ ] 1. Convert `electron/main.cjs` to `electron/main.ts`
- [ ] 2. Set `contextIsolation: true`, `sandbox: true`, `nodeIntegration: false`
- [ ] 3. Implement typed `preload.ts` with `contextBridge.exposeInMainWorld()`
- [ ] 4. Define IPC channel constants and TypeScript types in `ipc/channels.ts`
- [ ] 5. Build IPC handler registration system in `ipc/handlers/`
- [ ] 6. Build `FileSystemService` (async read/write/mkdir/exists/delete/copy)
- [ ] 7. Build `PathResolver` (userData, instances, versions, libraries, assets, java, cache, logs)
- [ ] 8. Build `Logger` (file + console, rotation, categories, levels)
- [ ] 9. Build `SettingsStore` (read/write `settings.json` with schema versioning)
- [ ] 10. Implement `settings.handler.ts` IPC handler
- [ ] 11. Implement `filesystem.handler.ts` IPC handler
- [ ] 12. Install Zustand, create `useSettingsStore`
- [ ] 13. Migrate Settings.tsx from `useLocalStorage` to `useSettingsStore` + IPC
- [ ] 14. Migrate all remaining `localStorage` usage to file-based storage
- [ ] 15. Wire Electron file dialog for "Choose Directory" buttons
- [ ] 16. Add `.prettierrc`, format all files
- [ ] 17. Verify: renderer cannot access `require`, `fs`, `child_process`

### Milestone 2: Core Services

- [ ] 18. Define TypeScript interfaces: `Profile`, `InstalledMod`, `Account`, `Settings`
- [ ] 19. Build `ProfileManager` service (CRUD on `profiles.json`)
- [ ] 20. Build `InstanceManager` (create/delete instance directories)
- [ ] 21. Implement `profile.handler.ts` IPC handler
- [ ] 22. Create `useProfileStore` (Zustand)
- [ ] 23. Refactor Home.tsx to use `useProfileStore`
- [ ] 24. Refactor Library.tsx to use `useProfileStore`
- [ ] 25. Refactor InstallModal.tsx to use `useProfileStore`
- [ ] 26. Build profile creation UI flow (modal: name → version → loader → create)
- [ ] 27. Build profile deletion with confirmation dialog
- [ ] 28. Build `DownloadManager` (queue, concurrency limit 8, retry with backoff, progress tracking)
- [ ] 29. Build `HashVerifier` (SHA1, SHA256, SHA512)
- [ ] 30. Build download write-ahead journal system
- [ ] 31. Implement `download.handler.ts` IPC handler
- [ ] 32. Create `useDownloadStore` (Zustand)
- [ ] 33. Build `ProgressBar` common component
- [ ] 34. Build `Toast` notification component
- [ ] 35. Build `ErrorBoundary` component
- [ ] 36. Unit test: `DownloadManager` (happy path, retry, cancel, resume)
- [ ] 37. Unit test: `HashVerifier` (match, mismatch, missing file)
- [ ] 38. Unit test: `ProfileManager` (CRUD, corrupted file recovery)

### Milestone 3: Game Infrastructure

- [ ] 39. Build `VersionManager` (fetch + parse Mojang `version_manifest_v2.json`)
- [ ] 40. Build `AssetManager` (download asset index + asset objects)
- [ ] 41. Build `LibraryManager` (download libraries with rule evaluation + OS filtering)
- [ ] 42. Build `NativeExtractor` (extract platform natives: .dll/.dylib/.so)
- [ ] 43. Build version selection UI (dropdown with real Mojang versions)
- [ ] 44. Integration test: download complete vanilla 1.20.4 installation
- [ ] 45. Build `JavaDetector` (scan PATH, registry, common dirs)
- [ ] 46. Build `JavaDownloader` (Adoptium API)
- [ ] 47. Implement `java.handler.ts` IPC handler
- [ ] 48. Wire Java path UI in Settings and ModpackWindow
- [ ] 49. Test: auto-download Java 17 on clean system
- [ ] 50. Build `AuthService` (Microsoft Device Code OAuth2 flow)
- [ ] 51. Build Xbox Live + XSTS token exchange
- [ ] 52. Build Minecraft Services authentication
- [ ] 53. Build `TokenStore` with `safeStorage` encryption
- [ ] 54. Build token refresh logic
- [ ] 55. Implement `auth.handler.ts` IPC handler
- [ ] 56. Create `useAuthStore` (Zustand)
- [ ] 57. Wire Account UI in RightSidebar and Settings
- [ ] 58. Build multi-account switching
- [ ] 59. Build offline mode (bypass auth with offline UUID)
- [ ] 60. Test: full auth flow → token persist → restart → still authenticated

### Milestone 4: Loaders & Launch Engine ⭐

- [ ] 61. Build `ILoaderProvider` interface
- [ ] 62. Implement `FabricLoader` (Fabric Meta API)
- [ ] 63. Implement `ForgeLoader` (Forge installer processing)
- [ ] 64. Implement `NeoForgeLoader` (NeoForge maven artifacts)
- [ ] 65. Implement `QuiltLoader` (Quilt Meta API)
- [ ] 66. Wire loader selection in ModpackWindow Versions tab
- [ ] 67. Test: install each loader on MC 1.20.4
- [ ] 68. Build `ClasspathBuilder` (assemble all JARs, handle Windows path length limit)
- [ ] 69. Build `ArgumentBuilder` (template variable substitution, auth injection, JVM args)
- [ ] 70. Build `LaunchEngine` orchestrator (validate → auth → java → files → classpath → args → spawn)
- [ ] 71. Build `ProcessManager` (spawn, monitor, kill, tree-kill children)
- [ ] 72. Build stdout/stderr capture + IPC forwarding
- [ ] 73. Build `ConsoleViewer` UI component
- [ ] 74. Build `LaunchProgress` UI component
- [ ] 75. Create `useLaunchStore` (Zustand)
- [ ] 76. Implement `launch.handler.ts` IPC handler
- [ ] 77. Wire LAUNCH GAME buttons to launch pipeline
- [ ] 78. Implement launch behavior (keep open / hide / close)
- [ ] 79. Build instance locking (prevent double-launch)
- [ ] 80. **🎮 END-TO-END TEST: Click Launch → Minecraft opens → play → quit → return to launcher**

### Milestone 5: Content Management

- [ ] 81. Build `ModrinthClient` (typed API wrapper with rate limiting)
- [ ] 82. Build `ModManager` (download JARs to profile `mods/` directory)
- [ ] 83. Build `ModResolver` (version + loader + dependency resolution)
- [ ] 84. Wire Marketplace Install to actual file download
- [ ] 85. Wire ModpackWindow Mods tab to real filesystem
- [ ] 86. Build mod toggle (rename `.jar` ↔ `.jar.disabled`)
- [ ] 87. Build mod update checking
- [ ] 88. Implement `mod.handler.ts` IPC handler
- [ ] 89. Build resource pack filesystem management
- [ ] 90. Build shader pack filesystem management
- [ ] 91. Build `.ccpack` export
- [ ] 92. Build `.ccpack` + `.mrpack` import
- [ ] 93. Build profile duplication (deep copy)
- [ ] 94. Test: install mod → launch → mod active in-game

### Milestone 6: Polish & Ship

- [ ] 95. Build `IntegrityService` (one-click profile repair)
- [ ] 96. Build startup health check
- [ ] 97. Build crash report parser
- [ ] 98. Decompose `Marketplace.tsx` into sub-components
- [ ] 99. Decompose `ModpackWindow.tsx` into tab components
- [ ] 100. Add error boundaries to all route-level components
- [ ] 101. Add markdown rendering for mod descriptions
- [ ] 102. Compress images to WebP
- [ ] 103. Remove dead assets and empty scaffolding
- [ ] 104. Add keyboard shortcuts
- [ ] 105. Full unit test suite for all services
- [ ] 106. Integration test: full launch pipeline (vanilla, Fabric, Forge)
- [ ] 107. Integration test: mod install pipeline
- [ ] 108. Cross-platform test: Windows 10/11
- [ ] 109. Cross-platform test: macOS
- [ ] 110. Cross-platform test: Ubuntu Linux
- [ ] 111. Configure `electron-builder` for Windows NSIS
- [ ] 112. Configure `electron-builder` for macOS DMG
- [ ] 113. Configure `electron-builder` for Linux AppImage
- [ ] 114. Set up code signing
- [ ] 115. Set up GitHub Releases CI/CD
- [ ] 116. Write user documentation
- [ ] 117. **🚀 V1.0 RELEASE**

---

## SECTION 26: FINAL V2.0 ARCHITECTURE AUDIT

After incorporating all V2.0 additions, these are the remaining gaps that will be addressed during implementation rather than design:

### Remaining Gaps (Acceptable — Resolve During Implementation)

| Gap | Why It's Acceptable | When To Address |
|-----|---------------------|----------------|
| **Exact CSP header configuration** | Depends on which external domains are actually loaded at runtime | Milestone 1, when configuring BrowserWindow |
| **Modrinth rate limiter token bucket parameters** | Needs real-world testing to tune | Milestone 5, when building ModrinthClient |
| **Forge installer internals** | Forge's installer process is complex and poorly documented. Requires reverse-engineering during implementation. | Milestone 4 |
| **Exact Adoptium API endpoints for Java download** | API docs are available; implementation detail | Milestone 3 |
| **React error boundary placement** | Depends on final component tree structure | Milestone 6 |
| **Specific keyboard shortcut assignments** | UX decision, not architecture | Milestone 6 |
| **First-run wizard visual design** | UI/UX design task, not architecture | Milestone 6 |

### Things That Are Now Fully Designed

| System | Status |
|--------|--------|
| Security model (IPC, sandboxing, encryption) | ✅ Complete |
| Process architecture (main → IPC → renderer) | ✅ Complete |
| Data directory structure | ✅ Complete |
| State management (Zustand stores, IPC sync) | ✅ Complete |
| Launch engine (6-phase pipeline) | ✅ Complete |
| Authentication chain (MS → XBL → XSTS → MC) | ✅ Complete |
| Download manager (queue, resume, journal, verify) | ✅ Complete |
| Profile lifecycle (create through delete) | ✅ Complete |
| Mod dependency resolution | ✅ Complete |
| Configuration versioning & migration | ✅ Complete |
| Error recovery matrix (15 failure modes) | ✅ Complete |
| Self-healing system | ✅ Complete |
| Application state machine (18 states) | ✅ Complete |
| User experience flows (7 journeys) | ✅ Complete |
| Performance budget & bottleneck mitigation | ✅ Complete |
| Plugin extension points (future-proof) | ✅ Complete |
| External dependency abstraction | ✅ Complete |
| Debugging architecture (10-tab developer panel) | ✅ Complete |
| Testing matrix (unit, integration, stress, platform) | ✅ Complete |
| Feature priority matrix (every feature ranked) | ✅ Complete |
| Release engineering (channels, CI/CD, signing) | ✅ Complete |
| Update system (download, verify, rollback) | ✅ Complete |
| Architecture guardrails (25 rules) | ✅ Complete |
| Architecture decision records (12 ADRs) | ✅ Complete |
| Implementation checklist (117 tasks) | ✅ Complete |
| Observability & logging | ✅ Complete |
| Folder structure (main + renderer) | ✅ Complete |
| .ccpack modpack format | ✅ Complete |
| Monetization strategy | ✅ Complete |
| Social hub design (2-tier) | ✅ Complete |
| Competitive analysis | ✅ Complete |

---

## V2.0 SIGN-OFF

> [!IMPORTANT]
> ### This Blueprint Is Complete
>
> This document — **Custom Client: Definitive Production Blueprint V2.0** — is the single source of truth for the entire project. It contains:
>
> - **11 original design parts** covering architecture, launch engine, modpack ecosystem, social hub, monetization, and roadmap
> - **15 architecture review sections** covering product vision, user journeys, state machines, error recovery, self-healing, performance, plugins, abstractions, debugging, onboarding, QA, and prioritization
> - **12 V2.0 additions** covering philosophy, identity, ADRs, config versioning, migration, observability, release engineering, update system, guardrails, implementation checklist, and final audit
>
> **Total: 38 sections. ~4,500 lines. One blueprint to rule them all.**
>
> No further architectural planning is required before implementation begins.
>
> **Begin with Implementation Checklist Task #1.**
