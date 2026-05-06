
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FLAVORS = [
  {
    id: "chocolate",
    label: "Chocolate",
    bgHex: "#F2C94C",
    textHex: "#4A2311",
    popImage: "/images/pop-chocolate.png",
    tagline: "Dark & Rich",
  },
  {
    id: "strawberry",
    label: "Strawberry",
    bgHex: "#00FFFF",
    textHex: "#E91E63",
    popImage: "/images/pop-strawberry.png",
    tagline: "Bold & Bright",
  },
  {
    id: "vanilla",
    label: "Vanilla",
    bgHex: "#3E2723",
    textHex: "#FFF3E0",
    popImage: "/images/pop-vanilla.png",
    tagline: "Classic & Smooth",
  },
  {
    id: "pistachio",
    label: "Pistachio",
    bgHex: "#A5D6A7",
    textHex: "#1B5E20",
    popImage: "/images/pop-pistachio.png",
    tagline: "Nutty & Fresh",
  },
];

export default function TiltShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Set all popsicle images in cards to rotation: 35 initially
      gsap.set(".card-pop-image", { rotation: 35 });

      // When section enters viewport: wait 1 second, then snap all to 0
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(".card-pop-image", {
            rotation: 0,
            ease: "elastic.out(1, 0.75)",
            duration: 1.4,
            delay: 1,
            stagger: 0.1,
          });
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="w-full"
      style={{
        minHeight: "100vh",
        backgroundColor: "#F5F5DC",
        padding: "80px 24px",
        boxSizing: "border-box",
      }}
    >
      {/* Section header */}
      <div className="text-center mb-16">
        <p
          className="font-sans uppercase tracking-[0.25em] text-xs mb-3"
          style={{ color: "#888" }}
        >
          Our Collection
        </p>
        <h2
          className="font-serif"
          style={{
            fontSize: "clamp(40px, 6vw, 80px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: "#1a1a1a",
          }}
        >
          Pick Your Flavor
        </h2>
        <div
          className="mx-auto mt-4"
          style={{
            width: 48,
            height: 3,
            backgroundColor: "#1a1a1a",
            borderRadius: 2,
          }}
        />
      </div>

      {/* CSS Grid — 4 cards side-by-side */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
        className="max-lg:grid-cols-2 max-sm:grid-cols-1"
      >
        {FLAVORS.map((flavor) => (
          <div
            key={flavor.id}
            className="group"
            style={{
              display: "flex",
              flexDirection: "column",
              height: 500,
              borderRadius: 24,
              overflow: "hidden",
              backgroundColor: flavor.bgHex,
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              cursor: "pointer",
              transition: "box-shadow 0.3s ease, transform 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(-6px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 20px 60px rgba(0,0,0,0.18)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 4px 24px rgba(0,0,0,0.08)";
            }}
          >
            {/* Top 80%: popsicle image */}
            <div
              style={{
                flex: "0 0 80%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                className="card-pop-image"
                style={{
                  position: "relative",
                  width: "70%",
                  height: "90%",
                }}
              >
                <Image
                  src={flavor.popImage}
                  alt={flavor.label}
                  fill
                  className="object-contain object-center"
                />
              </div>
            </div>

            {/* Middle 10%: flavor name */}
            <div
              style={{
                flex: "0 0 10%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderTop: `1px solid rgba(0,0,0,0.07)`,
              }}
            >
              <span
                className="font-sans font-black uppercase tracking-[0.15em] text-sm"
                style={{ color: flavor.textHex }}
              >
                {flavor.label}
              </span>
            </div>

            {/* Bottom 10%: ORDER NOW button */}
            <div
              style={{
                flex: "0 0 10%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderTop: `1px solid rgba(0,0,0,0.06)`,
              }}
            >
              <button
                className="font-sans text-xs font-bold uppercase tracking-widest rounded-full px-5 py-2"
                style={{
                  backgroundColor: flavor.textHex,
                  color: flavor.bgHex,
                  border: "none",
                  cursor: "pointer",
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "0.82";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                }}
              >
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
