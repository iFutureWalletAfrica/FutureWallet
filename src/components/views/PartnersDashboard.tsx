import { useState } from 'react';
import { Building, Zap, ShoppingBag, Landmark, CheckCircle2, ArrowUpRight, DollarSign, Filter } from 'lucide-react';
import { ECOSYSTEM_PARTNERS } from '../../data/mockFintechData';
import { EcosystemPartner } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';

export const PartnersDashboard = () => {
  const { currency, formatUsd } = useCurrency();
  const [partnerTypeFilter, setPartnerTypeFilter] = useState<string>('All');
  const [partners, setPartners] = useState<EcosystemPartner[]>(ECOSYSTEM_PARTNERS);

  const handleSettlePartner = (partnerId: string) => {
    setPartners((prev) =>
      prev.map((p) =>
        p.id === partnerId ? { ...p, settlementStatus: 'Settled', outstandingBalance: 0 } : p
      )
    );
  };

  const filteredPartners = partners.filter((p) => {
    if (partnerTypeFilter === 'All') return true;
    return p.category === partnerTypeFilter;
  });

  const totalOutstanding = partners.reduce((sum, p) => sum + p.outstandingBalance, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
              Ecosystem Alliance & Settlement Hub
            </span>
            <span className="text-xs text-slate-400">admin.ifuturewallet.com • Bilateral Clearing</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Banking Partners, PSBs, MFBs, Utility Aggregators & Merchants
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Clearing portal for integrated banking institutions, biller gateways (Electricity, Cable, Airtime), and e-commerce merchants.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-right">
            <span className="text-[10px] text-slate-400 block">Pending Clearing Batch</span>
            <span className="text-sm font-bold font-mono text-amber-400 transition-all duration-300">
              {formatUsd(totalOutstanding, { compact: false, decimals: 0, showCurrencyCode: true })}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
        {['All', 'Commercial Bank', 'PSB', 'MFB', 'Utility Biller', 'Retail Merchant'].map((cat) => (
          <button
            key={cat}
            onClick={() => setPartnerTypeFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              partnerTypeFilter === cat
                ? 'bg-indigo-500 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Partner Matrix Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-4">
          <Building className="w-4 h-4 text-indigo-400" />
          Integrated Partner Clearing & Commission Ledger
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-medium">Partner Entity</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Agreement Scope</th>
                <th className="pb-3 font-medium">Volume (30d)</th>
                <th className="pb-3 font-medium">Commission Rate</th>
                <th className="pb-3 font-medium">Pending Settlement ({currency})</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Settlement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredPartners.map((partner) => (
                <tr key={partner.id} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-3 font-semibold text-slate-200">{partner.name}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                      {partner.category}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{partner.integrationType}</td>
                  <td className="py-3 font-mono text-slate-200 transition-all duration-300">{formatUsd(partner.volumeMonth, { decimals: 1 })}</td>
                  <td className="py-3 font-mono text-cyan-400">{partner.commissionRate}</td>
                  <td className="py-3 font-mono font-bold text-amber-400 transition-all duration-300">
                    {formatUsd(partner.outstandingBalance, { compact: false, decimals: 0 })}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        partner.settlementStatus === 'Settled'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {partner.settlementStatus}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {partner.outstandingBalance > 0 ? (
                      <button
                        onClick={() => handleSettlePartner(partner.id)}
                        className="px-2.5 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold"
                      >
                        Authorize Settlement
                      </button>
                    ) : (
                      <span className="text-emerald-400 flex items-center justify-end gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
