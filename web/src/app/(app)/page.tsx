import { Header } from "@/components/landing-page/header";
import { Hero } from "@/components/landing-page/hero";
import { Features } from "@/components/landing-page/features";
import { Download } from "@/components/landing-page/download";
import { Demo } from "@/components/landing-page/demo";
import { About } from "@/components/landing-page/about";
import { FAQ } from "@/components/landing-page/faq";
import { Newsletter } from "@/components/landing-page/newsletter";
import { Footer } from "@/components/landing-page/footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Download />
      <Demo />
      <About />
      <FAQ />
      <Newsletter />
      <Footer />
    </>
  );
}
