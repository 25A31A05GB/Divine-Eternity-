import React, { useState } from 'react';
import { MessageSquare, Sparkles, X, ArrowRight, Heart, Gift, Truck, Users } from 'lucide-react';
import { BUSINESS_CONFIG } from '../../config/business';

interface WhatsAppConciergeProps {
  phoneNumber?: string;
}

export const WhatsAppConcierge: React.FC<WhatsAppConciergeProps> = ({
  phoneNumber = BUSINESS_CONFIG.whatsappNumber.replace(/[^0-9]/g, ''),
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const QUICK_PROMPTS = [
    {
      icon: '✨',
      label: 'Bespoke Custom Name Query',
      text: 'Hi Divine’s Eternity Team! 🌸 I would like to inquire about customized name engraving for my order.',
    },
    {
      icon: '🚚',
      label: 'Live Order Tracking Help',
      text: 'Hello! I need assistance tracking my parcel with Divine’s Eternity.',
    },
    {
      icon: '🌟',
      label: 'Join Creator Club (₹7k/mo)',
      text: 'Hi Sonu & Team! I am interested in joining the Divine’s Eternity Creator Club & UGC opportunities.',
    },
    {
      icon: '🎁',
      label: 'Bulk Hampers / Wedding Favors',
      text: 'Hello Divine’s Eternity, I am looking for custom hampers/corporate bulk gifting options.',
    },
  ];

  const handleStartChat = (customMessage?: string) => {
    const msg = encodeURIComponent(
      customMessage ||
        'Hi Divine’s Eternity Atelier! 🌸 I would love to explore personalized gifts and keepsakes.'
    );
    const url = `https://wa.me/${phoneNumber}?text=${msg}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      
      {/* Expanded Concierge Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-92 bg-[#FFFDF8] rounded-3xl border border-[#F3E8E2] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-3 duration-200 text-[#211D1C]">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#211D1C] to-[#383130] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#FF2E93] flex items-center justify-center text-white font-black font-serif-heading text-sm shadow-xs">
                DE
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>Atelier WhatsApp Concierge</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-stone-300">Replies usually within 5–10 mins</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-stone-400 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-[#FFFDF8]">
            <p className="text-xs text-stone-700 leading-relaxed">
              Hello! 🌸 Need help with laser engraved names, crystal photo previews, express shipping, or bespoke gift hampers?
            </p>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#FF2E93] uppercase tracking-wider block">
                Quick Prompts:
              </span>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleStartChat(prompt.text)}
                  className="w-full text-left p-2.5 rounded-2xl bg-[#FFF9EB] hover:bg-[#FFF0F5] border border-[#F5E6CE] hover:border-[#FF2E93] text-xs text-[#211D1C] font-medium transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>{prompt.icon}</span>
                    <span className="font-semibold text-xs">{prompt.label}</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FF2E93] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>

            <button
              onClick={() => handleStartChat()}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Chat Directly on WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="WhatsApp Concierge"
        className="group flex items-center gap-2.5 bg-gradient-to-r from-[#211D1C] to-emerald-800 text-white pl-3.5 pr-4 py-3 rounded-full shadow-2xl border-2 border-white/80 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
          <MessageSquare className="w-4 h-4 fill-current" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-[11px] font-extrabold tracking-wide text-[#FFD94A]">Live Atelier Support</div>
          <div className="text-[9px] text-emerald-200 font-medium">WhatsApp Assistance</div>
        </div>
        <span className="sm:hidden text-xs font-bold text-[#FFD94A]">WhatsApp</span>
      </button>
    </div>
  );
};
