import { NextResponse } from "next/server";
import {
  isPlausiblePriceChange,
  parseCoinGeckoResponse,
  SUPPORTED_CURRENCIES,
  type BitcoinPriceResponse,
} from "@/lib/bitcoin-price";

type ErrorResponse = {
  error: string;
};

const CACHE_DURATION = 5 * 60 * 1000;
const MAX_STALE_DURATION = 60 * 60 * 1000;
const UPSTREAM_TIMEOUT = 8_000;

let lastKnownGood: { data: BitcoinPriceResponse; timestamp: number } | null =
  null;

export const dynamic = "force-dynamic";

function priceResponse(
  data: BitcoinPriceResponse,
  cacheStatus: "fresh" | "hit" | "stale",
): NextResponse<BitcoinPriceResponse> {
  const headers = new Headers({
    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    "X-Content-Type-Options": "nosniff",
    "X-Price-Cache": cacheStatus,
  });
  if (cacheStatus === "stale") {
    headers.set("Warning", '110 - "Response is stale"');
  }

  return NextResponse.json(data, { headers });
}

function staleResponse(now: number): NextResponse<BitcoinPriceResponse> | null {
  if (lastKnownGood && now - lastKnownGood.timestamp < MAX_STALE_DURATION) {
    return priceResponse(lastKnownGood.data, "stale");
  }
  return null;
}

export async function GET(): Promise<
  NextResponse<BitcoinPriceResponse | ErrorResponse>
> {
  const now = Date.now();
  if (lastKnownGood && now - lastKnownGood.timestamp < CACHE_DURATION) {
    return priceResponse(lastKnownGood.data, "hit");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT);

  try {
    const currencies = SUPPORTED_CURRENCIES.join(",");
    const apiUrl =
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=" +
      currencies;
    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      return (
        staleResponse(now) ??
        NextResponse.json(
          { error: "Bitcoin price provider is unavailable" },
          { status: 502 },
        )
      );
    }

    const data = parseCoinGeckoResponse(await response.json());
    if (!data) {
      return (
        staleResponse(now) ??
        NextResponse.json(
          { error: "Bitcoin price provider returned invalid data" },
          { status: 502 },
        )
      );
    }

    if (
      lastKnownGood &&
      now - lastKnownGood.timestamp < MAX_STALE_DURATION &&
      !isPlausiblePriceChange(lastKnownGood.data, data)
    ) {
      return priceResponse(lastKnownGood.data, "stale");
    }

    lastKnownGood = { data, timestamp: now };
    return priceResponse(data, "fresh");
  } catch {
    return (
      staleResponse(now) ??
      NextResponse.json(
        { error: "Bitcoin price provider request failed" },
        { status: 502 },
      )
    );
  } finally {
    clearTimeout(timeout);
  }
}
