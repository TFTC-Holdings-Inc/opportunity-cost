"use client";

import { Button } from "../ui/button";
import { ArrowRightIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import Image from "next/image";
import Link from "next/link";

interface SaylorHeroProps {
  currentBtcPrice: number;
  growthFactor: number;
}

export function SaylorHero({ growthFactor }: SaylorHeroProps) {
  const currentYear = new Date().getFullYear();
  const targetYear = 2046;
  const yearsRemaining = targetYear - currentYear;

  return (
    <section className="pt-40 pb-20 border-b border-border relative overflow-hidden bg-gradient-to-br from-background to-oc-primary/10 dark:from-background dark:to-oc-primary/15">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute opacity-10 inset-0 bg-[linear-gradient(0deg,transparent_49.5%,#f08a5d_49.5%,#f08a5d_50.5%,transparent_50.5%)] bg-[length:100%_100px]"></div>
        <div className="absolute opacity-10 inset-0 bg-[linear-gradient(90deg,transparent_49.5%,#f08a5d_49.5%,#f08a5d_50.5%,transparent_50.5%)] bg-[length:100px_100%]"></div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/50 to-transparent"></div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-sm font-medium bg-oc-primary/10 dark:bg-oc-primary/20 text-oc-primary rounded-full mb-4">
                Saylor Mode
              </span>
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                What if Bitcoin hits{" "}
                <span className="text-oc-primary">$21 Million</span>?
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Michael Saylor&apos;s bold {yearsRemaining}-year prediction
                becomes your reality check.
                <br />
                <span className="font-medium">
                  See what every price would cost in tomorrow&apos;s world.
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                variant="primary"
                size="lg"
                className="font-medium text-lg px-8"
              >
                <Link href="#download">
                  Try Saylor Mode <ArrowRightIcon className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-medium text-lg px-8"
              >
                <a href="#features">Learn How It Works</a>
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center lg:justify-start gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-oc-primary">$21M</div>
                <div className="text-sm text-muted-foreground">
                  Target Price
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-oc-primary">
                  {yearsRemaining}
                </div>
                <div className="text-sm text-muted-foreground">Years</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-oc-primary">
                  {growthFactor}x
                </div>
                <div className="text-sm text-muted-foreground">Growth</div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-oc-primary/20 to-oc-primary/30 rounded-full blur-3xl scale-110"></div>
              <Image
                src="/images/enhanced_saylor.png"
                alt="Michael Saylor - Bitcoin visionary"
                width={500}
                height={500}
                className="relative z-10 max-w-80 rounded-lg shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
