"use client";

import { Container } from "@/components/ui/container";
import { formatPrice } from "@/lib/utils";
import { CalendarIcon, TrendingUpIcon, TargetIcon } from "lucide-react";

interface SaylorPredictionProps {
  currentBtcPrice: number;
  growthFactor: number;
}

export function SaylorPrediction({
  currentBtcPrice,
  growthFactor,
}: SaylorPredictionProps) {
  const currentYear = new Date().getFullYear();
  const targetYear = 2046;
  const yearsRemaining = targetYear - currentYear;
  const midpointYear = currentYear + Math.floor(yearsRemaining / 2);
  const midpointPrice = 21_000_000 / 2;

  return (
    <section className="py-20 bg-muted/30 relative">
      <Container className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            The <span className="text-oc-primary">21/21</span> Prediction
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            At BTC Prague 2025, Michael Saylor boldly predicted Bitcoin would
            reach $21 million per coin within 21 years. What would that world
            look like?
          </p>
        </div>

        {/* Main prediction display */}
        <div className="bg-gradient-to-br from-oc-primary to-oc-primary/80 rounded-3xl p-8 lg:p-12 text-white text-center mb-16 shadow-2xl">
          <div className="mb-6">
            <div className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-4">
              $21,000,000
            </div>
            <div className="text-2xl lg:text-3xl opacity-90">per Bitcoin</div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-2 sm:gap-8 text-lg">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-6 h-6" />
              <span>{yearsRemaining} years from now</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUpIcon className="w-6 h-6" />
              <span>~{growthFactor}x growth</span>
            </div>
            <div className="flex items-center gap-2">
              <TargetIcon className="w-6 h-6" />
              <span>Saylor&apos;s target</span>
            </div>
          </div>
        </div>

        {/* Timeline visualization */}
        <div className="bg-card rounded-2xl p-8 border border-border">
          <h3 className="text-2xl font-bold text-center mb-8">
            Journey to $21 Million
          </h3>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-oc-primary to-oc-primary/80 h-full rounded-full"></div>

            <div className="space-y-12">
              {/* Current point */}
              <div className="flex items-center">
                <div className="w-1/2 text-right pr-8">
                  <div className="text-xl font-bold">Today</div>
                  <div className="text-muted-foreground">
                    {formatPrice(currentBtcPrice)}
                  </div>
                </div>
                <div className="relative z-10 w-4 h-4 bg-oc-primary rounded-full border-4 border-background"></div>
                <div className="w-1/2 pl-8">
                  <div className="text-sm text-muted-foreground">
                    Starting point
                  </div>
                </div>
              </div>

              {/* Midpoint */}
              <div className="flex items-center">
                <div className="w-1/2 text-right pr-8">
                  <div className="text-xl font-bold">~{midpointYear}</div>
                  <div className="text-muted-foreground">
                    {formatPrice(midpointPrice)}
                  </div>
                </div>
                <div className="relative z-10 w-4 h-4 bg-oc-primary/80 rounded-full border-4 border-background"></div>
                <div className="w-1/2 pl-8">
                  <div className="text-sm text-muted-foreground">
                    Halfway there
                  </div>
                </div>
              </div>

              {/* Target point */}
              <div className="flex items-center">
                <div className="w-1/2 text-right pr-8">
                  <div className="text-xl font-bold">{targetYear}</div>
                  <div className="text-muted-foreground">$21 Million</div>
                </div>
                <div className="relative z-10 w-6 h-6 bg-oc-primary rounded-full border-4 border-background shadow-lg"></div>
                <div className="w-1/2 pl-8">
                  <div className="text-sm text-muted-foreground font-medium">
                    Saylor&apos;s target
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="text-center mt-16">
          <blockquote className="text-2xl lg:text-3xl font-medium text-foreground mb-4 italic">
            &ldquo;I think we&apos;re going to be $21 million in 21 years&rdquo;
          </blockquote>
          <cite className="text-lg text-muted-foreground">
            — Michael Saylor, BTC Prague 2025
          </cite>
        </div>
      </Container>
    </section>
  );
}
