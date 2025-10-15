// src/data/products.ts

/* ---------------- Types ---------------- */

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  ingredients: string[];
  description?: string;
  image?: string;
}

export type ProductCategory = 'beef-tallow' | 'camel-tallow' | 'ceramics';
export type ProductType = 'balm' | 'soap' | 'lip-balm' | 'vessel';

export interface Product {
  title: string;
  handle: string;
  shortDescription: string;
  longDescription?: string;
  keyBenefits: string[];
  howToUse?: string;
  ingredients: string[];
  allergens?: string[];
  images?: string[];
  cloudinaryId?: string;
  price: number;
  compareAtPrice?: number;
  subscriptionEligible: boolean;
  badges?: string[];
  provenance: string;
  weight?: string;
  volume?: string;
  sku?: string;
  inventory?: number;
  seoTitle?: string;
  seoDescription?: string;
  crossSells?: string[];
  category: ProductCategory;
  productType: ProductType;
  variants?: ProductVariant[];
}

/* ---------------- Catalog ---------------- */

export const products: Product[] = [
  // BEEF TALLOW CORE RANGE
  {
    title: "Protective Barrier Balm",
    handle: "protective-barrier-balm",
    shortDescription: "Beef tallow balm for daily protection. Available with Jarrah honey or naked.",
    longDescription:
      "A lighter-weight balm perfect for daily use. Beef tallow provides lasting protection. Choose between our signature Jarrah honey blend or the pure naked version.",
    keyBenefits: ["Locks in moisture", "Wind & sun routine-friendly", "Non-greasy"],
    howToUse:
      "Apply to face and exposed areas before sun exposure or harsh weather. Reapply as needed.",
    ingredients: ["Beef tallow", "Beeswax"],
    images: ["https://i.ibb.co/GvJM6Y1F/Chat-GPT-Image-Aug-23-2025-11-38-16-AM.jpg"],
    price: 42.0,
    subscriptionEligible: true,
    badges: ["Beef Tallow", "Core Range"],
    provenance: "NT-sourced tallow; small-batch.",
    volume: "50ml",
    category: "beef-tallow",
    productType: "balm",
    variants: [
      {
        id: "naked",
        title: "Naked",
        price: 40.0,
        ingredients: ["Beef tallow", "Beeswax"],
        description: "Pure and simple - just beef tallow and beeswax",
        image:
          "https://i.ibb.co/GvJM6Y1F/Chat-GPT-Image-Aug-23-2025-11-38-16-AM.jpg",
      },
      {
        id: "jarrah-honey",
        title: "Jarrah Honey",
        price: 42.0,
        ingredients: ["Beef tallow", "Jarrah honey", "Beeswax"],
        description:
          "Our signature blend with antimicrobial Jarrah honey",
        image:
          "https://i.ibb.co/Wv9Q1frH/Chat-GPT-Image-Aug-23-2025-11-03-51-AM.png",
      },
    ],
  },
  {
    title: "Protective Barrier Balm Refill",
    handle: "protective-barrier-balm-refill",
    shortDescription:
      "Refill packets for your ceramic jar. Available in Jarrah honey or naked.",
    longDescription:
      "Sustainable refill packets designed to fit perfectly in your existing ceramic jar. Choose between our Jarrah honey blend or the pure naked version. Designed to be directed easily into our ceramic jars using a biodegradable nozzle system.",    keyBenefits: ["Eco-friendly refill", "Same premium formula", "Perfect jar fit"],
    howToUse:
      "Remove old balm residue from jar, warm refill packet slightly, and pour into ceramic jar. Allow to set for 30 minutes.",
    ingredients: ["Beef tallow", "Beeswax"],
    images: ["https://i.ibb.co/Y41z619Y/Chat-GPT-Image-Aug-23-2025-08-57-08-PM.png"],
    price: 32.0,
    subscriptionEligible: true,
    badges: ["Refill", "Eco-Friendly", "Core Range"],
    provenance:
      "NT-sourced tallow; Kraft packaging that fully biodegrades",
    volume: "50ml",
    category: "beef-tallow",
    productType: "balm",
    variants: [
      {
        id: "naked-refill",
        title: "Naked Refill",
        price: 30.0,
        ingredients: ["Beef tallow", "Beeswax"],
        description:
          "Pure refill packet - just beef tallow and beeswax with bio-based nozzle system for easy pouring",
        image:
          "https://i.ibb.co/Y41z619Y/Chat-GPT-Image-Aug-23-2025-08-57-08-PM.png",
      },
      {
        id: "jarrah-honey-refill",
        title: "Jarrah Honey Refill",
        price: 32.0,
        ingredients: ["Beef tallow", "Jarrah honey", "Beeswax"],
        description:
          "Our signature blend refill with antimicrobial Jarrah honey and bio-based nozzle system for easy pouring",
        image:
          "https://i.ibb.co/KxcQ9B84/Chat-GPT-Image-Aug-23-2025-08-50-47-PM.png",
      },
    ],
  },
  {
    title: "Lip Balm",
    handle: "lip-balm",
    shortDescription:
      "Beef tallow lip balms in three nourishing blends. Choose your favorite flavor.",
    longDescription:
      "The perfect introduction to our tallow-based skincare. Compact and convenient for daily lip care with the nourishing power of beef tallow. Available in three delicious blends.",
    keyBenefits: ["Daily softening", "Pocket-friendly", "Non-shiny finish"],
    howToUse: "Apply to lips as needed throughout the day.",
    ingredients: ["Beef tallow", "Beeswax"],
    images: ["https://i.ibb.co/rfKtBpLJ/Chat-GPT-Image-Aug-23-2025-08-47-48-AM.png"],
    price: 16.0,
    subscriptionEligible: true,
    badges: ["Lip", "Core Range"],
    provenance: "Small-batch poured; recyclable tin.",
    volume: "15ml",
    category: "beef-tallow",
    productType: "lip-balm",
    variants: [
      {
        id: "mango-butter",
        title: "Mango Butter",
        price: 16.0,
        ingredients: ["Beef tallow", "Mango butter", "Beeswax"],
        description:
          "Tropical mango butter for smooth, soft lips with a subtle fruity scent",
      },
      {
        id: "jarrah-honey",
        title: "Jarrah Honey",
        price: 16.0,
        ingredients: ["Beef tallow", "Jarrah honey", "Beeswax"],
        description:
          "Our signature blend with antimicrobial Jarrah honey for protection and nourishment",
      },
      {
        id: "kakadu-plum",
        title: "Kakadu Plum",
        price: 18.0,
        ingredients: ["Beef tallow", "Kakadu plum extract", "Beeswax"],
        description:
          "Rich in Vitamin C from native Kakadu plum for antioxidant lip care",
      },
    ],
  },
  {
    title: "Cold Process Soap",
    handle: "cold-process-soap",
    shortDescription:
      "Rich soaps crafted with tallow. Choose from three botanical blends.",
    longDescription:
      "Handcrafted cold process soaps made with tallow for a balanced, restorative cleanse. Each blend features unique Australian botanicals with their own character and benefits.",
    keyBenefits: ["Naturally hydrating", "Deeply nourishing", "Balanced cleanse"],
    howToUse:
      "Work into a rich lather with warm water. Use morning and evening for best results.",
    ingredients: ["Beef tallow", "Coconut oil", "Olive oil", "Sodium hydroxide"],
    images: ["https://i.ibb.co/1JhFX1Xs/Chat-GPT-Image-Aug-22-2025-08-56-55-AM.png"],
    price: 28.0,
    subscriptionEligible: true,
    badges: ["Cold Process", "Core Range"],
    provenance: "Hand cut bars; 6 week cure time.",
    weight: "120g",
    category: "beef-tallow",
    productType: "soap",
    variants: [
      {
        id: "jarrah-honey",
        title: "Jarrah Honey",
        price: 28.0,
        ingredients: [
          "Beef tallow",
          "Jarrah honey",
          "Coconut oil",
          "Olive oil",
          "Sodium hydroxide",
        ],
        description:
          "Rich, desert-born soap infused with wild Jarrah honey. Naturally hydrating and deeply nourishing, with warm amber tones.",
        image:
          "https://i.ibb.co/1JhFX1Xs/Chat-GPT-Image-Aug-22-2025-08-56-55-AM.png",
      },
      {
        id: "kakadu-plum",
        title: "Kakadu Plum",
        price: 32.0,
        ingredients: [
          "Beef tallow",
          "Kakadu plum extract",
          "Eucalyptus oil",
          "Coconut oil",
          "Olive oil",
          "Sodium hydroxide",
        ],
        description:
          "Refreshing soap with Kakadu plum — the world's richest source of natural Vitamin C. Pale green freshness with eucalyptus undertones.",
        image:
          "https://i.ibb.co/pvVKxRxN/Chat-GPT-Image-Aug-22-2025-09-53-11-AM.png",
      },
      {
        id: "desert-quandong",
        title: "Desert Quandong",
        price: 32.0,
        ingredients: [
          "Beef tallow",
          "Desert quandong extract",
          "Sweet orange oil",
          "Coconut oil",
          "Olive oil",
          "Sodium hydroxide",
        ],
        description:
          "Earthy, sun-kissed soap with desert quandong. Bursting with red and peachy tones, bringing both vitality and softness.",
        image:
          "https://i.ibb.co/RkngY5cC/Chat-GPT-Image-Aug-22-2025-09-33-12-AM.png",
      },
    ],
  },

  // CAMEL TALLOW — ONLY REFILL EXPOSED ON SHOP
  {
    title: "Signature Balm Refill",
    handle: "Signature-balm-refill",
    shortDescription: "Premium camel hump tallow in a biodegradable kraft refill.",
    longDescription:
      "Our premium camel hump tallow balm in a minimalist kraft refill pack. Designed to decant cleanly into your vessel of choice. Biodegradable materials, no microplastics.",
    keyBenefits: ["Intensive moisture", "Soft barrier finish"],
    howToUse:
      "Warm the packet slightly, snip the corner, and pour into a clean, dry jar or vessel. Allow to set before use.",
    ingredients: ["Camel tallow", "Vitamin E", "Essential oils"],
    images: [
      "https://res.cloudinary.com/dnq6xt54d/image/upload/v1758246050/ChatGPT_Image_Sep_6_2025_01_29_50_PM_eym95k.jpg",
    ],
    price: 44.0,
    subscriptionEligible: true,
    badges: ["Refill", "Camel Tallow", "Premium"],
    provenance: "Crafted on NT stations.",
    volume: "150ml",
    crossSells: ["tallow-honey-lip-balm", "protective-barrier-balm"],
    category: "camel-tallow",
    productType: "balm",
  },

  {
    title: "Cold Process Soap Refills",
    handle: "cold-process-soap-refills",
    shortDescription:
      "Sustainable kraft refills for your Ghost Gum ceramic soap jars.",
    longDescription:
      "Eco-friendly refill packs designed to fit perfectly in your existing ceramic soap jar. Each refill contains the same premium cold process formulation as the original bars. Ghost Gum refills use biodegradable kraft packaging with minimal environmental impact.",
    keyBenefits: [
      "Eco-friendly refill",
      "Same premium formula",
      "Perfect jar fit",
      "Biodegradable packaging",
    ],
    howToUse:
      "Remove old soap residue from jar, unwrap refill pack, and place soap bar into ceramic jar. Allow to settle for best fit.",
    ingredients: ["Beef tallow", "Coconut oil", "Olive oil", "Sodium hydroxide"],
    images: ["https://i.ibb.co/k6xZv2nZ/Chat-GPT-Image-Aug-25-2025-11-28-09-AM.png"],
    price: 22.0,
    subscriptionEligible: true,
    badges: ["Refill", "Eco-Friendly", "Cold Process"],
    provenance:
      "Hand-cut bars; biodegradable kraft packaging; 6-week cure time.",
    weight: "120g",
    category: "beef-tallow",
    productType: "soap",
    variants: [
      {
        id: "jarrah-honey-refill",
        title: "Jarrah Honey Refill Pack",
        price: 22.0,
        ingredients: [
          "Beef tallow",
          "Jarrah honey",
          "Coconut oil",
          "Olive oil",
          "Sodium hydroxide",
        ],
        description:
          "Hydrating cold process soap with rich West Australian Jarrah honey.",
        image:
          "https://i.ibb.co/k6xZv2nZ/Chat-GPT-Image-Aug-25-2025-11-28-09-AM.png",
      },
      {
        id: "kakadu-plum-refill",
        title: "Kakadu Plum Refill Pack",
        price: 26.0,
        ingredients: [
          "Beef tallow",
          "Kakadu plum extract",
          "Eucalyptus oil",
          "Coconut oil",
          "Olive oil",
          "Sodium hydroxide",
        ],
        description:
          "Bright, vitamin-rich native soap powered by Kakadu plum.",
        image:
          "https://i.ibb.co/mr0cjc1d/Chat-GPT-Image-Aug-25-2025-11-28-05-AM.jpg",
      },
      {
        id: "desert-quandong-refill",
        title: "Desert Quandong Refill Pack",
        price: 26.0,
        ingredients: [
          "Beef tallow",
          "Desert quandong extract",
          "Sweet orange oil",
          "Coconut oil",
          "Olive oil",
          "Sodium hydroxide",
        ],
        description:
          "Nutrient-dense desert fruit soap with vibrant quandong essence.",
        image:
          "https://i.ibb.co/JRhqjpK5/Chat-GPT-Image-Aug-25-2025-11-27-59-AM.png",
      },
    ],
  },

  /* -------- CERAMIC VESSELS -------- */
  {
    title: "Ritual Vessel",
    handle: "ritual-vessel",
    shortDescription:
      "Compact, rounded, intimate in form. Matte–satin off-white (#EFE9DF).",
    longDescription:
      "Minimal form. Eternal material. A refillable ceramic designed to accompany daily ritual.",
    keyBenefits: [
      "Refillable & enduring",
      "Embossed mark that will not fade",
      "Matte–satin glaze for tactile grip",
    ],
    howToUse:
      "Refill with your chosen balm. Hand wash only; avoid abrasives.",
    ingredients: ["Kaolinitic clay body", "Mineral glaze"],
    images: ["/images/vessels/ritual.jpg"],
    price: 120.0,
    subscriptionEligible: false,
    badges: ["Collection pricing eligible"],
    provenance:
      "Kaolinitic clay from Anningie — deposits formed over millions of years from ancient riverbeds.",
    category: "ceramics",
    productType: "vessel",
    variants: [
      {
        id: "ritual-std",
        title: "Standard",
        price: 120.0,
        ingredients: ["Kaolinitic clay body", "Mineral glaze"],
      },
    ],
  },
  {
    title: "Amphora Vessel",
    handle: "amphora-vessel",
    shortDescription:
      "Tapered elegance inspired by antiquity; modern flush lid.",
    keyBenefits: ["Refillable & enduring", "Sculptural silhouette", "Tone-on-tone emboss"],
    howToUse:
      "Refill with your chosen balm. Hand wash only; avoid abrasives.",
    ingredients: ["Kaolinitic clay body", "Mineral glaze"],
    images: ["/images/vessels/amphora.jpg"],
    price: 140.0,
    subscriptionEligible: false,
    badges: ["Collection pricing eligible"],
    provenance:
      "Crafted with museum-level attention; designed to age gracefully through use.",
    category: "ceramics",
    productType: "vessel",
    variants: [
      {
        id: "amphora-std",
        title: "Standard",
        price: 140.0,
        ingredients: ["Kaolinitic clay body", "Mineral glaze"],
      },
    ],
  },
  {
    title: "Modernist Vessel",
    handle: "modernist-vessel",
    shortDescription:
      "Cylindrical, balanced, architectural; flush ultra-low lid.",
    keyBenefits: [
      "Refillable & enduring",
      "Architectural calm",
      "Embossed ‘GHOST GUM’",
    ],
    howToUse:
      "Refill with your chosen balm. Hand wash only; avoid abrasives.",
    ingredients: ["Kaolinitic clay body", "Mineral glaze"],
    images: ["/images/vessels/modernist.jpg"],
    price: 150.0,
    subscriptionEligible: false,
    badges: ["Collection pricing eligible"],
    provenance:
      "Made in small runs to maintain material integrity and finish.",
    category: "ceramics",
    productType: "vessel",
    variants: [
      {
        id: "modernist-std",
        title: "Standard",
        price: 150.0,
        ingredients: ["Kaolinitic clay body", "Mineral glaze"],
      },
    ],
  },
];

/* ---------------- Helpers ---------------- */

export const getProductByHandle = (handle: string): Product | undefined => {
  return products.find((product) => product.handle === handle);
};

export const getProductsByCategory = (
  category: ProductCategory
): Product[] => {
  return products.filter((product) => product.category === category);
};

export const getProductsByType = (productType: ProductType): Product[] => {
  return products.filter((product) => product.productType === productType);
};

// Convenience getter if you need it on the Vessels page
export const getVessels = (): Product[] =>
  products.filter((p) => p.productType === "vessel");
