# Project Changelog & AI Notebook

*This file tracks every change made by the AI, including reasons, timestamps, and details.*

## [2026-07-01 21:35:00] - AI Initialization & Planning Revision
- **Added:** `ReadmefirstAi.md` to store core project rules and ensure the AI never loses track of the grand vision.
- **Added:** `CHANGELOG.md` to act as the notebook to track all actions and reasoning.
- **Reason:** The user requested a strict tracking mechanism (notebook) and a rule file (`ReadmefirstAi`) to manage the immense scope of the project (Launcher, Editor, Minecraft Mod, Backend).

## [2026-07-01 21:37:00] - Execution of Part 1 (Launcher Initialization)
- **Added:** Scaffolded a new React/Vite project in the `/launcher` folder.
- **Added:** Began installing Electron and dependencies (`electron`, `electron-builder`, `concurrently`) to convert the React web app into a desktop app.
- **Reason:** Per the user's plan approval, Part 1 is to build the standalone desktop Launcher (70% Lunar, 20% Modrinth style). The foundation is React + Electron.

## [2026-07-01 21:46:00] - Splitting Part 1
- **Modified:** Saved the master plan to `Main_Plan.md` in the root folder.
- **Modified:** Updated `task.md` to split Part 1 into "Part 1A: UI (Aesthetics)" and "Part 1B: Logic (Functionality)".
- **Reason:** The user requested we focus purely on the beautiful aesthetic design first before hooking up the complex backend logic.

## [2026-07-01 21:49:00] - UI Architecture & Low-End PC Mode
- **Added:** Requirement to implement a "Performance Mode" (Hardware Acceleration / Low-End PC toggle).
- **Files/Lines Edited:**
  - `launcher/src/index.css`: Lines 1-61 (Created new variables and `.performance-mode` class)
  - `launcher/src/App.tsx`: Lines 1-52 (Created layout with state toggle)
  - `launcher/src/components/Sidebar.tsx`: Lines 1-49 (Created component)
  - `launcher/src/components/Home.tsx`: Lines 1-45 (Created component)
## [2026-07-01 21:56:00] - Bugfix: Application Failed to Start
- **Added:** Fixed an issue where the Electron window failed to start and show the UI.
- **Files/Lines Edited:**
  - `launcher/package.json`: Line 8 (Moved `cross-env` so that `NODE_ENV=development` applies specifically to the `electron .` process instead of `wait-on`).
## [2026-07-01 22:04:00] - Major UI Overhaul (Lunar + Modrinth Merge)
- **Modified:** Completely redesigned the launcher UI to merge Lunar Client and Modrinth aesthetics.
- **Files/Lines Edited:**
  - `launcher/src/index.css`: Lines 1-84 (Added grid system, hover animations, unified dark theme).
  - `launcher/src/components/Sidebar.tsx`: Lines 1-72 (Redesigned as a slim, left-aligned Lunar-style sidebar).
  - `launcher/src/components/Home.tsx`: Lines 1-65 (Added massive Hero banner and Modrinth-style modpack grid).
  - `launcher/src/components/Settings.tsx`: Lines 1-27 (Created dedicated Settings page).
  - `launcher/src/App.tsx`: Lines 1-33 (Moved performance toggle to Settings, fixed flex layouts for responsiveness).
- **Reason:** The user provided screenshots of Lunar and Modrinth, noting that the previous UI lacked responsiveness, hover animations, and correct placement of the Low-End PC toggle.

## [2026-07-01 22:11:00] - UI Polish (Modal Settings, Cursor, WIP Placeholders)
- **Modified:** Fixed UI missing elements per user feedback.
- **Files/Lines Edited:**
  - `launcher/src/index.css`: Lines 1-137 (Restored `.glass` class for glassmorphism, added custom SVG cursor for body and buttons, added `:active` micro-animations for button presses, styled input ranges/checkboxes).
  - `launcher/src/App.tsx`: Lines 1-52 (Restored the dynamic video background and blur overlay, added logic to show Settings as a full-screen modal overlay instead of a tab).
  - `launcher/src/components/Settings.tsx`: Lines 1-105 (Completely rebuilt the Settings page as a dark modal overlay matching Lunar Client, with a left sidebar, sliders, and checkboxes).
  - `launcher/src/components/Home.tsx`: Lines 1-73 (Fixed responsiveness of the Hero banner by adding `minHeight` and `flexShrink`, replaced random Unsplash images with inline SVG placeholders stating "WIP - Location").
- **Reason:** The user noted several missing elements from the previous iteration, including the video background, the settings modal layout, missing custom cursors, missing micro-animations, and requested WIP placeholders instead of random images.

## [2026-07-01 22:15:00] - Bugfix: JSX Parse Error
- **Modified:** Fixed a syntax error preventing the React app from rendering.
- **Files/Lines Edited:**
  - `launcher/src/components/Home.tsx`: Lines 39 & 71 (Removed invalid backslashes inside string templates).
- **Reason:** The WIP image SVGs contained an accidental backslash escape sequence causing Vite to crash.

## [2026-07-01 22:38:00] - Iteration 5: Pixel Art Cursors
- **Modified:** Replaced the grid of 20 cursors with just two pixel-art themes (Purple Pixel & Green Pixel).
- **Files/Lines Edited:**
  - `launcher/src/components/Settings.tsx`: Lines 13-25, 128-142 (Added two pixel art SVG themes. The default state is a pixel arrow, and the hover `:pointer` state is a pixel hand).
  - `launcher/src/App.tsx`: Lines 10-75 (Updated the cursor state management to support distinct `default` and `pointer` URLs based on the selected theme).
## [2026-07-01 22:45:00] - Iteration 7: Exact Replica Purple Cursors
- **Modified:** Replaced the hardcoded Green Pixel cursor with a 100% identical replica of the user's provided purple pixel art cursors.
- **Files/Lines Edited:**
  - `launcher/src/index.css`: Lines 33-39 (Injected base64 SVG data URIs generated from a 1-to-1 pixel array matrix representing the exact shading, tail angle, and drop shadow of the user's uploaded image).
- **Reason:** The user requested the cursor be "100% identical" to their purple screenshot. A custom Node script was used to generate an exact SVG pixel replica.

## [2026-07-01 23:06:00] - Iteration 8: Launch Button Redesign & File Cleanup
- **Modified:** Changed the Launch Game button shape to a rounded rectangle (16px border-radius) and cleaned up unused clutter files from the project.
- **Files/Lines Edited:**
  - `launcher/src/index.css`: Line 117 (Changed `.btn-launch` border-radius from `100px` to `16px`).
  - Moved multiple unused files into a `removed file/` directory to declutter the workspace.
    - `launcher/src/App.css`: Replaced entirely by our global `index.css` and never imported.
    - `launcher/src/assets/react.svg` & `vite.svg`: Default scaffolding SVGs from Vite; never used.
    - `cursor_gen.js`: A temporary script used previously to build the pixel-perfect cursor matrix. 
    - `generated_cursors.css`: Temporary output from the generation script; the final base64 string is hardcoded directly into `index.css`.
- **Reason:** The user wanted the launch button "rectangularish with round corner" and asked to clean up any unused files hindering load times or causing clutter.

## [2026-07-01 23:42:00] - Iteration 9: Account Center Component
- **Modified:** Removed the small top-bar profile pill and replaced it with a fully-fledged "Account Center" panel at the top of the Right Sidebar.
- **Files/Lines Edited:**
  - `launcher/src/components/RightSidebar.tsx`: Lines 22-55 (Added the heavy glassmorphism "Playing as" card showing "Logged in as Atyachari" with a dynamic 3D isometric avatar from `mc-heads.net`, and an "Add Account" button. Utilized inset shadows and gradients to achieve a heavy glass look without heavy CSS operations).
  - `launcher/src/components/Home.tsx`: Lines 21-25 (Removed the old Notch profile pill from the welcome header).
- **Reason:** The user requested an Account management hub mimicking their screenshot, specifically wanting heavy glass aesthetics but optimized CSS performance.

## [2026-07-01 23:50:00] - Iteration 10: Marketplace Glassmorphism Overhaul
- **Modified:** Transformed the flat Modrinth-style layout in the Marketplace tab into a premium glassmorphic UI. 
- **Files/Lines Edited:**
  - `launcher/src/components/Marketplace.tsx`: Lines 54-130 (Replaced flat `#1a1a1a` solid borders with individual separated `className="glass"` cards for every mod. Wrapped the right sidebar filter menu in a massive frosted glass container. Added subtle hover translation and glow shadow effects to all mod cards).
- **Reason:** The user requested "more glass morphism" on the Marketplace layout to unify the aesthetic with the rest of the application.

## [2026-07-02 00:00:00] - Iteration 11: Lunar Client Style Library Hub
- **Added:** Implemented a full Lunar Client style custom version/modpack Library replacing the "Library (WIP)" placeholder.
- **Files/Lines Edited:**
  - `launcher/src/components/Library.tsx`: Lines 1-100 (Created a brand new component mirroring the Lunar Client modpack grid. Features a responsive grid of glassmorphic cards with immersive background images. Selecting a card dynamically populates the heavy glass right-sidebar panel with version details, toggles, and the main "LAUNCH GAME" button).
  - `launcher/src/App.tsx`: Lines 6-64 (Imported and rendered the new Library component when the library tab is active).
- **Reason:** The user requested a "custom version and modpack library like this [Lunar] but better". The result is a highly aesthetic, animated, glassmorphic layout.

## [2026-07-02 00:12:00] - Iteration 12: Standardized Placeholders & Tweaks
- **Modified:** Replaced all Unsplash/random stock images with dynamically generated SVG placeholder tags clearly labeled with "WIP" and their respective locations. 
- **Modified:** Changed the Custom directory button to have a flat `#1a1b1e` background matching the user's provided aesthetic rather than standard glassmorphism.
- **Files/Lines Edited:**
  - `launcher/src/components/Library.tsx`: Lines 2-130 (Added `generatePlaceholder()` function. Bound it to all Modpack `bg` properties and the Addons images. Replaced `.glass` class on the Custom directory button with hardcoded solid colors).
  - `ReadmefirstAi.md`: Lines 27-28 (Added a strict new rule to never use random stock images for placeholders going forward, opting exclusively for explicit SVG placeholders).
- **Reason:** To enforce consistency and obey user's strict instructions regarding placeholder visibility and asset standardization.

## [2026-07-02 00:20:00] - Iteration 13: Screenshots Gallery
- **Added:** A dedicated "Screenshots" tab accessible from the main left Sidebar.
- **Added:** Implemented a new heavy glassmorphic grid gallery to manage and share taken screenshots.
- **Files/Lines Edited:**
  - `launcher/src/components/Sidebar.tsx`: Lines 1-10 (Added the `ImageIcon` and inserted `{ id: 'screenshots', label: 'Screenshots' }` to the `topItems` array).
  - `launcher/src/components/Screenshots.tsx`: Lines 1-90 (Created the new component featuring a top action bar and a masonry-style responsive CSS grid. Added custom hover tooltips and dynamic SVG placeholders to enforce the strict placeholder rule).
  - `launcher/src/App.tsx`: Lines 6-69 (Imported `Screenshots` and conditionally rendered it within `<main>` when `activeTab === 'screenshots'`).
- **Reason:** The user explicitly requested a separate space/tab to view screenshots taken while playing the client.

## [2026-07-02 00:35:00] - Iteration 14: Live Modrinth API Integration
- **Modified:** Replaced the static mockup data in the Discover (Marketplace) tab with live data fetched directly from the Modrinth API.
- **Files/Lines Edited:**
  - `launcher/src/components/Marketplace.tsx`: Lines 1-150 (Completely rewrote the component to use React state for `query`, `mods`, and `offset`. Implemented a debounced `fetch()` call to `api.modrinth.com/v2/search`. Wired up the Category checkboxes to dynamically filter the API request via `facets`. Added a nested sub-view to display detailed mod information internally when "View" is clicked, rather than opening an external browser. Wired the "Install" button to persistently store its state in `localStorage` as a bridge for future backend downloading logic).
- **Reason:** The user requested the Modrinth API integration so the Discover tab is fully functional and shows actual available Fabric mods, setting the stage for the Java backend execution phase.

## [2026-07-02 00:43:00] - Iteration 15: Modrinth API Enhancements & Speed
- **Modified:** Significantly reduced the search debounce limit (400ms -> 50ms) to provide near-instantaneous search results.
- **Added:** Wired up the top navigation tabs (Modpacks, Mods, Resource Packs, Shaders) to properly filter the API via the `project_type` facet.
- **Added:** Implemented a functional "Sort by" dropdown mapped to the Modrinth API `index` parameter (Relevance, Downloads, Newest, Updated).
- **Added:** Wired up the Environment checkboxes (Client/Server) to filter via the `client_side` and `server_side` facets.
- **Files/Lines Edited:**
  - `launcher/src/components/Marketplace.tsx`: Lines 10-200 (Added state hooks for `projectType`, `sort`, and `selectedEnvironments`. Updated the `fetchMods` URL generation to string-build all the new facets. Reduced the `setTimeout` in the `useEffect` hook).
- **Reason:** User requested that all major buttons work, pointing out that 300 requests per minute is plenty for a single user, and asked for the debounce limit to be slashed so everything feels "way faster".

## [2026-07-02 00:52:00] - Iteration 16: UI Polish & Micro-animations
- **Modified:** Completely removed the native OS HTML `<select>` dropdown menu for sorting which broke the visual aesthetic with its default blue highlight. Replaced it with a fully custom, heavy glassmorphic dropdown menu built from scratch using React state and `<div>` layers.
- **Modified:** Restored missing micro-animations across the Discover tab. The Project Type tabs (Modpacks, Mods, etc.) now feature smooth cubic-bezier hover transitions (floating upwards slightly). The right sidebar Category and Environment filters now physically shift `4px` to the right when hovered, matching the interactive feel of the rest of the application.
- **Files/Lines Edited:**
  - `launcher/src/components/Marketplace.tsx`: Lines 10-430 (Replaced native `<select>` structure with a custom `isSortOpen` toggled menu. Injected `onMouseOver` style manipulators and `transform: translateY/X` CSS rules directly into the map functions for the tabs and sidebar checkboxes).
- **Reason:** The user correctly pointed out that the native dropdown broke the premium UI aesthetic and that the new interactive elements were missing the micro-animations that make the UI feel alive.

## [2026-07-02 01:05:00] - Iteration 17: Fixing Missing Animations
- **Modified:** Added cubic-bezier `translateY` hover micro-animations to the internal dropdown options, the Pagination Prev/Next buttons, and the View/Install action buttons on the Mod Cards. 
- **Files/Lines Edited:**
  - `launcher/src/components/Marketplace.tsx`: Lines 260-380 (Injected `transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'` and `onMouseOver`/`onMouseOut` event handlers for `e.currentTarget.style.transform`).
- **Reason:** User specified that there were still missing interactive micro-animations specifically in the dropdown menus and action buttons.

## [2026-07-02 01:17:00] - Iteration 18: Active Click Animation Refactor
- **Modified:** The previous inline hover transitions broke the native CSS `:active` scale state. I completely stripped the messy inline `onMouseOver`/`onMouseOut` translate logic from all the UI buttons across the Marketplace.
- **Added:** Created new universal CSS utility classes (`.btn-lift` and `.slide-right`) in `index.css` that handle all hover transforms AND physical click scaling logic natively.
- **Files/Lines Edited:**
  - `launcher/src/index.css`: Lines 105-120 (Added `.btn-lift:hover/active` and `.slide-right:hover/active`).
  - `launcher/src/components/Marketplace.tsx`: Lines 180-480 (Cleaned up inline styles, injected `className="btn-lift"` and `className="slide-right"` into Tabs, Dropdown items, Pagination, Checkboxes, and Action buttons).
- **Reason:** The user requested visual feedback *after* clicking a button (an active click scale state) to make the buttons physically sink inwards when pressed.

## [2026-07-02 01:25:00] - Iteration 19: Layout & Page Transitions
- **Added:** Added `@keyframes` in `index.css` for `.animate-slide-up` and `.animate-scale-in` to handle smooth page transition physics.
- **Modified:** Bound the `.animate-slide-up` animation class to the main Mod List container in `Marketplace.tsx`. Attached a React `key` bound to `offset`, `query`, and filter states. This forces React to trigger a beautiful slide-up and fade-in layout animation every time the user paginates, searches, or filters!
- **Modified:** Changed the Mod Details sub-view to use `.animate-scale-in` so it pops open smoothly when you click "View" on a Mod card.
- **Files/Lines Edited:**
  - `launcher/src/index.css`: Lines 255-275 (Added keyframes).
  - `launcher/src/components/Marketplace.tsx`: Lines 90-320 (Swapped `animate-fade` for scale-in/slide-up classes and added the React `key` trigger for the list container).
- **Reason:** The user wanted layout animations specifically when transitioning between pages (pagination) or switching between the mod list and the mod detail view.
