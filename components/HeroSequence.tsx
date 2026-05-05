
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Added text colors for the specific flavor gradients
const FLAVORS = [
  { id: "chocolate", title: "CHOCOLATE", bg: "#F2C94C", textHex: "#4A2311" }, 
  { id: "strawberry", title: "STRAWBERRY", bg: "#00FFFF", textHex: "#E91E63" }, 
  { id: "vanilla", title: "VANILLA", bg: "#3E2723", textHex: "#FFF3E0" },
  { id: "pistachio", title: "PISTACHIO", bg: "#A5D6A7", textHex: "#1B5E20" }, 
];

export default function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Idle Floating Animations (Continuous Motion)
    gsap.to(".pop-image", {
      y: -20,
      rotation: 2,
      duration: 2.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to(".splash-image", {
      scale: 1.03,
      y: 10,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    // 2. The Scroll Physics (Snappy, but allows escaping to the next section!)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=400%", // Total scroll distance
        pin: true,
        scrub: 1, // Smooth scrubbing
        snap: {
          snapTo: 1 / (FLAVORS.length - 1), // Aggressive snapping to exact flavors
          duration: { min: 0.3, max: 0.8 }, // Fast snap speed
          ease: "power2.inOut",
        },
      },
    });

    // Hide all flavors except the first one initially
    gsap.set(".flavor-group:not(.flavor-group-0)", { autoAlpha: 0 });

    FLAVORS.forEach((flavor, index) => {
      const isLast = index === FLAVORS.length - 1;
      const step = index;

      // Background Color Transition
      if (index > 0) {
        tl.to(bgRef.current, { backgroundColor: flavor.bg, duration: 1 }, step - 0.5);
      }

      // Fade IN current flavor
      tl.to(`.flavor-group-${index}`, { autoAlpha: 1, duration: 0.1 }, step);
      
      tl.fromTo(`.text-${index}`, 
        { opacity: 0, y: 100, clipPath: "inset(0% 0% 100% 0%)" },
        { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power3.out" }, step
      );

      tl.fromTo(`.pop-${index}`, 
        { yPercent: 100, rotation: 35 },
        { yPercent: 0, rotation: 0, duration: 1, ease: "back.out(1.2)" }, step
      );

      tl.fromTo(`.splash-${index}`, 
        { yPercent: 30, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: "power2.out" }, step
      );

      // Fade OUT current flavor (unless it's the last one)
      if (!isLast) {
        tl.to(`.text-${index}`, { opacity: 0, y: -100, duration: 0.5, ease: "power2.in" }, step + 1);
        tl.to(`.pop-${index}`, { yPercent: -100, rotation: -35, duration: 0.5, ease: "power2.in" }, step + 1);
        tl.to(`.splash-${index}`, { yPercent: 30, opacity: 0, duration: 0.5, ease: "power2.in" }, step + 1);
        tl.to(`.flavor-group-${index}`, { autoAlpha: 0, duration: 0.1 }, step + 1.5);
      }
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      {/* Background Canvas */}
      <div ref={bgRef} className="absolute inset-0 z-0 bg-[#F2C94C]" />

      {FLAVORS.map((flavor, index) => (
        <div key={flavor.id} className={`flavor-group flavor-group-${index} absolute inset-0 z-10 flex flex-col items-center justify-center`}>
          
          {/* Typography: Shifted slightly higher, with Flavor Color Gradient */}
          <div className="absolute top-[15%] w-full flex justify-center z-10 pointer-events-none">
            <h1 
              className={`text-${index} text-[14vw] font-black tracking-tighter uppercase`}
              style={{ 
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                // Opacity fades from 0 at the top to 100% color at the bottom
                background: `linear-gradient(to bottom, transparent 15%, ${flavor.textHex} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {flavor.title}
            </h1>
          </div>

          {/* Popsicle: Shifted higher to sit beautifully in the center */}
          <div className={`pop-${index} absolute top-[18%] z-30 w-full flex items-center justify-center pointer-events-none`}>
            <div className="pop-image relative w-[280px] h-[550px] md:w-[380px] md:h-[750px] drop-shadow-2xl">
              <Image 
                src={`/images/${flavor.id}-pop.png`} 
                alt={flavor.title} 
                fill 
                className="object-contain object-center" 
                priority={index === 0} 
              />
            </div>
          </div>

          {/* Liquid Splash: Locked firmly to the bottom */}
          <div className={`splash-${index} absolute bottom-0 z-20 w-full h-[40vh] md:h-[45vh] pointer-events-none`}>
            <div className="splash-image relative w-full h-full">
              <Image 
                src={`/images/${flavor.id}-splash.png`} 
                alt={flavor.title} 
                fill 
                className="object-cover object-bottom" 
                priority={index === 0} 
              />
            </div>
          </div>

        </div>
      ))}

      {/* Clean UI Button */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50">
        <button className="px-10 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm tracking-[0.2em] font-bold rounded-full hover:bg-white hover:text-black hover:scale-105 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
          ORDER NOW
        </button>
      </div>
    </div>
  );
}
