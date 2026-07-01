# Custom Client: Master Implementation Plan

Based on your precise requirements, this is the fully revised, multi-part master plan. This project is now a massive ecosystem consisting of a **Launcher**, a **Studio Editor**, a **Fabric Minecraft Mod**, and a **Backend**.

We will build this one part at a time. I will only proceed to the next part when you explicitly ask me to. At the end of each part, I will provide exact steps for you to test and verify the work.

## Core Architectural Decisions
- **Minecraft Version**: 1.19.xx and above.
- **Mod Loader**: Fabric.
- **UI Engine**: CEF (Chromium Embedded Framework) to overlay HTML/CSS/JS menus over Minecraft.
- **Scripting Environment**: 
  - *UI & Menus*: JavaScript, Lua, CSS.
  - *In-Game Modules (Crosshairs, HUD, etc.)*: **Java** (Compiled dynamically in-game).
- **Standalone Apps**: The ecosystem includes two separate desktop apps (built with Electron or Tauri).

---

## Part 1: The Main Launcher
**Goal**: Build a standalone desktop application (70% Lunar Client style, 20% Modrinth style) that manages accounts, downloads the base client, and launches the game.
1. Initialize an Electron/React project.
2. Build the UI: Sidebar, News page, Settings, Launch button.
3. Integrate Microsoft/Xbox Authentication for Minecraft.
4. Add logic to download the required Fabric dependencies and our custom JAR file.
5. **How to Verify**: You will run `npm start` to open the launcher, log in with your Microsoft account, and click "Launch" to see if Minecraft opens.

## Part 2: The Custom Client Mod (Minecraft Core)
**Goal**: Build the actual Fabric Mod for 1.19.xx+ that acts as the base of the client.
1. Generate the Fabric workspace using Gradle.
2. Integrate CEF (Chromium Embedded Framework) into Minecraft rendering.
3. Hook into the `InGameHud` and `Screen` classes to replace the Main Menu and Esc Menu with CEF browsers.
4. Build the bridge API so JS/Lua inside the CEF browser can send commands back to Minecraft (e.g., "Join Server", "Quit Game").
5. **How to Verify**: You will run `./gradlew runClient`. You should see Minecraft open, but the main menu will be an HTML page loaded via CEF.

## Part 3: The Dynamic Java Module Engine
**Goal**: Allow modders to write Java code (for crosshairs, HUDs, combo counters) in real-time without needing an external IDE or Gradle.
1. Integrate a dynamic Java compiler library (like Janino or JavaCompiler API) into the Fabric mod.
2. Build an event bus (Tick Event, Render Event) that these dynamic Java scripts can subscribe to.
3. **How to Verify**: We will drop a `.java` text file into a specific folder, and the game will instantly compile and render a new HUD element on the screen without restarting.

## Part 4: The Editor Studio
**Goal**: A standalone desktop app (like Roblox Studio) where creators can build their themes and modules.
1. Initialize a second Electron/React project.
2. Build a Code Editor interface (using Monaco Editor / VSCode core).
3. Create a live preview window that connects to the client or simulates the UI.
4. Add a "Publish to Marketplace" button.
5. **How to Verify**: You will run the Studio app, type some CSS/Java, and hit save to see the changes applied to a project folder.

## Part 5: The Marketplace Backend
**Goal**: A Node.js backend for the ecosystem.
1. Build an Express.js API and MongoDB database.
2. Create endpoints for uploading themes, downloading themes, and processing transactions (buying/selling).
3. **How to Verify**: Use Postman or the Studio App to upload a theme and see it appear in the database.

---

> [!IMPORTANT]
> **Checklist & Notebook Rules Applied:**
> - I have created a `ReadmefirstAi.md` in your root folder so I never forget these rules.
> - I have created a `CHANGELOG.md` which will serve as my notebook to detail exactly what I add/remove, why, and timestamps.
> - I will **stop** after completing a part and wait for you to verify it and command me to proceed.

Please review this master plan. If you approve, please click **Proceed** and tell me to begin **Part 1**.
