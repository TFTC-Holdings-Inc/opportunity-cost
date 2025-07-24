import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import { PriceDatabase } from "../lib/storage";
import { DEFAULT_CURRENCY, SUPPORTED_CURRENCIES } from "../lib/constants";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent } from "./ui/tooltip";
import { X } from "lucide-react";

// Theme types for more flexibility
type ThemeMode = "system" | "light" | "dark";

export function OptionsPage() {
  // State for form fields
  const [defaultCurrency, setDefaultCurrency] = useState(DEFAULT_CURRENCY);
  const [displayMode, setDisplayMode] = useState<"bitcoin-only" | "dual-display">("dual-display");
  const [denomination, setDenomination] = useState<"btc" | "sats" | "dynamic">("btc");
  const [highlightBitcoinValue, sethighlightBitcoinValue] = useState(false);
  const [saylorMode, setSaylorMode] = useState(false);
  const [disabledSites, setDisabledSites] = useState<string[]>([]);
  const [newSite, setNewSite] = useState("");
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [darkMode, setDarkMode] = useState(false);
  const [saveMessage, setSaveMessage] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Compute if highlight bitcoin should be mandatory
  const isHighlightMandatory = saylorMode && displayMode === "bitcoin-only";

  // Function to detect system theme preference
  const getSystemThemePreference = (): boolean => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  // Function to apply theme based on preference
  const applyTheme = (mode: ThemeMode, systemIsDark?: boolean) => {
    const isDark =
      mode === "dark" ||
      (mode === "system" && (systemIsDark !== undefined ? systemIsDark : getSystemThemePreference()));

    setDarkMode(isDark);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (themeMode === "system") {
        applyTheme("system", e.matches);
      }
    };

    // Modern browsers
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [themeMode]);

  // Automatically enable highlight bitcoin when both Saylor Mode and Bitcoin-only mode are active
  useEffect(() => {
    if (isHighlightMandatory && !highlightBitcoinValue) {
      sethighlightBitcoinValue(true);
    }
  }, [isHighlightMandatory, highlightBitcoinValue]);

  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      setLoadingSettings(true);
      setSettingsError(null);
      try {
        const preferences = await PriceDatabase.getPreferences();
        setDefaultCurrency(preferences.defaultCurrency || DEFAULT_CURRENCY);
        setDisplayMode(preferences.displayMode || "dual-display");
        setDenomination(preferences.denomination || "btc");
        sethighlightBitcoinValue(preferences.highlightBitcoinValue === true); // default false
        setSaylorMode(preferences.saylorMode || false);
        setDisabledSites(preferences.disabledSites || []);

        // Load theme preference
        const savedTheme = preferences.themeMode || "system";
        setThemeMode(savedTheme as ThemeMode);

        // Apply theme based on preference
        applyTheme(savedTheme as ThemeMode);
      } catch {
        setSettingsError("Error loading settings");
      } finally {
        setLoadingSettings(false);
      }
    }
    loadSettings();
  }, []);

  // Handle theme change
  const handleThemeChange = (newTheme: ThemeMode) => {
    setThemeMode(newTheme);
    applyTheme(newTheme);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Force highlight bitcoin to be true if both Saylor Mode and Bitcoin-only mode are active
      const finalHighlightValue = isHighlightMandatory ? true : highlightBitcoinValue;

      await PriceDatabase.savePreferences({
        defaultCurrency,
        displayMode,
        denomination,
        highlightBitcoinValue: finalHighlightValue,
        saylorMode,
        themeMode,
      });
      // Notify background script that preferences have been updated
      await browser.runtime.sendMessage({ action: "preferencesUpdated" });
      setSaveMessage(true);
      setTimeout(() => setSaveMessage(false), 2000);
    } catch {
      alert("There was an error saving your settings. Please try again.");
    }
  };

  const handleAddDisabledSite = async (e: React.FormEvent) => {
    e.preventDefault();
    const siteToAdd = newSite.trim();

    if (!siteToAdd) {
      return; // Do nothing if input is empty
    }

    let hostname: string;
    try {
      // Use URL to validate and extract hostname. Prepend protocol if missing.
      hostname = new URL(siteToAdd.startsWith("http") ? siteToAdd : `https://${siteToAdd}`).hostname;
    } catch {
      alert("Please enter a valid hostname (e.g., example.com).");
      return;
    }

    if (disabledSites.includes(hostname)) {
      alert(`${hostname} is already in the disabled list.`);
      setNewSite("");
      return;
    }

    const originalSites = [...disabledSites];
    const updatedSites = [...disabledSites, hostname].sort(); // Keep the list sorted
    setDisabledSites(updatedSites);
    setNewSite("");

    try {
      await PriceDatabase.savePreferences({ disabledSites: updatedSites });
      await browser.runtime.sendMessage({ action: "preferencesUpdated" });
    } catch (error) {
      console.error("Error updating disabled sites:", error);
      alert("Failed to add site to disabled list. Please try again.");
      setDisabledSites(originalSites); // Revert on failure
    }
  };

  const handleRemoveDisabledSite = async (siteToRemove: string) => {
    const originalSites = [...disabledSites];
    const updatedSites = disabledSites.filter((site) => site !== siteToRemove);
    setDisabledSites(updatedSites);

    try {
      await PriceDatabase.savePreferences({ disabledSites: updatedSites });
      await browser.runtime.sendMessage({ action: "preferencesUpdated" });
    } catch (error) {
      console.error("Error updating disabled sites:", error);
      alert("Failed to update disabled sites. Please try again.");
      // Revert UI change on failure
      setDisabledSites(originalSites);
    }
  };

  return (
    <div
      className={`mx-auto max-w-2xl p-6 text-gray-800 dark:text-gray-200 ${darkMode ? "dark bg-gray-900" : "bg-gray-50"} min-h-screen`}
    >
      <div className="mb-6 flex items-center">
        <img src="icons/logo.svg" alt="TFTC Logo" className="mr-3 h-8" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Main Settings */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          {loadingSettings ? (
            <div className="text-gray-400 dark:text-gray-500">Loading...</div>
          ) : settingsError ? (
            <div className="text-red-500">{settingsError}</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="default-currency"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Default Currency
                  </label>
                  <select
                    id="default-currency"
                    className="w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={defaultCurrency}
                    onChange={(e) => setDefaultCurrency(e.target.value)}
                  >
                    {SUPPORTED_CURRENCIES.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.name} ({currency.value.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="denomination"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Bitcoin Unit
                  </label>
                  <select
                    id="denomination"
                    className="w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={denomination}
                    onChange={(e) => setDenomination(e.target.value as "btc" | "sats" | "dynamic")}
                  >
                    <option value="sats">Satoshis</option>
                    <option value="btc">Bitcoin</option>
                    <option value="dynamic">Dynamic</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="display-mode"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Display Mode
                  </label>
                  <select
                    id="display-mode"
                    className="w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={displayMode}
                    onChange={(e) => setDisplayMode(e.target.value as "bitcoin-only" | "dual-display")}
                  >
                    <option value="dual-display">Dual Display</option>
                    <option value="bitcoin-only">Bitcoin Only</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="theme-mode"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Theme
                  </label>
                  <select
                    id="theme-mode"
                    className="w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={themeMode}
                    onChange={(e) => handleThemeChange(e.target.value as ThemeMode)}
                  >
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={saylorMode}
                    onChange={(e) => setSaylorMode(e.target.checked)}
                    className="mr-2 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Saylor Mode ⚡</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={highlightBitcoinValue}
                    onChange={(e) => {
                      if (isHighlightMandatory && highlightBitcoinValue) return;
                      sethighlightBitcoinValue(e.target.checked);
                    }}
                    disabled={isHighlightMandatory}
                    className="mr-2 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Highlight Bitcoin values
                    {isHighlightMandatory && <span className="ml-1 text-xs text-orange-500">*</span>}
                  </span>
                </label>
                {isHighlightMandatory && (
                  <p className="ml-6 text-xs text-orange-600 dark:text-orange-400">
                    * Auto-enabled with Saylor Mode + Bitcoin-only
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button type="submit" variant="default">
                  Save Settings
                </Button>
                {saveMessage && <span className="text-sm font-medium text-green-600 dark:text-green-400">Saved!</span>}
              </div>
            </form>
          )}
        </div>

        {/* Disabled Sites */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Disabled Sites</h2>

          <form onSubmit={handleAddDisabledSite} className="mb-4 flex gap-2">
            <input
              type="text"
              value={newSite}
              onChange={(e) => setNewSite(e.target.value)}
              placeholder="example.com"
              className="flex-1 rounded border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <Button type="submit" variant="secondary" size="sm">
              Add
            </Button>
          </form>

          {disabledSites.length === 0 ? (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">No disabled sites</p>
          ) : (
            <div className="space-y-2">
              {disabledSites.map((site) => (
                <div key={site} className="flex items-center justify-between rounded border p-2 dark:border-gray-600">
                  <span className="text-sm">{site}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveDisabledSite(site)}
                    className="h-6 w-6 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter */}
        <div className="rounded-lg bg-orange-50 p-6 text-center dark:bg-gray-800">
          <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Bitcoin Brief Newsletter</h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Get Bitcoin updates and market insights from TFTC.
          </p>
          <Button variant="default" asChild>
            <a
              href="https://tftc.io/bitcoin-brief?utm_source=opportunity-cost-extension"
              target="_blank"
              rel="noopener noreferrer"
            >
              Subscribe
            </a>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>
          &copy; 2025 Opportunity Cost &middot;{" "}
          <a
            href="https://www.opportunitycost.app/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Privacy
          </a>{" "}
          &middot;{" "}
          <a
            href="https://opportunitycost.userjot.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Feedback
          </a>
        </p>
      </div>

      <Tooltip delayDuration={700}>
        <TooltipContent>Dynamic mode switches between BTC and sats based on the value.</TooltipContent>
      </Tooltip>
    </div>
  );
}
