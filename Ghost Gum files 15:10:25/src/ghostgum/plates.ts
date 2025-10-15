// src/ghostgum/plates.ts
export type Plates = {
  desktop: { blur: string; sharp: string };
  mobile:  { blur: string; sharp: string };
};

export const PLATES_BEESWAX: Plates = {
  desktop: {
    blur:  "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757479670/ChatGPT_Image_Sep_10_2025_01_25_40_PM_2_l8nzxb.jpg",
    sharp: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757479673/ChatGPT_Image_Sep_10_2025_01_25_40_PM_j6xaxy.jpg",
  },
  mobile: {
    blur:  "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757479690/ChatGPT_Image_Sep_10_2025_01_25_40_PM_4_xizwte.jpg",
    sharp: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757479689/ChatGPT_Image_Sep_10_2025_01_25_40_PM_3_chdxjm.jpg",
  },
};

export const PLATES_JARRAH: Plates = {
  desktop: {
    blur:  "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757394719/ChatGPT_Image_Sep_9_2025_02_22_08_PM_3_kw7irz.jpg",
    sharp: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757394727/ChatGPT_Image_Sep_9_2025_02_22_08_PM_2_yujugv.png",
  },
  mobile: {
    blur:  "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757394693/ChatGPT_Image_Sep_9_2025_02_22_08_PM_kwawis.jpg",
    sharp: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757394693/ChatGPT_Image_Sep_9_2025_02_22_08_PM_2_zfniuk.jpg",
  },
};

export const PLATES_TALLOW: Plates = {
  desktop: {
    blur:  "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757479573/ChatGPT_Image_Sep_10_2025_02_10_55_PM_5_shfcvd.jpg",
    sharp: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757479572/ChatGPT_Image_Sep_10_2025_02_10_55_PM_4_ygliin.jpg",
  },
  mobile: {
    blur:  "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757479509/ChatGPT_Image_Sep_10_2025_02_10_55_PM_ul6f0z.jpg",
    sharp: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757479517/ChatGPT_Image_Sep_10_2025_02_10_55_PM_2_ayhcma.png",
  },
};

/* -------------------- NEW: Native Botanicals -------------------- */
export const PLATES_BOTANICALS: Plates = {
  desktop: {
    blur:  "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757490072/ChatGPT_Image_Sep_10_2025_04_11_13_PM_2_i9pavp.jpg",
    sharp: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757490075/ChatGPT_Image_Sep_10_2025_04_11_13_PM_3_tvauwu.jpg",
  },
  mobile: {
    blur:  "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757490076/ChatGPT_Image_Sep_10_2025_04_11_13_PM_4_sdosmy.jpg",
    sharp: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757490080/ChatGPT_Image_Sep_10_2025_04_11_13_PM_rosry6.jpg",
  },
};

/* ---------- Editorial metadata (non-breaking) ---------- */
export type IngredientMeta = {
  slug: string;
  name: string;
  blurb: string; // keep tight; luxury = restraint
  credit?: string;
  plates: Plates;
};

export const INGREDIENTS_EDITORIAL: IngredientMeta[] = [
  {
    slug: "beeswax",
    name: "Beeswax",
    blurb: "Soft occlusion; reduces TEWL while keeping finish breathable.",
    credit: "Ghost Gum Micro-Lab",
    plates: PLATES_BEESWAX,
  },
  {
    slug: "jarrah-honey",
    name: "Jarrah Honey",
    blurb: "Low-water activity; supports a calm, conditioned surface state.",
    credit: "Ghost Gum Micro-Lab",
    plates: PLATES_JARRAH,
  },
  {
    slug: "tallow",
    name: "Camel / Beef Tallow",
    blurb: "Barrier-affine lipids that cushion and seal without heaviness.",
    credit: "Ghost Gum Micro-Lab",
    plates: PLATES_TALLOW,
  },
  {
    slug: "botanicals",
    name: "Native Botanicals",
    blurb: "Plant actives chosen for calm, conditioned skin feel.",
    credit: "Ghost Gum Micro-Lab",
    plates: PLATES_BOTANICALS,
  },
];
