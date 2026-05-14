import { supabase } from '../lib/supabase';

export const orderService = {
  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async updateOrderStatus(id: string | number, status: string, type: 'payment' | 'delivery') {
    const field = type === 'payment' ? 'payment_status' : 'delivery_status';
    const { data, error } = await supabase
      .from('orders')
      .update({ [field]: status })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async getStats() {
    const { data: products } = await supabase.from('products').select('id', { count: 'exact' });
    const { data: orders } = await supabase.from('orders').select('total_price', { count: 'exact' });
    
    const totalRevenue = orders?.reduce((acc: number, order: any) => acc + (order.total_price || 0), 0) || 0;
    
    return {
      totalProducts: products?.length || 0,
      totalOrders: orders?.length || 0,
      totalRevenue: totalRevenue,
    };
  },

  subscribeToOrders(callback: (payload: any) => void) {
    return supabase
      .channel('orders-realtime')
      .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'orders' }, callback)
      .subscribe();
  }
};
