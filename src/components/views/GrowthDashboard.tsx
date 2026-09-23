import { useState } from 'react';
import { 
  Rocket, 
  Share2, 
  TrendingUp, 
  Target, 
  Users, 
  Award, 
  Gift, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { MARKETING_CAMPAIGNS, INITIAL_CEO_METRICS } from '../../data/mockFintechData';

export const GrowthDashboard = () => {
  const [campaigns] = useState(MARKETING_CAMPAIGNS);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
              Growth & User Acquisition Command
            </span>
            <span className="text-xs text-slate-400">admin.ifuturewallet.com • Organic & Viral Engines</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Referral Velocity, Growth Marketing & Retention Cohorts
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Managing user viral coefficients (K-factor), agent referral bonuses, campus ambassador campaigns, and 30-day retention funnels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Viral K-Factor: 1.42 (Self-Sustaining)
          </span>
        </div>
      </div>

      {/* Growth Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">Growth Rate (MoM)</span>
          <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">
            +{INITIAL_CEO_METRICS.growthRate}%
          </span>
          <span className="text-[11px] text-slate-500">Accelerating quarter</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">DAU / MAU Ratio</span>
          <span className="text-xl font-bold text-indigo-300 font-mono mt-1 block">70.8%</span>
          <span className="text-[11px] text-emerald-400">World-class engagement</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">CAC (Blended)</span>
          <span className="text-xl font-bold text-cyan-400 font-mono mt-1 block">$0.82 USD</span>
          <span className="text-[11px] text-slate-500">Industry avg: $4.50</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">30-Day Retention</span>
          <span className="text-xl font-bold text-white font-mono mt-1 block">84.6%</span>
          <span className="text-[11px] text-emerald-400">+4.2% vs previous cohort</span>
        </div>
      </div>

      {/* Growth Campaigns Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-indigo-400" />
              Active Marketing & Field Acquisition Campaigns
            </h3>
            <p className="text-xs text-slate-400">Performance attribution, budgets allocated, and customer conversion rates</p>
          </div>
          <button className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-xs font-semibold transition-colors">
            + Launch New Campaign
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-medium">Campaign Name</th>
                <th className="pb-3 font-medium">Channel</th>
                <th className="pb-3 font-medium">Spend / Budget</th>
                <th className="pb-3 font-medium">New Users Acquired</th>
                <th className="pb-3 font-medium">Conversion Rate</th>
                <th className="pb-3 font-medium">ROI</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-3 font-semibold text-slate-200">{camp.name}</td>
                  <td className="py-3 text-slate-400">{camp.channel}</td>
                  <td className="py-3 font-mono text-slate-300">
                    ${camp.spend.toLocaleString()} / ${(camp.spend * 1.5).toLocaleString()}
                  </td>
                  <td className="py-3 font-mono text-emerald-400 font-bold">
                    +{camp.newAcquisitions.toLocaleString()}
                  </td>
                  <td className="py-3 font-mono text-cyan-400">{camp.conversionRate}%</td>
                  <td className="py-3 font-mono text-amber-400 font-semibold">${camp.cac} CAC</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {camp.status}
                    </span>
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
