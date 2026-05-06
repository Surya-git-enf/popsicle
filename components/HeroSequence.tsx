
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

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
    // 1. Great Love Motions (Continuous Cinematic Floating)
    gsap.to(".pop-image", {
      y: -25,
      rotation: 3,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to(".splash-image", {
      scale: 1.04,
      y: 15,
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    // Hide all flavors initially except the first
    gsap.set(".flavor-group:not(.flavor-group-0)", { autoAlpha: 0 });
    gsap.set(".pop:not(.pop-0)", { yPercent: 100, rotation: 35 });
    gsap.set(".splash:not(.splash-0)", { yPercent: 40, opacity: 0 });
    gsap.set(".text:not(.text-0)", { opacity: 0, y: 50, scale: 0.95 });

    // 2. Invisible Trigger Architecture with Snapping
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      snap: {
        snapTo: 1 / (FLAVORS.length - 1), // Locks scroll wheel to exactly 1 flavor
        duration: { min: 0.5, max: 1 },
        ease: "power2.inOut"
      }
    });

    FLAVORS.forEach((flavor, index) => {
      ScrollTrigger.create({
        trigger: `.trigger-${index}`,
        start: "top center", // Fires exactly when the invisible box hits the middle
        onEnter: () => animateIn(index),
        onEnterBack: () => animateIn(index),
      });
    });

    // The function that orchestrates the beautiful reveals
    let currentIndex = 0;
    const animateIn = (index: number) => {
      if (index === currentIndex) return;
      const prevIndex = currentIndex;
      currentIndex = index;

      // Crossfade Background
      gsap.to(bgRef.current, { backgroundColor: FLAVORS[index].bg, duration: 1.2, ease: "power2.inOut" });

      // Fade out previous flavor smoothly
      gsap.to(`.flavor-group-${prevIndex}`, { autoAlpha: 0, duration: 0.6, ease: "power2.out" });
      gsap.to(`.pop-${prevIndex}`, { yPercent: -50, rotation: -20, duration: 0.8, ease: "power2.in" });

      // Fade in new flavor with majestic easing
      gsap.to(`.flavor-group-${index}`, { autoAlpha: 1, duration: 0.1 });
      
      gsap.fromTo(`.text-${index}`, 
        { opacity: 0, y: 80, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power4.out" }
      );

      gsap.fromTo(`.pop-${index}`, 
        { yPercent: 100, rotation: 35 },
        { yPercent: 0, rotation: 0, duration: 1.5, ease: "expo.out" } // Dramatic, high-end snap into place
      );

      gsap.fromTo(`.splash-${index}`, 
        { yPercent: 40, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.2 }
      );
    };
  }, { scope: containerRef });

  return (
    // 400vh tall to allow pure native scrolling without trapping the user
    <div ref={containerRef} className="relative w-full h-[400vh]">
      
      {/* Invisible Triggers to track scroll position */}
      {FLAVORS.map((_, i) => (
        <div key={`trigger-${i}`} className={`trigger-${i} absolute w-full h-screen`} style={{ top: `${i * 100}vh` }} />
      ))}

      {/* Sticky Visual Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* Background Canvas */}
        <div ref={bgRef} className="absolute inset-0 z-0 bg-[#F2C94C]" />

        {FLAVORS.map((flavor, index) => (
          <div key={flavor.id} className={`flavor-group flavor-group-${index} absolute inset-0 z-10 flex flex-col items-center justify-center`}>
            
            {/* Typography: Shifted much higher, low to high opacity gradient */}
            <div className="absolute top-[8%] md:top-[10%] w-full flex justify-center z-10 pointer-events-none">
              <h1 
                className={`text text-${index} text-[15vw] font-black tracking-tighter uppercase`}
                style={{ 
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  background: `linear-gradient(to bottom, rgba(255,255,255,0) 10%, ${flavor.textHex} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {flavor.title}
              </h1>
            </div>

            {/* Popsicle: Shifted higher */}
            <div className={`pop pop-${index} absolute top-[12%] z-30 w-full flex items-center justify-center pointer-events-none`}>
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

            {/* Splash Base */}
            <div className={`splash splash-${index} absolute bottom-0 z-20 w-full h-[40vh] md:h-[45vh] pointer-events-none`}>
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
    </div>
  );
}
