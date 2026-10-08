import React, { useState } from 'react';
import { Award, Users, DollarSign, Download, CheckCircle2, Link as LinkIcon } from 'lucide-react';

export const AdminAffiliatesTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-3xl border border-[#F3E8E2] shadow-xs flex items-center justify-between">
        <div className="font-serif text-base font-bold text-[#211D1C] flex items-center gap-2">
          <Award className="w-4 h-4 text-[#FF2E93]" />
          <span>Creator Club & Referral Affiliate Management</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#F3E8E2] p-6 text-xs text-stone-600 space-y-3">
        <div className="font-bold text-[#211D1C]">Referral Cookie & Commission System</div>
        <p>
          Visiting any page with <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono">?ref=CODE</code> sets a 30-day tracking cookie. At checkout, commissions are attributed to active creators on the discounted order subtotal. Self-referrals (same account or phone) are automatically blocked.
        </p>
      </div>
    </div>
  );
};
