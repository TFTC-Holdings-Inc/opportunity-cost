"use client";

import Image from "next/image";
import { Twitter, Github, MessageCircle } from "lucide-react";
import Link from "next/link";
import { UTM_PARAMS } from "@/constants";
import { Container } from "../ui/container";

export function Footer() {
  return (
    <footer className="bg-neutral-900 dark:bg-neutral-950 text-white pt-16 pb-5">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="flex flex-col items-start">
            <Image
              src="/images/logo/svg/icon.svg"
              alt="Opportunity Cost Logo"
              width={32}
              height={32}
              className="size-10 mb-4"
            />
            <p className="text-lg font-bold">Opportunity Cost</p>
          </div>
          <div>
            <h3 className="text-white mb-4 text-base font-semibold">Links</h3>
            <ul>
              <li className="mb-2">
                <Link
                  href="/#features"
                  className="text-gray-300 hover:text-white transition"
                >
                  Features
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/#download"
                  className="text-gray-300 hover:text-white transition"
                >
                  Download
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/blog"
                  className="text-gray-300 hover:text-white transition"
                >
                  Blog
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/#about"
                  className="text-gray-300 hover:text-white transition"
                >
                  About
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/#faq"
                  className="text-gray-300 hover:text-white transition"
                >
                  FAQ
                </Link>
              </li>
              <li className="mb-2">
                <a
                  href="https://opportunitycost.userjot.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition"
                >
                  Feedback
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white mb-4 text-base font-semibold">Legal</h3>
            <ul>
              <li className="mb-2">
                <Link
                  href="/privacy-policy"
                  className="text-gray-300 hover:text-white transition"
                >
                  Privacy Policy
                </Link>
              </li>
              {/* <li className="mb-2">
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-white transition"
                >
                  Terms of Use
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            <h3 className="text-white mb-4 text-base font-semibold">Connect</h3>
            <div className="flex gap-4">
              <a
                href="https://x.com/TFTC21"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://github.com/TFTC-Holdings-Inc/opportunity-cost"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <Github size={24} />
              </a>
              <a
                href="https://opportunitycost.userjot.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
                title="Give Feedback"
              >
                <MessageCircle size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-700 pt-5 text-center">
          <p className="text-neutral-400 text-sm mb-0">
            &copy; 2025 Opportunity Cost | Powered by{" "}
            <a
              href={`https://tftc.io${UTM_PARAMS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:underline"
            >
              Truth For The Commoner (TFTC)
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
