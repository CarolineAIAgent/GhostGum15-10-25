// src/pages/Shop.tsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { LayoutGrid, Rows, ChevronLeft, Filter } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import ImmersiveProductCard from "../components/ImmersiveProductCard";
import QuickLookModal from "../components/QuickLookModal";
import { products } from "../data/products";

type FilterId =
  | "all"
  | "beef-tallow"
  | "camel-tallow"
  | "balm"
  | "soap"
  | "lip"
  | "refill";

type KindId = "balm" | "soap" | "lip" | null;
type ViewMode = "grid" | "list";

const COPY = {
  title: "Ghost Gum — Shop",
  blurb: "Recognisable materials. Quiet efficacy. Rituals for skin and land.",
  trust: ["Free express $150+", "30-day easy returns", "Made in NT, Australia"],
};

const SENSORY = [
  { id: "earthy", label: "Earthy" },
  { id: "resin", label: "Resin" },
  { id: "citrus", label: "Citrus" },
  { id: "honey", label: "Honey" },
];

const RANGE_FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "balm", label: "Balms" },
  { id: "soap", label: "Soaps" },
  { id: "lip", label: "Lip Balms" },
  { id: "beef-tallow", label: "Core (Beef)" },
  { id: "camel-tallow", label: "Premium (Camel)" },
];

const ATTRIBUTE_FILTERS: { id: FilterId; label: string }[] = [{ id: "refill", label: "Refills" }];

/* ---------- helpers ---------- */
function isFilterId(v: unknown): v is FilterId {
  return (
    v === "all" ||
    v === "beef-tallow" ||
    v === "camel-tallow" ||
    v === "balm" ||
    v === "soap" ||
    v === "lip" ||
    v === "refill"
  );
}

/** identify vessel SKUs so we can exclude them from Shop */
function isVessel(p: any): boolean {
  const type = (p.productType || "").toString().toLowerCase();
  const cat = (p.category || "").toString().toLowerCase();
  const coll = (p.collection || "").toString().toLowerCase();
  const handle = (p.handle || "").toString().toLowerCase();
  const tags: string[] = (p.tags || []).map((t: any) => String(t).toLowerCase());

  const markers = ["vessel", "ceramic-vessel", "jar", "jar-vessel", "vessels", "ceramic"];
  const hasMarker =
    markers.includes(type) ||
    markers.includes(cat) ||
    markers.includes(coll) ||
    markers.some((m) => handle.includes(m)) ||
    tags.some((t) => markers.includes(t) || t.includes("vessel"));

  return hasMarker;
}

function baseKeyFromProduct(p: any): string {
  const h = p.handle?.replace(/-refill.*/i, "");
  if (h) return h;
  return p.title.replace(/\s*refill.*$/i, "").trim().toLowerCase();
}
function pairRefills(list: any[]) {
  const groups = new Map<string, any[]>();
  list.forEach((p) => {
    const key = baseKeyFromProduct(p);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  });
  const ordered: any[] = [];
  for (const [, arr] of groups) {
    const base = arr.filter((x) => !(x.badges || []).includes("Refill"));
    const refills = arr.filter((x) => (x.badges || []).includes("Refill"));
    ordered.push(...base, ...refills);
  }
  return ordered;
}

function applyFilter(list: any[], selected: FilterId, kind: KindId) {
  return list.filter((product) => {
    if (selected === "all") return true;
    if (selected === "beef-tallow" || selected === "camel-tallow") {
      return product.category === selected;
    }
    if (selected === "balm" || selected === "soap" || selected === "lip") {
      return product.productType === selected;
    }
    if (selected === "refill") {
      const isRefill = product.badges?.includes("Refill");
      if (!isRefill) return false;
      return kind ? product.productType === kind : true;
    }
    return true;
  });
}

/* ---------- tiny UI primitives ---------- */
const Pill: React.FC<{
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  ariaPressed?: boolean;
}> = ({ active, children, onClick, ariaPressed }) => (
  <button
    onClick={onClick}
    aria-pressed={ariaPressed}
    className={[
      "whitespace-nowrap rounded-xl",
      "px-3 py-1.5",
      "text-sm tracking-wide",
      "transition-colors duration-200",
      active
        ? "bg-[#2F2722] text-white border border-[#2F2722]"
        : "bg-transparent text-[#2F2722] border border-[#2F2722]/25 hover:border-[#C88A4A] hover:text-[#C88A4A]",
    ].join(" ")}
  >
    {children}
  </button>
);

const ViewToggle: React.FC<{ mode: ViewMode; onChange: (m: ViewMode) => void }> = ({
  mode,
  onChange,
}) => (
  <div className="inline-flex items-center gap-1 rounded-xl border border-[#2F2722]/25 p-1">
    <button
      aria-label="Grid view"
      className={`flex items-center gap-2 rounded-lg px-2 py-1 text-sm ${
        mode === "grid" ? "bg-[#2F2722] text-white" : "hover:text-[#C88A4A]"
      }`}
      onClick={() => onChange("grid")}
    >
      <LayoutGrid size={16} /> Grid
    </button>
    <button
      aria-label="List view"
      className={`flex items-center gap-2 rounded-lg px-2 py-1 text-sm ${
        mode === "list" ? "bg-[#2F2722] text-white" : "hover:text-[#C88A4A]"
      }`}
      onClick={() => onChange("list")}
    >
      <Rows size={16} /> List
    </button>
  </div>
);

/* ---------- main ---------- */
const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // derive state from URL
  const initialFilter = searchParams.get("filter");
  const initialKind = searchParams.get("kind");

  const [selectedFilter, setSelectedFilter] = useState<FilterId>(
    isFilterId(initialFilter) ? initialFilter : "all"
  );
  const [kind, setKind] = useState<KindId>(
    initialKind && (initialKind === "balm" || initialKind === "soap" || initialKind === "lip")
      ? (initialKind as KindId)
      : null
  );

  const [mode, setMode] = useState<ViewMode>(() =>
    (typeof window !== "undefined" &&
      (sessionStorage.getItem("gg:view") as ViewMode)) ||
    "grid"
  );

  // Quick Look modal (desktop-only)
  const [quick, setQuick] = useState<{ open: boolean; handle?: string }>({ open: false });
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : true
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("gg:view", mode);
    }
  }, [mode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Build the source list for the shop (EXCLUDING vessels)
  // ❗ compute fresh each render so new/updated products appear after HMR or data edits
  const SHOP_SOURCE = products.filter((p) => !isVessel(p));

  // sticky subnav shadow + ambient tone shift
  const subnavRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = subnavRef.current;
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY;
      const scrolled = y > 8;
      el.classList.toggle("shadow-[0_4px_24px_rgba(0,0,0,0.06)]", scrolled);
      el.classList.toggle("backdrop-blur-sm", scrolled);
      document.body.style.setProperty("--gg-ambient", y > 300 ? "#F3EEE6" : "#F7F4EF");
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // keep state in sync if URL changes
  useEffect(() => {
    const f = searchParams.get("filter");
    const k = searchParams.get("kind");
    if (isFilterId(f)) setSelectedFilter((prev) => (prev !== f ? f : prev));
    else if (f === null || f === "jarrah") setSelectedFilter("all"); // legacy jarrah param → All
    setKind(k && (k === "balm" || k === "soap" || k === "lip") ? (k as KindId) : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // deep link ?product=
  useEffect(() => {
    const targetHandle = searchParams.get("product");
    if (!targetHandle) return;
    const p = SHOP_SOURCE.find((x) => x.handle === targetHandle);
    if (!p) return;
    const isRefill = (p.badges || []).includes("Refill");
    const desiredFilter: FilterId = isRefill
      ? "refill"
      : (p.productType as "balm" | "soap" | "lip");
    const desiredKind: KindId = isRefill ? (p.productType as KindId) : null;

    const already =
      selectedFilter === desiredFilter && (desiredFilter !== "refill" || kind === desiredKind);

    if (!already) {
      setSelectedFilter(desiredFilter);
      setKind(desiredKind);
      const next = new URLSearchParams(searchParams);
      next.set("filter", desiredFilter);
      if (desiredFilter === "refill" && desiredKind) next.set("kind", desiredKind);
      else next.delete("kind");
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("product"), SHOP_SOURCE.length]);

  const filteredProducts = useMemo(
    () => pairRefills(applyFilter(SHOP_SOURCE, selectedFilter, kind)),
    [SHOP_SOURCE, selectedFilter, kind]
  );

  // Interleave editorial tiles every N items
  const INTERLEAVE_EVERY = 6;
  const editorialTiles = [
    {
      kicker: "Place → Material",
      title: "Ghost Gum Bark Dust",
      blurb:
        "Collected after windfall; sifted and sun-dried. The colour world that anchors Ghost Gum.",
      tone: "clay" as const,
    },
    {
      kicker: "Care → Process",
      title: "Cold-Process Cure",
      blurb:
        "28-day slow cure for our soaps—denser lather, calmer skin, steadier bar life.",
      tone: "wax" as const,
    },
    {
      kicker: "Material → Craft",
      title: "Rendered in Alice Springs",
      blurb:
        "Local tallow rendered low and slow; filtered clear. Quietly effective, traceable.",
      tone: "warm" as const,
    },
  ];
  const interleaved: Array<{ type: "product"; data: any } | { type: "tile"; data: any }> = [];
  let tileIndex = 0;
  filteredProducts.forEach((p, i) => {
    interleaved.push({ type: "product", data: p });
    const shouldInsert = (i + 1) % INTERLEAVE_EVERY === 0 && tileIndex < editorialTiles.length;
    if (shouldInsert) interleaved.push({ type: "tile", data: editorialTiles[tileIndex++] });
  });

  const handleSelect = (id: FilterId) => {
    setSelectedFilter(id);
    const next = new URLSearchParams(searchParams);
    if (id === "all") next.delete("filter");
    else next.set("filter", id);
    if (id !== "refill") next.delete("kind");
    next.delete("product");
    setSearchParams(next, { replace: false });
  };

  return (
    <div
      className="min-h-screen text-[#2F2722]"
      style={{
        background:
          "radial-gradient(90rem 60rem at 50% -10%, #FFFDF8 0%, var(--gg-ambient, #F7F4EF) 60%, #F2ECE4 100%)",
      }}
    >
      {/* Editorial hero */}
      <header className="mx-auto max-w-[1200px] px-6 pt-12 pb-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-9">
            <h1 className="font-serif text-4xl leading-tight md:text-5xl">{COPY.title}</h1>
            <p className="mt-3 max-w-2xl text-base/7 text-[#2F2722]/70 md:text-lg/8">
              {COPY.blurb}
            </p>
          </div>
          <div className="md:col-span-3 md:justify-self-end">
            <div className="flex items-center gap-3 text-sm/6 text-[#2F2722]/70">
              {COPY.trust.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="h-[6px] w-[6px] rounded-full bg-[#2F2722]/25" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Sticky filters */}
      <div
        ref={subnavRef}
        className="sticky top-0 z-30 border-y border-[#2F2722]/10 bg-[rgba(247,244,239,0.75)] supports-[backdrop-filter]:backdrop-blur-md"
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
            <nav
              aria-label="Shop sections"
              className="-mx-2 flex items-center gap-2 overflow-x-auto px-2"
            >
              {RANGE_FILTERS.map((f) => (
                <Pill
                  key={f.id}
                  active={selectedFilter === f.id}
                  ariaPressed={selectedFilter === f.id}
                  onClick={() => handleSelect(f.id)}
                >
                  {f.label}
                </Pill>
              ))}
              {ATTRIBUTE_FILTERS.map((f) => (
                <Pill
                  key={f.id}
                  active={selectedFilter === f.id}
                  ariaPressed={selectedFilter === f.id}
                  onClick={() => handleSelect(f.id)}
                >
                  {f.label}
                </Pill>
              ))}
            </nav>

            {/* Sensory facets */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="inline-flex items-center gap-2 text-sm text-[#2F2722]/60">
                <Filter size={14} /> Sensory:
              </span>
              {SENSORY.map((s) => (
                <span
                  key={s.id}
                  className="rounded-full border border-[#2F2722]/20 bg-white/60 px-2.5 py-1 text-[12px] text-[#5A544B] backdrop-blur-[1px]"
                >
                  {s.label}
                </span>
              ))}
            </div>

            <ViewToggle mode={mode} onChange={setMode} />
          </div>
        </div>
      </div>

      {/* Product Grid (mobile = 2-col grid; list stays single column) */}
      <main className="mx-auto max-w-[1200px] px-6 py-10">
        {interleaved.length > 0 ? (
          <div
            className={
              mode === "grid"
                ? "grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                : "space-y-6"
            }
          >
            {interleaved.map((item, idx) =>
              item.type === "product" ? (
                <div key={(item.data?.handle ?? "p") + idx} data-handle={item.data?.handle}>
                  <ImmersiveProductCard
                    // ⬇️ tiny safety: ensure the card always has something to render
                    product={{
                      ...item.data,
                      images:
                        item.data?.images && item.data.images.length > 0
                          ? item.data.images
                          : item.data?.variants?.[0]?.image
                          ? [item.data.variants[0].image]
                          : [],
                    }}
                    mode={mode}
                    // Quick Look disabled on mobile
                    onQuickLook={
                      isDesktop ? () => setQuick({ open: true, handle: item.data.handle }) : undefined
                    }
                  />
                </div>
              ) : (
                <div
                  key={"tile-" + idx}
                  className={
                    mode === "grid"
                      ? "col-span-2 sm:col-span-2 md:col-span-3 xl:col-span-4"
                      : ""
                  }
                >
                  <EditorialTile
                    kicker={item.data.kicker}
                    title={item.data.title}
                    blurb={item.data.blurb}
                    tone={item.data.tone}
                  />
                </div>
              )
            )}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="font-sans text-xl text-[#2F2722]/60 mb-4">
              No products found for the selected filter.
            </p>
            <button
              onClick={() => handleSelect("all")}
              className="font-sans text-[#C88A4A] font-medium hover:underline"
            >
              View all products
            </button>
          </div>
        )}

        {/* Back to top */}
        <div className="mt-16 flex justify-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2 rounded-xl border border-[#2F2722]/25 px-4 py-2 text-sm text-[#2F2722] hover:border-[#C88A4A] hover:text-[#C88A4A]"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to top
          </button>
        </div>
      </main>

      {/* Quick Look modal (desktop only) */}
      {isDesktop && (
        <QuickLookModal
          open={quick.open}
          handle={quick.handle}
          onClose={() => setQuick({ open: false })}
        />
      )}
    </div>
  );
};

/* ---------- editorial tile ---------- */
function EditorialTile({
  kicker,
  title,
  blurb,
  tone = "warm",
}: {
  kicker: string;
  title: string;
  blurb: string;
  tone?: "warm" | "clay" | "wax";
}) {
  const bg =
    tone === "clay"
      ? "bg-[radial-gradient(65%_85%_at_30%_10%,#F0E9E0, #E7DFD2_60%,#DDD4C5_100%)]"
      : tone === "wax"
      ? "bg-[radial-gradient(65%_85%_at_30%_10%,#F7F0E4,#EEE4D2_60%,#E7D9C1_100%)]"
      : "bg-[radial-gradient(65%_85%_at_30%_10%,#F8F2EA,#EFE6D9_60%,#E7DDCF_100%)]";
  return (
    <article className={`rounded-2xl overflow-hidden ring-1 ring-black/5 ${bg}`}>
      <div className="p-5 sm:p-6">
        <div className="text-[12px] uppercase tracking-wide text-[#2F2722]/60">
          {kicker}
        </div>
        <h3 className="font-serif text-[20px] leading-tight mt-1 text-[#1F1B17]">{title}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-[#2F2722]/75">{blurb}</p>
      </div>
    </article>
  );
}

export default Shop;
