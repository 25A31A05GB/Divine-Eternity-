import React, { useState, useEffect } from 'react';
import { ShoppingBag, RefreshCw, Mail, Phone, Clock, ArrowRight, DollarSign } from 'lucide-react';

interface AbandonedCartRecord {
  id: string;
  email?: string;
  phone?: string;
  cart: any[];
  subtotal: number;
  last_activity: string;
  reminders_sent: number;
  recovered: boolean;
}

export const AdminAbandonedCartsTab: React.FC = () => {
  const [carts, setCarts] = useState<AbandonedCartRecord[]>([]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-3xl border border-[#F3E8E2] shadow-xs flex items-center justify-between">
        <div className="font-serif text-base font-bold text-[#211D1C] flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-[#FF2E93]" />
          <span>Abandoned Cart Recovery Tracking</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#F3E8E2] shadow-xs overflow-hidden p-6 text-xs text-stone-600">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-stone-800">Automated Vercel Hourly Cron Active</span>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            Active Recovery
          </span>
        </div>
        <p>
          Abandoned carts idle for 1 hour receive an automated reminder email. Carts idle for 24 hours receive a 2nd reminder with a special flat discount offer.
        </p>
      </div>
    </div>
  );
};
