import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Sparkles, Printer, CheckCircle2, Clock, Image as ImageIcon, Search, RefreshCw, User, PackageCheck } from 'lucide-react';

export type ProductionStage = 'to_make' | 'in_production' | 'quality_check' | 'packed';

interface PersonalizedQueueItem {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  customText?: string;
  customPhoto?: string;
  customSong?: string;
  customArtist?: string;
  stage: ProductionStage;
  dueDate: string;
  createdAt: string;
}

const STAGES: { id: ProductionStage; label: string; badgeColor: string; bgHeader: string }[] = [
  { id: 'to_make', label: '1. To Make', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200', bgHeader: 'bg-amber-50/80 border-amber-200' },
  { id: 'in_production', label: '2. In Production', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200', bgHeader: 'bg-blue-50/80 border-blue-200' },
  { id: 'quality_check', label: '3. Quality Check', badgeColor: 'bg-purple-100 text-purple-800 border-purple-200', bgHeader: 'bg-purple-50/80 border-purple-200' },
  { id: 'packed', label: '4. Packed', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', bgHeader: 'bg-emerald-50/80 border-emerald-200' },
];

export const ProductionQueue: React.FC = () => {
  const [items, setItems] = useState<PersonalizedQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPrintMode, setIsPrintMode] = useState(false);

  const fetchQueue = async () => {
    setLoading(true);
    if (!isSupabaseConfigured() || !supabase) {
      // Mock data for development if Supabase not linked
      setItems([
        {
          id: 'item-101',
          orderId: 'DE-839201',
          customerName: 'Ananya Sharma',
          customerPhone: '9876543210',
          productName: 'Custom Spotify Acrylic Song Plaque',
          customText: 'Priya & Rahul — Kesariya',
          customPhoto: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400',
          customSong: 'Kesariya',
          customArtist: 'Arijit Singh',
          stage: 'to_make',
          dueDate: new Date(Date.now() + 86400000).toLocaleDateString('en-IN'),
          createdAt: new Date().toLocaleDateString('en-IN'),
        },
        {
          id: 'item-102',
          orderId: 'DE-839202',
          customerName: 'Karan Verma',
          customerPhone: '9811223344',
          productName: 'Engraved 925 Silver Pendant',
          customText: 'Forever & Always K&S',
          stage: 'in_production',
          dueDate: new Date(Date.now() + 172800000).toLocaleDateString('en-IN'),
          createdAt: new Date().toLocaleDateString('en-IN'),
        },
        {
          id: 'item-103',
          orderId: 'DE-839203',
          customerName: 'Sneha Patel',
          customerPhone: '9765432109',
          productName: 'Custom Couple Caricature Frame',
          customText: 'Happy 5th Anniversary!',
          customPhoto: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400',
          stage: 'quality_check',
          dueDate: new Date().toLocaleDateString('en-IN'),
          createdAt: new Date().toLocaleDateString('en-IN'),
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (orders) {
        const queueList: PersonalizedQueueItem[] = [];
        for (const ord of orders) {
          const ordItems = Array.isArray(ord.items) ? ord.items : [];
          for (let idx = 0; idx < ordItems.length; idx++) {
            const it = ordItems[idx];
            if (it.customText || it.customPhoto || it.allowsPersonalization) {
              const due = new Date(new Date(ord.created_at || Date.now()).getTime() + 2 * 86400000).toLocaleDateString('en-IN');
              queueList.push({
                id: `${ord.id}-${idx}`,
                orderId: ord.id,
                customerName: ord.shipping_address?.fullName || 'Customer',
                customerPhone: ord.shipping_address?.phone || '',
                productName: it.name,
                customText: it.customText,
                customPhoto: it.customPhoto,
                customSong: it.customSong,
                customArtist: it.customArtist,
                stage: (it.stage || ord.production_status || 'to_make') as ProductionStage,
                dueDate: due,
                createdAt: new Date(ord.created_at || Date.now()).toLocaleDateString('en-IN'),
              });
            }
          }
        }
        setItems(queueList);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleUpdateStage = async (itemId: string, orderId: string, newStage: ProductionStage) => {
    // Local state update
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, stage: newStage } : it))
    );

    if (isSupabaseConfigured() && supabase) {
      try {
        // If transitioning stage, update order production status
        await supabase
          .from('orders')
          .update({
            production_status: newStage === 'packed' ? 'packed' : newStage,
          })
          .eq('id', orderId);

        // Audit log
        await supabase.from('admin_audit').insert({
          action: 'production_stage_change',
          target: `${orderId} -> ${newStage}`,
          time: new Date().toISOString(),
        });
      } catch {
        // ignore
      }
    }
  };

  const filteredItems = items.filter(
    (it) =>
      it.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (it.customText && it.customText.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#F3E8E2] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF2E93]" />
            <h2 className="font-serif text-xl font-bold text-[#211D1C]">Atelier Production Kanban</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage handcrafted personalized keepsakes from raw crafting to final quality packing.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search Order ID, name, engraving..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-200 text-xs outline-none focus:border-[#FF2E93]"
            />
          </div>

          <button
            onClick={fetchQueue}
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer"
            title="Refresh Queue"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handlePrint}
            className="bg-[#211D1C] hover:bg-stone-800 text-white font-bold text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#FFD94A]" />
            <span>Print Daily Production Manifest</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAGES.map((stage) => {
          const stageItems = filteredItems.filter((it) => it.stage === stage.id);
          return (
            <div
              key={stage.id}
              className="bg-[#FFFDF8] rounded-3xl border border-[#F3E8E2] overflow-hidden flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className={`p-4 border-b flex items-center justify-between ${stage.bgHeader}`}>
                <div className="font-serif font-bold text-xs text-[#211D1C] uppercase tracking-wider">
                  {stage.label}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${stage.badgeColor}`}>
                  {stageItems.length}
                </span>
              </div>

              {/* Column Body */}
              <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[700px]">
                {stageItems.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <Clock className="w-8 h-8 text-stone-300 mx-auto" />
                    <p className="text-xs text-stone-400 font-medium">No items in this stage</p>
                  </div>
                ) : (
                  stageItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-2xl border border-[#E7E2DA] shadow-2xs space-y-3 hover:border-[#FF2E93] transition-all"
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                        <span className="font-mono text-xs font-bold text-[#FF2E93]">#{item.orderId}</span>
                        <span className="text-[10px] font-bold text-stone-500">Due: {item.dueDate}</span>
                      </div>

                      {/* Item Details */}
                      <div className="space-y-1">
                        <div className="font-serif font-bold text-xs text-[#211D1C] leading-tight">
                          {item.productName}
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1">
                          <User className="w-3 h-3 text-stone-400" />
                          <span>{item.customerName} ({item.customerPhone})</span>
                        </div>
                      </div>

                      {/* Customization Details Box */}
                      {(item.customText || item.customPhoto || item.customSong) && (
                        <div className="bg-[#FFF0F5]/50 border border-[#F3E8E2] p-2.5 rounded-xl space-y-2">
                          {item.customText && (
                            <div className="text-xs text-[#211D1C] font-semibold">
                              <span className="text-[10px] text-[#FF2E93] uppercase tracking-wider font-bold block">
                                Engraving / Text:
                              </span>
                              “{item.customText}”
                            </div>
                          )}

                          {item.customSong && (
                            <div className="text-[11px] text-stone-600">
                              <span className="font-bold text-[#FF2E93]">Song:</span> {item.customSong} - {item.customArtist}
                            </div>
                          )}

                          {item.customPhoto && (
                            <div className="flex items-center gap-2 pt-1">
                              <img
                                src={item.customPhoto}
                                alt="Customer Reference"
                                className="w-12 h-12 rounded-lg object-cover border border-[#E7E2DA]"
                              />
                              <span className="text-[10px] text-stone-500 font-medium">Customer Photo Reference Attached</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Stage Transition Selector */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Move Stage:</span>
                        <select
                          value={item.stage}
                          onChange={(e) =>
                            handleUpdateStage(item.id, item.orderId, e.target.value as ProductionStage)
                          }
                          className="text-xs font-bold bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 outline-none text-[#211D1C] cursor-pointer"
                        >
                          <option value="to_make">To Make</option>
                          <option value="in_production">In Production</option>
                          <option value="quality_check">Quality Check</option>
                          <option value="packed">Packed</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
