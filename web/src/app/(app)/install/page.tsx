import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/landing-page/header";
import { Footer } from "@/components/landing-page/footer";

export const metadata: Metadata = {
  title: "Install Browser Extension",
  description:
    "Learn how to download and side load the Opportunity Cost extension in Chrome",
};

export default function InstallPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen bg-gray-100 flex-col items-center p-6 md:p-24 md:pt-32 pt-24">
        <div className="w-[90%] max-w-[800px] mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            Install the Opportunity Cost Extension
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Download the Extension
            </h2>
            <p className="mb-4">
              Click the button below to download the Opportunity Cost extension:
            </p>
            <Link
              href="/extension/oc-extension.zip"
              className="inline-flex items-center px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:opacity-90 transition-opacity"
              download
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Extension
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Installation Instructions
            </h2>

            <ol className="list-decimal pl-6 space-y-6">
              <li>
                <h3 className="text-xl font-medium mb-2">
                  Extract the ZIP file
                </h3>
                <p>
                  After downloading, extract the ZIP file to a location on your
                  computer that you&apos;ll remember.
                </p>
              </li>

              <li>
                <h3 className="text-xl font-medium mb-2">
                  Open Chrome Extensions page
                </h3>
                <p>
                  In Chrome, navigate to{" "}
                  <a
                    href="chrome://extensions"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      chrome://extensions
                    </code>
                  </a>{" "}
                  in your address bar.
                </p>
              </li>

              <li>
                <h3 className="text-xl font-medium mb-2">
                  Enable Developer Mode
                </h3>
                <p>
                  Toggle on &quot;Developer mode&quot; in the top right corner
                  of the extensions page.
                </p>
                <div className="mt-2 border border-gray-200 rounded-md overflow-hidden">
                  <Image
                    src="/images/developer-mode.png"
                    alt="Enable Developer Mode"
                    width={600}
                    height={100}
                    className="w-full"
                    priority
                  />
                </div>
              </li>

              <li>
                <h3 className="text-xl font-medium mb-2">
                  Load Unpacked Extension
                </h3>
                <p>
                  Click the &quot;Load unpacked&quot; button that appears after
                  enabling developer mode.
                </p>
                <div className="mt-2 border border-gray-200 rounded-md overflow-hidden">
                  <Image
                    src="/images/load-unpacked.png"
                    alt="Load Unpacked button"
                    width={600}
                    height={100}
                    className="w-full"
                  />
                </div>
              </li>

              <li>
                <h3 className="text-xl font-medium mb-2">
                  Select the Extension Folder
                </h3>
                <p>
                  Navigate to the folder where you extracted the ZIP file and
                  select it.
                </p>
              </li>

              <li>
                <h3 className="text-xl font-medium mb-2">
                  You&apos;re all set!
                </h3>
                <p>
                  The Opportunity Cost extension should now be installed and
                  visible in your extensions list. You may need to pin it to
                  your toolbar for easy access.
                </p>
              </li>
            </ol>

            <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <h3 className="text-lg font-medium mb-2">Important Note</h3>
              <p>
                Since this is a developer mode installation, you may see a
                notification about &quot;Remove extensions in developer
                mode&quot; each time you start Chrome. This is normal for
                side-loaded extensions.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-[var(--primary)] hover:underline transition-all"
            >
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
