import React from "react";
import { Header } from "@/components/landing-page/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Opportunity Cost Browser Extension",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mt-20 mx-auto px-4 py-16 text-gray-900 bg-white">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-6">Last Updated: May 21, 2025</p>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Our Privacy Commitment</h2>
          <p>
            Opportunity Cost respects your privacy. Our browser extension
            operates entirely on your device and does not collect, transmit, or
            store any of your personal information or browsing history on our
            servers. This Privacy Policy explains how your data is handled when
            using our Extension.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            What Stays On Your Device
          </h2>
          <h3 className="font-semibold mt-4 mb-1">
            Local Settings & Preferences
          </h3>
          <ul className="list-disc ml-6 mb-2">
            <li>Currency preferences and display settings</li>
            <li>Theme settings (light, dark, or system)</li>
            <li>Bitcoin denomination preference (sats or BTC)</li>
            <li>User interface customizations</li>
          </ul>
          <h3 className="font-semibold mt-4 mb-1">Optional Local Statistics</h3>
          <ul className="list-disc ml-6 mb-2">
            <li>
              Domain names of sites where conversions occurred (if enabled)
            </li>
            <li>Count of price conversions (no price data is stored)</li>
            <li>Bitcoin price historical data (for your reference only)</li>
          </ul>
          <p className="mt-2 text-sm italic">
            All this information is stored exclusively on your device using
            browser storage mechanisms and is never transmitted to our servers.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            How The Extension Works
          </h2>
          <ul className="list-disc ml-6 mb-2">
            <li>
              <span className="font-semibold">Bitcoin Price Data:</span> The
              extension fetches current Bitcoin prices from our API. No personal
              data is sent during these requests.
            </li>
            <li>
              <span className="font-semibold">Page Processing:</span> All
              webpage scanning for prices happens entirely on your device and no
              content from websites you visit is ever sent to our servers.
            </li>
            <li>
              <span className="font-semibold">Local Storage:</span> The
              extension uses your browser&apos;s built-in storage APIs (Chrome
              Storage API, Firefox Storage API, or IndexedDB) to store settings
              and optional statistics.
            </li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Your Control Over Your Data
          </h2>
          <ul className="list-disc ml-6 mb-2">
            <li>
              <span className="font-semibold">View Local Data:</span> All stored
              information is visible in the extension&apos;s Options page
            </li>
            <li>
              <span className="font-semibold">Disable Statistics:</span> You can
              disable statistics gathering entirely in the extension settings
            </li>
            <li>
              <span className="font-semibold">Clear Data:</span> Use the
              &quot;Clear All Data&quot; button in the Options page to remove
              all locally stored information
            </li>
            <li>
              <span className="font-semibold">Uninstall:</span> Removing the
              extension will permanently delete all local data
            </li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy occasionally to reflect product
            improvements or legal requirements. Any changes will be posted on
            our website and in the extension&apos;s Options page, with an
            updated &quot;Last Updated&quot; date.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p>
            If you have questions about our privacy practices or this policy,
            please contact us:
          </p>
          <ul className="list-disc ml-6 mt-2 mb-2">
            <li>Email: contact@opportunitycost.app</li>
            <li>Website: https://opportunitycost.app</li>
          </ul>
        </section>
      </main>
    </>
  );
}
