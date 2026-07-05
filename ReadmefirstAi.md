# ReadmefirstAi

**CRITICAL INSTRUCTIONS FOR AI CONTEXT**
*This file serves as the absolute source of truth for the project. Always refer to these rules and instructions.*

## Project: Custom Client

**Core Philosophy:** A 100% configurable Minecraft Client (Version 1.19.xx+). Players can create, sell, and download client themes and features (Marketplace).

### Architecture Rules
1. **Minecraft Client Base**: FABRIC ONLY. Targets Minecraft 1.19.xx and newer.
2. **UI Framework**: Chromium Embedded Framework (CEF) mapped over Minecraft. This allows themes, esc screens, and menus to be built with HTML/CSS/JS/Lua.
3. **Module Scripting**:
   - UI / Visuals / Menus -> JS / Lua / CSS.
   - In-game Modules (Crosshairs, Combo Counters, HUD) -> **Java**. Modders get full access to code in Java (requires dynamic compilation like Janino or similar within the client).
4. **Standalone Applications**:
   - **Main Launcher**: 70% Lunar Client, 20% Modrinth app style. This launches the game, manages accounts, and handles initial mod downloads.
   - **The Editor (Studio)**: A standalone application (similar to Roblox Studio) where modders/creators can build their client themes, edit UI, and write Java code for their custom features before pushing to the marketplace.
5. **Marketplace**: Modders have full control to buy/sell mods and themes directly through the client ecosystem.

### Workflow & AI Instructions
1. **Phased Approach**: DO NOT build everything at once. Work strictly on one part at a time. Only move to the next part when the user explicitly asks.
2. **Verifiability**: At the end of every part, provide explicit, step-by-step instructions on how the user can test and verify the code works.
3. **Changelog/Notebook**: Every single change, addition, or removal must be logged in `CHANGELOG.md` with timestamps, detailed explanations, reasons for the change, and **exactly which files and which lines were edited**.
// 4. [DEPRECATED - DO NOT USE ANYMORE] **Auto-Run for Logs**: Always test code logic by running background tasks, but **Graphical UI Apps (like Electron) must be run manually by the user** in their own terminal. The AI agent runs in a background Windows session, so if the AI starts an Electron app, it will remain invisible to the user on their desktop.
5. **GitHub Integration**: Keep the local repository clean and instruct the user how to push to GitHub when appropriate.
6. **Placeholders over Random Images**: Never use random stock images (like Unsplash) for placeholders. Always use inline generated SVG placeholders indicating "WIP" and explicitly stating the location/purpose of the placeholder.
7. **Always think**: Use deep reasoning for every step.

--- 
*Do not lose track of this scope. This is a massive project consisting of a Launcher, a Studio Editor, a Fabric Mod, and a Web Backend.*
