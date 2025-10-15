// src/components/ImmersiveProductCard.tsx
import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

type Product = {
  handle: string;
  title: string;
  price: number;
  productType?: string;
  images?: string[];
  variants?: { image?: string }[];
  tags?: string[];
  badges?: string[];
  shortDescription?: string;
  provenance?: string;
  notes?: string[];
};

type ViewMode = "grid" | "list";

export default function ImmersiveProductCard({
  product,
  mode = "grid",
  onQuickLook,
}: {
  product: Product;
  mode?: ViewMode;
  onQuickLook?: () => void;
}) {
  const img =
    (product.images && product.images[0]) ||
    (product.variants?.[0]?.image) ||
    "";

  const cardRef = useRef<HTMLDivElement | null>(null);

  // subtle tilt/parallax (respects reduced motion)
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const handle = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty("--tiltX", `${(-y * 2).toFixed(3)}deg`);
      el.style.setProperty("--tiltY", `${(x * 2).toFixed(3)}deg`);
    };
    const leave = () => {
      el.style.setProperty("--tiltX", "0deg");
      el.style.setProperty("--tiltY", "0deg");
    };
    el.addEventListener("mousemove", handle);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", handle);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <article
      ref={cardRef}
      className={[
        "group relative overflow-hidden rounded-2xl",
        "bg-[#FBF8F2] ring-1 ring-black/5 transition-shadow",
        "shadow-[0_1px_0_0_rgba(0,0,0,0.02)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:ring-black/10",
      ].join(" ")}
      style={{
        transform: "perspective(1000px) rotateX(var(--tiltX,0)) rotateY(var(--tiltY,0))",
        transformStyle: "preserve-3d",
      }}
      data-handle={product.handle}
    >
      {children}
    </article>
  );

  const Image = (
    <figure className="relative overflow-hidden">
      <div className={mode === "list" ? "aspect-[16/11]" : "aspect-[4/5]"}>
        {img && (
          <img
            src={img}
            alt={product.title}
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
            loading="lazy"
            decoding="async"
            style={{ transform: "translateZ(20px)" }}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_20%,transparent_55%,rgba(0,0,0,0.06)_100%)] opacity-80 transition-opacity group-hover:opacity-90" />
      </div>

      {/* Ritual overlay */}
      {(product.shortDescription || product.provenance || product.notes?.length) && (
        <div
          className={[
            "pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 opacity-0",
            "bg-gradient-to-t from-[rgba(20,16,12,0.55)] via-[rgba(20,16,12,0.25)] to-transparent",
            "p-4 text-white transition-all duration-300",
            "group-hover:translate-y-0 group-hover:opacity-100",
            "focus-within:translate-y-0 focus-within:opacity-100",
          ].join(" ")}
          style={{ transform: "translateZ(40px)" }}
        >
          <p className="font-serif text-[14px] leading-snug">{product.shortDescription}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(product.notes ?? []).slice(0, 3).map((n) => (
              <span key={n} className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] leading-4">
                {n}
              </span>
            ))}
            {product.provenance && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] leading-4">
                {product.provenance}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Quick look button — hidden on mobile to avoid freeze & full-screen duplication */}
      {onQuickLook && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onQuickLook?.();
          }}
          className="absolute right-3 top-3 z-10 hidden md:inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1.5 text-[12px] text-[#2A261F] shadow-sm backdrop-blur-[2px] transition hover:bg-white"
          style={{ transform: "translateZ(50px)" }}
        >
          <Eye size={14} /> Quick look
        </button>
      )}
    </figure>
  );

  const Content = (
    <div className={mode === "list" ? "p-5" : "p-4 sm:p-5"} style={{ transform: "translateZ(10px)" }}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-[17px] leading-tight text-[#1F1B17]">
          <Link to={`/product/${product.handle}`} className="hover:underline underline-offset-2">
            {product.title}
          </Link>
        </h3>
        <span className="font-serif text-[15px] tracking-tight text-[#2A261F] whitespace-nowrap [font-variant-numeric:oldstyle-nums]">
          ${product.price.toFixed(2)}
        </span>
      </div>

      {(product.tags && product.tags.length > 0) && (
        <div className="mt-2 hidden flex-wrap gap-1.5 group-hover:flex">
          {product.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-full border border-black/10 bg-white/60 px-2 py-0.5 text-[11px] leading-4 text-[#5A544B] backdrop-blur-[1px]"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  if (mode === "list") {
    return (
      <Wrapper>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-2">{Image}</div>
          <div className="md:col-span-3">{Content}</div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Link to={`/product/${product.handle}`} className="block">
        {Image}
      </Link>
      {Content}
    </Wrapper>
  );
}
