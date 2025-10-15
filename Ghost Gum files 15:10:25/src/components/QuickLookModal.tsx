// src/components/QuickLookModal.tsx
import React from "react";
import { Link } from "react-router-dom";
import { X, ShoppingBag } from "lucide-react";
import { getProductByHandle } from "../data/products";

export default function QuickLookModal({
  open,
  handle,
  onClose,
}: {
  open: boolean;
  handle?: string;
  onClose: () => void;
}) {
  if (!open || !handle) return null;
  const p = getProductByHandle(handle);
  if (!p) return null;

  const img = (p.images && p.images[0]) || (p.variants?.[0]?.image) || "";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] grid place-items-center"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative mx-4 w-full max-w-3xl overflow-hidden rounded-2xl bg-[#FBF8F2] shadow-2xl ring-1 ring-black/10">
        <button
          aria-label="Close quick look"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-2 text-[#2A261F] shadow-sm hover:bg-white"
        >
          <X size={16} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <figure className="relative aspect-[4/5] md:aspect-auto md:h-full overflow-hidden">
            {img && (
              <img
                src={img}
                alt={p.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_20%,transparent_55%,rgba(0,0,0,0.06)_100%)]" />
          </figure>

          <div className="p-5 md:p-6">
            <h3 className="font-serif text-[22px] leading-tight text-[#1F1B17]">{p.title}</h3>
            <div className="mt-1 text-[#2A261F] font-serif">${p.price.toFixed(2)}</div>

            {p.shortDescription && (
              <p className="mt-3 text-[15px] leading-relaxed text-[#2F2722]/80">
                {p.shortDescription}
              </p>
            )}

            {/* Quick variant picker (optional) */}
            {p.variants && p.variants.length > 1 && (
              <div className="mt-4 space-y-2">
                <div className="text-[12px] uppercase tracking-wide text-[#2F2722]/60">
                  Variants
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.variants.map((v) => (
                    <span
                      key={v.id}
                      className="rounded-xl border border-[#2F2722]/20 px-2.5 py-1 text-[12px] text-[#2F2722]/80"
                    >
                      {v.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <Link
                to={`/product/${p.handle}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2B2B2B] px-4 py-2 text-sm font-medium text-[#F5F1E6] hover:bg-[#2B2B2B]/90"
                onClick={onClose}
              >
                <ShoppingBag size={16} />
                View full details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
