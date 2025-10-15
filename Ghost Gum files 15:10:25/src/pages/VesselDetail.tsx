// src/pages/VesselDetail.tsx
import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { VESSELS } from "../data/vessels";
import type { Vessel, VesselVariant } from "../data/vessels";
import { useCart } from "../context/CartContext";

export default function VesselDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find this vessel from our data file
  const vessel: Vessel | null = useMemo(
    () => VESSELS.find((v) => v.id === id) || null,
    [id]
  );

  // --- Cart wiring (uses YOUR CartContext API) ---
  const { cartItems, addToCart, removeFromCart } = useCart();
  const inCart = !!cartItems.find((item) => item.id === vessel?.id);

  const handleCartClick = () => {
    if (!vessel) return;
    if (inCart) {
      removeFromCart(vessel.id);
    } else {
      addToCart({
        id: vessel.id,
        handle: vessel.id, // reuse id as handle
        title: vessel.name,
        price: vessel.price,
        image: vessel.image,
      });
    }
  };
  // ------------------------------------------------

  if (!vessel) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20">
        <button
          onClick={() => navigate("/vessels")}
          className="mb-6 inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={16} /> Back to Vessels
        </button>
        <h1 className="font-serif text-3xl">Not found</h1>
        <p className="mt-2 text-sm text-neutral-600">
          This vessel doesn’t exist or has moved.
        </p>
      </main>
    );
  }

  const hasVariants = !!vessel.variants?.length;
  const [variantKey, setVariantKey] = useState<VesselVariant["key"]>(
    (vessel.variants?.[0]?.key as VesselVariant["key"]) ?? "duo"
  );
  const activeVariant = vessel.variants?.find((vv) => vv.key === variantKey);

  // Build media array:
  // 1) If variants, use active variant hero (+ optional secondary)
  // 2) Else, if details.gallery exists, use that
  // 3) Else, fall back to the single card image
  const media: { src: string; alt: string }[] = useMemo(() => {
    if (hasVariants && activeVariant) {
      const arr = [activeVariant.images.hero];
      if (activeVariant.images.secondary) arr.push(activeVariant.images.secondary);
      return arr;
    }
    if (vessel.details?.gallery?.length) {
      return vessel.details.gallery;
    }
    return [{ src: vessel.image, alt: vessel.name }];
  }, [hasVariants, activeVariant, vessel.details?.gallery, vessel.image, vessel.name]);

  const [mediaIndex, setMediaIndex] = useState(0);
  const onPrev = () => setMediaIndex((i) => (i - 1 + media.length) % media.length);
  const onNext = () => setMediaIndex((i) => (i + 1) % media.length);

  return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#3A2E27]">
      {/* Back strip */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <button
          onClick={() => navigate("/vessels")}
          className="inline-flex items-center gap-2 text-sm opacity-80 transition-opacity hover:opacity-100"
        >
          <ArrowLeft size={16} />
          Back to Vessels
        </button>
      </div>

      {/* Hero + Content */}
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 pb-10 md:grid-cols-12 md:px-8">
        {/* Media column */}
        <figure className="relative overflow-hidden rounded-[28px] md:col-span-7">
          <img
            key={mediaIndex}
            src={media[mediaIndex].src}
            alt={media[mediaIndex].alt}
            className="h-[54vh] w-full object-cover md:h-[72vh]"
            loading="eager"
            decoding="async"
          />

          {/* Carousel controls if > 1 image */}
          {media.length > 1 && (
            <>
              <button
                onClick={onPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={onNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                {media.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setMediaIndex(i)}
                    aria-label={`Go to image ${i + 1}`}
                    className={`h-1.5 w-6 rounded-full transition ${
                      i === mediaIndex ? "bg-[#3A2E27]" : "bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </figure>

        {/* Content column */}
        <div className="md:col-span-5">
          <h1 className="font-serif text-[34px] leading-tight md:text-[44px]">
            {vessel.name}
          </h1>
          {vessel.subtitle && (
            <div className="mt-2 text-[12px] uppercase tracking-[0.16em] opacity-70">
              {vessel.subtitle}
            </div>
          )}

          {/* Badges */}
          {vessel.badges?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {vessel.badges.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-[#E2DAD3] px-2 py-[2px] text-[10px] uppercase tracking-[0.16em] opacity-80"
                >
                  {b}
                </span>
              ))}
            </div>
          ) : null}

          {/* Description */}
          <p className="mt-5 text-[15px] leading-relaxed opacity-85">
            {vessel.description}
          </p>

          {/* Variants */}
          {hasVariants && vessel.variants && (
            <div className="mt-6">
              <div className="flex gap-2">
                {vessel.variants.map((vv) => {
                  const active = vv.key === variantKey;
                  return (
                    <button
                      key={vv.key}
                      onClick={() => {
                        setVariantKey(vv.key);
                        setMediaIndex(0);
                      }}
                      className={`rounded-2xl px-3 py-2 text-xs uppercase tracking-[0.14em] ${
                        active
                          ? "bg-[#3A2E27] text-[#F6F3EE]"
                          : "border border-[#E2DAD3]"
                      }`}
                      aria-pressed={active}
                    >
                      {vv.label}
                    </button>
                  );
                })}
              </div>

              {activeVariant && (
                <div className="mt-4 rounded-2xl border border-[#E2DAD3] p-4">
                  <div className="font-serif">{activeVariant.blurb}</div>
                  <ul className="mt-2 list-disc pl-5 text-[14px] opacity-85">
                    {activeVariant.composition.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* CTA row — uses YOUR cart context */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleCartClick}
              className={`inline-flex flex-1 items-center justify-center rounded-2xl px-4 py-3 text-sm ${
                inCart
                  ? "border border-[#E2DAD3] bg-transparent"
                  : "border border-[#3A2E27] text-[#3A2E27]"
              }`}
            >
              {inCart ? "Remove from Selection" : "Add to Selection"}
            </button>
            <div className="text-sm opacity-70">
              ${vessel.price.toFixed(2)}
            </div>
          </div>

          {/* Materials / Care */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#E2DAD3] p-4">
              <div className="font-serif">Materials &amp; Finish</div>
              <p className="mt-2 text-[14px] opacity-85">
                {vessel.details?.materials ??
                  "Stoneware ceramic in Ghost Gum off-white, matte–satin glaze with subtle micro-speckle."}
              </p>
            </div>
            <div className="rounded-2xl border border-[#E2DAD3] p-4">
              <div className="font-serif">Care</div>
              <p className="mt-2 text-[14px] opacity-85">
                {vessel.details?.care ??
                  "Wipe with a soft damp cloth. Dry fully before closing."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Optional thumbnail strip (only if multiple images & no variants UI taking over) */}
      {media.length > 1 && (
        <section className="mx-auto mt-2 w-full max-w-6xl px-4 md:px-8">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {media.map((m, i) => (
              <button
                key={i}
                onClick={() => setMediaIndex(i)}
                className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border ${
                  i === mediaIndex ? "border-[#3A2E27]" : "border-[#E2DAD3]"
                }`}
                aria-label={`Select image ${i + 1}`}
              >
                <img
                  src={m.src}
                  alt={m.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Provenance band */}
      <section className="mx-auto mt-8 max-w-6xl rounded-[28px] border border-[#E2DAD3] bg-[#F1ECE5] px-6 py-12 md:px-10 md:py-16">
        <p className="mx-auto max-w-3xl text-center text-[15px] leading-relaxed opacity-85">
          In Anningie, Central Australia, ancient rivers cut through granite,
          leaving seams of kaolinitic clay. Over millennia, mineral lattices
          softened into a powdery tactility — the quiet origin of each Ghost
          Gum vessel.
        </p>
      </section>

      <div className="h-12" />
    </main>
  );
}
