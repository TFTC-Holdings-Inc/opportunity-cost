# Opportunity Cost Firefox Extension - Source Code

Complete source code for the Opportunity Cost Firefox extension. Shows Bitcoin equivalent (satoshis) of prices on web pages to help users understand the Bitcoin opportunity cost of purchases.

## System Requirements

### Required Software

- **Node.js**: Version 22.12.0 or higher
- **npm**: Version 11.8.0
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)

### Supported Browsers for Testing

- Firefox 109.0 or higher (for Manifest V2 support)

## Build Environment Setup

### 1. Verify Node.js Installation

```bash
node --version  # Should be 22.12.0 or higher
npm --version   # Should be 11.8.0
```

If Node.js is not installed, download it from [nodejs.org](https://nodejs.org/).

### 2. Navigate to Source Directory

```bash
cd firefox-extension-submission
```

### 3. Install Dependencies

```bash
npm ci
```

This installs all dependencies as specified in `package.json`.

## Build Instructions

### Build the Extension

```bash
npm run build:firefox
```

### Build Process

1. **TypeScript Compilation** - Compiles all TypeScript source files
2. **Main Extension Build** - Builds the popup UI and options page
3. **Content Script Build** - Builds the content script that runs on web pages
4. **Background Script Build** - Builds the background script

### Build Output

After successful compilation, the built extension will be located in:

```
dist/firefox/
├── manifest.json          # Firefox extension manifest
├── index.html             # Popup UI
├── options.html           # Options page
├── background.js          # Background script
├── content.js             # Content script
├── icons/                 # Extension icons
│   └── logo.png
└── assets/                # Compiled CSS and other assets
```

Build time: ~30-60 seconds

## Build Verification

### 1. Check Build Output

Verify that the `dist/firefox` directory contains all expected files:

```bash
ls -la dist/firefox/
```

Expected files:

- `manifest.json` (Firefox Manifest V2)
- `index.html` (Popup interface)
- `options.html` (Options page)
- `background.js` (Background script)
- `content.js` (Content script)
- `icons/logo.png` (Extension icon)
- `assets/` directory with CSS and other compiled assets

### 2. Verify Output

Expected total extension size: ~500KB

### 3. Test Extension

1. Open Firefox → `about:debugging` → "This Firefox"
2. Click "Load Temporary Add-on"
3. Select `dist/firefox/manifest.json`

## Build Scripts Explanation

### Available Scripts

- `npm run build:firefox` - Build the Firefox extension
- `npm run lint` - Run ESLint code quality checks

### Build Configuration Files

- **`vite.config.ts`**: Main Vite configuration for popup UI and options page
- **`vite.content.config.ts`**: Specialized configuration for content script
- **`vite.background.config.ts`**: Specialized configuration for background script
- **`tsconfig.json`**: Root TypeScript configuration
- **`tsconfig.app.json`**: Application-specific TypeScript settings
- **`tsconfig.node.json`**: Node.js specific TypeScript settings

## Source Code Structure

```
firefox-extension-submission/
├── src/                           # Source code directory
│   ├── components/                # React UI components
│   │   ├── index-page.tsx        # Main popup interface
│   │   ├── options-page.tsx      # Extension options page
│   │   └── ui/                   # Reusable UI components
│   ├── lib/                      # Core functionality
│   │   ├── background.ts         # Background script logic
│   │   ├── content.ts            # Content script logic
│   │   ├── storage.ts            # Data storage utilities
│   │   ├── constants.ts          # Application constants
│   │   └── utils.ts              # Utility functions
│   ├── assets/                   # Static assets
│   ├── index.tsx                 # Popup entry point
│   ├── options.tsx               # Options page entry point
│   ├── index.css                 # Main stylesheet
│   └── vite-env.d.ts            # Vite type definitions
├── public/                       # Public assets
│   └── icons/                    # Extension icons
├── manifest.json                 # Firefox extension manifest
├── package.json                  # Dependencies and build scripts
├── package-lock.json             # Exact dependency versions
└── [configuration files]         # TypeScript, Vite, ESLint configs
```

## Dependencies

### Runtime Dependencies

- **React 19.2.8**: UI framework
- **TypeScript 5.9.3**: Type safety
- **Tailwind CSS 4.3.3**: Styling framework
- **webextension-polyfill 0.12.0**: Cross-browser API compatibility
- **Various UI libraries**: Radix UI components for accessible interface

### Build Dependencies

- **Vite 8.2.1**: Build tool and development server
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting

All dependencies are locked to specific versions in `package-lock.json` to ensure reproducible builds.

## Troubleshooting

### Common Build Issues

1. **Node.js Version Too Old**

   ```
   Error: Unsupported engine
   ```

   **Solution**: Upgrade to Node.js 22.12.0 or higher

2. **Missing Dependencies**

   ```
   Error: Cannot resolve module
   ```

   **Solution**: Run `npm ci` to install all dependencies

3. **TypeScript Compilation Errors**

   ```
   Error: Type checking failed
   ```

   **Solution**: Check TypeScript files for syntax errors

### Clean Build

If experiencing build issues, try a clean build:

```bash
trash node_modules dist
npm ci
npm run build:firefox
```

## Privacy

- No data collection or tracking
- Only requests public Bitcoin price APIs
- Local storage only

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Source Code

All original source files included:

- TypeScript/React components (unminified)
- Complete build configuration
- Exact dependency specifications

## Extension Details

- **Name**: Opportunity Cost
- **Version**: 0.0.3
- **Manifest**: V2 (Firefox compatible)
- **License**: MIT
