import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IndexPage } from "@/components/index-page";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <IndexPage />
  </StrictMode>
);
