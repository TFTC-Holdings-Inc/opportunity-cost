import { SUPPORTED_CURRENCIES } from "./constants";

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]["value"];
export type BitcoinPrices = Record<SupportedCurrency, number>;

const MIN_PLAUSIBLE_PRICE = 100;
const MAX_PLAUSIBLE_PRICE = 1_000_000_000_000_000;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseBitcoinPriceResponse(value: unknown): BitcoinPrices | null {
  if (!isObject(value) || !isObject(value.bitcoin)) {
    return null;
  }

  const expectedCurrencies = SUPPORTED_CURRENCIES.map((currency) => currency.value);
  const receivedCurrencies = Object.keys(value.bitcoin);
  if (receivedCurrencies.length !== expectedCurrencies.length) {
    return null;
  }

  const prices: Partial<BitcoinPrices> = {};
  for (const currency of expectedCurrencies) {
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

  return prices as BitcoinPrices;
}
