import React from 'react';
import { Order } from '../../types';
import { X, Printer, Download, Sparkles, ShieldCheck, Heart, Gift } from 'lucide-react';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const addr = order.customer || order.shippingAddress || ({} as any);

  return (
    <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      
      {/* Invoice Card Container */}
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-[#F3E8E2] shadow-2xl p-6 sm:p-10 space-y-6 text-[#211D1C] relative print:border-none print:shadow-none print:p-4 max-h-[92vh] overflow-y-auto print:max-h-none">
        
        {/* Modal Top Actions (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F3E8E2] print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF2E93] text-white text-[10px] font-extrabold uppercase tracking-widest">
              Official Tax Invoice & Gift Receipt
            </span>
            <span className="text-xs font-mono font-bold text-stone-500">#{order.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-[#211D1C] hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#FFD94A]" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-[#FF2E93] text-white font-serif-heading font-black text-sm flex items-center justify-center shadow-xs">
                DE
              </div>
              <h1 className="font-serif-heading text-2xl font-bold text-[#211D1C]">
                Divine’s Eternity
              </h1>
            </div>
            <p className="text-xs text-stone-500 max-w-xs">
              Luxury Handcrafted Keepsakes & Bespoke Personalization Atelier.
            </p>
            <p className="text-[10px] text-stone-400 font-mono">
              GSTIN / Reg: 36AABCD1234E1Z5 · support@divineseternity.com
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1 text-xs">
            <div className="font-bold text-sm text-[#211D1C]">INVOICE</div>
            <div className="font-mono text-stone-500">No: {order.id}</div>
            <div className="text-stone-500">Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Today'}</div>
            <div className="text-stone-500">Status: <strong className="text-emerald-700 capitalize">{order.status || 'Confirmed'}</strong></div>
          </div>
        </div>

        {/* Customer & Shipping Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FFFDF8] border border-[#F3E8E2] text-xs">
          <div>
            <span className="font-bold text-stone-400 uppercase text-[10px] tracking-wider block mb-1">
              Billed & Shipped To:
            </span>
            <div className="font-bold text-[#211D1C]">{addr.fullName || order.customerName || 'Valued Patron'}</div>
            <div className="text-stone-600">{addr.streetAddress || 'Bespoke Address'}</div>
            {addr.apartment && <div className="text-stone-600">{addr.apartment}</div>}
            <div className="text-stone-600">{addr.city || ''}{addr.state ? `, ${addr.state}` : ''} {addr.pincode || ''}</div>
            <div className="text-stone-500 mt-1 font-mono">📞 {addr.phone || order.customerPhone || 'N/A'}</div>
          </div>

          <div>
            <span className="font-bold text-stone-400 uppercase text-[10px] tracking-wider block mb-1">
              Payment & Dispatch Info:
            </span>
            <div className="text-stone-600">Method: <strong className="text-[#211D1C]">{order.paymentMethod || 'Online Prepaid'}</strong></div>
            <div className="text-stone-600">Courier: <strong>Insured Express Courier</strong></div>
            <div className="text-stone-600">Tracking: <strong className="font-mono text-[#FF2E93]">{order.trackingNumber || `DE-EXP-${order.id.slice(-6)}`}</strong></div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b-2 border-[#211D1C] text-[#211D1C] font-bold">
                <th className="py-2.5">Item & Custom Details</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Price</th>
                <th className="py-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {(order.items || []).map((item, idx) => (
                <tr key={idx} className="py-2">
                  <td className="py-3 pr-2">
                    <div className="font-bold text-[#211D1C]">{item.name}</div>
                    {item.customText && (
                      <div className="text-[11px] text-[#FF2E93] font-semibold mt-0.5">
                        ✨ Engraved: "{item.customText}"
                      </div>
                    )}
                    {item.caseType && (
                      <div className="text-[10px] text-stone-500">Type: {item.caseType}</div>
                    )}
                  </td>
                  <td className="py-3 text-center tabular-nums">{item.quantity}</td>
                  <td className="py-3 text-right tabular-nums">₹{item.price}</td>
                  <td className="py-3 text-right font-bold tabular-nums">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gift Wrapping & Note Card (if applied) */}
        {order.giftWrapping && (
          <div className="p-3.5 rounded-2xl bg-[#FFF0F5] border border-[#FFE0E6] text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#FF2E93]">
              <Gift className="w-4 h-4" />
              <span>Complimentary Luxury Gift Packaging & Handwritten Note</span>
            </div>
            {order.giftNote && (
              <p className="text-stone-700 italic font-serif text-[11px]">
                "{order.giftNote}"
              </p>
            )}
          </div>
        )}

        {/* Total Calculations */}
        <div className="border-t border-[#F3E8E2] pt-3 flex flex-col items-end space-y-1.5 text-xs">
          <div className="flex justify-between w-48 text-stone-600">
            <span>Subtotal:</span>
            <span className="tabular-nums font-semibold">₹{order.subtotal || order.totalAmount || 0}</span>
          </div>

          {order.discountAmount ? (
            <div className="flex justify-between w-48 text-emerald-700 font-medium">
              <span>Promo Discount:</span>
              <span className="tabular-nums font-bold">-₹{order.discountAmount}</span>
            </div>
          ) : null}

          {order.giftWrapping && (
            <div className="flex justify-between w-48 text-stone-600">
              <span>Gift Wrapping:</span>
              <span className="tabular-nums">+₹99</span>
            </div>
          )}

          <div className="flex justify-between w-48 text-stone-600">
            <span>Shipping:</span>
            <span className="text-emerald-700 font-bold">FREE</span>
          </div>

          <div className="flex justify-between w-48 pt-2 border-t-2 border-[#211D1C] font-bold text-sm text-[#211D1C]">
            <span>Total Paid:</span>
            <span className="text-base text-[#211D1C] font-serif">₹{order.totalAmount || order.total || 0}</span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-dashed border-stone-200 text-center text-[10px] text-stone-500 space-y-1">
          <div className="font-serif italic font-bold text-[#FF2E93] text-xs">
            Thank you for choosing Divine’s Eternity for your cherished moments. ♡
          </div>
          <p>For questions or custom engraving assistance, WhatsApp our atelier support at +91 98765 43210.</p>
        </div>
      </div>
    </div>
  );
};
