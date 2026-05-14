import sayur from "@/assets/p-sayur.jpg";
import bumbu from "@/assets/p-bumbu.jpg";
import ikan from "@/assets/p-ikan.jpg";
import tempe from "@/assets/p-tempe.jpg";
import tahu from "@/assets/p-tahu.jpg";
import tomat from "@/assets/p-tomat.jpg";
import cabai from "@/assets/p-cabai.jpg";
import udang from "@/assets/p-udang.jpg";
import telur from "@/assets/p-telur.jpg";
import wortel from "@/assets/p-wortel.jpg";
import bawang from "@/assets/p-bawang.jpg";

export type Category = {
  id: string;
  name: string;
  emoji: string;
};

export const categories: Category[] = [
  { id: "all", name: "Semua", emoji: "🛒" },
  { id: "sayuran", name: "Sayur & Buah", emoji: "🥬" },
  { id: "penyedap", name: "Penyedap & Saus", emoji: "🧂" },
  { id: "bumbu", name: "Bumbu Dapur", emoji: "🧅" },
  { id: "rempah", name: "Rempah Kering", emoji: "🍂" },
  { id: "bumbu-instan", name: "Bumbu Giling", emoji: "🥘" },
  { id: "sembako", name: "Bahan Pokok", emoji: "🍚" },
  { id: "sachet", name: "Sachet & Instan", emoji: "☕" },
  { id: "ikan", name: "Ayam & Ikan", emoji: "🐟" },
  { id: "frozen", name: "Frozen Food", emoji: "🧊" },
  { id: "tempe-tahu", name: "Tahu, Tempe, Telur", emoji: "🥚" },
];

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  unit: string;
  image: string;
  rating: number;
  sold: number;
  badge?: string;
  desc: string;
  origin: string;
  stock: number;
  inStock?: boolean;
  allowNominal?: boolean;
};

export const products: Product[] = [
  // ── SAYURAN & BUAH ──
  { id: "s1", name: "Pakcoy Hijau Segar", category: "sayuran", price: 8500, oldPrice: 12000, unit: "1 ikat", image: sayur, rating: 4.9, sold: 1240, badge: "Hemat", desc: "Pakcoy organik hasil panen pagi, daun renyah dan batang manis.", origin: "Lembang", stock: 42 },
  { id: "s2", name: "Bayam Hijau Cabut", category: "sayuran", price: 3500, unit: "1 ikat", image: sayur, rating: 4.8, sold: 1800, badge: "Segar", desc: "Bayam hijau segar kaya zat besi, sangat cocok untuk sayur bening.", origin: "Kebun Lokal", stock: 60 },
  { id: "s3", name: "Bayam Merah Super", category: "sayuran", price: 4500, unit: "1 ikat", image: sayur, rating: 4.7, sold: 950, desc: "Bayam merah pilihan, tinggi antioksidan dan penambah darah.", origin: "Lembang", stock: 35 },
  { id: "s4", name: "Kangkung Akar Air", category: "sayuran", price: 3000, unit: "1 ikat", image: sayur, rating: 4.9, sold: 2500, badge: "Favorit", desc: "Kangkung segar daun lebar, batang renyah, paling pas ditumis terasi.", origin: "Cianjur", stock: 80 },
  { id: "s5", name: "Sawi Hijau / Caisim", category: "sayuran", price: 4000, unit: "1 ikat", image: sayur, rating: 4.8, sold: 1600, desc: "Caisim segar untuk campuran mie rebus atau bakso.", origin: "Kebun Lokal", stock: 50 },
  { id: "s6", name: "Sawi Putih Pilihan", category: "sayuran", price: 12000, unit: "1 bonggol", image: sayur, rating: 4.7, sold: 1100, desc: "Sawi putih segar, manis, dan renyah. Sangat cocok untuk tumisan.", origin: "Puncak", stock: 30 },
  { id: "s7", name: "Daun Singkong Muda", category: "sayuran", price: 4000, unit: "1 ikat", image: sayur, rating: 4.8, sold: 1450, desc: "Pucuk daun singkong muda, empuk direbus untuk lalapan.", origin: "Kebun Lokal", stock: 45 },
  { id: "s8", name: "Kacang Panjang Segar", category: "sayuran", price: 5000, unit: "1 ikat", image: sayur, rating: 4.7, sold: 1200, desc: "Kacang panjang muda hijau segar, tekstur renyah manis alami.", origin: "Cianjur", stock: 55 },
  { id: "s9", name: "Buncis Baby Manis", category: "sayuran", price: 15000, unit: "500 g", image: sayur, rating: 4.8, sold: 850, badge: "Premium", desc: "Buncis muda tanpa serat, sangat manis dan renyah.", origin: "Lembang", stock: 25 },
  { id: "s10", name: "Brokoli Hijau Super", category: "sayuran", price: 25000, oldPrice: 28000, unit: "500 g", image: sayur, rating: 4.9, sold: 760, desc: "Brokoli hijau padat tanpa ulat, kaya vitamin C. Pas untuk sup sehat.", origin: "Lembang", stock: 20 },
  { id: "s11", name: "Kembang Kol Putih", category: "sayuran", price: 20000, unit: "500 g", image: sayur, rating: 4.7, sold: 650, desc: "Kembang kol bersih dan padat, cocok untuk capcay.", origin: "Puncak", stock: 25 },
  { id: "s12", name: "Labu Siam / Jipang", category: "sayuran", price: 4000, unit: "1 buah", image: sayur, rating: 4.8, sold: 1300, desc: "Labu siam muda, getah sedikit, manis empuk untuk sayur lodeh.", origin: "Cianjur", stock: 60 },
  { id: "s13", name: "Pare Hijau Pahit", category: "sayuran", price: 6000, unit: "500 g", image: sayur, rating: 4.6, sold: 540, desc: "Pare segar hijau tua, pahitnya pas untuk oseng-oseng.", origin: "Garut", stock: 35 },
  { id: "s14", name: "Terong Ungu Panjang", category: "sayuran", price: 7500, unit: "500 g", image: sayur, rating: 4.8, sold: 1150, desc: "Terong ungu segar, daging lembut, cocok dibalado atau dibakar.", origin: "Subang", stock: 45 },
  { id: "s15", name: "Kentang Dieng Super", category: "sayuran", price: 18000, oldPrice: 22000, unit: "1 Kg", image: sayur, rating: 4.9, sold: 2100, badge: "Populer", desc: "Kentang kuning Dieng, empuk pulen tanpa lubang.", origin: "Wonosobo", stock: 80, allowNominal: true },
  { id: "s16", name: "Jagung Manis Kupas", category: "sayuran", price: 12000, unit: "3 buah", image: sayur, rating: 4.8, sold: 1550, desc: "Jagung manis segar siap rebus atau diserut untuk bakwan.", origin: "Garut", stock: 50 },
  { id: "s17", name: "Tomat Merah Pilihan", category: "sayuran", price: 11000, unit: "500 g", image: tomat, rating: 4.6, sold: 870, desc: "Tomat ranum kaya likopen, manis-asam segar untuk salad & sambal.", origin: "Garut", stock: 55, allowNominal: true },
  { id: "s18", name: "Wortel Baby Manis", category: "sayuran", price: 12500, unit: "500 g", image: wortel, rating: 4.7, sold: 920, desc: "Wortel baby renyah dengan rasa manis alami.", origin: "Cipanas", stock: 50, allowNominal: true },
  { id: "s19", name: "Toge / Kecambah Segar", category: "sayuran", price: 3000, unit: "250 g", image: sayur, rating: 4.7, sold: 1900, desc: "Toge segar panjang tanpa akar hitam, krispi alami.", origin: "Lokal", stock: 40 },
  { id: "s20", name: "Jamur Tiram Putih", category: "sayuran", price: 14000, unit: "250 g", image: sayur, rating: 4.8, sold: 850, desc: "Jamur tiram putih segar, tekstur kenyal cocok untuk jamur crispy.", origin: "Cisarua", stock: 30 },
  { id: "s21", name: "Kemangi Wangi", category: "sayuran", price: 2000, unit: "1 ikat", image: sayur, rating: 4.9, sold: 1650, desc: "Kemangi segar penambah aroma pepes dan sambal.", origin: "Kebun Lokal", stock: 70 },

  // ── BUMBU DAPUR ──
  { id: "b1", name: "Cabai Merah Keriting", category: "bumbu", price: 24000, oldPrice: 30000, unit: "250 g", image: cabai, rating: 4.7, sold: 1100, badge: "Pedas Gurih", desc: "Cabai keriting merah segar, level pedas seimbang.", origin: "Brebes", stock: 45, allowNominal: true },
  { id: "b2", name: "Bawang Putih Kating", category: "bumbu", price: 16000, unit: "250 g", image: bawang, rating: 4.6, sold: 740, desc: "Bawang putih kating berukuran besar, aroma kuat.", origin: "Tegal", stock: 65, allowNominal: true },
  { id: "b3", name: "Bawang Merah Besar", category: "bumbu", price: 18000, unit: "250 g", image: bawang, rating: 4.8, sold: 890, desc: "Bawang merah segar harum untuk tumisan.", origin: "Brebes", stock: 50, allowNominal: true },

  // ── PENYEDAP & PELENGKAP ──
  { id: "p1", name: "Garam Halus Beryodium", category: "penyedap", price: 3500, unit: "250 g", image: bumbu, rating: 4.9, sold: 3200, badge: "Populer", desc: "Garam meja halus beryodium untuk aneka masakan.", origin: "Pabrik", stock: 150 },
  { id: "p2", name: "Gula Pasir Putih", category: "penyedap", price: 17000, unit: "1 Kg", image: bumbu, rating: 4.9, sold: 2800, badge: "Paling Laris", desc: "Gula pasir putih jernih dan manis alami.", origin: "Pabrik", stock: 100 },
  { id: "p3", name: "Gula Merah Aren", category: "penyedap", price: 18000, unit: "1 Kg", image: bumbu, rating: 4.8, sold: 1450, desc: "Gula merah wangi aren, cocok untuk kolak dan cuko.", origin: "Cianjur", stock: 50 },
  { id: "p4", name: "Kaldu Jamur Bubuk", category: "penyedap", price: 12000, unit: "1 Pack", image: bumbu, rating: 4.8, sold: 1800, desc: "Kaldu penyedap non-MSG, sehat dan gurih alami.", origin: "Pabrik", stock: 60 },
  { id: "p5", name: "Royco Rasa Ayam / Sapi", category: "penyedap", price: 5000, unit: "1 Renceng", image: bumbu, rating: 4.9, sold: 4500, desc: "Penyedap rasa kaldu ayam dan sapi andalan masakan Indonesia.", origin: "Pabrik", stock: 200 },
  { id: "p6", name: "Masako Rasa Ayam / Sapi", category: "penyedap", price: 5000, unit: "1 Renceng", image: bumbu, rating: 4.8, sold: 4100, desc: "Penyedap rasa kaldu pekat ekonomis.", origin: "Pabrik", stock: 200 },
  { id: "p7", name: "Saus Sambal Botol", category: "penyedap", price: 15000, unit: "1 Botol", image: cabai, rating: 4.8, sold: 1600, desc: "Saus sambal pedas mantap untuk cocolan.", origin: "Pabrik", stock: 40 },
  { id: "p8", name: "Saus Tomat Botol", category: "penyedap", price: 14000, unit: "1 Botol", image: tomat, rating: 4.7, sold: 1450, desc: "Saus tomat manis segar, cocok untuk pelengkap gorengan.", origin: "Pabrik", stock: 35 },
  { id: "p9", name: "Kecap Manis", category: "penyedap", price: 22000, unit: "1 Pcs", image: bumbu, rating: 4.9, sold: 2950, desc: "Kecap manis kedelai hitam kental manis.", origin: "Pabrik", stock: 50 },
  { id: "p10", name: "Kecap Asin Botol", category: "penyedap", price: 12000, unit: "1 Botol", image: bumbu, rating: 4.8, sold: 1300, desc: "Kecap asin gurih sedap penambah aroma tumisan.", origin: "Pabrik", stock: 30 },

  // ── BAHAN POKOK (SEMBAKO) ──
  { id: "m1", name: "Beras Premium Pulen", category: "sembako", price: 15500, unit: "1 Kg", image: bawang, rating: 4.9, sold: 1540, desc: "Beras putih pulen pilihan anti pera.", origin: "Karawang", stock: 100, allowNominal: true },
  { id: "m2", name: "Minyak Goreng Kemasan", category: "sembako", price: 16500, unit: "1 Liter", image: tomat, rating: 4.8, sold: 2820, badge: "Kebutuhan", desc: "Minyak goreng kelapa sawit jernih, hasilkan gorengan renyah.", origin: "Pabrik", stock: 50 },
  { id: "m3", name: "Tepung Terigu Serbaguna", category: "sembako", price: 12000, unit: "1 Kg", image: bawang, rating: 4.8, sold: 1340, desc: "Tepung terigu protein sedang untuk aneka kue dan gorengan.", origin: "Pabrik", stock: 40, allowNominal: true },
  { id: "m4", name: "Tepung Tapioka (Kanji)", category: "sembako", price: 14000, unit: "1 Kg", image: bawang, rating: 4.7, sold: 1210, desc: "Tepung tapioka halus berkualitas untuk cilok dan cireng.", origin: "Pabrik", stock: 30, allowNominal: true },

  // ── SACHET & INSTAN ──
  { id: "c1", name: "Mie Instan Goreng / Rebus", category: "sachet", price: 3500, unit: "1 Bungkus", image: bumbu, rating: 4.9, sold: 8400, badge: "Siap Seduh", desc: "Mie instan favorit sejuta umat, stok wajib di rumah.", origin: "Pabrik", stock: 500 },
  { id: "c2", name: "Kopi Sachet (Mix/Hitam)", category: "sachet", price: 15000, unit: "1 Renceng", image: bumbu, rating: 4.8, sold: 3200, desc: "Kopi instan sachet wangi, teman begadang bapak.", origin: "Pabrik", stock: 100 },
  { id: "c3", name: "Susu Kental Manis Sachet", category: "sachet", price: 12000, unit: "1 Renceng", image: bumbu, rating: 4.8, sold: 2850, desc: "Susu kental manis serbaguna untuk roti dan minuman.", origin: "Pabrik", stock: 80 },
  { id: "c4", name: "Teh Celup Pilihan", category: "sachet", price: 6500, unit: "1 Kotak", image: bumbu, rating: 4.8, sold: 1600, desc: "Teh celup wangi melati, seduh untuk teh manis keluarga.", origin: "Pabrik", stock: 50 },
  { id: "c5", name: "Santan Instan Kemasan", category: "sachet", price: 3500, unit: "1 Pcs", image: bumbu, rating: 4.7, sold: 2900, desc: "Santan kental praktis untuk gulai dan sayur lodeh.", origin: "Pabrik", stock: 120 },
  { id: "c6", name: "Minuman Bubuk Rasa-rasa", category: "sachet", price: 10000, unit: "1 Renceng", image: bumbu, rating: 4.6, sold: 1400, desc: "Minuman bubuk aneka rasa segar pelepas dahaga.", origin: "Pabrik", stock: 60 },
  { id: "c7", name: "Bumbu Sachet Siap Pakai", category: "sachet", price: 3000, unit: "1 Pcs", image: bumbu, rating: 4.8, sold: 1200, desc: "Bumbu instan nasi goreng, sop, atau tepung bumbu.", origin: "Pabrik", stock: 100 },

  // ── FROZEN FOOD ──
  { id: "f1", name: "Nugget Ayam Crispy", category: "frozen", price: 45000, unit: "500 g", image: tempe, rating: 4.8, sold: 1750, desc: "Nugget ayam daging olahan lezat kesukaan anak-anak.", origin: "Pabrik", stock: 40 },
  { id: "f2", name: "Sosis Sapi / Ayam", category: "frozen", price: 35000, unit: "1 Pack", image: telur, rating: 4.7, sold: 1800, desc: "Sosis olahan kenyal, siap goreng atau bakar.", origin: "Pabrik", stock: 45 },
  { id: "f3", name: "Bakso Sapi Kuah", category: "frozen", price: 25000, unit: "1 Pack", image: udang, rating: 4.8, sold: 1650, desc: "Bakso sapi kenyal rasa daging mantap, siap rebus.", origin: "Pabrik", stock: 50 },
  { id: "f4", name: "Tempura Ikan Olahan", category: "frozen", price: 20000, unit: "1 Pack", image: ikan, rating: 4.6, sold: 1400, desc: "Tempura ikan goreng gurih enak buat cemilan.", origin: "Pabrik", stock: 30 },
  { id: "f5", name: "Kentang Goreng Frozen", category: "frozen", price: 30000, unit: "1 Kg", image: wortel, rating: 4.8, sold: 1550, desc: "Kentang frozen potongan rapi, digoreng krispi.", origin: "Pabrik", stock: 35 },

  // ── LAUK PAUK (IKAN & AYAM) ──
  { id: "i1", name: "Ayam Potong Segar", category: "ikan", price: 40000, unit: "1 Ekor", image: udang, rating: 4.9, sold: 2900, desc: "Ayam potong segar berdaging tebal, sudah dibersihkan.", origin: "Pasar", stock: 25, allowNominal: true },
  { id: "i2", name: "Ikan Tongkol Potong", category: "ikan", price: 35000, unit: "500 g", image: ikan, rating: 4.8, sold: 1420, desc: "Tongkol potong daging padat, siap masak bumbu balado.", origin: "Pasar", stock: 20, allowNominal: true },
  { id: "i3", name: "Ikan Asin Sepat/Gabus", category: "ikan", price: 15000, unit: "250 g", image: ikan, rating: 4.7, sold: 1600, badge: "Gurih", desc: "Ikan asin gurih renyah teman setia makan sayur asem & sambal.", origin: "Nelayan", stock: 35, allowNominal: true },

  // ── TAHU, TEMPE, TELUR ──
  { id: "t1", name: "Tempe Bungkus Daun", category: "tempe-tahu", price: 6500, unit: "400 g", image: tempe, rating: 4.9, sold: 3210, badge: "Best Seller", desc: "Tempe tradisional fermentasi, dibungkus daun pisang—aroma autentik.", origin: "Pengerajin Lokal", stock: 60 },
  { id: "t2", name: "Tahu Putih Lembut", category: "tempe-tahu", price: 7500, unit: "10 pcs", image: tahu, rating: 4.8, sold: 2530, desc: "Tahu putih lembut padat, ideal untuk digoreng krispi atau dicampur sup.", origin: "Pabrik Tahu", stock: 80 },
  { id: "t3", name: "Telur Ayam Negeri", category: "tempe-tahu", price: 28000, unit: "1 Kg", image: telur, rating: 4.8, sold: 2660, desc: "Telur ayam negeri segar pilihan, ukuran besar.", origin: "Peternakan", stock: 70, allowNominal: true },

  // ── REMPAH KERING ──
  { id: "r1", name: "Daun Salam & Daun Jeruk", category: "rempah", price: 2000, unit: "1 Ikat", image: sayur, rating: 4.9, sold: 2500, desc: "Penyedap aroma alami wajib untuk aneka masakan Nusantara.", origin: "Kebun", stock: 100, allowNominal: true },
  { id: "r2", name: "Serai / Sereh Wangi", category: "rempah", price: 2000, unit: "1 Ikat", image: sayur, rating: 4.8, sold: 2200, desc: "Serai segar pengatur aroma kuah soto dan tumisan.", origin: "Kebun", stock: 100, allowNominal: true },
  { id: "r3", name: "Kayu Manis Batang", category: "rempah", price: 5000, unit: "1 Ons", image: bumbu, rating: 4.7, sold: 1300, desc: "Kayu manis batang wangi rempah autentik.", origin: "Pasar Tradisional", stock: 40, allowNominal: true },
  { id: "r4", name: "Cengkeh Kering Pilihan", category: "rempah", price: 8000, unit: "1 Ons", image: bumbu, rating: 4.8, sold: 1250, desc: "Cengkeh pilihan penambah sensasi sedap pada kuah sop.", origin: "Pasar Tradisional", stock: 30, allowNominal: true },
  { id: "r5", name: "Pala Biji / Bubuk", category: "rempah", price: 5000, unit: "1 Ons", image: bumbu, rating: 4.7, sold: 1280, desc: "Pala rempah penghangat tubuh, cocok dicampur soto.", origin: "Pasar Tradisional", stock: 40, allowNominal: true },
  { id: "r6", name: "Jinten Kering", category: "rempah", price: 4000, unit: "1 Ons", image: bumbu, rating: 4.6, sold: 1200, desc: "Jinten rempah kuat untuk gulai dan bumbu sate.", origin: "Pasar Tradisional", stock: 30, allowNominal: true },
  { id: "r7", name: "Asam Jawa Kematang", category: "rempah", price: 5000, unit: "1 Pack", image: bumbu, rating: 4.8, sold: 1850, desc: "Asam jawa penyegar alami untuk sayur asem dan kuah pempek.", origin: "Pasar Tradisional", stock: 60, allowNominal: true },

  // ── BUMBU GILING & INSTAN ──
  { id: "g1", name: "Bumbu Giling Rendang", category: "bumbu-instan", price: 8000, unit: "1 Bungkus", image: bumbu, rating: 4.9, sold: 2200, badge: "Siap Masak", desc: "Bumbu giling padang komplit siap masak daging rendang lezat.", origin: "Pasar Tradisional", stock: 50 },
  { id: "g2", name: "Bumbu Giling Soto", category: "bumbu-instan", price: 7000, unit: "1 Bungkus", image: bumbu, rating: 4.8, sold: 1900, desc: "Bumbu soto giling kuning harum rempah, siap oseng.", origin: "Pasar Tradisional", stock: 45 },
  { id: "g3", name: "Bumbu Giling Rawon", category: "bumbu-instan", price: 8000, unit: "1 Bungkus", image: bumbu, rating: 4.8, sold: 1750, desc: "Bumbu rawon kluwek pekat mantap khas Jawa Timur.", origin: "Pasar Tradisional", stock: 40 },
  { id: "g4", name: "Bumbu Giling Gulai", category: "bumbu-instan", price: 7500, unit: "1 Bungkus", image: bumbu, rating: 4.7, sold: 1800, desc: "Bumbu gulai wangi rempah asli padang.", origin: "Pasar Tradisional", stock: 40 },
  { id: "g5", name: "Bumbu Jadi Nasi Goreng", category: "bumbu-instan", price: 5000, unit: "1 Bungkus", image: bumbu, rating: 4.9, sold: 2500, desc: "Bumbu jadi nasi goreng, masak kilat rasa nikmat.", origin: "Pasar Tradisional", stock: 60 },
  { id: "g6", name: "Bumbu Ungkep Ayam Kuning", category: "bumbu-instan", price: 6000, unit: "1 Bungkus", image: bumbu, rating: 4.8, sold: 2100, desc: "Bumbu ungkep ayam goreng sedap bumbu meresap sampai tulang.", origin: "Pasar Tradisional", stock: 55 },
  { id: "g7", name: "Bumbu Dasar Seblak", category: "bumbu-instan", price: 5000, unit: "1 Bungkus", image: cabai, rating: 4.7, sold: 1950, desc: "Bumbu kencur wangi dan pedas, pas untuk seblak kerupuk.", origin: "Pasar Tradisional", stock: 50 },
  { id: "g8", name: "Bumbu Giling Tongseng", category: "bumbu-instan", price: 7000, unit: "1 Bungkus", image: bumbu, rating: 4.6, sold: 1400, desc: "Bumbu tongseng rempah pekat untuk daging kambing/sapi.", origin: "Pasar Tradisional", stock: 30 },
  { id: "g9", name: "Bumbu Kacang Sate", category: "bumbu-instan", price: 7000, unit: "1 Bungkus", image: bumbu, rating: 4.8, sold: 1600, desc: "Bumbu sate kacang giling halus gurih manis legit.", origin: "Pasar Tradisional", stock: 40 },
];

export const formatRp = (n: number) =>
  "Rp" + n.toLocaleString("id-ID");
