import { useState } from 'react';
import { 
  Lock, 
  Search, 
  Terminal, 
  Download, 
  Bell, 
  User, 
  ChevronDown, 
  ShieldCheck, 
  Check, 
  AlertTriangle,
  ShieldAlert,
  Sliders,
  Radio,
  UserCog,
  Gift
} from 'lucide-react';
import { IFutureWalletLogo } from './common/IFutureWalletLogo';
import { CurrencyPreferenceToggle } from './common/CurrencyPreferenceToggle';
import { USER_PERSONAS } from '../data/mockFintechData';
import { DashboardRole, UserPersona } from '../types';

interface HeaderProps {
  currentRole: DashboardRole;
  onRoleChange: (role: DashboardRole) => void;
  onOpenSearch: () => void;
  onOpenApiTester: () => void;
  onOpenReportExport: () => void;
  unreadAlertsCount: number;
  criticalAlertsCount?: number;
  onOpenFraudDetector?: () => void;
  onOpenHighRiskAlerts?: () => void;
  onOpenAccountAction?: (initialAccountId?: string) => void;
}

export const Header = ({
  currentRole,
  onRoleChange,
  onOpenSearch,
  onOpenApiTester,
  onOpenReportExport,
  unreadAlertsCount,
  criticalAlertsCount = 3,
  onOpenFraudDetector,
  onOpenHighRiskAlerts,
  onOpenAccountAction,
}: HeaderProps) => {
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  const activePersona = USER_PERSONAS.find((p) => p.role === currentRole) || USER_PERSONAS[0];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-3 sm:px-4 md:px-6 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      {/* Left: Official Logo & Domain Indicators */}
      <div className="flex items-center gap-3">
        {/* Official Brand Logo */}
        <div className="flex items-center">
          <IFutureWalletLogo size="sm" variant="horizontal" className="hidden sm:inline-flex" />
          <IFutureWalletLogo size="xs" variant="icon" className="sm:hidden" />
        </div>

        {/* Domain Badge */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 shadow-inner">
          <div className="p-1 rounded bg-emerald-500/10 text-emerald-400">
            <Lock className="w-3 h-3" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-semibold tracking-tight text-slate-100">
              admin.ifuturewallet.com
            </span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
              mTLS
            </span>
          </div>
        </div>

        {/* Live Cluster Pill */}
        <div className="hidden 2xl:flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>PROD-CLUSTER-01</span>
          <span className="text-slate-500">•</span>
          <span className="text-[11px] text-emerald-300 font-mono">12ms</span>
        </div>
      </div>

      {/* Center: Global Search Bar Button */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg shadow-inner transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            <span>Search command panel, APIs, IFW Coin, AML...</span>
          </div>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="p-2 text-slate-400 hover:text-slate-200 md:hidden rounded-lg bg-slate-800/60 border border-slate-750"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Account Actions & Rewards Button */}
        {onOpenAccountAction && (
          <button
            onClick={() => onOpenAccountAction()}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors shadow-sm"
            title="Freeze, Unfreeze, Block, Unblock, Reward, or Bonus Any Account"
          >
            <UserCog className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">Account Actions</span>
            <span className="hidden xl:inline text-[10px] px-1 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono">
              Freeze / Bonus
            </span>
          </button>
        )}

        {/* High-Risk Alert Beacon Button */}
        {onOpenHighRiskAlerts && (
          <button
            onClick={onOpenHighRiskAlerts}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 rounded-lg transition-all animate-pulse"
            title="Open High-Risk Anomaly & Fraud Sentinel"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">High Risk Alert</span>
            <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold">
              {criticalAlertsCount}
            </span>
          </button>
        )}

        {/* Fraud Detector Engine Button */}
        {onOpenFraudDetector && (
          <button
            onClick={onOpenFraudDetector}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-slate-800/90 hover:bg-slate-750 border border-cyan-500/40 rounded-lg transition-colors shadow-sm"
            title="Open Interactive Real-Time Fraud Detector Engine"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Fraud Detector</span>
          </button>
        )}

        {/* API Sandbox Button */}
        <button
          onClick={onOpenApiTester}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition-colors"
          title="Open API Product Integration Sandbox"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>API Sandbox</span>
        </button>

        {/* Export Executive Reports */}
        <button
          onClick={onOpenReportExport}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors"
          title="Export Daily / Weekly / Monthly Reports"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Executive Reports</span>
        </button>

        {/* Global Currency Preference Toggle (NGN / USD) */}
        <CurrencyPreferenceToggle />

        {/* Alerts Bell */}
        <div className="relative">
          <button
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-750 relative transition-colors"
            title="System & Compliance Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Alerts Flyout */}
          {isAlertsOpen && (
            <div className="absolute right-0 mt-2 w-84 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Live Security & AML Feed
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> Real-Time
                </span>
              </div>

              {/* Quick links into Fraud Detector & High Risk Alerts */}
              <div className="grid grid-cols-2 gap-2 mb-2.5 pb-2 border-b border-slate-800">
                <button
                  onClick={() => {
                    setIsAlertsOpen(false);
                    if (onOpenHighRiskAlerts) onOpenHighRiskAlerts();
                  }}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-semibold text-center transition-colors"
                >
                  High-Risk Alerts ({criticalAlertsCount})
                </button>
                <button
                  onClick={() => {
                    setIsAlertsOpen(false);
                    if (onOpenFraudDetector) onOpenFraudDetector();
                  }}
                  className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold text-center transition-colors"
                >
                  Fraud Detector
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-slate-950 border border-slate-850">
                  <div className="flex items-center justify-between text-rose-400 font-medium text-[11px]">
                    <span className="font-semibold">Structuring Outflow (₦14.8M)</span>
                    <span>2m ago</span>
                  </div>
                  <p className="text-slate-300 mt-0.5 text-[11px]">Apex Logistics virtual account flagged for smurfing.</p>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-850">
                  <div className="flex items-center justify-between text-rose-400 font-medium text-[11px]">
                    <span className="font-semibold">SIM Swap Detected</span>
                    <span>9m ago</span>
                  </div>
                  <p className="text-slate-300 mt-0.5 text-[11px]">Alhaji M. Bello account challenged with biometric step-up.</p>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-850">
                  <div className="flex items-center justify-between text-amber-400 font-medium text-[11px]">
                    <span className="font-semibold">Impossible Travel Alert</span>
                    <span>17m ago</span>
                  </div>
                  <p className="text-slate-300 mt-0.5 text-[11px]">Concurrent session token used from Moscow, Russia.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Role Persona Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 pl-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors"
          >
            <img
              src={activePersona.avatar}
              alt={activePersona.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-600"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 leading-tight">
                {activePersona.name}
              </span>
              <span className="text-[10px] text-cyan-400 leading-tight">
                {activePersona.title.split('(')[0]}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Persona Menu Dropdown */}
          {isPersonaMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in max-h-96 overflow-y-auto">
              <div className="px-3 py-2 border-b border-slate-800 mb-1">
                <span className="text-xs font-semibold text-slate-300 block">Switch Executive Persona</span>
                <span className="text-[10px] text-slate-500 block">Simulate role-specific command view</span>
              </div>
              <div className="space-y-1">
                {USER_PERSONAS.map((p: UserPersona) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onRoleChange(p.role);
                      setIsPersonaMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                      currentRole === p.role ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                      <div>
                        <span className="font-medium block leading-tight">{p.name}</span>
                        <span className="text-[10px] text-slate-400 block leading-tight">{p.title}</span>
                      </div>
                    </div>
                    {currentRole === p.role && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
