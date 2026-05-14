import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { toast } from 'sonner';

export interface Product {
  id: string | number;
  nama: string;
  price: number;
  category: string;
  image_url?: string;
  stock?: number;
  description?: string;
  [key: string]: any;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data as Product[]);
    } catch (error) {
      toast.error('Gagal mengambil data produk');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    const subscription = productService.subscribeToProducts((payload: any) => {
      if (payload.eventType === 'INSERT') {
        setProducts((prev) => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setProducts((prev) => prev.map((p) => (p.id === payload.new.id ? payload.new : p)));
      } else if (payload.eventType === 'DELETE') {
        setProducts((prev) => prev.filter((p) => p.id === payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addProduct = async (product: Partial<Product>, file?: File | null) => {
    try {
      let imageUrl = product.image_url;
      if (file) {
        imageUrl = await productService.uploadImage(file);
      }
      const newProduct = await productService.addProduct({ ...product, image_url: imageUrl });
      toast.success('Produk berhasil ditambahkan');
      return newProduct;
    } catch (error: any) {
      const errorMessage = error.message || 'Gagal menambah produk';
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateProduct = async (id: string | number, updates: Partial<Product>, file?: File | null) => {
    try {
      let imageUrl = updates.image_url;
      if (file) {
        imageUrl = await productService.uploadImage(file);
      }
      const updatedProduct = await productService.updateProduct(id, { ...updates, image_url: imageUrl });
      toast.success('Produk berhasil diupdate');
      return updatedProduct;
    } catch (error) {
      toast.error('Gagal update produk');
      throw error;
    }
  };

  const deleteProduct = async (id: string | number, imageUrl?: string) => {
    try {
      await productService.deleteProduct(id, imageUrl);
      toast.success('Produk berhasil dihapus');
    } catch (error) {
      toast.error('Gagal menghapus produk');
      throw error;
    }
  };

  return { products, loading, addProduct, updateProduct, deleteProduct, refresh: fetchProducts };
};
