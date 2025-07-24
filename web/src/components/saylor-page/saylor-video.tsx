"use client";

import { Container } from "@/components/ui/container";
import { Button } from "../ui/button";
import { PlayIcon, ExternalLinkIcon } from "lucide-react";

export function SaylorVideo() {
  return (
    <section className="py-20 bg-muted/30 border-t border-border">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            The Speech That Started It All
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Watch Michael Saylor&apos;s bold prediction at BTC Prague 2025 that
            inspired this feature. See the moment that changed how we think
            about Bitcoin&apos;s future.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* YouTube embed */}
          <div className="relative bg-card rounded-2xl border border-border overflow-hidden shadow-2xl">
            <div className="aspect-video">
              <iframe
                src="https://www.youtube.com/embed/GqjOaaAYbk8"
                title="Michael Saylor BTC Prague 2025 - $21 Million Bitcoin Prediction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <blockquote className="text-xl lg:text-2xl font-medium text-foreground mb-4 italic">
                  &quot;I think we&apos;re going to be $21 million in 21 years.
                  That&apos;s my number.&quot;
                </blockquote>
                <cite className="text-muted-foreground">
                  — Michael Saylor, BTC Prague 2025
                </cite>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  variant="primary"
                  size="lg"
                  className="font-medium"
                >
                  <a
                    href="https://www.youtube.com/watch?v=GqjOaaAYbk8"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PlayIcon className="w-5 h-5 mr-2" />
                    Watch Full Speech
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="font-medium"
                >
                  <a
                    href="https://btcprague.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLinkIcon className="w-5 h-5 mr-2" />
                    BTC Prague 2025
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Key quotes grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          <div className="bg-card rounded-xl p-6 border border-border">
            <blockquote className="text-lg font-medium text-foreground mb-4">
              &quot;Bitcoin is the most powerful asset in the universe.&quot;
            </blockquote>
            <cite className="text-sm text-muted-foreground">
              — Michael Saylor
            </cite>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <blockquote className="text-lg font-medium text-foreground mb-4">
              &quot;We&apos;re going to see exponential adoption over the next
              two decades.&quot;
            </blockquote>
            <cite className="text-sm text-muted-foreground">
              — Michael Saylor
            </cite>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <blockquote className="text-lg font-medium text-foreground mb-4">
              &quot;The question isn&apos;t if, but when Bitcoin becomes the
              global standard.&quot;
            </blockquote>
            <cite className="text-sm text-muted-foreground">
              — Michael Saylor
            </cite>
          </div>
        </div>

        {/* Timeline of Saylor's predictions */}
        <div className="bg-card rounded-2xl p-8 border border-border mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">
            Saylor&apos;s Track Record
          </h3>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="sm:w-24 text-sm font-medium text-muted-foreground">
                2020
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground mb-1">
                  MicroStrategy begins Bitcoin accumulation
                </div>
                <div className="text-sm text-muted-foreground">
                  Called Bitcoin &quot;digital gold&quot; when it was $10k
                </div>
              </div>
              <div className="text-green-600 font-medium">✓ Correct</div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="sm:w-24 text-sm font-medium text-muted-foreground">
                2021
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground mb-1">
                  Predicted $100k+ Bitcoin
                </div>
                <div className="text-sm text-muted-foreground">
                  When most thought it was a bubble
                </div>
              </div>
              <div className="text-green-600 font-medium">✓ Correct</div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="sm:w-24 text-sm font-medium text-muted-foreground">
                2025
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground mb-1">
                  $21 million in 21 years
                </div>
                <div className="text-sm text-muted-foreground">
                  The boldest prediction yet
                </div>
              </div>
              <div className="text-oc-primary font-medium">
                ⏳ Time will tell
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
