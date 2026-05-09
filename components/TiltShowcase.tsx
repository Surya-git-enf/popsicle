
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Added custom gradients for each flavor card to elevate the popsicles!
const FLAVORS = [
  { id: "chocolate", name: "Chocolate", textHex: "#4A2311", gradFrom: "#FFE082", gradTo: "#FFB300" },
  { id: "strawberry", name: "Strawberry", textHex: "#E91E63", gradFrom: "#E0FFFF", gradTo: "#80DEEA" },
  { id: "vanilla", name: "Vanilla", textHex: "#FFF3E0", gradFrom: "#5D4037", gradTo: "#3E2723" },
  { id: "pistachio", name: "Pistachio", textHex: "#1B5E20", gradFrom: "#C8E6C9", gradTo: "#81C784" },
];

export default function TiltShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const slider = sliderRef.current;
    const cards = gsap.utils.toArray(".tilt-card") as HTMLElement[];

    // ── 1. Master Horizontal Scroll ──────────────────────────────────────────
    const horizontalScroll = gsap.to(slider, {
      xPercent: -100 * (cards.length - 1), 
      ease: "none", 
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,     
        scrub: 1,      // 🧈 Butter smooth scrub
        end: "+=300%", 
      },
    });

    // ── 2. The 40° Swinging Card Animations ──────────────────────────────────
    cards.forEach((card) => {
      const target = card.querySelector(".tilt-target");
      const bgText = card.querySelector(".bg-text");
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

      // Part 1: Card swings from 40° to 0° dead center
      tl.fromTo(target, 
        { rotation: 40, scale: 0.7, y: 150 }, 
        { rotation: 0, scale: 1, y: 0, duration: 1, ease: "power2.out" }
      )
      // Part 2: Card swings back down to 40° as it leaves
      .to(target, 
        { rotation: 40, scale: 0.7, y: 150, duration: 1, ease: "power2.in" }
      );

      // Subtle parallax on the popsicle itself so it floats slightly INSIDE the card
      gsap.fromTo(popImage,
        { y: 30 },
        {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalScroll,
            start: "left right",
            end: "right left",
            scrub: true
          }
        }
      );

      // Parallax on the giant background watermark
      gsap.fromTo(bgText, 
        { x: 150, opacity: 0 },
        { 
          x: -150, 
          opacity: 0.12, 
          ease: "none",
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalScroll,
            start: "left right",
            end: "right left",
            scrub: 1,
          }
        }
      );
    });

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-screen overflow-hidden bg-[#F5F5DC]"
    >
      {/* Top Header */}
      <div className="absolute top-10 left-0 w-full text-center z-20">
        <h2 className="text-sm font-mono tracking-[0.4em] text-[#3E2723] uppercase">
          The Collection
        </h2>
      </div>

      {/* The Horizontal Slider Track */}
      <div ref={sliderRef} className="flex w-[400vw] h-full">
        
        {FLAVORS.map((flavor) => (
          <div 
            key={flavor.id} 
            className="tilt-card relative w-screen h-full flex items-center justify-center"
          >
            
            {/* Giant Background Text (Parallax Watermark) */}
            <div className="bg-text absolute z-0 pointer-events-none whitespace-nowrap">
              <h1 
                className="text-[20vw] font-black uppercase tracking-tighter"
                style={{ 
                  color: flavor.textHex,
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                }}
              >
                {flavor.name}
              </h1>
            </div>

            {/* ── THE PREMIUM CARD ── */}
            <div 
              className="tilt-target relative z-10 flex flex-col items-center justify-end w-[280px] h-[400px] md:w-[360px] md:h-[520px] rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.25)] border-2 border-white/40 pb-8 md:pb-12"
              style={{
                background: `linear-gradient(135deg, ${flavor.gradFrom}, ${flavor.gradTo})`,
              }}
            >
              
              {/* Popsicle Image (Positioned absolutely to BREAK OUT of the card's top edge!) */}
              <div className="card-pop-image absolute -top-16 w-[200px] h-[420px] md:-top-24 md:w-[260px] md:h-[550px] z-20" style={{ filter: "drop-shadow(0 40px 40px rgba(0,0,0,0.35))" }}>
                <Image
                  src={`/images/${flavor.id}-pop.png`}
                  alt={flavor.name}
                  fill
                  className="object-contain object-bottom"
                />
              </div>

              {/* Flavor Name inside the card */}
              <h3 
                className="text-2xl md:text-4xl font-black uppercase tracking-widest z-30" 
                style={{ 
                  color: flavor.textHex,
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  textShadow: flavor.id === 'vanilla' ? "0 2px 10px rgba(0,0,0,0.2)" : "none" 
                }}
              >
                {flavor.name}
              </h3>

            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
