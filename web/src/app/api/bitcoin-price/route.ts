import { NextResponse } from "next/server";

const SUPPORTED_CURRENCIES = [
  "usd", // US Dollar
  "eur", // Euro
  "gbp", // British Pound
  "jpy", // Japanese Yen
  "cny", // Chinese Yuan
  "inr", // Indian Rupee
  "cad", // Canadian Dollar
  "aud", // Australian Dollar
  "chf", // Swiss Franc
  "sgd", // Singapore Dollar
  "mxn", // Mexican Peso
  "ars", // Argentine Peso
  "php", // Philippine Peso
  "vnd", // Vietnamese Dong
  "idr", // Indonesian Rupiah
  "brl", // Brazilian Real
  "clp", // Chilean Peso
  "zar", // South African Rand
  "rub", // Russian Ruble
  "krw", // South Korean Won
  "hkd", // Hong Kong Dollar
  "twd", // New Taiwan Dollar
  "huf", // Hungarian Forint
  "dkk", // Danish Krone
  "nzd", // New Zealand Dollar
  "try", // Turkish Lira
  "pln", // Polish Złoty
  "czk", // Czech Koruna
  "sek", // Swedish Krona
  "nok", // Norwegian Krone
  "myr", // Malaysian Ringgit
] as const;

type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

type CoinGeckoResponse = {
  bitcoin: {
    [K in SupportedCurrency]: number;
  };
};

type ErrorResponse = {
  error: string;
};

type ApiResponse = CoinGeckoResponse | ErrorResponse;

export const dynamic = "force-static";
export const revalidate = 300; // 5 minutes

let cache: { data: CoinGeckoResponse; timestamp: number } | null = null;
const CACHE_DURATION = 300_000; // 5 minutes in ms

export async function GET(): Promise<NextResponse<ApiResponse>> {
  const now = Date.now();

  if (cache && now - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json(cache.data);
  }

  try {
    const currencies = SUPPORTED_CURRENCIES.join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currencies}`;
    const res = await fetch(url);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from CoinGecko" } as ErrorResponse,
        { status: 502 }
      );
    }

    const data = (await res.json()) as CoinGeckoResponse;
    cache = { data: { bitcoin: data.bitcoin }, timestamp: now };

    return NextResponse.json(cache.data);
  } catch {
    return NextResponse.json(
      { error: "Error fetching Bitcoin price" } as ErrorResponse,
      { status: 500 }
    );
  }
}
