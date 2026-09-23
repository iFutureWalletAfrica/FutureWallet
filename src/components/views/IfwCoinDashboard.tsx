import { useState } from 'react';
import { 
  Coins, 
  Flame, 
  Layers, 
  TrendingUp, 
  Lock, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { IFW_COIN_METRICS, STAKING_POOLS, TOKEN_BURNS } from '../../data/mockFintechData';
import { TokenBurnEvent } from '../../types';

export const IfwCoinDashboard = () => {
  const [metrics, setMetrics] = useState(IFW_COIN_METRICS);
  const [burns, setBurns] = useState<TokenBurnEvent[]>(TOKEN_BURNS);
  const [isBurning, setIsBurning] = useState(false);
  const [burnSuccess, setBurnSuccess] = useState<string | null>(null);

  const handleExecuteBurn = () => {
    setIsBurning(true);
    setBurnSuccess(null);
    setTimeout(() => {
      setIsBurning(false);
      const burnAmount = 1000000;
      const newBurn: TokenBurnEvent = {
        id: `burn-${Date.now()}`,
        txHash: `0x${Math.random().toString(16).substring(2, 18)}...`,
        amount: burnAmount,
        usdValue: burnAmount * metrics.priceUsd,
        burnedAt: 'Just now',
        quarter: 'Emergency Burn',
      };
      setBurns([newBurn, ...burns]);
      setMetrics((prev) => ({
        ...prev,
        burnedCoins: prev.burnedCoins + burnAmount,
        circulatingSupply: prev.circulatingSupply - burnAmount,
        priceUsd: +(prev.priceUsd * 1.012).toFixed(4),
      }));
      setBurnSuccess(`Successfully burned 1,000,000 IFW via Buyback Treasury! Transaction confirmed on L1 switch.`);
      setTimeout(() => setBurnSuccess(null), 7000);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
              Native Utility & Governance Token
            </span>
            <span className="text-xs text-slate-400">admin.ifuturewallet.com • IFW Ledger</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            IFW Coin Ecosystem, Staking Protocols & Deflationary Burns
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Tokenomics command center: circulating supply, yield staking vaults, fee-discount gas mechanisms, and buyback-and-burn execution.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExecuteBurn}
            disabled={isBurning}
            className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg flex items-center gap-1.5 shadow-lg shadow-amber-500/15 transition-colors disabled:opacity-50"
          >
            <Flame className={`w-3.5 h-3.5 text-slate-950 ${isBurning ? 'animate-bounce' : ''}`} />
            {isBurning ? 'Executing Burn...' : 'Execute Buyback Burn'}
          </button>
        </div>
      </div>

      {burnSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{burnSuccess}</span>
        </div>
      )}

      {/* Main Tokenomics KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block">IFW Price</span>
          <span className="text-lg font-bold text-amber-400 font-mono mt-0.5 block">
            ${metrics.priceUsd}
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">+{metrics.priceChange24h}% 24h</span>
        </div>
        <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Market Cap</span>
          <span className="text-lg font-bold text-white font-mono mt-0.5 block">
            ${(metrics.marketCap / 1000000).toFixed(1)}M
          </span>
          <span className="text-[10px] text-slate-500">Fully Diluted</span>
        </div>
        <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Total Supply</span>
          <span className="text-lg font-bold text-slate-200 font-mono mt-0.5 block">
            {(metrics.totalSupply / 1000000).toFixed(0)}M
          </span>
          <span className="text-[10px] text-slate-500">Fixed Hardcap</span>
        </div>
        <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Circulating</span>
          <span className="text-lg font-bold text-cyan-400 font-mono mt-0.5 block">
            {(metrics.circulatingSupply / 1000000).toFixed(1)}M
          </span>
          <span className="text-[10px] text-slate-500">34.2% in Market</span>
        </div>
        <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Staked in Vaults</span>
          <span className="text-lg font-bold text-indigo-300 font-mono mt-0.5 block">
            {(metrics.stakedCoins / 1000000).toFixed(0)}M
          </span>
          <span className="text-[10px] text-indigo-400">52.6% Circulating</span>
        </div>
        <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Burned Forever</span>
          <span className="text-lg font-bold text-rose-400 font-mono mt-0.5 block">
            {(metrics.burnedCoins / 1000000).toFixed(1)}M
          </span>
          <span className="text-[10px] text-rose-400 font-medium">Deflationary</span>
        </div>
        <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400 block">24h Volume</span>
          <span className="text-lg font-bold text-emerald-400 font-mono mt-0.5 block">
            ${(metrics.tradingVolume24h / 1000000).toFixed(1)}M
          </span>
          <span className="text-[10px] text-slate-500">Across DEX/CEX</span>
        </div>
      </div>

      {/* Staking Programs */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              IFW Staking Yield Vaults ({metrics.totalStakers.toLocaleString()} Active Stakers)
            </h3>
            <p className="text-xs text-slate-400">Ecosystem rewards pool funded by 20% of net merchant gateway fees</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            Rewards Distributed: ${(metrics.rewardsDistributedUsd / 1000000).toFixed(1)}M
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STAKING_POOLS.map((pool) => (
            <div key={pool.id} className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {pool.duration}
                  </span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    {pool.apy}% APY
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200">{pool.name}</h4>
                <div className="mt-3 space-y-1 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Total Staked:</span>
                    <strong className="font-mono text-slate-200">{(pool.totalStaked / 1000000).toFixed(1)}M IFW</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Participants:</span>
                    <span className="font-mono text-slate-300">{pool.participants.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Token Burn History */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              Quarterly Buyback & Token Burn Ledger
            </h3>
            <p className="text-xs text-slate-400">All burned tokens sent to verifiable dead address 0x000...000dEaD</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-medium">Batch / Quarter</th>
                <th className="pb-3 font-medium">On-chain Tx Hash</th>
                <th className="pb-3 font-medium">Tokens Burned</th>
                <th className="pb-3 font-medium">Dollar Value</th>
                <th className="pb-3 font-medium text-right">Burn Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {burns.map((burn) => (
                <tr key={burn.id} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-3 font-semibold text-slate-200">{burn.quarter}</td>
                  <td className="py-3 font-mono text-cyan-400">{burn.txHash}</td>
                  <td className="py-3 font-mono text-rose-400 font-bold">
                    -{burn.amount.toLocaleString()} IFW
                  </td>
                  <td className="py-3 font-mono text-emerald-400 font-semibold">
                    ${burn.usdValue.toLocaleString()}
                  </td>
                  <td className="py-3 text-slate-400 text-right">{burn.burnedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
