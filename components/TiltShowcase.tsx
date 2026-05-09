
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FLAVORS = [
  { id: "chocolate", name: "Chocolate", textHex: "#4A2311" },
  { id: "strawberry", name: "Strawberry", textHex: "#E91E63" },
  { id: "vanilla", name: "Vanilla", textHex: "#FFFFFF" }, // Using white for high contrast on beige
  { id: "pistachio", name: "Pistachio", textHex: "#1B5E20" },
];

export default function TiltShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const slider = sliderRef.current;
    const cards = gsap.utils.toArray(".tilt-card") as HTMLElement[];

    // ── 1. The Master Horizontal Scroll ──────────────────────────────────────
    const horizontalScroll = gsap.to(slider, {
      xPercent: -100 * (cards.length - 1), // Slides left exactly enough to show the last card
      ease: "none", // Must be "none" for perfectly linear scroll tracking
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,     // Pins the section until the horizontal scroll finishes
        scrub: 1,      // 🧈 Butter smooth drag
        end: "+=300%", // Requires 3 full viewport heights to scroll through the 4 cards
      },
    });

    // ── 2. The 40° Swinging Card Animations ──────────────────────────────────
    cards.forEach((card) => {
      const target = card.querySelector(".tilt-target");
      const bgText = card.querySelector(".bg-text");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          containerAnimation: horizontalScroll, // Links this animation to the horizontal sliding track!
          start: "left right", // Starts when the left edge of the card hits the right edge of the screen
          end: "right left",   // Ends when the right edge of the card hits the left edge of the screen
          scrub: 1,            // Butter smooth interpolation
        }
      });

      // Part 1: Enters tilted 40° right -> Swings up to 0° exactly in the center
      tl.fromTo(target, 
        { rotation: 40, scale: 0.7, y: 100 }, 
        { rotation: 0, scale: 1.1, y: 0, duration: 1, ease: "power2.out" }
      )
      // Part 2: Swings back down to 40° right as it exits to the left
      .to(target, 
        { rotation: 40, scale: 0.7, y: 100, duration: 1, ease: "power2.in" }
      );

      // Subtle parallax effect on the giant background text to give it 3D depth
      gsap.fromTo(bgText, 
        { x: 100, opacity: 0 },
        { 
          x: -100, 
          opacity: 0.15, // Acts as a watermark
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
      <div className="absolute top-10 left-0 w-full text-center z-20">
        <h2 className="text-sm font-mono tracking-[0.4em] text-[#3E2723] uppercase">
          The Collection
        </h2>
      </div>

      {/* The Horizontal Slider Track */}
      <div 
        ref={sliderRef} 
        className="flex w-[400vw] h-full"
      >
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

            {/* The 40° Swinging Target Wrapper */}
            <div className="tilt-target relative z-10 flex flex-col items-center justify-center">
              
              {/* Popsicle Image */}
              <div className="relative w-[220px] h-[450px] md:w-[320px] md:h-[650px]" style={{ filter: "drop-shadow(20px 40px 40px rgba(0,0,0,0.25))" }}>
                <Image
                  src={`/images/${flavor.id}-pop.png`}
                  alt={flavor.name}
                  fill
                  className="object-contain object-center"
                />
              </div>

            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
