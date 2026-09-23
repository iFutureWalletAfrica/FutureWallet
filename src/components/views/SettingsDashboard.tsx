import { useState } from 'react';
import { 
  Sliders, 
  DollarSign, 
  Coins, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Save, 
  Globe, 
  RefreshCw 
} from 'lucide-react';
import { PLATFORM_FEES, CURRENCIES_CONFIG } from '../../data/mockFintechData';

export const SettingsDashboard = () => {
  const [fees, setFees] = useState(PLATFORM_FEES);
  const [currencies, setCurrencies] = useState(CURRENCIES_CONFIG);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleFeeChange = (field: keyof typeof fees, val: number) => {
    setFees((prev) => ({ ...prev, [field]: val }));
  };

  const handleToggleCurrency = (code: string) => {
    setCurrencies((prev) =>
      prev.map((c) => (c.code === code ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
              Global Platform Parameters
            </span>
            <span className="text-xs text-slate-400">admin.ifuturewallet.com • Master Configuration</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Fee Schedules, Multi-Currency Switch & Emergency Killswitch
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Live adjustments for interchange fees, merchant MDR, cross-border FX rates, and scheduled core maintenance toggles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg flex items-center gap-1.5 shadow-lg shadow-cyan-500/15 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Platform fee schedules and currency configurations successfully committed to core switch!</span>
        </div>
      )}

      {/* Grid: Fee Schedules & Currencies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Configuration */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Dynamic Fee Schedules & Merchant MDR
            </h3>
            <p className="text-xs text-slate-400">Adjust realtime fee margins applied across transaction processing rails</p>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
              <div>
                <span className="font-medium text-slate-200 block">Wallet Deposit Fee</span>
                <span className="text-[11px] text-slate-500">Inflow via Bank Transfer / USSD / Card</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <input
                  type="number"
                  step="0.1"
                  value={fees.depositFeePercent}
                  onChange={(e) => handleFeeChange('depositFeePercent', parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-750 rounded text-center text-slate-100 text-xs"
                />
                <span className="text-slate-400">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
              <div>
                <span className="font-medium text-slate-200 block">Withdrawal / Outflow Fee</span>
                <span className="text-[11px] text-slate-500">Transfers out to third-party commercial banks</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <input
                  type="number"
                  step="0.1"
                  value={fees.withdrawalFeePercent}
                  onChange={(e) => handleFeeChange('withdrawalFeePercent', parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-750 rounded text-center text-slate-100 text-xs"
                />
                <span className="text-slate-400">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
              <div>
                <span className="font-medium text-slate-200 block">P2P Wallet Transfer Fee</span>
                <span className="text-[11px] text-slate-500">Internal IFW-to-IFW account transfer</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <input
                  type="number"
                  step="0.1"
                  value={fees.p2pTransferFeePercent}
                  onChange={(e) => handleFeeChange('p2pTransferFeePercent', parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-750 rounded text-center text-slate-100 text-xs"
                />
                <span className="text-slate-400">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
              <div>
                <span className="font-medium text-slate-200 block">Merchant Discount Rate (MDR)</span>
                <span className="text-[11px] text-slate-500">QR code and checkout acquiring charge</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <input
                  type="number"
                  step="0.1"
                  value={fees.merchantMdrPercent}
                  onChange={(e) => handleFeeChange('merchantMdrPercent', parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-750 rounded text-center text-slate-100 text-xs"
                />
                <span className="text-slate-400">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
              <div>
                <span className="font-medium text-slate-200 block">IFW Coin Payment Discount</span>
                <span className="text-[11px] text-slate-500">Fee rebate when settling in native IFW token</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <input
                  type="number"
                  step="1"
                  value={fees.ifwCoinDiscountPercent}
                  onChange={(e) => handleFeeChange('ifwCoinDiscountPercent', parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-750 rounded text-center text-amber-400 font-bold text-xs"
                />
                <span className="text-slate-400">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Currency Switch & Maintenance Mode */}
        <div className="space-y-6">
          {/* Currency Configuration */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Coins className="w-4 h-4 text-cyan-400" />
                Multi-Currency FX Rates & Enablement
              </h3>
              <p className="text-xs text-slate-400">Manage supported fiat settlement pairs & native crypto rails</p>
            </div>

            <div className="space-y-2.5 text-xs">
              {currencies.map((curr) => (
                <div
                  key={curr.code}
                  className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-slate-200">
                      {curr.symbol}
                    </span>
                    <div>
                      <span className="font-semibold text-slate-200">{curr.name}</span>
                      <span className="text-slate-500 text-[11px] block font-mono">{curr.code}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono text-slate-300">
                      1 USD = {curr.exchangeRateToUsd.toLocaleString()} {curr.code}
                    </span>
                    <button
                      onClick={() => handleToggleCurrency(curr.code)}
                      className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${
                        curr.enabled
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {curr.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Killswitch & Maintenance */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-rose-900/40 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-rose-300">Core Switch Maintenance Mode</h3>
            </div>
            <p className="text-xs text-slate-400">
              Freezes non-essential consumer transactions while maintaining webhook reconciliation and database integrity.
            </p>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Current Status: {maintenanceMode ? '🔴 ACTIVE FREEZE' : '🟢 Normal Operations'}
              </span>
              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  maintenanceMode
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {maintenanceMode ? 'Restore Normal Switch Mode' : 'Arm Emergency Freeze'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
