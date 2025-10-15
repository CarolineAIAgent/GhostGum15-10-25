// src/ghostgum/MicroLabTallow.tsx
"use client";
import React from "react";
import {
  PLATES_BEESWAX,
  PLATES_JARRAH,
  PLATES_TALLOW,
  PLATES_BOTANICALS,
  type Plates,
} from "./plates";

/**
 * Provenance & Ingredients — “smear to reveal”
 * - Starts blurred; user scrubs to reveal sharp
 * - Progressive <img> blur fallback (no white flash on mobile/resize)
 * - Headline: 4 lines on mobile, 2 lines on desktop
 * - Compact dark toggle rail; Tallow first; includes Botanicals + CTA
 */

/* ------------------------ Theme tokens ------------------------ */
type Colors = { bg: string; text: string; textMuted: string; divider: string };
const readVar = (n: string, fb: string) =>
  (typeof window !== "undefined" &&
    getComputedStyle(document.documentElement).getPropertyValue(n).trim()) || fb;
const useTokens = (): Colors => ({
  bg: readVar("--gg-bg", "#F7F4EF"),
  text: readVar("--gg-text", "#23211F"),
  textMuted: readVar("--gg-text-muted", "#5B4E46"),
  divider: readVar("--gg-divider", "#E2DAD3"),
});

/* ------------------------ Types & Data ------------------------ */
type Ingredient = {
  id: string;
  title: string;
  note: string;
  chips: string[];
  plates: Plates;
};

const INGREDIENTS: Ingredient[] = [
  { id: "tallow",      title: "Tallow",            note: "Skin-affine lipids.",               chips: ["Barrier", "Supple"],     plates: PLATES_TALLOW },
  { id: "jarrah",      title: "Jarrah honey",      note: "Antioxidant, soothing matrix.",     chips: ["Antioxidant", "Native"], plates: PLATES_JARRAH },
  { id: "beeswax",     title: "Beeswax",           note: "Protective, pliable seal.",         chips: ["Occlusive", "Natural"],  plates: PLATES_BEESWAX },
  { id: "botanicals",  title: "Native botanicals", note: "Phytoactives to calm & condition.", chips: ["Eucalyptus", "Quandong"],plates: PLATES_BOTANICALS },
];

/* ------------------------ Canvas (smear-to-reveal) ------------------------ */
function SmearRevealCanvas({
  plates,
  fit = "cover",
  reducedMotion = false,
}: {
  plates: Plates;
  fit?: "cover" | "contain";
  reducedMotion?: boolean;
}) {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const dprRef = React.useRef(1);

  // Images are created in effects (SSR safe)
  const imgsRef = React.useRef<{
    blur: HTMLImageElement | null;
    sharp: HTMLImageElement | null;
    blurLoaded: boolean;
    sharpLoaded: boolean;
  }>({ blur: null, sharp: null, blurLoaded: false, sharpLoaded: false });

  const isMobile = () =>
    (typeof window !== "undefined"
      ? (wrapRef.current?.clientWidth ?? window.innerWidth) < 768
      : false);

  const requestComposeRef = React.useRef(false);
  const requestCompose = React.useCallback(() => {
    if (requestComposeRef.current) return;
    requestComposeRef.current = true;
    requestAnimationFrame(() => {
      compose();
      requestComposeRef.current = false;
    });
  }, []);

  const resize = React.useCallback(() => {
    const cvs = canvasRef.current, wrap = wrapRef.current;
    if (!cvs || !wrap) return;
    const dpr = Math.min((typeof window !== "undefined" ? window.devicePixelRatio : 1) || 1, 2);
    dprRef.current = dpr;

    const cssW = wrap.clientWidth;
    const cssH = wrap.clientHeight;
    cvs.style.width = `${cssW}px`;
    cvs.style.height = `${cssH}px`;
    cvs.width = Math.max(640, Math.floor(cssW * dpr));
    cvs.height = Math.max(480, Math.floor(cssH * dpr));
  }, []);

  // Offscreen buffers
  const maskRef = React.useRef<HTMLCanvasElement | null>(null);
  const sharpLayerRef = React.useRef<HTMLCanvasElement | null>(null);
  const invRef = React.useRef<HTMLCanvasElement | null>(null);

  const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  const maskCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  const sharpCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  const invCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

  const lastRef = React.useRef<{ x: number; y: number } | null>(null);
  const strokeSizeRef = React.useRef(88);
  const strokeHardness = 0.38;

  const ensureBuffers = React.useCallback(() => {
    if (!maskRef.current) maskRef.current = document.createElement("canvas");
    if (!sharpLayerRef.current) sharpLayerRef.current = document.createElement("canvas");
    if (!invRef.current) invRef.current = document.createElement("canvas");
    if (!maskCtxRef.current) maskCtxRef.current = maskRef.current.getContext("2d", { alpha: true });
    if (!sharpCtxRef.current) sharpCtxRef.current = sharpLayerRef.current.getContext("2d", { alpha: true });
    if (!invCtxRef.current) invCtxRef.current = invRef.current.getContext("2d", { alpha: true });
  }, []);

  const drawPlate = React.useCallback(
    (g: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) => {
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      if (!iw || !ih) return;
      const s = fit === "contain" ? Math.min(w / iw, h / ih) : Math.max(w / iw, h / ih);
      const dw = iw * s, dh = ih * s;
      const dx = (w - dw) / 2, dy = (h - dh) / 2;
      g.imageSmoothingEnabled = true;
      // @ts-ignore
      g.imageSmoothingQuality = "high";
      g.drawImage(img, dx, dy, dw, dh);
    },
    [fit]
  );

  const resetMask = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ensureBuffers();
    const w = canvas.width, h = canvas.height;
    [maskRef.current!, invRef.current!, sharpLayerRef.current!].forEach((c) => {
      c.width = w;
      c.height = h;
    });
    const m = maskCtxRef.current!;
    m.globalCompositeOperation = "source-over";
    // Start fully blurred (white mask); user scrubs holes to reveal sharp image
    m.fillStyle = "rgba(255,255,255,1)";
    m.fillRect(0, 0, w, h);
    lastRef.current = null;
    requestCompose();
  }, [ensureBuffers, requestCompose]);

  const buildMaskedSharp = React.useCallback(() => {
    const canvas = canvasRef.current;
    const { sharpLoaded, sharp } = imgsRef.current;
    if (!canvas || !sharpLoaded || !sharp) return;
    const w = canvas.width, h = canvas.height;
    const sharpCtx = sharpCtxRef.current!;
    const invCtx = invCtxRef.current!;
    sharpCtx.clearRect(0, 0, w, h);
    drawPlate(sharpCtx, sharp, w, h);
    invCtx.globalCompositeOperation = "source-over";
    invCtx.fillStyle = "rgba(255,255,255,1)";
    invCtx.fillRect(0, 0, w, h);
    invCtx.globalCompositeOperation = "destination-out";
    invCtx.drawImage(maskRef.current!, 0, 0, w, h);
    sharpCtx.globalCompositeOperation = "destination-in";
    sharpCtx.drawImage(invRef.current!, 0, 0, w, h);
    sharpCtx.globalCompositeOperation = "source-over";
  }, [drawPlate]);

  const compose = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = ctxRef.current!;
    const { blurLoaded, blur, sharpLoaded } = imgsRef.current;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (blurLoaded && blur) drawPlate(ctx, blur, w, h);
    if (sharpLoaded) {
      buildMaskedSharp();
      ctx.drawImage(sharpLayerRef.current!, 0, 0, w, h);
    }
  }, [buildMaskedSharp, drawPlate]);

  const strokeTo = React.useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const dpr = dprRef.current;
      const x = (clientX - rect.left) * dpr;
      const y = (clientY - rect.top) * dpr;
      const R = strokeSizeRef.current * dpr;

      const m = maskCtxRef.current!;
      const dot = (gx: number, gy: number, r: number, a = 0.7) => {
        const grd = m.createRadialGradient(gx, gy, r * 0.2, gx, gy, r);
        grd.addColorStop(0, `rgba(0,0,0,${a})`);
        grd.addColorStop(1, "rgba(0,0,0,0)");
        m.beginPath();
        m.fillStyle = grd;
        m.arc(gx, gy, r, 0, Math.PI * 2);
        m.fill();
      };

      m.save();
      m.globalCompositeOperation = "destination-out";
      m.filter = `blur(${(1 - strokeHardness) * (R * 0.25)}px)`;
      const last = lastRef.current;
      if (last) {
        const dx = x - last.x,
          dy = y - last.y;
        const dist = Math.hypot(dx, dy);
        const steps = Math.max(1, Math.floor(dist / (R * 0.35)));
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          dot(last.x + dx * t, last.y + dy * t, R, 0.7);
        }
      } else {
        dot(x, y, R, 0.7);
      }
      m.filter = "none";
      m.restore();

      lastRef.current = { x, y };
      requestCompose();
    },
    [requestCompose]
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const wrap = wrapRef.current;
    const canvas = canvasRef.current!;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true })!;
    ctxRef.current = ctx;
    (canvas.style as any).touchAction = "none";
    canvas.style.cursor = "crosshair";

    ensureBuffers();
    resize();

    // viewport-adaptive brush
    const setStroke = () => {
      const w = wrap.clientWidth;
      strokeSizeRef.current = Math.max(56, Math.min(120, Math.floor(w * 0.08)));
    };
    setStroke();

    // choose plates
    const p = isMobile() ? plates.mobile : plates.desktop;

    // load images
    const imgs = imgsRef.current;
    imgs.blurLoaded = imgs.sharpLoaded = false;

    imgs.blur = new Image();
    imgs.sharp = new Image();
    imgs.blur.crossOrigin = "anonymous";
    imgs.sharp.crossOrigin = "anonymous";
    imgs.blur.src = p.blur;
    imgs.sharp.src = p.sharp;

    imgs.blur.onload = () => {
      imgs.blurLoaded = true;
      requestCompose();
    };
    imgs.sharp.onload = () => {
      imgs.sharpLoaded = true;
      if (reducedMotion) {
        const w = canvas.width,
          h = canvas.height;
        const m = maskCtxRef.current!;
        m.globalCompositeOperation = "destination-out";
        m.fillStyle = "rgba(0,0,0,0.7)";
        m.fillRect(0, 0, w, h);
      }
      requestCompose();
    };

    // input handlers
    const onDown = (e: PointerEvent) => {
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {}
      lastRef.current = null;
      strokeTo(e.clientX, e.clientY);
    };
    const onMove = (e: PointerEvent) => {
      // @ts-ignore
      if ((e.target as any)?.hasPointerCapture?.(e.pointerId)) {
        strokeTo(e.clientX, e.clientY);
      }
    };
    const onUp = () => {
      try {
        /* @ts-ignore */ canvas.releasePointerCapture?.(0);
      } catch {}
      lastRef.current = null;
    };
    const onTouchPrevent = (e: TouchEvent) => {
      if (e.target === canvas) e.preventDefault();
    };

    const ro = new ResizeObserver(() => {
      // Keep mask but recompute sizes; no white flash thanks to fallback image
      setStroke();
      resize();
      resetMask();
    });
    ro.observe(wrap);

    window.addEventListener("resize", resize, { passive: true });
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    canvas.addEventListener("touchmove", onTouchPrevent, { passive: false });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("touchmove", onTouchPrevent);
    };
  }, [plates, resize, ensureBuffers, strokeTo, requestCompose, reducedMotion, fit]);

  return (
    <div ref={wrapRef} className="absolute inset-0 z-10">
      <canvas ref={canvasRef} className="block w-full h-full touch-none" />
    </div>
  );
}

/* ------------------------ Section (UI + Background) ------------------------ */
export default function MicroLabTallow({
  variant = "fullbleed",
}: {
  variant?: "fullbleed" | "framed";
}) {
  const colors = useTokens();
  const [active, setActive] = React.useState<Ingredient["id"]>("tallow");
  const current = INGREDIENTS.find((i) => i.id === active)!;
  const key = `fx-${active}`; // remount canvas to reset per ingredient

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <section
      id="ingredients-lab"
      className="relative min-h-[70svh] md:min-h-[78svh] lg:min-h-[86svh] overflow-hidden"
      style={{
        ...(variant === "fullbleed"
          ? { width: "100vw", marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }
          : {}),
        // Background is behind fallback; keep neutral just in case
        background: colors.bg,
        borderTop: `1px solid ${colors.divider}`,
      }}
      aria-label="Provenance & Ingredients"
    >
      {/* Fallback blur image (shown immediately) — now ABOVE section bg, BELOW canvas */}
      <div className="absolute inset-0 z-0 md:hidden" aria-hidden>
        <img
          src={current.plates.mobile.blur}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
      </div>
      <div className="absolute inset-0 z-0 hidden md:block" aria-hidden>
        <img
          src={current.plates.desktop.blur}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Interactive smear-to-reveal canvas (above fallback) */}
      <SmearRevealCanvas
        key={key}
        plates={current.plates}
        fit="cover"
        reducedMotion={reducedMotion}
      />
     {/* Headline — centered (mobile: 4 lines, desktop: 2 lines) */}
<div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-8">
  <div className="text-center">
    {/* Mobile — 4 lines */}
    <h2 className="md:hidden font-serif text-white text-3xl leading-tight max-w-[28rem] mx-auto">
      <span className="block">Recognisable materials,</span>
      <span className="block">transparent process.</span>
      <span className="block mt-[2px]">Simply supporting</span>
      <span className="block">the skin&apos;s architecture.</span>
    </h2>

    {/* Desktop — 2 lines */}
    <h2 className="hidden md:block font-serif text-white text-4xl lg:text-[40px] leading-tight max-w-[56rem] mx-auto">
      Recognisable materials, transparent process.<br />
      Simply supporting the skin&apos;s architecture.
    </h2>
  </div>
</div>

      {/* Bottom selector rail (compact, dark, centered) */}
      <div
        className="absolute z-20 left-0 right-0 flex justify-center"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 12px)", paddingInline: 12 }}
      >
        <div
          className="inline-flex items-center gap-6 px-4 py-3 rounded-full border backdrop-blur-[6px]"
          style={{
            borderColor: "rgba(255,255,255,0.22)",
            background: "linear-gradient(180deg, rgba(20,20,20,0.56), rgba(20,20,20,0.36))",
            boxShadow:
              "0 16px 36px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.24) inset",
            maxWidth: "min(92vw, 1120px)",
            overflowX: "auto",
          }}
          role="tablist"
          aria-label="Ingredients"
        >
          {INGREDIENTS.map((ing) => {
            const on = ing.id === active;
            return (
              <button
                key={ing.id}
                role="tab"
                aria-selected={on}
                onClick={() => setActive(ing.id)}
                className="press-effect shrink-0"
                style={{
                  padding: "10px 14px",
                  borderRadius: 999,
                  border: `1px solid ${
                    on ? "rgba(200,138,74,0.9)" : "rgba(255,255,255,0.28)"
                  }`,
                  color: on ? "#F4E7D5" : "#F7F4EF",
                  background: on ? "rgba(0,0,0,0.22)" : "transparent",
                  transition:
                    "border-color .18s ease, color .18s ease, background-color .18s ease",
                  fontSize: 14,
                  whiteSpace: "nowrap",
                }}
              >
                {ing.title}
              </button>
            );
          })}

          {/* Helper text */}
          <span
            className="text-xs shrink-0 hidden sm:block"
            style={{ color: "rgba(255,255,255,0.72)" }}
          >
            Drag to reveal texture
          </span>

          {/* CTA → Sustainability / Materials */}
          <a
            href="/sustainability#materials"
            className="shrink-0"
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.34)",
              color: "#F7F4EF",
              textDecoration: "none",
              background: "rgba(0,0,0,0.18)",
              transition:
                "border-color .18s ease, background-color .18s ease, color .18s ease",
              fontSize: 14,
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "rgba(200,138,74,0.9)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.34)")
            }
          >
            Materials &amp; provenance →
          </a>
        </div>
      </div>

      {/* SR live region */}
      <div id={`panel-${current.id}`} role="region" aria-live="polite" className="sr-only">
        {current.title}: {current.note}
      </div>
    </section>
  );
}
