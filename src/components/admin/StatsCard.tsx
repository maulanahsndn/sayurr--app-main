import React from 'react';
import { TrendingUp } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, trend, color }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/[0.04] border border-white/[0.08] p-5 md:p-6 transition-all hover:bg-white/[0.07] hover:border-white/[0.12] group">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-all" />
      <div className="flex items-start justify-between mb-3">
        <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${color ? `bg-${color}/10 text-${color}` : 'bg-emerald-500/10 text-emerald-400'}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl md:text-3xl font-black tracking-tight text-white">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">{label}</p>
    </div>
  );
};
