// src/ghostgum/LandingFlagship.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TextureLensHero from "./TextureLensHero";
import MicroLabTallow from "./MicroLabTallow"; // ✅ classic ingredients section (contains its own headline)

/**
 * Ghost Gum — Landing Flagship
 * Renders: TextureLensHero (hero) → TextureSeries → LocalNav → Ingredients (MicroLabTallow)
 *          → Ritual → Story → Back-to-top + helpers
 */

/* ------------------------ Tokens ------------------------ */
type Colors = {
  bg: string;
  bgAlt: string;
  accent: string;
  text: string;
  textMuted: string;
  divider: string;
};

const readVar = (name: string, fallback: string) =>
  (typeof window !== "undefined" &&
    getComputedStyle(document.documentElement).getPropertyValue(name).trim()) || fallback;

const useTokens = (): Colors => ({
  bg: readVar("--gg-bg", "#F7F4EF"),
  bgAlt: readVar("--gg-bg-alt", "#F1ECE5"),
  accent: readVar("--gg-accent", "#A56332"),
  text: readVar("--gg-text", "#3A2E27"),
  textMuted: readVar("--gg-text-muted", "#5B4E46"),
  divider: readVar("--gg-divider", "#E2DAD3"),
});

/* ------------------------ Reveal-on-scroll ------------------------ */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("reveal-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ------------------------ Buttons (kept) ------------------------ */
const buttonBase =
  "inline-flex items-center gap-2 rounded-2xl border px-6 py-2.5 text-sm tracking-wide transition-[box-shadow,background-color,color] duration-300";
const buttonStyles = `${buttonBase} border-[1px] bg-transparent hover:shadow-[0_0_0_2px_rgba(165,99,50,0.18),0_10px_30px_-10px_rgba(0,0,0,0.15)]`;

/* ------------------------ Editorial Slideshow ------------------------ */
function EditorialSlideshow({
  images,
  alt,
  className = "",
  intervalMs = 3000,
}: {
  images: { src: string; alt?: string }[];
  alt: string;
  className?: string;
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (reduceMotion || images.length <= 1) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs);
    return () => window.clearInterval(id);
  }, [images.length, reduceMotion, intervalMs]);

  const goNext = () => setIndex((i) => (i + 1) % images.length);
  const goPrev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className={`relative w-full h-full ${className}`} aria-label={alt}>
      {images.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt ?? alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      ))}

      {/* Prev/Next controls (kept) */}
      <button
        type="button"
        aria-label="Previous image"
        onClick={goPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border bg-[rgba(255,255,255,0.7)] backdrop-blur-sm flex items-center justify-center"
        style={{ borderColor: "rgba(0,0,0,0.12)" }}
      >
        ←
      </button>
      <button
        type="button"
        aria-label="Next image"
        onClick={goNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border bg-[rgba(255,255,255,0.7)] backdrop-blur-sm flex items-center justify-center"
        style={{ borderColor: "rgba(0,0,0,0.12)" }}
      >
        →
      </button>

      {/* large touch targets */}
      <button aria-hidden className="absolute inset-y-0 left-0 w-1/2" onClick={goPrev} />
      <button aria-hidden className="absolute inset-y-0 right-0 w-1/2" onClick={goNext} />
    </div>
  );
}

/* ------------------------ TextureSeries (kept) ------------------------ */
export type TextureSlide = { id: string; src: string; alt: string };

function TextureSeriesBlock({ colors }: { colors: Colors }) {
  const slides: TextureSlide[] = [
    {
      id: "station",
      src: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1756629400/ChatGPT_Image_Aug_31_2025_02_44_43_PM_dr77vi.jpg",
      alt: "Station worker walking left to right; Ghost Gum jar in tool-bag pocket; candid editorial 35mm aesthetic.",
    },
    {
      id: "beach",
      src: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1756629434/ChatGPT_Image_Aug_31_2025_04_48_24_PM_2_l2yf6d.png",
      alt: "Beach local walking left to right on wet sand; Ghost Gum jar in straw-bag pocket; editorial 35mm aesthetic.",
    },
    {
      id: "city",
      src: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1756629467/ChatGPT_Image_Aug_31_2025_04_10_13_PM_2_vxm7ki.png",
      alt: "Sydney CBD walker left to right; Ghost Gum jar in canvas tote pocket; editorial 35mm aesthetic.",
    },
    {
      id: "tradie",
      src: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1756629475/ChatGPT_Image_Aug_31_2025_04_47_32_PM_2_fhptxn.png",
      alt: "Tradie mid-stride on worksite; Ghost Gum jar tucked in tool-belt pouch; editorial 35mm aesthetic.",
    },
    {
      id: "elder",
      src: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1756629492/ChatGPT_Image_Aug_31_2025_05_01_49_PM_2_q1cmjv.png",
      alt: "Older Australian woman mid-stride from grocer; Ghost Gum jar in woven shopping bag; editorial 35mm aesthetic.",
    },
    {
      id: "student",
      src: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1756629515/ChatGPT_Image_Aug_31_2025_05_30_53_PM_kfw0xo.jpg",
      alt: "Student outside university; Ghost Gum jar in leather messenger-bag pocket; editorial 35mm aesthetic.",
    },
  ];

  return (
    <section className="border-t" style={{ borderColor: colors.divider, background: colors.bg }}>
      <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-10 px-6 py-24 items-center" data-reveal>
        <div className="relative w-full aspect-[3/4] rounded-[28px] overflow-hidden border" style={{ borderColor: colors.divider }}>
          <EditorialSlideshow alt="Texture series" images={slides} intervalMs={4000} />
        </div>

        <div className="flex flex-col justify-center md:pl-2">
          <h2 className="font-serif text-3xl md:text-4xl mb-4 leading-tight" style={{ color: colors.text }}>
            <span>Designed for every texture,</span>
            <span className="block">no matter the walk of life.</span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-6" style={{ color: colors.textMuted }}>
            Formulas that respect natural form. Designed to protect
            and restore without pretending skin should look the same.
          </p>
          <a href="/shop" className="gg-link-soft text-base">Shop the collection →</a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------ Ritual ------------------------ */
function RitualSection({ colors }: { colors: Colors }) {
  const amSrc =
    "https://res.cloudinary.com/dnq6xt54d/image/upload/ChatGPT_Image_Aug_30_2025_10_22_11_AM_ophint.jpg";
  const pmSrc =
    "https://res.cloudinary.com/dnq6xt54d/image/upload/024fd983-340d-4a32-a438-db909543f739_3_n06i8r.jpg";

  return (
    <section
      id="ritual"
      className="px-6 py-24 md:py-32 border-t"
      style={{ borderColor: colors.divider, background: colors.bg }}
    >
      <div className="mx-auto max-w-7xl">
        <header className="text-center mb-12 md:mb-16" data-reveal>
          <h3 className="font-serif text-3xl md:text-4xl" style={{ color: colors.text }}>
            The Ritual
          </h3>
          <p className="font-sans mt-3 text-base md:text-lg" style={{ color: colors.textMuted }}>
            A considered rhythm: protection by day, renewal by night.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-6 md:gap-8 items-stretch mb-12 md:mb-16">
          <figure className="relative col-span-12 md:col-span-5 rounded-[28px] overflow-hidden" data-reveal="scale">
            <img
              src={amSrc}
              alt="Shield & soften — morning ritual"
              className="w-full h-auto object-contain"
              loading="eager"
              decoding="async"
            />
          </figure>

          <div className="col-span-12 md:col-span-7 flex items-center" data-reveal>
            <div className="max-w-md md:max-w-none md:pl-2">
              <h4 className="font-serif text-[30px] md:text-[34px] leading-tight" style={{ color: colors.text }}>
                Shield&nbsp;&amp;&nbsp;soften
              </h4>
              <div
                className="mt-4 mb-5"
                style={{
                  height: 1,
                  background: "linear-gradient(90deg, rgba(0,0,0,.12), rgba(0,0,0,0))",
                }}
              />
              <p className="font-sans leading-relaxed" style={{ color: colors.textMuted }}>
                After cleansing, emulsify a small amount of Protective Barrier Balm and press evenly across the skin to reinforce and soothe.
              </p>
              <div className="mt-6">
                <a href="/product/protective-barrier-balm" className="gg-link-soft">
                  Explore balm →
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-8 items-stretch mb-12 md:mb-16">
          <div className="col-span-12 md:col-span-7 order-2 md:order-1 flex items-center" data-reveal>
            <div className="max-w-md md:max-w-none md:pr-2">
              <h4 className="font-serif text-[30px] md:text-[34px] leading-tight" style={{ color: colors.text }}>
                Replenish&nbsp;&amp;&nbsp;repair
              </h4>
              <div
                className="mt-4 mb-5"
                style={{
                  height: 1,
                  background: "linear-gradient(90deg, rgba(0,0,0,.12), rgba(0,0,0,0))",
                }}
              />
              <p className="font-sans leading-relaxed" style={{ color: colors.textMuted }}>
                Our cold-process soap builds a cushioning lather that lifts the day without stripping. A final layer of signature balm restores suppleness and strengthens your barrier.
              </p>
              <div className="mt-6 flex gap-6">
                <a href="/product/cold-process-soap" className="gg-link-soft">
                  Cold process soap →
                </a>
                <a href="/product/signature-balm" className="gg-link-soft">
                  Signature balm →
                </a>
              </div>
            </div>
          </div>

          <figure className="relative col-span-12 md:col-span-5 order-1 md:order-2 rounded-[28px] overflow-hidden" data-reveal="scale">
            <img
              src={pmSrc}
              alt="Replenish & repair — evening ritual"
              className="w-full h-auto object-cover"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </div>

      <style>{`
        .gg-bead {
          height:1px;
          background: linear-gradient(90deg, rgba(0,0,0,.12) 0, rgba(0,0,0,.06) 60%, rgba(0,0,0,0) 100%);
        }
      `}</style>
    </section>
  );
}

/* ------------------------ Story Teaser (clear bg + translucent card) ------------------------ */
function StoryTeaser({ colors }: { colors: Colors }) {
  const bgMobile =
    "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757558830/ChatGPT_Image_Sep_11_2025_11_58_09_AM_2_ahg7xn.jpg";
  const bgDesktop =
    "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757558830/ChatGPT_Image_Sep_11_2025_11_58_09_AM_egjisc.jpg";

  return (
    <section
      id="story"
      className="relative px-6 py-24 md:py-32 border-t overflow-hidden"
      style={{ borderColor: colors.divider }}
    >
      {/* Crystal-clear texture (no scrim/blur/vignette) */}
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
        <picture>
          <source media="(min-width: 768px)" srcSet={bgDesktop} />
          <img
            src={bgMobile}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>

      {/* Content above bg */}
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Removed the tagline chip */}
        <Link
          to="/story"
          className="group block overflow-hidden rounded-3xl border"
          style={{
            borderColor: "rgba(0,0,0,0.10)",
            // Slight translucency so texture shows faintly through the card
            background: "rgba(247,244,239,0.84)", // tweak 0.80–0.90 to taste
          }}
          data-reveal="scale"
          aria-label="Read our story"
        >
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative w-full h-[260px] md:h-[420px]">
              <EditorialSlideshow
                alt="Foundations & philosophy — editorial landscape stills"
                images={[
                  { src: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1756697816/ChatGPT_Image_Sep_1_2025_12_38_21_PM_pggxlq.jpg" },
                  { src: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1756697755/ChatGPT_Image_Sep_1_2025_12_16_23_PM_SnapseedCopy_wqjzzx.jpg" },
                  { src: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1756697739/ChatGPT_Image_Sep_1_2025_12_13_47_PM_ryycfd.jpg" },
                  { src: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1756860672/ChatGPT_Image_Sep_2_2025_09_37_05_PM_kg9v3z.jpg" },
                ]}
                className="rounded-none"
                intervalMs={3000}
              />
            </div>

            <div className="p-6 md:p-10 flex flex-col justify-center">
              <h3 className="font-serif text-3xl md:text-4xl" style={{ color: colors.text }}>
                Foundations & philosophy
              </h3>
              <p className="mt-3 text-base md:text-lg" style={{ color: colors.textMuted }}>
                Born on a working cattle station in Central Australia.
              </p>
              <div className="mt-6">
                <span className="gg-link-soft text-base">Read our story →</span>
                <div className="text-xs mt-1" style={{ color: colors.textMuted }}>
                  Origins, principles, and what we keep returning to.
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

/** Slim local nav (sticky) */
function LocalNav({ colors }: { colors: Colors }) {
  useEffect(() => {
    const el = document.getElementById("gg-localbar");
    if (!el) return;
    const onScroll = () =>
      el.classList.toggle("shadow-[0_6px_24px_rgba(0,0,0,0.06)]", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { href: "#ingredients-lab", label: "Ingredients" }, // ← anchor matches MicroLabTallow section id
    { href: "#ritual", label: "Ritual" },
    { href: "#story", label: "Story" },
  ];

  return (
    <div
      id="gg-localbar"
      className="sticky top:[64px] md:top-[80px] z-20 border-y bg-[rgba(247,244,239,0.86)] backdrop-blur"
      style={{ borderColor: "#E2DAD3" }}
    >
      <nav className="max-w-7xl mx-auto px-6 overflow-x-auto">
        <ul className="flex gap-4 md:gap-6 py-3">
          {items.map((it) => (
            <li key={it.href}>
              <a href={it.href} className="gg-link-tick text-sm">
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

/* ------------------------ Page ------------------------ */
export default function LandingFlagship() {
  const colors = useTokens();
  useReveal();

  // Set hero time-of-day warmth once (safe if also set inside TextureLensHero)
  useEffect(() => {
    const h = new Date().getHours();
    const clr =
      h < 11 ? "40 12% 96% / 0.10" :
      h < 17 ? "38 10% 95% / 0.08" :
               "36 14% 92% / 0.12";
    document.documentElement.style.setProperty("--hero-warmth", clr);
  }, []);

  return (
    <main id="gg-top-anchor" style={{ background: colors.bg, color: colors.text }}>
      {/* Global surface (paper + grain) */}
      <div aria-hidden className="gg-surface" />

      {/* HERO — TextureLensHero (bark macro + lens highlight) */}
      <TextureLensHero />

      {/* Editorial texture series */}
      <TextureSeriesBlock colors={colors} />

      {/* Sticky local nav */}
      <LocalNav colors={colors} />

      {/* INGREDIENTS — classic Micro-Lab (this IS the #ingredients-lab section) */}
      <MicroLabTallow />

      {/* Ritual */}
      <RitualSection colors={colors} />

      {/* Story teaser */}
      <StoryTeaser colors={colors} />

      {/* Back-to-top */}
      <a
        id="gg-top"
        href="#gg-top-anchor"
        className="fixed bottom-6 right-6 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border text-xs opacity-0 transition-opacity"
        style={{ borderColor: colors.accent, color: colors.text, background: colors.bg }}
        aria-label="Back to top"
        data-reveal
      >
        ↑
      </a>

      {/* Local helpers */}
      <style>{`
        [data-reveal]{opacity:0;transform:translateY(14px);transition:opacity .6s ease,transform .6s ease;}
        [data-reveal="up"]{opacity:0;transform:translateY(16px);}
        [data-reveal="scale"]{opacity:0;transform:scale(.985);} 
        .reveal-in{opacity:1;transform:none;}

        .gg-link-soft{
          position:relative; text-underline-offset: 5px; transition: color .25s ease;
        }
        .gg-link-soft::after{
          content:""; position:absolute; left:0; bottom:-2px; width:0; height:1px;
          background: currentColor; transition: width .25s ease;
        }
        .gg-link-soft:hover::after{ width:100%; }

        .gg-link-tick{
          position:relative; padding:8px 12px; border-radius:999px;
          border:1px solid rgba(47,39,34,.14); color:inherit;
          transition:border-color .2s ease, color .2s ease, background-color .2s ease;
        }
        .gg-link-tick::before{
          content:""; position:absolute; left:10px; top:50%; transform:translateY(-50%);
          width:4px; height:4px; border-radius:50%; background: currentColor; opacity:.28;
        }
        .gg-link-tick:hover{ border-color:rgba(200,138,74,.8); color:#C88A4A; background:rgba(0,0,0,.02); }

        .gg-card{
          border-radius:22px; border:1px solid rgba(255,255,255,.26);
          backdrop-filter:blur(2px);
          background:linear-gradient(180deg, rgba(247,244,239,.34), rgba(247,244,239,.18));
          box-shadow:0 30px 60px rgba(0,0,0,.24), 0 1px 0 rgba(255,255,255,.32) inset;
        }
        @media (min-width:768px){
          .gg-card{ background:linear-gradient(180deg, rgba(247,244,239,.26), rgba(247,244,239,.14)); }
        }
        .gg-vignette--light{
          background:
            radial-gradient(120% 100% at 75% 18%, rgba(0,0,0,0) 0%, rgba(0,0,0,.08) 75%, rgba(0,0,0,.16) 100%),
            linear-gradient(180deg, rgba(0,0,0,.14) 0%, rgba(0,0,0,.06) 42%, rgba(0,0,0,.10) 100%);
        }
        .gg-grain{
          mix-blend-mode: soft-light; opacity:.22;
          background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.06%22/></svg>');
        }
        .gg-surface{ position:fixed; inset:0; z-index:-1; pointer-events:none; }
        .gg-surface::before,.gg-surface::after{ content:""; position:absolute; inset:0; }
        .gg-surface::before{
          background:
            radial-gradient(180% 120% at 50% -20%, rgba(0,0,0,.06) 0%, rgba(0,0,0,0) 60%),
            linear-gradient(180deg, rgba(0,0,0,.02), rgba(0,0,0,0));
          mix-blend-mode:multiply; opacity:.5;
        }
        .gg-surface::after{
          mix-blend-mode:soft-light; opacity:.18;
          background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.06%22/></svg>');
        }
      `}</style>
    </main>
  );
}
