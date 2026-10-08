import React, { useState, useMemo } from 'react';
import { Order } from '../../types';
import {
  Package,
  Search,
  Filter,
  Truck,
  FileText,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  X,
  Mail,
  Clock,
  Sparkles,
  ShieldCheck,
  Tag,
} from 'lucide-react';

interface AdminOrdersTabProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: string, trackingNumber?: string) => Promise<void>;
  onRefreshOrders?: () => void;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  orders,
  onUpdateOrderStatus,
  onRefreshOrders,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [activeOrderModal, setActiveOrderModal] = useState<Order | null>(null);
  const [isShipmentLoading, setIsShipmentLoading] = useState(false);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [proofNote, setProofNote] = useState('');
  const [notificationLogs, setNotificationLogs] = useState<any[]>([]);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        (o.customer?.fullName || '').toLowerCase().includes(q) ||
        (o.customer?.phone || '').includes(q) ||
        (o.customer?.email || '').toLowerCase().includes(q);

      const matchStatus = statusFilter === 'all' || o.status.toLowerCase() === statusFilter.toLowerCase();
      const matchPayment =
        paymentFilter === 'all' || (o.paymentMethod || '').toLowerCase() === paymentFilter.toLowerCase();

      return matchSearch && matchStatus && matchPayment;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    }
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedOrderIds.length === 0) return;
    setActionError(null);
    try {
      for (const id of selectedOrderIds) {
        await onUpdateOrderStatus(id, newStatus);
      }
      setActionSuccess(`Updated ${selectedOrderIds.length} order(s) to ${newStatus}`);
      setSelectedOrderIds([]);
    } catch (err: any) {
      setActionError(`Bulk status update failed: ${err.message}`);
    }
  };

  const handleCreateShipment = async (order: Order) => {
    setIsShipmentLoading(true);
    setActionError(null);
    try {
      const res = await fetch('/api/admin-order-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          status: 'Shipped',
          trackingNumber: order.trackingNumber || `DE-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create shipment');
      }

      setActionSuccess(`Shipment created & tracking AWB assigned for Order #${order.id}`);
      if (onRefreshOrders) onRefreshOrders();
    } catch (err: any) {
      setActionError(`Shipment creation error: ${err.message}`);
    } finally {
      setIsShipmentLoading(false);
    }
  };

  const handleSendProof = async (order: Order) => {
    try {
      const res = await fetch('/api/_lib/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          eventType: 'proof_sent',
          customerName: order.customer?.fullName || 'Client',
          customerEmail: order.customer?.email,
          proofLink: `${window.location.origin}/proof/${order.id}`,
        }),
      });
      setActionSuccess(`Digital proof approval email dispatched for Order #${order.id}`);
      setIsProofModalOpen(false);
    } catch (err: any) {
      setActionError(`Failed to send proof email: ${err.message}`);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Phone', 'Email', 'Items Count', 'Total (INR)', 'Payment Method', 'Payment Status', 'Order Status', 'Date'];
    const rows = filteredOrders.map((o) => [
      o.id,
      `"${o.customer?.fullName || ''}"`,
      `"${o.customer?.phone || ''}"`,
      `"${o.customer?.email || ''}"`,
      o.items?.length || 0,
      o.totalAmount,
      o.paymentMethod || 'Prepaid',
      o.paymentStatus || 'Paid',
      o.status,
      o.createdAt || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DE_Orders_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Banner Notifications */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-black">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-700 hover:text-black">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Control Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-[#F3E8E2] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Order ID, name, phone, email..."
              className="w-full bg-[#FFFDF8] border border-[#E7E2DA] focus:border-[#FF2E93] rounded-full pl-9 pr-4 py-2 text-xs font-medium outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FFFDF8] border border-[#E7E2DA] rounded-full px-3 py-2 text-xs font-bold text-stone-700 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="placed">Placed</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-[#FFFDF8] border border-[#E7E2DA] rounded-full px-3 py-2 text-xs font-bold text-stone-700 outline-none"
          >
            <option value="all">All Payments</option>
            <option value="prepaid">Prepaid / Online</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-full border border-[#E7E2DA] hover:border-[#FF2E93] text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#FF2E93]" />
            <span>Export CSV</span>
          </button>

          {onRefreshOrders && (
            <button
              onClick={onRefreshOrders}
              className="p-2 rounded-full border border-[#E7E2DA] hover:border-[#FF2E93] text-stone-700 transition-all cursor-pointer"
              title="Refresh Orders"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedOrderIds.length > 0 && (
        <div className="bg-[#211D1C] text-white p-3 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in duration-200 shadow-md">
          <span className="text-xs font-bold pl-2">
            {selectedOrderIds.length} Order(s) Selected
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-400">Set Status:</span>
            {['Packed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => handleBulkStatusChange(st)}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-[#FF2E93] text-white text-[11px] font-bold transition-colors cursor-pointer"
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#F3E8E2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FFFDF8] border-b border-[#F3E8E2] text-[11px] font-bold uppercase text-stone-500 tracking-wider">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedOrderIds.length > 0 && selectedOrderIds.length === filteredOrders.length}
                    onChange={toggleSelectAll}
                    className="rounded accent-[#FF2E93]"
                  />
                </th>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total & Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8ECE5]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500 font-serif">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FFFDF8] transition-colors group">
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={selectedOrderIds.includes(order.id)}
                        onChange={() => toggleSelectOrder(order.id)}
                        className="rounded accent-[#FF2E93]"
                      />
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-[#211D1C]">
                      <div>#{order.id}</div>
                      <div className="text-[10px] text-stone-400 font-sans font-normal mt-0.5">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#211D1C]">{order.customer?.fullName || 'Valued Patron'}</div>
                      <div className="text-[10px] text-stone-500">{order.customer?.phone}</div>
                      <div className="text-[10px] text-stone-400 truncate max-w-[140px]">{order.customer?.email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#FF2E93] bg-[#FFF0F5] px-2 py-0.5 rounded-full text-[11px]">
                        {order.items?.length || 0} item(s)
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-[#211D1C]">₹{order.totalAmount}</div>
                      <div className="text-[10px] text-emerald-700 font-medium">{order.paymentMethod} • {order.paymentStatus || 'Paid'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                        className="bg-[#FFF9EB] border border-[#F5E6CE] font-bold text-[11px] text-[#211D1C] px-2.5 py-1 rounded-full outline-none cursor-pointer"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1 shrink-0">
                      <button
                        onClick={() => setActiveOrderModal(order)}
                        className="p-1.5 rounded-lg hover:bg-[#FFF0F5] text-stone-600 hover:text-[#FF2E93] transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <a
                        href={`/api/invoice?orderId=${order.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-emerald-50 text-stone-600 hover:text-emerald-600 transition-colors inline-block"
                        title="Download Tax Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </a>

                      {order.status !== 'Shipped' && order.status !== 'Delivered' && (
                        <button
                          onClick={() => handleCreateShipment(order)}
                          className="px-2 py-1 rounded-full bg-[#211D1C] hover:bg-[#FF2E93] text-white text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Shiprocket
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative border border-[#F3E8E2]">
            <button
              onClick={() => setActiveOrderModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#F3E8E2] pb-4">
              <span className="text-[10px] font-bold text-[#FF2E93] uppercase tracking-widest">
                Order Detail Overview
              </span>
              <h3 className="font-serif text-xl font-bold text-[#211D1C]">
                Order #{activeOrderModal.id}
              </h3>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4 bg-[#FFFDF8] p-4 rounded-2xl border border-[#F3E8E2] text-xs">
              <div>
                <span className="font-bold text-stone-500 block mb-1">Customer Shipping Address</span>
                <div className="font-bold text-[#211D1C]">{activeOrderModal.customer?.fullName}</div>
                <div>{activeOrderModal.customer?.streetAddress || (activeOrderModal.customer as any)?.address} {activeOrderModal.customer?.apartment}</div>
                <div>{activeOrderModal.customer?.city}, {activeOrderModal.customer?.state} - {activeOrderModal.customer?.pincode}</div>
                <div className="mt-1 text-stone-600">Phone: {activeOrderModal.customer?.phone}</div>
              </div>

              <div>
                <span className="font-bold text-stone-500 block mb-1">Order Summary</span>
                <div>Total Amount: <strong className="text-[#FF2E93]">₹{activeOrderModal.totalAmount}</strong></div>
                <div>Payment Method: {activeOrderModal.paymentMethod}</div>
                <div>Status: <strong className="text-emerald-700">{activeOrderModal.status}</strong></div>
                <div>Tracking AWB: {activeOrderModal.trackingNumber || 'Pending'}</div>
              </div>
            </div>

            {/* Items List */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700 mb-2">Order Items</h4>
              <div className="space-y-2">
                {(activeOrderModal.items || []).map((it: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[#F3E8E2] text-xs bg-white">
                    <div>
                      <div className="font-bold text-[#211D1C]">{it.name}</div>
                      {it.customText && <div className="text-[10px] text-[#FF2E93]">Engraving: "{it.customText}"</div>}
                      {it.selectedBrand && <div className="text-[10px] text-stone-500">Phone: {it.selectedBrand} {it.selectedModel}</div>}
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₹{it.price} × {it.quantity || 1}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-[#F3E8E2] flex items-center justify-between gap-3">
              <button
                onClick={() => handleSendProof(activeOrderModal)}
                className="px-4 py-2 rounded-full border border-[#FF2E93] text-[#FF2E93] hover:bg-[#FFF0F5] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Send Digital Proof Email</span>
              </button>

              <a
                href={`/api/invoice?orderId=${activeOrderModal.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-full bg-[#211D1C] text-white hover:bg-[#FF2E93] font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print GST Invoice</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
