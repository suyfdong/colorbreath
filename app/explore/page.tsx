import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlashlightCursor from "@/components/FlashlightCursor";
import ExploreBrowser from "@/components/ExploreBrowser";

export default function ExplorePage() {
  return (
    <>
      <FlashlightCursor />
      <Navbar />
      <Suspense>
        <ExploreBrowser
          readUrlParam
          eyebrow="Explore"
          title="Free Printable Coloring Pages for Adults"
          intro="Browse our collection of mindfulness coloring pages — mandala patterns, floral designs, and cozy scenes, each paired with ambient sounds. Filter by mood to find the perfect page for stress relief, sleep, or a creative energy boost."
        />
      </Suspense>
      <Footer />
    </>
  );
}
