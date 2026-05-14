import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { toast } from 'sonner';

export interface Order {
  id: string;
  user_name: string;
  total_price: number;
  payment_status: string;
  delivery_status: string;
  created_at: string;
  [key: string]: any;
}

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ totalProducts: 0, totalOrders: 0, totalRevenue: 0 });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data as Order[]);
      const analytics = await orderService.getStats();
      setStats(analytics);
    } catch (error) {
      toast.error('Gagal mengambil data pesanan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const subscription = orderService.subscribeToOrders((payload) => {
      fetchOrders();
      // Play notification sound for new orders
      if (payload.eventType === 'INSERT') {
        toast.success('🔔 Pesanan baru masuk!', { duration: 5000 });
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 800;
          osc.type = 'sine';
          gain.gain.value = 0.3;
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
          setTimeout(() => {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.frequency.value = 1200;
            osc2.type = 'sine';
            gain2.gain.value = 0.3;
            osc2.start();
            osc2.stop(ctx.currentTime + 0.2);
          }, 200);
        } catch (e) { /* audio not supported */ }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateStatus = async (id: string | number, status: string, type: 'payment' | 'delivery') => {
    try {
      await orderService.updateOrderStatus(id, status, type);
      toast.success('Status berhasil diupdate');
    } catch (error) {
      toast.error('Gagal update status');
    }
  };

  return { orders, loading, stats, updateStatus, refresh: fetchOrders };
};
