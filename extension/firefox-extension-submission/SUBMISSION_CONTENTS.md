# Firefox Extension Source Code Submission - Package Contents

This document provides a complete inventory of all files included in this source code submission for the Opportunity Cost Firefox extension.

## Total Package Size

- **Clean source code**: approximately 4.8MB (excluding node_modules and build artifacts)
- **With dependencies installed**: ~65MB
- **Built extension size**: ~500KB

## Directory Structure

### Root Configuration Files

- `package.json` - Dependencies and build scripts
- `package-lock.json` - Exact dependency versions for reproducible builds
- `manifest.json` - Firefox extension manifest (Manifest V2)
- `tsconfig.json` - Root TypeScript configuration
- `tsconfig.app.json` - Application TypeScript configuration
- `tsconfig.node.json` - Node.js TypeScript configuration
- `vite.config.ts` - Main Vite build configuration
- `vite.content.config.ts` - Content script build configuration
- `vite.background.config.ts` - Background script build configuration
- `eslint.config.js` - ESLint code quality configuration
- `.prettierrc` - Prettier code formatting configuration
- `components.json` - shadcn/ui component configuration
- `README.md` - Comprehensive build instructions
- `LICENSE` - MIT License
- `index.html` - Popup interface template
- `options.html` - Options page template

### Source Code (`src/`)

**Core Application Logic:**

- `index.tsx` - Popup interface entry point
- `options.tsx` - Options page entry point
- `index.css` - Main stylesheet with Tailwind CSS
- `vite-env.d.ts` - Vite type definitions

**Background & Content Scripts (`src/lib/`):**

- `background.ts` - Extension background script (price fetching, storage)
- `content.ts` - Content script (price detection and replacement)
- `storage.ts` - IndexedDB storage utilities
- `constants.ts` - Application constants
- `utils.ts` - Utility functions

**React Components (`src/components/`):**

- `index-page.tsx` - Main popup interface component
- `options-page.tsx` - Extension options interface component
- `saylor-mode-overlay.tsx` - Saylor Mode overlay component

**UI Components (`src/components/ui/`):**

- `button.tsx` - Reusable button component
- `command.tsx` - Command palette component
- `dialog.tsx` - Dialog component
- `dropdown-menu.tsx` - Dropdown menu component
- `popover.tsx` - Popover component
- `switch.tsx` - Toggle switch component
- `tooltip.tsx` - Tooltip component

**Assets (`src/assets/`):**

- `logo.svg` - Extension logo in SVG format

### Public Assets (`public/`)

- `saylor.jpg` - Saylor Mode overlay image

**Extension Icons (`public/icons/`):**

- `logo.png` - Main extension icon (41KB)
- `logo.svg` - Vector version of logo (1KB)
- `old/` - Legacy icon versions for reference

## File Types Included

### Source Code Files (Unminified)

- **TypeScript**: `.ts`, `.tsx` files containing all application logic
- **React**: `.tsx` files for UI components
- **CSS**: `.css` files with original styling
- **HTML**: `.html` template files
- **SVG**: Vector graphics in source format

### Configuration Files

- **Build Configuration**: Vite, TypeScript, ESLint configs
- **Package Management**: package.json with exact dependencies
- **Extension Manifest**: Firefox-specific manifest.json

### Static Assets

- **Icons**: PNG and SVG format icons
- **License**: MIT license file

## Compliance Verification

✅ **All source files included** - No transpiled or minified code
✅ **Complete build configuration** - All necessary build tools and configs
✅ **Exact dependencies** - package-lock.json ensures reproducible builds
✅ **Clear instructions** - Comprehensive README with step-by-step build guide
✅ **Size requirements met** - Under 200MB limit (4.8MB clean)
✅ **Browser compatibility** - Firefox Manifest V2 format
✅ **Reviewable source** - Application and build logic are provided as readable source; image assets are included

## Build Verification

The extension can be built with these commands:

```bash
npm ci                # Install exact dependencies from package-lock.json
npm run build:firefox # Build Firefox extension
```

Output location: `dist/firefox/`

## Review Notes

- **Zero external dependencies at runtime** - Extension is self-contained
- **No data collection** - Extension only makes requests to public Bitcoin price APIs
- **Open source** - All code is readable and included in this submission
- **Deterministic builds** - Same source always produces identical extension
- **Modern toolchain** - Uses TypeScript, React, and Vite for maintainable code

---

**This package contains everything needed to build and verify the Opportunity Cost Firefox extension from source code.**
