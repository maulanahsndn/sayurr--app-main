import { supabase } from '@/lib/supabase';

export interface ChatMsg {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export async function getProductContext() {
  const { data } = await supabase.from('products').select('nama,price,stock,unit,category');
  if (!data || data.length === 0) return 'Belum ada produk di database.';
  const available = data.filter((p: any) => p.stock > 0);
  const outOfStock = data.filter((p: any) => !p.stock || p.stock <= 0);
  let ctx = 'PRODUK TERSEDIA:\n';
  ctx += available.map((p: any) => `- ${p.nama}: Rp${p.price}/${p.unit || 'pcs'} (stok: ${p.stock})`).join('\n');
  if (outOfStock.length) {
    ctx += '\n\nPRODUK HABIS:\n';
    ctx += outOfStock.map((p: any) => `- ${p.nama}: HABIS`).join('\n');
  }
  return ctx;
}

export async function getOrderContext() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const { data } = await supabase.from('orders').select('id').gte('created_at', todayStart);
  const count = data?.length || 0;
  const hour = now.getHours();
  const isOpen = hour >= 5 && hour < 20;
  return `STATUS WARUNG: ${isOpen ? 'BUKA' : 'TUTUP'} | Pesanan hari ini: ${count} | ${count >= 10 ? 'RAMAI' : count >= 3 ? 'CUKUP RAMAI' : 'SEPI'}`;
}

export async function sendToGemini(userMessage: string, history: ChatMsg[]): Promise<string> {
  try {
    const productContext = await getProductContext();
    const orderContext = await getOrderContext();

    // Call secure serverless API (API key stays on server)
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        history,
        productContext,
        orderContext,
      }),
    });

    if (!response.ok) {
      console.error('API error:', response.status);
      return fallbackReply(userMessage);
    }

    const data = await response.json();
    return data.reply || fallbackReply(userMessage);
  } catch (error) {
    console.error('Chat error:', error);
    return fallbackReply(userMessage);
  }
}

// Fallback ketika API tidak tersedia
async function fallbackReply(raw: string): Promise<string> {
  const t = raw.toLowerCase();
  const { data } = await supabase.from('products').select('nama,price,stock,unit');

  if (/harga|berapa/.test(t)) {
    if (!data?.length) return "Mpok lagi update harga Bun~";
    const kw = t.replace(/harga|berapa|nya|pok|mpok|bu|bun/gi, '').trim();
    if (kw.length > 1) {
      const f = data.filter((p: any) => (p.nama || '').toLowerCase().includes(kw));
      if (f.length) return f.map((p: any) => `💰 **${p.nama}** — Rp${Number(p.price).toLocaleString('id-ID')}/${p.unit || 'pcs'}${!p.stock || p.stock <= 0 ? ' (HABIS)' : ` (stok ${p.stock})`}`).join('\n\n');
    }
    return `💰 Harga hari ini:\n${data.slice(0, 10).map((p: any) => `• ${p.nama} — Rp${Number(p.price).toLocaleString('id-ID')}`).join('\n')}\n\nTanya spesifik: "cabai berapa?"`;
  }
  if (/stok|ada.*apa|dagangan|seger/.test(t)) {
    if (!data?.length) return "Mpok lagi restock~";
    const av = data.filter((p: any) => p.stock > 0);
    return `🥬 Dagangan (${av.length} item):\n${av.slice(0, 12).map((p: any) => `✅ ${p.nama} — Rp${Number(p.price).toLocaleString('id-ID')}`).join('\n')}\n\nMau yang mana Bun?`;
  }
  if (/alamat|lokasi|dimana/.test(t)) return "📍 **Warung Sayur Mpok Ris**\n🏠 Kp. Parakan, RT 03/RW 09, Pamulang, Tangsel\n📞 085711359322";
  if (/resep|masak/.test(t)) return "👩‍🍳 Bilang mau masak apa Bun! Contoh: \"mau bikin soto\"";
  if (/pesan|beli/.test(t)) return "🛒 Mau pesan apa Bun? Bilang aja: \"pesan cabai sama bawang\"";
  return "😊 Hai Bun! Tanya aja:\n🗣️ \"Cabai berapa?\" — Harga\n🗣️ \"Ada apa aja?\" — Stok\n🗣️ \"Mau bikin soto\" — Resep\n🗣️ \"Pesan tempe\" — Belanja\n\nNgobrol aja Bun! 🥬";
}
