// src/data/materials.ts

export type Material = {
  id: string;
  title: string;
  provenance: string;
  image: string;
  flip?: boolean;
  order?: number;
  active?: boolean;
};

/**
 * Render a string in sentence case:
 * - First character uppercased, rest lowercased
 * - Safe for multi-word titles like "Camel Tallow" -> "Camel tallow"
 */
export function sentenceCaseTitle(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/**
 * UI helpers for consistent, more readable headings on the Sustainability > Materials section.
 * - normal-case ensures no global UPPERCASE transform leaks in
 * - sizes tuned for readability without overpowering body copy
 */
export const MATERIALS_HEADING_CLASS =
  "normal-case font-serif tracking-[-0.01em] text-[20px] md:text-[24px] lg:text-[26px]";

export const MATERIALS_SUBTEXT_CLASS =
  "text-sm md:text-base leading-relaxed";

/**
 * Core dataset (keep canonical titles; transform at render time with sentenceCaseTitle()).
 */
export const MATERIALS: Material[] = [
  {
    id: "tallow",
    title: "Tallow",
    provenance: "Rendered gently at low heat to retain natural lipids.",
    image:
      "https://res.cloudinary.com/dnq6xt54d/image/upload/v1756784075/ChatGPT_Image_Sep_2_2025_01_03_51_PM_vniuw8.png",
    order: 10,
    active: true,
  },
  {
    id: "camel-tallow",
    title: "Camel Tallow",
    provenance:
      "Sustainably sourced from Central Australian camels. Rich in fatty acids that protect and repair skin.",
    image:
      "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757120394/ChatGPT_Image_Sep_6_2025_10_23_24_AM_fduoqu.jpg",
    flip: true,
    order: 20,
    active: true,
  },
  {
    id: "ceramic-vessel",
    title: "Ceramic Vessel",
    provenance:
      "Hand-shaped kaolinite-based stoneware. Designed for refill-first permanence.",
    image:
      "https://res.cloudinary.com/dnq6xt54d/image/upload/v1756784779/ChatGPT_Image_Sep_2_2025_01_15_12_PM_sdkpp9.png",
    order: 30,
    active: true,
  },
  {
    id: "jarrah-honey",
    title: "Jarrah Honey",
    provenance:
      "Harvested from Western Australian Jarrah forests. High MGO, rare antibacterial potency.",
    image:
      "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757118999/ChatGPT_Image_Sep_6_2025_09_59_40_AM_tbmnqs.jpg",
    flip: true,
    order: 40,
    active: true,
  },
];

/**
 * Sorted list of active materials (stable canonical titles).
 */
export function getActiveMaterials(): Material[] {
  return MATERIALS.filter((m) => m.active !== false).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );
}

/**
 * Convenience accessor that attaches a sentence-case displayTitle for rendering.
 * Usage:
 *   getActiveMaterialsForDisplay().map(m => <h3>{m.displayTitle}</h3>)
 */
export function getActiveMaterialsForDisplay(): Array<
  Material & { displayTitle: string }
> {
  return getActiveMaterials().map((m) => ({
    ...m,
    displayTitle: sentenceCaseTitle(m.title),
  }));
}
