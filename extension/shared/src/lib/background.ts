/**
 * Background context for price retrieval, local preferences, and internal
 * extension messaging. Price requests are made only when extension features
 * need data, never on a fixed schedule.
 */

import browser from "webextension-polyfill";
import { API_BASE, API_TIMEOUT, CACHE_DURATION, MAX_STALE_CACHE_DURATION, SUPPORTED_CURRENCIES } from "./constants";
import { parseBitcoinPriceResponse } from "./price-validation";
import type { BitcoinPrices } from "./price-validation";
import { PriceDatabase } from "./storage";
import type { UserPreferences } from "./storage";

interface MessageRequest {
  action?: string;
  site?: string;
}

interface MessageResponse {
  success?: boolean;
  prices?: BitcoinPrices;
  error?: string;
  supportedCurrencies?: typeof SUPPORTED_CURRENCIES;
  preferences?: UserPreferences;
  hostname?: string;
}

let userPreferences: UserPreferences | null = null;
let inFlightPriceRequest: Promise<BitcoinPrices | null> | null = null;

async function loadUserPreferences(): Promise<UserPreferences> {
  userPreferences = await PriceDatabase.getPreferences();
  return userPreferences;
}

async function requestBitcoinPrices(): Promise<BitcoinPrices | null> {
  const controller = new AbortController();
  const timeout = self.setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(API_BASE, {
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal: controller.signal,
    });
    if (!response.ok) {
      console.warn(`Bitcoin price API returned status ${response.status}`);
      return null;
    }

    const prices = parseBitcoinPriceResponse(await response.json());
    if (!prices) {
      console.warn("Bitcoin price API returned an invalid or incomplete snapshot");
      return null;
    }

    await PriceDatabase.saveBitcoinPrices(prices);
    return prices;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.warn("Bitcoin price API request timed out");
    } else {
      console.warn("Bitcoin price API request failed");
    }
    return null;
  } finally {
    self.clearTimeout(timeout);
  }
}

function fetchAndStoreAllBitcoinPrices(): Promise<BitcoinPrices | null> {
  if (inFlightPriceRequest) {
    return inFlightPriceRequest;
  }

  inFlightPriceRequest = requestBitcoinPrices().finally(() => {
    inFlightPriceRequest = null;
  });
  return inFlightPriceRequest;
}

async function getAllBitcoinPrices(): Promise<BitcoinPrices | null> {
  const snapshot = await PriceDatabase.getBitcoinPrices();
  const snapshotAge = snapshot ? Date.now() - snapshot.timestamp : Number.POSITIVE_INFINITY;

  if (snapshot && snapshotAge < CACHE_DURATION) {
    return parseBitcoinPriceResponse({ bitcoin: snapshot.prices });
  }

  const freshPrices = await fetchAndStoreAllBitcoinPrices();
  if (freshPrices) {
    return freshPrices;
  }

  if (snapshot && snapshotAge < MAX_STALE_CACHE_DURATION) {
    return parseBitcoinPriceResponse({ bitcoin: snapshot.prices });
  }

  return null;
}

async function broadcastPreferenceUpdate(): Promise<void> {
  const [currentTab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (currentTab?.id === undefined) {
    return;
  }

  try {
    await browser.tabs.sendMessage(currentTab.id, { action: "preferencesUpdated" });
  } catch {
    // Protected pages and tabs opened before installation have no content script.
  }
}

function normalizeHostname(site: string): string | null {
  const candidate = site.trim().toLowerCase();
  if (!candidate || candidate.length > 253 || candidate.includes("/")) {
    return null;
  }

  try {
    const url = new URL(`https://${candidate}`);
    return url.hostname === candidate ? candidate : null;
  } catch {
    return null;
  }
}

async function getCurrentHostname(): Promise<string> {
  const [currentTab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!currentTab?.url) {
    return "";
  }

  try {
    const url = new URL(currentTab.url);
    return url.protocol === "http:" || url.protocol === "https:" ? url.hostname : "";
  } catch {
    return "";
  }
}

browser.runtime.onMessage.addListener(
  (
    message: MessageRequest,
    sender: browser.Runtime.MessageSender,
    sendResponse: (response?: MessageResponse) => void,
  ) => {
    if (sender.id && sender.id !== browser.runtime.id) {
      sendResponse({ error: "Unauthorized message sender" });
      return;
    }

    if (message.action === "getBitcoinPrices") {
      getAllBitcoinPrices()
        .then((prices) => sendResponse(prices ? { prices } : { error: "Bitcoin prices are unavailable" }))
        .catch(() => sendResponse({ error: "Bitcoin prices are unavailable" }));
      return true;
    }

    if (message.action === "getSupportedCurrencies") {
      sendResponse({ supportedCurrencies: SUPPORTED_CURRENCIES });
      return;
    }

    if (message.action === "getPreferences") {
      (userPreferences ? Promise.resolve(userPreferences) : loadUserPreferences())
        .then((preferences) => sendResponse({ preferences }))
        .catch(() => sendResponse({ error: "Preferences are unavailable" }));
      return true;
    }

    if (message.action === "getAllBitcoinPrices") {
      Promise.all([getAllBitcoinPrices(), userPreferences ? Promise.resolve(userPreferences) : loadUserPreferences()])
        .then(([prices, preferences]) => {
          sendResponse(
            prices
              ? { prices, supportedCurrencies: SUPPORTED_CURRENCIES, preferences }
              : { error: "Bitcoin prices are unavailable" },
          );
        })
        .catch(() => sendResponse({ error: "Bitcoin prices are unavailable" }));
      return true;
    }

    if (message.action === "preferencesUpdated") {
      loadUserPreferences()
        .then(broadcastPreferenceUpdate)
        .then(() => sendResponse({ success: true }))
        .catch(() => sendResponse({ error: "Preferences could not be reloaded" }));
      return true;
    }

    if (message.action === "toggleSiteDisabled") {
      const site = message.site ? normalizeHostname(message.site) : null;
      if (!site) {
        sendResponse({ error: "A valid hostname is required" });
        return;
      }

      loadUserPreferences()
        .then(async (preferences) => {
          const disabledSites = preferences.disabledSites ?? [];
          const nextDisabledSites = disabledSites.includes(site)
            ? disabledSites.filter((disabledSite) => disabledSite !== site)
            : [...disabledSites, site];
          await PriceDatabase.savePreferences({ disabledSites: nextDisabledSites });
          await loadUserPreferences();
          await broadcastPreferenceUpdate();
          sendResponse({ success: true });
        })
        .catch(() => sendResponse({ error: "Site preference could not be updated" }));
      return true;
    }

    if (message.action === "getCurrentTab") {
      getCurrentHostname()
        .then((hostname) => sendResponse({ hostname }))
        .catch(() => sendResponse({ hostname: "" }));
      return true;
    }

    sendResponse({ error: "Unknown message action" });
  },
);

loadUserPreferences().catch(() => {
  console.warn("Extension preferences could not be initialized");
});
