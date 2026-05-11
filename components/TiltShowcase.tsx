
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
    if (!slider) return;

    const cards = gsap.utils.toArray(".tilt-card") as HTMLElement[];

    // ── 1. The Bulletproof Horizontal Scroll ─────────────────────────────────
    // This perfectly calculates the width of the track, so it ALWAYS stops 
    // exactly on the final text slide, no matter the screen size!
    const horizontalScroll = gsap.to(slider, {
      x: () => -(slider.scrollWidth - window.innerWidth),
      ease: "none", 
      scrollTrigger: {
        trigger: pinRef.current,
        pin: true,     
        scrub: 1,      
        end: () => "+=" + (slider.scrollWidth - window.innerWidth),
        invalidateOnRefresh: true, // Recalculates perfectly if phone is rotated
      },
    });

    // ── 2. The 40° Cinematic Swinging Animations ─────────────────────────────
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

      // Swing Physics for both Cards AND the Final Text
      if (target) {
        tl.fromTo(target, 
          { rotation: 40, scale: 1, y: 150 }, 
          { rotation: 0, scale: 1, y: 0, duration: 2, ease: "power2.out" }
        )
        .to(target, 
          { rotation: 40, scale: 1, y: 150, duration: 2, ease: "power2.in" }
        );
      }

      // Parallax for Popsicle Image breaking out of the card
      if (popImage) {
        gsap.fromTo(popImage,
          { y: 30 },
          {
            y: -30, ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: horizontalScroll, start: "left right", end: "right left", scrub: true }
          }
        );
      }

      // Horizontal Parallax for the Watermark Flavor Name
      if (bgText) {
        gsap.fromTo(bgText, 
          { x: 100 },
          { 
            x: -100, ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: horizontalScroll, start: "left right", end: "right left", scrub: 1 }
          }
        );
      }
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative w-full bg-[#F5F5DC]">
      
      {/* Font & SVG Filters */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Special+Elite&display=swap');
      `}} />

      <svg className="absolute w-0 h-0 pointer-events-none">
        <filter id="ink-melt">
          <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="1" result="warp" />
          <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="2.5" in="SourceGraphic" in2="warp" />
          <feGaussianBlur stdDeviation="0.6" result="blur" />
        </filter>
      </svg>

      <div ref={pinRef} className="relative w-full h-screen overflow-hidden">
        
        <div className="absolute top-10 left-0 w-full text-center z-20 pointer-events-none">
          <h2 className="text-sm font-mono tracking-[0.4em] text-[#3E2723] uppercase">
            The Collection
          </h2>
        </div>

        {/* 500vw wide container: 4 full-screen cards + 1 full-screen text slide */}
        <div ref={sliderRef} className="flex w-[500vw] h-full">
          
          {/* SLIDES 1-4: The Landscape Popsicle Cards */}
          {FLAVORS.map((flavor) => (
            <div key={flavor.id} className="tilt-card relative w-screen h-full flex items-center justify-center">
              
              <div 
                className="tilt-target relative z-10 flex flex-col items-center justify-center w-[340px] h-[220px] md:w-[560px] md:h-[320px] rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.25)] border-2 border-white/40"
                style={{ background: `linear-gradient(135deg, ${flavor.gradFrom}, ${flavor.gradTo})` }}
              >
                
                {/* Horizontal Background Text */}
                <div className="absolute inset-0 overflow-hidden rounded-[38px] flex items-center justify-center z-0">
                  <div className="card-bg-text">
                    <h3 
                      className="text-[60px] md:text-[90px] font-black uppercase tracking-tighter leading-none opacity-20 whitespace-nowrap"
                      style={{ 
                        color: flavor.textHex,
                        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                      }}
                    >
                      {flavor.name}
                    </h3>
                  </div>
                </div>

                {/* Popsicle Image */}
                <div className="card-pop-image absolute -top-24 w-[180px] h-[380px] md:-top-32 md:w-[240px] md:h-[500px] z-20" style={{ filter: "drop-shadow(0 40px 40px rgba(0,0,0,0.35))" }}>
                  <Image src={`/images/${flavor.id}-pop.png`} alt={flavor.name} fill className="object-contain object-center" />
                </div>

              </div>
            </div>
          ))}

          {/* SLIDE 5: The Grand Finale Typography */}
          {/* This acts as the final stop. Once centered, the pin releases! */}
          <div className="tilt-card relative w-screen h-full flex items-center justify-center">
            <div className="tilt-target flex flex-col items-center justify-center w-full" style={{ perspective: "1200px" }}>
              <h2 
                className="text-[#3E2723] text-5xl md:text-7xl mb-2" 
                style={{ fontFamily: "'Special Elite', monospace", whiteSpace: "nowrap" }}
              >
                Our flavours,
              </h2>
              
              <h2 
                className="text-[#3E2723] text-7xl md:text-9xl mt-[-10px]" 
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  transform: "rotate(-4deg)",
                  filter: "url(#ink-melt)", 
                  whiteSpace: "nowrap"
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
