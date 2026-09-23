import { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  CheckCircle2, 
  FileCheck, 
  Clock, 
  Vote, 
  ShieldCheck, 
  Cpu, 
  Download, 
  TrendingUp,
  MapPin,
  Users
} from 'lucide-react';
import { BOARD_RESOLUTIONS, BOARD_MEETINGS, INITIAL_CEO_METRICS } from '../../data/mockFintechData';
import { useCurrency } from '../../context/CurrencyContext';

interface BoardDashboardProps {
  onOpenReportExport: () => void;
}

export const BoardDashboard = ({ onOpenReportExport }: BoardDashboardProps) => {
  const { formatUsd, currency } = useCurrency();
  const [activeTab, setActiveTab] = useState<'governance' | 'risk_compliance' | 'tech_oversight'>('governance');
  const [resolutions, setResolutions] = useState(BOARD_RESOLUTIONS);

  const handleCastVote = (id: string, isFor: boolean) => {
    setResolutions((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            votesFor: isFor ? r.votesFor + 1 : r.votesFor,
            votesAgainst: !isFor ? r.votesAgainst + 1 : r.votesAgainst,
          };
        }
        return r;
      })
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
              Board Governance Portal
            </span>
            <span className="text-xs text-slate-400">admin.ifuturewallet.com • Confidential Trustee View</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Board of Directors Command & Oversight
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Fiduciary oversight, board resolutions, regulatory filings, capital allocations, and technology roadmap.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenReportExport}
            className="px-3.5 py-2 text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-500/10 transition-colors"
          >
            <Download className="w-4 h-4" />
            Investor Package
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-medium gap-2">
        <button
          onClick={() => setActiveTab('governance')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'governance'
              ? 'border-indigo-400 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Corporate Governance & Resolutions
        </button>
        <button
          onClick={() => setActiveTab('risk_compliance')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'risk_compliance'
              ? 'border-indigo-400 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Risk & Compliance Oversight
        </button>
        <button
          onClick={() => setActiveTab('tech_oversight')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'tech_oversight'
              ? 'border-indigo-400 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Technology Roadmap & Cyber
        </button>
      </div>

      {/* TAB 1: CORPORATE GOVERNANCE */}
      {activeTab === 'governance' && (
        <div className="space-y-6">
          {/* Key Fiduciary Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block">Total Capital Processed</span>
              <span className="text-xl font-bold text-white font-mono mt-1 block transition-all duration-300">
                {formatUsd(INITIAL_CEO_METRICS.transactionValue, { decimals: 1, showCurrencyCode: true })}
              </span>
              <span className="text-[11px] text-emerald-400 mt-1 block">+28.4% above annual plan</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block">Ecosystem Reserves</span>
              <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block transition-all duration-300">
                {formatUsd(612400000, { decimals: 1 })} Liquid Buffer
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Held in AAA/AA Rated Commercial Banks ({currency})</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block">Board Resolutions Active</span>
              <span className="text-xl font-bold text-indigo-300 font-mono mt-1 block">
                4 Enacted (100% Quorum)
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Next Assembly: Sep 26, 2026</span>
            </div>
          </div>

          {/* Resolutions Voting Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <Vote className="w-4 h-4 text-indigo-400" />
                  Active Board Resolutions & Voting Ledger
                </h3>
                <p className="text-xs text-slate-400">Formal motions submitted for Trustee ratification</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-medium">Code</th>
                    <th className="pb-3 font-medium">Resolution Title</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Sponsor</th>
                    <th className="pb-3 font-medium">Votes</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Trustee Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {resolutions.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="py-3 font-mono text-indigo-300">{res.code}</td>
                      <td className="py-3 font-medium text-slate-200 max-w-xs">{res.title}</td>
                      <td className="py-3 text-slate-400">{res.category}</td>
                      <td className="py-3 text-slate-300">{res.sponsor}</td>
                      <td className="py-3 font-mono text-slate-300">
                        <span className="text-emerald-400 font-semibold">{res.votesFor} For</span> /{' '}
                        <span className="text-rose-400">{res.votesAgainst} Ag</span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                          {res.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCastVote(res.id, true)}
                            className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium"
                          >
                            + Vote Aye
                          </button>
                          <button
                            onClick={() => handleCastVote(res.id, false)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-400 font-medium"
                          >
                            Nay
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Board Meetings Roster */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Scheduled Board Meetings & Agendas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BOARD_MEETINGS.map((bm) => (
                <div key={bm.id} className="p-4 rounded-xl bg-slate-950 border border-slate-850">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        bm.status === 'Upcoming'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {bm.status}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {bm.date} • {bm.time}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-slate-200">{bm.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {bm.location}
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-slate-850">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">Agenda Items:</span>
                    <ul className="space-y-1">
                      {bm.agendaItems.map((item, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RISK & COMPLIANCE */}
      {activeTab === 'risk_compliance' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Board Risk & Compliance Oversight Briefing
            </h3>
            <span className="text-xs text-slate-400">Quarterly Central Bank & FIU Submission Status</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-400 block font-medium">AML & Sanctions Compliance</span>
              <span className="text-base font-bold text-emerald-400 mt-1 block">100% Filing Conformance</span>
              <p className="text-slate-400 mt-1">Zero pending FIU query notices. Automated sanctions checks integrated with OFAC/PEP watchlists.</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-400 block font-medium">Independent PwC Audit Status</span>
              <span className="text-base font-bold text-cyan-400 mt-1 block">Unqualified Clean Opinion</span>
              <p className="text-slate-400 mt-1">Full statutory ledger audit completed with zero material misstatements noted.</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-400 block font-medium">Capital Adequacy & Reserve Buffer</span>
              <span className="text-base font-bold text-indigo-400 mt-1 block">24.8% Liquidity Ratio</span>
              <p className="text-slate-400 mt-1">Well exceeding the mandatory regulatory threshold of 15.0% for payment service institutions.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TECHNOLOGY OVERSIGHT */}
      {activeTab === 'tech_oversight' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Technology Oversight & Multi-Year Strategic Roadmap
            </h3>
            <span className="text-xs text-emerald-400 font-mono">System Reliability: 99.994%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <h4 className="font-semibold text-slate-200 mb-1">Core Switch v4.2 Rollout (Q4 2026)</h4>
              <p className="text-slate-400 leading-relaxed">
                Upgrades transaction throughput to 50,000 TPS across microservices with sub-10ms inter-bank settlement.
              </p>
              <div className="mt-3 flex items-center justify-between text-slate-400">
                <span>Progress: 75% Complete</span>
                <span className="text-emerald-400 font-semibold">On Track</span>
              </div>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <h4 className="font-semibold text-slate-200 mb-1">Zero-Trust PCI-DSS v4.0 Certification</h4>
              <p className="text-slate-400 leading-relaxed">
                Hardware token MFA and tokenized pan-African payment routing verified across AWS and hybrid on-prem clusters.
              </p>
              <div className="mt-3 flex items-center justify-between text-slate-400">
                <span>Certified By: Trustwave Global</span>
                <span className="text-emerald-400 font-semibold">Valid Thru 2027</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
