import { describe, expect, it } from "vitest";
import {
  isPlausiblePriceChange,
  parseCoinGeckoResponse,
  SUPPORTED_CURRENCIES,
} from "./bitcoin-price";

function validResponse(): { bitcoin: Record<string, unknown> } {
  return {
    bitcoin: Object.fromEntries(
      SUPPORTED_CURRENCIES.map((currency, index) => [currency, 10_000 + index]),
    ),
  };
}

describe("parseCoinGeckoResponse", () => {
  it("accepts a complete positive finite price snapshot", () => {
    expect(parseCoinGeckoResponse(validResponse())).toEqual(validResponse());
  });

  it("rejects missing or unexpected currencies", () => {
    const missing = validResponse();
    delete missing.bitcoin.usd;
    expect(parseCoinGeckoResponse(missing)).toBeNull();

    const extra = validResponse();
    extra.bitcoin.btc = 1;
    expect(parseCoinGeckoResponse(extra)).toBeNull();
  });

  it.each([
    0,
    99,
    -1,
    1_000_000_000_000_001,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    "100000",
  ])("rejects an invalid price value: %s", (price) => {
    const response = validResponse();
    response.bitcoin.usd = price;
    expect(parseCoinGeckoResponse(response)).toBeNull();
  });

  it("rejects an abrupt price change against a recent trusted snapshot", () => {
    const previous = parseCoinGeckoResponse(validResponse());
    const changed = validResponse();
    changed.bitcoin.usd = 30_000;
    const next = parseCoinGeckoResponse(changed);

    expect(previous).not.toBeNull();
    expect(next).not.toBeNull();
    expect(isPlausiblePriceChange(previous!, next!)).toBe(false);
  });
});
