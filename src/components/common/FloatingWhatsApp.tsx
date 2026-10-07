import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Send, Sparkles, Check, CheckCheck, Loader2, ShoppingBag, Package, Heart, Award, ArrowRight, RefreshCw, MessageSquare } from 'lucide-react';
import { soundFeedback } from '../../lib/soundFeedback';
import { Product, Order } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { db } from '../../lib/db';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  storeName?: string;
  currentView?: string;
  viewParams?: Record<string, string>;
  activeProduct?: Product | null;
  products?: Product[];
}

export type MessageStatus = 'sent' | 'delivered' | 'read';

interface MessageHistoryItem {
  id: string;
  sender: 'user' | 'concierge';
  text: string;
  time: string;
  status?: MessageStatus;
}

interface QuickPrompt {
  id: string;
  category: 'context' | 'orders' | 'deals' | 'general';
  label: string;
  message: string;
  reply: string;
  badge?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber = '919353652043',
  storeName = "Divine’s Eternity",
  currentView = 'home',
  viewParams = {},
  activeProduct = null,
  products = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [showNotificationBadge, setShowNotificationBadge] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState<string>('typing...');
  const [messages, setMessages] = useState<MessageHistoryItem[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'context' | 'orders' | 'deals'>('all');
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const { cart, totalAmount } = useCart();
  const { wishlistCount } = useWishlist();

  // Load previous order history for repeat customer personalization
  useEffect(() => {
    db.getOrders(user?.id).then(({ data }) => {
      if (data && data.length > 0) {
        setPastOrders(data);
      }
    });
  }, [user?.id]);

  // Initial gentle notification ping after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotificationBadge(true);
      soundFeedback.playSoftPing(0.09);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll when messages update
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Derive most recent order if available
  const recentOrder = pastOrders[0] || null;

  // Resolve target product from activeProduct, viewParams, or products list
  const currentProduct = useMemo(() => {
    if (activeProduct) return activeProduct;
    if (currentView === 'product-detail' && viewParams?.slug && products.length > 0) {
      return products.find((p) => p.slug === viewParams.slug || p.id === viewParams.slug) || null;
    }
    return null;
  }, [activeProduct, currentView, viewParams, products]);

  // Dynamic context title badge based on browsing state & purchase history
  const contextBadgeInfo = useMemo(() => {
    if (currentProduct) {
      return {
        tag: 'Product Inquiry',
        title: currentProduct.name,
        color: 'bg-rose-50 text-rose-700 border-rose-200',
      };
    }
    if (currentView === 'checkout' || (cart.length > 0 && currentView !== 'home')) {
      return {
        tag: 'Cart Assistance',
        title: `${cart.length} keepsake(s) in bag (₹${totalAmount})`,
        color: 'bg-amber-50 text-amber-800 border-amber-200',
      };
    }
    if (recentOrder) {
      return {
        tag: 'VIP Client',
        title: `Welcome back! Order #${recentOrder.id}`,
        color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    }
    if (currentView === 'wishlist' && wishlistCount > 0) {
      return {
        tag: 'Wishlist Curations',
        title: `${wishlistCount} saved keepsake(s)`,
        color: 'bg-pink-50 text-pink-700 border-pink-200',
      };
    }
    if (currentView === 'creator-club') {
      return {
        tag: 'Creator Desk',
        title: 'PR Hampers & Ambassador Club',
        color: 'bg-purple-50 text-purple-700 border-purple-200',
      };
    }
    if (currentView === 'collections') {
      const cat = viewParams?.category || 'All Collections';
      return {
        tag: 'Collection Guide',
        title: cat,
        color: 'bg-stone-100 text-stone-700 border-stone-200',
      };
    }
    return null;
  }, [currentProduct, currentView, cart, totalAmount, recentOrder, wishlistCount, viewParams]);

  // Intelligent Context-Aware Quick Reply Prompts
  const dynamicPrompts = useMemo<QuickPrompt[]>(() => {
    const list: QuickPrompt[] = [];

    // 1. SPECIFIC PRODUCT CONTEXT
    if (currentProduct) {
      list.push(
        {
          id: 'prod-proof',
          category: 'context',
          label: `✨ Photo Proof for ${currentProduct.name}`,
          message: `Hello Divine’s Eternity! Can I get a WhatsApp photo proof of custom personalization for "${currentProduct.name}" before dispatch?`,
          reply: `Namaste! Absolutely. For "${currentProduct.name}", our atelier creates a free digital proof and shares high-res photos on WhatsApp before dispatch. What custom name, date, or font would you prefer?`,
          badge: 'Live Preview',
        },
        {
          id: 'prod-shipping',
          category: 'context',
          label: `🚚 Delivery Timeline for ${currentProduct.name}`,
          message: `Hi! I need "${currentProduct.name}" delivered for an upcoming celebration. What is the fastest express shipping available to my PIN code?`,
          reply: `We offer Pan-India insured express delivery with BlueDart and Delhivery! Metro deliveries typically take 2-3 days, and express crafting is available for urgent gifts. What is your delivery city/PIN code?`,
          badge: 'Express Shipping',
        },
        {
          id: 'prod-quality',
          category: 'context',
          label: `💎 18K Gold Plating & Quality Warranty`,
          message: `Hello! Can you share more details about the material, 18K gold laser plating, and anti-tarnish warranty for "${currentProduct.name}"?`,
          reply: `Every piece is handcrafted with hypoallergenic 925 sterling silver or thick 18K gold vermeil laser plating, verified with our anti-tarnish quality guarantee and archival keepsake box.`,
          badge: 'Atelier Quality',
        }
      );
    }

    // 2. CHECKOUT OR ACTIVE CART CONTEXT
    if (cart.length > 0 || currentView === 'checkout') {
      list.push(
        {
          id: 'cart-urgent',
          category: 'context',
          label: `🛍️ Review My Bag (${cart.length} Item${cart.length > 1 ? 's' : ''} · ₹${totalAmount})`,
          message: `Hello Divine’s Eternity! I have ${cart.length} item(s) in my cart for ₹${totalAmount}. Can you verify my customization text before I place the order?`,
          reply: `Namaste! Our artisan concierge is ready to verify your bag details and ensure your engravings & addresses are 100% accurate. Would you like us to review your cart?`,
          badge: 'Cart Assist',
        },
        {
          id: 'cart-discount',
          category: 'deals',
          label: `🎟️ Avail Best Coupon Code (DS1102 / BUY3PAY2)`,
          message: `Hi! What is the maximum discount code applicable on my cart value of ₹${totalAmount}?`,
          reply: `Use code DS1102 for a flat 60% OFF first orders! Or if you have 3 or more gifts in your bag, code BUY3PAY2 makes your lowest-priced item 100% free!`,
          badge: 'Flat 60% Off',
        },
        {
          id: 'cart-wrap',
          category: 'context',
          label: `🎁 Luxury Satin Box & Wax-Sealed Note`,
          message: `Hi team! Can I add customized luxury gift wrapping with a handwritten wax-sealed greeting note to this order?`,
          reply: `Yes! For just ₹99, we include our luxury satin-ribbon keepsake gift box, velvet protective pouch, and a hand-calligraphed wax-sealed greeting card with your words!`,
          badge: 'Gift Wrapping',
        }
      );
    }

    // 3. RECENT PURCHASE HISTORY
    if (recentOrder) {
      list.push(
        {
          id: 'hist-track',
          category: 'orders',
          label: `📦 Live Tracking for Order #${recentOrder.id}`,
          message: `Hello! Can you provide the live courier tracking update and estimated delivery date for my Order #${recentOrder.id}?`,
          reply: `Hello! For Order #${recentOrder.id} (${recentOrder.customer?.fullName || 'Valued Client'}), the current fulfillment status is "${recentOrder.status}". Our tracking link is active with ${recentOrder.trackingNumber || 'Delhivery Express'}.`,
          badge: `Status: ${recentOrder.status}`,
        },
        {
          id: 'hist-reorder',
          category: 'orders',
          label: `⭐ Re-Order / Matching Piece for Order #${recentOrder.id}`,
          message: `Hello again! I loved my purchase from Order #${recentOrder.id} and would like to order a matching keepsake.`,
          reply: `Welcome back! It is a joy to handcraft for you again. As a valued repeat client, we can apply an exclusive loyalty benefit on your complementary order!`,
          badge: 'VIP Repeat',
        }
      );
    }

    // 4. WISHLIST CONTEXT
    if (wishlistCount > 0 && currentView === 'wishlist') {
      list.push({
        id: 'wish-bundle',
        category: 'context',
        label: `💖 Special Bundle for my ${wishlistCount} Saved Keepsake(s)`,
        message: `Hi! I have ${wishlistCount} keepsake(s) saved in my Wishlist. Is there an atelier bundle offer if I order together?`,
        reply: `We would love to curate a custom pairing for your wishlist items! We have bundle specials like 'Any 2 Gifts for ₹849' and complimentary express dispatch.`,
        badge: 'Wishlist Offer',
      });
    }

    // 5. CREATOR CLUB CONTEXT
    if (currentView === 'creator-club') {
      list.push(
        {
          id: 'creator-pr',
          category: 'context',
          label: `👑 Creator Club & Gifted PR Hamper Inquiry`,
          message: `Hi team! I am a content creator interested in joining the Divine Creator Club and receiving a gifted luxury jewelry PR hamper.`,
          reply: `Namaste! We collaborate with passionate creators across India. Share your Instagram handle, follower count, and primary city, and our PR partnerships team will review your application today!`,
          badge: 'Creator Collab',
        },
        {
          id: 'creator-affiliate',
          category: 'context',
          label: `📈 15-20% Affiliate Commission Details`,
          message: `Hello! How does the 15-20% commission affiliate partnership program work with Divine’s Eternity?`,
          reply: `Our creator affiliates receive a custom 15% discount code for their followers and earn 15-20% direct cash commission payouts on every order placed with their code!`,
          badge: 'Affiliate Program',
        }
      );
    }

    // 6. DEFAULT STOREWIDE & GENERAL INQUIRIES
    list.push(
      {
        id: 'gen-custom',
        category: 'general',
        label: '🎁 Custom Name Jewelry & Personalized Hampers',
        message: 'Hello Divine’s Eternity! I would like to inquire about personalizing a custom gift hamper / name jewellery piece.',
        reply: 'Namaste! We handcraft customized 18K gold-plated & 925 sterling pieces, engraved hampers, caricature miniatures, and preserved rose bell jars. What are you looking to personalize?',
        badge: 'Top Inquiry',
      },
      {
        id: 'gen-track',
        category: 'orders',
        label: '📦 Track My Order by ID & Phone',
        message: 'Hi! I need help tracking my order status.',
        reply: 'Certainly! Please share your Order ID (e.g. DE-123456) or your 10-digit registered mobile number, and our logistics team will pull up your live status right away.',
        badge: 'Logistics',
      },
      {
        id: 'gen-promo',
        category: 'deals',
        label: '✨ Flat 60% Off Code (DS1102)',
        message: 'Hello! How do I apply the first order promo code DS1102 for flat 60% off?',
        reply: 'Code DS1102 applies automatically in your cart for flat 60% off your entire order! Let us know if you would like personal assistance applying it.',
        badge: '60% Promo',
      }
    );

    // Deduplicate by ID
    const seen = new Set<string>();
    return list.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [currentProduct, currentView, cart, totalAmount, recentOrder, wishlistCount]);

  // Filtered prompts based on active tab
  const filteredPrompts = useMemo(() => {
    if (activeCategoryFilter === 'all') return dynamicPrompts.slice(0, 5);
    return dynamicPrompts.filter((p) => p.category === activeCategoryFilter);
  }, [dynamicPrompts, activeCategoryFilter]);

  // Direct WhatsApp external redirection
  const executeWhatsAppRedirect = (textToSend: string) => {
    const text = textToSend.trim() || 'Hello Divine’s Eternity! I have a question about your luxury gifts.';
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${phoneNumber}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSelectPrompt = (prompt: QuickPrompt) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `user-${Date.now()}`;
    
    // Play user tap sound
    soundFeedback.playConciergePop(0.08);

    // 1. Initial State: Single checkmark (sent)
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: prompt.message, time: now, status: 'sent' },
    ]);

    // 2. Deliver within 300ms: Double grey checkmarks (delivered)
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsgId ? { ...m, status: 'delivered' } : m))
      );
    }, 300);

    // 3. Blue double checkmark (read) + Concierge typing indicator starts after 600ms
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsgId ? { ...m, status: 'read' } : m))
      );
      setTypingStatus('typing...');
      setIsTyping(true);
    }, 600);

    // 4. Multi-stage typing progression at 1400ms for natural realism
    setTimeout(() => {
      setTypingStatus('crafting response...');
    }, 1400);

    // 5. Concierge responds at 2200ms: Reply sound + message
    setTimeout(() => {
      setIsTyping(false);
      soundFeedback.playSoftPing(0.12);

      setMessages((prev) => [
        ...prev,
        {
          id: `concierge-${Date.now()}`,
          sender: 'concierge',
          text: prompt.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered',
        },
      ]);
    }, 2200);
  };

  const handleSendMessage = () => {
    const trimmed = customMessage.trim();
    if (!trimmed) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `user-${Date.now()}`;
    soundFeedback.playConciergePop(0.08);

    // 1. Sent status
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: trimmed, time: now, status: 'sent' },
    ]);
    setCustomMessage('');

    // 2. Delivered status
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsgId ? { ...m, status: 'delivered' } : m))
      );
    }, 300);

    // 3. Read status + start typing indicator
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsgId ? { ...m, status: 'read' } : m))
      );
      setTypingStatus('typing...');
      setIsTyping(true);
    }, 600);

    // 4. Multi-stage typing progression
    setTimeout(() => {
      setTypingStatus('checking customization options...');
    }, 1400);

    // 5. Personalized response
    setTimeout(() => {
      setIsTyping(false);
      soundFeedback.playSoftPing(0.12);

      const personalizedLead = currentProduct
        ? `Thank you for asking about ${currentProduct.name}! Let's connect directly on WhatsApp so our artisan team can assist with exact customization previews.`
        : `Thank you for reaching out to Divine's Eternity! Let's continue this conversation directly on WhatsApp with our concierge team.`;

      setMessages((prev) => [
        ...prev,
        {
          id: `concierge-${Date.now()}`,
          sender: 'concierge',
          text: personalizedLead,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered',
        },
      ]);
    }, 2300);
  };

  const toggleOpen = () => {
    if (!isOpen) {
      soundFeedback.playSoftPing(0.1);
      setShowNotificationBadge(false);
    }
    setIsOpen((prev) => !prev);
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
          <div className="bg-gradient-to-r from-[#128C7E] to-[#25D366] p-4 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white font-bold text-lg shrink-0">
                <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.055-1.928-.484-1.503-.627-2.482-2.147-2.557-2.247-.074-.1-1.222-1.624-1.222-3.099 0-1.474.774-2.2 1.047-2.499.274-.3.6-.374.8-.374.2 0 .4.002.574.01.187.009.437-.07.684.524.256.618.874 2.13.95 2.284.075.153.125.334.025.534-.1.2-.15.324-.3.499-.15.175-.316.39-.45.524-.15.15-.306.314-.132.614.175.3.778 1.284 1.669 2.078 1.144 1.02 2.108 1.336 2.408 1.486.3.15.474.125.65-.075.174-.2.748-.873.948-1.173.2-.3.4-.25.674-.15.274.1 1.748.824 2.048.974.3.15.5.224.574.35.074.124.074.723-.07 1.128z" />
                </svg>
                {/* Active indicator dot */}
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#4ADE80] border-2 border-white ring-1 ring-[#128C7E]" />
              </div>

              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm leading-tight text-white truncate">{storeName} Care</h4>
                  <CheckCheck className="w-3.5 h-3.5 text-white/90 shrink-0" />
                </div>
                <div className="text-[11px] text-emerald-100 font-medium truncate min-h-[16px] flex items-center">
                  {isTyping ? (
                    <span className="text-[#A7F3D0] font-bold flex items-center gap-1.5 animate-in fade-in duration-200">
                      <span className="italic">{typingStatus}</span>
                      <span className="inline-flex items-center gap-0.5">
                        <span className="w-1 h-1 rounded-full bg-white animate-wa-dot-1" />
                        <span className="w-1 h-1 rounded-full bg-white animate-wa-dot-2" />
                        <span className="w-1 h-1 rounded-full bg-white animate-wa-dot-3" />
                      </span>
                    </span>
                  ) : user ? (
                    `Namaste, ${(user.name || 'Friend').split(' ')[0]}`
                  ) : (
                    'Online • Instant Artisan Support'
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
              aria-label="Close WhatsApp chat popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Context Pill Banner */}
          {contextBadgeInfo && (
            <div className={`px-4 py-2 border-b flex items-center justify-between text-[11px] ${contextBadgeInfo.color}`}>
              <div className="flex items-center gap-1.5 truncate">
                <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#FF2E93]" />
                <span className="font-bold uppercase tracking-wider text-[9px] opacity-80">{contextBadgeInfo.tag}:</span>
                <span className="font-bold truncate">{contextBadgeInfo.title}</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </div>
          )}

          {/* Body Content */}
          <div className="p-4 space-y-3 bg-[#FAF7F2]/60 max-h-[360px] overflow-y-auto">
            {/* Friendly Greeting Card */}
            <div className="bg-white rounded-2xl p-3.5 shadow-2xs border border-[#F3E8E2] space-y-1 text-left">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#128C7E]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {currentProduct
                    ? `Need help personalizing "${currentProduct.name}"?`
                    : user
                    ? `Namaste ${(user.name || 'Friend').split(' ')[0]}, how may we assist you today?`
                    : 'Personalized Gifting Concierge'}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Connect directly with our luxury gift concierge on WhatsApp for live photo proofs, custom handwriting engraving, or delivery questions.
              </p>
            </div>

            {/* Simulated Live Messages Thread */}
            {messages.length > 0 && (
              <div className="space-y-2.5 pt-1">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-[#128C7E] text-white rounded-tr-xs shadow-xs text-left'
                          : 'bg-white text-stone-800 border border-[#E7E2DA] rounded-tl-xs shadow-2xs text-left'
                      }`}
                    >
                      {m.text}
                    </div>
                    
                    {/* Time & Read Receipts */}
                    <div className="flex items-center gap-1 text-[9px] text-stone-400 mt-0.5 px-1">
                      <span>{m.time}</span>
                      
                      {/* Read receipts for user sent messages */}
                      {m.sender === 'user' && (
                        <span
                          className="inline-flex items-center ml-0.5"
                          title={m.status === 'read' ? 'Read' : m.status === 'delivered' ? 'Delivered' : 'Sent'}
                        >
                          {m.status === 'sent' && (
                            <Check className="w-3 h-3 text-stone-400 stroke-[2.5]" />
                          )}
                          {m.status === 'delivered' && (
                            <CheckCheck className="w-3.5 h-3.5 text-stone-400 stroke-[2]" />
                          )}
                          {m.status === 'read' && (
                            <span className="inline-flex items-center text-[#34B7F1] animate-in zoom-in-75 duration-300">
                              <CheckCheck
                                className="w-3.5 h-3.5 text-[#34B7F1] stroke-[2.5] drop-shadow-[0_0_2px_rgba(52,183,241,0.5)]"
                              />
                            </span>
                          )}
                        </span>
                      )}

                      {/* For concierge messages */}
                      {m.sender === 'concierge' && (
                        <CheckCheck className="w-3 h-3 text-emerald-500/70" />
                      )}
                    </div>
                  </div>
                ))}

                {/* Direct WhatsApp Call to Action if concierge has replied */}
                {messages.some((m) => m.sender === 'concierge') && (
                  <button
                    type="button"
                    onClick={() => {
                      const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user')?.text || '';
                      executeWhatsAppRedirect(lastUserMsg);
                    }}
                    className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-[#128C7E] to-[#25D366] text-white font-bold text-xs rounded-xl shadow-md hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continue on WhatsApp App</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Realistic WhatsApp Typing Indicator */}
            {isTyping && (
              <div className="flex flex-col items-start gap-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-1.5 text-[10px] text-[#128C7E] pl-1 font-bold">
                  <Sparkles className="w-3 h-3 text-[#FF2E93] animate-spin" />
                  <span>{storeName} Concierge</span>
                </div>
                <div className="bg-white text-stone-800 border border-[#E7E2DA] rounded-2xl rounded-tl-xs shadow-2xs py-2.5 px-4 flex items-center gap-3">
                  {/* 3 WhatsApp Style Bouncing Dots */}
                  <div className="flex items-center gap-1 py-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#128C7E] animate-wa-dot-1" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#128C7E] animate-wa-dot-2" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#128C7E] animate-wa-dot-3" />
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium italic">
                    {typingStatus}
                  </span>
                </div>
              </div>
            )}

            {/* Dynamic Quick Reply Prompts with Category Filter Tabs */}
            {messages.length === 0 && (
              <div className="space-y-2 text-left pt-0.5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider px-1">
                    Recommended For You:
                  </p>
                  
                  {/* Category Filter Chips */}
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setActiveCategoryFilter('all')}
                      className={`px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                        activeCategoryFilter === 'all'
                          ? 'bg-[#128C7E] text-white'
                          : 'bg-white text-stone-500 border border-[#E7E2DA] hover:text-[#128C7E]'
                      }`}
                    >
                      Top
                    </button>
                    {(currentProduct || cart.length > 0) && (
                      <button
                        type="button"
                        onClick={() => setActiveCategoryFilter('context')}
                        className={`px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                          activeCategoryFilter === 'context'
                            ? 'bg-[#128C7E] text-white'
                            : 'bg-white text-stone-500 border border-[#E7E2DA] hover:text-[#128C7E]'
                        }`}
                      >
                        This Page
                      </button>
                    )}
                    {recentOrder && (
                      <button
                        type="button"
                        onClick={() => setActiveCategoryFilter('orders')}
                        className={`px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                          activeCategoryFilter === 'orders'
                            ? 'bg-[#128C7E] text-white'
                            : 'bg-white text-stone-500 border border-[#E7E2DA] hover:text-[#128C7E]'
                        }`}
                      >
                        Orders
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setActiveCategoryFilter('deals')}
                      className={`px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                        activeCategoryFilter === 'deals'
                          ? 'bg-[#128C7E] text-white'
                          : 'bg-white text-stone-500 border border-[#E7E2DA] hover:text-[#128C7E]'
                      }`}
                    >
                      Offers
                    </button>
                  </div>
                </div>

                {/* Prompt Buttons */}
                <div className="space-y-1.5">
                  {filteredPrompts.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectPrompt(item)}
                      className="w-full text-left text-xs font-semibold px-3 py-2.5 rounded-xl bg-white hover:bg-emerald-50 hover:text-[#128C7E] border border-[#F3E8E2] hover:border-emerald-300 shadow-2xs transition-all flex items-center justify-between group cursor-pointer active:scale-98"
                    >
                      <div className="flex flex-col gap-0.5 overflow-hidden pr-2">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className="text-[9px] font-bold text-[#FF2E93] uppercase tracking-wider">
                            ✦ {item.badge}
                          </span>
                        )}
                      </div>
                      <Send className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#128C7E] shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Message Input */}
            <div className="pt-1">
              <div className="flex items-center gap-2 bg-white rounded-2xl p-1.5 border border-[#E7E2DA] shadow-2xs focus-within:border-[#25D366] focus-within:ring-2 focus-within:ring-[#25D366]/20 transition-all">
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    currentProduct
                      ? `Ask about ${currentProduct.name}...`
                      : 'Type your question...'
                  }
                  className="flex-1 bg-transparent px-3 py-1.5 text-xs text-stone-800 focus:outline-hidden placeholder:text-stone-400"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white p-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 flex items-center justify-center shrink-0"
                  aria-label="Send WhatsApp message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div ref={chatEndRef} />
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
            onClick={toggleOpen}
            className="hidden sm:inline-flex items-center gap-2 bg-white/95 hover:bg-white text-stone-800 text-xs font-bold px-3.5 py-2 rounded-full shadow-lg border border-[#E7E2DA] cursor-pointer hover:border-emerald-300 transition-all transform hover:-translate-x-1"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span>{currentProduct ? `Inquire about ${currentProduct.name.slice(0, 18)}...` : 'Chat on WhatsApp'}</span>
          </button>
        )}

        {/* Main Circular Green WhatsApp Floating Button */}
        <button
          type="button"
          onClick={toggleOpen}
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
