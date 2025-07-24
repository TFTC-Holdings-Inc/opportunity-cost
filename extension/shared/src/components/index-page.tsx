import React, { useEffect, useState, useRef } from "react";
import browser from "webextension-polyfill";
import "@/index.css";
import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY, APP_URL } from "../lib/constants";
import { cn } from "@/lib/utils";
import Cleave from "cleave.js/react";
import { PriceDatabase } from "../lib/storage";
import { SaylorModeOverlay } from "./saylor-mode-overlay";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import {
  Ellipsis,
  Bitcoin,
  PaintbrushVertical,
  Link,
  Check,
  Sun,
  Moon,
  Monitor,
  Settings2,
  Info,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Switch } from "./ui/switch";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

// Custom event name for display mode changes
const DISPLAY_MODE_CHANGE_EVENT = "display-mode-change";
// NEW: Custom event name for default currency changes
const DEFAULT_CURRENCY_CHANGE_EVENT = "default-currency-change";
// Custom event for Saylor Mode activation animation
const SAYLOR_MODE_ACTIVATED_EVENT = "saylor-mode-activated";
// Custom event for when Saylor Mode overlay completes
const SAYLOR_MODE_COMPLETE_EVENT = "saylor-mode-complete";

// --- Header ---
function Header() {
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(APP_URL);
    setLinkCopied(true);
    setTimeout(() => {
      setLinkCopied(false);
    }, 1000);
  };

  return (
    <header className="mb-4 flex items-center gap-x-0.5">
      <a href={APP_URL} target="_blank" className="mr-auto flex items-center">
        <img src="icons/logo.svg" alt="TFTC Logo" className="mr-2 h-8" />
        <span className="text-foreground text-lg font-bold dark:text-white">Opportunity Cost</span>
      </a>

      <TooltipProvider>
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={handleCopyLink}
              className="size-8 rounded p-0 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-800"
            >
              {linkCopied ? <Check className="size-4" /> : <Link className="size-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{linkCopied ? "Link copied" : "Copy link"}</TooltipContent>
        </Tooltip>

        <Settings />
      </TooltipProvider>
    </header>
  );
}

// --- Live Price ---
function LivePrice() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currency, setCurrency] = useState<string>(DEFAULT_CURRENCY);
  const [supportedCurrencies, setSupportedCurrencies] = useState<typeof SUPPORTED_CURRENCIES>(SUPPORTED_CURRENCIES);
  const [currencyPickerOpen, setCurrencyPickerOpen] = useState(false);

  const fetchPrices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await browser.runtime.sendMessage({ action: "getAllBitcoinPrices" });

      if (response.error) {
        throw new Error(response.error);
      }

      if (response?.prices) {
        setPrices(response.prices);
        setSupportedCurrencies(response.supportedCurrencies || SUPPORTED_CURRENCIES);
        setCurrency(response.preferences?.defaultCurrency || DEFAULT_CURRENCY);
        setLastUpdated(new Date());
      } else {
        throw new Error("Invalid price data received");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch price");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  // Format currency symbol based on currency code
  const getCurrencySymbol = (currencyCode: string) => {
    const found = supportedCurrencies.find((c) => c.value === currencyCode);
    return found ? found.symbol : "$";
  };

  // --- Local state & helpers for currency picker ---
  const changeDefaultCurrency = async (newCurrency: string) => {
    setCurrency(newCurrency);
    try {
      await PriceDatabase.savePreferences({ defaultCurrency: newCurrency });
      await browser.runtime.sendMessage({ action: "preferencesUpdated" });
      // Refresh prices to ensure latest values are shown
      fetchPrices();
      // Notify other components about the currency change
      document.dispatchEvent(
        new CustomEvent(DEFAULT_CURRENCY_CHANGE_EVENT, {
          detail: { defaultCurrency: newCurrency },
        }),
      );
    } catch (err) {
      console.error("Error updating default currency:", err);
    }
  };

  return (
    <section className="mb-4">
      <div className="flex flex-wrap items-start justify-between">
        <span className="font-semibold dark:text-gray-200">Bitcoin Price:</span>
        {loading ? (
          <span className="font-mono text-lg text-gray-400 dark:text-gray-500">Loading...</span>
        ) : error ? (
          <span className="text-sm text-red-500">Error: {error}</span>
        ) : (
          <div className="group flex items-center">
            {/* Currency switcher */}
            <Popover open={currencyPickerOpen} onOpenChange={setCurrencyPickerOpen}>
              <PopoverTrigger asChild>
                <button
                  className="mr-1 rounded p-1 opacity-0 transition-opacity hover:bg-gray-100 focus:outline-none group-focus-within:opacity-100 group-hover:opacity-100 dark:hover:bg-gray-800"
                  aria-label="Change default currency"
                  role="combobox"
                  aria-expanded={currencyPickerOpen}
                >
                  <ChevronsUpDown className="size-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="h-64 w-56 p-0">
                <Command>
                  <CommandInput placeholder="Search default currency..." />
                  <CommandList>
                    <CommandEmpty>No currency found.</CommandEmpty>
                    <CommandGroup>
                      {supportedCurrencies.map((c) => (
                        <CommandItem
                          key={c.value}
                          value={`${c.name} ${c.symbol}`}
                          onSelect={() => {
                            changeDefaultCurrency(c.value);
                            setCurrencyPickerOpen(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", currency === c.value ? "opacity-100" : "opacity-0")} />
                          {c.name} ({c.symbol})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <span className={cn("font-mono text-xl dark:text-white")}>
              {getCurrencySymbol(currency)}
              {prices[currency]?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        )}
      </div>
      <div className="flex justify-end text-xs text-gray-400 dark:text-gray-500">
        <span>
          Last updated:{" "}
          {lastUpdated ? lastUpdated.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "--:--"}
        </span>
      </div>
    </section>
  );
}

// --- Converter ---
function Converter() {
  const [fiatAmount, setFiatAmount] = useState<string>("");
  const [btcAmount, setBtcAmount] = useState<string>("");
  const [lastEdited, setLastEdited] = useState<"fiat" | "btc">("fiat");
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [localDenomination, setLocalDenomination] = useState<"sats" | "btc">("btc");
  const [currency, setCurrency] = useState<string>(DEFAULT_CURRENCY);
  const [supportedCurrencies, setSupportedCurrencies] = useState<typeof SUPPORTED_CURRENCIES>(SUPPORTED_CURRENCIES);
  const [showTooltip, setShowTooltip] = useState(false);
  const [focusedPanel, setFocusedPanel] = useState<"fiat" | "btc" | null>(null);
  const tooltipTimeout = useRef<number | null>(null);

  // Refs for input elements
  const fiatInputRef = React.useRef<HTMLInputElement>(null);
  const btcInputRef = React.useRef<HTMLInputElement>(null);

  // Constants
  const SATS_IN_BTC = 100_000_000;

  // Tooltip event handlers
  const handleMouseEnter = () => {
    tooltipTimeout.current = window.setTimeout(() => {
      setShowTooltip(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (tooltipTimeout.current) {
      window.clearTimeout(tooltipTimeout.current);
      tooltipTimeout.current = null;
    }
    setShowTooltip(false);
  };

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (tooltipTimeout.current) {
        window.clearTimeout(tooltipTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    // Focus the fiat input after the component mounts and prices are loaded
    if (!loading && prices[currency] && fiatInputRef.current) {
      // Small timeout to ensure DOM is fully rendered
      setTimeout(() => {
        fiatInputRef.current?.focus();
      }, 100);
    }
  }, [loading, prices, currency]);

  // Load initial display mode and listen for changes
  useEffect(() => {
    // Load user preferences for display mode and denomination
    const loadPreferences = async () => {
      try {
        const preferences = await PriceDatabase.getPreferences();
        // setDisplayMode(preferences.displayMode || "dual-display");
        // Ensure only "sats" or "btc" is set, defaulting to "btc"
        const denomination = preferences.denomination === "sats" ? "sats" : "btc";
        setLocalDenomination(denomination);
      } catch (error) {
        console.error("Error loading display mode:", error);
      }
    };

    // Event handler for display mode changes from Settings component
    const handleDisplayModeChange = (event: CustomEvent) => {
      if (event.detail.denomination) {
        setLocalDenomination(event.detail.denomination);
      }
    };

    // Add event listener
    document.addEventListener(DISPLAY_MODE_CHANGE_EVENT, handleDisplayModeChange as EventListener);

    // Load initial preferences
    loadPreferences();

    // Clean up event listener
    return () => {
      document.removeEventListener(DISPLAY_MODE_CHANGE_EVENT, handleDisplayModeChange as EventListener);
    };
  }, []);

  useEffect(() => {
    // Fetch BTC prices and preferences
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await browser.runtime.sendMessage({ action: "getAllBitcoinPrices" });

        if (response.error) {
          throw new Error(response.error);
        }

        if (response?.prices) {
          setPrices(response.prices);
          setSupportedCurrencies(response.supportedCurrencies || SUPPORTED_CURRENCIES);
          setCurrency(response.preferences?.defaultCurrency || DEFAULT_CURRENCY);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Listen for default currency changes from LivePrice
  useEffect(() => {
    const handleDefaultCurrencyChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ defaultCurrency: string }>;
      const newCurrency = customEvent.detail?.defaultCurrency;
      if (newCurrency) {
        // Update currency state first
        setCurrency(newCurrency);

        // Retrieve the price for the newly-selected currency
        const priceForNewCurrency = prices[newCurrency];
        if (!priceForNewCurrency) {
          // If we don't have the price yet, we can't recalculate – exit early
          return;
        }

        // Recalculate based on the last edited field using *new* currency pricing
        if (lastEdited === "fiat" && fiatAmount) {
          const numValue = parseFloat(fiatAmount.replace(/,/g, ""));
          if (!isNaN(numValue)) {
            const inBtc = numValue / priceForNewCurrency;

            if (localDenomination === "sats") {
              const inSats = Math.round(inBtc * SATS_IN_BTC);
              setBtcAmount(inSats.toString());
            } else {
              if (inBtc < 0.000001) {
                setBtcAmount(inBtc.toFixed(8));
              } else if (inBtc < 0.0001) {
                setBtcAmount(inBtc.toFixed(6));
              } else {
                setBtcAmount(inBtc.toFixed(5));
              }
            }
          }
        } else if (lastEdited === "btc" && btcAmount) {
          const numValue = parseFloat(btcAmount.replace(/,/g, ""));
          if (!isNaN(numValue)) {
            const inBtc = localDenomination === "sats" ? numValue / SATS_IN_BTC : numValue;
            const fiatValue = inBtc * priceForNewCurrency;
            setFiatAmount(fiatValue.toFixed(2));
          }
        }
      }
    };

    document.addEventListener(DEFAULT_CURRENCY_CHANGE_EVENT, handleDefaultCurrencyChange);

    return () => {
      document.removeEventListener(DEFAULT_CURRENCY_CHANGE_EVENT, handleDefaultCurrencyChange);
    };
  }, [lastEdited, fiatAmount, btcAmount, prices, localDenomination]);

  // Convert fiat to Bitcoin
  const convertFiatToBtc = (fiatValue: number): string => {
    const price = prices[currency];
    if (!price) return "";

    const inBtc = fiatValue / price;

    // Format based on local denomination (BTC or sats)
    if (localDenomination === "sats") {
      const inSats = Math.round(inBtc * SATS_IN_BTC);
      return inSats.toString();
    } else {
      // Format BTC with appropriate decimals
      if (inBtc < 0.000001) {
        return inBtc.toFixed(8);
      } else if (inBtc < 0.0001) {
        return inBtc.toFixed(6);
      } else {
        return inBtc.toFixed(5);
      }
    }
  };

  // Convert Bitcoin to fiat
  const convertBtcToFiat = (btcValue: number): string => {
    const price = prices[currency];
    if (!price) return "";

    // If value is in sats, convert to BTC first
    const inBtc = localDenomination === "sats" ? btcValue / SATS_IN_BTC : btcValue;

    // Calculate fiat value
    const fiatValue = inBtc * price;

    // Return as a clean number string - Cleave will handle the formatting
    return fiatValue.toFixed(2);
  };

  // Handle fiat input change
  const handleFiatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // For Cleave component, access numeric value from the raw value
    const inputElement = e.target as HTMLInputElement & { rawValue?: string };
    const value = inputElement.rawValue || inputElement.value;
    setFiatAmount(value);
    setLastEdited("fiat");
    setFocusedPanel("fiat");

    if (prices[currency]) {
      try {
        // Parse the value removing any commas
        const cleanValue = value.replace(/,/g, "");
        const numValue = parseFloat(cleanValue);
        if (!isNaN(numValue)) {
          setBtcAmount(convertFiatToBtc(numValue));
        } else {
          setBtcAmount("");
        }
      } catch {
        setBtcAmount("");
      }
    }
  };

  // Handle BTC input change
  const handleBtcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // For Cleave component, access numeric value from the raw value
    const inputElement = e.target as HTMLInputElement & { rawValue?: string };
    const value = inputElement.rawValue || inputElement.value;
    setBtcAmount(value);
    setLastEdited("btc");
    setFocusedPanel("btc");

    if (prices[currency]) {
      try {
        // Parse the value removing any commas
        const cleanValue = value.replace(/,/g, "");
        const numValue = parseFloat(cleanValue);
        if (!isNaN(numValue)) {
          setFiatAmount(convertBtcToFiat(numValue));
        } else {
          setFiatAmount("");
        }
      } catch {
        setFiatAmount("");
      }
    }
  };

  // Toggle between BTC and sats
  const toggleDenomination = () => {
    const newDenomination = localDenomination === "btc" ? "sats" : "btc";
    setLocalDenomination(newDenomination);

    // Recalculate the Bitcoin amount if we have a value
    if (btcAmount) {
      try {
        const numValue = parseFloat(btcAmount);
        if (!isNaN(numValue)) {
          if (newDenomination === "sats" && localDenomination === "btc") {
            // Convert from BTC to sats
            setBtcAmount(String(Math.round(numValue * SATS_IN_BTC)));
          } else if (newDenomination === "btc" && localDenomination === "sats") {
            // Convert from sats to BTC
            const inBtc = numValue / SATS_IN_BTC;
            if (inBtc < 0.000001) {
              setBtcAmount(inBtc.toFixed(8));
            } else if (inBtc < 0.0001) {
              setBtcAmount(inBtc.toFixed(6));
            } else {
              setBtcAmount(inBtc.toFixed(5));
            }
          }
        }
      } catch {
        // Keep existing value on error
      }
    }
  };

  // Handle currency selection
  const handleCurrencySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = e.target.value;
    setCurrency(selectedCurrency);

    // Recalculate based on last edited field
    if (lastEdited === "fiat" && fiatAmount) {
      try {
        const numValue = parseFloat(fiatAmount);
        if (!isNaN(numValue)) {
          setBtcAmount(convertFiatToBtc(numValue));
        }
      } catch {
        // Keep existing value on error
      }
    } else if (lastEdited === "btc" && btcAmount) {
      try {
        const numValue = parseFloat(btcAmount);
        if (!isNaN(numValue)) {
          setFiatAmount(convertBtcToFiat(numValue));
        }
      } catch {
        // Keep existing value on error
      }
    }
  };

  // Toggle input focus and last edited state
  const toggleDirectionAndFocus = () => {
    // Toggle last edited state
    const newLastEdited = lastEdited === "fiat" ? "btc" : "fiat";
    setLastEdited(newLastEdited);

    // Focus the appropriate input
    if (newLastEdited === "fiat" && fiatInputRef.current) {
      fiatInputRef.current.focus();
    } else {
      document.getElementById("btc-input")?.focus();
    }
  };

  // Format currency symbol based on currency code
  const getCurrencySymbol = (currencyCode: string) => {
    const found = supportedCurrencies.find((c) => c.value === currencyCode);
    return found ? found.symbol : "$";
  };

  const currencySymbol = getCurrencySymbol(currency);
  const bitcoinUnit = localDenomination === "sats" ? "sats" : "BTC";

  // List of available denominations
  const denominations = [
    { value: "sats", label: "Satoshis (sats)" },
    { value: "btc", label: "Bitcoin (BTC)" },
  ];

  return (
    <section className="mb-4">
      <div>
        <div className="mb-2 text-sm font-bold dark:text-gray-200">Currency Converter</div>

        <div
          className={cn(
            "mb-1 cursor-text rounded-xl border border-gray-300 bg-white bg-opacity-90 px-3 py-2 transition-opacity dark:border-gray-700 dark:bg-gray-800",
            focusedPanel === "fiat" && "border-gray-500 dark:border-gray-400",
          )}
          onClick={(e) => {
            // Prevent focusing when clicking on select
            if (
              e.target instanceof HTMLSelectElement ||
              (e.target instanceof HTMLElement && e.target.closest("select"))
            ) {
              return;
            }
            fiatInputRef.current?.focus();
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="fiat-input"
              className="text-md pointer-events-none font-medium text-gray-800 dark:text-gray-200"
            >
              Fiat
            </label>
            <select
              className="text-right text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              value={currency}
              onChange={handleCurrencySelect}
              onClick={(e) => e.stopPropagation()}
              disabled={loading}
            >
              {supportedCurrencies.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <label htmlFor="fiat-input" className="absolute right-0 top-0 text-lg text-gray-300 dark:text-gray-500">
              {currency.toUpperCase()}
            </label>
            <Cleave
              id="fiat-input"
              className="w-full border-none bg-transparent pr-4 text-lg text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-0 dark:text-gray-200 dark:placeholder:text-gray-500"
              placeholder={currencySymbol}
              value={fiatAmount}
              onChange={handleFiatChange}
              onFocus={() => {
                setLastEdited("fiat");
                setFocusedPanel("fiat");
              }}
              onBlur={() => {
                if (focusedPanel === "fiat") setFocusedPanel(null);
              }}
              disabled={loading || !prices[currency]}
              options={{
                numeral: true,
                numeralThousandsGroupStyle: "thousand",
                numeralDecimalScale: 2,
                numeralPositiveOnly: false,
              }}
              htmlRef={(el) => (fiatInputRef.current = el)}
            />
          </div>
        </div>

        {/* Arrow Button */}
        <div className="relative flex justify-center">
          <div className="absolute">
            <button
              onClick={toggleDirectionAndFocus}
              className={cn(
                "-mt-4 flex size-7 select-none items-center justify-center rounded-xl border-4 border-white bg-gray-100 font-bold transition-transform duration-300 ease-in-out dark:border-gray-900 dark:bg-gray-700 dark:text-white",
                lastEdited === "btc" && "rotate-180",
              )}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              ↓
            </button>

            <div
              className={cn(
                "pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-neutral-800 px-2 py-1 text-xs text-white opacity-100 transition-all duration-200 dark:bg-neutral-700",
                showTooltip
                  ? "pointer-events-auto -translate-y-2 opacity-100"
                  : "pointer-events-none translate-y-0 opacity-0",
              )}
            >
              {lastEdited === "fiat" ? "Converting Fiat to Bitcoin" : "Converting Bitcoin to Fiat"}
            </div>
          </div>
        </div>

        {/* Bottom Panel - Bitcoin */}
        <div
          className={cn(
            "cursor-text rounded-xl border border-gray-100 bg-gray-100 px-3 py-2 dark:border-gray-700 dark:bg-gray-700",
            focusedPanel === "btc" && "border-gray-500 dark:border-gray-500",
          )}
          onClick={(e) => {
            // Prevent focusing when clicking on select
            if (
              e.target instanceof HTMLSelectElement ||
              (e.target instanceof HTMLElement && e.target.closest("select"))
            ) {
              return;
            }
            btcInputRef.current?.focus();
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="btc-input"
              className="text-md pointer-events-none font-medium text-gray-800 dark:text-gray-200"
            >
              Bitcoin
            </label>
            <select
              id="denomination-select"
              className="text-right text-xs dark:bg-gray-700 dark:text-gray-200"
              value={localDenomination}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                setLocalDenomination(e.target.value as "sats" | "btc");
                toggleDenomination();
              }}
              disabled={loading}
            >
              {denominations.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Cleave
              id="btc-input"
              className="w-full border-none bg-transparent pr-10 text-lg placeholder:text-gray-300 focus:outline-none focus:ring-0 dark:text-gray-200 dark:placeholder:text-gray-500"
              placeholder="0"
              value={btcAmount}
              onChange={handleBtcChange}
              onFocus={() => {
                setLastEdited("btc");
                setFocusedPanel("btc");
              }}
              onBlur={() => {
                if (focusedPanel === "btc") setFocusedPanel(null);
              }}
              disabled={loading || !prices[currency]}
              options={{
                numeral: true,
                numeralThousandsGroupStyle: "thousand",
                numeralDecimalScale: 8,
                numeralPositiveOnly: false,
              }}
              htmlRef={(el) => (btcInputRef.current = el)}
            />
            <label
              htmlFor="btc-input"
              className="pointer-events-none absolute right-0 top-0 text-lg text-gray-300 dark:text-gray-500"
            >
              {bitcoinUnit}
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Settings ---
function Settings() {
  const [showSettings, setShowSettings] = useState(false);
  const [denomination, setDenomination] = useState<"sats" | "btc">("btc");
  const [displayMode, setDisplayMode] = useState<"bitcoin-only" | "dual-display">("dual-display");
  const [highlightBitcoinValue, setHighlightBitcoinValue] = useState(false);
  const [saylorMode, setSaylorMode] = useState(false);
  const [prefsLoading, setPrefsLoading] = useState(true);
  const copyTimeoutRef = useRef<number | null>(null);

  // Listen for Saylor Mode completion to reopen dropdown
  useEffect(() => {
    const handleSaylorModeComplete = () => {
      // Clear any existing focus to avoid aria-hidden conflicts
      if (document.activeElement && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      // Wait longer to ensure overlay is fully closed and focus is cleared
      setTimeout(() => {
        setShowSettings(true);
      }, 200);
    };

    document.addEventListener(SAYLOR_MODE_COMPLETE_EVENT, handleSaylorModeComplete);

    return () => {
      document.removeEventListener(SAYLOR_MODE_COMPLETE_EVENT, handleSaylorModeComplete);
    };
  }, []);

  // Compute if highlight bitcoin should be mandatory
  const isHighlightMandatory = saylorMode && displayMode === "bitcoin-only";

  useEffect(() => {
    // Load user preferences
    const loadPreferences = async () => {
      setPrefsLoading(true);
      try {
        const preferences = await PriceDatabase.getPreferences();
        setDisplayMode(preferences.displayMode || "dual-display");
        setHighlightBitcoinValue(preferences.highlightBitcoinValue || false);
        setSaylorMode(preferences.saylorMode || false);
        // Ensure only "sats" or "btc" is set, defaulting to "btc"
        const denomination = preferences.denomination === "sats" ? "sats" : "btc";
        setDenomination(denomination);
      } catch (error) {
        console.error("Error loading preferences:", error);
      } finally {
        setPrefsLoading(false);
      }
    };
    loadPreferences();

    // Cleanup timeout on unmount
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  // Automatically enable highlight bitcoin when both Saylor Mode and Bitcoin-only mode are active
  useEffect(() => {
    if (isHighlightMandatory && !highlightBitcoinValue) {
      setHighlightBitcoinValue(true);
      // Save the preference automatically
      PriceDatabase.savePreferences({ highlightBitcoinValue: true })
        .then(() => {
          browser.runtime.sendMessage({ action: "preferencesUpdated" });
        })
        .catch((error) => {
          console.error("Error auto-saving highlight preference:", error);
        });
    }
  }, [isHighlightMandatory, highlightBitcoinValue]);

  // Toggle Bitcoin-only mode
  const toggleBitcoinOnlyMode = async () => {
    const newMode = displayMode === "bitcoin-only" ? "dual-display" : "bitcoin-only";
    setDisplayMode(newMode);

    // If switching to bitcoin-only mode and Saylor Mode is active, enable highlight bitcoin
    const shouldEnableHighlight = newMode === "bitcoin-only" && saylorMode;
    if (shouldEnableHighlight && !highlightBitcoinValue) {
      setHighlightBitcoinValue(true);
    }

    try {
      const prefsToSave: { displayMode: "bitcoin-only" | "dual-display"; highlightBitcoinValue?: boolean } = {
        displayMode: newMode,
      };
      if (shouldEnableHighlight) {
        prefsToSave.highlightBitcoinValue = true;
      }

      await PriceDatabase.savePreferences(prefsToSave);
      await browser.runtime.sendMessage({ action: "preferencesUpdated" });
      document.dispatchEvent(
        new CustomEvent(DISPLAY_MODE_CHANGE_EVENT, {
          detail: { displayMode: newMode, denomination },
        }),
      );
    } catch (error) {
      console.error("Error saving display mode preference:", error);
    }
  };

  // Toggle highlighting Bitcoin values
  const toggleHighlightBitcoinValue = async () => {
    // Prevent disabling if it's mandatory (Saylor Mode + Bitcoin-only mode)
    if (isHighlightMandatory && highlightBitcoinValue) {
      return;
    }

    const newHighlightValue = !highlightBitcoinValue;
    setHighlightBitcoinValue(newHighlightValue);
    try {
      await PriceDatabase.savePreferences({ highlightBitcoinValue: newHighlightValue });
      await browser.runtime.sendMessage({ action: "preferencesUpdated" });
    } catch (error) {
      console.error("Error saving highlight preference:", error);
    }
  };

  // Toggle Saylor Mode
  const toggleSaylorMode = async () => {
    const newSaylorMode = !saylorMode;
    setSaylorMode(newSaylorMode);

    // Trigger animation only when activating Saylor Mode
    if (newSaylorMode) {
      document.dispatchEvent(new CustomEvent(SAYLOR_MODE_ACTIVATED_EVENT));
    }

    // If enabling Saylor Mode and Bitcoin-only mode is active, enable highlight bitcoin
    const shouldEnableHighlight = newSaylorMode && displayMode === "bitcoin-only";
    if (shouldEnableHighlight && !highlightBitcoinValue) {
      setHighlightBitcoinValue(true);
    }

    try {
      const prefsToSave: { saylorMode: boolean; highlightBitcoinValue?: boolean } = { saylorMode: newSaylorMode };
      if (shouldEnableHighlight) {
        prefsToSave.highlightBitcoinValue = true;
      }

      await PriceDatabase.savePreferences(prefsToSave);
      await browser.runtime.sendMessage({ action: "preferencesUpdated" });
    } catch (error) {
      console.error("Error saving Saylor Mode preference:", error);
    }
  };

  // Handle denomination change
  const handleDenominationChange = async (newDenomination: "sats" | "btc") => {
    setDenomination(newDenomination);
    try {
      await PriceDatabase.savePreferences({ denomination: newDenomination });
      await browser.runtime.sendMessage({ action: "preferencesUpdated" });
      document.dispatchEvent(
        new CustomEvent(DISPLAY_MODE_CHANGE_EVENT, {
          detail: { displayMode, denomination: newDenomination },
        }),
      );
    } catch (error) {
      console.error("Error saving denomination preference:", error);
    }
  };

  return (
    <DropdownMenu open={showSettings} onOpenChange={setShowSettings}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="size-8 rounded p-0 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-800"
          aria-label="Settings"
        >
          <Ellipsis className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel>Display</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          onSelect={(e) => e.preventDefault()}
          checked={displayMode === "bitcoin-only"}
          onCheckedChange={toggleBitcoinOnlyMode}
          disabled={prefsLoading}
        >
          <span className="flex items-center">
            <Bitcoin className={cn("mr-2 h-4 w-4", displayMode === "bitcoin-only" && "text-oc-primary")} />
            <span className="text-primary">Bitcoin-only Mode</span>
          </span>
        </DropdownMenuCheckboxItem>
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <div>
              <DropdownMenuCheckboxItem
                onSelect={(e) => e.preventDefault()}
                checked={highlightBitcoinValue}
                onCheckedChange={toggleHighlightBitcoinValue}
                disabled={prefsLoading || isHighlightMandatory}
              >
                <span className="flex items-center">
                  <PaintbrushVertical className={cn("mr-2 h-4 w-4", highlightBitcoinValue && "text-oc-primary")} />
                  <span className={cn("text-primary", isHighlightMandatory && "opacity-75")}>Highlight Bitcoin</span>
                </span>
              </DropdownMenuCheckboxItem>
            </div>
          </TooltipTrigger>
          {isHighlightMandatory && (
            <TooltipContent>
              Automatically enabled when Saylor Mode
              <br />
              and Bitcoin-only mode are both active
            </TooltipContent>
          )}
        </Tooltip>
        <DropdownMenuCheckboxItem
          onSelect={(e) => e.preventDefault()}
          checked={saylorMode}
          onCheckedChange={toggleSaylorMode}
          disabled={prefsLoading}
        >
          <span className="flex items-center">
            <img
              src="saylor.jpg"
              alt="Michael Saylor"
              className={cn("mr-2 h-4 w-4 rounded-full object-cover", saylorMode && "ring-oc-primary/50 ring-2")}
            />
            <span className="text-primary">Saylor Mode ⚡</span>
          </span>
        </DropdownMenuCheckboxItem>
        {saylorMode && (
          <DropdownMenuItem
            asChild
            className="pl-2.5 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <a className="flex items-center" href={`${APP_URL}/saylor-mode`} target="_blank">
              <Info className="mr-1 size-3" />
              What is Saylor Mode?
            </a>
          </DropdownMenuItem>
        )}
        {!saylorMode && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Denomination</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={denomination}
              onValueChange={(value) => handleDenominationChange(value as "sats" | "btc")}
            >
              <DropdownMenuRadioItem
                onSelect={(e) => e.preventDefault()}
                value="sats"
                className="data-[state=checked]:text-oc-primary"
              >
                Sats
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                onSelect={(e) => e.preventDefault()}
                value="btc"
                className="data-[state=checked]:text-oc-primary"
              >
                BTC
              </DropdownMenuRadioItem>
              <Tooltip delayDuration={500}>
                <TooltipContent>Shows BTC for prices &ge;0.01 BTC, sats otherwise.</TooltipContent>
                <DropdownMenuRadioItem
                  onSelect={(e) => e.preventDefault()}
                  value="dynamic"
                  className="data-[state=checked]:text-oc-primary gap-0"
                >
                  Dynamic BTC/Sats
                  <TooltipTrigger className="ml-auto">
                    <Info className="ml-auto size-3" />
                  </TooltipTrigger>
                </DropdownMenuRadioItem>
              </Tooltip>
            </DropdownMenuRadioGroup>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="flex items-center justify-between">
            <a href="options.html" target="_blank" rel="noopener noreferrer">
              Settings
              <Settings2 className="ml-auto h-4 w-4" />
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// --- Call To Action ---
function CallToAction() {
  const [themeMode, setThemeMode] = useState<"system" | "light" | "dark">("system");

  // Get system theme detection function
  const getSystemThemePreference = (): boolean => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  // Function to apply theme based on preference
  const applyTheme = (mode: "system" | "light" | "dark", systemIsDark?: boolean) => {
    const isDark =
      mode === "dark" ||
      (mode === "system" && (systemIsDark !== undefined ? systemIsDark : getSystemThemePreference()));

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Load theme setting from preferences
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const preferences = await PriceDatabase.getPreferences();
        const savedTheme = preferences.themeMode || "system";
        setThemeMode(savedTheme as "system" | "light" | "dark");
      } catch (error) {
        console.error("Error loading theme preference:", error);
      }
    };

    loadThemePreference();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (themeMode === "system") {
        applyTheme("system", e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [themeMode]);

  // Handle theme change
  const handleThemeChange = async (newTheme: "system" | "light" | "dark") => {
    setThemeMode(newTheme);
    applyTheme(newTheme);

    try {
      await PriceDatabase.savePreferences({
        themeMode: newTheme,
        // Also update darkMode for backward compatibility
        darkMode: newTheme === "dark" || (newTheme === "system" && getSystemThemePreference()),
      });
      await browser.runtime.sendMessage({ action: "preferencesUpdated" });
      document.dispatchEvent(
        new CustomEvent(DISPLAY_MODE_CHANGE_EVENT, {
          detail: { themeMode: newTheme },
        }),
      );
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  return (
    <section className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <Button variant="primary" size="sm" asChild>
          <a
            href="https://tftc.io/bitcoin-brief?utm_source=opportunity-cost-extension"
            target="_blank"
            rel="noopener noreferrer"
          >
            Subscribe to Bitcoin Brief
          </a>
        </Button>

        {/* Theme Selector */}
        <div className="flex gap-1">
          <button
            onClick={() => handleThemeChange("light")}
            className={`rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 ${themeMode === "light" ? "bg-gray-200 dark:bg-gray-700" : ""}`}
            title="Light Mode"
          >
            <Sun className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleThemeChange("system")}
            className={`rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 ${themeMode === "system" ? "bg-gray-200 dark:bg-gray-700" : ""}`}
            title="System Default"
          >
            <Monitor className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleThemeChange("dark")}
            className={`rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 ${themeMode === "dark" ? "bg-gray-200 dark:bg-gray-700" : ""}`}
            title="Dark Mode"
          >
            <Moon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

// --- Footer ---
function Footer({
  isSiteEnabled,
  onToggle,
  hostname,
}: {
  isSiteEnabled: boolean | null;
  onToggle: () => void;
  hostname: string;
}) {
  return (
    <footer className="flex items-center justify-between text-left text-xs text-gray-400 dark:text-gray-500">
      <div className="flex items-center gap-x-2">
        {hostname && (
          <>
            {isSiteEnabled !== null && (
              <Switch id="extension-enabled" checked={isSiteEnabled} onCheckedChange={onToggle} />
            )}
            <label htmlFor="extension-enabled" className="cursor-pointer text-xs">
              {isSiteEnabled ? "Enabled" : "Disabled"} on this site
            </label>
          </>
        )}
      </div>
      <div className="flex flex-col">
        <span>
          <a
            href="https://www.opportunitycost.app/privacy-policy?utm_source=opportunity-cost-extension"
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
        </span>
      </div>
    </footer>
  );
}

// --- Main IndexPage ---
export function IndexPage() {
  const [isSiteEnabled, setIsSiteEnabled] = useState<boolean | null>(null);
  const [hostname, setHostname] = useState("");
  const [showSaylorAnimation, setShowSaylorAnimation] = useState(false);

  const toggleCurrentSite = async () => {
    if (!hostname) return;
    await browser.runtime.sendMessage({ action: "toggleSiteDisabled", site: hostname });
    // After toggling, update the state
    setIsSiteEnabled((prev) => !prev);
  };

  // Handle Saylor Mode animation
  useEffect(() => {
    const handleSaylorModeActivated = () => {
      setShowSaylorAnimation(true);
    };

    document.addEventListener(SAYLOR_MODE_ACTIVATED_EVENT, handleSaylorModeActivated);

    return () => {
      document.removeEventListener(SAYLOR_MODE_ACTIVATED_EVENT, handleSaylorModeActivated);
    };
  }, []);

  // Initialize theme from preferences when popup opens
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const initializeTheme = async () => {
      try {
        const preferences = await PriceDatabase.getPreferences();
        const themeMode = preferences.themeMode || "system";
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        // Apply theme based on preference
        const isDark = themeMode === "dark" || (themeMode === "system" && systemPrefersDark);

        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }

        // Add listener for system theme changes if set to system
        if (themeMode === "system") {
          const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

          const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (e.matches) {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
          };

          mediaQuery.addEventListener("change", handleSystemThemeChange);

          // Store cleanup function
          cleanup = () => {
            mediaQuery.removeEventListener("change", handleSystemThemeChange);
          };
        }
      } catch (error) {
        console.error("Error initializing theme:", error);
      }
    };

    // Apply theme immediately when popup opens
    initializeTheme();

    // Return cleanup function
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  // Listen for theme change events from the theme buttons
  useEffect(() => {
    const handleDisplayChange = (event: CustomEvent) => {
      if (event.detail?.themeMode) {
        const themeMode = event.detail.themeMode;
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        // Apply the new theme
        const isDark = themeMode === "dark" || (themeMode === "system" && systemPrefersDark);

        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }

        // Update system theme change listener
        if (themeMode === "system") {
          const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

          const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (e.matches) {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
          };

          // Remove existing listeners first to avoid duplicates
          mediaQuery.removeEventListener("change", handleSystemThemeChange);
          mediaQuery.addEventListener("change", handleSystemThemeChange);
        }
      }
    };

    const loadPreferencesAndTab = async () => {
      // Get current tab info
      const response = await browser.runtime.sendMessage({ action: "getCurrentTab" });
      if (response?.tab?.url) {
        try {
          const url = new URL(response.tab.url);
          const currentHostname = url.hostname;
          setHostname(currentHostname);

          // Load preferences to check if this site is disabled
          PriceDatabase.getPreferences().then((prefs) => {
            const disabledSites = prefs.disabledSites || [];
            setIsSiteEnabled(!disabledSites.includes(currentHostname));
          });
        } catch (error) {
          // Invalid URL, maybe about:blank or something similar
          console.error("Error parsing URL for site toggle:", error);
          setHostname("");
        }
      } else {
        setHostname("");
      }
    };

    loadPreferencesAndTab();

    document.addEventListener(DISPLAY_MODE_CHANGE_EVENT, handleDisplayChange as EventListener);

    return () => {
      document.removeEventListener(DISPLAY_MODE_CHANGE_EVENT, handleDisplayChange as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen w-80 bg-white p-4 font-sans dark:bg-gray-900 dark:text-white">
      <Header />
      <LivePrice />
      <Converter />
      <CallToAction />
      <Footer isSiteEnabled={isSiteEnabled} onToggle={toggleCurrentSite} hostname={hostname} />
      <SaylorModeOverlay
        isActive={showSaylorAnimation}
        onComplete={() => {
          setShowSaylorAnimation(false);
          // Dispatch event to reopen settings dropdown
          document.dispatchEvent(new CustomEvent(SAYLOR_MODE_COMPLETE_EVENT));
        }}
      />
    </div>
  );
}
