import React, { useState } from 'react';
import { ArrowLeftRight, Check, Coins, Globe, Info } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

interface CurrencyPreferenceToggleProps {
  className?: string;
  showRateBadge?: boolean;
}

export const CurrencyPreferenceToggle: React.FC<CurrencyPreferenceToggleProps> = ({
  className = '',
  showRateBadge = true,
}) => {
  const { currency, setCurrency, toggleCurrency, exchangeRate } = useCurrency();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={`relative flex items-center gap-1.5 ${className}`}>
      {/* Rate Info Pill (Desktop) */}
      {showRateBadge && (
        <div 
          className="hidden 2xl:flex items-center gap-1 px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 cursor-help"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          title={`Exchange Benchmark: 1 USD = ₦${exchangeRate.toLocaleString()} NGN`}
        >
          <span className="text-cyan-400">$1</span>
          <span>=</span>
          <span className="text-emerald-400">₦{exchangeRate.toLocaleString()}</span>
        </div>
      )}

      {/* Segmented Control */}
      <div 
        className="inline-flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-750 shadow-inner group"
        role="group"
        aria-label="Currency Preference"
      >
        {/* NGN Button */}
        <button
          type="button"
          onClick={() => setCurrency('NGN')}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
            currency === 'NGN'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
          title="Convert all financial charts and balances to Nigerian Naira (₦ NGN)"
        >
          <span className="font-mono text-[13px] leading-none">₦</span>
          <span className="hidden sm:inline text-[11px] tracking-tight">NGN</span>
        </button>

        {/* Quick Flip Button */}
        <button
          type="button"
          onClick={toggleCurrency}
          className="p-1 text-slate-500 hover:text-cyan-400 transition-colors hidden sm:inline-flex"
          title="Toggle between NGN and USD"
        >
          <ArrowLeftRight className="w-3 h-3" />
        </button>

        {/* USD Button */}
        <button
          type="button"
          onClick={() => setCurrency('USD')}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
            currency === 'USD'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
          title="Convert all financial charts and balances to US Dollar ($ USD)"
        >
          <span className="font-mono text-[13px] leading-none">$</span>
          <span className="hidden sm:inline text-[11px] tracking-tight">USD</span>
        </button>
      </div>

      {/* Interactive Tooltip Flyout on Hover */}
      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-56 p-2.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 text-[11px] text-slate-300 animate-in fade-in">
          <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-800 text-xs font-semibold text-white">
            <Coins className="w-3.5 h-3.5 text-cyan-400" />
            <span>Global Currency Preference</span>
          </div>
          <div className="mt-2 space-y-1 font-mono text-[10px]">
            <div className="flex justify-between text-slate-400">
              <span>Active Target:</span>
              <strong className={currency === 'NGN' ? 'text-emerald-400' : 'text-cyan-400'}>
                {currency === 'NGN' ? '₦ Nigerian Naira' : '$ US Dollar'}
              </strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Official Rate:</span>
              <span className="text-white">1 USD = ₦{exchangeRate.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Benchmark:</span>
              <span className="text-slate-300">NAFEM / CBN Fixing</span>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 leading-tight">
            Dynamically converts transaction velocity charts, liquidity positions, reserves, and ledger rows.
          </p>
        </div>
      )}
    </div>
  );
};
