import { Header } from "@/components/landing-page/header";
import { Footer } from "@/components/landing-page/footer";

export default function DemoPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center bg-neutral-50 dark:bg-neutral-900 min-h-screen pt-32 pb-16">
        <section className="w-[90%] max-w-[1200px] mx-auto mb-16">
          <h1 className="text-4xl font-bold text-foreground text-center mb-8">
            Demo: Kitchen Sink of USD Formats
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-10">
            This comprehensive test page contains every possible USD format,
            price, and value to thoroughly test the Opportunity Cost
            extension&apos;s detection and conversion capabilities.
          </p>

          <Section title="Basic Currency Formats">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                "$1",
                "$5",
                "$10",
                "$20",
                "$50",
                "$100",
                "$500",
                "$1000",
                "$1.00",
                "$5.50",
                "$10.99",
                "$20.49",
                "$50.75",
                "$100.25",
                "$ 1",
                "$ 5",
                "$ 10",
                "$ 100",
                "$ 1000",
                "$1 ",
                "$5 ",
                "$10 ",
                "$100 ",
                "$1000 ",
                "1$",
                "5$",
                "10$",
                "100$",
                "1000$",
                "1 $",
                "5 $",
                "10 $",
                "100 $",
                "1000 $",
                "USD 1",
                "USD 5",
                "USD 10",
                "USD 100",
                "USD 1000",
                "1 USD",
                "5 USD",
                "10 USD",
                "100 USD",
                "1000 USD",
                "US$ 1",
                "US$ 5",
                "US$ 10",
                "US$ 100",
                "US$ 1000",
                "1 US$",
                "5 US$",
                "10 US$",
                "100 US$",
                "1000 US$",
              ].map((val) => (
                <div
                  key={val}
                  className="p-2 bg-white dark:bg-neutral-800 rounded border"
                >
                  {val}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Decimal Variations">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm">
              {[
                "$0.01",
                "$0.05",
                "$0.10",
                "$0.25",
                "$0.50",
                "$0.99",
                "$1.01",
                "$1.50",
                "$1.99",
                "$2.50",
                "$3.33",
                "$4.44",
                "$5.55",
                "$6.66",
                "$7.77",
                "$8.88",
                "$9.99",
                "$10.00",
                "$12.34",
                "$56.78",
                "$99.99",
                "$123.45",
                "$999.99",
                "$1.1",
                "$1.12",
                "$1.123",
                "$1.1234",
                "$1.12345",
                "$0.1",
                "$0.12",
                "$0.123",
                "$0.1234",
                "$0.12345",
              ].map((val) => (
                <div
                  key={val}
                  className="p-2 bg-white dark:bg-neutral-800 rounded border"
                >
                  {val}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Comma-Separated Numbers">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                "$1,000",
                "$5,000",
                "$10,000",
                "$25,000",
                "$50,000",
                "$100,000",
                "$250,000",
                "$500,000",
                "$750,000",
                "$1,000,000",
                "$2,500,000",
                "$5,000,000",
                "$10,000,000",
                "$25,000,000",
                "$50,000,000",
                "$100,000,000",
                "$1,000.00",
                "$5,000.50",
                "$10,000.99",
                "$25,000.25",
                "$1,234",
                "$5,678",
                "$12,345",
                "$67,890",
                "$123,456",
                "$1,234.56",
                "$12,345.67",
                "$123,456.78",
                "$1,234,567.89",
              ].map((val) => (
                <div
                  key={val}
                  className="p-2 bg-white dark:bg-neutral-800 rounded border"
                >
                  {val}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Multiplier Suffixes (K, M, B, T)">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                "$1K",
                "$5K",
                "$10K",
                "$25K",
                "$50K",
                "$100K",
                "$500K",
                "$1k",
                "$5k",
                "$10k",
                "$25k",
                "$50k",
                "$100k",
                "$500k",
                "$1.5K",
                "$2.5K",
                "$5.5K",
                "$10.5K",
                "$25.5K",
                "$1.5k",
                "$2.5k",
                "$5.5k",
                "$10.5k",
                "$25.5k",
                "$1M",
                "$5M",
                "$10M",
                "$25M",
                "$50M",
                "$100M",
                "$500M",
                "$1m",
                "$5m",
                "$10m",
                "$25m",
                "$50m",
                "$100m",
                "$500m",
                "$1.5M",
                "$2.5M",
                "$5.5M",
                "$10.5M",
                "$25.5M",
                "$1.5m",
                "$2.5m",
                "$5.5m",
                "$10.5m",
                "$25.5m",
                "$1B",
                "$5B",
                "$10B",
                "$25B",
                "$50B",
                "$100B",
                "$500B",
                "$1b",
                "$5b",
                "$10b",
                "$25b",
                "$50b",
                "$100b",
                "$500b",
                "$1.5B",
                "$2.5B",
                "$5.5B",
                "$10.5B",
                "$25.5B",
                "$1.5b",
                "$2.5b",
                "$5.5b",
                "$10.5b",
                "$25.5b",
                "$1T",
                "$5T",
                "$10T",
                "$25T",
                "$50T",
                "$100T",
                "$1t",
                "$5t",
                "$10t",
                "$25t",
                "$50t",
                "$100t",
                "$1.5T",
                "$2.5T",
                "$5.5T",
                "$10.5T",
                "$1.5t",
                "$2.5t",
                "$5.5t",
                "$10.5t",
              ].map((val) => (
                <div
                  key={val}
                  className="p-2 bg-white dark:bg-neutral-800 rounded border"
                >
                  {val}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Word-Based Multipliers">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                "$1 thousand",
                "$5 thousand",
                "$10 thousand",
                "$100 thousand",
                "$1 million",
                "$5 million",
                "$10 million",
                "$100 million",
                "$1 billion",
                "$5 billion",
                "$10 billion",
                "$100 billion",
                "$1 trillion",
                "$5 trillion",
                "$10 trillion",
                "$100 trillion",
                "$1.5 thousand",
                "$2.5 thousand",
                "$5.5 thousand",
                "$1.5 million",
                "$2.5 million",
                "$5.5 million",
                "$1.5 billion",
                "$2.5 billion",
                "$5.5 billion",
                "$1.5 trillion",
                "$2.5 trillion",
                "$5.5 trillion",
                "1 thousand dollars",
                "5 million dollars",
                "10 billion dollars",
                "1.5 thousand USD",
                "2.5 million USD",
                "5.5 billion USD",
              ].map((val) => (
                <div
                  key={val}
                  className="p-2 bg-white dark:bg-neutral-800 rounded border"
                >
                  {val}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Time-Based Pricing">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                "$1/hour",
                "$5/hour",
                "$10/hour",
                "$25/hour",
                "$50/hour",
                "$100/hour",
                "$1/day",
                "$5/day",
                "$10/day",
                "$25/day",
                "$50/day",
                "$100/day",
                "$1/week",
                "$5/week",
                "$10/week",
                "$25/week",
                "$50/week",
                "$100/week",
                "$1/month",
                "$5/month",
                "$10/month",
                "$25/month",
                "$50/month",
                "$100/month",
                "$1/year",
                "$5/year",
                "$10/year",
                "$25/year",
                "$50/year",
                "$100/year",
                "$1 per hour",
                "$5 per hour",
                "$10 per hour",
                "$25 per hour",
                "$1 per day",
                "$5 per day",
                "$10 per day",
                "$25 per day",
                "$1 per week",
                "$5 per week",
                "$10 per week",
                "$25 per week",
                "$1 per month",
                "$5 per month",
                "$10 per month",
                "$25 per month",
                "$1 per year",
                "$5 per year",
                "$10 per year",
                "$25 per year",
                "$1/hr",
                "$5/hr",
                "$10/hr",
                "$25/hr",
                "$50/hr",
                "$100/hr",
              ].map((val) => (
                <div
                  key={val}
                  className="p-2 bg-white dark:bg-neutral-800 rounded border"
                >
                  {val}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Ranges and Approximations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                "$1-$5",
                "$10-$20",
                "$50-$100",
                "$100-$500",
                "$1K-$5K",
                "$1 - $5",
                "$10 - $20",
                "$50 - $100",
                "$100 - $500",
                "$1 to $5",
                "$10 to $20",
                "$50 to $100",
                "$100 to $500",
                "~$1",
                "~$5",
                "~$10",
                "~$50",
                "~$100",
                "~$500",
                "≈$1",
                "≈$5",
                "≈$10",
                "≈$50",
                "≈$100",
                "≈$500",
                "about $1",
                "about $5",
                "about $10",
                "about $50",
                "around $1",
                "around $5",
                "around $10",
                "around $50",
                "approximately $1",
                "approximately $5",
                "approximately $10",
                "roughly $1",
                "roughly $5",
                "roughly $10",
                "roughly $50",
                "over $1",
                "over $5",
                "over $10",
                "over $50",
                "over $100",
                "under $1",
                "under $5",
                "under $10",
                "under $50",
                "under $100",
                "up to $1",
                "up to $5",
                "up to $10",
                "up to $50",
                "up to $100",
                "starting at $1",
                "starting at $5",
                "starting at $10",
                "from $1",
                "from $5",
                "from $10",
                "from $50",
                "from $100",
              ].map((val) => (
                <div
                  key={val}
                  className="p-2 bg-white dark:bg-neutral-800 rounded border"
                >
                  {val}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Negative and Special Values">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                "-$1",
                "-$5",
                "-$10",
                "-$100",
                "-$1,000",
                "-$10,000",
                "-$1.00",
                "-$5.50",
                "-$10.99",
                "-$100.25",
                "-$1K",
                "-$5K",
                "-$10K",
                "-$100K",
                "-$1M",
                "-$5M",
                "($1)",
                "($5)",
                "($10)",
                "($100)",
                "($1,000)",
                "($1.00)",
                "($5.50)",
                "($10.99)",
                "($100.25)",
                "($1K)",
                "($5K)",
                "($10K)",
                "($100K)",
                "($1M)",
                "$0",
                "$0.00",
                "$00.00",
                "$000.00",
                "+$1",
                "+$5",
                "+$10",
                "+$100",
                "+$1,000",
              ].map((val) => (
                <div
                  key={val}
                  className="p-2 bg-white dark:bg-neutral-800 rounded border"
                >
                  {val}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Real-World Examples">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold">Consumer Goods</h4>
                  <div className="space-y-1">
                    {[
                      "Coffee: $4.50",
                      "Sandwich: $8.99",
                      "Pizza: $15.99",
                      "Burger: $12.50",
                      "Salad: $9.75",
                      "Soda: $2.25",
                      "Beer: $6.00",
                      "Wine: $25.00",
                      "Cocktail: $14.00",
                      "Breakfast: $11.99",
                      "Lunch: $13.50",
                      "Dinner: $28.75",
                    ].map((item) => (
                      <div
                        key={item}
                        className="p-1 bg-white dark:bg-neutral-800 rounded"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Services</h4>
                  <div className="space-y-1">
                    {[
                      "Haircut: $35",
                      "Massage: $80",
                      "Uber ride: $12.50",
                      "Movie ticket: $15.50",
                      "Concert: $125",
                      "Gym membership: $49/month",
                      "Netflix: $15.99/month",
                      "Spotify: $9.99/month",
                      "Phone plan: $60/month",
                      "Internet: $79.99/month",
                    ].map((item) => (
                      <div
                        key={item}
                        className="p-1 bg-white dark:bg-neutral-800 rounded"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Large Numbers and Government Spending">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                "Defense Budget: $750,000,000,000",
                "Education: $100,000,000,000",
                "Healthcare: $3,800,000,000,000",
                "Infrastructure: $1,200,000,000,000",
                "National Debt: $34,000,000,000,000",
                "GDP: $25,000,000,000,000",
                "Federal Reserve: $8,000,000,000,000",
                "Social Security: $1,000,000,000,000",
                "Medicare: $800,000,000,000",
                "Medicaid: $600,000,000,000",
                "NASA Budget: $25,000,000,000",
                "FBI Budget: $9,000,000,000",
              ].map((item) => (
                <div
                  key={item}
                  className="p-2 bg-white dark:bg-neutral-800 rounded border"
                >
                  {item}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Scientific Notation and Edge Cases">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                "$1e3",
                "$1e6",
                "$1e9",
                "$1e12",
                "$1.5e3",
                "$2.5e6",
                "$5.5e9",
                "$10.5e12",
                "$1E3",
                "$1E6",
                "$1E9",
                "$1E12",
                "$1.5E3",
                "$2.5E6",
                "$5.5E9",
                "$10.5E12",
                "$1×10³",
                "$1×10⁶",
                "$1×10⁹",
                "$1×10¹²",
                "$1*10^3",
                "$1*10^6",
                "$1*10^9",
                "$1*10^12",
              ].map((val) => (
                <div
                  key={val}
                  className="p-2 bg-white dark:bg-neutral-800 rounded border"
                >
                  {val}
                </div>
              ))}
            </div>
          </Section>

          <Section title="International Formats">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                "$1.000",
                "$5.000",
                "$10.000",
                "$100.000",
                "$1.000,00",
                "$5.000,50",
                "$10.000,99",
                "$100.000,25",
                "$1,000.00",
                "$5,000.50",
                "$10,000.99",
                "$100,000.25",
                "$1 000",
                "$5 000",
                "$10 000",
                "$100 000",
                "$1 000.00",
                "$5 000.50",
                "$10 000.99",
                "$100 000.25",
                "$1'000",
                "$5'000",
                "$10'000",
                "$100'000",
                "$1'000.00",
                "$5'000.50",
                "$10'000.99",
                "$100'000.25",
              ].map((val) => (
                <div
                  key={val}
                  className="p-2 bg-white dark:bg-neutral-800 rounded border"
                >
                  {val}
                </div>
              ))}
            </div>
          </Section>

          <Section title="Contextual Sentences">
            <div className="space-y-4 text-sm">
              <p>
                The house costs $450,000 and requires a down payment of $90,000.
              </p>
              <p>
                My salary is $75,000 per year, which breaks down to about $6,250
                per month.
              </p>
              <p>
                The car payment is $350/month for 60 months, totaling $21,000.
              </p>
              <p>
                I spent $1,200 on groceries last month, averaging $40 per day.
              </p>
              <p>
                The vacation package costs $2,500 per person, or $10,000 for our
                family of four.
              </p>
              <p>
                Stock prices: AAPL $175.50, GOOGL $2,850.25, TSLA $245.75, MSFT
                $415.30.
              </p>
              <p>
                The startup raised $5M in Series A funding, following a $500K
                seed round.
              </p>
              <p>
                Bitcoin reached $69,000 in November 2021, up from $3,200 in
                March 2020.
              </p>
              <p>
                The company&apos;s revenue grew from $1.2B to $1.8B, a 50%
                increase.
              </p>
              <p>
                Real estate prices range from $200/sq ft to $1,500/sq ft in this
                area.
              </p>
            </div>
          </Section>

          <Section title="Table of Various Formats">
            <table className="w-full text-left border mt-4 mb-8 text-sm">
              <thead className="bg-neutral-100 dark:bg-neutral-800">
                <tr>
                  <th className="border px-4 py-2">Format Type</th>
                  <th className="border px-4 py-2">Example 1</th>
                  <th className="border px-4 py-2">Example 2</th>
                  <th className="border px-4 py-2">Example 3</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Basic", "$100", "$1,000", "$10,000"],
                  ["Decimals", "$99.99", "$1,234.56", "$10,000.00"],
                  ["Multipliers", "$1K", "$5M", "$10B"],
                  ["Words", "$1 million", "$5 billion", "$10 trillion"],
                  ["Negative", "-$500", "($1,000)", "-$5K"],
                  ["Ranges", "$10-$20", "$100 to $500", "$1K-$5K"],
                  ["Time-based", "$50/hour", "$100/day", "$1K/month"],
                  ["Approximate", "~$100", "about $500", "around $1K"],
                ].map(([type, ex1, ex2, ex3]) => (
                  <tr key={type}>
                    <td className="border px-4 py-2 font-medium">{type}</td>
                    <td className="border px-4 py-2">{ex1}</td>
                    <td className="border px-4 py-2">{ex2}</td>
                    <td className="border px-4 py-2">{ex3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="Lists with Mixed Formats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-2">Unordered List</h4>
                <ul className="list-disc ml-8 space-y-1 text-sm">
                  {[
                    "Basic: $100",
                    "With decimals: $99.99",
                    "Thousands: $1,000",
                    "Millions: $1M",
                    "Billions: $5B",
                    "Negative: -$500",
                    "Range: $10-$20",
                    "Per hour: $25/hour",
                    "Approximate: ~$100",
                  ].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Ordered List</h4>
                <ol className="list-decimal ml-8 space-y-1 text-sm">
                  {[
                    "$1.00",
                    "$10.50",
                    "$100.99",
                    "$1,000.00",
                    "$10K",
                    "$100K",
                    "$1M",
                    "$10M",
                    "$100M",
                  ].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
            </div>
          </Section>

          <Section title="Bitcoin Conversion Edge Cases">
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Bug Report Test Cases
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                  These values are designed to test the specific bug where
                  Bitcoin conversions show incorrect decimal placement (e.g.,
                  $0.12M instead of $12M).
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {[
                  "$12M",
                  "$120M",
                  "$1.2M",
                  "$12.5M",
                  "$125M",
                  "$1.25M",
                  "$0.12M",
                  "$0.125M",
                  "$12,000,000",
                  "$120,000,000",
                  "$1,200,000",
                  "$12,500,000",
                  "$125,000,000",
                  "$1,250,000",
                  "$120,000",
                  "$1,250",
                  "12 million dollars",
                  "120 million dollars",
                  "1.2 million dollars",
                  "12.5 million dollars",
                  "$12 million",
                  "$120 million",
                  "$1.2 million",
                  "$12.5 million",
                ].map((val) => (
                  <div
                    key={val}
                    className="p-3 bg-white dark:bg-neutral-800 rounded border-2 border-red-200 dark:border-red-800"
                  >
                    <div className="font-mono">{val}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Test case
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">
                  High-Value Problematic Amounts
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {[
                    "The company raised $12M in Series B funding",
                    "Real estate portfolio worth $120M",
                    "Bitcoin purchase of $1.2M",
                    "Investment of $12.5M in startups",
                    "Acquisition price: $125M",
                    "Market cap reached $1.25M",
                    "Revenue of $120,000 per month",
                    "Annual salary: $1,250,000",
                    "The deal was valued at twelve million dollars ($12M)",
                    "Stock options worth $120M at current prices",
                    "Cryptocurrency holdings: $1.2M in Bitcoin",
                    "Property investment of $12.5M downtown",
                  ].map((sentence) => (
                    <div
                      key={sentence}
                      className="p-3 bg-white dark:bg-neutral-800 rounded border border-orange-200 dark:border-orange-800"
                    >
                      {sentence}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">
                  Decimal Precision Test Cases
                </h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm">
                  {[
                    "$0.12M",
                    "$0.120M",
                    "$0.1200M",
                    "$12.0M",
                    "$12.00M",
                    "$12.000M",
                    "$1.20M",
                    "$1.200M",
                    "$1.2000M",
                    "$120.0M",
                    "$120.00M",
                    "$120.000M",
                  ].map((val) => (
                    <div
                      key={val}
                      className="p-2 bg-white dark:bg-neutral-800 rounded border border-blue-200 dark:border-blue-800"
                    >
                      <div className="font-mono text-center">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section title="Stress Test: Dense Price Grid">
            <div className="grid grid-cols-8 md:grid-cols-12 gap-1 text-xs">
              {Array.from({ length: 200 }, (_, i) => {
                const formats = [
                  `$${i + 1}`,
                  `$${(i + 1) * 10}`,
                  `$${(i + 1) * 100}`,
                  `$${i + 1}K`,
                  `$${i + 1}M`,
                  `$${(i + 1).toFixed(2)}`,
                  `$${(i + 1) * 1000}`,
                  `$${i + 1},000`,
                ];
                return formats[i % formats.length];
              }).map((price, i) => (
                <div
                  key={i}
                  className="p-1 bg-white dark:bg-neutral-800 rounded text-center border"
                >
                  {price}
                </div>
              ))}
            </div>
          </Section>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-center text-primary py-3 rounded-lg">
        {title}
      </h2>
      {children}
    </div>
  );
}
