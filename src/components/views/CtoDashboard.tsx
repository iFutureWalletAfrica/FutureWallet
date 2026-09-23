import { useState } from 'react';
import { 
  Terminal, 
  Server, 
  Smartphone, 
  Code, 
  Key, 
  Activity, 
  Globe, 
  Play, 
  ShieldCheck, 
  RefreshCw, 
  Layers, 
  Check, 
  Copy, 
  Cpu, 
  Database,
  ArrowUpRight,
  UserCog
} from 'lucide-react';
import { IFutureWalletLogo } from '../common/IFutureWalletLogo';
import { 
  SERVER_NODES, 
  MOBILE_APPS, 
  DEVELOPERS_LIST, 
  API_CLIENTS, 
  API_ENDPOINTS 
} from '../../data/mockFintechData';

interface CtoDashboardProps {
  onOpenApiTester: (product?: any) => void;
  onOpenAccountAction?: (initialAccountId?: string) => void;
}

export const CtoDashboard = ({ onOpenApiTester, onOpenAccountAction }: CtoDashboardProps) => {
  const [activeSubTab, setActiveSubTab] = useState<'system' | 'mobile' | 'developers' | 'api_portal'>('system');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [clients, setClients] = useState(API_CLIENTS);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleClientStatus = (clientId: string) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? { ...c, status: c.status === 'Active' ? 'Restricted' : 'Active' }
          : c
      )
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner with Official Logo & CTO Identity */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/50 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <IFutureWalletLogo size="lg" variant="icon" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
                CTO Technology Command Center
              </span>
              <span className="text-xs text-slate-400">admin.ifuturewallet.com • Core Switch v4.18.2</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Mansur Ismail Gotomo</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-normal">
                Chief Technology Officer
              </span>
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Real-time server APM metrics, database replication, mobile release rollouts, and third-party developer integration portal.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenAccountAction && (
            <button
              onClick={() => onOpenAccountAction()}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/30 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <UserCog className="w-3.5 h-3.5 text-emerald-400" />
              <span>Account Actions</span>
            </button>
          )}
          <button
            onClick={() => onOpenApiTester('Wallet API')}
            className="px-4 py-2 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg flex items-center gap-2 shadow-lg shadow-cyan-500/10 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            Launch API Sandbox
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-medium gap-2">
        <button
          onClick={() => setActiveSubTab('system')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeSubTab === 'system'
              ? 'border-cyan-400 text-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server className="w-4 h-4" />
          System Monitoring & Cloud Infrastructure
        </button>
        <button
          onClick={() => setActiveSubTab('mobile')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeSubTab === 'mobile'
              ? 'border-cyan-400 text-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Mobile Application Management
        </button>
        <button
          onClick={() => setActiveSubTab('developers')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeSubTab === 'developers'
              ? 'border-cyan-400 text-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-4 h-4" />
          Internal Developer Management
        </button>
        <button
          onClick={() => setActiveSubTab('api_portal')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeSubTab === 'api_portal'
              ? 'border-cyan-400 text-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          External API Management Center
        </button>
      </div>

      {/* SUBTAB 1: SYSTEM MONITORING */}
      {activeSubTab === 'system' && (
        <div className="space-y-6">
          {/* Hardware & APM Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Server Health</span>
              <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">100% Operational</span>
              <span className="text-[11px] text-slate-500">6 Global Clusters Healthy</span>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Average Latency</span>
              <span className="text-xl font-bold text-cyan-400 font-mono mt-1 block">14.2 ms</span>
              <span className="text-[11px] text-emerald-400">Under 25ms SLA</span>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Database Replication</span>
              <span className="text-xl font-bold text-white font-mono mt-1 block">0.0s Lag</span>
              <span className="text-[11px] text-slate-500">Multi-region Master-Slave</span>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">API Throughput</span>
              <span className="text-xl font-bold text-indigo-300 font-mono mt-1 block">18,400 Req/s</span>
              <span className="text-[11px] text-slate-500">Peak Capacity: 120,000 Req/s</span>
            </div>
          </div>

          {/* Server Nodes Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-3">
              <Server className="w-4 h-4 text-cyan-400" />
              Production Cluster & Infrastructure Health
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-medium">Node / Instance</th>
                    <th className="pb-3 font-medium">Region</th>
                    <th className="pb-3 font-medium">CPU</th>
                    <th className="pb-3 font-medium">Memory</th>
                    <th className="pb-3 font-medium">Latency</th>
                    <th className="pb-3 font-medium">Uptime</th>
                    <th className="pb-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {SERVER_NODES.map((node) => (
                    <tr key={node.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="py-3 font-mono font-medium text-slate-200">{node.name}</td>
                      <td className="py-3 text-slate-400">{node.region}</td>
                      <td className="py-3 font-mono text-slate-300">
                        <div className="flex items-center gap-2">
                          <span>{node.cpuUsage}%</span>
                          <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-cyan-400 h-1.5 rounded-full"
                              style={{ width: `${node.cpuUsage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-mono text-slate-300">{node.memoryUsage}%</td>
                      <td className="py-3 font-mono text-emerald-400">{node.latencyMs}ms</td>
                      <td className="py-3 font-mono text-slate-400">{node.uptime}</td>
                      <td className="py-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {node.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: MOBILE APPLICATION MANAGEMENT */}
      {activeSubTab === 'mobile' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOBILE_APPS.map((app) => (
              <div key={app.platform} className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100">iFutureWallet™ for {app.platform}</h3>
                      <p className="text-xs text-slate-400">Current Version: {app.version}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {app.releaseStatus}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-850 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Active Installs</span>
                    <span className="text-sm font-bold text-white font-mono mt-0.5 block">
                      {(app.activeInstalls / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Adoption Rate</span>
                    <span className="text-sm font-bold text-cyan-400 font-mono mt-0.5 block">
                      {app.adoptionRate}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Crash-Free Rate</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">
                      {app.crashFreeRate}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Last Updated: {app.lastUpdated}</span>
                  <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-medium transition-colors">
                    Manage Staged Rollout
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: INTERNAL DEVELOPER MANAGEMENT */}
      {activeSubTab === 'developers' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                Internal Engineering Team, Access & Deployments
              </h3>
              <p className="text-xs text-slate-400">Role-based privileges, CI/CD code sign-off, and Git activities</p>
            </div>
            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-medium transition-colors">
              + Invite Developer
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-medium">Engineer</th>
                  <th className="pb-3 font-medium">Subsystem Team</th>
                  <th className="pb-3 font-medium">Access Clearance</th>
                  <th className="pb-3 font-medium">Last Deployment</th>
                  <th className="pb-3 font-medium">Commits (7d)</th>
                  <th className="pb-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {DEVELOPERS_LIST.map((dev) => (
                  <tr key={dev.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3">
                      <span className="font-medium text-slate-200 block">{dev.name}</span>
                      <span className="text-slate-500 text-[11px]">{dev.email}</span>
                    </td>
                    <td className="py-3 text-slate-300">{dev.team}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-cyan-300 border border-slate-700">
                        {dev.accessRole}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{dev.lastDeployment}</td>
                    <td className="py-3 font-mono text-emerald-400 font-semibold">{dev.commitsThisWeek}</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {dev.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 4: EXTERNAL API MANAGEMENT CENTER */}
      {activeSubTab === 'api_portal' && (
        <div className="space-y-6">
          {/* API Products Showcase */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  iFutureWallet™ Core API Products Suite
                </h3>
                <p className="text-xs text-slate-400">Available programmatic endpoints for integrated banks, fintechs, and merchants</p>
              </div>
              <button
                onClick={() => onOpenApiTester()}
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                Interactive API Tester
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Wallet API */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 hover:border-slate-700 transition-colors flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    Wallet API
                  </span>
                  <h4 className="text-sm font-medium text-slate-200 mt-2">Create Wallet, Balance, Transfers</h4>
                  <p className="text-xs text-slate-400 mt-1">Instant sub-ledger generation and multi-currency programmatic wallets.</p>
                </div>
                <button
                  onClick={() => onOpenApiTester('Wallet API')}
                  className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 font-medium text-left flex items-center gap-1"
                >
                  Test Wallet Endpoints →
                </button>
              </div>

              {/* Payment API */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 hover:border-slate-700 transition-colors flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    Payment API
                  </span>
                  <h4 className="text-sm font-medium text-slate-200 mt-2">Payment Processing & Verification</h4>
                  <p className="text-xs text-slate-400 mt-1">Multi-rail card, USSD, and bank transfer acquiring with instant webhook settlement.</p>
                </div>
                <button
                  onClick={() => onOpenApiTester('Payment API')}
                  className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 font-medium text-left flex items-center gap-1"
                >
                  Test Payment Endpoints →
                </button>
              </div>

              {/* Virtual Account API */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 hover:border-slate-700 transition-colors flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                    Virtual Account API
                  </span>
                  <h4 className="text-sm font-medium text-slate-200 mt-2">Dynamic NUBANs & Statements</h4>
                  <p className="text-xs text-slate-400 mt-1">Dedicated static and dynamic bank accounts linked with automated treasury sweeps.</p>
                </div>
                <button
                  onClick={() => onOpenApiTester('Virtual Account API')}
                  className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-medium text-left flex items-center gap-1"
                >
                  Test Account Endpoints →
                </button>
              </div>

              {/* KYC API */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 hover:border-slate-700 transition-colors flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    KYC API
                  </span>
                  <h4 className="text-sm font-medium text-slate-200 mt-2">BVN & NIN Verification</h4>
                  <p className="text-xs text-slate-400 mt-1">Direct NIBSS & NIMC database match with facial biometrics and watchlist screening.</p>
                </div>
                <button
                  onClick={() => onOpenApiTester('KYC API')}
                  className="mt-3 text-xs text-amber-400 hover:text-amber-300 font-medium text-left flex items-center gap-1"
                >
                  Test KYC Endpoints →
                </button>
              </div>
            </div>
          </div>

          {/* External Developer Clients Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-3">
              <Key className="w-4 h-4 text-cyan-400" />
              Registered External Enterprise Developer Accounts & Keys
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-medium">Enterprise Company</th>
                    <th className="pb-3 font-medium">Tier & Env</th>
                    <th className="pb-3 font-medium">Public Key</th>
                    <th className="pb-3 font-medium">Volume (Daily)</th>
                    <th className="pb-3 font-medium">Monthly Rev</th>
                    <th className="pb-3 font-medium">Whitelisted IPs</th>
                    <th className="pb-3 font-medium text-right">Status / Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {clients.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="py-3">
                        <span className="font-semibold text-slate-200 block">{c.companyName}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{c.secretKeyMasked}</span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 mr-1.5">
                          {c.tier}
                        </span>
                        <span className="text-cyan-400 font-mono text-[11px]">{c.env}</span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => copyToClipboard(c.apiKey, c.id)}
                          className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px] hover:text-cyan-400 transition-colors"
                        >
                          <span>{c.apiKey.slice(0, 16)}...</span>
                          {copiedKey === c.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 font-mono text-slate-300">
                        {c.dailyRequests.toLocaleString()} / day
                      </td>
                      <td className="py-3 font-mono text-emerald-400 font-semibold">
                        ${c.monthlyRevenue.toLocaleString()}
                      </td>
                      <td className="py-3 font-mono text-slate-400 text-[11px]">
                        {c.whitelistedIps.join(', ')}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => toggleClientStatus(c.id)}
                          className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${
                            c.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-rose-500/20 hover:text-rose-300'
                              : 'bg-rose-500/10 text-rose-400 hover:bg-emerald-500/20 hover:text-emerald-300'
                          }`}
                        >
                          {c.status === 'Active' ? 'Active (Click to Restrict)' : 'Restricted (Re-enable)'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
