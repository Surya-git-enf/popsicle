
"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Flavor = {
  name: string;
  subtitle: string;
  popImage: string;
  splashImage: string;
  bgColor: string;
};

const FLAVORS: Flavor[] = [
  {
    name: "Chocolate Dream",
    subtitle: "RICH cacao · velvety smooth",
    popImage: "/images/chocolate-pop.png",
    splashImage: "/images/chocolate-splash.png",
    bgColor: "#2C1810",
  },
  {
    name: "Strawberry Bliss",
    subtitle: "FRESH berries · sunny sweetness",
    popImage: "/images/strawberry-pop.png",
    splashImage: "/images/strawberry-splash.png",
    bgColor: "#FFB6C1",
  },
  {
    name: "Vanilla Cloud",
    subtitle: " MADAGASCAR bean · pure elegance",
    popImage: "/images/vanilla-pop.png",
    splashImage: "/images/vanilla-splash.png",
    bgColor: "#FFFDD0",
  },
  {
    name: "Pistachio Luxe",
    subtitle: "SICILIAN nuts · gourmet grace",
    popImage: "/images/pistachio-pop.png",
    splashImage: "/images/pistachio-splash.png",
    bgColor: "#C8E6C9",
  },
];

export default function IceCreamHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const subtitleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const popRefs = useRef<(HTMLDivElement | null)[]>([]);
  const splashRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = useRef<HTMLDivElement>(null);
  const activeDotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        // Create scroll-triggered animations for each flavor section
        sectionsRef.current.forEach((section, i) => {
          if (!section) return;

          const pop = popRefs.current[i];
          const splash = splashRefs.current[i];
          const title = titleRefs.current[i];
          const subtitle = subtitleRefs.current[i];

          // Background color transition
          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom top",
            onUpdate: (self) => {
              const progress = self.progress;
              const nextBg = FLAVORS[(i + 1) % FLAVORS.length].bgColor;
              const currentBg = FLAVORS[i].bgColor;
              
              // Smooth color interpolation
              const r = Math.floor(
                parseInt(currentBg.slice(1, 3), 16) * (1 - progress) +
                  parseInt(nextBg.slice(1, 3), 16) * progress
              );
              const g = Math.floor(
                parseInt(currentBg.slice(3, 5), 16) * (1 - progress) +
                  parseInt(nextBg.slice(3, 5), 16) * progress
              );
              const b = Math.floor(
                parseInt(currentBg.slice(5, 7), 16) * (1 - progress) +
                  parseInt(nextBg.slice(5, 7), 16) * progress
              );
              
              if (containerRef.current) {
                containerRef.current.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
              }
            },
          });

          // Popsicle entrance animation - rising into air
          if (pop) {
            gsap.fromTo(
              pop,
              {
                scale: 0.7,
                y: 80,
                rotateX: 18,
                rotateZ: -8,
                x: -10,
                opacity: 0,
                transformOrigin: "center center",
              },
              {
                scale: 1,
                y: 0,
                rotateX: 0,
                rotateZ: 0,
                x: 0,
                opacity: 1,
                duration: 1.8,
                ease: "power3.out",
                delay: i * 0.1,
                scrollTrigger: {
                  trigger: section,
                  start: "top 60%",
                  toggleActions: "play none none reverse",
                },
              }
            );

            // Gentle breathing float loop after entrance
            gsap.to(pop, {
              y: "+=8",
              rotateZ: "=2",
              duration: 2.5,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
              scrollTrigger: {
                trigger: section,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            });

            // Subtle side drift
            gsap.to(pop, {
              x: "=3",
              duration: 3,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
              scrollTrigger: {
                trigger: section,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            });
          }

          // Splash / cream layer animation
          if (splash) {
            gsap.fromTo(
              splash,
              {
                scale: 0.85,
                y: 40,
                opacity: 0,
                scaleX: 0.9,
                scaleY: 0.9,
                filter: "blur(4px)",
              },
              {
                scale: 1,
                y: 0,
                opacity: 1,
                scaleX: 1,
                scaleY: 1,
                filter: "blur(0px)",
                duration: 1.6,
                ease: "power2.out",
                delay: i * 0.1 + 0.2,
                scrollTrigger: {
                  trigger: section,
                  start: "top 65%",
                  toggleActions: "play none none reverse",
                },
              }
            );

            // Splash breathing in sync with popsicle
            gsap.to(splash, {
              scale: 1.03,
              y: "-=5",
              duration: 2.5,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
              scrollTrigger: {
                trigger: section,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            });

            // Glossy highlight sweep across splash
            const highlight = gsap.fromTo(
              splash,
              {
                backgroundPosition: "-200% 0",
              },
              {
                backgroundPosition: "200% 0",
                duration: 3,
                ease: "linear",
                repeat: -1,
                scrollTrigger: {
                  trigger: section,
                  start: "top 70%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }

          // Title and subtitle fade-in
          if (title) {
            gsap.fromTo(
              title,
              { y: -30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out",
                delay: i * 0.1 + 0.3,
                scrollTrigger: {
                  trigger: section,
                  start: "top 50%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }

          if (subtitle) {
            gsap.fromTo(
              subtitle,
              { y: -20, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out",
                delay: i * 0.1 + 0.5,
                scrollTrigger: {
                  trigger: section,
                  start: "top 55%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }
        });

        // Scroll dots animation
        if (dotsRef.current) {
          activeDotRefs.current.forEach((dot, i) => {
            if (!dot) return;
            
            ScrollTrigger.create({
              trigger: sectionsRef.current[i],
              start: "top center",
              end: "bottom center",
              onEnter: () => gsap.to(dot, { scale: 1.3, backgroundColor: "#000", duration: 0.3 }),
              onLeave: () => gsap.to(dot, { scale: 1, backgroundColor: "rgba(0,0,0,0.3)", duration: 0.3 }),
              onEnterBack: () => gsap.to(dot, { scale: 1.3, backgroundColor: "#000", duration: 0.3 }),
              onLeaveBack: () => gsap.to(dot, { scale: 1, backgroundColor: "rgba(0,0,0,0.3)", duration: 0.3 }),
            });
          });
        }
      }, containerRef);

      return () => ctx.revert();
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: FLAVORS[0].bgColor }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "400px 400px",
        }}
      />

      {/* Scroll dots - right side */}
      <div
        ref={dotsRef}
        className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50"
      >
        {FLAVORS.map((_, i) => (
          <div
            key={i}
            ref={(el) => (activeDotRefs.current[i] = el)}
            className="w-3 h-3 rounded-full transition-all duration-300"
            style={{ backgroundColor: i === 0 ? "#000" : "rgba(0,0,0,0.3)" }}
          />
        ))}
      </div>

      {/* Flavor sections with snap scroll */}
      <div
        ref={(el) => {
          if (el) sectionsRef.current[0] = el;
        }}
        className="relative h-screen w-full snap-start flex flex-col items-center justify-center"
        style={{ scrollSnapAlign: "start" }}
      >
        {FLAVORS.map((flavor, i) => (
          <section
            key={i}
            ref={(el) => {
              if (el) sectionsRef.current[i + 1] = el;
            }}
            className="absolute inset-0 h-screen w-full snap-start flex flex-col items-center justify-center"
            style={{ scrollSnapAlign: "start" }}
          >
            {/* Title */}
            <div
              ref={(el) => (titleRefs.current[i] = el)}
              className="absolute top-16 text-center z-30 px-4"
            >
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium leading-tight"
                style={{ color: i === 2 ? "#1a1a1a" : "#000" }}
              >
                {flavor.name}
              </h1>
            </div>

            {/* Subtitle */}
            <div
              ref={(el) => (subtitleRefs.current[i] = el)}
              className="absolute top-32 text-center z-30"
            >
              <p
                className="text-xs md:text-sm tracking-[0.2em] font-mono uppercase"
                style={{ color: i === 2 ? "#333" : "#333" }}
              >
                {flavor.subtitle}
              </p>
            </div>

            {/* Splash / cream layer (behind popsicle) */}
            <div
              ref={(el) => (splashRefs.current[i] = el)}
              className="absolute bottom-0 z-10 pointer-events-none"
              style={{ width: "60%", maxWidth: "600px" }}
            >
              <Image
                src={flavor.splashImage}
                alt={`${flavor.name} splash`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 80vw, 60vw"
              />
            </div>

            {/* Popsicle (centered, above middle) */}
            <div
              ref={(el) => (popRefs.current[i] = el)}
              className="absolute z-20 pointer-events-none"
              style={{
                top: "42%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "40%",
                maxWidth: "320px",
                maxHeight: "50vh",
              }}
            >
              <Image
                src={flavor.popImage}
                alt={flavor.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 60vw, 40vw"
                priority={i === 0}
              />
            </div>
          </section>
        ))}
      </div>

      {/* CSS for snap scrolling and smooth behavior */}
      <style jsx>{`
        .snap-start {
          scroll-snap-align: start;
        }
        
        :global(html) {
          scroll-behavior: smooth;
        }
        
        :global(body) {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        
        /* Mobile optimization */
        @media (max-width: 768px) {
          .absolute.top-16 {
            top: 12%;
          }
          .absolute.top-32 {
            top: 22%;
          }
          .absolute.bottom-0 {
            bottom: -5%;
          }
          .absolute.z-20 {
            top: 45%;
          }
        }
      `}</style>
    </div>
  );
                  }
