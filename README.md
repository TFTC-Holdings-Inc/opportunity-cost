# Opportunity Cost Browser Extension

<div align="center">
  <img src="web/public/images/logo/svg/black-transparent.svg" alt="Opportunity Cost Logo" width="256" />
  <h3>See the True Cost of Everything in Bitcoin</h3>
  <p>Convert online prices to Bitcoin as you browse</p>
</div>

## Overview

Opportunity Cost is a browser extension that instantly converts fiat currency prices (USD, EUR, GBP, etc.) to their Bitcoin or satoshi equivalent as you browse the web. It helps you think in terms of sound money principles by showing the Bitcoin value of everyday purchases.

## Features

- **Live Currency Conversion**: Automatically detects and converts prices on any webpage to Bitcoin or satoshis
- **Multiple Currency Support**: Works with USD, EUR, GBP, JPY, CNY, and more
- **Flexible Display Options**:
  - Dual-display mode: Shows both fiat and Bitcoin prices side-by-side
  - Bitcoin-only mode: Replaces fiat prices entirely with Bitcoin values
- **Denomination Choice**: View prices in satoshis or BTC based on your preference
- **Real-time Price Data**: Uses current Bitcoin market rates from reputable APIs
- **Privacy-First Design**: All processing happens locally - no browsing data is collected
- **Customizable Settings**: Tailor the extension to fit your browsing habits
- **Dark Mode Support**: Choose between light, dark, or system theme

## Screenshots

![Opportunity Cost in action](web/public/images/nike-btc-prices-new.png)
![Extension popup](web/public/images/zillow-btc-prices.png)

## Installation

### Chrome Web Store (Coming Soon)

1. Visit the [Chrome Web Store](https://chrome.google.com/webstore/category/extensions)
2. Search for "Opportunity Cost" or follow our direct link (coming soon)
3. Click "Add to Chrome"

### Firefox Add-ons (Coming Soon)

1. Visit [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/extensions/)
2. Search for "Opportunity Cost" or follow our direct link (coming soon)
3. Click "Add to Firefox"

### Manual Installation (Developer Mode)

#### Chrome

1. Download the latest release from our [website](https://www.opportunitycost.xyz/install)
2. Extract the ZIP file to a location on your computer
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" in the top-right corner
5. Click "Load unpacked" and select the extracted directory
6. The extension will be installed and ready to use

#### Firefox

1. Download the latest release from our [website](https://www.opportunitycost.xyz/install)
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on" and select any file in the extracted directory
4. The extension will be loaded for the current session

## Usage

After installation, the extension automatically works on all websites:

1. Browse to any website with prices (shopping sites, real estate, travel)
2. All supported currency prices will be converted to Bitcoin automatically
3. Click the extension icon for a built-in conversion calculator
4. Access settings by clicking the three dots in the popup or right-clicking the extension icon

### Options & Settings

- **Display Mode**: Choose between seeing both currencies or Bitcoin only
- **Denomination**: Toggle between satoshis and BTC
- **Currency**: Select your preferred base currency for conversions
- **Theme**: Light, dark, or system-based theme
- **Highlight**: Option to highlight Bitcoin values for better visibility

## How It Works

1. The extension fetches the current Bitcoin price from our API
2. It scans all text nodes in the DOM for currency patterns
3. When a price is found, it calculates the Bitcoin equivalent
4. A MutationObserver ensures dynamically loaded content is also converted
5. All conversions happen locally in your browser for maximum privacy

## Development

### Prerequisites

- Node.js 22.12 or newer
- npm 11.8

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/tftc/opportunity-cost.git
   cd opportunity-cost
   ```

2. Install the website and extension dependencies from their authoritative npm lockfiles:

   ```bash
   npm ci --prefix web
   npm ci --prefix extension/shared
   ```

3. Build the extension:

   ```bash
   npm run build --prefix extension/shared
   ```

4. Load the extension in developer mode:
   - Load the `extension/dist/build` directory

## About Opportunity Cost

Opportunity Cost is designed to help people understand the true value of their money in terms of Bitcoin. In an era of inflation and monetary uncertainty, Bitcoin provides a different perspective on value.

The project is powered by [Truth For The Commoner (TFTC)](https://tftc.io), a community dedicated to Bitcoin education and adoption.

## Privacy

Opportunity Cost respects your privacy:

- No browsing data is sent to our servers
- All price conversions happen locally in your browser
- We only fetch current Bitcoin prices from our API
- No personal information is collected or stored

View our [complete privacy policy](https://www.opportunitycost.xyz/privacy-policy).

## Contributing

We welcome contributions from the community! Please feel free to submit pull requests, report bugs, or suggest features.

## License

Opportunity Cost Browser Extension is licensed under the [MIT license](LICENSE).

## Links

- [Official Website](https://www.opportunitycost.xyz)
- [TFTC](https://tftc.io)
- [Bitcoin Brief Newsletter](https://tftc.io/bitcoin-brief)
- [Feedback](https://opportunitycost.userjot.com)
