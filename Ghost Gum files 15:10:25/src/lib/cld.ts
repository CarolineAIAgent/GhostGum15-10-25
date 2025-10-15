// src/lib/cld.ts
/**
 * Cloudinary helpers for Ghost Gum
 * - Keeps your original publicId-based builder + presets
 * - Adds URL-based helpers used by cards: isCloudinary, cldUrlWithWidth, buildSrcSet
 */

export const CLOUD_NAME =
  (import.meta as any)?.env?.VITE_CLD_CLOUD_NAME || "dltcukojz";
export const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

export interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: "auto" | number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  crop?: "fill" | "fit" | "scale" | "crop";
  gravity?: "auto" | "face" | "center";
  dpr?: "auto" | number;
}

/* ------------------------------------------------------------------ */
/* Original API (publicId-based)                                       */
/* ------------------------------------------------------------------ */

export function buildCloudinaryUrl(
  publicId: string,
  options: CloudinaryOptions = {}
): string {
  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
    gravity = "auto",
    dpr = "auto",
  } = options;

  const transforms: string[] = [];

  // Dimensions (never upscale)
  if (width || height) {
    const w = width ? `w_${width}` : "";
    const h = height ? `h_${height}` : "";
    const c = `c_${crop}`;
    const g = gravity !== "auto" ? `g_${gravity}` : "";
    transforms.push([w, h, c, g].filter(Boolean).join(","));
  }

  if (quality) transforms.push(`q_${quality}`);
  if (dpr) transforms.push(`dpr_${dpr}`);
  if (format) transforms.push(`f_${format}`);

  const transformString = transforms.length > 0 ? `/${transforms.join("/")}` : "";
  return `${BASE_URL}${transformString}/${publicId}`;
}

// Preset configurations for common use cases (unchanged)
export const presets = {
  hero: (publicId: string) =>
    buildCloudinaryUrl(publicId, {
      width: 1920,
      height: 1080,
      quality: "auto",
      format: "auto",
      crop: "fill",
      gravity: "auto",
      dpr: "auto",
    }),

  productCard: (publicId: string) =>
    buildCloudinaryUrl(publicId, {
      width: 400,
      height: 500,
      quality: "auto",
      format: "auto",
      crop: "fill",
      gravity: "center",
      dpr: "auto",
    }),

  productDetail: (publicId: string) =>
    buildCloudinaryUrl(publicId, {
      width: 800,
      height: 800,
      quality: "auto",
      format: "auto",
      crop: "fill",
      gravity: "center",
      dpr: "auto",
    }),

  thumbnail: (publicId: string) =>
    buildCloudinaryUrl(publicId, {
      width: 200,
      height: 200,
      quality: "auto",
      format: "auto",
      crop: "fill",
      gravity: "center",
      dpr: "auto",
    }),
};

// DPR-style srcset for publicId usage (kept for backward compat)
export function generateSrcSet(publicId: string, baseWidth: number): string {
  const sizes = [1, 1.5, 2, 3]; // DPR multipliers
  return sizes
    .map((dpr) => {
      const width = Math.round(baseWidth * dpr);
      const url = buildCloudinaryUrl(publicId, {
        width,
        quality: "auto",
        format: "auto",
        dpr: 1, // DPR reflected in width above
      });
      return `${url} ${dpr}x`;
    })
    .join(", ");
}

/* ------------------------------------------------------------------ */
/* URL-based helpers (used by ImmersiveProductCard, etc.)              */
/* ------------------------------------------------------------------ */

/** Detect if a string is a Cloudinary URL (not just a publicId). */
export function isCloudinary(url?: string): boolean {
  if (!url) return false;
  return /res\.cloudinary\.com\/|\/image\/upload\//i.test(url);
}

/**
 * Given a Cloudinary URL, ensure transforms include f_auto,q_auto,dpr_auto and a specific width.
 * If you pass a publicId (not a URL), builds a Cloudinary URL at that width.
 * If you pass a non-Cloudinary absolute URL, returns it unchanged.
 */
export function cldUrlWithWidth(srcOrPublicId: string, w: number): string {
  if (!srcOrPublicId) return srcOrPublicId;

  // If it's just a publicId (no http/https), build a proper URL
  if (!/^https?:\/\//i.test(srcOrPublicId) && !isCloudinary(srcOrPublicId)) {
    return buildCloudinaryUrl(srcOrPublicId, {
      width: w,
      quality: "auto",
      format: "auto",
      dpr: "auto",
      crop: "fill",
      gravity: "auto",
    });
  }

  // Non-Cloudinary absolute URL
  if (!isCloudinary(srcOrPublicId)) return srcOrPublicId;

  const i = srcOrPublicId.indexOf("/upload/");
  if (i === -1) return srcOrPublicId;

  const prefix = srcOrPublicId.slice(0, i + 8); // includes "/upload/"
  const suffix = srcOrPublicId.slice(i + 8);

  // If suffix begins with a transform segment, merge; otherwise create one
  const hasParams = /^[^/]+\//.test(suffix);
  if (hasParams) {
    return (
      prefix +
      suffix.replace(/^[^/]+/, (seg) => {
        let next = seg;
        if (!/f_auto/.test(next)) next += ",f_auto";
        if (!/q_auto/.test(next)) next += ",q_auto";
        if (!/dpr_auto/.test(next)) next += ",dpr_auto";
        if (/w_\d+/.test(next)) next = next.replace(/w_\d+/, `w_${w}`);
        else next += `,w_${w}`;
        return next;
      })
    );
  }

  const params = `w_${w},f_auto,q_auto,dpr_auto`;
  return `${prefix}${params}/${suffix}`;
}

/**
 * Build a width-based srcset string for a Cloudinary URL (or publicId).
 * Returns undefined for non-Cloudinary absolute URLs (so <img> will just use src).
 */
export function buildSrcSet(
  srcOrPublicId: string,
  widths: number[] = [480, 720, 900, 1200, 1600]
): string | undefined {
  // For non-Cloudinary absolute URLs, we can't generate variants — let browser use `src`.
  if (/^https?:\/\//i.test(srcOrPublicId) && !isCloudinary(srcOrPublicId)) {
    return undefined;
  }
  return widths.map((w) => `${cldUrlWithWidth(srcOrPublicId, w)} ${w}w`).join(", ");
}
