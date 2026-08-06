import React from "react";
import { Header } from "@/components/landing-page/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for the Opportunity Cost website and browser extension",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto mt-20 max-w-2xl bg-white px-4 py-16 text-gray-900">
        <h1 className="mb-2 text-3xl font-bold">Privacy Policy</h1>
        <p className="mb-6 text-sm text-gray-500">
          Last Updated: August 6, 2026
        </p>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Our Privacy Commitment</h2>
          <p>
            Opportunity Cost does not collect page contents, browsing history,
            converted prices, account credentials, or personal information
            through the browser extension. Price conversion happens on your
            device. This policy also explains the limited network and website
            analytics data that service providers process.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            Data Stored On Your Device
          </h2>
          <p>
            The extension stores only the data needed to provide its features:
          </p>
          <ul className="mb-2 ml-6 list-disc">
            <li>
              Currency, display, denomination, highlight, Saylor Mode, and theme
              settings
            </li>
            <li>Hostnames you choose to add to the disabled-sites list</li>
            <li>
              One cached Bitcoin price snapshot and the time it was received
            </li>
          </ul>
          <p>
            The cached snapshot replaces the previous snapshot. The extension
            does not keep price history, conversion counts, visited-page URLs,
            or page text.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            Extension Network Requests
          </h2>
          <p>
            When an extension feature needs a fresh Bitcoin price, it requests
            data from <code>www.opportunitycost.xyz</code>. Prices are cached
            locally for five minutes, and the extension does not poll on a fixed
            schedule. The request has no page URL, converted price, user
            identifier, or request body.
          </p>
          <p className="mt-2">
            Like any HTTPS request, it makes standard connection data such as an
            IP address, user agent, request time, and requested API path
            available to our hosting provider. That data may reveal that the
            extension is in use. Hosting logs are governed by our service
            provider&apos;s retention and security practices.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Website Analytics</h2>
          <p>
            The Opportunity Cost website uses Vercel Web Analytics to understand
            aggregate website traffic and performance. Website analytics are
            separate from the extension. The extension does not include an
            analytics SDK and does not send conversion activity to Vercel
            Analytics.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            Your Local Data Controls
          </h2>
          <ul className="mb-2 ml-6 list-disc">
            <li>
              Review and edit settings and disabled-site hostnames on the
              extension Options page.
            </li>
            <li>
              Select <span className="font-semibold">Clear All Data</span> on
              the Options page to remove the cached price and reset local
              settings to their defaults.
            </li>
            <li>
              Uninstall the extension to remove its browser-managed local data.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy to reflect product or legal
            changes. Updates will be published here with a revised date.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Contact Us</h2>
          <p>Questions about this policy can be sent to:</p>
          <ul className="mb-2 ml-6 mt-2 list-disc">
            <li>Email: contact@opportunitycost.xyz</li>
            <li>Website: https://opportunitycost.xyz</li>
          </ul>
        </section>
      </main>
    </>
  );
}
