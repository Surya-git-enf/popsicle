
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FLAVORS = [
  { id: "chocolate", name: "Chocolate", textHex: "#4A2311", gradFrom: "#FFE082", gradTo: "#FFB300" },
  { id: "strawberry", name: "Strawberry", textHex: "#E91E63", gradFrom: "#E0FFFF", gradTo: "#80DEEA" },
  { id: "vanilla", name: "Vanilla", textHex: "#FFF3E0", gradFrom: "#5D4037", gradTo: "#3E2723" },
  { id: "pistachio", name: "Pistachio", textHex: "#1B5E20", gradFrom: "#C8E6C9", gradTo: "#81C784" },
];

export default function TiltShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const slider = sliderRef.current;
    const cards = gsap.utils.toArray(".tilt-card") as HTMLElement[];

    // ── 1. Master Horizontal Scroll (Pinned) ─────────────────────────────────
    const horizontalScroll = gsap.to(slider, {
      xPercent: -100 * (cards.length - 1), // Dynamically slides to the final item
      ease: "none", 
      scrollTrigger: {
        trigger: pinRef.current,
        pin: true,     
        scrub: 1,      
        end: "+=100%", // CHANGED: Now exactly 100% as requested!
      },
    });

    // ── 2. The 40° Swinging Animations for ALL items (Cards + Text) ──────────
    cards.forEach((card) => {
      const target = card.querySelector(".tilt-target");
      const bgText = card.querySelector(".card-bg-text");
      const popImage = card.querySelector(".card-pop-image");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          containerAnimation: horizontalScroll, 
          start: "left right", 
          end: "right left",   
          scrub: 1,            
        }
      });

      // All targets (both popsicles and the final text) swing 40° -> 0° -> 40°
      if (target) {
        tl.fromTo(target, 
          { rotation: 40, scale: 0.7, y: 150 }, 
          { rotation: 0, scale: 1, y: 0, duration: 1, ease: "power2.out" }
        )
        .to(target, 
          { rotation: 40, scale: 0.7, y: 150, duration: 1, ease: "power2.in" }
        );
      }

      // We only apply these parallax effects if the item is a popsicle card
      if (popImage) {
        gsap.fromTo(popImage,
          { y: 30 },
          {
            y: -30, ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: horizontalScroll, start: "left right", end: "right left", scrub: true }
          }
        );
      }

      if (bgText) {
        gsap.fromTo(bgText, 
          { y: 100 },
          { 
            y: -100, ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: horizontalScroll, start: "left right", end: "right left", scrub: 1 }
          }
        );
      }
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative w-full bg-[#F5F5DC]">
      
      {/* Securely load custom Google Fonts for the final text slide */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Special+Elite&display=swap');
      `}} />

      {/* Custom SVG Displacement Filter for "Melt" Edges */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <filter id="ink-melt">
          <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="1" result="warp" />
          <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="2.5" in="SourceGraphic" in2="warp" />
          <feGaussianBlur stdDeviation="0.6" result="blur" />
        </filter>
      </svg>

      {/* ── PINNED HORIZONTAL SECTION ── */}
      <div ref={pinRef} className="relative w-full h-screen overflow-hidden">
        
        {/* Top Header */}
        <div className="absolute top-10 left-0 w-full text-center z-20">
          <h2 className="text-sm font-mono tracking-[0.4em] text-[#3E2723] uppercase">
            The Collection
          </h2>
        </div>

        {/* Horizontal Slider Track (Now 500vw wide to fit 4 cards + 1 text slide) */}
        <div ref={sliderRef} className="flex w-[500vw] h-full">
          
          {/* SLIDES 1-4: The Popsicle Cards */}
          {FLAVORS.map((flavor) => (
            <div key={flavor.id} className="tilt-card relative w-screen h-full flex items-center justify-center">
              
              <div 
                className="tilt-target relative z-10 flex flex-col items-center justify-end w-[280px] h-[400px] md:w-[360px] md:h-[520px] rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.25)] border-2 border-white/40"
                style={{ background: `linear-gradient(135deg, ${flavor.gradFrom}, ${flavor.gradTo})` }}
              >
                
                <div className="absolute inset-0 overflow-hidden rounded-[38px] flex items-center justify-center z-0">
                  <div className="card-bg-text">
                    <h3 
                      className="text-[100px] md:text-[140px] font-black uppercase tracking-tighter leading-none -rotate-90 opacity-20"
                      style={{ 
                        color: flavor.textHex,
                        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                      }}
                    >
                      {flavor.name}
                    </h3>
                  </div>
                </div>

                <div className="card-pop-image absolute -top-16 w-[200px] h-[420px] md:-top-24 md:w-[260px] md:h-[550px] z-20" style={{ filter: "drop-shadow(0 40px 40px rgba(0,0,0,0.35))" }}>
                  <Image src={`/images/${flavor.id}-pop.png`} alt={flavor.name} fill className="object-contain object-bottom" />
                </div>

              </div>
            </div>
          ))}

          {/* SLIDE 5: The Grand Finale Typography */}
          <div className="tilt-card relative w-screen h-full flex items-center justify-center">
            {/* Using tilt-target gives this text exactly the same 40° swinging animation! */}
            <div className="tilt-target flex flex-col items-center justify-center w-full px-4" style={{ perspective: "1200px" }}>
              <h2 
                className="text-[#3E2723] text-5xl md:text-7xl mb-2" 
                style={{ fontFamily: "'Special Elite', monospace" }}
              >
                Our flavours,
              </h2>
              
              <h2 
                className="text-[#3E2723] text-7xl md:text-9xl mt-[-10px]" 
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  transform: "rotate(-4deg)",
                  filter: "url(#ink-melt)", // Liquid ink bleed effect
                }}
              >
                your obsession.
              </h2>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
