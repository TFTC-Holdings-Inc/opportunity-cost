"use client";

import { Container } from "@/components/ui/container";
import { formatPrice, calculateSaylorPrice } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";

interface SaylorFeaturesProps {
  currentBtcPrice: number;
  growthFactor: number;
}

export function SaylorFeatures({
  currentBtcPrice,
  growthFactor,
}: SaylorFeaturesProps) {
  const priceExamples = [
    {
      image: "/images/coffee.jpg",
      alt: "Steaming coffee cup",
      item: "Coffee",
      normalPrice: 5,
    },
    {
      image: "/images/laptop.jpg",
      alt: "Modern laptop on desk",
      item: "Laptop",
      normalPrice: 1000,
    },
    {
      image: "/images/car.webp",
      alt: "Luxury sports car",
      item: "Car",
      normalPrice: 30000,
    },
    {
      image: "/images/house.avif",
      alt: "Beautiful modern house",
      item: "House",
      normalPrice: 500000,
    },
  ];

  return (
    <section id="features" className="py-20 border-t border-border">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            What is <span className="text-oc-primary">Saylor Mode</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Saylor Mode shows you what prices would look like if Bitcoin reaches
            Saylor&apos;s $21 million target. Every price is multiplied by the
            growth factor, giving you a glimpse into tomorrow&apos;s purchasing
            power in Bitcoin.
          </p>
        </div>

        {/* Calculation explanation */}
        <div className="bg-card rounded-2xl p-8 border border-border mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">
            The Simple Math
          </h3>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 text-center">
            <div className="bg-background rounded-xl p-6 border border-border">
              <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Current Bitcoin Price
              </div>
              <div className="text-3xl font-bold text-foreground">
                {formatPrice(currentBtcPrice)}
              </div>
            </div>

            <ArrowRightIcon className="w-8 h-8 text-oc-primary" />

            <div className="bg-oc-primary/10 dark:bg-oc-primary/20 rounded-xl p-6 border border-oc-primary/20">
              <div className="text-lg text-muted-foreground mb-2">
                Saylor&apos;s Target
              </div>
              <div className="text-3xl font-bold text-oc-primary">
                $21,000,000
              </div>
            </div>

            <ArrowRightIcon className="w-8 h-8 text-oc-primary" />

            <div className="bg-background rounded-xl p-6 border border-border">
              <div className="text-lg text-muted-foreground mb-2">
                Growth Factor
              </div>
              <div className="text-3xl font-bold text-foreground">
                {growthFactor}x
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-lg text-muted-foreground">
              Every dollar today ={" "}
              <span className="font-bold text-oc-primary">${growthFactor}</span>{" "}
              in Saylor Mode
            </p>
          </div>
        </div>

        {/* Price examples grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {priceExamples.map((example, index) => {
            const saylorPrice = calculateSaylorPrice(
              example.normalPrice,
              growthFactor
            );
            return (
              <div
                key={index}
                className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 w-full mb-4">
                  <Image
                    src={example.image}
                    alt={example.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>

                <div className="p-6 pt-0">
                  <h4 className="text-lg font-bold text-foreground mb-4">
                    {example.item}
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Today:
                      </span>
                      <span className="font-bold text-foreground">
                        ${example.normalPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Saylor Mode:
                      </span>
                      <span className="font-bold text-oc-primary">
                        {formatPrice(saylorPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground text-center">
                      {growthFactor}x opportunity cost
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* How it works */}
        <div className="bg-oc-primary/10 dark:bg-oc-primary/20 rounded-2xl p-8 border border-oc-primary/20">
          <h3 className="text-2xl font-bold text-center mb-8">
            How Saylor Mode Works
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-oc-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h4 className="font-bold text-foreground mb-2">
                Install Extension
              </h4>
              <p className="text-muted-foreground">
                Add the Opportunity Cost extension to Chrome or Firefox
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-oc-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h4 className="font-bold text-foreground mb-2">
                Enable Saylor Mode
              </h4>
              <p className="text-muted-foreground">
                Toggle Saylor Mode in the extension settings
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-oc-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h4 className="font-bold text-foreground mb-2">See the Future</h4>
              <p className="text-muted-foreground">
                Watch prices transform as you browse the web
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
