import * as React from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";

const HISTORICAL_BTC_PRICES: Record<string, number> = {
  "1y": 27_000,
  "5y": 9_000,
  "10y": 600,
};

const DEFAULT_FUTURE_PRICE = 1_000_000;
const SATS_IN_BTC = 100_000_000;

interface BitcoinTimeMachineProps {
  fiatValue: number;
  satsValue: number;
  className?: string;
}

const formatFiat = (val: number): string =>
  `$${val.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: val >= 100 ? 0 : 2,
  })}`;

const formatBitcoinValue = (sats: number): string => {
  const btc = sats / SATS_IN_BTC;
  if (btc >= 100) return `${btc.toLocaleString(undefined, { maximumFractionDigits: 0 })} BTC`;
  if (btc < 0.01) {
    const abbrev = (value: number): string => {
      if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
      if (value >= 1e3) return `${(value / 1e3).toFixed(1)}k`;
      return value.toLocaleString();
    };
    return `${abbrev(sats)} sats`;
  }
  return `${btc.toLocaleString(undefined, { maximumFractionDigits: 2 })} BTC`;
};

const formatCompactFiat = (val: number): string => {
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
  if (val >= 1e3) return `$${(val / 1e3).toFixed(0)}K`;
  return formatFiat(val);
};

export function BitcoinTimeMachine({ fiatValue, satsValue, className }: BitcoinTimeMachineProps) {
  const [futurePrice, setFuturePrice] = React.useState<number>(DEFAULT_FUTURE_PRICE);
  const [isOpen, setIsOpen] = React.useState(false);
  const btcAmountCurrent = satsValue / SATS_IN_BTC;

  const historicalData = React.useMemo(
    () => [
      {
        period: "1y",
        label: "1 year ago",
        icon: "📅",
        price: HISTORICAL_BTC_PRICES["1y"],
        btcAmt: (fiatValue / HISTORICAL_BTC_PRICES["1y"]) * SATS_IN_BTC,
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-50 dark:bg-amber-950/20",
      },
      {
        period: "5y",
        label: "5 years ago",
        icon: "🗓️",
        price: HISTORICAL_BTC_PRICES["5y"],
        btcAmt: (fiatValue / HISTORICAL_BTC_PRICES["5y"]) * SATS_IN_BTC,
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-50 dark:bg-orange-950/20",
      },
      {
        period: "10y",
        label: "10 years ago",
        icon: "📜",
        price: HISTORICAL_BTC_PRICES["10y"],
        btcAmt: (fiatValue / HISTORICAL_BTC_PRICES["10y"]) * SATS_IN_BTC,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-950/20",
      },
    ],
    [fiatValue],
  );

  const futureFiat = btcAmountCurrent * futurePrice;
  const futureMultiplier = futurePrice / 50000; // Assuming current ~$50k BTC

  const presetPrices = [100_000, 500_000, 1_000_000, 5_000_000];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          title="Bitcoin Time Machine - See historical & future value"
          className={cn(
            "ml-1 h-6 w-6 p-0 text-xs transition-all duration-200 hover:scale-110 hover:bg-orange-100 dark:hover:bg-orange-900/20",
            isOpen && "bg-orange-100 dark:bg-orange-900/20",
            className,
          )}
        >
          🕒
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 shadow-xl" align="start">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white">
          <div className="flex items-center gap-2">
            <span className="text-lg">🕒</span>
            <h3 className="text-lg font-bold">Bitcoin Time Machine</h3>
          </div>
          <p className="mt-1 text-sm text-orange-100">
            See what this {formatFiat(fiatValue)} item cost in Bitcoin over time
          </p>
        </div>

        <div className="space-y-6 p-4">
          {/* Historical Section */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-lg">📈</span>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Historical Cost</h4>
            </div>

            <div className="space-y-3">
              {historicalData.map((item) => (
                <div
                  key={item.period}
                  className={cn("rounded-lg p-3 transition-all duration-200 hover:scale-[1.02]", item.bgColor)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">BTC @ {formatFiat(item.price)}</div>
                      </div>
                    </div>
                    <div className={cn("text-right font-bold", item.color)}>
                      {formatBitcoinValue(Math.round(item.btcAmt))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Future Section */}
          <div className="border-t pt-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-lg">🚀</span>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Future Projection</h4>
            </div>

            {/* Preset Buttons */}
            <div className="mb-4 grid grid-cols-2 gap-2">
              {presetPrices.map((price) => (
                <Button
                  key={price}
                  variant={futurePrice === price ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFuturePrice(price)}
                  className="h-8 text-xs"
                >
                  {formatCompactFiat(price)}
                </Button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label htmlFor="future-btc-price" className="min-w-0 text-sm text-gray-600 dark:text-gray-400">
                  Custom BTC price:
                </label>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">$</span>
                  <input
                    id="future-btc-price"
                    type="number"
                    value={futurePrice}
                    onChange={(e) => setFuturePrice(Number(e.target.value) || 0)}
                    className="w-full rounded-lg border py-2 pl-6 pr-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter price..."
                  />
                </div>
              </div>

              {/* Result Card */}
              <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:border-blue-800 dark:from-blue-950/20 dark:to-indigo-950/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatBitcoinValue(satsValue)} could be worth:
                    </div>
                    {futureMultiplier > 1 && (
                      <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                        {futureMultiplier.toFixed(1)}x current value! 🎯
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {formatCompactFiat(futureFiat)}
                    </div>
                    {futureFiat >= 1000 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">{formatFiat(futureFiat)}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
