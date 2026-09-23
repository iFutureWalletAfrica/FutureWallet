import { useState } from 'react';
import { 
  Landmark, 
  ArrowLeftRight, 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  CheckCircle2, 
  Building2, 
  Download, 
  Filter, 
  RefreshCw,
  PieChart
} from 'lucide-react';
import { 
  BANK_TREASURY_ACCOUNTS, 
  RECENT_TRANSACTIONS, 
  INITIAL_CEO_METRICS 
} from '../../data/mockFintechData';
import { useCurrency } from '../../context/CurrencyContext';
import { FinancialTransactionChart } from '../charts/FinancialTransactionChart';

export const CfoDashboard = () => {
  const { currency, formatUsd } = useCurrency();
  const [activeTab, setActiveTab] = useState<'treasury' | 'transactions' | 'revenue'>('treasury');
  const [txFilter, setTxFilter] = useState<string>('All');
  const [bankAccounts, setBankAccounts] = useState(BANK_TREASURY_ACCOUNTS);
  const [isReconciling, setIsReconciling] = useState(false);

  const handleReconcile = () => {
    setIsReconciling(true);
    setTimeout(() => {
      setIsReconciling(false);
      setBankAccounts((prev) =>
        prev.map((b) => ({ ...b, status: 'Operational' }))
      );
    }, 1000);
  };

  const filteredTxns = RECENT_TRANSACTIONS.filter((t) => {
    if (txFilter === 'All') return true;
    return t.type === txFilter;
  });

  const totalBankReserves = bankAccounts.reduce((sum, b) => sum + b.balance, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
              CFO Financial Control Panel
            </span>
            <span className="text-xs text-slate-400">admin.ifuturewallet.com • Corporate Treasury & Ledger</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Treasury Management, Bank Reserves & Multi-Stream Revenue
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Live multi-bank settlement positions across Commercial, PSB, and Microfinance partners, plus real-time transaction fee accounting.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReconcile}
            disabled={isReconciling}
            className="px-3.5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg flex items-center gap-1.5 shadow-lg shadow-amber-500/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReconciling ? 'animate-spin' : ''}`} />
            Reconcile Interbank Positions
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-medium gap-2">
        <button
          onClick={() => setActiveTab('treasury')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'treasury'
              ? 'border-amber-400 text-amber-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Landmark className="w-4 h-4" />
          Treasury & Bank Liquidity Position
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'transactions'
              ? 'border-amber-400 text-amber-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          High-Frequency Transaction Monitoring
        </button>
        <button
          onClick={() => setActiveTab('revenue')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'revenue'
              ? 'border-amber-400 text-amber-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Multi-Channel Revenue Streams
        </button>
      </div>

      {/* TAB 1: TREASURY MANAGEMENT */}
      {activeTab === 'treasury' && (
        <div className="space-y-6">
          {/* Treasury KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Total Bank Reserves</span>
              <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block transition-all duration-300">
                {formatUsd(totalBankReserves, { decimals: 1 })}
              </span>
              <span className="text-[11px] text-slate-500">Across 5 Tier-1 Institutions</span>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Mandatory Liquidity Ratio</span>
              <span className="text-xl font-bold text-white font-mono mt-1 block">24.8%</span>
              <span className="text-[11px] text-emerald-400">+9.8% above CBN statutory buffer</span>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Daily Inflow Netting</span>
              <span className="text-xl font-bold text-cyan-400 font-mono mt-1 block transition-all duration-300">
                +{formatUsd(42180000, { decimals: 2 })}
              </span>
              <span className="text-[11px] text-slate-500">Net positive liquidity surplus</span>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Partner Settlement</span>
              <span className="text-xl font-bold text-indigo-300 font-mono mt-1 block">100% Cleared</span>
              <span className="text-[11px] text-slate-500">Zero batch backlog</span>
            </div>
          </div>

          {/* Interactive Financial Settlement Velocity Chart */}
          <FinancialTransactionChart
            title="CFO Interbank Clearing & Settlement Velocity"
            subtitle="Real-time multi-bank liquidity netting, cash-in/cash-out, and commercial reserve buffer dynamics"
          />

          {/* Bank Accounts Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  Partner Bank Liquidity Positions & Settlement Accounts
                </h3>
                <p className="text-xs text-slate-400">Commercial Banks, Payment Service Banks (PSB) & Microfinance Banks (MFB) • Values dynamically converted ({currency})</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-medium">Banking Institution</th>
                    <th className="pb-3 font-medium">Institution Class</th>
                    <th className="pb-3 font-medium">Settlement Speed</th>
                    <th className="pb-3 font-medium">Account No.</th>
                    <th className="pb-3 font-medium">Liquid Balance ({currency})</th>
                    <th className="pb-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {bankAccounts.map((bank) => (
                    <tr key={bank.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="py-3 font-semibold text-slate-200">{bank.bankName}</td>
                      <td className="py-3 text-slate-400">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                          {bank.accountType}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300 font-mono text-[11px]">{bank.settlementSpeed}</td>
                      <td className="py-3 font-mono text-slate-400">{bank.accountNumberMasked}</td>
                      <td className="py-3 font-mono text-emerald-400 font-bold text-sm transition-all duration-300">
                        {formatUsd(bank.balance, { decimals: 1 })}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            bank.status === 'Operational'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {bank.status}
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

      {/* TAB 2: TRANSACTION MONITORING */}
      {activeTab === 'transactions' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-amber-400" />
                Live Transaction Switch (Deposits, Withdrawals, Transfers, Bills, Merchant)
              </h3>
              <p className="text-xs text-slate-400">High-frequency settlement feed across all payment rails</p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              {(['All', 'Wallet Deposit', 'Withdrawal', 'Transfer', 'Bill Payment', 'Merchant Payment'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTxFilter(filter)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    txFilter === filter
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-medium">Transaction Ref</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Amount ({currency})</th>
                  <th className="pb-3 font-medium">Sender / Recipient</th>
                  <th className="pb-3 font-medium">Channel</th>
                  <th className="pb-3 font-medium">Fee Captured</th>
                  <th className="pb-3 font-medium">Timestamp</th>
                  <th className="pb-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredTxns.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3 font-mono font-semibold text-slate-200">{tx.reference}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-100 transition-all duration-300">
                      {formatUsd(tx.amount, { compact: false, decimals: 0 })}
                    </td>
                    <td className="py-3 text-slate-300">
                      <span>{tx.sender}</span> → <span className="text-slate-400">{tx.recipient}</span>
                    </td>
                    <td className="py-3 text-cyan-400 font-mono text-[11px]">{tx.channel}</td>
                    <td className="py-3 font-mono text-emerald-400 font-semibold transition-all duration-300">
                      +{formatUsd(tx.fee, { compact: false, decimals: 2 })}
                    </td>
                    <td className="py-3 text-slate-400">{tx.timestamp}</td>
                    <td className="py-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          tx.status === 'Successful'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : tx.status === 'Flagged'
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-300'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REVENUE DASHBOARD */}
      {activeTab === 'revenue' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Revenue Streams Breakdown (Total: {formatUsd(INITIAL_CEO_METRICS.revenueGenerated, { decimals: 2 })})
              </h3>
              <p className="text-xs text-slate-400">Diversified fintech monetization across interchange, APIs, merchants & IFW Coin in {currency}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-xs text-slate-400 block">Transaction Fees</span>
              <span className="text-xl font-bold text-white font-mono mt-1 block transition-all duration-300">
                {formatUsd(18420000, { decimals: 2 })}
              </span>
              <span className="text-[11px] text-emerald-400">43.7% of total revenue</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-xs text-slate-400 block">API Revenue</span>
              <span className="text-xl font-bold text-cyan-400 font-mono mt-1 block transition-all duration-300">
                {formatUsd(9850000, { decimals: 2 })}
              </span>
              <span className="text-[11px] text-cyan-400">Enterprise banking B2B</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-xs text-slate-400 block">Merchant Revenue</span>
              <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block transition-all duration-300">
                {formatUsd(7420000, { decimals: 2 })}
              </span>
              <span className="text-[11px] text-slate-400">QR & checkout gateway</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-xs text-slate-400 block">Subscription Revenue</span>
              <span className="text-xl font-bold text-indigo-300 font-mono mt-1 block transition-all duration-300">
                {formatUsd(3150000, { decimals: 2 })}
              </span>
              <span className="text-[11px] text-slate-400">Premium corporate tiers</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-xs text-slate-400 block">IFW Coin Ecosystem</span>
              <span className="text-xl font-bold text-amber-400 font-mono mt-1 block transition-all duration-300">
                {formatUsd(3340000, { decimals: 2 })}
              </span>
              <span className="text-[11px] text-amber-400">Gas, staking & burns</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
