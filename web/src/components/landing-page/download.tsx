"use client";

import { Button } from "../ui/button";
import { Container } from "@/components/ui/container";
import Image from "next/image";

export function Download() {
  return (
    <section id="download" className="text-center py-20">
      <Container>
        <h2 className="text-3xl font-bold mb-2">Download the Extension</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Opportunity Cost is available for Chrome browsers. Firefox coming
          soon! Install it today to start seeing prices in Bitcoin!
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-16">
          <div
            id="chrome"
            className="bg-card rounded-lg p-6 shadow-sm border border-border transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col items-center w-full md:w-[300px]"
          >
            <Image
              src="/images/icons/chrome.svg"
              alt="Chrome"
              width={64}
              height={64}
              className="mb-4"
            />
            <h3 className="text-xl font-bold mb-2">Chrome Extension</h3>
            <p className="mb-4 text-muted-foreground">Version 1.0.0</p>
            <Button
              asChild
              variant="primary"
              size="lg"
              className="font-medium text-md"
            >
              <a href="https://chrome.google.com/webstore/detail/opportunity-cost/">
                Add to Chrome
              </a>
            </Button>
          </div>
          <div
            id="firefox"
            className="bg-accent rounded-lg p-6 shadow-sm border border-border transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col items-center w-full md:w-[300px]"
          >
            <Image
              src="/images/icons/firefox.svg"
              alt="Firefox"
              width={64}
              height={64}
              className="mb-4"
            />
            <h3 className="text-xl font-bold mb-2">Firefox Add-on</h3>
            <p className="mb-4 text-muted-foreground">Coming Soon</p>
            <Button
              disabled
              variant="primary"
              size="lg"
              className="font-medium text-md opacity-50 cursor-not-allowed"
            >
              Add to Firefox
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
