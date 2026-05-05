
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FLAVORS = [
  { id: "chocolate", title: "CHOCOLATE", bg: "#FFD700" },
  { id: "strawberry", title: "STRAWBERRY", bg: "#00FFFF" },
  { id: "vanilla", title: "VANILLA", bg: "#3E2723" },
  { id: "pistachio", title: "PISTACHIO", bg: "#556B2F" },
];

export default function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%", // 300vh for 3 transitions
        pin: true,
        scrub: 1,
        snap: {
          snapTo: 1 / (FLAVORS.length - 1), // Snaps precisely to each flavor
          duration: { min: 0.2, max: 0.6 }, // Snaps quickly so you don't over-scroll
          ease: "power1.inOut"
        }
      },
    });

    FLAVORS.forEach((flavor, index) => {
      const isLast = index === FLAVORS.length - 1;
      const startTime = index;

      // Background color transition
      tl.to(bgRef.current, { backgroundColor: flavor.bg, duration: 1, ease: "none" }, startTime);

      // Text Reveal (Top to bottom + Gradient Opacity handled in CSS)
      tl.fromTo(
        `.text-${index}`,
        { opacity: 0, clipPath: "inset(0% 0% 100% 0%)" },
        { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.out" },
        startTime
      );

      // Popsicle Rise & De-tilt
      tl.fromTo(
        `.pop-${index}`,
        { yPercent: 100, rotation: 35 },
        { yPercent: 0, rotation: 0, duration: 1, ease: "power2.out" },
        startTime
      );

      // Splash Rise
      tl.fromTo(
        `.splash-${index}`,
        { yPercent: 50, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: "power2.out" },
        startTime
      );

      // Fade out previous flavor
      if (!isLast) {
        tl.to(`.flavor-group-${index}`, { opacity: 0, yPercent: -15, duration: 0.5 }, startTime + 0.8);
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 z-0 bg-[#FFD700]" />

      {FLAVORS.map((flavor, index) => (
        <div key={flavor.id} className={`flavor-group-${index} absolute inset-0 z-10 flex items-center justify-center`}>
          
          {/* Gradient Text (10% top, 100% bottom opacity) */}
          <h1 
            className={`text-${index} absolute text-[12vw] font-black tracking-tighter uppercase z-10`} 
            style={{ 
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            {flavor.title}
          </h1>

          <div className={`pop-${index} absolute z-30 w-full h-full flex items-center justify-center pointer-events-none`}>
            <div className="relative w-[300px] h-[600px] md:w-[400px] md:h-[800px]">
              <Image src={`/images/${flavor.id}-pop.png`} alt={flavor.title} fill className="object-contain" priority={index === 0} />
            </div>
          </div>

          <div className={`splash-${index} absolute bottom-0 z-20 w-full h-[40vh] md:h-[50vh] pointer-events-none`}>
            <Image src={`/images/${flavor.id}-splash.png`} alt={flavor.title} fill className="object-cover object-bottom" priority={index === 0} />
          </div>
        </div>
      ))}
    </div>
  );
}
