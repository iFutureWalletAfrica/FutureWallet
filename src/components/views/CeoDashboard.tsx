import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  ShieldAlert, 
  ArrowUpRight, 
  FileText, 
  Download, 
  Activity, 
  Wallet, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  UserCog,
  Gift,
  Snowflake,
  Ban,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { IFutureWalletLogo } from '../common/IFutureWalletLogo';
import { FinancialTransactionChart } from '../charts/FinancialTransactionChart';
import { useCurrency } from '../../context/CurrencyContext';
import { INITIAL_CEO_METRICS, EXECUTIVE_REPORTS } from '../../data/mockFintechData';

interface CeoDashboardProps {
  onOpenReportExport: (reportId?: string) => void;
  onNavigateToRole: (role: any) => void;
  onOpenAccountAction?: (initialAccountId?: string) => void;
}

export const CeoDashboard = ({ onOpenReportExport, onNavigateToRole, onOpenAccountAction }: CeoDashboardProps) => {
  const m = INITIAL_CEO_METRICS;
  const { formatUsd, currency } = useCurrency();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Welcome with Official Logo & CEO Name */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <IFutureWalletLogo size="lg" variant="icon" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                CEO Command Station
              </span>
              <span className="text-xs text-slate-400">admin.ifuturewallet.com</span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono">
                Root Clearance L5
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Sharahbil Muhammd Sani</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-normal">
                Chief Executive Officer
              </span>
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Real-time fintech telemetry spanning 4.8M+ users, high-frequency banking switches, Treasury reserves, and IFW Coin liquidity.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenAccountAction && (
            <button
              onClick={() => onOpenAccountAction()}
              className="px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <UserCog className="w-4 h-4" />
              <span>Manage Accounts & Rewards</span>
            </button>
          )}
          <button
            onClick={() => onOpenReportExport('rep-01')}
            className="px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Board Dossier</span>
          </button>
          <button
            onClick={() => onNavigateToRole('board')}
            className="px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg transition-colors"
          >
            Board Portal
          </button>
        </div>
      </div>

      {/* QUICK ACCOUNT ACTION DIRECT BAR */}
      {onOpenAccountAction && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Direct Account Governance & Discretionary Action
              </h3>
              <p className="text-[11px] text-slate-400">
                Execute executive overrides: Freeze, unfreeze, block, unblock, reward, or bonus any user account in real time.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenAccountAction()}
              className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Snowflake className="w-3.5 h-3.5" />
              <span>Freeze Account</span>
            </button>
            <button
              onClick={() => onOpenAccountAction()}
              className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Block Account</span>
            </button>
            <button
              onClick={() => onOpenAccountAction()}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Give Bonus / Reward</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 1: COMPANY PERFORMANCE GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Company Performance
          </h2>
          <span className="text-xs text-emerald-400 font-medium">Platform Growth: +{m.growthRate}% YoY</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Total Registered Users */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Total Registered Users</span>
              <Users className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {m.totalRegisteredUsers.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{m.newUsersToday.toLocaleString()} today</span>
            </div>
          </div>

          {/* Active Users / MAU */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Monthly Active Users (MAU)</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {(m.mau / 1000000).toFixed(2)}M
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
              <span className="text-cyan-400 font-medium">{((m.activeUsers / m.totalRegisteredUsers) * 100).toFixed(1)}%</span>
              <span>daily active ratio</span>
            </div>
          </div>

          {/* Transaction Volume & Value */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Transaction Value (Total)</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono transition-all duration-300">
              {formatUsd(m.transactionValue, { decimals: 1 })}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
              <span className="font-mono text-slate-300">{(m.transactionVolume / 1000000).toFixed(1)}M</span>
              <span>total processed switches</span>
            </div>
          </div>

          {/* Revenue & CSAT */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Revenue Generated</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono transition-all duration-300">
              {formatUsd(m.revenueGenerated, { decimals: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-semibold">CSAT {m.csatScore} / 5.0</span>
              <span className="text-slate-500">• 98% positive</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: FINANCIAL OVERVIEW */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Financial Overview & Net Position</h2>
              <p className="text-xs text-slate-400">Cross-bank liquidity, partner settlement distribution, and corporate treasury income ({currency})</p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> {m.settlementStatus}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
            <span className="text-[11px] text-slate-400 block">Total Wallet Balance</span>
            <span className="text-base font-bold text-white font-mono mt-0.5 block transition-all duration-300">{formatUsd(m.totalWalletBalance, { decimals: 1 })}</span>
            <span className="text-[10px] text-slate-500">Customer Funds</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
            <span className="text-[11px] text-slate-400 block">Money Inflow (24h)</span>
            <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block transition-all duration-300">+{formatUsd(m.totalMoneyInflow, { decimals: 1 })}</span>
            <span className="text-[10px] text-emerald-500/80">99.98% verified</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
            <span className="text-[11px] text-slate-400 block">Money Outflow</span>
            <span className="text-base font-bold text-slate-200 font-mono mt-0.5 block transition-all duration-300">-{formatUsd(m.totalMoneyOutflow, { decimals: 1 })}</span>
            <span className="text-[10px] text-slate-500">Disbursements</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
            <span className="text-[11px] text-slate-400 block">Settlement Status</span>
            <span className="text-xs font-bold text-emerald-400 mt-1 block">T+0 Real-Time</span>
            <span className="text-[10px] text-slate-500">8 Banks Synced</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
            <span className="text-[11px] text-slate-400 block">Partner Rev Share</span>
            <span className="text-base font-bold text-cyan-400 font-mono mt-0.5 block transition-all duration-300">{formatUsd(m.partnerRevenueShare, { decimals: 2 })}</span>
            <span className="text-[10px] text-slate-500">PSB / Commercial</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
            <span className="text-[11px] text-slate-400 block">Commission Paid</span>
            <span className="text-base font-bold text-amber-400 font-mono mt-0.5 block transition-all duration-300">{formatUsd(m.commissionPaid, { decimals: 2 })}</span>
            <span className="text-[10px] text-slate-500">Agents & BDs</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 col-span-2 lg:col-span-1">
            <span className="text-[11px] text-slate-400 block">Company Net Income</span>
            <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block transition-all duration-300">{formatUsd(m.companyIncome, { decimals: 2 })}</span>
            <span className="text-[10px] text-emerald-500/80">EBITDA margin 70.7%</span>
          </div>
        </div>
      </div>

      {/* SECTION 2B: DYNAMIC FINANCIAL TRANSACTION CHART */}
      <FinancialTransactionChart
        title="CEO Macro Settlement & Financial Transaction Velocity"
        subtitle="Real-time switch inflow, interbank debit clearance, and liquidity headroom with instant currency conversion"
      />

      {/* SECTION 3: RISK OVERVIEW */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Risk & Threat Matrix Overview</h2>
              <p className="text-xs text-slate-400">Automated sentinel flags, AML velocity thresholds, and system health status</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToRole('cro')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Open Risk Console →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
            <span className="text-[11px] text-slate-400 block">Fraud Alerts (24h)</span>
            <span className="text-xl font-bold text-amber-400 font-mono mt-0.5 block">{m.fraudAlertsCount}</span>
            <span className="text-[10px] text-emerald-400">All neutralized</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
            <span className="text-[11px] text-slate-400 block">Suspicious Txns</span>
            <span className="text-xl font-bold text-rose-400 font-mono mt-0.5 block">{m.suspiciousTxnCount}</span>
            <span className="text-[10px] text-slate-500">Held for manual review</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
            <span className="text-[11px] text-slate-400 block">Failed Transactions</span>
            <span className="text-xl font-bold text-slate-300 font-mono mt-0.5 block">{m.failedTxnCount}</span>
            <span className="text-[10px] text-slate-500">0.0009% failure rate</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
            <span className="text-[11px] text-slate-400 block">System Downtime</span>
            <span className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">{m.systemDowntime}</span>
            <span className="text-[10px] text-slate-500">Zero unplanned outage</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
            <span className="text-[11px] text-slate-400 block">Compliance Alerts</span>
            <span className="text-xl font-bold text-amber-400 font-mono mt-0.5 block">{m.complianceAlertsCount}</span>
            <span className="text-[10px] text-slate-500">KYC/AML verification</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
            <span className="text-[11px] text-slate-400 block">Security Incidents</span>
            <span className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">{m.securityIncidentsCount}</span>
            <span className="text-[10px] text-emerald-400">Zero breaches</span>
          </div>
        </div>
      </div>

      {/* SECTION 4: EXECUTIVE REPORTS */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Executive Reports (Board & Executive Sign-off)
            </h2>
            <p className="text-xs text-slate-400">Daily, Weekly, Monthly, and Annual certified dossiers</p>
          </div>
          <button
            onClick={() => onOpenReportExport()}
            className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Batch Export All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EXECUTIVE_REPORTS.map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    {rep.period} Dossier
                  </span>
                  <span className="text-[11px] text-slate-500">{rep.size}</span>
                </div>
                <h3 className="text-xs font-semibold text-slate-200 line-clamp-2">{rep.title}</h3>
                <p className="text-[11px] text-slate-400 mt-1">Generated: {rep.generatedAt}</p>
                <div className="mt-3 pt-2.5 border-t border-slate-850 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Inflow: <strong className="text-emerald-400">{rep.metricsSummary.inflow}</strong></span>
                  <span>Active: <strong className="text-cyan-400">{rep.metricsSummary.activeUsers}</strong></span>
                </div>
              </div>

              <button
                onClick={() => onOpenReportExport(rep.id)}
                className="w-full mt-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                View & Export
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
