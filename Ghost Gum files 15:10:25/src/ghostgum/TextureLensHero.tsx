// src/ghostgum/TextureLensHero.tsx
import React from "react";
import { Link } from "react-router-dom";

type Colors = { text: string };
const readVar = (name: string, fallback: string) =>
  (typeof window !== "undefined" &&
    getComputedStyle(document.documentElement).getPropertyValue(name).trim()) || fallback;

const useTokens = (): Colors => ({
  text: readVar("--gg-text", "#23211F"),
});

export default function TextureLensHero() {
  useTokens();

  const desktopSrc =
    "https://res.cloudinary.com/dltcukojz/image/upload/v1760489068/ChatGPT_Image_Sep_2_2025_05_21_28_PM_2_xpl18a.jpg";
  const mobileSrc =
    "https://res.cloudinary.com/dltcukojz/image/upload/v1760489068/ChatGPT_Image_Sep_2_2025_05_21_28_PM_2_xpl18a.jpg";

  // keep time-of-day warmth
  React.useEffect(() => {
    const h = new Date().getHours();
    const clr =
      h < 11 ? "40 12% 96% / 0.10" :
      h < 17 ? "38 10% 95% / 0.08" :
               "36 14% 92% / 0.12";
    document.documentElement.style.setProperty("--hero-warmth", clr);
  }, []);

  return (
    <section id="gg-hero" className="relative min-h-[100svh] overflow-hidden" aria-label="Ghost Gum — hero">
      {/* Full-bleed imagery */}
      <div className="absolute inset-0" aria-hidden>
        <img
          src={desktopSrc}
          alt=""
          className="hidden md:block h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <img
          src={mobileSrc}
          alt=""
          className="block md:hidden h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero-scrim" aria-hidden />
        <div className="hero-warmth" aria-hidden />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 h-full">
        <div
          className="flex h-[100svh] items-center justify-center text-center
                     pt-[calc(env(safe-area-inset-top)+8px)]
                     pb-[calc(env(safe-area-inset-bottom)+12px)]"
        >
          <div className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl px-0 md:px-2 mx-auto">
            <h1
              className="heading-quiet"
              style={{
                fontSize: "clamp(37px, 6.12vw, 78px)",
                lineHeight: 1.06,
                letterSpacing: "-0.01em",
                color: "#F5F1E6",
                marginInline: "auto",
                maxWidth: "18ch",
              }}
            >
              Simplicity, Embodied.
            </h1>

            {/* 40% larger tagline */}
            <p
              className="mt-4 mx-auto"
              style={{
                fontSize: "clamp(18px, 2.12vw, 24px)", // was clamp(13px, 1.512vw, 17px)
                lineHeight: 1.45,
                color: "rgba(245,241,230,0.92)",
                maxWidth: "52ch",
              }}
            >
              Pure form, essential ingredients, quiet efficacy.
            </p>

            {/* Buttons +15% */}
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <Link to="/shop" className="glass-btn">Shop</Link>
              <Link to="/vessels" className="glass-btn">Vessels</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Local styles */}
      <style>{`
        #gg-hero .hero-scrim{
          position:absolute; inset:0; pointer-events:none;
          background: radial-gradient(120% 120% at 50% 40%,
            rgba(245,241,234,0) 0%,
            rgba(245,241,234,.38) 55%,
            rgba(245,241,234,.68) 92%);
          mix-blend-mode: multiply;
        }
        @media (max-width: 768px){
          #gg-hero .hero-scrim{
            background: radial-gradient(130% 130% at 50% 35%,
              rgba(245,241,234,0) 0%,
              rgba(245,241,234,.46) 52%,
              rgba(245,241,234,.74) 92%);
          }
        }
        #gg-hero .hero-warmth{
          position:absolute; inset:0; pointer-events:none;
          background: color-mix(in oklch, oklch(var(--hero-warmth, 0.92 0.02 85)) , transparent);
        }

        /* Glass button — +15% size */
        .glass-btn{
          display:inline-flex; align-items:center; justify-content:center;
          padding: 10.5px 18.5px; /* was 9px 16px */
          font-size: clamp(14px, 1.33vw, 16px); /* was clamp(12px, 1.152vw, 14px) */
          color:#F5F1E6; text-decoration:none;
          border-radius: 999px;
          border: 1px solid rgba(245,241,230,0.35);
          background: linear-gradient(
                      to bottom,
                      rgba(255,255,255,0.16),
                      rgba(255,255,255,0.06)
                    );
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.18) inset,
                      0 1px 0 rgba(255,255,255,0.18);
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
        }
        .glass-btn:hover{
          transform: translateY(-1px);
          border-color: rgba(245,241,230,0.55);
          box-shadow: 0 10px 34px rgba(0,0,0,0.22) inset,
                      0 2px 10px rgba(0,0,0,0.18);
        }
        .glass-btn:active{ transform: translateY(0); }
      `}</style>
    </section>
  );
}
