"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FLAVORS = [
  { id: "chocolate", name: "Chocolate" },
  { id: "strawberry", name: "Strawberry" },
  { id: "vanilla", name: "Vanilla" },
  { id: "pistachio", name: "Pistachio" },
];

export default function TiltShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Initial state: Tilted
    gsap.set(".showcase-pop", { rotation: 35, transformOrigin: "bottom center" });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top center", // Triggers when the top of this section hits the center of the screen
      onEnter: () => {
        // The 1-second delay before straightening out
        gsap.to(".showcase-pop", {
          rotation: 0,
          duration: 1.2,
          delay: 1, // 1 second delay as requested
          ease: "elastic.out(1, 0.75)", // Nice snappy 3D spring effect
          stagger: 0.1 // Slight cascade effect for premium feel
        });
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen bg-[#F5F5DC] flex flex-col items-center justify-center py-20">
      <div className="container mx-auto px-4">
        
        <h2 className="text-4xl md:text-6xl text-center font-bold text-[#3E2723] mb-20 tracking-tight">
          Explore the Collection
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {FLAVORS.map((flavor) => (
            <div key={flavor.id} className="flex flex-col items-center">
              {/* Image Container */}
              <div className="relative w-[150px] h-[300px] md:w-[200px] md:h-[400px] mb-6">
                <Image
                  src={`/images/${flavor.id}-pop.png`}
                  alt={flavor.name}
                  fill
                  className="showcase-pop object-contain drop-shadow-2xl"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-[#3E2723] uppercase tracking-widest">
                {flavor.name}
              </h3>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button className="px-10 py-4 bg-[#3E2723] text-[#F5F5DC] font-bold rounded-full hover:bg-black transition-colors shadow-xl">
            CHOOSE YOUR FLAVOR
          </button>
        </div>

      </div>
    </section>
  );
}

