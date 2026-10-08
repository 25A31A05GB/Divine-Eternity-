import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DollarSign,
  FileText,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
} from 'lucide-react';

interface ReturnRequestRecord {
  id: string;
  order_id: string;
  phone: string;
  type: 'cancel' | 'replace' | 'refund';
  reason: string;
  details?: string;
  photo_urls?: string[];
  status: string;
  admin_note?: string;
  refund_amount?: number;
  refund_reference?: string;
  created_at: string;
}

export const AdminReturnsTab: React.FC = () => {
  const [requests, setRequests] = useState<ReturnRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<ReturnRequestRecord | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundRef, setRefundRef] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const fetchReturnRequests = async () => {
    setLoading(true);
    try {
      const session = supabase ? (await supabase.auth.getSession()).data.session : null;
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      const res = await fetch('/api/return-request', { method: 'GET', headers });
      const data = await res.json();
      if (data.requests) setRequests(data.requests);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnRequests();
  }, []);

  const handleUpdateStatus = async (reqRecord: ReturnRequestRecord, newStatus: string) => {
    try {
      const session = supabase ? (await supabase.auth.getSession()).data.session : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      const res = await fetch('/api/return-request', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          id: reqRecord.id,
          status: newStatus,
          admin_note: adminNote || undefined,
          refund_amount: refundAmount || undefined,
          refund_reference: refundRef || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update request');
      setMessage(`Updated request #${reqRecord.id.slice(-6)} to "${newStatus}"`);
      setActiveModal(null);
      fetchReturnRequests();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-3xl border border-[#F3E8E2] shadow-xs flex items-center justify-between">
        <div className="font-serif text-base font-bold text-[#211D1C] flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-[#FF2E93]" />
          <span>Cancellations & Return Requests</span>
        </div>
        <button
          onClick={fetchReturnRequests}
          className="px-3 py-1.5 rounded-full border border-[#E7E2DA] hover:border-[#FF2E93] text-xs font-bold text-stone-700 transition-all cursor-pointer"
        >
          Refresh Requests
        </button>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-emerald-700 hover:text-black">✕</button>
        </div>
      )}

      {/* Requests Table */}
      <div className="bg-white rounded-3xl border border-[#F3E8E2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FFFDF8] border-b border-[#F3E8E2] text-[11px] font-bold uppercase text-stone-500 tracking-wider">
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Request Type</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8ECE5]">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500 font-serif">
                    No active return or cancellation requests.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id} className="hover:bg-[#FFFDF8] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#211D1C]">
                      #{r.order_id}
                      <div className="text-[10px] text-stone-400 font-normal font-sans">
                        {new Date(r.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        r.type === 'cancel'
                          ? 'bg-rose-100 text-rose-800'
                          : r.type === 'replace'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {r.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-600">{r.phone}</td>
                    <td className="py-3.5 px-4 text-stone-700 max-w-xs truncate">{r.reason}</td>
                    <td className="py-3.5 px-4 font-bold text-stone-800">{r.status}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setActiveModal(r);
                          setAdminNote(r.admin_note || '');
                          setRefundAmount(r.refund_amount || 0);
                          setRefundRef(r.refund_reference || '');
                        }}
                        className="px-3 py-1 rounded-full bg-[#211D1C] hover:bg-[#FF2E93] text-white text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Review
                      </button>
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
