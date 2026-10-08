import React, { useMemo } from 'react';
import { Product, Order } from '../../types';
import {
  TrendingUp,
  DollarSign,
  Package,
  AlertCircle,
  Users,
  Clock,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface AdminAnalyticsTabProps {
  products: Product[];
  orders: Order[];
}

export const AdminAnalyticsTab: React.FC<AdminAnalyticsTabProps> = ({ products, orders }) => {
  const stats = useMemo(() => {
    const now = Date.now();
    const todayStr = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = now - 7 * 24 * 3600 * 1000;

    let todaySales = 0;
    let todayOrdersCount = 0;
    let weekSales = 0;
    let weekOrdersCount = 0;

    const ordersByStatus: Record<string, number> = {
      Placed: 0,
      Packed: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    orders.forEach((o) => {
      const orderDateStr = o.createdAt ? new Date(o.createdAt).toISOString().split('T')[0] : '';
      const orderTime = o.createdAt ? new Date(o.createdAt).getTime() : now;
      const amt = Number(o.totalAmount) || 0;

      if (orderDateStr === todayStr) {
        todaySales += amt;
        todayOrdersCount++;
      }

      if (orderTime >= sevenDaysAgo) {
        weekSales += amt;
        weekOrdersCount++;
      }

      const st = o.status || 'Placed';
      ordersByStatus[st] = (ordersByStatus[st] || 0) + 1;
    });

    const lowStockProducts = products.filter((p) => (p.stockQuantity ?? 50) <= 5);

    return {
      todaySales,
      todayOrdersCount,
      weekSales,
      weekOrdersCount,
      ordersByStatus,
      lowStockProducts,
    };
  }, [products, orders]);

  return (
    <div className="space-y-8">
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="bg-white p-5 rounded-3xl border border-[#F3E8E2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>Today's Sales</span>
            <div className="w-8 h-8 rounded-full bg-[#FFF0F5] text-[#FF2E93] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#211D1C]">
            ₹{stats.todaySales.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-500 font-medium">
            {stats.todayOrdersCount} new order(s) placed today
          </div>
        </div>

        {/* 7-Day Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-[#F3E8E2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>7-Day Revenue</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#211D1C]">
            ₹{stats.weekSales.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-500 font-medium">
            {stats.weekOrdersCount} order(s) in last 7 days
          </div>
        </div>

        {/* Total Catalog Items */}
        <div className="bg-white p-5 rounded-3xl border border-[#F3E8E2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>Active Products</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-[#211D1C]">
            {products.length} Items
          </div>
          <div className="text-[11px] text-stone-500 font-medium">
            Synced with Supabase Cloud DB
          </div>
        </div>

        {/* Low Stock Alert Count */}
        <div className="bg-white p-5 rounded-3xl border border-[#F3E8E2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>Low Stock Alerts</span>
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-rose-600">
            {stats.lowStockProducts.length} Items
          </div>
          <div className="text-[11px] text-rose-700 font-medium">
            Stock quantity &le; 5 units
          </div>
        </div>
      </div>

      {/* Orders Status Breakdown & Low Stock List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Pipeline */}
        <div className="bg-white p-6 rounded-3xl border border-[#F3E8E2] shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-[#211D1C] flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#FF2E93]" />
            <span>Order Pipeline Breakdown</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(stats.ordersByStatus).map(([st, count]) => (
              <div key={st} className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700">{st}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#FF2E93] h-full rounded-full transition-all"
                      style={{
                        width: orders.length > 0 ? `${(count / orders.length) * 100}%` : '0%',
                      }}
                    />
                  </div>
                  <span className="font-extrabold text-[#211D1C] w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert Table */}
        <div className="bg-white p-6 rounded-3xl border border-[#F3E8E2] shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-rose-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>Low Stock Inventory Alerts (Threshold &le; 5)</span>
          </h3>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {stats.lowStockProducts.length === 0 ? (
              <div className="text-xs text-stone-500 italic py-6 text-center">
                ✓ All catalog items have healthy stock levels above 5 units.
              </div>
            ) : (
              stats.lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs">
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-[#211D1C] truncate">{p.name}</div>
                    <div className="text-[10px] text-stone-500 uppercase">{p.category}</div>
                  </div>
                  <span className="font-mono font-extrabold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full text-[11px] shrink-0">
                    {p.stockQuantity ?? 0} Left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
