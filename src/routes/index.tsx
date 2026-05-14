import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Search, ChevronRight, ShoppingBag, MapPin, ChevronDown, Clock, Sparkles } from "lucide-react";
import { categories, products, type Product } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductSheet } from "@/components/shop/ProductSheet";
import { useInventory } from "@/hooks/use-inventory";
import { useProducts } from "@/hooks/useProducts";

import imgSayur from "@/assets/p-sayur.jpg";
import imgBumbu from "@/assets/p-bumbu.jpg";
import imgIkan from "@/assets/p-ikan.jpg";
import imgTempe from "@/assets/p-tempe.jpg";
import imgTahu from "@/assets/p-tahu.jpg";
import imgTomat from "@/assets/p-tomat.jpg";
import imgCabai from "@/assets/p-cabai.jpg";
import imgTelur from "@/assets/p-telur.jpg";
import imgWortel from "@/assets/p-wortel.jpg";
import imgBawang from "@/assets/p-bawang.jpg";
import imgWarung from "@/assets/warung-mpokris.png";

export const Route = createFileRoute("/")({
  component: Shop,
  head: () => ({
    meta: [
      { title: "Warung Sayur Mpok Ris" },
      { name: "description", content: "Sayuran & bumbu segar Kp. Parakan" },
    ],
  }),
});

/* ═══════════════════════════════════════
   SLIDE DATA
   Tesla-style: full bleed, minimal text
   ═══════════════════════════════════════ */
const SLIDES = [
  { src: imgWarung, name: "Warung", name2: "Mpok Ris", tint: "30,180,80" },
  { src: imgCabai, name: "Cabai", name2: "Merah", tint: "220,30,30" },
  { src: imgSayur, name: "Pak", name2: "Coy", tint: "30,180,80" },
  { src: imgWortel, name: "Wor", name2: "Tel", tint: "240,140,20" },
  { src: imgIkan, name: "Ikan", name2: "Segar", tint: "40,100,200" },
  { src: imgTomat, name: "To", name2: "Mat", tint: "220,60,50" },
  { src: imgBawang, name: "Ba", name2: "Wang", tint: "210,190,80" },
  { src: imgTempe, name: "Tem", name2: "Pe", tint: "180,120,40" },
  { src: imgTelur, name: "Te", name2: "Lur", tint: "200,150,40" },
  { src: imgBumbu, name: "Bum", name2: "Bu", tint: "210,100,30" },
  { src: imgTahu, name: "Ta", name2: "Hu", tint: "200,190,140" },
];

/* ═══════════════════════════════════════
   TESLA-STYLE HYPERCINEMATIC HERO
   — Full-bleed imagery
   — 3D perspective transforms
   — Minimal text overlay
   — Smooth crossfade slideshow
   ═══════════════════════════════════════ */
function TeslaHero() {
  const [idx, setIdx] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const heroRef = React.useRef<HTMLElement>(null);
  const [parallax, setParallax] = React.useState(0);

  // Auto-advance
  React.useEffect(() => {
    const iv = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIdx(p => (p + 1) % SLIDES.length);
        setIsTransitioning(false);
      }, 800);
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  // Parallax on scroll
  React.useEffect(() => {
    const fn = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, -rect.top / rect.height));
      setParallax(ratio);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const s = SLIDES[idx];

  return (
    <section
      ref={heroRef}
      className="tesla-hero"
      style={{ ["--tint" as string]: s.tint }}
    >
      {/* ── Full-bleed images — stacked, crossfade */}
      <div
        className="tesla-scene"
        style={{
          transform: `perspective(1200px) rotateX(${parallax * 4}deg) scale(${1 + parallax * 0.08})`,
          transformOrigin: "center top",
        }}
      >
        {SLIDES.map((sl, i) => (
          <div
            key={i}
            className="tesla-slide"
            style={{
              opacity: i === idx ? 1 : 0,
              transform: i === idx ? "scale(1.02)" : "scale(1.12)",
              zIndex: i === idx ? 2 : 1,
            }}
          >
            <img
              src={sl.src}
              alt={sl.name}
              className="tesla-img"
              loading={i <= 1 ? "eager" : "lazy"}
            />
          </div>
        ))}

        {/* Cinematic color wash overlay */}
        <div
          className="tesla-wash"
          style={{
            background: `radial-gradient(ellipse 120% 80% at 50% 60%, rgba(${s.tint},0.15) 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* ── Top vignette */}
      <div className="tesla-vig-top" />

      {/* ── Bottom cinematic gradient — 40% of hero */}
      <div className="tesla-vig-bot" />

      {/* ── Subtle ambient particles */}
      <div className="tesla-particles">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="tesla-particle" style={{
            left: `${10 + i * 15}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${4 + i * 0.5}s`,
          }} />
        ))}
      </div>

      {/* ── Content — Hypercinematic art text */}
      <div className={`tesla-content ${isTransitioning ? "tc-out" : "tc-in"}`}>
        <h2 className="art-name" key={`n-${idx}`}>
          <span className="art-fill">{s.name}</span>
          <span className="art-stroke">{s.name2}</span>
        </h2>
      </div>



      {/* ── Slide indicators — thin Tesla bar */}
      <div className="tesla-indicators">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => { setIdx(i); setIsTransitioning(false); }, 300);
            }}
            className={`tesla-bar ${i === idx ? "tesla-bar-on" : ""}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Scroll prompt */}
      <div className="tesla-scroll-hint">
        <ChevronDown className="h-4 w-4 text-white/40" />
      </div>

      {/* ── Bottom page blend */}
      <div className="tesla-blend" />
    </section>
  );
}

/* ═══════════════════════════════════════
   SHOP
   ═══════════════════════════════════════ */
function Shop() {
  const [active, setActive] = React.useState("all");
  const [sel, setSel] = React.useState<Product | null>(null);
  const [q, setQ] = React.useState("");
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const { products: cloudProducts, loading: productsLoading } = useProducts();

  const filtered = cloudProducts
    .filter(
      (p) =>
        (active === "all" || p.category === active) &&
        (q === "" || (p.nama || "").toLowerCase().includes(q.toLowerCase())),
    );

  const [msgIdx, setMsgIdx] = React.useState(0);
  const messages = [
    { 
      top: <>BISA <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent italic tracking-normal">ECERAN</span> SESUAI BUDGET</>,
      bot: "Ketik nominal belanja Bunda di keranjang"
    },
    { 
      top: <>PESAN <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent italic tracking-normal">BESOK</span> BELANJA SUBUH</>,
      bot: "Pesan malam, subuh Mpok belanjain fresh!"
    }
  ];

  React.useEffect(() => {
    const iv = setInterval(() => setMsgIdx(p => (p + 1) % messages.length), 4000);
    return () => clearInterval(iv);
  }, [messages.length]);

  return (
    <div className="mx-auto min-h-screen w-full max-w-md">
      {/* ══ HEADER — transparent morphing ══ */}
      <header className={`fixed top-0 left-0 right-0 z-50 mx-auto max-w-md transition-all duration-500 ${scrolled ? "hdr-solid" : ""}`}>
        <div className="flex items-center gap-3 px-5 pt-4 pb-2">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-base transition-all duration-300 ${scrolled ? "bg-gradient-hero shadow-glow" : "bg-white/10 backdrop-blur-sm border border-white/15"
            }`}>🥬</div>
          <div className="flex-1 min-w-0">
            <p className={`text-[10px] font-extrabold uppercase tracking-[0.15em] transition-colors duration-300 ${scrolled ? "text-primary" : "text-white/80"
              }`}>MPOK RIS</p>
            <p className={`flex items-center gap-1 text-[9px] transition-colors duration-300 ${scrolled ? "text-muted-foreground" : "text-white/40"
              }`}>Warung sayur</p>
          </div>
          <div className="flex gap-1.5">
            <Link to="/notifikasi" className={`relative grid h-8 w-8 place-items-center rounded-xl transition-all active:scale-90 ${scrolled ? "bg-primary/10 text-primary" : "bg-white/10 text-white/70 border border-white/10 backdrop-blur-sm"
              }`} aria-label="Notif">
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
            </Link>
            <button className={`grid h-8 w-8 place-items-center rounded-xl transition-all active:scale-90 ${scrolled ? "bg-primary/10 text-primary" : "bg-white/10 text-white/70 border border-white/10 backdrop-blur-sm"
              }`} aria-label="Bag"><ShoppingBag className="h-3.5 w-3.5" /></button>
          </div>
        </div>
        {/* Search — appears on scroll */}
        <div className={`mx-5 overflow-hidden transition-all duration-500 ${scrolled ? "max-h-12 opacity-100 mb-2" : "max-h-0 opacity-0 mb-0"}`}>
          <div className="flex items-center gap-2 rounded-xl bg-surface border border-border/50 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Cari sayur, bumbu..."
              className="w-full bg-transparent text-xs font-medium outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
      </header>

      {/* ══ TESLA HERO ══ */}
      <TeslaHero />

      {/* ══ CONTENT ══ */}
      <main className="px-4 pb-36 relative z-10">
        {/* Cinematic Promo Bar (Hyper-Sleek Tesla-Line with Animated Beam) */}
        <section className="mt-6 animate-reveal">
          <div className="relative group overflow-hidden rounded-2xl bg-black/60 backdrop-blur-xl border border-white/5 py-3 px-5 shadow-2xl text-center">
            {/* Animated Tesla-Beam Background Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="tesla-beam" />
            </div>
            
            {/* Continuous Neon Line Animation (Bottom) */}
            <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-50" />
            
            <div className="flex-1 min-h-[30px] flex flex-col justify-center items-center relative z-10">
              <div key={msgIdx} className="animate-msg-rotate">
                <h3 className="text-[11px] font-black tracking-[0.15em] text-white uppercase leading-none drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  {messages[msgIdx].top}
                </h3>
                <p className="text-[9px] font-bold text-white/80 mt-1.5 uppercase tracking-[0.1em] flex items-center justify-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-primary animate-ping shrink-0" />
                  {messages[msgIdx].bot}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="pt-6 animate-reveal">
          <div className="mb-3.5 flex items-center justify-between">
            <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-foreground/80">Kategori</h2>
            <button className="flex items-center gap-0.5 text-[10px] font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">
              Lihat Semua <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1">
            {categories.map((c) => {
              const on = active === c.id;
              return (
                <button key={c.id} onClick={() => setActive(c.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-[11px] font-bold transition-all duration-300 ${on ? "bg-gradient-hero text-primary-foreground shadow-glow-green scale-105" : "bg-card text-foreground shadow-soft hover:bg-surface"
                    }`}><span className="text-sm leading-none">{c.emoji}</span>{c.name}</button>
              );
            })}
          </div>
        </section>

        {/* Catalog */}
        <section className="mt-6 animate-reveal" style={{ animationDelay: "0.2s" }}>
          <div className="mb-4.5 flex items-center justify-between">
            <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-foreground/80">
              {active === "all" ? "Produk Pilihan" : categories.find((c) => c.id === active)?.name}
            </h2>
            <div className="h-[1px] flex-1 mx-4 bg-border/40" />
          </div>
          {filtered.length === 0 ? (
            <p className="rounded-2xl bg-surface p-8 text-center text-sm text-muted-foreground">Tidak ada produk.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {filtered.map((p) => (<ProductCard key={p.id} product={p} onOpen={setSel} />))}
            </div>
          )}
        </section>
      </main>

      <ProductSheet product={sel} onClose={() => setSel(null)} />

      {/* ═══ TESLA HYPERCINEMATIC CSS ═══ */}
      <style>{`
        /* ── Hero container — near full viewport */
        .tesla-hero {
          position: relative;
          height: clamp(400px, 75vh, 600px);
          width: 100%;
          overflow: hidden;
          background: #000;
        }

        /* ── 3D scene container */
        .tesla-scene {
          position: absolute;
          inset: 0;
          will-change: transform;
          transition: transform 0.15s linear;
        }

        /* ── Each slide — stacked full bleed */
        .tesla-slide {
          position: absolute;
          inset: 0;
          transition: opacity 1.2s cubic-bezier(.4,0,.2,1), transform 7s cubic-bezier(.4,0,.2,1);
        }

        /* ── The image — full cover, cinematic color grade */
        .tesla-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.65) contrast(1.12) saturate(1.25);
        }

        /* ── Color wash from product tint */
        .tesla-wash {
          position: absolute;
          inset: 0;
          z-index: 3;
          transition: background 1.4s;
          mix-blend-mode: soft-light;
        }

        /* ── Top vignette — blend with header */
        .tesla-vig-top {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 40%;
          z-index: 4;
          background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%);
          pointer-events: none;
        }

        /* ── Bottom cinematic gradient */
        .tesla-vig-bot {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 55%;
          z-index: 4;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
          pointer-events: none;
        }
        
        .tesla-wave {
          position: absolute;
          bottom: -1px; left: 0; width: 100%; height: 50px;
          z-index: 4;
          fill: var(--color-background, #fff);
          pointer-events: none;
        }

        /* ── Ambient particles */
        .tesla-particles {
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          overflow: hidden;
        }
        .tesla-particle {
          position: absolute;
          bottom: 20%;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: rgba(var(--tint), 0.6);
          animation: particleFloat 5s ease-in-out infinite;
          transition: background 1.4s;
        }
        @keyframes particleFloat {
          0%   { transform: translateY(0) scale(1); opacity: 0; }
          20%  { opacity: 0.8; }
          80%  { opacity: 0.3; }
          100% { transform: translateY(-180px) scale(0.3); opacity: 0; }
        }

        /* ── Content overlay — Tesla minimal */
        .tesla-content {
          position: absolute;
          z-index: 6;
          left: 0; right: 0;
          bottom: clamp(60px, 12vh, 100px);
          text-align: center;
          padding: 0 1.5rem;
          transition: opacity 0.8s, transform 0.8s cubic-bezier(.4,0,.2,1);
        }
        .tc-in {
          opacity: 1;
          transform: translateY(0);
        }
        .tc-out {
          opacity: 0;
          transform: translateY(16px);
        }

        /* ── Art text — split fill + stroke */
        .art-name {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0;
          line-height: 0.85;
          user-select: none;
        }

        .art-fill {
          font-size: clamp(3rem, 15vw, 5.5rem);
          font-weight: 900;
          letter-spacing: -0.06em;
          color: #fff;
          text-shadow:
            0 4px 40px rgba(0,0,0,0.5),
            0 0 100px rgba(var(--tint), 0.4);
          transition: text-shadow 1.4s;
        }

        .art-stroke {
          font-size: clamp(3rem, 15vw, 5.5rem);
          font-weight: 900;
          letter-spacing: -0.06em;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.5);
          text-shadow: 0 0 60px rgba(var(--tint), 0.25);
          transition: -webkit-text-stroke-color 1.4s, text-shadow 1.4s;
        }

        /* ── Indicator bars — Tesla thin style */
        .tesla-indicators {
          position: absolute;
          z-index: 7;
          bottom: clamp(36px, 8vh, 70px);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .tesla-bar {
          height: 3px;
          width: 16px;
          border-radius: 2px;
          background: rgba(255,255,255,0.2);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.5s;
          overflow: hidden;
          position: relative;
        }
        .tesla-bar-on {
          width: 28px;
          background: rgba(255,255,255,0.15);
        }
        .tesla-bar-on::after {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          background: #fff;
          border-radius: 2px;
          animation: barFill 5s linear forwards;
        }
        @keyframes barFill {
          from { width: 0; }
          to { width: 100%; }
        }

        /* ── Scroll hint */
        .tesla-scroll-hint {
          position: absolute;
          z-index: 7;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          animation: scrollBounce 2s ease-in-out infinite;
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.4; }
          50% { transform: translateX(-50%) translateY(5px); opacity: 0.8; }
        }

        /* ── Blend to page bg */
        .tesla-blend {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 80px;
          z-index: 8;
          background: linear-gradient(to bottom, transparent, var(--color-background, #fff));
          pointer-events: none;
        }

        /* ── Reveal Animation */
        .animate-reveal {
          animation: revealUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0;
        }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .shadow-glow-green {
          box-shadow: 0 8px 30px rgba(16, 185, 129, 0.3);
        }
        .shadow-glow-yellow {
          box-shadow: 0 4px 20px rgba(234, 179, 8, 0.4);
        }

        /* ── Tesla Beam Animation ── */
        .tesla-beam {
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.15), transparent);
          transform: skewX(-20deg);
          animation: beamMove 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes beamMove {
          0% { left: -100%; opacity: 0; }
          30% { opacity: 0.8; }
          70% { opacity: 0.8; }
          100% { left: 200%; opacity: 0; }
        }

        /* ── Message Rotation Animation ── */
        .animate-msg-rotate {
          animation: msgSlideIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes msgSlideIn {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        /* ── Header */
        .hdr-solid {
          background: rgba(var(--card-rgb, 255 255 255) / 0.88);
          backdrop-filter: blur(24px) saturate(2);
          -webkit-backdrop-filter: blur(24px) saturate(2);
          border-bottom: 1px solid rgba(var(--primary-rgb, 16 185 129) / 0.1);
          box-shadow: 0 4px 30px rgba(0,0,0,0.08);
        }

        /* ── Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .tesla-slide { transition: opacity 0.3s; }
          .tesla-content { transition: opacity 0.3s; }
          .tesla-particle { animation: none; }
          .tesla-bar-on::after { animation: none; width: 100%; }
        }
      `}</style>
    </div>
  );
}
