// src/pages/ProductDetail.tsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronDown,
  ShoppingBag,
  Heart,
  Share2,
  Check,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { getProductByHandle } from '../data/products';
import { useCart } from '../context/CartContext';

/* -------------------------------------------------------
   Cloudinary-aware responsive image helpers (premium)
------------------------------------------------------- */
const CLD_BREAKPOINTS = [800, 1200, 1600, 2000]; // crisp up to large desktop
const PRELOAD_WIDTHS = [800, 1200, 1600];        // warm cache for fast swaps

function isCloudinary(url?: string): boolean {
  if (!url) return false;
  return /res\.cloudinary\.com\/|\/image\/upload\//i.test(url);
}

// Insert transforms right after "/upload/" and BEFORE "v####/" if present.
// Uses premium-friendly defaults:
//  - q_auto:best  → better detail retention
//  - dpr_auto     → retina crisp
//  - fl_progressive:steep → faster first paint on JPEG fallbacks
//  - cs_srgb      → consistent color
//  - e_sharpen:25 → subtle micro-contrast
function cldUrlWithWidth(src: string, w: number): string {
  if (!isCloudinary(src)) return src;
  const i = src.indexOf('/upload/');
  if (i === -1) return src;

  const prefix = src.slice(0, i + 8); // ".../upload/"
  const suffix = src.slice(i + 8);
  const widthToken = `w_${w}`;

  const injectBase = (block: string) => {
    let t = block;

    // Ensure/upgrade quality to q_auto:best (replace any q_* token)
    if (/q_[^,/]*/.test(t)) t = t.replace(/q_[^,/]*/g, 'q_auto:best');
    if (!/q_auto(:best)?/.test(t)) t += ',q_auto:best';

    // Ensure other flags
    if (!/f_auto/.test(t)) t += ',f_auto';
    if (!/dpr_auto/.test(t)) t += ',dpr_auto';
    if (!/fl_progressive:steep/.test(t)) t += ',fl_progressive:steep';
    if (!/cs_srgb/.test(t)) t += ',cs_srgb';
    if (!/e_sharpen(:\d+)?/.test(t)) t += ',e_sharpen:25';

    // Ensure width token (override if present)
    t = /(?:^|,)w_\d+/.test(t) ? t.replace(/w_\d+/, widthToken) : `${t},${widthToken}`;
    return t;
  };

  // Case 1: version first (v####/). Insert our full block before it.
  if (/^v\d+\//.test(suffix)) {
    const block = injectBase('');
    return `${prefix}${block}/${suffix}`;
  }

  // Case 2: already has a transform block
  if (/^[a-z0-9,_-]+\//i.test(suffix)) {
    const replaced = suffix.replace(/^[^/]+/, (m) => injectBase(m));
    return prefix + replaced;
  }

  // Case 3: plain public_id path
  const block = injectBase('');
  return `${prefix}${block}/${suffix}`;
}

function buildSrcSet(src?: string): string | undefined {
  if (!src || !isCloudinary(src)) return undefined;
  return CLD_BREAKPOINTS.map((w) => `${cldUrlWithWidth(src, w)} ${w}w`).join(', ');
}

// Two-column PDP: image ≈ 50vw on desktop, full width on mobile
function sizesAttr(): string {
  return '(min-width:1024px) 50vw, 100vw';
}

/* -------------------------------------------------------
   Preload / preconnect utilities
------------------------------------------------------- */
function ensurePreconnect(origin: string) {
  const has = Array.from(document.head.querySelectorAll('link[rel="preconnect"]')).some(
    (l) => l.getAttribute('href') === origin
  );
  if (!has) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = '';
    document.head.appendChild(link);
  }
}

function ensurePreload(href: string) {
  const has = Array.from(
    document.head.querySelectorAll('link[rel="preload"][as="image"]')
  ).some((l) => l.getAttribute('href') === href);
  if (!has) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = href;
    link.crossOrigin = '';
    document.head.appendChild(link);
  }
}

function warmCache(url: string) {
  const img = new Image();
  img.decoding = 'async';
  img.loading = 'eager';
  img.src = url;
}

/* -------------------------------------------------------
   Double-buffer image switcher (no blank between variants)
------------------------------------------------------- */
const ImageSwitcher: React.FC<{
  src?: string;              // fully transformed hero URL (e.g., 1200w)
  baseForSrcSet?: string;    // base Cloudinary URL (no width) for srcset
  alt: string;
  className?: string;
}> = ({ src, baseForSrcSet, alt, className }) => {
  const [curr, setCurr] = useState(src);
  const [next, setNext] = useState<string | undefined>(undefined);
  const [showNext, setShowNext] = useState(false);

  // Stage new image when src changes
  React.useEffect(() => {
    if (!src || src === curr) return;
    setNext(src);
    setShowNext(false);
  }, [src, curr]);

  const currSrcSet = buildSrcSet(curr);
  const nextSrcSet = buildSrcSet(baseForSrcSet);

  return (
    <div className="relative w-full h-full">
      {/* Current layer */}
      {curr && (
        <img
          key={`curr:${curr}`}
          src={curr}
          srcSet={currSrcSet}
          sizes={currSrcSet ? sizesAttr() : undefined}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-200 ${
            showNext ? 'opacity-0' : 'opacity-100'
          } ${className || ''}`}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      )}

      {/* Next layer (revealed only once decoded) */}
      {next && (
        <img
          key={`next:${next}`}
          src={next}
          srcSet={nextSrcSet}
          sizes={nextSrcSet ? sizesAttr() : undefined}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-200 ${
            showNext ? 'opacity-100' : 'opacity-0'
          } ${className || ''}`}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onLoad={() => {
            setShowNext(true);
            // After fade, commit 'next' as 'curr'
            setTimeout(() => {
              setCurr(next);
              setNext(undefined);
              setShowNext(false);
            }, 200);
          }}
        />
      )}
    </div>
  );
};

/* -------------------------------------------------------
   Page
------------------------------------------------------- */
const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { addToCart } = useCart();
  const [openAccordion, setOpenAccordion] = useState<string | null>('benefits');
  const [selectedVariant, setSelectedVariant] = useState<string>('');

  const product = handle ? getProductByHandle(handle) : null;

  // Default variant pick
  React.useEffect(() => {
    if (product?.variants?.length && !selectedVariant) {
      setSelectedVariant(product.variants[0].id);
    }
  }, [product, selectedVariant]);

  // Collect all candidate images (product hero + variant images)
  const allBaseImages = React.useMemo(() => {
    const set = new Set<string>();
    if (product?.images?.length) product.images.forEach((u) => u && set.add(u));
    product?.variants?.forEach((v) => v.image && set.add(v.image));
    return Array.from(set);
  }, [product]);

  // Preconnect + preload + warm cache (so swaps are instant)
  React.useEffect(() => {
    if (!allBaseImages.length) return;

    // Preconnect once to the CDN origin
    try {
      const origin = new URL(allBaseImages[0], window.location.href).origin;
      ensurePreconnect(origin);
    } catch {
      /* noop */
    }

    const urls: string[] = [];
    for (const base of allBaseImages) {
      if (isCloudinary(base)) {
        PRELOAD_WIDTHS.forEach((w) => urls.push(cldUrlWithWidth(base, w)));
      } else {
        urls.push(base);
      }
    }

    urls.forEach((u) => {
      try {
        ensurePreload(u);
        warmCache(u);
      } catch {
        /* noop */
      }
    });
  }, [allBaseImages]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl mb-4">Product not found</h1>
          <Link to="/shop" className="text-[#C88A4A] hover:underline">
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  // Resolve hero base (variant > product hero > any variant image)
  const resolvedBase = React.useMemo(() => {
    let src: string | undefined = product.images?.[0];
    if (product.variants && selectedVariant) {
      const v = product.variants.find((x) => x.id === selectedVariant);
      if (v?.image) src = v.image;
    }
    if (!src && product.variants?.length) {
      src = product.variants.find((v) => !!v.image)?.image;
    }
    return src;
  }, [product, selectedVariant]);

  // Choose a crisp hero URL (1200w works well for most layouts; srcset covers up/down)
  const heroSrc = React.useMemo(() => {
    if (!resolvedBase) return undefined;
    return isCloudinary(resolvedBase) ? cldUrlWithWidth(resolvedBase, 1200) : resolvedBase;
  }, [resolvedBase]);

  const handleAddToCart = () => {
    const variant = product.variants?.find((v) => v.id === selectedVariant);
    const variantTitle = variant ? `${product.title} - ${variant.title}` : product.title;
    const variantPrice = variant ? variant.price : product.price;
    addToCart({
      id: product.handle,
      handle: product.handle,
      title: variantTitle,
      price: variantPrice,
    });
  };

  const accordionItems = [
    { id: 'benefits', label: 'Benefits', content: product.keyBenefits },
    {
      id: 'ingredients',
      label: 'Ingredients',
      content:
        product.variants && selectedVariant
          ? product.variants.find((v) => v.id === selectedVariant)?.ingredients ||
            product.ingredients
          : product.ingredients,
    },
    {
      id: 'usage',
      label: 'How to use',
      content:
        product.variants &&
        selectedVariant &&
        product.variants.find((v) => v.id === selectedVariant)?.description
          ? `${product.howToUse || 'Work into a rich lather with warm water.'} ${
              product.variants.find((v) => v.id === selectedVariant)?.description
            }`
          : product.howToUse ||
            (product.productType === 'soap'
              ? 'Work into a rich lather with warm water.'
              : 'Warm a small amount between fingers and press into skin.'),
    },
    { id: 'provenance', label: 'Provenance', content: product.provenance },
  ];

  const trustBadges = [
    { icon: RotateCcw, text: '30-day returns' },
    { icon: Shield, text: 'Secure checkout' },
    { icon: Truck, text: 'Carbon-aware shipping' },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-[#2B2B2B]/60">
            <Link to="/shop" className="hover:text-[#C88A4A]">
              Shop
            </Link>
            <span>/</span>
            <span>{product.title}</span>
          </div>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Product Gallery — portrait 3:4, double-buffered swaps */}
          <div className="space-y-4">
            <figure className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-[#F2EEE7] ring-1 ring-black/5">
              {heroSrc && (
                <ImageSwitcher
                  src={heroSrc}
                  baseForSrcSet={resolvedBase}
                  alt={product.title}
                />
              )}
              {/* subtle vignette for depth */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_20%,transparent_55%,rgba(0,0,0,0.06)_100%)]" />
            </figure>
            {/* (Optional) future: thumbnail strip could go here */}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Badges */}
            {product.badges?.length ? (
              <div className="flex flex-wrap gap-2">
                {product.badges.map((badge) => (
                  <span
                    key={badge}
                    className="bg-[#C88A4A]/10 text-[#C88A4A] text-sm px-3 py-1 rounded-full font-medium border border-[#C88A4A]/20"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Title and Price */}
            <div>
              <h1 className="font-serif text-4xl md:text-5xl mb-4 text-ink tracking-tight">
                {product.title}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <span className="font-serif text-3xl text-[#2B2B2B] [font-variant-numeric:oldstyle-nums]">
                  ${(
                    product.variants && selectedVariant
                      ? product.variants.find((v) => v.id === selectedVariant)?.price ||
                        product.price
                      : product.price
                  ).toFixed(2)}
                </span>
                {product.volume && (
                  <span className="font-sans text-[#2B2B2B]/60">{product.volume}</span>
                )}
              </div>
            </div>

            {/* Short / long description */}
            <p className="font-sans text-xl text-[#2B2B2B]/80 leading-relaxed">
              {product.longDescription || product.shortDescription}
            </p>

            {/* Variant Selection */}
            {product.variants?.length ? (
              <div className="space-y-4">
                <h3 className="font-sans font-medium text-[#2B2B2B]">
                  {product.productType === 'soap'
                    ? 'Choose your botanical blend:'
                    : 'Choose your blend:'}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {product.variants.map((variant) => {
                    const hoverWarm = () => {
                      if (!variant.image) return;
                      const u = isCloudinary(variant.image)
                        ? cldUrlWithWidth(variant.image, 1200)
                        : variant.image;
                      ensurePreload(u);
                      warmCache(u);
                    };
                    return (
                      <label
                        key={variant.id}
                        className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedVariant === variant.id
                            ? 'border-[#C88A4A] bg-[#C88A4A]/5'
                            : 'border-[#2B2B2B]/10 hover:border-[#C88A4A]/50'
                        }`}
                        onMouseEnter={hoverWarm}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="variant"
                            value={variant.id}
                            checked={selectedVariant === variant.id}
                            onChange={(e) => setSelectedVariant(e.target.value)}
                            className="sr-only"
                          />
                          <div>
                            <div className="font-sans font-medium text-[#2B2B2B]">
                              {variant.title}
                            </div>
                            {variant.description && (
                              <div className="font-sans text-sm text-[#2B2B2B]/70 mt-1 max-w-md">
                                {variant.description}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="font-sans font-medium text-[#2B2B2B] flex-shrink-0 [font-variant-numeric:oldstyle-nums]">
                          ${variant.price.toFixed(2)}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Add to Cart + subscription */}
            <div className="space-y-4">
              {/* Lip balm bundle example */}
              {product.handle === 'lip-balm' && (
                <div className="bg-[#C88A4A]/5 border border-[#C88A4A]/20 rounded-2xl p-6 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-serif text-xl text-[#2B2B2B] mb-2">
                        Complete Lip Care Collection
                      </h3>
                      <p className="font-sans text-[#2B2B2B]/70 text-sm">
                        Get all three flavors and save $8
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-sans text-[#2B2B2B]/50 line-through text-sm">
                        $50.00
                      </div>
                      <div className="font-serif text-2xl text-[#C88A4A]">$42.00</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // Add a bundle entry (example)
                      addToCart({
                        id: 'lip-balm-collection',
                        handle: 'lip-balm-collection',
                        title: 'Lip Balm Collection (All 3 Flavors)',
                        price: 42.0,
                      });
                    }}
                    className="font-sans w-full bg-[#C88A4A] py-3 px-6 rounded-2xl font-medium hover:bg-[#C88A4A]/90 transition-colors flex items-center justify-center group"
                    style={{ color: '#F5F1E6' }}
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    Buy the Collection - Save $8
                  </button>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                className="font-sans w-full bg-[#2B2B2B] py-4 px-8 rounded-2xl font-medium hover:bg-[#2B2B2B]/90 transition-colors flex items-center justify-center group"
                style={{ color: '#F5F1E6' }}
              >
                <ShoppingBag size={20} className="mr-2" />
                Add to Cart
              </button>

              {product.subscriptionEligible && (
                <div className="bg-[#5A6A5E]/5 border border-[#5A6A5E]/20 rounded-2xl p-4">
                  <div className="flex items-center mb-2">
                    <Check size={16} className="text-[#5A6A5E] mr-2" />
                    <span className="font-sans font-medium text-[#5A6A5E]">
                      Subscribe & Save 15%
                    </span>
                  </div>
                  <p className="font-sans text-sm text-[#2B2B2B]/70">
                    Never run out. Cancel anytime. Choose delivery every 4, 8, or 12 weeks.
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <button className="font-sans flex items-center text-[#2B2B2B]/60 hover:text-[#C88A4A] transition-colors">
                  <Heart size={20} className="mr-2" />
                  Add to Wishlist
                </button>
                <button className="font-sans flex items-center text-[#2B2B2B]/60 hover:text-[#C88A4A] transition-colors">
                  <Share2 size={20} className="mr-2" />
                  Share
                </button>
              </div>
            </div>

            {/* Accordion */}
            <div className="space-y-4">
              {accordionItems.map((item) => (
                <div key={item.id} className="border-b border-[#2B2B2B]/10">
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === item.id ? null : item.id)
                    }
                    className="font-sans w-full flex items-center justify-between py-4 text-left font-medium hover:text-[#C88A4A] transition-colors"
                  >
                    {item.label}
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${
                        openAccordion === item.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordion === item.id && (
                    <div className="pb-4">
                      {Array.isArray(item.content) ? (
                        <ul className="font-sans space-y-2 text-[#2B2B2B]/70">
                          {item.content.map((listItem: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <span className="text-[#C88A4A] mr-2">•</span>
                              {listItem}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="font-sans text-[#2B2B2B]/70 leading-relaxed">
                          {item.content}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#2B2B2B]/10">
              {trustBadges.map((badge, index) => (
                <div key={index} className="text-center">
                  <badge.icon size={24} className="mx-auto mb-2 text-[#5A6A5E]" />
                  <p className="font-sans text-sm text-[#2B2B2B]/70">{badge.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
