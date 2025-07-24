import type { Metadata } from "next";
import { Header } from "@/components/landing-page/header";
import { Footer } from "@/components/landing-page/footer";
import { SaylorHero } from "@/components/saylor-page/saylor-hero";
import { SaylorPrediction } from "@/components/saylor-page/saylor-prediction";
import { SaylorFeatures } from "@/components/saylor-page/saylor-features";
import { SaylorVideo } from "@/components/saylor-page/saylor-video";
import { SaylorCTA } from "@/components/saylor-page/saylor-cta";

export const metadata: Metadata = {
  title: "Saylor Mode - Opportunity Cost Extension",
  description:
    "What if Bitcoin hits $21 million? Michael Saylor's 21-year prediction becomes your reality check. See prices in Saylor Mode with the Opportunity Cost extension.",
  keywords: [
    "Saylor Mode",
    "Michael Saylor",
    "Bitcoin $21 million",
    "BTC Prague",
    "Bitcoin prediction",
    "Opportunity Cost",
    "Browser Extension",
    "21 years",
  ],
  openGraph: {
    title: "Saylor Mode - What if Bitcoin hits $21 Million?",
    description:
      "Michael Saylor's 21-year prediction becomes your reality check. See what prices would be if Bitcoin reaches $21 million.",
    images: [
      {
        url: "/images/enhanced_saylor.png",
        width: 1200,
        height: 1200,
        alt: "Saylor Mode - Michael Saylor's Bitcoin Prediction",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saylor Mode - What if Bitcoin hits $21 Million?",
    description:
      "Michael Saylor's 21-year prediction becomes your reality check.",
    images: ["/images/enhanced_saylor.png"],
  },
};

async function getBitcoinPrice(): Promise<{
  price: number;
  growthFactor: number;
}> {
  try {
    const baseUrl = "https://opportunitycost.app";

    const response = await fetch(`${baseUrl}/api/bitcoin-price`, {
      next: { revalidate: 300 }, // 5 minutes
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Bitcoin price");
    }

    const data = await response.json();
    const currentPrice = data.bitcoin.usd;
    const targetPrice = 21_000_000;
    const growthFactor = Math.round(targetPrice / currentPrice);

    return { price: currentPrice, growthFactor };
  } catch (error) {
    console.error("Error fetching Bitcoin price:", error);
    // Fallback values
    return { price: 100_000, growthFactor: 210 };
  }
}

export default async function SaylorPage() {
  const { price: currentBtcPrice, growthFactor } = await getBitcoinPrice();

  return (
    <div data-opp-cost-disabled="true">
      <Header />
      <SaylorHero
        currentBtcPrice={currentBtcPrice}
        growthFactor={growthFactor}
      />
      <SaylorPrediction
        currentBtcPrice={currentBtcPrice}
        growthFactor={growthFactor}
      />
      <SaylorFeatures
        currentBtcPrice={currentBtcPrice}
        growthFactor={growthFactor}
      />
      <SaylorVideo />
      <SaylorCTA />
      <Footer />
    </div>
  );
}
