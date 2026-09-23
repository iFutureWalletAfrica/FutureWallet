import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  UserCheck, 
  ArrowRight, 
  FileText, 
  Zap, 
  Scale, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { KYC_TIERS_CONFIG, KycTierConfig } from '../../data/kycTierData';

interface KycTierPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: 'tier_1' | 'tier_2' | 'tier_3' | 'corporate_kyb';
}

export const KycTierPolicyModal: React.FC<KycTierPolicyModalProps> = ({
  isOpen,
  onClose,
  initialTier = 'tier_1',
}) => {
  const [selectedTierKey, setSelectedTierKey] = useState<string>(initialTier);

  if (!isOpen) return null;

  const currentConfig: KycTierConfig = KYC_TIERS_CONFIG[selectedTierKey] || KYC_TIERS_CONFIG.tier_1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">
                  CBN Tiered KYC & Corporate Account Policy Matrix
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                  Official Standard
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Central Bank of Nigeria 3-Tier KYC Framework & Standard Corporate (KYB) Requirements
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS SELECTOR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 p-2 bg-slate-950/40 border-b border-slate-800">
          {Object.entries(KYC_TIERS_CONFIG).map(([key, config]) => {
            const isSelected = selectedTierKey === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedTierKey(key)}
                className={`px-3 py-2.5 rounded-xl text-left transition-all relative ${
                  isSelected
                    ? 'bg-slate-800/90 text-white shadow-md border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${config.badgeColor.split(' ')[0]}`}>
                    {config.shortName}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  )}
                </div>
                <div className="text-xs font-semibold truncate text-slate-200">
                  {config.name.replace(/\(.*\)/, '').trim()}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  {config.dailyTransferLimitLabel.split(' ')[0]} daily
                </div>
              </button>
            );
          })}
        </div>

        {/* BODY CONTENT */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 flex-1">
          {/* TIER TITLE & HIGHLIGHT CARDS */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${currentConfig.badgeColor}`}>
                  {currentConfig.shortName}
                </span>
                <span className="text-xs text-slate-400">• {currentConfig.category}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">{currentConfig.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xl">{currentConfig.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 min-w-[150px]">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Daily Transfer Limit</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {currentConfig.dailyTransferLimitLabel.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-500 block">per calendar day</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 min-w-[150px]">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Max Deposit / Balance</span>
                <span className="text-sm font-bold text-cyan-400 font-mono">
                  {currentConfig.maxDepositLimit === Infinity ? 'UNLIMITED' : currentConfig.maxDepositLimitLabel.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-500 block">cumulative threshold</span>
              </div>
            </div>
          </div>

          {/* REQUIREMENTS BREAKDOWN */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Statutory Verification Requirements ({currentConfig.requirements.length} Groups)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {currentConfig.requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-colors space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono text-indigo-300 flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      {req.title}
                    </span>
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-medium ${
                        req.ruleType === 'one_of'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      }`}
                    >
                      {req.ruleType === 'one_of' ? 'Any 1 Required' : 'All Required'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">{req.description}</p>

                  <div className="space-y-1.5 pt-1 border-t border-slate-850">
                    {req.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHECKLIST SUMMARY BOX */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Compliance Officer Audit Checklist for {currentConfig.shortName}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {currentConfig.standardChecklist.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-850">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-850 text-[11px] text-slate-400">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{currentConfig.cbnRegulatoryReference}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Enforced across Core Banking Ledger, NIBSS Instant Payments (NIP), and Mobile Applet limits.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
