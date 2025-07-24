"use client";

import { Container } from "@/components/ui/container";
import { Button } from "../ui/button";
import {
  ArrowRightIcon,
  DownloadIcon,
  SettingsIcon,
  EyeIcon,
} from "lucide-react";
import Link from "next/link";

export function SaylorCTA() {
  return (
    <section
      id="download"
      className="py-20 bg-gradient-to-br from-oc-primary to-oc-primary/80 text-white relative overflow-hidden"
    >
      {/* Background patterns */}
      <div className="absolute inset-0">
        <div className="absolute opacity-10 inset-0 bg-[linear-gradient(0deg,transparent_49.5%,#ffffff_49.5%,#ffffff_50.5%,transparent_50.5%)] bg-[length:100%_100px]"></div>
        <div className="absolute opacity-10 inset-0 bg-[linear-gradient(90deg,transparent_49.5%,#ffffff_49.5%,#ffffff_50.5%,transparent_50.5%)] bg-[length:100px_100%]"></div>
      </div>

      <Container className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to See the Future?
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Join thousands of Bitcoiners who are already living in
            tomorrow&apos;s world. Download the Opportunity Cost extension and
            enable Saylor Mode today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="font-medium text-lg px-8 bg-white text-oc-primary hover:bg-gray-100"
            >
              <Link href="/#download">
                <DownloadIcon className="w-5 h-5 mr-2" />
                Install Extension
              </Link>
            </Button>
          </div>
        </div>

        {/* Setup instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">
            Quick Setup Guide
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DownloadIcon className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-lg mb-2">1. Install Extension</h4>
              <p className="opacity-90">
                Download from Chrome Web Store or Firefox Add-ons
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <SettingsIcon className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-lg mb-2">2. Enable Saylor Mode</h4>
              <p className="opacity-90">
                Click the extension icon and toggle Saylor Mode on
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <EyeIcon className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-lg mb-2">3. See the Future</h4>
              <p className="opacity-90">
                Browse any site and watch prices transform
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Don&apos;t Just Dream About Bitcoin&apos;s Future
          </h3>
          <p className="text-lg opacity-90 mb-8">
            Experience it every day with Saylor Mode
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="font-medium text-lg px-8 bg-white text-oc-primary hover:bg-gray-100"
            >
              <Link href="/#download">
                Get Started Now <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="font-medium text-lg px-8 border-white bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/">Back to Main Site</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
