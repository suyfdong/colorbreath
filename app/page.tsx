import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MoodSelection from "@/components/MoodSelection";
import TodaysPick from "@/components/TodaysPick";
import Footer from "@/components/Footer";
import FlashlightCursor from "@/components/FlashlightCursor";

export default function Home() {
  return (
    <>
      <FlashlightCursor />
      <Navbar />
      <main>
        <Hero />
        <MoodSelection />
        <TodaysPick />
      </main>
      <Footer />
    </>
  );
}
