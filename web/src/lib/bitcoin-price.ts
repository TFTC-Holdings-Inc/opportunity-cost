export const SUPPORTED_CURRENCIES = [
  "usd",
  "eur",
  "gbp",
  "jpy",
  "cny",
  "inr",
  "cad",
  "aud",
  "chf",
  "sgd",
  "mxn",
  "ars",
  "php",
  "vnd",
  "idr",
  "brl",
  "clp",
  "zar",
  "rub",
  "krw",
  "hkd",
  "twd",
  "huf",
  "dkk",
  "nzd",
  "try",
  "pln",
  "czk",
  "sek",
  "nok",
] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];
export type BitcoinPrices = Record<SupportedCurrency, number>;
export interface BitcoinPriceResponse {
  bitcoin: BitcoinPrices;
}

const MIN_PLAUSIBLE_PRICE = 100;
const MAX_PLAUSIBLE_PRICE = 1_000_000_000_000_000;
const MAX_ONE_HOUR_CHANGE_RATIO = 2;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseCoinGeckoResponse(
  value: unknown,
): BitcoinPriceResponse | null {
  if (!isObject(value) || !isObject(value.bitcoin)) {
    return null;
  }

  const receivedCurrencies = Object.keys(value.bitcoin);
  if (receivedCurrencies.length !== SUPPORTED_CURRENCIES.length) {
    return null;
  }

  const prices: Partial<BitcoinPrices> = {};
  for (const currency of SUPPORTED_CURRENCIES) {
    const price = value.bitcoin[currency];
    if (
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < MIN_PLAUSIBLE_PRICE ||
      price > MAX_PLAUSIBLE_PRICE
    ) {
      return null;
    }
    prices[currency] = price;
  }

  return { bitcoin: prices as BitcoinPrices };
}

export function isPlausiblePriceChange(
  previous: BitcoinPriceResponse,
  next: BitcoinPriceResponse,
): boolean {
  return SUPPORTED_CURRENCIES.every((currency) => {
    const ratio = next.bitcoin[currency] / previous.bitcoin[currency];
    return (
      ratio >= 1 / MAX_ONE_HOUR_CHANGE_RATIO &&
      ratio <= MAX_ONE_HOUR_CHANGE_RATIO
    );
  });
}
