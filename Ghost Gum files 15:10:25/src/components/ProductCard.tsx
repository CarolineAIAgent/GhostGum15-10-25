// src/components/ProductCard.tsx
import React from "react";
import { Link } from "react-router-dom";

/* -------------------------------------------------------
   Types (align with your data shape)
------------------------------------------------------- */
type Variant = { id?: string; title?: string; price?: number; image?: string };
type Product = {
  handle: string;
  title: string;
  price: number;
  productType?: string;
  category?: string;
  images?: string[];
  variants?: Variant[];
  tags?: string[];
  badges?: string[];
  shortDescription?: string;
};

type ViewMode = "grid" | "list";

/* -------------------------------------------------------
   Image utils — Cloudinary-aware srcset (safe fallback)
------------------------------------------------------- */
const CLD_BREAKPOINTS = [480, 720, 900, 1200];

function isCloudinary(url: string | undefined): boolean {
  if (!url) return false;
  return /res\.cloudinary\.com\/|\/image\/upload\//i.test(url);
}

// Insert/merge CLD transforms just before the public ID segment
function cldUrlWithWidth(src: string, w: number): string {
  if (!isCloudinary(src)) return src;
  const i = src.indexOf("/upload/");
  if (i === -1) return src;
  const prefix = src.slice(0, i + 8); // includes "/upload/"
  const suffix = src.slice(i + 8);
  const params = "f_auto,q_auto,dpr_auto";

  // if user already has transforms, append width; otherwise create new
  const alreadyHasParams = suffix.match(/^[a-z0-9,_-]+\//i);
  if (alreadyHasParams) {
    const replaced = suffix.replace(/^[^/]+/, (m) => {
      let next = m;
      if (!/f_auto/.test(next)) next += ",f_auto";
      if (!/q_auto/.test(next)) next += ",q_auto";
      if (!/dpr_auto/.test(next)) next += ",dpr_auto";
      if (!/w_/.test(next)) next += `,w_${w}`;
      else next = next.replace(/w_\d+/, `w_${w}`);
      return next;
    });
    return `${prefix}${replaced}`;
  }
  return `${prefix}w_${w},${params}/${suffix}`;
}

function buildSrcSet(src: string): string | undefined {
  if (!isCloudinary(src)) return undefined;
  return CLD_BREAKPOINTS.map((w) => `${cldUrlWithWidth(src, w)} ${w}w`).join(", ");
}

function sizesAttr(): string {
  // 4-col XL, 3-col LG, 2-col MD, 1-col <640px
  return "(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw";
}

/* -------------------------------------------------------
   Component
------------------------------------------------------- */
export default function ProductCard({
  product,
  mode = "grid",
}: {
  product: Product;
  mode?: ViewMode;
}) {
  const img =
    (product.images && product.images[0]) ||
    (product.variants && product.variants[0]?.image) ||
    "";

  const ImgFigure = (
    <figure className="relative overflow-hidden">
      <div className={mode === "list" ? "aspect-[16/11]" : "aspect-[4/5]"}>
        {img && (
          <img
            src={isCloudinary(img) ? cldUrlWithWidth(img, 900) : img}
            srcSet={buildSrcSet(img)}
            sizes={buildSrcSet(img) ? sizesAttr() : undefined}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {/* ultra-subtle vignette for premium depth */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_20%,transparent_55%,rgba(0,0,0,0.06)_100%)] opacity-80 transition-opacity group-hover:opacity-90" />
      </div>
    </figure>
  );

  const Content = (
    <div className="border-t border-[rgba(31,27,23,0.08)] p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-[17px] leading-snug text-[#1F1B17]">
          <Link
            to={`/product/${product.handle}`}
            className="hover:underline underline-offset-2"
            aria-label={`${product.title} — view details`}
          >
            {product.title}
          </Link>
        </h3>
        <span
          className="font-serif text-[14px] tracking-[0.01em] text-[#1F1B17]/80 [font-variant-numeric:oldstyle-nums]"
          aria-label={`Price ${product.price.toFixed(2)} dollars`}
        >
          ${product.price.toFixed(2)}
        </span>
      </div>

      {/* Quiet chips — only show on hover/focus for a calmer layout */}
      {(product.tags?.length || product.badges?.length) && (
        <div className="mt-1.5 hidden flex-wrap gap-1.5 text-[11px] leading-4 group-hover:flex group-focus-within:flex">
          {[...(product.badges ?? []), ...(product.tags ?? [])]
            .slice(0, 2)
            .map((t) => (
              <span
                key={t}
                className="rounded-full border border-black/10 bg-white/60 px-2 py-0.5 text-[#5A544B] backdrop-blur-[1px]"
                title={t}
              >
                {t}
              </span>
            ))}
        </div>
      )}

      {/* Optional short blurb on list mode for editorial feel */}
      {mode === "list" && product.shortDescription && (
        <p className="mt-2 text-[13px] leading-relaxed text-[#2F2722]/75">
          {product.shortDescription}
        </p>
      )}
    </div>
  );

  const WrapperClasses =
    "group relative overflow-hidden rounded-2xl bg-[#FBF8F2] ring-1 ring-black/5 transition-shadow shadow-[0_1px_0_0_rgba(0,0,0,0.02)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:ring-black/10";

  if (mode === "list") {
    return (
      <article className={WrapperClasses} data-handle={product.handle}>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <Link to={`/product/${product.handle}`} className="md:col-span-2 block focus:outline-none">
            {ImgFigure}
          </Link>
          <div className="md:col-span-3">{Content}</div>
        </div>
      </article>
    );
  }

  // Grid (default)
  return (
    <article className={WrapperClasses} data-handle={product.handle}>
      <Link to={`/product/${product.handle}`} className="block focus:outline-none">
        {ImgFigure}
      </Link>
      {Content}
    </article>
  );
}
