import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, BellRing, Package, Tag } from "lucide-react";

export const Route = createFileRoute("/notifikasi")({
  component: NotifikasiPage,
  head: () => ({
    meta: [{ title: "Notifikasi · Mama Shop" }],
  }),
});

function NotifikasiPage() {
  const notifs = [
    {
      id: 1,
      type: "promo",
      icon: Tag,
      title: "Promo Spesial Hari Ini! 🌟",
      desc: "Diskon 20% untuk semua jenis ikan dan daging segar khusus hari ini. Buruan cek katalog!",
      time: "2 jam yang lalu",
      read: false,
      color: "text-accent bg-accent/10"
    },
    {
      id: 2,
      type: "order",
      icon: Package,
      title: "Pesanan Dikirim 🚚",
      desc: "Pesanan ORD-XYZ123 sedang dalam perjalanan ke alamat Bunda.",
      time: "1 hari yang lalu",
      read: true,
      color: "text-primary bg-primary/10"
    },
    {
      id: 3,
      type: "system",
      icon: BellRing,
      title: "Selamat datang di Mpok Ris!",
      desc: "Terima kasih sudah menggunakan aplikasi kami. Selamat berbelanja sayur segar!",
      time: "3 hari yang lalu",
      read: true,
      color: "text-foreground bg-surface"
    }
  ];

  return (
    <div className="mx-auto min-h-screen w-full max-w-md pb-32">
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-5 py-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="grid h-9 w-9 place-items-center rounded-full bg-card shadow-soft" aria-label="Kembali">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-extrabold leading-tight">Notifikasi</h1>
        </div>
      </header>

      <main className="px-5 pt-5">
        <div className="space-y-3">
          {notifs.map((n) => (
            <div key={n.id} className={`relative flex gap-4 rounded-3xl p-4 shadow-sm transition-all active:scale-[0.98] ${n.read ? "bg-card" : "bg-card border-2 border-primary/20"}`}>
              {!n.read && <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-primary animate-pulse" />}
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${n.color}`}>
                <n.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 pt-1">
                <h3 className={`text-sm leading-tight ${n.read ? "font-semibold text-foreground/80" : "font-extrabold text-foreground"}`}>{n.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{n.desc}</p>
                <p className="mt-2 text-[10px] font-bold text-muted-foreground/60">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
