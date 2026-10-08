import React, { useState, useMemo } from 'react';
import { Order } from '../../types';
import { Search, Users, ShoppingBag, Mail, Phone, Calendar, ArrowUpRight } from 'lucide-react';

interface AdminCustomersTabProps {
  orders: Order[];
}

export const AdminCustomersTab: React.FC<AdminCustomersTabProps> = ({ orders }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const customers = useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      email: string;
      phone: string;
      orderCount: number;
      lifetimeValue: number;
      lastOrderDate: string;
    }>();

    orders.forEach((o) => {
      const phone = (o.customer?.phone || '').replace(/\D/g, '');
      const key = phone || (o.customer?.email || o.id);
      const amt = Number(o.totalAmount) || 0;
      const date = o.createdAt || new Date().toISOString();

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          name: o.customer?.fullName || 'Valued Patron',
          email: o.customer?.email || 'N/A',
          phone: o.customer?.phone || 'N/A',
          orderCount: 1,
          lifetimeValue: amt,
          lastOrderDate: date,
        });
      } else {
        const existing = map.get(key)!;
        existing.orderCount += 1;
        existing.lifetimeValue += amt;
        if (new Date(date) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = date;
        }
      }
    });

    return Array.from(map.values()).sort((a, b) => b.lifetimeValue - a.lifetimeValue);
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white p-4 rounded-3xl border border-[#F3E8E2] shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by name, phone, or email..."
            className="w-full bg-[#FFFDF8] border border-[#E7E2DA] focus:border-[#FF2E93] rounded-full pl-9 pr-4 py-2 text-xs font-medium outline-none"
          />
        </div>
        <div className="text-xs font-bold text-stone-500">
          Total Unique Clients: <span className="text-[#FF2E93]">{customers.length}</span>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-[#F3E8E2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FFFDF8] border-b border-[#F3E8E2] text-[11px] font-bold uppercase text-stone-500 tracking-wider">
                <th className="py-3.5 px-4">Client Name</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Email Address</th>
                <th className="py-3.5 px-4 text-center">Orders</th>
                <th className="py-3.5 px-4 text-right">Lifetime Value (LTV)</th>
                <th className="py-3.5 px-4 text-right">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8ECE5]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500 font-serif">
                    No customer profiles found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FFFDF8] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#211D1C]">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-600">{c.phone}</td>
                    <td className="py-3.5 px-4 text-stone-500">{c.email}</td>
                    <td className="py-3.5 px-4 text-center font-bold">
                      <span className="bg-[#FFF0F5] text-[#FF2E93] px-2.5 py-0.5 rounded-full text-[11px]">
                        {c.orderCount} order(s)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-[#211D1C]">
                      ₹{c.lifetimeValue.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-stone-400 text-[10px]">
                      {new Date(c.lastOrderDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
