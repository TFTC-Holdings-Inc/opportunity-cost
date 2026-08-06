import { describe, expect, it } from "vitest";
import { SUPPORTED_CURRENCIES } from "./constants";
import { parseBitcoinPriceResponse } from "./price-validation";

function validResponse(): { bitcoin: Record<string, unknown> } {
  return {
    bitcoin: Object.fromEntries(SUPPORTED_CURRENCIES.map((currency, index) => [currency.value, 10_000 + index])),
  };
}

describe("parseBitcoinPriceResponse", () => {
  it("accepts a complete positive finite price snapshot", () => {
    expect(parseBitcoinPriceResponse(validResponse())).toEqual(validResponse().bitcoin);
  });

  it("rejects missing or unexpected currencies", () => {
    const missing = validResponse();
    delete missing.bitcoin.usd;
    expect(parseBitcoinPriceResponse(missing)).toBeNull();

    const extra = validResponse();
    extra.bitcoin.btc = 1;
    expect(parseBitcoinPriceResponse(extra)).toBeNull();
  });

  it.each([0, 99, -1, 1_000_000_000_000_001, Number.NaN, Number.POSITIVE_INFINITY, "100000"])(
    "rejects an invalid price value: %s",
    (price) => {
      const response = validResponse();
      response.bitcoin.usd = price;
      expect(parseBitcoinPriceResponse(response)).toBeNull();
    },
  );
});
