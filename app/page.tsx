
import HeroSequence from "@/components/HeroSequence";
import TiltShowcase from "@/components/TiltShowcase";
import GlassFooter from "@/components/GlassFooter";

export default function Home() {
  return (
    <main
      style={{
        margin: 0,
        padding: 0,
        overflowX: "hidden",
        backgroundColor: "#000",
      }}
    >
      <HeroSequence />
      <TiltShowcase />
      <GlassFooter />
    </main>
  );
}
