import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const API_KEY = process.env.GEMINI_API_KEY; // Server-side only, NOT exposed to browser
  if (!API_KEY) return res.status(500).json({ error: 'API key not configured' });

  try {
    const { message, history, productContext, orderContext } = req.body;

    const systemPrompt = `Kamu adalah "Mpok Ris AI", asisten belanja sayur cerdas dari Warung Sayur Mpok Ris di Kp. Parakan, RT 03/RW 09, Pamulang, Tangerang Selatan. Telepon: 085711359322.

KEPRIBADIAN:
- Hangat, ramah, cerdas seperti ibu warung asli
- Bicara casual bahasa Indonesia sehari-hari, pakai emoji secukupnya
- Panggil pembeli "Bunda" atau "Bun"
- JANGAN kaku atau robotik

KEMAMPUAN:
1. Bantu belanja sayur & bumbu berdasarkan budget
2. Rekomendasikan produk berdasarkan kebutuhan masak
3. Kasih resep masakan + daftar belanjaan
4. Cek stok & harga real-time (dari data produk)
5. Bantu pesan step-by-step
6. Pahami bahasa ibu-ibu: typo, bahasa daerah (Sunda/Jawa/Betawi), slang

ALUR PEMESANAN:
1. Pembeli bilang mau beli apa → kasih rincian harga
2. Tanya mau tambah apa lagi
3. Kalau cukup → minta nama + alamat + COD/Transfer
4. Konfirmasi → bilang Mpok hubungi via WA

ATURAN: Jika produk HABIS bilang maaf besok restock. JANGAN mengarang harga. Jawab SINGKAT dan NATURAL.

JAM: Senin-Sabtu 05.00-20.00, Minggu 06.00-15.00
ONGKIR: Gratis Parakan, area lain Rp5.000
BAYAR: COD / Transfer

${productContext || ''}
${orderContext || ''}`;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [
            ...(history || []),
            { role: 'user', parts: [{ text: message }] }
          ],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini API error:', err);
      return res.status(500).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf Bun, Mpok lagi error.';

    return res.status(200).json({ reply: text });
  } catch (error: any) {
    console.error('Server error:', error);
    return res.status(500).json({ error: error.message });
  }
}
