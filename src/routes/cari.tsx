import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search as SearchIcon, X } from "lucide-react";
import { categories, type Product } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductSheet } from "@/components/shop/ProductSheet";
import { useProducts } from "@/hooks/useProducts";

export const Route = createFileRoute("/cari")({
  component: CariPage,
  head: () => ({
    meta: [
      { title: "Cari · Mama Shop" },
      { name: "description", content: "Cari sayuran, bumbu, ikan, tempe & tahu segar." },
    ],
  }),
});

const trending = ["Cabai", "Tempe", "Bawang Putih", "Ikan Kembung", "Tahu", "Tomat"];

function CariPage() {
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("all");
  const [sel, setSel] = React.useState<any>(null);
  const { products: cloudProducts, loading } = useProducts();

  const filtered = cloudProducts.filter(
    (p: any) => (cat === "all" || p.category === cat) && (q === "" || (p.nama || "").toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="mx-auto min-h-screen w-full max-w-md pb-32">
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-5 py-5">
        <h1 className="mb-3 text-2xl font-extrabold">Cari Produk</h1>
        <div className="flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-soft">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value.slice(0, 80))}
            placeholder="Cari sayur, bumbu, ikan…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {q && (
            <button onClick={() => setQ("")} aria-label="Hapus">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </header>

      <main className="px-5 pt-5">
        {q === "" && (
          <section className="mb-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Sedang Dicari</p>
            <div className="flex flex-wrap gap-2">
              {trending.map((t) => (
                <button
                  key={t}
                  onClick={() => setQ(t)}
                  className="rounded-full bg-card px-3 py-1.5 text-xs font-medium shadow-soft"
                >
                  #{t}
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="no-scrollbar -mx-5 mb-4 flex gap-2 overflow-x-auto px-5">
          {categories.map((c) => {
            const on = cat === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-semibold transition-all ${
                  on ? "bg-gradient-hero text-primary-foreground shadow-glow" : "bg-card shadow-soft"
                }`}
              >
                <span>{c.emoji}</span>
                {c.name}
              </button>
            );
          })}
        </div>

        {loading ? (
          <p className="rounded-2xl bg-surface p-8 text-center text-sm text-muted-foreground animate-pulse">Memuat produk...</p>
        ) : (
          <>
            <p className="mb-2 text-xs text-muted-foreground">{filtered.length} hasil</p>
            {filtered.length === 0 ? (
              <p className="rounded-2xl bg-surface p-8 text-center text-sm text-muted-foreground">
                Tidak ada produk cocok untuk "{q}".
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filtered.map((p: any) => (
                  <ProductCard key={p.id} product={p} onOpen={setSel} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <ProductSheet product={sel} onClose={() => setSel(null)} />
    </div>
  );
}
