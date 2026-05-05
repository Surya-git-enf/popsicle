"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FLAVORS = [
  { id: "chocolate", title: "CHOCOLATE", bg: "#FFD700" }, // Golden Yellow
  { id: "strawberry", title: "STRAWBERRY", bg: "#00FFFF" }, // Cyan
  { id: "vanilla", title: "VANILLA", bg: "#3E2723" }, // Dark Brown
  { id: "pistachio", title: "PISTACHIO", bg: "#556B2F" }, // Olive Green
];

export default function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=400%", // 400vh total scroll
        pin: true,
        scrub: 1, // Smooth scrubbing
      },
    });

    FLAVORS.forEach((flavor, index) => {
      const isLast = index === FLAVORS.length - 1;
      const startTime = index; // 0, 1, 2, 3

      // Background color transition
      tl.to(bgRef.current, { backgroundColor: flavor.bg, duration: 1, ease: "none" }, startTime);

      // 1. Text Reveal (Behind Popsicle)
      tl.fromTo(
        `.text-${index}`,
        { opacity: 0, clipPath: "inset(0% 0% 90% 0%)" },
        { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.out" },
        startTime
      );

      // 2. Popsicle Rise & De-tilt
      tl.fromTo(
        `.pop-${index}`,
        { yPercent: 100, rotation: 35 },
        { yPercent: 0, rotation: 0, duration: 1, ease: "power2.out" },
        startTime
      );

      // 3. Splash Rise
      tl.fromTo(
        `.splash-${index}`,
        { yPercent: 50, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: "power2.out" },
        startTime
      );

      // Fade out current flavor before next one comes in (unless it's the last one)
      if (!isLast) {
        const fadeOutTime = startTime + 0.8; 
        tl.to(`.flavor-group-${index}`, { opacity: 0, yPercent: -20, duration: 0.5 }, fadeOutTime);
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      {/* Dynamic Background */}
      <div ref={bgRef} className="absolute inset-0 z-0 bg-[#FFD700]" />

      {/* Flavors Stacking Context */}
      {FLAVORS.map((flavor, index) => (
        <div key={flavor.id} className={`flavor-group-${index} absolute inset-0 z-10 flex items-center justify-center`}>
          
          {/* Background Text */}
          <h1 className={`text-${index} absolute text-[12vw] font-black text-white/80 tracking-tighter uppercase z-10`} style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            {flavor.title}
          </h1>

          {/* Popsicle (Foreground) */}
          <div className={`pop-${index} absolute z-30 w-full h-full flex items-center justify-center`}>
            <div className="relative w-[300px] h-[600px] md:w-[400px] md:h-[800px]">
              <Image 
                src={`/images/${flavor.id}-pop.png`} 
                alt={`${flavor.title} Popsicle`} 
                fill 
                className="object-contain"
                priority={index === 0}
              />
            </div>
          </div>

          {/* Splash (Base) */}
          <div className={`splash-${index} absolute bottom-0 z-20 w-full h-[40vh] md:h-[50vh]`}>
            <Image 
              src={`/images/${flavor.id}-splash.png`} 
              alt={`${flavor.title} Splash`} 
              fill 
              className="object-cover object-bottom"
              priority={index === 0}
            />
          </div>
        </div>
      ))}

      {/* Fixed Order Button */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50">
        <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full hover:bg-white hover:text-black transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          ORDER NOW
        </button>
      </div>
    </div>
  );
            }

