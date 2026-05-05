
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
    gsap.set(".showcase-pop", { rotation: 35, transformOrigin: "center center" });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top center",
      onEnter: () => {
        gsap.to(".showcase-pop", {
          rotation: 0,
          duration: 1.2,
          delay: 1,
          ease: "elastic.out(1, 0.75)",
          stagger: 0.1
        });
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen bg-[#F5F5DC] flex flex-col items-center justify-center py-20 z-20">
      <div className="container mx-auto px-4 w-full">
        
        <h2 className="text-4xl md:text-6xl text-center font-bold text-[#3E2723] mb-16 tracking-tight">
          Explore the Collection
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
          {FLAVORS.map((flavor) => (
            <div key={flavor.id} className="flex flex-col w-full h-[450px] md:h-[550px]">
              
              {/* 80% Height - Image centered */}
              <div className="h-[80%] w-full relative flex items-center justify-center">
                <div className="relative w-[80%] h-[90%]">
                  <Image
                    src={`/images/${flavor.id}-pop.png`}
                    alt={flavor.name}
                    fill
                    className="showcase-pop object-contain object-center drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* 10% Height - Name */}
              <div className="h-[10%] w-full flex items-center justify-center">
                <h3 className="text-lg md:text-xl font-bold text-[#3E2723] uppercase tracking-widest m-0">
                  {flavor.name}
                </h3>
              </div>

              {/* 10% Height - Button */}
              <div className="h-[10%] w-full flex items-center justify-center">
                <button className="px-6 py-2.5 bg-[#3E2723] text-[#F5F5DC] text-xs md:text-sm font-bold rounded-full hover:bg-black transition-colors shadow-lg">
                  ORDER NOW
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
