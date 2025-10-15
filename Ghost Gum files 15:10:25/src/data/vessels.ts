// src/data/vessels.ts
export type VesselVariant = {
  key: "duo" | "trio" | "150ml" | "300ml";
  label: string;
  blurb: string;
  composition: string[];
  images: {
    hero: { src: string; alt: string };
    secondary?: { src: string; alt: string }; // optional exploded views later
  };
};

export type Vessel = {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  price: number;
  image: string; // card image
  badges?: string[];
  variants?: VesselVariant[];
  details?: {
    materials?: string;
    care?: string;
    gallery?: { src: string; alt: string }[];
  };
};

// Shared premium copy
const MATERIALS =
  "Stoneware ceramic in Ghost Gum off-white (#EFE9DF), matte–satin glaze with micro-speckle and faint bark-like striations. Tone-on-tone recessed emboss.";
const CARE =
  "Wipe ceramic with a soft damp cloth. Rinse inserts with lukewarm water only; dry fully before re-stacking. Avoid harsh detergents on ceramic.";

export const VESSELS: Vessel[] = [
  // Cascade
  {
    id: "Cascade",
    name: "Cascade",
    description:
      "The Cascade unites purpose and permanence. Each tier twists with a soft, damped motion. Keep it assembled on the counter and refill the inner vessels as you go. The outer ceramic is heirloom, the ritual inside evolves.",
    price: 180,
    image:
      "https://res.cloudinary.com/dnq6xt54d/image/upload/v1756871106/ChatGPT_Image_Sep_3_2025_12_28_19_PM_ebobr0.jpg",
    badges: ["Stackable", "Refillable", "Ceramic", "Heirloom"],
    variants: [
      {
        key: "duo",
        label: "The Duo (2-tier)",
        blurb: "The essential carry, cleanse and condition in a slim, two-tier form.",
        composition: [
          "Top: Barrier Balm or Lip Balm",
          "Bottom: Cold-Processed Soap",
        ],
        images: {
          hero: {
            src: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1756871106/ChatGPT_Image_Sep_3_2025_12_20_50_PM_mfsoxf.jpg",
            alt: "Ghost Gum Duo. Two-tier ceramic vessel.",
          },
        },
      },
      {
        key: "trio",
        label: "Trio (3-tier)",
        blurb: "The complete daily ritual. Rehydrate, repair, cleanse in one object.",
        composition: ["Top: Lip Balm", "Middle: Barrier Balm", "Bottom: Cold-Processed Soap"],
        images: {
          hero: {
            src: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1756871106/ChatGPT_Image_Sep_3_2025_12_28_19_PM_ebobr0.jpg",
            alt: "Ghost Gum Trio. three-tier ceramic vessel.",
          },
        },
      },
    ],
    details: { materials: MATERIALS, care: CARE },
  },

  // Alba
  {
    id: "Alba",
    name: "Alba",
    description:
      "The first of our vessels, Alba carries the quiet elegance of a beginning. Named for the first light of day, it reflects the purity and simplicity at the heart of our design philosophy. Refined in form and balanced in proportion, Alba is the original expression of Ghost Gum, enduring, essential, and timeless",
    price: 150,
    image:
      "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757060854/ChatGPT_Image_Sep_5_2025_05_43_06_PM_r4qnci.jpg", // ✅ card image
    badges: ["Ceramic", "Heirloom"],
    details: {
      materials: MATERIALS,
      care: CARE,
      gallery: [
        {
          src: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757060854/ChatGPT_Image_Sep_5_2025_05_43_06_PM_r4qnci.jpg",
          alt: "Alba vessel — hero angle on pale stone",
        },
        {
          src: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757060854/ChatGPT_Image_Sep_5_2025_05_53_04_PM_d0fz5u.jpg",
          alt: "Alba vessel — alternate angle / close detail",
        },
      ],
    },
    variants: [
      {
        key: "150ml",
        label: "Alba 150 ml",
        blurb: "Compact form, balanced for daily balm or cream rituals.",
        composition: [],
        images: {
          hero: {
            src: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757060854/ChatGPT_Image_Sep_5_2025_05_43_06_PM_r4qnci.jpg",
            alt: "Alba vessel — 150 ml hero",
          },
          secondary: {
            src: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757060854/ChatGPT_Image_Sep_5_2025_05_53_04_PM_d0fz5u.jpg",
            alt: "Alba vessel — 150 ml detail",
          },
        },
      },
      {
        key: "300ml",
        label: "Alba 300 ml",
        blurb: "Larger proportion, designed for extended use or shared rituals.",
        composition: [],
        images: {
          hero: {
            src: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757064909/ChatGPT_Image_Sep_5_2025_07_03_30_PM_y3phfr.png",
            alt: "Alba vessel 300 ml — with lid on",
          },
          secondary: {
            src: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757064915/ChatGPT_Image_Sep_5_2025_07_03_49_PM_tdtgez.png",
            alt: "Alba vessel 300 ml — lid off showing liquid inside",
          },
        },
      },
    ],
  },

  // Riverstone
  {
    id: "riverstone", // fixed casing to match routes/links
    name: "Riverstone",
    description:
      "Compact, rounded, intimate. A palm-scale jar whose softly bulbous contour settles into the hand, an everyday companion for skin and counter.",
    price: 120,
    image:
      "https://res.cloudinary.com/dnq6xt54d/image/upload/ChatGPT_Image_Sep_5_2025_03_59_27_PM_xbeczi.jpg", // card image
    badges: ["Ceramic"],
    details: {
      materials: MATERIALS,
      care: CARE,
      gallery: [
        {
          src: "https://res.cloudinary.com/dnq6xt54d/image/upload/ChatGPT_Image_Sep_5_2025_03_59_27_PM_xbeczi.jpg",
          alt: "Riverstone vessel — primary hero image",
        },
        {
          src: "https://res.cloudinary.com/dnq6xt54d/image/upload/v1757055084/ChatGPT_Image_Sep_5_2025_04_05_09_PM_u42ofs.png",
          alt: "Riverstone vessel — alternate angle",
        },
      ],
    },
  },

  // Amphora
  {
    id: "amphora",
    name: "Amphora",
    description:
      "Tapered elegance drawn from antiquity. A slender neck resolves into a calm body; a contemporary amphora for modern routines.",
    price: 140,
    image: "/images/vessels/amphora.jpg",
    badges: ["Ceramic", "Heirloom"],
    details: { materials: MATERIALS, care: CARE },
  },
];

export const findVessel = (id: string) => VESSELS.find((v) => v.id === id) || null;
