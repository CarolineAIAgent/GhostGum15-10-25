// src/pages/Story.tsx
import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Ghost Gum — Story
 * Editorial, copy-first. Belgiano (serif) + Manrope (sans).
 * Effects: reveal-on-scroll, smooth #hash scroll, calm borders/blur for continuity.
 */

const C = {
  bg: "#F7F4EF",
  bgAlt: "#F5F1E6",
  ink: "#2F2722",
  mute: "#6B5E56",
  accent: "#A56332",
  divider: "#E2DAD3",
  glass: "rgba(255,255,255,0.55)",
};

/* ------------------------ Utilities (same as Sustainability) ------------------------ */

/** Smoothly scroll to #hash targets whenever the hash changes */
function useHashScroll() {
  const location = useLocation();
  useEffect(() => {
    const hash = location.hash?.replace("#", "");
    if (!hash) return;
    // wait one frame so layout is painted
    requestAnimationFrame(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);
}

/** Lightweight reveal-on-scroll (IntersectionObserver) */
function useReveal() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ------------------------ Page ------------------------ */

// ---- Cloudflare Stream video ----
const CF_BASE = "https://customer-07l07k6e7wvy8nzk.cloudflarestream.com";
const CF_VIDEO_ID = "f587fd81c65c1aad957acd74cd5db463"; // Stephen talking
const CF_IFRAME_SRC =
  `${CF_BASE}/${CF_VIDEO_ID}/iframe?autoplay=1&muted=1&playsinline=1&preload=auto&controls=1`;

export default function StoryPage() {
  useHashScroll();
  useReveal();

  return (
    <main style={{ background: C.bg, color: C.ink }}>
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 py-28 md:py-36 text-center">
        <h1 className="font-serif text-5xl md:text-7xl leading-tight" data-reveal>
          From land, a philosophy.
        </h1>
        <p
          className="mt-6 max-w-3xl mx-auto text-lg md:text-xl font-sans"
          style={{ color: C.mute }}
          data-reveal
        >
          Ghost Gum is born of Anningie soil — a continuity of people and place,
          where endurance and care shape everything we make.
        </p>
      </section>

      {/* FILM — autoplay (muted), deep-link friendly, fullscreen attempt */}
      <FilmSection />

      {/* EDITORIAL FEATURE A — Ted (heritage, 5:7 portrait) */}
      <section
        id="philosophy"
        className="px-6 py-28 md:py-32 border-t"
        style={{ borderColor: C.divider }}
      >
        <div className="mx-auto max-w-6xl grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6 md:pr-10" data-reveal>
            <SmallLabel>c. 1940</SmallLabel>
            <h2 className="font-serif text-3xl md:text-4xl mt-2">
              Across the desert, on horseback
            </h2>
            <p
              className="font-sans mt-4 text-base md:text-lg"
              style={{ color: C.mute }}
            >
              A nine-month, two-thousand-kilometre droving of fifteen-hundred cattle from
              Buffalo Springs to Mulga Park — endurance through harsh country. The discipline,
              patience, and respect for land from those journeys still shape how we make things today.
            </p>
          </div>

          <div className="md:col-span-6" data-reveal>
            <FigureImage
              cloudName="dnq6xt54d"
              publicId="ARTI-2017-05-Ted-Fogarty-Tribute-1940-735x1000_zwzi3w"
              alt="Ted Fogarty during an early droving journey"
              aspect="5/7"
              height={{ base: 480, md: 560 }}
            />
          </div>
        </div>
      </section>

      {/* EDITORIAL FEATURE B — Stewardship */}
      <section className="px-6 py-24 md:py-28">
        <div className="mx-auto max-w-6xl grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6 order-last md:order-none" data-reveal>
            <FigureImage
              cloudName="dnq6xt54d"
              publicId="7e99cac0201c69149a60ed7ecac6911f_ghp8av"
              alt="Stations shaped by stewardship"
              aspect="4/5"
              height={{ base: 440, md: 520 }}
            />
          </div>
          <div className="md:col-span-6 md:pl-10" data-reveal>
            <SmallLabel>1950s–1970s</SmallLabel>
            <h2 className="font-serif text-3xl md:text-4xl mt-2">
              Stations shaped by stewardship
            </h2>
            <p
              className="font-sans mt-4 text-base md:text-lg"
              style={{ color: C.mute }}
            >
              Across vast country, one principle held: improve the land; raise cattle with freedom
              and respect. That quiet restraint informs our formulations — fewer parts, lasting results.
            </p>
          </div>
        </div>
      </section>

      {/* QUIET STATEMENT — present day */}
      <section
        className="px-6 py-28 md:py-32 border-t text-center"
        style={{ borderColor: C.divider, background: C.bgAlt }}
      >
        <div data-reveal>
          <SmallLabel>Today</SmallLabel>
          <h2 className="font-serif text-3xl md:text-4xl mt-2">Anningie informs the hand</h2>
          <p
            className="font-sans mt-4 max-w-3xl mx-auto text-lg"
            style={{ color: C.mute }}
          >
            Provenance you can read. A bond with place that outlasts seasons. Ghost Gum is the practice made product.
          </p>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section
        className="px-6 py-24 md:py-28 text-center border-t"
        style={{ borderColor: C.divider }}
      >
        <div data-reveal>
          <h3 className="font-serif text-3xl md:text-4xl">A story still being written.</h3>
          <p
            className="mt-3 font-sans max-w-2xl mx-auto text-lg"
            style={{ color: C.mute }}
          >
            Each jar carries a philosophy shaped by generations on this land.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center rounded-2xl border px-6 py-3 font-sans text-sm hover:border-[#C88A4A] hover:text-[#C88A4A] transition-colors"
              style={{ borderColor: C.ink, color: C.ink, background: C.glass }}
            >
              Shop the Core Collection →
            </Link>
          </div>
        </div>
      </section>

      {/* tiny CSS for reveal (same pattern as Sustainability) */}
      <style>{`
        [data-reveal]{opacity:0;transform:translateY(14px);transition:opacity .6s ease,transform .6s ease;}
        .reveal-in{opacity:1;transform:translateY(0);}
      `}</style>
    </main>
  );
}

/* ------------------------ Film section ------------------------ */

function FilmSection() {
  const location = useLocation();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // When deep-linked to #film or #anningie: scroll, then (attempt) fullscreen.
  useEffect(() => {
    const wantsFilm =
      location.hash === "#film" || location.hash === "#anningie";
    if (!wantsFilm) return;

    wrapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    const t = window.setTimeout(async () => {
      try {
        await iframeRef.current?.requestFullscreen?.();
      } catch {
        // Browser may require user gesture – fail silently.
      }
    }, 150);

    return () => window.clearTimeout(t);
  }, [location.hash]);

  return (
    <section
      id="film"
      aria-labelledby="film-title"
      className="px-6 py-20 md:py-28 border-t"
      style={{ borderColor: C.divider, background: C.bgAlt }}
    >
      {/* duplicate anchor for older menu links */}
      <div id="anningie" className="sr-only" />
      <div className="max-w-5xl mx-auto" ref={wrapRef} data-reveal>
        <h2 id="film-title" className="sr-only">
          Anningie Station — Film
        </h2>
        <div
          className="relative pt-[56.25%] rounded-3xl overflow-hidden shadow-sm border"
          style={{ borderColor: C.divider }}
        >
          <iframe
            ref={iframeRef}
            src={CF_IFRAME_SRC}
            title="Stephen Fogarty — Anningie Station"
            loading="lazy"
            className="absolute inset-0 h-full w-full"
            style={{ border: "none" }}
            allow="autoplay; fullscreen; picture-in-picture; accelerometer; gyroscope"
            allowFullScreen
          />
        </div>
        <p className="mt-3 text-center text-sm text-[#2B2B2B]/60">
          Tip: If the video started muted, use the speaker icon to unmute.
        </p>
      </div>
    </section>
  );
}

/* ------------------------ Building blocks ------------------------ */

function SmallLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-sans text-[11px] tracking-[0.15em] uppercase"
      style={{ color: C.mute }}
    >
      {children}
    </div>
  );
}

/**
 * FigureImage keeps portrait integrity with explicit aspect + fixed height.
 */
function FigureImage({
  cloudName,
  publicId,
  alt,
  aspect = "4/3",
  height = { base: 420, md: 520 },
}: {
  cloudName: string;
  publicId: string;
  alt: string;
  aspect?: string; // CSS aspect-ratio string, e.g., "5/7"
  height?: { base: number; md: number };
}) {
  const src = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}.jpg`;
  const styleImgBase: React.CSSProperties = {
    aspectRatio: aspect,
    height: `${height.base}px`,
  };

  return (
    <figure className="rounded-3xl overflow-hidden flex justify-center">
      {/* Keep natural ratio; avoid stretch via w-auto + fixed height */}
      <img
        src={src}
        alt={alt}
        className="w-auto object-cover"
        style={styleImgBase}
        sizes="(min-width: 768px) 560px, 480px"
      />
      <style>{`
        @media (min-width: 768px) {
          figure img { height: ${height.md}px; }
        }
      `}</style>
    </figure>
  );
}
