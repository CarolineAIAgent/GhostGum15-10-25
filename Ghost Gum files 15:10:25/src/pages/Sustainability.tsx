// src/pages/Sustainability.tsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Recycle,
  Leaf,
  Award,
  Globe,
  Package,
  Truck,
  ShieldCheck,
  Droplets,
  Recycle as Loop,
} from "lucide-react";
import { getActiveMaterials, sentenceCaseTitle } from "@/data/materials";

/** Palette */
const C = {
  bg: "#F7F4EF",
  dark: "#374236",
  ink: "#2F2722",
  mute: "#6B5E56",
  divider: "#E2DAD3",
  veil: "rgba(255,255,255,0.08)",
  glass: "rgba(255,255,255,0.55)",
};

/* ------------------------ Utilities ------------------------ */

function useHashScroll() {
  const location = useLocation();
  useEffect(() => {
    const hash = location.hash?.replace("#", "");
    if (!hash) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);
}

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.14 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useSectionSpy(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [ids.join("|")]);
  return active;
}

/* ------------------------ Page ------------------------ */

export default function Sustainability() {
  useHashScroll();
  useReveal();

  const barRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const onScroll = () =>
      el.classList.toggle(
        "shadow-[0_6px_24px_rgba(0,0,0,0.06)]",
        window.scrollY > 6
      );
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sections = [
    { id: "foundations", label: "Foundations" },
    { id: "materials", label: "Materials" },
    { id: "process", label: "Process" },
    { id: "shipping", label: "Shipping" },
    { id: "press", label: "Proof" },
    { id: "faq", label: "FAQ" },
  ];
  const active = useSectionSpy(sections.map((s) => s.id));

  const materials = getActiveMaterials();

  return (
    <main style={{ background: C.bg, color: C.ink }}>
      {/* HERO */}
      <section className="px-6 pt-24 md:pt-28 pb-10">
        <div className="max-w-[1200px] mx-auto">
          <header className="text-center mb-8" data-reveal>
            <h1 className="font-serif text-5xl md:text-7xl leading-tight">
              Honest. Sustainable. <span style={{ color: C.dark }}>Respectful.</span>
            </h1>
            <p
              className="font-sans text-lg md:text-xl mt-5 max-w-3xl mx-auto"
              style={{ color: C.mute }}
            >
              Traceable materials, refill systems, and considered logistics—no slogans.
            </p>
          </header>

          <div
            className="rounded-3xl overflow-hidden relative"
            style={{ background: "#F6F3EE", aspectRatio: "16/9" }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://res.cloudinary.com/dnq6xt54d/image/upload/v1756680115/ChatGPT_Image_Aug_31_2025_01_47_36_PM_2_p5jbre.png")',
                transform: "scale(1.02)",
              }}
              data-reveal
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/6 via-transparent to-black/8" />
          </div>
        </div>
      </section>

      {/* NAV */}
      <div
        ref={barRef}
        className="sticky top-[64px] md:top-[80px] z-30 border-y border-[#000]/5 bg-[rgba(247,244,239,0.86)] backdrop-blur"
      >
        <nav className="max-w-[1200px] mx-auto px-6 overflow-x-auto">
          <ul className="flex gap-3 md:gap-4 py-3">
            {sections.map((it) => {
              const isActive = active === it.id;
              return (
                <li key={it.id}>
                  <a
                    href={`#${it.id}`}
                    className={[
                      "font-sans text-sm md:text-[15px] px-3 py-1.5 rounded-full border transition-colors",
                      isActive
                        ? "border-[#C88A4A] text-[#C88A4A] bg-[#C88A4A]/5"
                        : "border-[#2F2722]/15 hover:border-[#C88A4A] hover:text-[#C88A4A]",
                    ].join(" ")}
                  >
                    {it.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* METRICS */}
      <section className="px-6 py-14">
        <div className="max-w-[1200px] mx-auto grid gap-4 md:grid-cols-3">
          <Stat k="100%" v="NT owned & made" />
          <Stat k="Refill-first" v="Packaging system" />
          <Stat k="Traceable" v="Supply paths" />
        </div>
      </section>

      {/* FOUNDATIONS */}
      <section
        id="foundations"
        className="px-6 py-28 md:py-32 border-t scroll-mt-28 md:scroll-mt-32"
        style={{ borderColor: C.divider }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl" data-reveal>
            Our Foundations
          </h2>
          <p
            className="font-sans text-base md:text-lg mt-3"
            style={{ color: C.mute }}
            data-reveal
          >
            Principles guiding everything we make.
          </p>

          <div className="mt-14 grid gap-8 md:gap-10 md:grid-cols-2 text-left">
            <Pillar
              icon={Recycle}
              title="Closed-loop value"
              body="Designed for cycles—source, use, refill. Less waste, more longevity."
            />
            <Pillar
              icon={Leaf}
              title="Minimal processing"
              body="Low-additive, low-energy methods that protect ingredient integrity."
            />
            <Pillar
              icon={Award}
              title="Refill, not replace"
              body="Ceramic jars engineered to live on your bench—endlessly refillable."
            />
            <Pillar
              icon={Globe}
              title="Respect for Country"
              body="We acknowledge custodianship, source with cultural integrity, and act with care."
            />
          </div>
        </div>
      </section>

      {/* MATERIALS */}
      <section
        id="materials"
        className="px-6 py-24 md:py-28 scroll-mt-28 md:scroll-mt-32"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-3xl mb-14" data-reveal>
            <h3 className="font-serif text-3xl md:text-4xl">
              Regenerative by design
            </h3>
            <p className="font-sans text-lg mt-4" style={{ color: C.mute }}>
              Land-positive sourcing. Short, readable supply paths. Long-life
              components.
            </p>
          </div>

          <div className="space-y-20">
            {materials.map((m) => (
              <Ingredient
                key={m.id}
                title={sentenceCaseTitle(m.title)} // first-letter caps only
                provenance={m.provenance}
                image={m.image}
                flip={!!m.flip}
              />
            ))}
          </div>

          <div className="mt-20 grid sm:grid-cols-3 gap-6 text-center">
            <Hallmark icon={Package} title="Glass / Ceramic" />
            <Hallmark icon={ShieldCheck} title="Food-grade tins" />
            <Hallmark icon={Leaf} title="Low-additive bases" />
          </div>
        </div>
      </section>

      {/* REFILL INTERSTITIAL */}
      <section className="px-6 py-16 md:py-24">
        <div
          className="max-w-[1200px] mx-auto overflow-hidden rounded-3xl border border-[#2F2722]/10 bg-white/60"
          data-reveal
        >
          <figure>
            <div style={{ aspectRatio: "5/3" }} className="w-full">
              <img
                src="https://res.cloudinary.com/dnq6xt54d/image/upload/v1756612610/ChatGPT_Image_Aug_31_2025_01_18_48_PM_njdlcb.jpg"
                alt="Refill ritual — calm editorial still conveying longevity and reuse."
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption className="px-6 md:px-8 py-5 md:py-6">
              <div className="font-serif tracking-[0.08em] uppercase text-sm md:text-base">
                Refill, not replace
              </div>
              <p
                className="font-sans mt-2 text-[15px]"
                style={{ color: C.mute }}
              >
                The forever jar. Top up as needed. A quiet habit with outsized
                impact.
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* PROCESS */}
      <section
        id="process"
        className="px-6 py-24 md:py-28 border-t scroll-mt-28 md:scroll-mt-32"
        style={{ borderColor: C.divider }}
      >
        <div className="max-w-[1200px] mx-auto">
          <h3
            className="font-serif text-3xl md:text-4xl text-center"
            data-reveal
          >
            From paddock to jar
          </h3>
          <p
            className="font-sans text-center mt-3"
            style={{ color: C.mute }}
            data-reveal
          >
            Transparent steps you can read.
          </p>
          <div
            className="mt-10 overflow-x-auto snap-x snap-mandatory no-scrollbar"
            data-reveal
          >
            <div className="min-w-[760px] grid auto-cols-[minmax(240px,1fr)] grid-flow-col gap-4">
              <Step
                icon={Globe}
                title="Country"
                body="Extensive grazing on remote rangelands."
              />
              <Step
                icon={Droplets}
                title="Render"
                body="Low-heat rendering preserves lipids."
              />
              <Step
                icon={Leaf}
                title="Formulate"
                body="Short, readable ingredients only."
              />
              <Step
                icon={Package}
                title="Jar"
                body="Ceramic or recyclable primary pack."
              />
              <Step icon={Loop} title="Refill" body="Keep the jar; top up as needed." />
            </div>
          </div>
        </div>
      </section>

      {/* SHIPPING */}
      <section
        id="shipping"
        className="px-6 py-28 md:py-32 text-white border-t scroll-mt-28 md:scroll-mt-32"
        style={{ background: C.dark, borderColor: C.divider }}
      >
        <div className="max-w-[1200px] mx-auto text-center">
          <h3 className="font-serif text-3xl md:text-4xl" data-reveal>
            No trends. No greenwashing. Just practice.
          </h3>
          <p
            className="font-sans text-lg md:text-xl mt-4 max-w-3xl mx-auto text-[#E8E5DF]"
            data-reveal
          >
            Transparent sourcing. Carbon-aware routing. Family-run production.
          </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <Claim
              title="Truly Australian"
              body="Made and owned in the Northern Territory. Every product supports local stations and communities."
            />
            <Claim
              title="Traceable & small-batch"
              body="From paddock to jar, we know where every ingredient comes from—and so do you."
            />
          </div>

          <div className="mt-10 flex items-center justify-center gap-3 text-sm/6 text-[#E8E5DF]">
            <Truck size={16} className="opacity-80" />
            Carbon-aware partners & consolidated dispatch.
          </div>
        </div>
      </section>

      {/* PRESS */}
      <section
        id="press"
        className="px-6 py-16 border-t scroll-mt-28 md:scroll-mt-32"
        style={{ borderColor: C.divider }}
      >
        <div
          className="max-w-[1200px] mx-auto rounded-3xl bg-white/55 backdrop-blur-sm border border-[#2F2722]/10"
          data-reveal
        >
          <div className="px-6 md:px-10 py-8 grid items-center gap-6 md:grid-cols-3">
            <Press text="Australian Financial Review" />
            <Press text="Broadsheet" />
            <Press text="Monocle" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="px-6 py-24 md:py-28 scroll-mt-28 md:scroll-mt-32"
      >
        <div className="max-w-[900px] mx-auto">
          <h4
            className="font-serif text-3xl md:text-4xl text-center"
            data-reveal
          >
            Questions, answered.
          </h4>
          <div className="mt-10 divide-y divide-[#2F2722]/10 rounded-3xl border border-[#2F2722]/10 bg-white/60 backdrop-blur-sm">
            <FAQ
              q="Why tallow?"
              a="It mirrors skin lipids, supports barrier function, and allows low-additive formulations. We source from extensive grazing systems in remote Australia."
            />
            <FAQ
              q="How do refills work?"
              a="Your ceramic jar is the forever vessel. Order refills (aluminium/tin or pouch) and top up. Components are widely recyclable."
            />
            <FAQ
              q="Plastic policy?"
              a="Avoided where we can. When required for safety (pumps, liners), we choose recyclable grades and keep parts minimal."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="px-6 py-20 md:py-24 text-center border-t"
        style={{ borderColor: C.divider }}
      >
        <h5 className="font-serif text-2xl md:text-3xl" data-reveal>
          Sustainability you can hold.
        </h5>
        <p className="font-sans mt-3" style={{ color: C.mute }} data-reveal>
          Refill jars. Straightforward ingredients. A supply chain you can read.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center justify-center rounded-2xl border px-6 py-3 font-sans text-sm hover:border-[#C88A4A] hover:text-[#C88A4A] transition-colors"
          style={{ borderColor: C.ink, color: C.ink, background: C.glass }}
          data-reveal
        >
          Shop the Core Collection →
        </Link>
      </section>

      {/* STYLES */}
      <style>{`
        [data-reveal]{ opacity:0; transform:translateY(20px); transition:opacity .8s ease, transform .8s ease;}
        .reveal-in{ opacity:1; transform:translateY(0); }
        .no-scrollbar::-webkit-scrollbar{ display:none; }
        .no-scrollbar{ -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
    </main>
  );
}

/* ------------------------ Pieces ------------------------ */

function Pillar({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <article
      data-reveal
      className="rounded-3xl border p-6 md:p-8 shadow-sm backdrop-blur-sm flex items-start gap-5 bg-white/60"
      style={{ borderColor: C.divider }}
    >
      <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-white/70 rounded-full grid place-items-center">
        <Icon size={22} className="text-[#5A6A5E]" />
      </div>
      <div>
        <h6 className="font-serif text-xl md:text-2xl">{title}</h6>
        <p className="font-sans mt-2" style={{ color: C.mute }}>
          {body}
        </p>
      </div>
    </article>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div
      className="rounded-2xl border border-[#2F2722]/10 bg-white/60 px-6 py-5 flex items-center justify-between"
      data-reveal
    >
      <span className="font-serif text-2xl">{k}</span>
      <span className="font-sans text-[#2F2722]/65">{v}</span>
    </div>
  );
}

function Ingredient({
  title,
  provenance,
  image,
  flip = false,
}: {
  title: string;
  provenance: string;
  image: string;
  flip?: boolean;
}) {
  return (
    <figure
      className={[
        "grid items-center gap-8 md:gap-12",
        "md:grid-cols-2",
        flip ? "md:[&>*:first-child]:order-2" : "",
      ].join(" ")}
      data-reveal
    >
      <div
        className="overflow-hidden rounded-3xl border border-[#2F2722]/10 bg-white/60"
        style={{ aspectRatio: "5/4" }}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-[1200ms] will-change-transform hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption>
        {/* UPDATED: larger, readable, no ALL-CAPS; honors sentenceCaseTitle upstream */}
        <div className="font-serif normal-case tracking-[-0.01em] leading-tight text-[20px] md:text-[24px] lg:text-[26px]">
          {title}
        </div>
        <p className="font-sans mt-3 text-[15px]" style={{ color: C.mute }}>
          {provenance}
        </p>
      </figcaption>
    </figure>
  );
}

function Hallmark({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
}) {
  return (
    <div
      className="rounded-2xl border bg-white/50 px-6 py-5 flex items-center justify-center gap-3"
      style={{ borderColor: "#E9E2DA" }}
      data-reveal
    >
      <span className="grid place-items-center w-9 h-9 rounded-full border border-[#000]/10 bg-white/70">
        <Icon size={16} className="opacity-80" />
      </span>
      <span className="font-sans text-sm">{title}</span>
    </div>
  );
}

function Step({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div
      className="rounded-2xl border bg-white/60 backdrop-blur-sm px-6 py-5 flex flex-col justify-center"
      style={{ borderColor: C.divider }}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-[#5A6A5E]" />
        <h6 className="font-serif text-lg">{title}</h6>
      </div>
      <p className="font-sans text-sm mt-2" style={{ color: C.mute }}>
        {body}
      </p>
    </div>
  );
}

function Claim({ title, body }: { title: string; body: string }) {
  return (
    <div
      className="rounded-2xl border border-white/10 bg-white/10 px-6 py-5"
      data-reveal
    >
      <h6 className="font-serif text-xl">{title}</h6>
      <p className="font-sans mt-2 text-sm text-[#E8E5DF]">{body}</p>
    </div>
  );
}

function Press({ text }: { text: string }) {
  return (
    <div
      className="font-serif text-xl text-center text-[#2F2722]/80"
      data-reveal
    >
      {text}
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <details
      open={open}
      onToggle={() => setOpen(!open)}
      className="px-6 py-5"
      data-reveal
    >
      <summary className="font-serif text-lg cursor-pointer list-none flex justify-between items-center">
        {q}
        <span className="ml-4 text-[#6B5E56]">{open ? "−" : "+"}</span>
      </summary>
      <p className="font-sans mt-3 text-sm" style={{ color: C.mute }}>
        {a}
      </p>
    </details>
  );
}
