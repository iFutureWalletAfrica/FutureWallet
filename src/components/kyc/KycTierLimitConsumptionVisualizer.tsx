import { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  ArrowUpRight, 
  Clock, 
  Wallet, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Activity,
  Zap,
  Unlock,
  Scale
} from 'lucide-react';
import { KycApplicant, TierConsumption } from '../../types';
import { KYC_TIERS_CONFIG } from '../../data/kycTierData';

interface KycTierLimitConsumptionVisualizerProps {
  applicant: KycApplicant;
  onFastApproveUpgrade?: () => void;
  onOpenChecklist?: () => void;
}

export const KycTierLimitConsumptionVisualizer = ({
  applicant,
  onFastApproveUpgrade,
  onOpenChecklist
}: KycTierLimitConsumptionVisualizerProps) => {
  const [isSimulatingUpgrade, setIsSimulatingUpgrade] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Helper to normalize tier
  const getNormalizedTierKey = (tierStr?: string): 'tier_1' | 'tier_2' | 'tier_3' | 'corporate_kyb' | 'business_corporate' => {
    if (!tierStr) return 'tier_1';
    const lower = tierStr.toLowerCase();
    if (lower.includes('business/corporate') || lower.includes('business / corporate') || lower === 'business/corporate') {
      return 'business_corporate';
    }
    if (lower.includes('corporate') || lower.includes('company') || lower.includes('business') || lower.includes('enterprise') || lower.includes('kyb')) {
      return 'business_corporate';
    }
    if (tierStr.includes('3')) return 'tier_3';
    if (tierStr.includes('2')) return 'tier_2';
    if (tierStr.includes('1')) return 'tier_1';
    return 'tier_1';
  };

  // Determine current effective tier vs requested target tier
  const currentTierKey = getNormalizedTierKey(applicant.currentTier || (applicant.tierRequested === 'Tier 1' ? 'tier_1' : 'tier_1'));
  const targetTierKey = getNormalizedTierKey(applicant.tierRequested);

  const currentTierConfig = KYC_TIERS_CONFIG[currentTierKey] || KYC_TIERS_CONFIG['tier_1'];
  const targetTierConfig = KYC_TIERS_CONFIG[targetTierKey] || KYC_TIERS_CONFIG['business_corporate'] || KYC_TIERS_CONFIG['tier_2'];

  // Resolve consumption data with realistic fallbacks if not explicitly populated
  const consumptionData: TierConsumption = useMemo(() => {
    if (applicant.consumption) {
      return applicant.consumption;
    }

    const isProvisional = applicant.status === 'Temporary Approved';
    let dailyLimit = applicant.tailoredLimits?.dailyTransferLimitNgn || currentTierConfig.dailyTransferLimit;
    if (isProvisional && applicant.provisionalDailyLimitNgn) {
      dailyLimit = applicant.provisionalDailyLimitNgn;
    }

    const depositLimit = applicant.tailoredLimits?.maxDepositLimitNgn !== undefined 
      ? applicant.tailoredLimits.maxDepositLimitNgn 
      : (currentTierConfig.maxDepositLimit === Infinity ? -1 : currentTierConfig.maxDepositLimit);

    let dailySpent = 0;
    let depositBalance = 0;

    if (applicant.id === 'kyc-01') {
      // Near threshold Tier 1 applicant: ₦44,500 of ₦50,000 (89%)
      dailySpent = 44500;
      depositBalance = 468000;
    } else if (applicant.id === 'kyc-02') {
      // Verified Tier 2 upgrading to Tier 3: ₦390,000 of ₦500,000 (78%)
      dailySpent = 390000;
      depositBalance = 4250000;
    } else if (applicant.id === 'kyc-03') {
      // High-Risk Corporate: ₦38,400,000 of ₦50,000,000 (76.8%)
      dailySpent = 38400000;
      depositBalance = 142000000;
    } else if (applicant.id === 'kyc-04') {
      // Tier 1 approaching limit: ₦48,200 of ₦50,000 (96.4% critical breach warning)
      dailySpent = 48200;
      depositBalance = 492000;
    } else if (applicant.id === 'kyc-05') {
      // Temporary Approved Tier 2: ₦410,000 of ₦500,000 (82%)
      dailySpent = 410000;
      depositBalance = 3800000;
    } else {
      // Generic calculation
      const seed = (applicant.fullName.charCodeAt(0) * 7) % 100;
      const ratio = 0.45 + (seed / 100) * 0.50; // between 45% and 95%
      dailySpent = Math.round(dailyLimit * ratio);
      depositBalance = depositLimit > 0 ? Math.round(depositLimit * (ratio * 0.95)) : 12500000;
    }

    const nearThreshold = (dailySpent / dailyLimit) >= 0.80 || (depositLimit > 0 && (depositBalance / depositLimit) >= 0.80);

    return {
      dailyTransferSpentNgn: dailySpent,
      dailyTransferLimitNgn: dailyLimit,
      cumulativeDepositBalanceNgn: depositBalance,
      cumulativeDepositLimitNgn: depositLimit,
      singleTransactionSpentNgn: Math.round(dailySpent * 0.65),
      singleTransactionLimitNgn: Math.round(dailyLimit * 0.7),
      monthlyVelocitySpentNgn: dailySpent * 18,
      monthlyVelocityLimitNgn: dailyLimit * 30,
      lastTransferAt: 'Today, 14:18 WAT',
      lastDepositAt: 'Today, 09:42 WAT',
      activeBreachWarning: nearThreshold,
      breachFlagReason: nearThreshold 
        ? `Account has consumed ≥ 80% of statutory ceiling. Velocity throttle armed.`
        : undefined,
      projectedTierDailyLimitNgn: targetTierConfig.dailyTransferLimit,
    };
  }, [applicant, currentTierConfig, targetTierConfig]);

  // Current values
  const effectiveDailyLimit = isSimulatingUpgrade
    ? targetTierConfig.dailyTransferLimit
    : consumptionData.dailyTransferLimitNgn;

  const targetDepositLimit = targetTierConfig.maxDepositLimit === Infinity ? -1 : targetTierConfig.maxDepositLimit;
  const effectiveDepositLimit = isSimulatingUpgrade
    ? targetDepositLimit
    : consumptionData.cumulativeDepositLimitNgn;

  // Daily transfer calculations
  const dailySpent = consumptionData.dailyTransferSpentNgn;
  const dailyRemaining = Math.max(0, effectiveDailyLimit - dailySpent);
  const dailyPercent = Math.min(100, Math.round((dailySpent / effectiveDailyLimit) * 100));

  // Cumulative deposit calculations
  const depositBalance = consumptionData.cumulativeDepositBalanceNgn;
  const isDepositUnlimited = effectiveDepositLimit === -1 || effectiveDepositLimit === Infinity;
  const depositRemaining = isDepositUnlimited ? -1 : Math.max(0, effectiveDepositLimit - depositBalance);
  const depositPercent = isDepositUnlimited ? 0 : Math.min(100, Math.round((depositBalance / effectiveDepositLimit) * 100));

  // Determine alert states
  const isDailyCritical = dailyPercent >= 90;
  const isDailyWarning = dailyPercent >= 80 && dailyPercent < 90;
  const isDepositCritical = !isDepositUnlimited && depositPercent >= 90;
  const isDepositWarning = !isDepositUnlimited && depositPercent >= 80 && depositPercent < 90;

  const hasHighProximityWarning = isDailyCritical || isDailyWarning || isDepositCritical || isDepositWarning;

  // Format Nigerian Naira currency
  const formatNgn = (val: number) => {
    return '₦' + val.toLocaleString('en-NG');
  };

  return (
    <div className="bg-slate-950/90 border-b border-slate-800 transition-all duration-200">
      {/* Top Bar / Compact Summary Bar */}
      <div className="px-6 py-3 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border flex items-center justify-center ${
            hasHighProximityWarning && !isSimulatingUpgrade
              ? 'bg-amber-500/15 text-amber-400 border-amber-500/40 animate-pulse'
              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
          }`}>
            <Activity className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                CBN Tier Consumption & Velocity Monitor
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                isSimulatingUpgrade
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : applicant.status === 'Temporary Approved'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
              }`}>
                {isSimulatingUpgrade ? `Simulation: ${targetTierConfig.shortName}` : `Active: ${currentTierConfig.shortName}`}
              </span>

              {applicant.status === 'Temporary Approved' && applicant.provisionalDailyLimitNgn && !isSimulatingUpgrade && (
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-medium">
                  Provisional Cap ({applicant.provisionalPeriodDays}d remaining)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
              <span>Daily Outflow: <strong className="text-slate-200 font-mono">{formatNgn(dailySpent)}</strong> of <span className="text-slate-300 font-mono">{formatNgn(effectiveDailyLimit)}</span> ({dailyPercent}%)</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="hidden sm:inline">
                Deposit Balance: <strong className="text-slate-200 font-mono">{formatNgn(depositBalance)}</strong> of <span className="text-slate-300 font-mono">{isDepositUnlimited ? 'Unlimited' : formatNgn(effectiveDepositLimit)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right side controls: Simulation Toggle & Expand Button */}
        <div className="flex items-center gap-2.5 ml-auto">
          {/* What-If Upgrade Simulator Button */}
          <button
            onClick={() => setIsSimulatingUpgrade(!isSimulatingUpgrade)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border shadow-sm ${
              isSimulatingUpgrade
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 ring-1 ring-cyan-500/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title="Preview how current transaction volume behaves under the requested higher tier limits"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulatingUpgrade ? 'text-cyan-400 animate-bounce' : 'text-amber-400'}`} />
            <span>{isSimulatingUpgrade ? 'Exit Simulation' : `Simulate ${targetTierConfig.shortName} Limits`}</span>
          </button>

          {/* Toggle Expand/Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-colors"
            title={isExpanded ? 'Collapse Monitor' : 'Expand Monitor'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Progress Bars and Analytics */}
      {isExpanded && (
        <div className="px-6 py-4 space-y-4 border-t border-slate-850 bg-slate-950/60">
          {/* Threshold Alert Banner if nearing limit */}
          {hasHighProximityWarning && !isSimulatingUpgrade && (
            <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isDailyCritical || isDepositCritical
                ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
            }`}>
              <div className="flex items-start gap-2.5">
                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                  isDailyCritical || isDepositCritical ? 'text-rose-400' : 'text-amber-400'
                }`} />
                <div className="text-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>
                      {isDailyCritical
                        ? 'CRITICAL: Account Near 100% Daily Transfer Ceiling'
                        : isDailyWarning
                        ? `Statutory Proximity Alert: Daily Transfer Velocity at ${dailyPercent}%`
                        : `Deposit Ceiling Alert: Cumulative Balance at ${depositPercent}%`}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 font-mono">
                      {formatNgn(dailyRemaining)} remaining today
                    </span>
                  </div>
                  <p className="text-[11px] opacity-90 mt-0.5">
                    Further outward debits exceeding {formatNgn(dailyRemaining)} will trigger automated NIBSS rail decline.
                    Approving the upgrade to <strong className="underline decoration-indigo-400">{targetTierConfig.name}</strong> immediately expands daily transfer capacity to <strong className="text-emerald-300 font-mono">{formatNgn(targetTierConfig.dailyTransferLimit)}</strong>.
                  </p>
                </div>
              </div>

              {onFastApproveUpgrade && (
                <button
                  onClick={onFastApproveUpgrade}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-md self-start sm:self-auto"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Clear & Upgrade Tier</span>
                </button>
              )}
            </div>
          )}

          {/* Simulation Notification Banner */}
          {isSimulatingUpgrade && (
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-cyan-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  <strong>Simulation Active:</strong> Visualizing consumption headroom if applicant is approved for <strong>{targetTierConfig.name}</strong>. Daily limit: <span className="font-mono font-bold text-cyan-300">{formatNgn(targetTierConfig.dailyTransferLimit)}</span> • Cumulative deposit: <span className="font-mono font-bold text-cyan-300">{targetDepositLimit === -1 ? 'Unlimited' : formatNgn(targetDepositLimit)}</span>.
                </span>
              </div>
              <button
                onClick={() => setIsSimulatingUpgrade(false)}
                className="text-[11px] text-cyan-300 underline hover:text-white shrink-0"
              >
                Reset to Active
              </button>
            </div>
          )}

          {/* Dual Progress Bars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PROGRESS BAR 1: DAILY OUTWARD TRANSFER LIMIT */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-200 block">Daily Outward Transfer Limit</span>
                    <span className="text-[10px] text-slate-400">Resets nightly at 00:00:00 WAT</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-mono font-bold ${
                    dailyPercent >= 90 ? 'text-rose-400' : dailyPercent >= 80 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {dailyPercent}% Consumed
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {formatNgn(dailyRemaining)} Headroom
                  </span>
                </div>
              </div>

              {/* The Visual Progress Track */}
              <div className="space-y-1">
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5 relative">
                  {/* Subtle 80% warning line marker */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-amber-500/60 z-10" 
                    style={{ left: '80%' }} 
                    title="80% Threshold Early Warning Marker"
                  />
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out relative ${
                      dailyPercent >= 90
                        ? 'bg-gradient-to-r from-rose-500 to-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.5)]'
                        : dailyPercent >= 80
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                        : dailyPercent >= 50
                        ? 'bg-gradient-to-r from-indigo-500 to-sky-400'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                    style={{ width: `${dailyPercent}%` }}
                  >
                    {/* Animated sheen highlight */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </div>
                </div>

                {/* Range markers */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-0.5">
                  <span>₦0</span>
                  <span className="text-slate-400">Spent: <strong className="text-slate-200">{formatNgn(dailySpent)}</strong></span>
                  <span className="text-amber-400/80">80% Warn</span>
                  <span className="text-slate-300 font-bold">Cap: {formatNgn(effectiveDailyLimit)}</span>
                </div>
              </div>

              {/* Micro Status Chip */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-850 text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  Last Outflow: <span className="text-slate-300">{consumptionData.lastTransferAt || 'Today, 14:18 WAT'}</span>
                </span>
                <span className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${
                  dailyPercent >= 90
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                    : dailyPercent >= 80
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {dailyPercent >= 90 ? 'Capped Soon' : dailyPercent >= 80 ? 'Threshold Alert' : 'Healthy Headroom'}
                </span>
              </div>
            </div>

            {/* PROGRESS BAR 2: CUMULATIVE DEPOSIT / BALANCE CEILING */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Wallet className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-200 block">Cumulative Deposit Ceiling</span>
                    <span className="text-[10px] text-slate-400">Statutory wallet balance & deposit ceiling</span>
                  </div>
                </div>

                <div className="text-right">
                  {isDepositUnlimited ? (
                    <span className="text-xs font-mono font-bold text-cyan-300 flex items-center justify-end gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      UNLIMITED
                    </span>
                  ) : (
                    <>
                      <span className={`text-xs font-mono font-bold ${
                        depositPercent >= 90 ? 'text-rose-400' : depositPercent >= 80 ? 'text-amber-400' : 'text-cyan-400'
                      }`}>
                        {depositPercent}% of Cap
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {formatNgn(depositRemaining)} Inflow Remaining
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* The Visual Progress Track */}
              <div className="space-y-1">
                {isDepositUnlimited ? (
                  <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-cyan-500/30 p-0.5 relative">
                    <div className="h-full w-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full opacity-70 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                  </div>
                ) : (
                  <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5 relative">
                    {/* 80% marker */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-500/60 z-10" 
                      style={{ left: '80%' }} 
                      title="80% Deposit Limit Early Warning Marker"
                    />
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ease-out relative ${
                        depositPercent >= 90
                          ? 'bg-gradient-to-r from-rose-500 to-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.5)]'
                          : depositPercent >= 80
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                          : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                      }`}
                      style={{ width: `${depositPercent}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                  </div>
                )}

                {/* Range markers */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-0.5">
                  <span>₦0</span>
                  <span className="text-slate-400">Current Balance: <strong className="text-slate-200">{formatNgn(depositBalance)}</strong></span>
                  <span className="text-slate-300 font-bold">
                    {isDepositUnlimited ? 'Ceiling: UNLIMITED' : `Max: ${formatNgn(effectiveDepositLimit)}`}
                  </span>
                </div>
              </div>

              {/* Micro Status Chip */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-850 text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  Last Inflow: <span className="text-slate-300">{consumptionData.lastDepositAt || 'Today, 09:42 WAT'}</span>
                </span>
                <span className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${
                  isDepositUnlimited
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    : depositPercent >= 90
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                    : depositPercent >= 80
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {isDepositUnlimited ? 'No Statutory Cap' : depositPercent >= 90 ? 'Near Deposit Freeze' : depositPercent >= 80 ? 'Near Ceiling' : 'Unrestricted'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Comparison Bar: Current Tier vs Requested Target Tier */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-200 block">
                  Capacity Gain Upon Approving {targetTierConfig.shortName}
                </span>
                <span className="text-[11px] text-slate-400">
                  Daily transfer limit expands from <strong className="text-slate-300 font-mono">{formatNgn(currentTierConfig.dailyTransferLimit)}</strong> to <strong className="text-emerald-400 font-mono">{formatNgn(targetTierConfig.dailyTransferLimit)}</strong> ({Math.round(targetTierConfig.dailyTransferLimit / currentTierConfig.dailyTransferLimit)}x expansion).
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              {onOpenChecklist && (
                <button
                  onClick={onOpenChecklist}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-medium transition-colors"
                >
                  Verify Tier Checklist
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
