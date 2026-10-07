import React, { useState } from 'react';
import { User, Package, MapPin, Heart, Award, X, LogOut, ChevronRight, FileText, CheckCircle2, Truck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Order } from '../../types';
import { InvoiceModal } from './InvoiceModal';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  onTrackOrder,
}) => {
  const { user, orders, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'rewards'>('orders');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const customerOrders = orders.filter(
    (o) =>
      o.customerEmail === user?.email ||
      o.customer?.email === user?.email ||
      (user?.email && o.shippingAddress?.email === user.email)
  );
  const displayOrders = customerOrders.length > 0 ? customerOrders : orders.slice(0, 3);

  return (
    <>
      <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        <div className="bg-[#FFFDF8] w-full max-w-xl rounded-3xl border border-[#F3E8E2] shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200 text-[#211D1C] max-h-[92vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F3E8E2]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#211D1C] to-[#FF2E93] text-white flex items-center justify-center shadow-md font-bold text-base">
                {user?.name ? user.name[0].toUpperCase() : 'DE'}
              </div>
              <div>
                <h3 className="font-serif-heading font-bold text-lg text-[#211D1C]">
                  {user?.name || 'Valued Atelier Patron'}
                </h3>
                <p className="text-xs text-[#FF2E93] font-medium">
                  {user?.email || 'patron@divineseternity.com'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex p-1 bg-[#FFF0F3] rounded-2xl border border-[#FFE0E6] text-xs font-bold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'orders' ? 'bg-[#FF2E93] text-white shadow-xs' : 'text-stone-700 hover:text-[#FF2E93]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Past Orders ({displayOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'rewards' ? 'bg-[#FF2E93] text-white shadow-xs' : 'text-stone-700 hover:text-[#FF2E93]'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#FFD94A]" />
              <span>Atelier Privilege Club</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'profile' ? 'bg-[#FF2E93] text-white shadow-xs' : 'text-stone-700 hover:text-[#FF2E93]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>
          </div>

          {/* Tab 1: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {displayOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500 space-y-2">
                  <Package className="w-8 h-8 text-stone-300 mx-auto" />
                  <p>No past orders placed in this session yet.</p>
                </div>
              ) : (
                displayOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-white border border-[#F3E8E2] shadow-xs space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <div>
                        <span className="font-mono font-bold text-[#211D1C]">Order #{order.id}</span>
                        <div className="text-[10px] text-stone-500">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {order.status || 'Confirmed'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-stone-700">
                          <span className="truncate max-w-[260px]">
                            {item.name} <strong className="text-stone-400">x{item.quantity}</strong>
                          </span>
                          <span className="font-mono font-bold">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-dashed border-stone-100">
                      <div className="text-xs">
                        Total: <strong className="text-base text-[#211D1C] font-serif font-bold">₹{order.totalAmount || order.total || 0}</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            onTrackOrder(order.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#211D1C] hover:bg-[#FF2E93] text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5 text-[#FFD94A]" />
                          <span>Track</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Atelier Privilege Rewards */}
          {activeTab === 'rewards' && (
            <div className="space-y-4">
              <div className="p-5 rounded-3xl bg-gradient-to-r from-[#211D1C] to-[#453739] text-white space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFD94A]">
                    VIP Atelier Balance
                  </span>
                  <Award className="w-5 h-5 text-[#FFD94A]" />
                </div>
                <div className="text-3xl font-serif-heading font-bold text-white">
                  350 <span className="text-sm font-normal text-pink-200">DE Gifting Credits</span>
                </div>
                <p className="text-[11px] text-stone-300">
                  Worth ₹350 redeemable at checkout on any order above ₹999.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF9EB] border border-[#F5E6CE] space-y-2 text-xs">
                <div className="font-bold text-[#211D1C] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF2E93]" />
                  <span>How to Earn More Atelier Credits:</span>
                </div>
                <ul className="space-y-1.5 text-stone-700 text-[11px]">
                  <li>• <strong>50 Credits:</strong> Earned on every completed order.</li>
                  <li>• <strong>100 Credits:</strong> Post an Instagram Reel or WhatsApp review tagging @divineseternity.</li>
                  <li>• <strong>200 Credits:</strong> Refer a friend with your coupon code <strong>LOVE100</strong>.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 3: Profile & Logout */}
          {activeTab === 'profile' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-[#F3E8E2] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Account Name:</span>
                  <strong className="text-[#211D1C]">{user?.name || 'Atelier Patron'}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Email Address:</span>
                  <strong className="text-[#211D1C]">{user?.email || 'patron@divineseternity.com'}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Membership Tier:</span>
                  <span className="font-bold text-[#FF2E93]">🌸 Rose Gold Patron</span>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Patron Account</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal for any selected order */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        isOpen={Boolean(selectedInvoiceOrder)}
        onClose={() => setSelectedInvoiceOrder(null)}
      />
    </>
  );
};
