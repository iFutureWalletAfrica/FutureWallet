import { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  GitBranch, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  ShieldAlert, 
  Check, 
  ChevronRight,
  Sparkles,
  Phone
} from 'lucide-react';
import { 
  COMPLAINT_TICKETS, 
  REGIONAL_HIERARCHY_DATA, 
  BUSINESS_DEVELOPERS, 
  INITIAL_CEO_METRICS 
} from '../../data/mockFintechData';

export const CooDashboard = () => {
  const [activeSubTab, setActiveSubTab] = useState<'customers' | 'complaints' | 'bds' | 'regional'>('regional');
  const [tickets, setTickets] = useState(COMPLAINT_TICKETS);

  const resolveTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'Resolved' } : t))
    );
  };

  const reg = REGIONAL_HIERARCHY_DATA;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
              COO Operations Command
            </span>
            <span className="text-xs text-slate-400">admin.ifuturewallet.com • Field & Customer Operations</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Customer Operations, Support Desk & Regional Hierarchy
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Real-time management of 4.8M accounts, ticket SLAs, 480+ Business Developers, and the #1 North West Regional hierarchy.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> CSAT 4.86 / 5.0 (98.2% SLA)
          </span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-medium gap-2">
        <button
          onClick={() => setActiveSubTab('regional')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeSubTab === 'regional'
              ? 'border-emerald-400 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          North West Regional Hierarchy
        </button>
        <button
          onClick={() => setActiveSubTab('complaints')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeSubTab === 'complaints'
              ? 'border-emerald-400 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Complaint Management Desk
        </button>
        <button
          onClick={() => setActiveSubTab('bds')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeSubTab === 'bds'
              ? 'border-emerald-400 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          Business Developer Network
        </button>
        <button
          onClick={() => setActiveSubTab('customers')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeSubTab === 'customers'
              ? 'border-emerald-400 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Customer Accounts Telemetry
        </button>
      </div>

      {/* SUBTAB: REGIONAL MANAGEMENT (NORTH WEST TREE AS SPECIFIED IN PROMPT) */}
      {activeSubTab === 'regional' && (
        <div className="space-y-6">
          {/* North West KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Region Users</span>
              <span className="text-xl font-bold text-white font-mono mt-1 block">
                {(reg.totalUsers / 1000000).toFixed(2)}M
              </span>
              <span className="text-[11px] text-emerald-400">Target: {(reg.targetUsers / 1000000).toFixed(2)}M (105%)</span>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Revenue Generated</span>
              <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">
                ${(reg.revenueGenerated / 1000000).toFixed(2)}M
              </span>
              <span className="text-[11px] text-slate-400">YTD Northwest Zone</span>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Performance Ranking</span>
              <span className="text-xl font-bold text-amber-400 font-mono mt-1 block">#1 Nationally</span>
              <span className="text-[11px] text-slate-400">Top Performing Territory</span>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Active Field Agents</span>
              <span className="text-xl font-bold text-cyan-400 font-mono mt-1 block">362 BDs</span>
              <span className="text-[11px] text-slate-400">Across 4 Major Hubs</span>
            </div>
          </div>

          {/* Detailed Hierarchy Tree Visualizer */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-4">
              <GitBranch className="w-4 h-4 text-emerald-400" />
              Regional Management Tree (North West Region)
            </h3>

            {/* Level 1: Regional Manager */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-850">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                    RM
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-100">{reg.regionalManager.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                        Regional Manager
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>{reg.regionalManager.email}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" /> {reg.regionalManager.phone}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Jurisdiction:</span>
                  <span className="text-xs font-semibold text-slate-200">Kano, Kaduna, Katsina, Sokoto</span>
                </div>
              </div>

              {/* Level 2: Cluster Managers Grid */}
              <div className="mt-4 pt-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                  ├── Cluster Managers ({reg.clusterManagers.length} Clusters)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {reg.clusterManagers.map((cm, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-xs text-slate-200">{cm.name}</span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          {cm.targetAchievement}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-2">{cm.clusterArea}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-850">
                        <span>Active BDs: <strong className="text-slate-300 font-mono">{cm.activeDevs}</strong></span>
                        <span className="text-emerald-400 text-[10px] font-medium">Top Cluster</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Level 3: Business Developers Sample */}
              <div className="mt-5 pt-3 border-t border-slate-850">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                  └── Business Developers (Top Performers in Field Network)
                </span>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500">
                        <th className="pb-2 font-medium">BD Agent</th>
                        <th className="pb-2 font-medium">Agent Code</th>
                        <th className="pb-2 font-medium">Cluster Hub</th>
                        <th className="pb-2 font-medium">New Today</th>
                        <th className="pb-2 font-medium">Active Referrals</th>
                        <th className="pb-2 font-medium">Commission</th>
                        <th className="pb-2 font-medium text-right">Tier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {BUSINESS_DEVELOPERS.map((bd) => (
                        <tr key={bd.id} className="hover:bg-slate-900/50">
                          <td className="py-2.5 font-medium text-slate-200">{bd.name}</td>
                          <td className="py-2.5 font-mono text-cyan-400">{bd.code}</td>
                          <td className="py-2.5 text-slate-400">{bd.cluster}</td>
                          <td className="py-2.5 font-mono text-emerald-400 font-semibold">+{bd.newRegistrationsToday}</td>
                          <td className="py-2.5 font-mono text-slate-300">{bd.activeReferrals.toLocaleString()}</td>
                          <td className="py-2.5 font-mono text-slate-200">${bd.commissionEarned.toLocaleString()}</td>
                          <td className="py-2.5 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                              {bd.performanceTier}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: COMPLAINT MANAGEMENT DESK */}
      {activeSubTab === 'complaints' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Open Complaints</span>
              <span className="text-xl font-bold text-amber-400 font-mono mt-1 block">24</span>
              <span className="text-[11px] text-slate-500">Pending initial triage</span>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Resolved Today</span>
              <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">1,482</span>
              <span className="text-[11px] text-emerald-400">99.4% resolution rate</span>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Escalated Tickets</span>
              <span className="text-xl font-bold text-rose-400 font-mono mt-1 block">3</span>
              <span className="text-[11px] text-slate-500">Tier-3 tech review</span>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Avg Response Time</span>
              <span className="text-xl font-bold text-cyan-400 font-mono mt-1 block">8.4 mins</span>
              <span className="text-[11px] text-emerald-400">Target &lt; 15 mins</span>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-400 block">CSAT Rating</span>
              <span className="text-xl font-bold text-indigo-300 font-mono mt-1 block">4.86 / 5.0</span>
              <span className="text-[11px] text-slate-500">Based on 14,200 reviews</span>
            </div>
          </div>

          {/* Tickets Desk Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Customer Support Ticket Queue & SLA Monitor
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-medium">Ticket ID</th>
                    <th className="pb-3 font-medium">Customer / Account</th>
                    <th className="pb-3 font-medium">Dispute Category</th>
                    <th className="pb-3 font-medium">Priority</th>
                    <th className="pb-3 font-medium">Agent Assigned</th>
                    <th className="pb-3 font-medium">Response SLA</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="py-3 font-mono font-semibold text-slate-200">{t.id}</td>
                      <td className="py-3">
                        <span className="font-medium text-slate-200 block">{t.customerName}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{t.accountNumber}</span>
                      </td>
                      <td className="py-3 text-slate-300">{t.category}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            t.priority === 'Critical'
                              ? 'bg-rose-500/20 text-rose-300'
                              : t.priority === 'High'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300">{t.assignedTo}</td>
                      <td className="py-3 font-mono text-slate-400">{t.responseTimeMin}m ({t.createdAt})</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            t.status === 'Resolved'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : t.status === 'Escalated'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {t.status !== 'Resolved' ? (
                          <button
                            onClick={() => resolveTicket(t.id)}
                            className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-semibold"
                          >
                            Mark Resolved
                          </button>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: CUSTOMER OPERATIONS */}
      {activeSubTab === 'customers' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-400 block text-[11px]">Total Customers</span>
              <span className="text-xl font-bold text-white font-mono mt-1 block">4,829,340</span>
              <span className="text-[11px] text-emerald-400">+18,450 new registrations today</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-400 block text-[11px]">Active Customers</span>
              <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">3,418,920</span>
              <span className="text-[11px] text-slate-500">70.8% engagement ratio</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-400 block text-[11px]">Suspended Accounts</span>
              <span className="text-xl font-bold text-rose-400 font-mono mt-1 block">342</span>
              <span className="text-[11px] text-slate-500">Pending KYC documentation</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-400 block text-[11px]">Account Recovery Requests</span>
              <span className="text-xl font-bold text-amber-400 font-mono mt-1 block">89</span>
              <span className="text-[11px] text-slate-500">SIM swap & 2FA reset queue</span>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: BUSINESS DEVELOPERS */}
      {activeSubTab === 'bds' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-emerald-400" />
                Nationwide Referral Network Dashboard (480 Total Agents)
              </h3>
              <p className="text-xs text-slate-400">Field commission disbursement ledger and performance milestones</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-400 block">Total Active Business Developers</span>
              <span className="text-xl font-bold text-white font-mono mt-1 block">442 Active</span>
              <span className="text-slate-500 text-[11px]">92% daily field check-in</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-400 block">Commissions Disbursed This Month</span>
              <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">$3.42M USD</span>
              <span className="text-slate-500 text-[11px]">Paid via IFW Wallet instant rails</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-400 block">New Agent Registrations</span>
              <span className="text-xl font-bold text-cyan-400 font-mono mt-1 block">+32 Today</span>
              <span className="text-slate-500 text-[11px]">Vetted by Cluster Managers</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
