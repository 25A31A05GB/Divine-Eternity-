import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, CheckCheck } from 'lucide-react';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  storeName?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber = '919353652043',
  storeName = "Divine’s Eternity",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [showNotificationBadge, setShowNotificationBadge] = useState(false);

  useEffect(() => {
    // Show a gentle notification ping after 4 seconds to invite customer inquiry
    const timer = setTimeout(() => {
      setShowNotificationBadge(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const quickPrompts = [
    {
      label: '🎁 Custom Name Jewelry & Hampers',
      message: 'Hello Divine’s Eternity! I would like to inquire about personalizing a gift hamper / name jewellery.',
    },
    {
      label: '📦 Track My Order Status',
      message: 'Hi! I need help tracking my order status.',
    },
    {
      label: '✨ Avail 60% Off (Code: DS1102)',
      message: 'Hello! How can I apply the first order promo code DS1102 for flat 60% off?',
    },
    {
      label: '👑 Creator Club / Collab',
      message: 'Hi team! I would love to learn more about joining the Divine Creator Club.',
    },
  ];

  const handleOpenWhatsApp = (textToSend: string) => {
    const text = textToSend.trim() || 'Hello Divine’s Eternity! I have a question about your gifts.';
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${phoneNumber}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none select-none font-sans">
      
      {/* 1. Quick Chat Popup Drawer / Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="WhatsApp Quick Inquiry"
          className="pointer-events-auto mb-3 w-[calc(100vw-3rem)] max-w-sm rounded-3xl bg-white shadow-2xl border border-[#E7E2DA] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 transition-all text-[#211D1C]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#128C7E] to-[#25D366] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white font-bold text-lg">
                <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.055-1.928-.484-1.503-.627-2.482-2.147-2.557-2.247-.074-.1-1.222-1.624-1.222-3.099 0-1.474.774-2.2 1.047-2.499.274-.3.6-.374.8-.374.2 0 .4.002.574.01.187.009.437-.07.684.524.256.618.874 2.13.95 2.284.075.153.125.334.025.534-.1.2-.15.324-.3.499-.15.175-.316.39-.45.524-.15.15-.306.314-.132.614.175.3.778 1.284 1.669 2.078 1.144 1.02 2.108 1.336 2.408 1.486.3.15.474.125.65-.075.174-.2.748-.873.948-1.173.2-.3.4-.25.674-.15.274.1 1.748.824 2.048.974.3.15.5.224.574.35.074.124.074.723-.07 1.128z" />
                </svg>
                {/* Active indicator dot */}
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#4ADE80] border-2 border-white ring-1 ring-[#128C7E]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm leading-tight text-white">{storeName} Care</h4>
                  <CheckCheck className="w-3.5 h-3.5 text-white/90" />
                </div>
                <p className="text-[11px] text-emerald-100 font-medium">Replies within ~5 mins</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Close WhatsApp chat popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-3 bg-[#FAF7F2]/60 max-h-[380px] overflow-y-auto">
            {/* Friendly Greeting Card */}
            <div className="bg-white rounded-2xl p-3.5 shadow-2xs border border-[#F3E8E2] space-y-1.5 text-left">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#128C7E]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Namaste! How may we assist you today?</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Connect directly with our luxury gift concierge on WhatsApp for instant previews, custom engraving, or order inquiries.
              </p>
            </div>

            {/* Quick Topic Prompts */}
            <div className="space-y-1.5 text-left">
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider px-1">
                Frequent Inquiries:
              </p>
              <div className="space-y-1.5">
                {quickPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOpenWhatsApp(item.message)}
                    className="w-full text-left text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 hover:text-[#128C7E] border border-[#F3E8E2] hover:border-emerald-300 shadow-2xs transition-all flex items-center justify-between group cursor-pointer active:scale-98"
                  >
                    <span className="truncate pr-2">{item.label}</span>
                    <Send className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#128C7E] shrink-0 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Message Input */}
            <div className="pt-1">
              <div className="flex items-center gap-2 bg-white rounded-2xl p-1.5 border border-[#E7E2DA] shadow-2xs focus-within:border-[#25D366] focus-within:ring-2 focus-within:ring-[#25D366]/20 transition-all">
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleOpenWhatsApp(customMessage);
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent px-3 py-1.5 text-xs text-stone-800 focus:outline-hidden placeholder:text-stone-400"
                />
                <button
                  type="button"
                  onClick={() => handleOpenWhatsApp(customMessage)}
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white p-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 flex items-center justify-center shrink-0"
                  aria-label="Send WhatsApp message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-stone-50 border-t border-[#F3E8E2] py-2 px-4 text-center">
            <span className="text-[10px] text-stone-400 font-medium">
              Powered by WhatsApp Business • End-to-end encrypted
            </span>
          </div>
        </div>
      )}

      {/* 2. Floating Action Button */}
      <div className="pointer-events-auto relative flex items-center gap-2.5">
        
        {/* Hover / Initial Prompt Tooltip */}
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 bg-white/95 hover:bg-white text-stone-800 text-xs font-bold px-3.5 py-2 rounded-full shadow-lg border border-[#E7E2DA] cursor-pointer hover:border-emerald-300 transition-all transform hover:-translate-x-1"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span>Chat on WhatsApp</span>
          </button>
        )}

        {/* Main Circular Green WhatsApp Floating Button */}
        <button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev);
            setShowNotificationBadge(false);
          }}
          aria-label={isOpen ? "Close WhatsApp inquiries" : "Open WhatsApp chat inquiry"}
          className={`relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            isOpen
              ? 'bg-[#211D1C] hover:bg-stone-800 rotate-90'
              : 'bg-gradient-to-tr from-[#128C7E] to-[#25D366] hover:brightness-105'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 stroke-[2.5]" />
          ) : (
            <>
              {/* WhatsApp Icon */}
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.055-1.928-.484-1.503-.627-2.482-2.147-2.557-2.247-.074-.1-1.222-1.624-1.222-3.099 0-1.474.774-2.2 1.047-2.499.274-.3.6-.374.8-.374.2 0 .4.002.574.01.187.009.437-.07.684.524.256.618.874 2.13.95 2.284.075.153.125.334.025.534-.1.2-.15.324-.3.499-.15.175-.316.39-.45.524-.15.15-.306.314-.132.614.175.3.778 1.284 1.669 2.078 1.144 1.02 2.108 1.336 2.408 1.486.3.15.474.125.65-.075.174-.2.748-.873.948-1.173.2-.3.4-.25.674-.15.274.1 1.748.824 2.048.974.3.15.5.224.574.35.074.124.074.723-.07 1.128z" />
              </svg>

              {/* Pulsing Green Ping Ring */}
              <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />

              {/* Notification Badge */}
              {showNotificationBadge && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-white text-[9px] font-black items-center justify-center">
                    1
                  </span>
                </span>
              )}
            </>
          )}
        </button>
      </div>

    </div>
  );
};
