// src/pages/Vessels.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ShoppingBag, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { VESSELS } from "../data/vessels";
import { useCart } from "../context/CartContext";

/* ---------------- Tokens ---------------- */
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
    getComputedStyle(document.documentElement).getPropertyValue(name).trim()) ||
  fallback;

const useTokens = (): Colors => ({
  bg: readVar("--gg-bg", "#F7F4EF"),
  bgAlt: readVar("--gg-bg-alt", "#F1ECE5"),
  accent: readVar("--gg-accent", "#A56332"),
  text: readVar("--gg-text", "#3A2E27"),
  textMuted: readVar("--gg-text-muted", "#5B4E46"),
  divider: readVar("--gg-divider", "#E2DAD3"),
});

/* ---------------- Reveal ---------------- */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("reveal-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ---------------- Page ---------------- */
export default function VesselsPage() {
  const colors = useTokens();
  useReveal();

  const { cartItems, cartTotal } = useCart();
  const [collectionOpen, setCollectionOpen] = useState(false);

  // ----- HERO SLIDES -----
  const cldBase = "https://res.cloudinary.com/dnq6xt54d/image/upload";

  // Desktop (16:9 art direction)
  const pathDesk1 = "v1756945496/ChatGPT_Image_Sep_3_2025_09_36_01_AM_tdg7xa.jpg";
  const pathDesk2 = "v1756945495/ChatGPT_Image_Sep_3_2025_04_26_10_PM_fycsxy.jpg";
  const pathDesk3 = "v1756945496/ChatGPT_Image_Sep_3_2025_05_11_51_PM_x1jx43.jpg";

  // Mobile 1:1 (preserve original aspect)
  const pathMobile1 = "v1756945831/ChatGPT_Image_Sep_3_2025_09_36_01_AM_2_xvyvsm.jpg";
  const pathMobile2 = "v1756945839/ChatGPT_Image_Sep_3_2025_04_16_42_PM_2_jtlswv.png";
  const pathMobile3 = "v1756945831/ChatGPT_Image_Sep_3_2025_05_11_51_PM_2_yxbbra.jpg";

  // Helpers for Cloudinary transforms
  const makeDesktopTablet = (path: string, center = false) => {
    const g = center ? "g_center" : "g_auto";
    return {
      desktop: `${cldBase}/f_auto,q_85,w_1920,ar_16:9,c_fill,${g}/${path}`,
      tablet: `${cldBase}/f_auto,q_85,w_1400,ar_4:3,c_fill,${g}/${path}`,
    };
  };
  const makeMobileSquare = (path: string) => `${cldBase}/f_auto,q_85,w_1080,c_fit/${path}`;

  const slides = useMemo(
    () => [
      {
        ...makeDesktopTablet(pathDesk1, false),
        mobile: makeMobileSquare(pathMobile1),
        alt: "Ghost Gum vessel — form shaped through time and place.",
        objClass: "object-[50%_44%] object-contain md:object-cover md:object-center",
        desktopObjClass: "md:object-[50%_48%] lg:object-center",
      },
      {
        ...makeDesktopTablet(pathDesk2, true),
        mobile: makeMobileSquare(pathMobile2),
        alt: "Ghost Gum vessel — sculptural rock and kaolin provenance.",
        objClass: "object-contain md:object-cover md:object-center",
      },
      {
        ...makeDesktopTablet(pathDesk3, true),
        mobile: makeMobileSquare(pathMobile3),
        alt: "Ghost Gum vessel — editorial minimalism in natural form.",
        objClass: "object-contain md:object-cover md:object-center",
      },
    ],
    []
  );

  // ----- Cloudinary URL transformers that also work with FULL URLs -----
  const injectTransform = (urlOrPath: string, transform: string) => {
    // If a full Cloudinary URL was passed (contains /image/upload/), inject transform there.
    if (urlOrPath.includes("/image/upload/")) {
      return urlOrPath.replace("/image/upload/", `/image/upload/${transform}/`);
    }
    // Otherwise treat it as a path (no leading version required).
    return `${cldBase}/${transform}/${urlOrPath}`;
  };
  const cldCard4x5 = (u: string) => injectTransform(u, "f_auto,q_85,w_1200,ar_4:5,c_fill,g_auto");
  const cldPdpXL  = (u: string) => injectTransform(u, "f_auto,q_85,w_2000,c_fit");

  // ----- Riverstone (using your full URLs) -----
  const riverstoneFull = {
    primary: "https://res.cloudinary.com/dnq6xt54d/image/upload/ChatGPT_Image_Sep_5_2025_03_59_27_PM_xbeczi.jpg",
    secondary: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757055084/ChatGPT_Image_Sep_5_2025_04_05_09_PM_u42ofs.png",
  };

  // ----- Slideshow state -----
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const goTo = (i: number) => setIndex(i);

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isPaused, slides.length]);

  const aspectByIndex = (i: number) =>
    ["aspect-[3/4]", "aspect-square", "aspect-[4/5]"][i % 3];

  return (
    <main style={{ background: colors.bg, color: colors.text }}>
      {/* ==================== MOBILE HERO (no black bars, with overlay title) ==================== */}
      <section
        className="md:hidden"
        aria-roledescription="carousel"
        aria-label="Vessels hero slideshow (mobile)"
      >
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          aria-live="polite"
        >
          <img
            src={slides[index].mobile}
            alt={slides[index].alt}
            className="block w-full h-auto object-contain"
            loading={index === 0 ? "eager" : "lazy"}
            style={{ background: "transparent" }}
          />
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div
              className={`px-4 text-center transition-opacity duration-400 ${
                index === 0 ? "opacity-100" : "opacity-0"
              } -translate-y-[8%]`}
              data-reveal="up"
            >
              <h1
                className="font-serif text-[36px] leading-[1.05] text-center"
                style={{
                  color: "#F5F1E6",
                  letterSpacing: "-0.02em",
                  textShadow: "0 2px 6px rgba(0,0,0,0.4)",
                }}
              >
                Vessels
              </h1>
            </div>
          </div>
        </div>

        {/* Dots & controls */}
        <div className="mt-3 mb-2 flex items-center justify-center gap-3 px-4">
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="rounded-full border px-3 py-2 text-sm"
            style={{ borderColor: "rgba(0,0,0,0.15)", color: colors.text }}
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2 rounded-full px-3 py-1">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  i === index ? "w-6" : "opacity-60"
                }`}
                style={{ background: "rgba(50,45,40,0.6)" }}
              />
            ))}
          </div>
          <button
            onClick={next}
            aria-label="Next slide"
            className="rounded-full border px-3 py-2 text-sm"
            style={{ borderColor: "rgba(0,0,0,0.15)", color: colors.text }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* ==================== DESKTOP/TABLET HERO (overlay title) ==================== */}
      <section
        className="relative hidden md:flex h-[74vh] min-h-[520px] items-center justify-center overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-roledescription="carousel"
        aria-label="Vessels hero slideshow (desktop)"
      >
        {/* Slides */}
        <div className="absolute inset-0" aria-live="polite">
          {slides.map((s, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === index ? 1 : 0 }}
              aria-hidden={i === index ? "false" : "true"}
            >
              <picture>
                <source media="(max-width: 1199px)" srcSet={s.tablet} />
                <img
                  src={s.desktop}
                  alt={s.alt}
                  className={`h-full w-full ${s.objClass} ${s.desktopObjClass ?? ""}`}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </picture>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.12) 100%)",
                }}
              />
            </div>
          ))}
        </div>

        {/* Title */}
        <div
          className={`absolute inset-0 z-10 hidden md:flex items-center justify-center transition-opacity duration-500 ${
            index === 0 ? "opacity-100" : "opacity-0"
          }`}
          data-reveal="up"
        >
          <h1
            className="font-serif text-[64px] leading-[1.05] text-center"
            style={{
              color: "#F5F1E6",
              letterSpacing: "-0.02em",
              textShadow: "0 2px 6px rgba(0,0,0,0.4)",
            }}
          >
            Vessels
          </h1>
        </div>

        {/* Controls */}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden md:flex items-center justify-center gap-3">
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="rounded-full border px-3 py-2 backdrop-blur-sm"
              style={{ borderColor: "rgba(255,255,255,0.35)", color: "#F5F1E6" }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="rounded-full border px-3 py-2 backdrop-blur-sm"
              style={{ borderColor: "rgba(255,255,255,0.35)", color: "#F5F1E6" }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="pointer-events-auto ml-3 flex items-center gap-2 rounded-full bg-black/20 px-3 py-1">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  i === index ? "w-6" : "opacity-70"
                }`}
                style={{ background: "rgba(245,241,230,0.95)" }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-6 py-10 md:py-20 text-center" data-reveal>
        <p className="font-serif text-[22px] md:text-[28px] leading-relaxed">
          Made to remain.
Quiet forms with weight and purpose.
        </p>
      </section>

      {/* Gallery */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 pb-24 md:grid-cols-3">
        {VESSELS.map((v, i) => (
          <article
            key={v.id}
            className={`group relative overflow-hidden rounded-[28px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] ${aspectByIndex(i)}`}
            data-reveal="scale"
          >
            <Link
              to={`/vessels/${v.id}`}
              state={
                v.id === "riverstone"
                  ? {
                      images: [
                        cldPdpXL(riverstoneFull.primary),
                        cldPdpXL(riverstoneFull.secondary),
                      ],
                    }
                  : undefined
              }
              className="absolute inset-0 z-10"
              aria-label={`View ${v.name}`}
            />
            <img
              src={
                v.id === "riverstone"
                  ? cldCard4x5(riverstoneFull.primary)
                  : v.image
              }
              alt={v.name}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                // Fallback: if transform URL fails (unlikely), show the raw primary URL
                if (v.id === "riverstone") {
                  (e.currentTarget as HTMLImageElement).src = riverstoneFull.primary;
                }
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(10,8,6,0.18) 65%, rgba(10,8,6,0.28) 100%)",
              }}
            />
            <div className="absolute inset-x-5 bottom-5 z-[5]">
              <div
                className="font-serif text-lg md:text-xl"
                style={{ color: "#F5F1E6", letterSpacing: "-0.01em" }}
              >
                {v.name}
              </div>
              {v.subtitle && (
                <div
                  className="mt-1 text-[12px] uppercase tracking-[0.16em]"
                  style={{ color: "rgba(245,241,230,0.85)" }}
                >
                  {v.subtitle}
                </div>
              )}
              <div className="mt-2 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span
                  className="text-xs uppercase tracking-[0.18em]"
                  style={{ color: "rgba(245,241,230,0.85)" }}
                >
                  View Piece
                </span>
                <span className="text-sm" style={{ color: "rgba(245,241,230,0.7)" }}>
                  ${v.price.toFixed(2)}
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Provenance */}
      <section
        className="mx-auto max-w-5xl rounded-[32px] px-6 py-16 md:px-10 md:py-20"
        style={{ background: colors.bgAlt, border: `1px solid ${colors.divider}` }}
        data-reveal
      >
        <p
          className="mx-auto max-w-3xl text-center leading-relaxed"
          style={{ color: colors.textMuted }}
        >
          Every vessel carries an ancient stillness, matter weathered into tactility, sculpted into permanence. The quiet weight of time, held in physical form.
        </p>
      </section>

      {/* Floating drawer pill */}
      {cartItems.length > 0 && (
        <button
          onClick={() => setCollectionOpen(true)}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full px-4 py-3 shadow-lg"
          style={{ background: colors.text, color: "#F6F3EE", border: `1px solid ${colors.text}` }}
        >
          <ShoppingBag size={16} />
          <span className="font-medium">Selection · {cartItems.length}</span>
        </button>
      )}

      {/* Drawer */}
      {collectionOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/20"
            onClick={() => setCollectionOpen(false)}
            aria-hidden
          />
          <aside
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l bg-white"
            style={{ borderColor: colors.divider }}
            aria-label="Your selection"
          >
            <div
              className="flex items-center justify-between border-b p-6"
              style={{ borderColor: colors.divider }}
            >
              <h3 className="font-serif text-2xl" style={{ color: colors.text }}>
                Your Selection
              </h3>
              <button
                onClick={() => setCollectionOpen(false)}
                className="rounded-full border px-3 py-1 text-sm"
                style={{ borderColor: colors.divider, color: colors.text }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {cartItems.length === 0 ? (
                <p className="text-sm" style={{ color: colors.textMuted }}>
                  You haven’t selected any pieces yet.
                </p>
              ) : (
                <>
                  <ul className="space-y-4">
                    {cartItems.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between rounded-2xl border p-4"
                        style={{ borderColor: colors.divider, background: "#fff" }}
                      >
                        <div className="flex items-center gap-4">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-16 w-16 rounded-xl object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div
                              className="h-16 w-16 rounded-xl"
                              style={{
                                background: colors.bgAlt,
                                border: `1px solid ${colors.divider}`,
                              }}
                            />
                          )}
                          <div>
                            <div className="font-serif" style={{ color: colors.text }}>
                              {item.title}
                            </div>
                            <div className="text-sm" style={{ color: colors.textMuted }}>
                              ${item.price.toFixed(2)} · Qty {item.quantity}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div
                    className="mt-6 border-t pt-4"
                    style={{ borderColor: colors.divider }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: colors.textMuted }}>
                        Subtotal
                      </span>
                      <span className="font-serif" style={{ color: colors.text }}>
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <button
                      className="mt-4 w-full rounded-2xl border px-5 py-3 text-sm"
                      style={{ borderColor: colors.accent, color: colors.text }}
                    >
                      Continue
                    </button>
                  </div>
                </>
              )}
            </div>
          </aside>
        </>
      )}

      {/* Micro-interactions */}
      <style>{`
        [data-reveal]{opacity:0;transform:translateY(14px);transition:opacity .6s ease,transform .6s ease;}
        [data-reveal="up"]{opacity:0;transform:translateY(16px);}
        [data-reveal="scale"]{opacity:0;transform:scale(.985);}
        .reveal-in{opacity:1;transform:none;}
        section[aria-roledescription="carousel"] img { will-change: opacity, transform; }
      `}</style>
    </main>
  );
}
