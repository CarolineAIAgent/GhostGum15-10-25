// src/components/Footer.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Mail, Lock, Check } from "lucide-react";

const Footer = () => {
  // The Brandmark — minimal reveal flow
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Scarcity indicator (wire to backend)
  const total = 50;
  const [remaining] = useState(12);
  const usedPct = Math.round(((total - remaining) / total) * 100);

  const subscribeBrandmark = async (payload: { name?: string; email: string }) => {
    const res = await fetch("/api/brandmark/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      throw new Error(msg || `Subscribe failed (${res.status})`);
    }
  };

  const handleReveal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || submitting) return;
    setSubmitting(true);
    try {
      await subscribeBrandmark({ name, email });
      setDone(true);
      // Soft delay for the “Revealed” state, then route to the secret page
      setTimeout(() => {
        window.location.href = "/brandmark";
      }, 700);
    } catch (err) {
      console.error(err);
      alert("Sorry — we couldn’t reveal that just now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const footerLinks = [
    {
      title: "Ghost Gum",
      links: [
        { label: "Story", href: "/story" },
        { label: "Sustainability", href: "/sustainability" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "FAQ", href: "/faq" },
        { label: "Shipping & Returns", href: "/shipping" },
        { label: "Wholesale", href: "/wholesale" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "Instagram", href: "https://instagram.com/", external: true },
        { label: "Contact", href: "/contact" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden text-gum-white">
      {/* Background */}
      <div className="absolute inset-0 bg-ink" aria-hidden />
      <div
        className="absolute inset-x-0 top-0 h-24"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.18))" }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-container px-gutter py-16 md:py-20">
        {/* The Brandmark */}
        <div className="mb-16 md:mb-20">
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <h3 className="font-serif text-h3 leading-tight">The Brandmark</h3>
              <p className="mt-2 text-lg leading-relaxed text-white/70">
                Designs from scarce materials, unseen editions, and works that never reach the public collection. Membership grants first access before release — and sometimes to pieces that remain secret forever.
              </p>

              {/* Scarcity indicator */}
              <div className="mt-5 max-w-md">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Seasonal invitations</span>
                  <span>
                    Only <strong className="text-white/90">{remaining}</strong> of {total} remaining
                  </span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-white/30" style={{ width: `${usedPct}%` }} />
                </div>
              </div>
            </div>

            {/* Reveal flow */}
            <div className="w-full">
              {!open ? (
                <button
                  onClick={() => setOpen(true)}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-base font-medium backdrop-blur-sm transition-colors hover:bg-white/10"
                  aria-label="Reveal"
                >
                  Reveal
                </button>
              ) : (
                <form onSubmit={handleReveal} className="w-full" aria-label="The Brandmark">
                  <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm">
                    <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
                      <label htmlFor="bm-name" className="sr-only">Name</label>
                      <input
                        id="bm-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name (optional)"
                        className="min-w-0 rounded-xl bg-transparent px-4 py-3 text-base text-white placeholder-white/50 outline-none focus-visible:ring-0 border border-white/10"
                      />
                      <label htmlFor="bm-email" className="sr-only">Email</label>
                      <input
                        id="bm-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="min-w-0 rounded-xl bg-transparent px-4 py-3 text-base text-white placeholder-white/50 outline-none focus-visible:ring-0 border border-white/10"
                      />
                    </div>
                    <div className="flex items-center justify-between border-t border-white/10 p-3">
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <Lock size={16} className="opacity-70" />
                        Private access on reveal
                      </div>
                      <button
                        type="submit"
                        className="rounded-xl px-5 py-2.5 text-base font-medium transition-colors border border-white/10 hover:bg-white/10 disabled:opacity-60"
                        disabled={!email.includes("@") || submitting}
                      >
                        {done ? (
                          <span className="inline-flex items-center gap-2">
                            <Check size={16} /> Revealed
                          </span>
                        ) : submitting ? "Revealing…" : "Reveal"}
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-white/50">We’ll reveal a private page once you’re in.</p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-white/10" aria-hidden />

        {/* Footer grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-10">
          <div>
            <Link to="/" className="block">
              <span className="font-serif text-2xl tracking-tight">Ghost&nbsp;Gum</span>
            </Link>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              Resilient by nature. Reliable by design.
            </p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 font-sans text-sm uppercase tracking-[0.14em] text-white/60">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 transition-colors hover:text-desert-ochre"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-white/70 transition-colors hover:text-desert-ochre"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-white/10 pt-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <p className="text-white/55">
              © {new Date().getFullYear()} Ghost Gum. Made with respect for Country in the Northern Territory.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition-colors hover:text-desert-ochre"
                aria-label="Instagram"
              >
                <Instagram size={22} />
              </a>
              <a
                href="mailto:hello@ghostgum.com.au"
                className="text-white/60 transition-colors hover:text-desert-ochre"
                aria-label="Email"
              >
                <Mail size={22} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
