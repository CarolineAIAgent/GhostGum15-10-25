// src/components/Header.tsx
import React, { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext";

/* ---------------- NAV CONFIG ---------------- */
const navConfig = {
  // Vessels: now has a mega menu consistent with Shop
  vessels: {
    label: "Vessels",
    to: "/vessels",
    cols: [
      {
        title: "Explore",
        items: [
          { label: "Vessels Gallery", to: "/vessels" },
          { label: "Choose Your Vessel", to: "/vessels#choose" },
          { label: "Size & Fit", to: "/vessels#sizes" },
          { label: "Care & Refills", to: "/vessels#care" },
        ],
      },
      {
        title: "Collections",
        items: [
          { label: "Modernist Cylinder", to: "/vessels?collection=modernist" },
          { label: "Premium Pebble", to: "/vessels?collection=pebble" },
          { label: "Kiln Editions", to: "/vessels?collection=kiln" },
          { label: "Limited Drops", to: "/vessels#drops" },
        ],
      },
      {
        title: "Resources",
        items: [
          { label: "Materials & Glaze", to: "/vessels#materials" },
          { label: "FAQs", to: "/vessels#faq" },
          { label: "Sustainability", to: "/sustainability#ceramic-jars" },
        ],
      },
    ],
  },

  shop: {
    label: "Shop",
    to: "/shop",
    cols: [
      {
        title: "Shop All",
        items: [
          { label: "All Products", to: "/shop?filter=all" },
          { label: "Refills", to: "/shop?filter=refill" },
          { label: "Ceramic Vessels", to: "/vessels" },
        ],
      },
      {
        title: "By Product",
        items: [
          { label: "Balms", to: "/shop?filter=balm" },
          { label: "Cold Process Soaps", to: "/shop?filter=soap" },
          { label: "Lip Balm", to: "/product/lip-balm" },
        ],
      },
      {
        title: "By Range",
        items: [
          { label: "Core (Beef)", to: "/shop?filter=beef-tallow" },
          { label: "Premium (Camel)", to: "/shop?filter=camel-tallow" },
        ],
      },
    ],
  },

  // Primary stack (Journal removed)
  primary: [
    {
      label: "Sustainability",
      to: "/sustainability",
      sections: [
        { label: "Ceramic Refillable Jars", to: "/sustainability#ceramic-jars" },
        { label: "Packaging & Materials", to: "/sustainability#materials" },
        { label: "Carbon Aware Shipping", to: "/sustainability#shipping" },
      ],
    },
    {
      label: "Story",
      to: "/story",
      sections: [
        { label: "Our Philosophy", to: "/story#philosophy" },
        { label: "Anningie Station", to: "/story#film" },
      ],
    },
  ],
};

/* ------------- Hook: Close on outside click ------------- */
function useOutsideClose<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);
  return ref;
}

/* ---------------- Header ---------------- */
const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItems, toggleCart } = useCart();
  const location = useLocation();
  const navId = useId();

  // cart count
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // scroll shadow
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close desktop hovers & mobile drawer on route change
  useEffect(() => {
    setOpenKey(null);
    setMobileMenuOpen(false);
  }, [location]);

  // Ensure mobile <details> accordions start closed (belt-and-braces)
  useEffect(() => {
    document
      .querySelectorAll<HTMLDetailsElement>("details.group[open]")
      .forEach((d) => d.removeAttribute("open"));
  }, []);

  // Also close any opened <details> when navigating
  useEffect(() => {
    document
      .querySelectorAll<HTMLDetailsElement>("details.group[open]")
      .forEach((d) => d.removeAttribute("open"));
  }, [location]);

  // --- Hover intent timers (per-menu) ---
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const CLEAR_TIMERS = () => {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleOpen = (key: string) => {
    CLEAR_TIMERS();
    openTimerRef.current = window.setTimeout(() => setOpenKey(key), 60);
  };

  const scheduleClose = (key: string) => {
    CLEAR_TIMERS();
    closeTimerRef.current = window.setTimeout(() => {
      setOpenKey((curr) => (curr === key ? null : curr));
    }, 180);
  };

  // outside click for the active menu
  const menuRef = useOutsideClose<HTMLDivElement>(!!openKey, () => setOpenKey(null));

  // helper: active link styling (subtle underline + color)
  const isActive = (to: string) => location.pathname.startsWith(to);

  /* ---------------- render ---------------- */
  return (
    <header
      className={`sticky top-0 z-[9999] border-b border-ink/10 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur" : "bg-white"
      }`}
    >
      <div className="max-w-container mx-auto px-gutter">
        <div className="flex items-center justify-between h-20">
          {/* Logo (updated to new transparent text PNG + responsive srcSet) */}
          <Link to="/" className="hover:opacity-80 transition-opacity" aria-label="Ghost Gum — Home">
<img
  src="https://res.cloudinary.com/dnq6xt54d/image/upload/f_auto,q_auto,w_715/v1757376357/ghost_gum_logo_transparent_ohkz9w.png"
  srcSet="
  https://res.cloudinary.com/dltcukojz/image/upload/v1760493003/ghost_gum_logo_transparent_dxdgvt.png 477w,
    https://res.cloudinary.com/dltcukojz/image/upload/v1760493003/ghost_gum_logo_transparent_dxdgvt.png 715w,
    https://res.cloudinary.com/dltcukojz/image/upload/v1760493003/ghost_gum_logo_transparent_dxdgvt.png 955w,
    https://res.cloudinary.com/dltcukojz/image/upload/v1760493003/ghost_gum_logo_transparent_dxdgvt.png 1193w,
    https://res.cloudinary.com/dltcukojz/image/upload/v1760493003/ghost_gum_logo_transparent_dxdgvt.png 1589w
  "
  sizes="(max-width: 768px) 139px, 200px"
  alt="Ghost Gum"
  className="h-[23.845px] md:h-[31.795px] w-auto object-contain"
  loading="eager"
  fetchPriority="high"
  decoding="async"
/>

          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {/* Vessels: hover mega menu (matches Shop styling) */}
            <div
              className="relative"
              onMouseEnter={() => scheduleOpen("vessels")}
              onMouseLeave={() => scheduleClose("vessels")}
              onFocus={() => scheduleOpen("vessels")}
              onBlur={() => scheduleClose("vessels")}
            >
              <Link
                to={navConfig.vessels.to}
                className={`flex items-center gap-1 small-caps text-lg px-4 py-2 transition-colors ${
                  isActive(navConfig.vessels.to)
                    ? "text-desert-ochre"
                    : "text-[#4A3F35] hover:text-desert-ochre"
                }`}
                style={{ letterSpacing: "0.04em" }}
                onClick={() => setOpenKey(null)}
              >
                {navConfig.vessels.label} <ChevronDown size={16} />
              </Link>

              {openKey === "vessels" && (
                <div
                  ref={menuRef}
                  id={`${navId}-vessels`}
                  className="absolute left-1/2 top-full z-[9999] mt-3 w-[700px] -translate-x-1/2 rounded-2xl border border-ink/10 bg-white shadow-xl"
                  onMouseEnter={() => CLEAR_TIMERS()}
                  onMouseLeave={() => scheduleClose("vessels")}
                >
                  {/* hover bridge */}
                  <div aria-hidden className="absolute -top-3 left-0 right-0 h-3" />
                  <div className="grid grid-cols-3 gap-6 p-6">
                    {navConfig.vessels.cols.map((col) => (
                      <div key={col.title}>
                        <div className="mb-2 text-xs uppercase tracking-wider text-black/50">
                          {col.title}
                        </div>
                        <ul className="space-y-1.5">
                          {col.items.map((item) => (
                            <li key={item.label}>
                              <Link
                                to={item.to}
                                className="block rounded-lg px-2 py-1.5 text-sm text-[#2F2722] hover:text-desert-ochre hover:bg-black/[0.03]"
                                onClick={() => setOpenKey(null)}
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shop: hover mega menu */}
            <div
              className="relative"
              onMouseEnter={() => scheduleOpen("shop")}
              onMouseLeave={() => scheduleClose("shop")}
              onFocus={() => scheduleOpen("shop")}
              onBlur={() => scheduleClose("shop")}
            >
              <Link
                to={navConfig.shop.to}
                className={`flex items-center gap-1 small-caps text-lg px-4 py-2 transition-colors ${
                  isActive("/shop") ? "text-desert-ochre" : "text-[#4A3F35] hover:text-desert-ochre"
                }`}
                style={{ letterSpacing: "0.04em" }}
                onClick={() => setOpenKey(null)}
              >
                {navConfig.shop.label} <ChevronDown size={16} />
              </Link>

              {openKey === "shop" && (
                <div
                  ref={menuRef}
                  id={`${navId}-shop`}
                  className="absolute left-1/2 top-full z-[9999] mt-3 w-[700px] -translate-x-1/2 rounded-2xl border border-ink/10 bg-white shadow-xl"
                  onMouseEnter={() => CLEAR_TIMERS()}
                  onMouseLeave={() => scheduleClose("shop")}
                >
                  <div aria-hidden className="absolute -top-3 left-0 right-0 h-3" />
                  <div className="grid grid-cols-3 gap-6 p-6">
                    {navConfig.shop.cols.map((col) => (
                      <div key={col.title}>
                        <div className="mb-2 text-xs uppercase tracking-wider text-black/50">
                          {col.title}
                        </div>
                        <ul className="space-y-1.5">
                          {col.items.map((item) => (
                            <li key={item.label}>
                              <Link
                                to={item.to}
                                className="block rounded-lg px-2 py-1.5 text-sm text-[#2F2722] hover:text-desert-ochre hover:bg-black/[0.03]"
                                onClick={() => setOpenKey(null)}
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sustainability / Story: hover menus */}
            {navConfig.primary.map((nav, i) => {
              const key = `nav-${i}`;
              return (
                <div
                  key={nav.label}
                  className="relative"
                  onMouseEnter={() => scheduleOpen(key)}
                  onMouseLeave={() => scheduleClose(key)}
                  onFocus={() => scheduleOpen(key)}
                  onBlur={() => scheduleClose(key)}
                >
                  <Link
                    to={nav.to}
                    className={`flex items-center gap-1 small-caps text-lg px-4 py-2 transition-colors ${
                      isActive(nav.to)
                        ? "text-desert-ochre"
                        : "text-[#4A3F35] hover:text-desert-ochre"
                    }`}
                    style={{ letterSpacing: "0.04em" }}
                    onClick={() => setOpenKey(null)}
                  >
                    {nav.label}
                    {nav.sections && <ChevronDown size={16} />}
                  </Link>

                  {openKey === key && nav.sections && (
                    <div
                      ref={menuRef}
                      id={`${navId}-${key}`}
                      className="absolute left-1/2 top-full z-[9999] mt-3 w-[420px] -translate-x-1/2 rounded-2xl border border-ink/10 bg-white shadow-xl"
                      onMouseEnter={() => CLEAR_TIMERS()}
                      onMouseLeave={() => scheduleClose(key)}
                    >
                      <div aria-hidden className="absolute -top-3 left-0 right-0 h-3" />
                      <ul className="grid grid-cols-1 gap-1 p-4">
                        {nav.sections.map((s) => (
                          <li key={s.label}>
                            <Link
                              to={s.to}
                              className="block rounded-lg px-3 py-2 text-sm text-[#2F2722] hover:text-desert-ochre hover:bg-black/[0.03]"
                              onClick={() => setOpenKey(null)}
                            >
                              {s.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleCart}
              className="relative p-3 hover:bg-ink/5 rounded-lg transition-colors text-ink"
              aria-label="Open cart"
            >
              <ShoppingBag size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-desert-ochre text-white text-sm rounded-full w-6 h-6 flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-3 hover:bg-ink/5 rounded-lg transition-colors text-ink"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-ink/10 py-6">
            <nav className="flex flex-col space-y-4">
              {/* Vessels accordion (mirrors desktop mega menu) */}
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3 small-caps text-lg">
                  <Link to={navConfig.vessels.to} onClick={() => setMobileMenuOpen(false)}>
                    {navConfig.vessels.label}
                  </Link>
                  <ChevronDown className="transition-transform group-open:rotate-180" size={16} />
                </summary>
                <div className="mt-2 grid grid-cols-1 gap-4 pl-4">
                  {navConfig.vessels.cols.map((col) => (
                    <div key={col.title}>
                      <div className="mb-1 text-xs uppercase tracking-wider text-black/50">{col.title}</div>
                      <ul className="space-y-1">
                        {col.items.map((it) => (
                          <li key={it.label}>
                            <Link
                              to={it.to}
                              className="block rounded-lg px-2 py-2 text-sm hover:bg-black/[0.03]"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {it.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>

              {/* Shop accordion (no default open) */}
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3 small-caps text-lg">
                  <Link to={navConfig.shop.to} onClick={() => setMobileMenuOpen(false)}>
                    {navConfig.shop.label}
                  </Link>
                  <ChevronDown className="transition-transform group-open:rotate-180" size={16} />
                </summary>
                <div className="mt-2 grid grid-cols-1 gap-4 pl-4">
                  {navConfig.shop.cols.map((col) => (
                    <div key={col.title}>
                      <div className="mb-1 text-xs uppercase tracking-wider text-black/50">{col.title}</div>
                      <ul className="space-y-1">
                        {col.items.map((it) => (
                          <li key={it.label}>
                            <Link
                              to={it.to}
                              className="block rounded-lg px-2 py-2 text-sm hover:bg-black/[0.03]"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {it.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>

              {/* Other nav accordions in the same order: Sustainability → Story */}
              {navConfig.primary.map((nav) => (
                <details key={nav.label} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-3 small-caps text-lg">
                    <Link to={nav.to} onClick={() => setMobileMenuOpen(false)}>
                      {nav.label}
                    </Link>
                    <ChevronDown className="transition-transform group-open:rotate-180" size={16} />
                  </summary>
                  {nav.sections && (
                    <ul className="mt-2 space-y-1 pl-4">
                      {nav.sections.map((s) => (
                        <li key={s.label}>
                          <Link
                            to={s.to}
                            className="block rounded-lg px-2 py-2 text-sm hover:bg-black/[0.03]"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {s.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </details>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
