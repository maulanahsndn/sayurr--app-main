import { supabase } from '../lib/supabase';

export const productService = {
  async getAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('nama', { ascending: true });
    if (error) throw error;
    return data;
  },

  async addProduct(product: any) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();
    if (error) throw error;
    return data;
  },

  async updateProduct(id: string | number, product: any) {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data;
  },

  async deleteProduct(id: string | number, imageUrl?: string) {
    if (imageUrl) {
      const path = imageUrl.split('/').pop();
      if (path) {
        await supabase.storage.from('product-image').remove([path]);
      }
    }
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },

  async uploadImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('product-image')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('product-image')
      .getPublicUrl(fileName);

    return publicUrl;
  },

  subscribeToProducts(callback: (payload: any) => void) {
    return supabase
      .channel('products-realtime')
      .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'products' }, callback)
      .subscribe();
  }
};
