
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, Observer);

const FLAVORS = [
  { id: "chocolate", title: "CHOCOLATE", bg: "#FFD700" },
  { id: "strawberry", title: "STRAWBERRY", bg: "#00FFFF" },
  { id: "vanilla", title: "VANILLA", bg: "#3E2723" },
  { id: "pistachio", title: "PISTACHIO", bg: "#556B2F" },
];

export default function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const isAnimating = useRef(false);

  useGSAP(() => {
    const sections = gsap.utils.toArray(".flavor-group") as HTMLElement[];
    const totalSections = sections.length;

    gsap.set(sections.slice(1), { autoAlpha: 0 });
    gsap.set(".pop", { yPercent: 100, rotation: 35 });
    gsap.set(".splash", { yPercent: 50, opacity: 0 });
    gsap.set(".text-bg", { opacity: 0, clipPath: "inset(0% 0% 100% 0%)" });

    // Initial load animation
    gsap.to(sections[0].querySelector(".pop"), { yPercent: 0, rotation: 0, duration: 1, ease: "power3.out" });
    gsap.to(sections[0].querySelector(".splash"), { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out" });
    gsap.to(sections[0].querySelector(".text-bg"), { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power3.out" });

    const gotoSection = (index: number, direction: number) => {
      if (isAnimating.current || index < 0 || index >= totalSections) return;
      isAnimating.current = true;

      const currentSection = sections[currentIndex.current];
      const nextSection = sections[index];

      const tl = gsap.timeline({
        onComplete: () => {
          currentIndex.current = index;
          isAnimating.current = false;
        }
      });

      tl.to(bgRef.current, { backgroundColor: FLAVORS[index].bg, duration: 0.8, ease: "power2.inOut" }, 0);

      tl.to(currentSection, { autoAlpha: 0, duration: 0.5 }, 0);
      tl.to(currentSection.querySelector(".pop"), { yPercent: -50 * direction, duration: 0.5 }, 0);

      tl.set(nextSection, { autoAlpha: 1 }, 0);
      tl.fromTo(nextSection.querySelector(".pop"), 
        { yPercent: 100 * direction, rotation: 35 * direction },
        { yPercent: 0, rotation: 0, duration: 1, ease: "power3.out" }, 
      0.2);
      
      tl.fromTo(nextSection.querySelector(".splash"), 
        { yPercent: 50 * direction, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out" }, 
      0.2);

      tl.fromTo(nextSection.querySelector(".text-bg"), 
        { opacity: 0, clipPath: "inset(0% 0% 100% 0%)" },
        { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power3.out" }, 
      0.2);
    };

    const intentObserver = Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      // Scrolling DOWN the page -> Next Flavor
      onUp: () => { 
        if (!isAnimating.current && currentIndex.current < totalSections - 1) {
          gotoSection(currentIndex.current + 1, 1);
        }
      },
      // Scrolling UP the page -> Previous Flavor
      onDown: () => { 
        if (!isAnimating.current && currentIndex.current > 0) {
          gotoSection(currentIndex.current - 1, -1);
        }
      },
      tolerance: 10,
      preventDefault: true
    });

    ScrollTrigger.create({
      trigger: containerRef.current,
      pin: true,
      start: "top top",
      end: "+=300%", 
      onEnter: () => intentObserver.enable(),
      onLeave: () => intentObserver.disable(),
      onEnterBack: () => intentObserver.enable(),
      onLeaveBack: () => intentObserver.disable(),
    });

    return () => intentObserver.kill();

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 z-0 bg-[#FFD700]" />

      {FLAVORS.map((flavor, index) => (
        <div key={flavor.id} className="flavor-group absolute inset-0 z-10 flex items-center justify-center">
          
          <h1 
            className="text-bg absolute text-[12vw] font-black tracking-tighter uppercase z-10"
            style={{ 
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            {flavor.title}
          </h1>

          <div className="absolute z-30 w-full h-full flex items-center justify-center pointer-events-none">
            <div className="relative w-[300px] h-[600px] md:w-[400px] md:h-[800px] flex items-center justify-center">
              <Image src={`/images/${flavor.id}-pop.png`} alt={flavor.title} fill className="pop object-contain object-center" priority={index === 0} />
            </div>
          </div>

          <div className="absolute bottom-0 z-20 w-full h-[40vh] md:h-[50vh] pointer-events-none flex items-end justify-center">
            <Image src={`/images/${flavor.id}-splash.png`} alt={flavor.title} fill className="splash object-cover object-bottom" priority={index === 0} />
          </div>
        </div>
      ))}
    </div>
  );
}
