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

## [2026-07-02 23:36:00] - Iteration 20: Quick Library Home View
- **Added:** Replaced the "Discover Themes & Modpacks" section on the Home page with a new "Quick Library" mimicking the provided screenshot.
- **Added:** Implemented a new top bar for the Quick Library containing a Modpacks dropdown, a Search bar, a Popular sorter, and a "+ New Profile" button.
- **Added:** Interactive Profile Selection where clicking a profile card applies a glowing green active border and updates the text underneath the main "LAUNCH GAME" button.
- **Files/Lines Edited:**
  - `launcher/src/components/Home.tsx`: Lines 1-86 (Updated state to manage `activeProfile`, replaced the grid section, and bound micro-animations).
- **Reason:** The user requested to replace the Discover section with a local modpack/profile library matching a provided mockup, continuing the implementation of the heavy glassmorphic aesthetic.

## [2026-07-02 23:42:00] - Iteration 21: Bugfix - Window Resizing Squish
- **Modified:** Added hard minimum dimensions to the root application wrapper to prevent Flexbox elements from overlapping and squishing when the viewport is resized.
- **Files/Lines Edited:**
  - `launcher/src/App.tsx`: Lines 38-39 (Added `minWidth: '1100px', minHeight: '650px', overflow: 'hidden'` to the main outer `<div>`).
- **Reason:** The user reported that when shrinking the window to its minimum size, the sidebars were crushing the center UI elements. This change forces the browser to respect desktop application minimum bounds.

## [2026-07-02 23:46:00] - Iteration 22: Bugfix - Bulletproof Flexbox Squishing
- **Modified:** Changed root `overflow` to `auto` to gracefully handle user resizing, and injected explicit `minWidth: 500px` onto the inner flexible content columns.
- **Files/Lines Edited:**
  - `launcher/src/App.tsx`: Line 39 (Changed `overflow: hidden` to `overflow: auto`).
  - `launcher/src/components/Marketplace.tsx`: Line 220 (Added `minWidth: '500px'` to the main mod list flex container).
  - `launcher/src/components/Library.tsx`: Line 23 (Added `minWidth: '500px'` to the grid flex container).
- **Reason:** The initial `minWidth` fix on the root App container didn't prevent inner flex-children from squishing if the browser window itself was forcibly shrunk by the user. Adding explicit minimum dimensions to the inner columns guarantees they will never compress below their readable state.

## [2026-07-02 23:51:00] - Iteration 23: Bugfix - Final Layout Wrapping
- **Modified:** Added `flexShrink: 0` to the right sidebar, bumped `minWidth` on the main wrapper, and added `flexWrap: 'wrap'` to the top action bars.
- **Files/Lines Edited:**
  - `launcher/src/components/RightSidebar.tsx`: Line 17 (Added `flexShrink: 0`).
  - `launcher/src/App.tsx`: Line 66 (Added `minWidth: '700px'` to the `<main>` tag).
  - `launcher/src/components/Marketplace.tsx`: Line 236 (Added `flexWrap: 'wrap'` to the pagination bar).
  - `launcher/src/components/Library.tsx`: Line 26 (Added `flexWrap: 'wrap'` to the action bar).
- **Reason:** The previous fix prevented the center columns from shrinking, but the outer flex containers were still overlapping elements (like the pagination buttons and search bar) when space ran out. This forces the sidebars to remain static and the inner rows to wrap gracefully onto new lines.
## [2026-07-02 23:54:00] - Iteration 24: Minimum Bounds Adjustment
- **Modified:** Increased the global absolute minimum window size.
- **Files/Lines Edited:**
  - `launcher/src/App.tsx`: Line 39 (Changed `minWidth` to `1360px` and `minHeight` to `720px`).
  - `launcher/electron/main.cjs`: Lines 8-11 (Updated Electron `BrowserWindow` OS-level `minWidth` and `width` to `1360`).
- **Reason:** While the React container was set to 1360x720, the physical OS window was still allowing the user to shrink it to 1200x720. Locking the physical OS window ensures the layout cannot be dragged past the 1360px threshold, eliminating any scrollbars or squishing.

## [2026-07-02 23:58:00] - Iteration 25: Official Custom Client Logo
- **Modified:** Replaced the generic SVG placeholder logo in the Sidebar with the official Custom Client 'C' logo, and wired it into the Windows Taskbar.
- **Files/Lines Edited:**
  - `launcher/src/components/Sidebar.tsx`: Lines 25-27 (Swapped the inline `<svg>` for an `<img src="/logo.png" />`).
  - `launcher/electron/main.cjs`: Line 12 (Injected `icon: path.join(__dirname, '../public/logo.png')` into the `BrowserWindow` config).
- **Reason:** The user provided the official brand logo and requested it replace the placeholder graphic in both the internal UI and the external OS taskbar.

## [2026-07-03 00:06:00] - Iteration 26: Unified Purple Button Theme & Animations
- **Modified:** Changed the global primary accent color from green to purple, applied the premium "Launch" button styling and hover sweep animations to all `.btn-primary` elements, and removed conflicting inline blue/green colors.
- **Files/Lines Edited:**
  - `launcher/src/index.css`: Lines 28-29 (Updated global variables to purple), Lines 94-118 (Updated `.btn-primary` to match `.btn-launch` animations).
  - `launcher/src/components/Library.tsx`: Line 37 (Removed inline blue background).
  - `launcher/src/components/Home.tsx`: Line 83 (Removed inline blue background on the Home screen's New Profile button), Line 103 (Changed active profile glow from green to purple).
  - `launcher/src/components/Marketplace.tsx`: Lines 126, 370 (Changed green box-shadows and icon colors to purple).
- **Reason:** The user noted that the massive purple Launch Game button and the smaller blue/green action buttons clashed stylistically. This unifies the entire UI to use the exact same metallic purple gradient and micro-animations for every primary action button across the application.

## [2026-07-03 00:11:00] - Iteration 27: Modrinth API Facet Fix
- **Modified:** Changed the Modrinth API query builder so it no longer forces the `categories:fabric` facet when searching for Resource Packs or Shaders.
- **Files/Lines Edited:**
  - `launcher/src/components/Marketplace.tsx`: Lines 42-46 (Made the `fabric` facet conditional based on `projectType`).
- **Reason:** Resource Packs and Shaders on Modrinth are typically engine-agnostic or depend on mods like Iris/Optifine, rather than being tagged specifically with the "fabric" loader category. Forcing that tag resulted in the API returning less than 15 results globally. Removing the restriction for those tabs restores the full database.

## [2026-07-03 00:14:00] - Iteration 28: Official Hero Banner Integration
- **Added:** Copied the user's `bg.png` banner image into the launcher's `public` directory.
- **Modified:** Replaced the generic "WIP - Hero Banner" SVG placeholder with the official `bg.png` image on the Home screen.
- **Modified:** Upgraded the hero banner's solid dark overlay to a premium radial gradient. This naturally vignettes the edges of the image while spotlighting the center "LAUNCH GAME" button.
- **Files/Lines Edited:**
  - `launcher/src/components/Home.tsx`: Lines 15-17 (Removed the SVG variable), Lines 37-51 (Linked `/bg.png`, added `background-size: cover`, and added a radial gradient overlay).
- **Reason:** The user provided their official banner artwork. Implementing `backgroundSize: 'cover'` ensures the image dynamically scales and crops beautifully regardless of window proportions, while the radial gradient ensures the purple launch button remains perfectly readable against any background artwork.

## [2026-07-03 00:21:00] - Iteration 29: Premium Sidebar Icons & State Toggles
- **Modified:** Changed the Home icon from a generic house to a `Gamepad2` controller icon to match gaming launcher conventions.
- **Modified:** Removed the purple accent color from active sidebar tabs and the active indicator strip, reverting them to clean white.
- **Added:** Implemented dynamic SVG fill properties. Icons are now hollow/outlined when inactive, and transition to solid filled shapes when active.
- **Files/Lines Edited:**
  - `launcher/src/components/Sidebar.tsx`: Line 1 (Imported `Gamepad2`), Lines 33-60 (Changed active color to `white` and added `fill={activeTab === item.id ? "currentColor" : "none"}`), Lines 72-88 (Applied the same white color logic and fill logic to the bottom settings tab).
- **Reason:** The user requested "good icons" similar to their examples, preferring clean white indicators over purple to prevent the sidebar from looking overly saturated. Adding a solid fill state when active perfectly matches the aesthetic seen in premium apps like Discord and Steam.

## [2026-07-03 00:26:00] - Iteration 30: Modrinth Infinite Scroll & Skeletons
- **Removed:** Deleted the manual "Prev / Next" pagination buttons from the Marketplace.
- **Added:** Implemented an `onScroll` event listener on the main mod list container to detect when the user hits the bottom and automatically fetch the next page of results.
- **Modified:** Changed the Modrinth `fetchMods` logic to append new results to the array on infinite scroll, rather than replacing the array completely.
- **Added:** Built custom animated skeleton loaders that mimic the layout of a mod card, displaying during both initial load and bottom-scroll load. Added a custom `.skeleton` CSS pulse animation to match.
- **Files/Lines Edited:**
  - `launcher/src/index.css`: Lines 298-305 (Added `@keyframes skeleton-pulse` and `.skeleton`).
  - `launcher/src/components/Marketplace.tsx`: (Complete refactor of `fetchMods`, added `loadingMore` state, added `renderSkeletons`, bound `onScroll` to the main container, and wiped `mods` array on new search queries).
- **Reason:** Infinite scroll provides a much smoother, modern browsing experience than manual pagination. The skeleton loaders provide immediate feedback that more content is arriving, exactly matching the user's provided mockup.

## [2026-07-03 00:28:00] - Iteration 31: Native Local Screenshot Fetching
- **Modified:** Disabled `webSecurity` in Electron's `main.cjs` to allow the React frontend to securely fetch local `file://` resources from the user's hard drive without triggering browser security blocks.
- **Added:** Replaced the mock placeholder array in `Screenshots.tsx` with a `useEffect` that utilizes Node.js `fs` and `path` to directly read the `%appdata%/.minecraft/screenshots` directory.
- **Added:** Implemented sorting by newest-first using file `mtimeMs`, automatic file size conversion to MB, and exact filename extraction.
- **Added:** Wired up the `Folder` button to use Electron's `shell.openPath` to instantly open the user's screenshots directory in Windows Explorer.
- **Files/Lines Edited:**
  - `launcher/electron/main.cjs`: Line 17 (Added `webSecurity: false`).
  - `launcher/src/components/Screenshots.tsx`: Lines 1-115 (Replaced dummy array with `fs.readdirSync` logic, added `file://` URL construction, and added `handleOpenFolder` logic).
- **Reason:** The user requested the screenshots gallery stop using placeholders and start showing actual game screenshots from their local `.minecraft` folder. Bypassing standard browser restrictions via Electron's Node integration enables deep file system access for a native desktop experience.

## [2026-07-03 00:33:00] - Iteration 32: Interactive Screenshot Controls
- **Added:** Bound Electron's native `shell.openPath` to the main image overlay. Clicking anywhere on the screenshot now instantly opens it in the default Windows image viewer.
- **Added:** Built a `handleShare` function that uses Electron's native `clipboard` module. Clicking the share button reads the local file into a `nativeImage` buffer and copies it directly to the system clipboard for immediate pasting into Discord/social media.
- **Added:** Implemented a temporary "Copied to clipboard!" UI badge that pulses on the screen for 2.5 seconds when the share button is clicked.
- **Added:** Built a `handleDelete` function that utilizes Node's `fs.unlinkSync` to permanently delete the screenshot file from the hard drive (with a browser confirmation prompt), then instantly updates the React state to remove the card from the UI.
- **Added:** Added standard HTML5 HTMLAnchorElement click logic to trigger a browser-level "Save As" / download prompt for the Download button.
- **Files/Lines Edited:**
  - `launcher/src/components/Screenshots.tsx`: Lines 78-125 (Added handler functions), Lines 130-155 (Wired up `onClick` and `e.stopPropagation()` logic on the buttons and overlay, added `copiedId` UI).
- **Reason:** Converting the screenshot gallery from a static list into a fully interactive file manager. The user explicitly requested clipboard sharing and native image viewing. Utilizing Electron's clipboard and shell modules provides a seamless native desktop experience.

## [2026-07-03 00:36:00] - Iteration 33: Dynamic Avatar Fetching
- **Added:** Built and exported a `getPlayerAvatar` helper function that dynamically fetches 3D rendered Minecraft heads.
- **Modified:** Replaced the broken Crafatar UUID links in the Social Hub friends list with the new username-based fetcher function.
- **Files/Lines Edited:**
  - `launcher/src/components/RightSidebar.tsx`: Lines 4-7 (Defined and exported `getPlayerAvatar`), Lines 11-12 (Applied the function to the `friends` array).
- **Reason:** Crafatar APIs usually require a UUID lookup first, causing broken image links if provided raw usernames. The new helper function uses `mc-heads.net`, which accepts usernames directly. It is exported so it can be reused later when the full Social Hub is built.

## [2026-07-03 00:37:00] - Iteration 34: Social Hub Friends List Refine
- **Added:** Added a "+ Add" button next to the Online section header using the `UserPlus` icon for quick friend requests.
- **Modified:** Split the single friends array map into two distinct sections: "Online" and "Offline", dynamically counting the array length for the headers (e.g., "Online (1)").
- **Added:** Applied a distinct visual style to offline friends. Their cards are slightly faded (opacity: 0.6) and their avatars receive a CSS `grayscale(100%) brightness(70%)` filter to immediately distinguish them from active players.
- **Files/Lines Edited:**
  - `launcher/src/components/RightSidebar.tsx`: Lines 153-200 (Replaced the single `.map` loop with separated Online/Offline filtered loops and added the Add button).
- **Reason:** To match standard gaming client UX (like Discord or Steam) where online and offline friends are distinctly separated and visually differentiated.
