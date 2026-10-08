import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { SEO } from '../components/common/SEO';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Order, Product } from '../types';
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  Key,
  LogOut,
  Package,
  Clock,
  Printer,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface AccountPageProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
  onNavigateToCollection: (category?: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  products,
  onQuickView,
  onOpenDetail,
  onNavigateToCollection,
}) => {
  const { user, logout, openAuthModal } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile' | 'wishlist'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Address state
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAddingAddress, setIsAddressAdding] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [pwdMessage, setPwdMessage] = useState<string | null>(null);

  // Fetch orders for logged-in user via RLS (user_id = auth.uid())
  useEffect(() => {
    if (!user || !isSupabaseConfigured() || !supabase) {
      setOrdersLoading(false);
      return;
    }

    const fetchUserOrders = async () => {
      setOrdersLoading(true);
      try {
        const { data, error } = await supabase!
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setOrders(data as any);
        }
      } catch (err) {
        console.warn('Failed to fetch user orders:', err);
      } finally {
        setOrdersLoading(false);
      }
    };

    const fetchUserAddresses = async () => {
      try {
        const { data } = await supabase!
          .from('addresses')
          .select('*')
          .eq('user_id', user.id);
        if (data) setAddresses(data);
      } catch (e) {
        // continue
      }
    };

    fetchUserOrders();
    fetchUserAddresses();
  }, [user]);

  if (!user) {
    return (
      <div className="py-16 sm:py-24 bg-[#FFFDF8] min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <SEO title="My Account — Divine’s Eternity" description="Sign in to view your order history, manage addresses, and access saved keepsakes." />
        <div className="w-16 h-16 rounded-full bg-[#FFF0F5] text-[#FF2E93] flex items-center justify-center mb-4 shadow-sm">
          <User className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-[#211D1C]">My Atelier Account</h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-sm mt-2 mb-6">
          Please sign in to view your order history, track live deliveries, manage saved shipping addresses, and review saved keepsakes.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="bg-[#211D1C] hover:bg-[#FF2E93] text-white py-3 px-8 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
        >
          Sign In to My Account
        </button>
      </div>
    );
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newState || !newPincode || !newPhone) return;

    if (supabase) {
      const { data, error } = await supabase.from('addresses').insert({
        user_id: user.id,
        full_name: user.name || 'Valued Client',
        phone: newPhone,
        street_address: newStreet,
        city: newCity,
        state: newState,
        pincode: newPincode,
        is_default: addresses.length === 0,
      }).select().maybeSingle();

      if (!error && data) {
        setAddresses((prev) => [...prev, data]);
        setIsAddressAdding(false);
        setNewStreet('');
        setNewCity('');
        setNewState('');
        setNewPincode('');
        setNewPhone('');
      }
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPwdMessage('Password must be at least 6 characters.');
      return;
    }

    if (supabase) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPwdMessage(`Failed to update password: ${error.message}`);
      } else {
        setPwdMessage('Password updated successfully!');
        setNewPassword('');
      }
    }
  };

  return (
    <div className="py-8 sm:py-14 bg-[#FFFDF8] min-h-screen text-[#211D1C]">
      <SEO title="My Account — Divine’s Eternity" description="Manage your luxury gift orders, addresses, and wishlist." />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Account Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F3E8E2] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#211D1C] to-[#FF2E93] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md shrink-0">
              {(user.name || user.email || 'A')[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#211D1C]">
                  {user.name || 'Valued Patron'}
                </h1>
                <span className="bg-[#FFF0F5] text-[#FF2E93] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Patron
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{user.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-full border border-stone-200 hover:border-rose-300 hover:bg-rose-50 text-stone-600 hover:text-rose-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#F3E8E2] pb-3 overflow-x-auto">
          {[
            { id: 'orders', label: 'My Orders', icon: ShoppingBag },
            { id: 'addresses', label: 'Shipping Addresses', icon: MapPin },
            { id: 'profile', label: 'Profile Settings', icon: User },
            { id: 'wishlist', label: 'Saved Wishlist', icon: Heart },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  active
                    ? 'bg-[#211D1C] text-white shadow-md'
                    : 'bg-white text-stone-600 border border-[#F3E8E2] hover:border-[#FF2E93]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {ordersLoading ? (
              <div className="py-12 text-center text-xs font-serif text-stone-500">Loading your order history…</div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-[#F3E8E2] text-center space-y-4">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#211D1C]">No Orders Yet</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  You haven't placed any luxury gift orders yet. Explore our bespoke collections to craft your first keepsake!
                </p>
                <button
                  onClick={() => onNavigateToCollection('all')}
                  className="bg-[#FF2E93] text-white py-2.5 px-6 rounded-full font-bold text-xs shadow-md hover:bg-[#E01E7E] transition-all cursor-pointer"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-3xl border border-[#F3E8E2] shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F8ECE5] pb-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#211D1C]">Order #{order.id}</span>
                      <span className="text-[11px] text-stone-400 ml-3">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-[#FFF0F5] text-[#FF2E93] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                        {order.status}
                      </span>
                      <a
                        href={`/api/invoice?orderId=${order.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-full border border-[#F3E8E2] hover:border-[#FF2E93] text-[11px] font-bold text-stone-700 flex items-center gap-1 transition-all"
                      >
                        <Printer className="w-3 h-3 text-[#FF2E93]" />
                        <span>GST Invoice</span>
                      </a>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    {(order.items || []).map((it: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1">
                        <div>
                          <strong className="text-[#211D1C]">{it.name}</strong>
                          {it.customText && <div className="text-[10px] text-[#FF2E93]">Engraving: "{it.customText}"</div>}
                        </div>
                        <span className="font-bold text-stone-700">₹{it.price} × {it.quantity || 1}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#F8ECE5] flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-600">Total Paid: <strong className="text-[#211D1C]">₹{order.totalAmount}</strong></span>
                    <a
                      href={`/track-order?orderId=${order.id}`}
                      className="text-[#FF2E93] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Track Order</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#211D1C]">Saved Shipping Addresses</h3>
              <button
                onClick={() => setIsAddressAdding(true)}
                className="bg-[#211D1C] text-white py-2 px-4 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-[#FF2E93] transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            {isAddingAddress && (
              <form onSubmit={handleAddAddress} className="bg-white p-6 rounded-3xl border border-[#FF2E93] space-y-4 shadow-sm">
                <h4 className="font-serif text-sm font-bold text-[#211D1C]">Add Shipping Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <input
                    type="text"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    placeholder="Street Address / House No."
                    required
                    className="p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#FF2E93]"
                  />
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="City"
                    required
                    className="p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#FF2E93]"
                  />
                  <input
                    type="text"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    placeholder="State"
                    required
                    className="p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#FF2E93]"
                  />
                  <input
                    type="text"
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    placeholder="Pincode (6 digits)"
                    required
                    className="p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#FF2E93]"
                  />
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="Phone Number for Delivery"
                    required
                    className="p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#FF2E93] sm:col-span-2"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddressAdding(false)}
                    className="px-4 py-2 rounded-full border border-stone-200 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#FF2E93] text-white text-xs font-bold cursor-pointer"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.length === 0 ? (
                <div className="sm:col-span-2 bg-white p-8 rounded-3xl border border-[#F3E8E2] text-center text-xs text-stone-500">
                  No saved addresses yet. Add one for 1-tap checkout prefill!
                </div>
              ) : (
                addresses.map((addr) => (
                  <div key={addr.id} className="bg-white p-5 rounded-3xl border border-[#F3E8E2] shadow-xs space-y-2 text-xs relative">
                    {addr.is_default && (
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Default
                      </span>
                    )}
                    <div className="font-bold text-[#211D1C]">{addr.full_name}</div>
                    <div>{addr.street_address}</div>
                    <div>{addr.city}, {addr.state} - {addr.pincode}</div>
                    <div className="text-stone-500">Phone: {addr.phone}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F3E8E2] shadow-xs max-w-xl space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#211D1C]">Profile & Security Settings</h3>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-stone-600 block">Full Name</label>
              <input
                type="text"
                value={user.name || ''}
                disabled
                className="w-full bg-[#FFFDF8] border border-stone-200 p-2.5 rounded-xl font-bold text-[#211D1C]"
              />
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-stone-600 block">Email Address</label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full bg-[#FFFDF8] border border-stone-200 p-2.5 rounded-xl font-bold text-[#211D1C]"
              />
            </div>

            <form onSubmit={handleChangePassword} className="pt-4 border-t border-[#F3E8E2] space-y-3">
              <h4 className="font-serif text-sm font-bold text-[#211D1C]">Change Account Password</h4>
              {pwdMessage && <div className="text-xs font-bold text-[#FF2E93]">{pwdMessage}</div>}
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                className="w-full p-2.5 rounded-xl border border-stone-200 text-xs outline-none focus:border-[#FF2E93]"
              />
              <button
                type="submit"
                className="bg-[#211D1C] hover:bg-[#FF2E93] text-white py-2.5 px-6 rounded-full text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4">
            <div className="font-serif text-lg font-bold text-[#211D1C]">Saved Wishlist Keepsakes ({wishlist.length})</div>
            {wishlist.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-[#F3E8E2] text-center space-y-3">
                <Heart className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#211D1C]">Your Wishlist is Empty</h3>
                <p className="text-xs text-stone-500">Tap the heart icon on any product card to save your favorite gifts!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlist.map((id) => {
                  const p = products.find((x) => x.id === id);
                  if (!p) return null;
                  return (
                    <div key={p.id} className="bg-white p-4 rounded-2xl border border-[#F3E8E2] shadow-xs flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-xs text-[#211D1C]">{p.name}</div>
                        <div className="text-xs font-extrabold text-[#FF2E93] mt-0.5">₹{p.price}</div>
                      </div>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="p-2 rounded-full hover:bg-rose-50 text-stone-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
