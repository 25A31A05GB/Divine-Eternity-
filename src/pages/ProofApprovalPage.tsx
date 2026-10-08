import React, { useState, useEffect } from 'react';
import { SEO } from '../components/common/SEO';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CheckCircle2, XCircle, Sparkles, Send, ShieldCheck, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProofApprovalPageProps {
  token: string;
}

export const ProofApprovalPage: React.FC<ProofApprovalPageProps> = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [orderItem, setOrderItem] = useState<any>(null);
  const [feedback, setFeedback] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!token || !isSupabaseConfigured() || !supabase) {
      setLoading(false);
      return;
    }

    const client = supabase;
    const fetchProofDetails = async () => {
      setLoading(true);
      try {
        const { data } = await client
          .from('orders')
          .select('*')
          .eq('id', token.toUpperCase())
          .maybeSingle();

        if (data) {
          setOrderItem(data);
        }
      } catch (e) {
        // continue
      } finally {
        setLoading(false);
      }
    };

    fetchProofDetails();
  }, [token]);

  const handleApproveProof = async () => {
    setStatusMessage(null);
    if (supabase && orderItem) {
      await supabase
        .from('orders')
        .update({ production_status: 'approved' })
        .eq('id', orderItem.id);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF2E93', '#FFD94A', '#211D1C'],
      });

      setIsSubmitted(true);
      setStatusMessage('Thank you! Your artisan design proof has been approved. Our craftsmen are proceeding with handcrafting!');
    }
  };

  const handleRequestChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    if (supabase && orderItem) {
      const newTimeline = Array.isArray(orderItem.timeline) ? orderItem.timeline : [];
      newTimeline.push({
        status: 'Changes Requested',
        date: new Date().toLocaleDateString('en-IN'),
        time: new Date().toLocaleTimeString('en-IN'),
        description: `Customer requested proof changes: "${feedback.trim()}"`,
      });

      await supabase
        .from('orders')
        .update({
          production_status: 'changes_requested',
          timeline: newTimeline,
        })
        .eq('id', orderItem.id);

      setIsSubmitted(true);
      setStatusMessage('Your change feedback has been sent to our atelier artists. We will update your proof shortly!');
    }
  };

  if (loading) {
    return <div className="py-20 text-center font-serif text-xs text-stone-500">Loading digital proof details…</div>;
  }

  return (
    <div className="py-12 sm:py-20 bg-[#FFFDF8] min-h-screen text-[#211D1C]">
      <SEO title="Digital Design Proof Approval — Divine’s Eternity" description="Review and approve your personalized keepsake digital proof." />

      <div className="max-w-2xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="bg-[#FFF0F5] text-[#FF2E93] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#FFD94A]" />
            <span>Digital Artisan Proof Approval</span>
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#211D1C]">
            Review Your Personalization Proof
          </h1>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Please review the digital preview prepared by our studio craftsmen for Order #{token.toUpperCase()}.
          </p>
        </div>

        {statusMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-bold text-center">
            {statusMessage}
          </div>
        )}

        {/* Proof Preview Box */}
        <div className="bg-white p-6 rounded-3xl border border-[#F3E8E2] shadow-sm space-y-6 text-center">
          <div className="aspect-square w-full max-w-sm mx-auto rounded-2xl bg-[#FAF7F2] border border-[#E7E2DA] flex items-center justify-center p-4 overflow-hidden relative shadow-inner">
            <div className="text-center space-y-2">
              <Sparkles className="w-10 h-10 text-[#FF2E93] mx-auto animate-pulse" />
              <div className="font-serif font-bold text-sm text-[#211D1C]">Personalized Engraving & Customization Proof</div>
              <div className="text-xs text-stone-500 italic">"Artisan Proof Draft #1"</div>
            </div>
          </div>

          {!isSubmitted && (
            <div className="space-y-4 pt-4 border-t border-[#F3E8E2]">
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleApproveProof}
                  className="bg-[#FF2E93] hover:bg-[#E01E7E] text-white font-bold text-xs py-3 px-8 rounded-full shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Design & Start Crafting</span>
                </button>
              </div>

              <form onSubmit={handleRequestChanges} className="max-w-md mx-auto space-y-2 pt-2 text-left">
                <label className="text-xs font-bold text-stone-700 block">Need minor changes?</label>
                <input
                  type="text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Describe desired modifications (e.g. font size, spelling fix)..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs outline-none focus:border-[#FF2E93]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#211D1C] text-white py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-stone-800"
                >
                  Request Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
