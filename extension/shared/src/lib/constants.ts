export const APP_URL = "https://www.opportunitycost.app";
export const API_BASE = "https://www.opportunitycost.app/api/bitcoin-price";

export const DEFAULT_REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minute cache duration for aggressive caching
export const INITIAL_BACKOFF = 2000; // Initial backoff duration in ms (2 seconds)
export const MAX_BACKOFF = 5 * 60 * 1000; // Maximum backoff duration (5 minutes)
export const MAX_RETRIES = 5; // Maximum number of retry attempts

export const SUPPORTED_CURRENCIES = [
  { name: "US Dollar", value: "usd", symbol: "$" },
  { name: "Euro", value: "eur", symbol: "€" },
  { name: "British Pound", value: "gbp", symbol: "£" },
  { name: "Japanese Yen", value: "jpy", symbol: "¥" },
  { name: "Chinese Yuan", value: "cny", symbol: "¥" },
  { name: "Canadian Dollar", value: "cad", symbol: "$" },
  { name: "Argentine Peso", value: "ars", symbol: "$" },
  { name: "Australian Dollar", value: "aud", symbol: "$" },
  { name: "Brazilian Real", value: "brl", symbol: "R$" },
  { name: "Chilean Peso", value: "clp", symbol: "$" },
  { name: "Czech Koruna", value: "czk", symbol: "Kč" },
  { name: "Danish Krone", value: "dkk", symbol: "kr" },
  { name: "Hungarian Forint", value: "huf", symbol: "Ft" },
  { name: "Hong Kong Dollar", value: "hkd", symbol: "$" },
  { name: "Indian Rupee", value: "inr", symbol: "₹" },
  { name: "Indonesian Rupiah", value: "idr", symbol: "Rp" },
  { name: "Mexican Peso", value: "mxn", symbol: "$" },
  { name: "New Taiwan Dollar", value: "twd", symbol: "$" },
  { name: "New Zealand Dollar", value: "nzd", symbol: "$" },
  { name: "Norwegian Krone", value: "nok", symbol: "kr" },
  { name: "Philippine Peso", value: "php", symbol: "₱" },
  { name: "Polish Złoty", value: "pln", symbol: "zł" },
  { name: "Russian Ruble", value: "rub", symbol: "₽" },
  { name: "Singapore Dollar", value: "sgd", symbol: "$" },
  { name: "South African Rand", value: "zar", symbol: "R" },
  { name: "South Korean Won", value: "krw", symbol: "₩" },
  { name: "Swedish Krona", value: "sek", symbol: "kr" },
  { name: "Swiss Franc", value: "chf", symbol: "₣" },
  { name: "Turkish Lira", value: "try", symbol: "₺" },
  { name: "Vietnamese Dong", value: "vnd", symbol: "₫" },
  { name: "Malaysian Ringgit", value: "myr", symbol: "RM" },
];

export const DEFAULT_CURRENCY = "usd";

export const SAYLOR_TARGET_PRICE = 21000000; // Saylor Mode target price for Bitcoin ($21M USD)
