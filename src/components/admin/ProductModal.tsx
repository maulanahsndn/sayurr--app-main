import React, { useState, useEffect } from 'react';
import { X, Upload, Save, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { categories } from '@/lib/products';

interface ProductModalProps {
  product?: any;
  onClose: () => void;
  onSave: (data: any, file?: File) => Promise<void>;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState(product || { 
    nama: '', 
    price: 0, 
    category: 'sayuran', 
    unit: '1 pcs',
    stock: 0, 
    description: '' 
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(product?.image_url || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setPreviewUrl(product.image_url || '');
    }
  }, [product]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.price) {
      alert("Nama dan Harga wajib diisi!");
      return;
    }
    setLoading(true);
    try {
      await onSave(formData, imageFile || undefined);
      onClose();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#0a0a0c] w-full max-w-2xl rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.15)] flex flex-col max-h-[90vh]"
      >
        <div className="p-8 flex justify-between items-center border-b border-white/5">
          <h3 className="text-2xl font-black uppercase tracking-tighter text-white">
            {product?.id ? 'Edit System Node' : 'Initialize New Node'}
          </h3>
          <button onClick={onClose} type="button" className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-4">Node Designation (Nama)</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="e.g. Bawang Merah Super"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-primary/50 transition-all text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-4">Price (IDR)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-primary/50 transition-all text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-4">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-primary/50 transition-all text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-4">Unit (Satuan)</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="1 Kg..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-primary/50 transition-all text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-4">Classification (Category)</label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer text-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id} className="bg-black">{c.emoji} {c.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-4">Visual Data (Image)</label>
                <div 
                  onClick={() => document.getElementById('imageInput')?.click()}
                  className="aspect-square w-full bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.04] hover:border-primary/30 transition-all overflow-hidden group"
                >
                  {previewUrl ? (
                    <img src={previewUrl} className="h-full w-full object-cover" alt="Preview" />
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-white/20 mb-4 group-hover:text-primary transition-colors" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Upload Media</p>
                    </>
                  )}
                  <input id="imageInput" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-4">Description (Metadata)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-4 px-6 text-sm font-bold outline-none focus:border-primary/50 transition-all min-h-[100px] text-white"
              placeholder="Detail produk..."
            />
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-primary text-black py-6 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] shadow-glow-green active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? 'Processing...' : <><Save className="h-5 w-5" /> Commit Changes</>}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};
