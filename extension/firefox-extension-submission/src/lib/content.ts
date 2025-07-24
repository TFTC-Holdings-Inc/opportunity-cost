/**
 * Opportunity Cost Extension Content Script
 *
 * Scans the DOM for fiat currency prices and converts them to their Bitcoin (satoshi) equivalent.
 * Integrates with the background script for real-time price data and user preferences.
 * Handles dynamic content and tracks conversion statistics for analytics.
 */

import browser from "webextension-polyfill";
import type { UserPreferences } from "./storage";

async function main() {
  try {
    // --- Constants ---
    const SATS_IN_BTC = 100_000_000;

    // User preferences, loaded from extension storage or defaults
    let userPreferences: UserPreferences = {
      id: "user-preferences",
      defaultCurrency: undefined, // Will be set after fetching from background
      displayMode: "dual-display",
      denomination: "dynamic",
      highlightBitcoinValue: false,
      disabledSites: [],
    };

    // List of supported currencies, loaded from background script
    let supportedCurrencies: Array<{ value: string; symbol: string }> = [];

    // Array of all supported currency symbols
    let currencySymbols: string[] = [];

    // Regex for matching any supported currency symbol in text
    let currencyRegex: RegExp = new RegExp("");

    if (document.contentType !== "text/html") {
      console.log("Opportunity Cost: Skipping non-HTML document:", document.contentType);
      return;
    }

    // Listen for updates to user preferences from the background script
    browser.runtime.onMessage.addListener(async (message) => {
      if (message?.action === "preferencesUpdated") {
        const relevantOldPrefs = {
          displayMode: userPreferences.displayMode,
          denomination: userPreferences.denomination,
          highlightBitcoinValue: userPreferences.highlightBitcoinValue,
          disabledSites: userPreferences.disabledSites,
          defaultCurrency: userPreferences.defaultCurrency,
        };

        await getUserPreferences(); // This updates the userPreferences variable

        const relevantNewPrefs = {
          displayMode: userPreferences.displayMode,
          denomination: userPreferences.denomination,
          highlightBitcoinValue: userPreferences.highlightBitcoinValue,
          disabledSites: userPreferences.disabledSites,
          defaultCurrency: userPreferences.defaultCurrency,
        };

        if (JSON.stringify(relevantOldPrefs) !== JSON.stringify(relevantNewPrefs)) {
          console.log("Relevant preferences changed. Reloading page.");
          window.location.reload();
        } else {
          console.log("No relevant preferences changed. Page will not be reloaded.");
        }
      }
    });

    function normalizeLocaleNumber(raw: string): string {
      // Clean the raw string by removing currency symbols and trimming whitespace.
      const v = raw
        .replace(/\bEUR\b/gi, "")
        .replace(/€/g, "")
        .trim();

      const hasPeriod = v.includes(".");
      const hasComma = v.includes(",");

      // If no separators are present, no action is needed.
      if (!hasPeriod && !hasComma) {
        return v;
      }

      // Case 1: Both period and comma are present.
      if (hasPeriod && hasComma) {
        const lastPeriodIndex = v.lastIndexOf(".");
        const lastCommaIndex = v.lastIndexOf(",");

        // If comma comes last, it's a European-style decimal (e.g., "1.234,56").
        if (lastCommaIndex > lastPeriodIndex) {
          return v.replace(/\./g, "").replace(",", "."); // -> "1234.56"
        } else {
          // If period comes last, it's a US-style decimal (e.g., "1,234.56").
          return v.replace(/,/g, ""); // -> "1234.56"
        }
      }

      // Case 2: Only periods are present (e.g., "1.425.000" or "1.425").
      if (hasPeriod && !hasComma) {
        const parts = v.split(".");
        // If there are multiple periods, they must be thousands separators.
        if (parts.length > 2) {
          return v.replace(/\./g, ""); // -> "1425000"
        }
        // If one period is used and the part after it has 3 digits, assume it's a thousands separator.
        if (parts.length === 2 && parts[1].length === 3) {
          return v.replace(/\./g, ""); // -> "1425"
        }
        // Otherwise, assume the single period is a decimal separator (e.g., "123.45").
        return v;
      }

      // Case 3: Only commas are present (e.g., "1,234" or "1,23").
      if (hasComma && !hasPeriod) {
        const parts = v.split(",");
        // If the part after the last comma is not 3 digits, assume it's a decimal (e.g., "99,9").
        if (parts[parts.length - 1].length !== 3) {
          return v.replace(/,/g, "."); // -> "99.9"
        }
        // Otherwise, they are thousands separators.
        return v.replace(/,/g, ""); // -> "1234"
      }

      // Fallback for any unhandled case.
      return v;
    }

    /**
     * Converts a currency string (with optional multipliers) to a numeric value.
     * Supports formats like "$1,000.00", "$3.92K", "$1.12M", "$2 trillion", etc.
     */
    function convertCurrencyValue(str: string, currencySymbol?: string, currencyCode?: string): number {
      const multipliers: Record<string, number> = {
        k: 1e3,
        thousand: 1e3,
        m: 1e6,
        million: 1e6,
        b: 1e9,
        bn: 1e9,
        billion: 1e9,
        t: 1e12,
        trillion: 1e12,
        q: 1e15,
        quadrillion: 1e15,
      };
      const cleaned = normalizeLocaleNumber(
        str
          .replace(currencySymbol ? new RegExp(escapeRegex(currencySymbol), "g") : currencyRegex, "")
          .replace(new RegExp(`\\b${currencyCode}\\b`, "gi"), ""),
      );
      const match = cleaned.match(/^([\d.]+)\s*(k|m|b|bn|t|q|thousand|million|billion|trillion|quadrillion)?$/i);
      if (!match) return NaN;
      const [, numStr, rawSuffix] = match;
      const suffix = (rawSuffix ?? "").toLowerCase();
      const multiplier = multipliers[suffix] ?? 1;
      return parseFloat(numStr) * multiplier;
    }

    // Formats a number for display, with a maximum number of decimals
    const fmt = (num: number, maxDecimals: number) =>
      num.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: maxDecimals,
      });

    // Helper to abbreviate large satoshi values (e.g., 100000 -> 100k, 1000000 -> 1M)
    // const abbreviateSats = (sats: number): string => {
    //   const thresholds: [number, string][] = [
    //     [1e15, "Q"],
    //     [1e12, "T"],
    //     [1e9, "B"],
    //     [1e6, "M"],
    //     [1e3, "k"],
    //   ];
    //   for (const [value, suffix] of thresholds) {
    //     if (sats >= value) {
    //       const shortened = sats / value;
    //       // Use fewer decimals for larger numbers
    //       const decimals = shortened >= 100 ? 0 : shortened >= 10 ? 1 : 2;
    //       const formatted = shortened.toLocaleString(undefined, {
    //         minimumFractionDigits: 0,
    //         maximumFractionDigits: decimals,
    //       });
    //       return `${formatted}${suffix}`;
    //     }
    //   }
    //   return sats.toLocaleString();
    // };

    // Formats a bitcoin value (in satoshis) according to user denomination preference
    const formatBitcoinValue = (satoshis: number): string => {
      const btc = satoshis / SATS_IN_BTC;
      if (btc >= 100) return `${fmt(btc, 0)} BTC`;
      if (userPreferences.denomination === "dynamic") {
        return btc < 0.01 ? `${fmt(satoshis, 0)} sats` : `${fmt(btc, 2)} BTC`;
      }
      if (userPreferences.denomination === "btc") {
        if (btc >= 1) return `${fmt(btc, 2)} BTC`;
        if (btc >= 0.01) return `${fmt(btc, 4)} BTC`;
        if (btc >= 0.0001) return `${fmt(btc, 5)} BTC`;
        if (btc >= 0.000001) return `${fmt(btc, 6)} BTC`;
        return `${btc.toLocaleString(undefined, {
          minimumFractionDigits: 8,
          maximumFractionDigits: 8,
        })} BTC`;
      }
      return `${fmt(satoshis, 0)} sats`;
    };

    // Fetches the latest Bitcoin prices for all supported currencies from the background script
    async function getBitcoinPrices(): Promise<Record<string, number>> {
      const response = await browser.runtime.sendMessage({ action: "getBitcoinPrices" });
      if (response?.error) {
        console.error("Error getting Bitcoin prices:", response.error);
        throw new Error(response.error);
      }
      return response?.prices || {};
    }

    // Fetches the list of supported currencies from the background script
    async function getSupportedCurrencies(): Promise<Array<{ value: string; symbol: string }>> {
      const response = await browser.runtime.sendMessage({ action: "getSupportedCurrencies" });
      if (response?.error) {
        console.error("Error getting supported currencies:", response.error);
        throw new Error(response.error);
      }
      return response?.supportedCurrencies || [];
    }

    // Loads user preferences from the background script, falling back to defaults if unavailable
    async function getUserPreferences(): Promise<UserPreferences> {
      try {
        const response = await browser.runtime.sendMessage({ action: "getPreferences" });
        if (response?.error) {
          console.error("Error getting preferences:", response.error);
        } else if (response?.preferences) {
          userPreferences = response.preferences;
          console.log("User preferences loaded:", userPreferences);
        } else {
          console.warn("No preferences received from background, using defaults");
        }
      } catch (error) {
        console.error("Exception in getUserPreferences:", error);
      }
      return userPreferences;
    }

    // Loads all required data (preferences, currencies, prices) before processing the page
    async function initializeData(): Promise<{
      preferences: UserPreferences;
      currencies: Array<{ value: string; symbol: string }>;
      prices: Record<string, number>;
    }> {
      try {
        const preferences = await getUserPreferences();
        const currencies = await getSupportedCurrencies();
        const prices = await getBitcoinPrices();
        return { preferences, currencies, prices };
      } catch (error) {
        console.error("Error initializing data:", error);
        return {
          preferences: userPreferences,
          currencies: [],
          prices: {},
        };
      }
    }

    // --- Begin main script logic after data is loaded ---
    const { preferences, currencies, prices: btcPrices } = await initializeData();
    userPreferences = preferences;

    if (userPreferences.disabledSites?.includes(window.location.hostname)) {
      console.log(`Opportunity Cost: Extension is disabled for ${window.location.hostname}`);
      return;
    }

    supportedCurrencies = currencies;

    function escapeRegex(s: string): string {
      return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    }

    currencySymbols = supportedCurrencies.map((c) => c.symbol);
    currencyRegex = new RegExp(`[${currencySymbols.map((s) => `\\${s}`).join("")}]`, "g");

    if (!btcPrices || Object.keys(btcPrices).length === 0 || !supportedCurrencies || supportedCurrencies.length === 0) {
      console.warn("Opportunity Cost: Failed to get BTC prices or supported currencies. Prices will not be converted.");
      return;
    }

    // Recursively walks the DOM, processing text nodes for fiat price conversion
    const walkDOM = (node: Node): void => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const tagName = element.tagName.toLowerCase();
        if (
          [
            "script",
            "style",
            "noscript",
            "iframe",
            "svg",
            "canvas",
            "video",
            "audio",
            "picture",
            "code",
            "pre",
            "math",
            "input",
            "textarea",
          ].includes(tagName)
        ) {
          return;
        }
        if (element.isContentEditable) {
          return;
        }
      }
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.parentElement && node.parentElement.closest("[contenteditable=true], [contenteditable='']")) {
          return;
        }
        replacePrice(node as Text);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (let i = 0; i < node.childNodes.length; i++) {
          walkDOM(node.childNodes[i]);
        }
      }
    };

    // Applies highlight styles to bitcoin value labels if enabled in preferences
    function applyBitcoinLabelStyles(label: HTMLElement) {
      if (userPreferences.highlightBitcoinValue) {
        label.style.backgroundColor = "rgba(240, 138, 93, 0.2)";
        label.style.padding = "0 4px";
        label.style.borderRadius = "4px";
      }
    }

    // Replaces fiat prices in text nodes with their bitcoin equivalent, for the default currency only
    const replacePrice = (textNode: Text): void => {
      const content = textNode.textContent || "";
      const parent = textNode.parentNode;
      if (!(parent instanceof HTMLElement)) return;
      if (parent.dataset.ocProcessed === "true") return;
      const defaultCurrency = userPreferences.defaultCurrency;
      const currency = supportedCurrencies.find((c) => c.value === defaultCurrency);
      if (!currency || !currency.symbol) return;
      const currencySymbol = currency.symbol;
      const iso = currency.value.toUpperCase();
      const sym = escapeRegex(currencySymbol);
      const magnitude = "(?:thousand|million|billion|trillion|quadrillion|k|m|b|t|q|bn|mn|tn)";
      const number = "\\d[\\d.,]*";
      const regex = new RegExp(
        `(?:${sym}\\s?${number}(?:\\s*${magnitude})?|${number}(?:\\s*${magnitude})?\\s?(?:${sym}|${iso}))\\b`,
        "gi",
      );
      regex.lastIndex = 0;
      let match;
      let lastIndex = 0;
      let modified = false;
      const frag = document.createDocumentFragment();

      while ((match = regex.exec(content)) !== null) {
        const matchStart = match.index;
        if (matchStart > lastIndex) {
          frag.appendChild(document.createTextNode(content.slice(lastIndex, matchStart)));
        }

        const fullMatch = match[0];
        const trailingWS = fullMatch.match(/\s+$/)?.[0] ?? "";
        const fiatText = trailingWS ? fullMatch.slice(0, -trailingWS.length) : fullMatch;
        const fiatValue = convertCurrencyValue(fullMatch, currencySymbol, currency.value);
        if (isNaN(fiatValue)) {
          frag.appendChild(document.createTextNode(fullMatch));
          lastIndex = regex.lastIndex;
          continue;
        }
        const btcPrice = btcPrices[currency.value];
        if (!btcPrice) {
          frag.appendChild(document.createTextNode(fullMatch));
          lastIndex = regex.lastIndex;
          continue;
        }

        const satsValue = Math.round((fiatValue / btcPrice) * SATS_IN_BTC);
        const bitcoinValueSpan = document.createElement("span");
        bitcoinValueSpan.className = "oc-btc-price";
        bitcoinValueSpan.textContent = formatBitcoinValue(satsValue);
        applyBitcoinLabelStyles(bitcoinValueSpan);

        if (userPreferences.displayMode === "bitcoin-only") {
          frag.appendChild(bitcoinValueSpan);
        } else {
          frag.appendChild(document.createTextNode(fiatText));
          frag.appendChild(document.createTextNode(" | "));
          frag.appendChild(bitcoinValueSpan);
        }
        if (trailingWS) {
          frag.appendChild(document.createTextNode(trailingWS));
        }

        lastIndex = regex.lastIndex;
        modified = true;
      }

      if (lastIndex < content.length) {
        frag.appendChild(document.createTextNode(content.slice(lastIndex)));
      }

      if (modified) {
        parent.replaceChild(frag, textNode);
        parent.dataset.ocProcessed = "true";
      }
    };

    /**
     * Processes Amazon price elements, appending bitcoin values next to fiat prices.
     * Handles both dual-display and bitcoin-only display modes.
     */
    function processAmazonPrices() {
      document.querySelectorAll<HTMLSpanElement>('.a-price span[aria-hidden="true"]').forEach((vis) => {
        if (!vis || !vis.textContent || vis.children.length === 0) return;
        if (vis.querySelector(".oc-btc-price")) return;
        const parent = vis.closest(".a-price");
        if (!parent) return;
        const currency = supportedCurrencies.find((c) => c.value === userPreferences.defaultCurrency);
        if (!currency) return;
        if (!vis.textContent!.includes(currency.symbol)) return;
        const btcPrice = btcPrices[currency.value];
        if (!btcPrice) return;
        const fiatValue = convertCurrencyValue(vis.textContent, currency.symbol, currency.value);
        const sats = Math.round((fiatValue / btcPrice) * SATS_IN_BTC);
        const btcDisplay = formatBitcoinValue(sats);
        const displayMode = userPreferences.displayMode;
        const formatted = displayMode === "dual-display" ? ` | ${btcDisplay}` : btcDisplay;
        const screenReaderSpan = vis.querySelector(".a-offscreen");
        if (screenReaderSpan) {
          screenReaderSpan.textContent += formatted;
        }
        const label = document.createElement("span");
        label.className = "oc-btc-price";
        if (userPreferences.displayMode === "dual-display") {
          const parts = formatted.split("|");
          if (parts.length > 1) {
            label.textContent = parts[0] + "| ";
            const btcValueSpan = document.createElement("span");
            btcValueSpan.textContent = parts[1].trim();
            applyBitcoinLabelStyles(btcValueSpan);
            label.appendChild(btcValueSpan);
          } else {
            label.textContent = formatted;
          }
        } else {
          label.textContent = formatted;
          applyBitcoinLabelStyles(label);
        }

        vis.appendChild(label);

        if (userPreferences.displayMode === "bitcoin-only") {
          const priceSymbol = vis.querySelector(".a-price-symbol");
          const priceWhole = vis.querySelector(".a-price-whole");
          const priceFraction = vis.querySelector(".a-price-fraction");
          if (priceSymbol) priceSymbol.remove();
          if (priceWhole) priceWhole.remove();
          if (priceFraction) priceFraction.remove();
        }
      });
    }

    /**
     * Processes WooCommerce price elements, appending bitcoin values or replacing fiat prices.
     * Handles both dual-display and bitcoin-only display modes.
     */
    function processWooCommercePrices(): void {
      document.querySelectorAll<HTMLSpanElement>(".woocommerce-Price-amount.amount").forEach((amount) => {
        if (amount.dataset.ocProcessed === "true" || amount.querySelector(".oc-btc-price")) return;

        const currency = supportedCurrencies.find((c) => c.value === userPreferences.defaultCurrency);
        if (!currency) return;

        const btcPrice = btcPrices[currency.value];
        if (!btcPrice) return;

        const fiatValue = convertCurrencyValue(amount.textContent ?? "", currency.symbol, currency.value);
        if (isNaN(fiatValue)) return;

        const sats = Math.round((fiatValue / btcPrice) * SATS_IN_BTC);
        const btcDisplay = formatBitcoinValue(sats);
        const btcSpan = document.createElement("span");
        btcSpan.className = "oc-btc-price";
        btcSpan.textContent = btcDisplay;
        applyBitcoinLabelStyles(btcSpan);

        if (userPreferences.displayMode === "dual-display") {
          (amount.querySelector("bdi") ?? amount).append(" | ", btcSpan);
        } else {
          amount.textContent = "";
          amount.appendChild(btcSpan);
        }

        amount.dataset.ocProcessed = "true";
      });
    }

    /**
     * Processes price elements where the currency symbol and numeric value are split
     * into separate sibling elements within the same container (e.g. <span aria-hidden="true"><span>$</span><span>564</span></span>).
     * Works for both dual-display and bitcoin-only modes.
     */
    function processCompositePriceElements(): void {
      const currency = supportedCurrencies.find((c) => c.value === userPreferences.defaultCurrency);
      if (!currency) return;

      const btcPrice = btcPrices[currency.value];
      if (!btcPrice) return;

      // Target common containers that hide duplicated/visual prices (e.g., Amazon, generic price widgets)
      const selector = "span[aria-hidden='true']:not([data-oc-processed])";
      document.querySelectorAll<HTMLElement>(selector).forEach((container) => {
        if (container.dataset.ocProcessed === "true" || container.querySelector(".oc-btc-price")) return;
        if (!container.textContent) return;
        if (!container.textContent.includes(currency.symbol)) return;

        const fiatValue = convertCurrencyValue(container.textContent, currency.symbol, currency.value);
        if (isNaN(fiatValue)) return;

        const sats = Math.round((fiatValue / btcPrice) * SATS_IN_BTC);
        const btcDisplay = formatBitcoinValue(sats);

        const btcSpan = document.createElement("span");
        btcSpan.className = "oc-btc-price";
        btcSpan.textContent = btcDisplay;
        applyBitcoinLabelStyles(btcSpan);

        if (userPreferences.displayMode === "dual-display") {
          container.append(" | ", btcSpan);
        } else {
          // Remove existing children that represent the fiat price so only BTC remains
          container.textContent = "";
          container.appendChild(btcSpan);
        }

        container.dataset.ocProcessed = "true";
      });
    }

    // --- Initial processing and observer setup ---
    processAmazonPrices();
    processWooCommercePrices();
    processCompositePriceElements();
    walkDOM(document.body);

    // Observes DOM mutations to process dynamically added content for price conversion
    const observer = new MutationObserver((mutations: MutationRecord[]) => {
      processAmazonPrices();
      processWooCommercePrices();
      processCompositePriceElements();
      mutations.forEach((mutation: MutationRecord) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node: Node) => walkDOM(node));
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  } catch (error) {
    alert(error);
    console.error("Opportunity Cost: An error occurred:", error);
  }
}

main();
