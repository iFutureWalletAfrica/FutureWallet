import { useState } from 'react';
import { Scale, FileText, Award, Shield, CheckCircle2, AlertCircle, Download, ExternalLink } from 'lucide-react';
import { LEGAL_CONTRACTS, IP_ASSETS } from '../../data/mockFintechData';

export const LegalDashboard = () => {
  const [activeTab, setActiveTab] = useState<'contracts' | 'ip'>('contracts');
  const [contracts] = useState(LEGAL_CONTRACTS);
  const [ipAssets] = useState(IP_ASSETS);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
              General Counsel & Legal Portal
            </span>
            <span className="text-xs text-slate-400">admin.ifuturewallet.com • Corporate Legal Repository</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Contract Repository & Intellectual Property Registry
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Governance of master bank settlement deeds, vendor SLAs, API commercial contracts, trademarks, and switch software copyrights.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4 text-emerald-400" />
            IP Deeds Archive
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-medium gap-2">
        <button
          onClick={() => setActiveTab('contracts')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'contracts'
              ? 'border-indigo-400 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Enterprise Contract Management ({contracts.length})
        </button>
        <button
          onClick={() => setActiveTab('ip')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'ip'
              ? 'border-indigo-400 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          Intellectual Property & Trademarks ({ipAssets.length})
        </button>
      </div>

      {/* TAB 1: CONTRACTS */}
      {activeTab === 'contracts' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-400" />
              Active Institutional Contracts & Bilateral Agreements
            </h3>
            <span className="text-xs text-slate-400">All agreements countersigned & legally binding</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-medium">Contract Title</th>
                  <th className="pb-3 font-medium">Agreement Type</th>
                  <th className="pb-3 font-medium">Counterparty Institution</th>
                  <th className="pb-3 font-medium">Signed Date</th>
                  <th className="pb-3 font-medium">Expiry / Renewal</th>
                  <th className="pb-3 font-medium">Annual Value</th>
                  <th className="pb-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {contracts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3 font-semibold text-slate-200">{c.title}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                        {c.category}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300">{c.counterparty}</td>
                    <td className="py-3 text-slate-400">{c.signedDate}</td>
                    <td className="py-3 font-mono text-cyan-400">{c.expiryDate}</td>
                    <td className="py-3 font-mono text-emerald-400 font-semibold">{c.value}</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INTELLECTUAL PROPERTY */}
      {activeTab === 'ip' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              iFutureWallet™ & IFW Coin Trademarks, Patents & Copyrights
            </h3>
            <span className="text-xs text-slate-400">Global WIPO & National Trademark Registries</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ipAssets.map((ip) => (
              <div key={ip.id} className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                      {ip.type}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">
                      {ip.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">{ip.name}</h4>
                  <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>Registration Number:</span>
                      <strong className="font-mono text-slate-200">{ip.registrationNumber}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Jurisdiction:</span>
                      <span className="text-slate-300">{ip.jurisdiction}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Renewal:</span>
                      <span className="font-mono text-cyan-400">{ip.renewalDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
