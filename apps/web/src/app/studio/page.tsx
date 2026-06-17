import type { Metadata } from "next";
import { StudioClient } from "./studio-client";

export const metadata: Metadata = {
  title: "Design Studio",
  description: "Design custom apparel in ThreadForm's 3D-ready studio.",
  robots: { index: false, follow: true },
};

export default function StudioPage() {
  return <StudioClient />;
}
