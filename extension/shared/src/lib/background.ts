/**
 * Opportunity Cost Extension
 *
 * This background script handles:
 * 1. Toolbar icon click event
 * 2. Bitcoin price fetching and storage
 * 3. Communication with content scripts
 * 4. User preferences management
 */

import browser from "webextension-polyfill";
import { PriceDatabase } from "./storage";
import type { UserPreferences } from "./storage";
import {
  API_BASE,
  DEFAULT_REFRESH_INTERVAL,
  CACHE_DURATION,
  INITIAL_BACKOFF,
  MAX_BACKOFF,
  MAX_RETRIES,
  SUPPORTED_CURRENCIES,
} from "./constants";

// Supported currencies as a tuple and type
type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]["value"];

interface MessageRequest {
  action: string;
  site?: string;
}

interface MessageResponse {
  success?: boolean;
  price?: number | null;
  prices?: Record<string, number>;
  error?: string;
  supportedCurrencies?: Array<{ value: string; symbol: string }>;
  preferences?: UserPreferences;
  tab?: browser.Tabs.Tab;
}

interface BitcoinPriceAPIResponse {
  bitcoin: Record<SupportedCurrency, number>;
}

// Extension state
let priceRefreshInterval: number | null = null;
let userPreferences: UserPreferences | null = null;
let backoffTime = INITIAL_BACKOFF;
let retryCount = 0;

// Load user preferences
async function loadUserPreferences(): Promise<UserPreferences> {
  try {
    // First try to get preferences from database
    const prefs = await PriceDatabase.getPreferences();

    // Ensure we have valid preferences
    if (!prefs || typeof prefs !== "object") {
      throw new Error("Invalid preferences data received from storage");
    }

    // Set global preferences
    userPreferences = prefs;
    console.log("Loaded user preferences:", userPreferences);

    // Apply preferences to extension behavior
    applyUserPreferences();

    return userPreferences;
  } catch (error) {
    console.error("Error loading user preferences:", error);

    // Use defaults as fallback
    userPreferences = {
      id: "user-preferences",
      defaultCurrency: "usd",
      displayMode: "dual-display",
      denomination: "btc", // Default to BTC instead of sats
      highlightBitcoinValue: false, // Default to no highlighting
      disabledSites: [], // Disable the extension on these sites
      darkMode: false, // Light mode by default (kept for backward compatibility)
      themeMode: "system", // Use system theme by default
      lastUpdated: Date.now(),
    };

    // Try to save these defaults
    try {
      await PriceDatabase.savePreferences(userPreferences);
    } catch (saveError) {
      console.error("Failed to save default preferences:", saveError);
      // Continue anyway - we'll use the in-memory defaults
    }

    // Apply even if we're using defaults
    applyUserPreferences();

    return userPreferences;
  }
}

// Apply user preferences to extension behavior
function applyUserPreferences(): void {
  // Always set up auto-refresh
  if (priceRefreshInterval) {
    self.clearInterval(priceRefreshInterval);
    priceRefreshInterval = null;
  }

  // Always refresh prices automatically
  priceRefreshInterval = self.setInterval(fetchAndStoreAllBitcoinPrices, DEFAULT_REFRESH_INTERVAL);
}

// Fetch and store Bitcoin prices for all supported currencies at once
async function fetchAndStoreAllBitcoinPrices(): Promise<Record<string, number> | null> {
  if (!userPreferences) {
    await loadUserPreferences();
  }

  try {
    // Fetch current prices for all currencies from API
    const response = await fetch(API_BASE);

    if (!response.ok) {
      // Check if we hit rate limits (HTTP 429) or server errors (5xx)
      if (response.status === 429 || response.status >= 500) {
        if (retryCount < MAX_RETRIES) {
          console.warn(
            `API request failed with status ${response.status}. Retrying in ${backoffTime / 1000} seconds...`,
          );
          retryCount++;

          // Set up retry with exponential backoff
          return new Promise((resolve) => {
            setTimeout(async () => {
              // Double the backoff time for next potential retry (exponential backoff)
              backoffTime = Math.min(backoffTime * 2, MAX_BACKOFF);
              const result = await fetchAndStoreAllBitcoinPrices();
              resolve(result);
            }, backoffTime);
          });
        } else {
          console.error(`Maximum retries (${MAX_RETRIES}) reached. Using cached data if available.`);
          // Reset backoff for next time
          backoffTime = INITIAL_BACKOFF;
          retryCount = 0;
          return null;
        }
      } else {
        console.warn(`Failed to fetch BTC prices from API: ${response.status} ${response.statusText}`);
        return null;
      }
    }

    // Reset backoff parameters on successful request
    backoffTime = INITIAL_BACKOFF;
    retryCount = 0;

    const data: BitcoinPriceAPIResponse = await response.json();
    const prices = data?.bitcoin;
    if (!prices || typeof prices !== "object") {
      console.warn("Invalid BTC price data received from API");
      return null;
    }

    // Store each currency's price in the database
    const savePromises = (Object.entries(prices) as [SupportedCurrency, number][]).map(([currency, price]) => {
      if (typeof price === "number") {
        return PriceDatabase.saveBitcoinPrice(currency, price);
      }
      return Promise.resolve();
    });
    await Promise.all(savePromises);

    return prices;
  } catch (error) {
    console.error("Error fetching or storing BTC prices:", error);

    // Handle network errors with backoff as well
    if (retryCount < MAX_RETRIES) {
      console.warn(`Network error. Retrying in ${backoffTime / 1000} seconds...`);
      retryCount++;

      return new Promise((resolve) => {
        setTimeout(async () => {
          // Double the backoff time for next potential retry
          backoffTime = Math.min(backoffTime * 2, MAX_BACKOFF);
          const result = await fetchAndStoreAllBitcoinPrices();
          resolve(result);
        }, backoffTime);
      });
    } else {
      console.error(`Maximum retries (${MAX_RETRIES}) reached after network errors.`);
      // Reset backoff for next time
      backoffTime = INITIAL_BACKOFF;
      retryCount = 0;
      return null;
    }
  }
}

// Get all Bitcoin prices (from database if available, or fetch from API)
async function getAllBitcoinPrices(): Promise<Record<string, number> | null> {
  if (!userPreferences) {
    await loadUserPreferences();
  }

  try {
    // Try to get the latest prices for all supported currencies from the database
    const prices: Record<string, number> = {};
    let allHaveRecent = true;
    for (const currency of SUPPORTED_CURRENCIES) {
      const storedPrice = await PriceDatabase.getLatestBitcoinPrice(currency.value);
      if (storedPrice && Date.now() - storedPrice.timestamp < CACHE_DURATION) {
        prices[currency.value] = storedPrice.price;
      } else {
        allHaveRecent = false;
      }
    }
    if (allHaveRecent && Object.keys(prices).length > 0) {
      return prices;
    }
    // Otherwise fetch fresh prices
    return await fetchAndStoreAllBitcoinPrices();
  } catch (error) {
    console.error("Error getting all Bitcoin prices:", error);
    return null;
  }
}

// Listen for messages from content scripts and options page
browser.runtime.onMessage.addListener(
  (
    message: MessageRequest,
    _sender: browser.Runtime.MessageSender,
    sendResponse: (response?: MessageResponse) => void,
  ) => {
    // Get Bitcoin prices only
    if (message.action === "getBitcoinPrices") {
      getAllBitcoinPrices()
        .then(async (prices) => {
          if (!prices) {
            sendResponse({ error: "Failed to get Bitcoin prices" });
            return;
          }

          // Load preferences to check if Saylor Mode is enabled
          if (!userPreferences) {
            await loadUserPreferences();
          }

          // Send actual prices - Saylor Mode calculation will be done in content script
          sendResponse({ prices: prices });
        })
        .catch((error: Error) => {
          console.error("Error in getBitcoinPrices:", error);
          sendResponse({ error: error.message });
        });
      return true;
    }
    // Get supported currencies only
    else if (message.action === "getSupportedCurrencies") {
      sendResponse({ supportedCurrencies: SUPPORTED_CURRENCIES });
      return; // No async operation
    }
    // Get complete user preferences
    else if (message.action === "getPreferences") {
      // Send current preferences to content script
      if (userPreferences) {
        sendResponse({ preferences: userPreferences });
      } else {
        loadUserPreferences()
          .then((prefs) => {
            sendResponse({ preferences: prefs });
          })
          .catch((error: Error) => {
            console.error("Error loading preferences:", error);
            sendResponse({ error: error.message });
          });
      }
      return true;
    }
    // Legacy handler for backward compatibility
    else if (message.action === "getAllBitcoinPrices") {
      getAllBitcoinPrices()
        .then(async (prices) => {
          if (!prices) {
            sendResponse({ error: "Failed to get Bitcoin prices" });
            return;
          }

          // Load preferences if needed
          if (!userPreferences) {
            await loadUserPreferences();
          }

          // Send actual prices - Saylor Mode calculation will be done in content script
          if (!userPreferences) {
            loadUserPreferences()
              .then((prefs) => {
                sendResponse({
                  prices: prices,
                  supportedCurrencies: SUPPORTED_CURRENCIES,
                  preferences: prefs,
                });
              })
              .catch((error: Error) => {
                console.error("Error loading preferences:", error);
                sendResponse({
                  prices: prices,
                  supportedCurrencies: SUPPORTED_CURRENCIES,
                  error: "Error loading preferences: " + error.message,
                });
              });
          } else {
            sendResponse({
              prices: prices,
              supportedCurrencies: SUPPORTED_CURRENCIES,
              preferences: userPreferences,
            });
          }
        })
        .catch((error: Error) => {
          console.error("Error in getAllBitcoinPrices:", error);
          sendResponse({ error: error.message });
        });
      return true;
    } else if (message.action === "preferencesUpdated") {
      // Reload preferences when options page updates them
      loadUserPreferences()
        .then(async () => {
          // Broadcast the preference update to the current active tab
          const [currentTab] = await browser.tabs.query({ active: true, currentWindow: true });
          if (
            currentTab &&
            currentTab.id &&
            currentTab.url &&
            !currentTab.url.startsWith("chrome://") &&
            !currentTab.url.startsWith("chrome-extension://") &&
            !currentTab.url.startsWith("about:") &&
            !currentTab.url.startsWith("edge://") &&
            !currentTab.url.startsWith("brave://")
          ) {
            try {
              // Use a try-catch to handle any messaging errors
              await browser.tabs.sendMessage(currentTab.id, { action: "preferencesUpdated" });
            } catch {
              // This error is expected for tabs that don't have the content script injected.
            }
          }
          sendResponse({ success: true });
        })
        .catch((error: Error) => {
          console.error("Error reloading preferences:", error);
          sendResponse({ error: error.message });
        });

      return true;
    } else if (message.action === "toggleSiteDisabled") {
      const site = message.site;
      if (!site) {
        sendResponse({ error: "No site provided" });
        return;
      }
      loadUserPreferences()
        .then((prefs) => {
          const disabledSites = prefs.disabledSites || [];
          const isDisabled = disabledSites.includes(site);
          if (isDisabled) {
            // It's disabled, so enable it by removing it from the list
            prefs.disabledSites = disabledSites.filter((s) => s !== site);
          } else {
            // It's enabled, so disable it by adding it to the list
            prefs.disabledSites = [...disabledSites, site];
          }
          return PriceDatabase.savePreferences(prefs);
        })
        .then(async () => {
          // Broadcast the preference update to the current active tab
          const [currentTab] = await browser.tabs.query({ active: true, currentWindow: true });
          if (
            currentTab &&
            currentTab.id &&
            currentTab.url &&
            !currentTab.url.startsWith("chrome://") &&
            !currentTab.url.startsWith("chrome-extension://") &&
            !currentTab.url.startsWith("about:") &&
            !currentTab.url.startsWith("edge://") &&
            !currentTab.url.startsWith("brave://")
          ) {
            try {
              await browser.tabs.sendMessage(currentTab.id, { action: "preferencesUpdated" });
            } catch {
              // Ignore errors
            }
          }
          sendResponse({ success: true });
        })
        .catch((error: Error) => {
          console.error("Error toggling site disabled state:", error);
          sendResponse({ error: error.message });
        });
      return true;
    } else if (message.action === "getCurrentTab") {
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs[0]) {
          sendResponse({ tab: tabs[0] });
        } else {
          sendResponse({ error: "No active tab found" });
        }
      });
      return true;
    }
  },
);

// Initialize when the extension starts
async function initialize(): Promise<void> {
  try {
    // Check if we're in a valid context
    if (typeof self === "undefined") {
      console.error("Extension is running in an invalid context, 'self' is not defined");
      return;
    }

    // First try to load user preferences
    try {
      await loadUserPreferences();
    } catch (prefError) {
      console.error("Failed to load user preferences:", prefError);
      // Set default preferences if we couldn't load them
      userPreferences = {
        id: "user-preferences",
        defaultCurrency: "usd",
        displayMode: "dual-display",
        denomination: "btc",
        highlightBitcoinValue: false,
        disabledSites: [],
        lastUpdated: Date.now(),
      };
    }

    // Then try to fetch Bitcoin price
    try {
      await fetchAndStoreAllBitcoinPrices();
    } catch (priceError) {
      console.error("Failed to fetch initial Bitcoin price:", priceError);
      // We'll retry later via the auto-refresh mechanism
    }

    console.log("Opportunity Cost extension initialized successfully");
  } catch (error) {
    console.error("Critical error initializing extension:", error);
  }
}

// Start the extension
initialize();
