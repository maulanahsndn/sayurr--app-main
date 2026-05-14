import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import {
  ChevronLeft, MapPin, Clock, CreditCard, CheckCircle2, Wallet,
  Banknote, Smartphone, Truck, Tag, Sparkles, MessageCircle,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useAddress } from "@/hooks/use-address";
import { useOrders } from "@/hooks/use-orders";
import { zones, getSlotsForDate, next7Days, fmtDay, type Slot } from "@/lib/delivery";
import { formatRp } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Checkout · Mama Shop" },
      { name: "description", content: "Selesaikan pesanan: alamat, jadwal pengiriman, dan pembayaran." },
    ],
  }),
});

const addressSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(60),
  phone: z.string().trim().regex(/^[0-9+\-\s]{8,20}$/, "Nomor telepon tidak valid"),
  street: z.string().trim().min(5, "Alamat terlalu singkat").max(200),
  note: z.string().max(140).optional(),
});

const payments = [
  { id: "cod", icon: Banknote, label: "Bayar Tunai", sub: "Bayar saat barang diterima atau diambil" },
  { id: "transfer", icon: Smartphone, label: "QRIS / Transfer", sub: "GoPay, Dana, BCA, dll." },
] as const;

const deliveryOptions = [
  { id: "delivery", icon: Truck, label: "Kirim ke Rumah", sub: "Diantar kurir (Ongkir Rp 2.000)" },
  { id: "pickup", icon: MapPin, label: "Ambil Sendiri", sub: "Ambil langsung ke warung" },
] as const;

function CheckoutPage() {
  const { items, total, count, clear } = useCart();
  const navigate = useNavigate();
  const { getDefault } = useAddress();
  const { addOrder } = useOrders();

  const [dayIdx, setDayIdx] = React.useState(0);
  const [slotId, setSlotId] = React.useState<string>("express");
  const [pay, setPay] = React.useState<string>("cod");
  const [deliveryMode, setDeliveryMode] = React.useState<"pickup" | "delivery">("delivery");
  
  const defAddr = React.useMemo(() => getDefault(), []);
  const [form, setForm] = React.useState({ 
    name: defAddr?.name || "", 
    phone: defAddr?.phone || "", 
    street: defAddr?.street || "", 
    note: defAddr?.note || "",
    customOrder: ""
  });
  
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [done, setDone] = React.useState(false);
  const [orderId, setOrderId] = React.useState("");

  const days = React.useMemo(() => next7Days(), []);
  const slots: Slot[] = React.useMemo(() => getSlotsForDate(days[dayIdx]), [days, dayIdx]);
  React.useEffect(() => {
    if (!slots.find((s) => s.id === slotId)) setSlotId(slots[0]?.id ?? "");
  }, [slots, slotId]);

  const slot = slots.find((s) => s.id === slotId);
  const isNight = new Date().getHours() >= 21 || new Date().getHours() < 4;
  const shipping = deliveryMode === "delivery" ? 2000 : 0; 
  const serviceFee = Math.round(total * 0.01);
  const grand = total + shipping + serviceFee;

  const handlePlaceOrder = () => {
    const parsed = addressSchema.safeParse(form);
    const errs: Record<string, string> = {};
    if (!parsed.success) parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
    
    if (deliveryMode === "pickup") {
      delete errs.street;
    } else {
      if (!slotId) errs.slot = "Pilih jadwal pengiriman";
    }
    if (!pay) errs.pay = "Pilih metode pembayaran";
    if (count === 0 && !form.customOrder.trim()) errs.customOrder = "Pilih produk dari katalog atau tulis pesanan Ibu di sini.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    
    const newOrderId = `RIS-${Math.floor(100 + Math.random() * 900)}`;
    setOrderId(newOrderId);
    
    const paymentMethodLabel = payments.find(p => p.id === pay)?.label || pay;
    const shippingAddress = `${form.name} (${form.phone})\n${form.street}${form.note ? `\nCatatan: ${form.note}` : ""}`;
    
    addOrder({
      id: newOrderId,
      date: new Date().toISOString(),
      items: [...items],
      total,
      shippingFee: shipping,
      serviceFee,
      grandTotal: grand,
      status: "Diproses",
      paymentMethod: paymentMethodLabel,
      shippingAddress: shippingAddress + (form.customOrder ? `\n\nPesanan Ala Warung:\n${form.customOrder}` : ""),
    });
    
    // --- WHATSAPP INTEGRATION ---
    const waNumber = "6285711359322"; // Nomor WhatsApp Mpok Ris yang sebenarnya
    
    let waText = `Halo Mpok Ris, pesanan baru nih! 🥬\n\n`;
    waText += `*ID PESANAN:* ${newOrderId}\n`;
    waText += `*NAMA:* ${form.name}\n`;
    
    if (deliveryMode === "pickup") {
      waText += `*PENGAMBILAN:* Ambil Sendiri di Warung\n`;
      if (isNight) waText += `*CATATAN:* (Pesanan Malam - Siapkan Stok Besok)\n`;
    } else {
      waText += `*ALAMAT:* ${form.street}\n`;
      if (form.note) waText += `*PATOKAN:* ${form.note}\n`;
      waText += `*PENGIRIMAN:* ${slot?.label} (${slot?.window})\n`;
      if (isNight) waText += `*CATATAN:* (Kirim besok pagi, stok baru belanja)\n`;
    }
    waText += `*PEMBAYARAN:* ${paymentMethodLabel}\n\n`;
    
    if (items.length > 0) {
      waText += `*PESANAN DARI KATALOG:*\n`;
      items.forEach((item, index) => {
        waText += `${index + 1}. ${item.product.name} (x${item.qty}) - ${formatRp(item.product.price * item.qty)}\n`;
      });
      waText += `\n`;
    }
    
    if (form.customOrder.trim()) {
      waText += `*PESANAN BEBAS (ECERAN):*\n`;
      waText += `"${form.customOrder.trim()}"\n\n`;
    }
    
    waText += `*TOTAL BELANJA:* ${formatRp(total)}\n`;
    waText += `*BIAYA LAYANAN:* ${formatRp(serviceFee)}\n`;
    waText += `*GRAND TOTAL:* ${formatRp(grand)}\n\n`;
    if (deliveryMode === "pickup") {
      waText += `Tolong siapkan ya po saya ke warung. terimakasih`;
    } else {
      waText += `Tolong disiapkan & dikirim ya Mpok. Terima kasih! 🙏`;
    }
    
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, "_blank");
    
    setDone(true);
    clear();
  };

  if (done) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-md pb-32">
        <header className="sticky top-0 z-30 glass border-b border-border/40 px-5 py-4 flex items-center justify-center">
          <h1 className="text-lg font-extrabold leading-tight text-center">Konfirmasi Pesanan</h1>
        </header>
        
        <main className="px-5 pt-8 flex flex-col items-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-fresh/20 shadow-glow animate-in zoom-in duration-500">
            <CheckCircle2 className="h-12 w-12 text-fresh" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold text-center text-primary">Pesanan Berhasil!</h2>
          <p className="mt-1 text-sm text-muted-foreground text-center">Nomor Pesanan: <span className="font-bold text-foreground">{orderId}</span></p>
          
          <div className="w-full mt-8 space-y-4">
            <section className="rounded-3xl bg-card p-4 shadow-card border-2 border-primary/10">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold">Estimasi Tiba</h3>
              </div>
              <p className="text-base font-semibold">{slot?.window}</p>
              <p className="text-[11px] text-muted-foreground">{fmtDay(days[dayIdx]).label}, {fmtDay(days[dayIdx]).date}</p>
            </section>
            
            <section className="rounded-3xl bg-card p-4 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold">Alamat Pengiriman</h3>
              </div>
              <p className="text-sm font-semibold">{form.name} <span className="text-muted-foreground text-xs font-normal">({form.phone})</span></p>
              <p className="text-xs text-foreground/80 mt-1">{form.street}</p>
            </section>

            <section className="rounded-3xl bg-card p-4 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold">Total Pembayaran</h3>
              </div>
              <p className="text-2xl font-extrabold text-primary">{formatRp(grand)}</p>
              <p className="text-xs text-muted-foreground mt-1">Via {payments.find(p => p.id === pay)?.label}</p>
            </section>
          </div>
          
          <div className="w-full mt-8 flex flex-col gap-3">
            <Link to="/pesanan" className="w-full rounded-full bg-gradient-hero px-6 py-4 text-center text-sm font-bold text-primary-foreground shadow-glow active:scale-[0.98] transition-transform">
              Cek Status Pesanan
            </Link>
            <Link to="/" className="w-full rounded-full bg-surface px-6 py-4 text-center text-sm font-bold text-foreground active:scale-[0.98] transition-transform">
              Kembali ke Beranda
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-md pb-44">
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-5 py-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="grid h-9 w-9 place-items-center rounded-full bg-card shadow-soft" aria-label="Kembali">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-extrabold leading-tight">Checkout</h1>
            <p className="text-[11px] text-muted-foreground">{count} item · {formatRp(total)}</p>
          </div>
        </div>
      </header>

      <main className="space-y-5 px-5 pt-5">
        {/* Catatan Bebas / Warung */}
        <Section title="Catatan ala Warung (Opsional)" icon={MessageCircle}>
          <Field label="Mau pesen apa lagi, Bu?" error={errors.customOrder}>
            <textarea
              value={form.customOrder}
              onChange={(e) => setForm({ ...form, customOrder: e.target.value })}
              rows={3}
              placeholder='Contoh: "Mpok beli cabe 7 ribu, bawang merah 4 ribu, gula seperapat, telor setengah kg ya..."'
              className="input resize-none bg-primary/5 border-primary/20 placeholder:text-primary/40 focus:bg-primary/10"
            />
          </Field>
          <p className="mt-2 text-[10px] text-muted-foreground leading-tight">
            Gak usah ribet cari barang di katalog. Tulis aja kayak ngomong sama Mpok! Nanti Mpok yang siapin & totalin harganya.
          </p>
        </Section>

        {/* Order summary */}
        {count > 0 && (
          <Section title="Ringkasan Pesanan Katalog" icon={Tag}>
            <ul className="divide-y divide-border/60">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex items-center gap-3 py-2.5">
                  <img src={product.image} alt={product.name} className="h-12 w-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm font-semibold">{product.name}</p>
                    <p className="text-[11px] text-muted-foreground">{qty} × {formatRp(product.price)}</p>
                  </div>
                  <p className="text-sm font-bold text-primary">{formatRp(qty * product.price)}</p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Delivery Method */}
        <Section title="Pilih Metode Pengambilan" icon={Truck}>
          <div className="grid grid-cols-2 gap-3">
            {deliveryOptions.map((opt) => {
              const on = deliveryMode === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setDeliveryMode(opt.id)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all ${
                    on ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${on ? "bg-primary text-primary-foreground" : "bg-surface text-primary"}`}>
                    <opt.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold leading-tight">{opt.label}</p>
                    <p className="mt-0.5 text-[9px] text-muted-foreground">{opt.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {isNight && (
            <div className="mt-3 rounded-xl bg-spice/10 p-3 flex gap-2 border border-spice/20">
              <Clock className="h-4 w-4 text-spice shrink-0" />
              <p className="text-[10px] leading-tight text-spice font-medium">
                <strong>Info Mpok Ris:</strong> Karena sudah malam, pesanan akan disiapkan besok pagi ya Bu setelah Mpok belanja stok baru di pasar.
              </p>
            </div>
          )}
        </Section>

        {/* Payment */}
        <Section title="Metode Pembayaran" icon={CreditCard}>
          <div className="space-y-2">
            {payments.map((p) => {
              const on = pay === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPay(p.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all ${
                    on ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-surface text-primary">
                    <p.icon className="h-4 w-4" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{p.label}</p>
                    <p className="text-[11px] text-muted-foreground">{p.sub}</p>
                  </div>
                  <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${on ? "border-primary bg-primary" : "border-border"}`}>
                    {on && <span className="h-2 w-2 rounded-full bg-primary-foreground" />}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Address */}
        <Section title={deliveryMode === "pickup" ? "Informasi Pembeli" : "Alamat Pengiriman"} icon={MapPin}>
          <div className="space-y-2.5">
            <Field label="Nama Lengkap" error={errors.name}>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value.slice(0, 60) })}
                maxLength={60}
                placeholder="Nama lengkap"
                className="input"
              />
            </Field>
            <Field label="No. WhatsApp" error={errors.phone}>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.slice(0, 20) })}
                maxLength={20}
                inputMode="tel"
                placeholder="08••••"
                className="input"
              />
            </Field>
            {deliveryMode === "delivery" && (
              <>
                <Field label="Alamat Lengkap" error={errors.street}>
                  <textarea
                    value={form.street}
                    onChange={(e) => setForm({ ...form, street: e.target.value.slice(0, 200) })}
                    maxLength={200}
                    rows={2}
                    placeholder="Jalan, RT/RW, kecamatan, kode pos"
                    className="input resize-none"
                  />
                </Field>
                <Field label="Catatan Kurir (opsional)">
                  <input
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value.slice(0, 140) })}
                    maxLength={140}
                    placeholder='Patokan rumah: "Pagar biru, depan pohon mangga"'
                    className="input"
                  />
                </Field>
              </>
            )}
          </div>
        </Section>

        {/* Schedule */}
        {deliveryMode === "delivery" && (
          <Section title="Jadwal Pengiriman" icon={Clock}>
          <div className="no-scrollbar -mx-1 mb-3 flex gap-2 overflow-x-auto px-1">
            {days.map((d, i) => {
              const f = fmtDay(d);
              const on = i === dayIdx;
              return (
                <button
                  key={i}
                  onClick={() => setDayIdx(i)}
                  className={`flex shrink-0 flex-col items-center rounded-2xl border-2 px-3 py-2 transition-all ${
                    on ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{f.label}</span>
                  <span className="text-base font-extrabold leading-none">{f.date}</span>
                  <span className="text-[10px] text-muted-foreground">{f.day}</span>
                </button>
              );
            })}
          </div>
          <div className="space-y-2">
            {slots.length === 0 && (
              <p className="rounded-2xl bg-surface p-3 text-center text-xs text-muted-foreground">Tidak ada slot tersedia hari ini.</p>
            )}
            {slots.map((s) => {
              const on = slotId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSlotId(s.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border-2 p-3 text-left transition-all ${
                    on ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`grid h-9 w-9 place-items-center rounded-2xl ${s.id === "express" ? "bg-spice/10 text-spice" : "bg-surface text-primary"}`}>
                      {s.id === "express" ? <Sparkles className="h-4 w-4" /> : <Truck className="h-4 w-4" />}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{s.label}</p>
                      <p className="text-[11px] text-muted-foreground">{s.window}</p>
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                    Gratis Ongkir
                  </p>
                </button>
              );
            })}
            {errors.slot && <p className="text-xs text-destructive">{errors.slot}</p>}
          </div>
        </Section>
        )}

        {/* Bill */}
        <Section title="Rincian Tagihan" icon={Wallet}>
          <Row label={`Subtotal (${count} item)`} value={formatRp(total)} />
          <Row label="Ongkos Kirim" value={shipping > 0 ? formatRp(shipping) : "Gratis"} />
          <Row label="Biaya Layanan" value={formatRp(serviceFee)} />
          <div className="my-2 border-t border-dashed border-border" />
          <Row label="Total Pembayaran" value={formatRp(grand)} bold />
        </Section>
      </main>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-20 z-30 px-4">
        <div className="mx-auto max-w-md overflow-hidden rounded-3xl bg-card/80 shadow-glow backdrop-blur-xl border border-border/50">
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Belanja</p>
              <p className="text-xl font-extrabold text-primary leading-tight">{formatRp(grand)}</p>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="flex items-center gap-2 rounded-2xl bg-gradient-hero px-7 py-3.5 text-sm font-extrabold text-primary-foreground shadow-glow transition-all active:scale-95"
            >
              Pesan Sekarang →
            </button>
          </div>
          {/* thin progress bar for visual delight */}
          <div className="h-1 w-full bg-primary/10">
            <div className="h-1 bg-gradient-hero transition-all" style={{ width: (count > 0 || form.customOrder) ? "100%" : "40%" }} />
          </div>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          background: var(--color-surface);
          padding: 0.7rem 0.9rem;
          font-size: 0.875rem;
          outline: none;
          border: 1px solid transparent;
          transition: border-color .15s, background .15s;
        }
        .input:focus { border-color: var(--color-primary); background: var(--color-card); }
        .input::placeholder { color: var(--color-muted-foreground); }
      `}</style>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: typeof Tag; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-card p-4 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <h2 className="text-sm font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
      {children}
      {error && <p className="mt-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1 text-sm ${bold ? "font-extrabold" : "text-muted-foreground"}`}>
      <span>{label}</span>
      <span className={bold ? "text-primary text-base" : "text-foreground font-semibold"}>{value}</span>
    </div>
  );
}
