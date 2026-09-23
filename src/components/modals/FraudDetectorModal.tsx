import { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Sliders, 
  Smartphone, 
  MapPin, 
  Wifi, 
  Radio, 
  Zap, 
  RefreshCw, 
  Lock, 
  Fingerprint, 
  FileText, 
  UserX, 
  Check, 
  ArrowRight,
  Sparkles,
  Layers,
  Activity,
  CreditCard
} from 'lucide-react';
import { PRESET_FRAUD_SCENARIOS, FraudScenarioProfile } from '../../data/fraudData';
import { FraudDetectionRule, FraudAnalysisResult } from '../../types';

interface FraudDetectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAccountId?: string;
  onAccountFrozen?: (accountId: string) => void;
}

export const FraudDetectorModal = ({
  isOpen,
  onClose,
  initialAccountId,
  onAccountFrozen,
}: FraudDetectorModalProps) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scen-sim-ato');
  
  // Form state
  const activeScenario = PRESET_FRAUD_SCENARIOS.find((s) => s.id === selectedScenarioId) || PRESET_FRAUD_SCENARIOS[0];
  
  const [transactionId, setTransactionId] = useState(activeScenario.defaultData.transactionId);
  const [accountId, setAccountId] = useState(initialAccountId || activeScenario.defaultData.accountId);
  const [accountName, setAccountName] = useState(activeScenario.defaultData.accountName);
  const [amount, setAmount] = useState<number>(activeScenario.defaultData.amount);
  const [currency, setCurrency] = useState<'NGN' | 'USD'>(activeScenario.defaultData.currency);
  const [channel, setChannel] = useState(activeScenario.defaultData.channel);
  const [location, setLocation] = useState(activeScenario.defaultData.location);
  const [ipAddress, setIpAddress] = useState(activeScenario.defaultData.ipAddress);
  const [deviceFingerprint, setDeviceFingerprint] = useState(activeScenario.defaultData.deviceFingerprint);
  const [isRooted, setIsRooted] = useState(activeScenario.defaultData.isRooted);
  const [simSwapDetected, setSimSwapDetected] = useState(activeScenario.defaultData.simSwapDetected);
  const [bvnMatch, setBvnMatch] = useState(activeScenario.defaultData.bvnMatch);
  const [recentTransfers60s, setRecentTransfers60s] = useState(activeScenario.defaultData.recentTransfers60s);
  const [isBlacklisted, setIsBlacklisted] = useState(activeScenario.defaultData.isBlacklisted);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Load preset scenario
  const handleSelectScenario = (scen: FraudScenarioProfile) => {
    setSelectedScenarioId(scen.id);
    setTransactionId(scen.defaultData.transactionId);
    setAccountId(scen.defaultData.accountId);
    setAccountName(scen.defaultData.accountName);
    setAmount(scen.defaultData.amount);
    setCurrency(scen.defaultData.currency);
    setChannel(scen.defaultData.channel);
    setLocation(scen.defaultData.location);
    setIpAddress(scen.defaultData.ipAddress);
    setDeviceFingerprint(scen.defaultData.deviceFingerprint);
    setIsRooted(scen.defaultData.isRooted);
    setSimSwapDetected(scen.defaultData.simSwapDetected);
    setBvnMatch(scen.defaultData.bvnMatch);
    setRecentTransfers60s(scen.defaultData.recentTransfers60s);
    setIsBlacklisted(scen.defaultData.isBlacklisted);
    setActionSuccessMessage(null);
  };

  // Real-time calculation of Fraud Analysis Result
  const analysisResult: FraudAnalysisResult = useMemo(() => {
    const rules: FraudDetectionRule[] = [];
    let score = 5; // Base baseline score

    // 1. SIM Swap Rule
    if (simSwapDetected) {
      score += 28;
      rules.push({
        id: 'rule-sim',
        name: 'Telecommunications Carrier SIM Replacement Event',
        category: 'Identity/SIM',
        weight: 28,
        status: 'Flagged',
        details: 'MTN/Airtel API reported IMSI/ICCID change within the last 2 hours. High probability of Account Takeover (ATO).',
      });
    } else {
      rules.push({
        id: 'rule-sim',
        name: 'SIM Card Carrier Age & Integrity',
        category: 'Identity/SIM',
        weight: 0,
        status: 'Passed',
        details: 'SIM card has been persistently active on primary handset for > 180 days with no carrier swap alerts.',
      });
    }

    // 2. Geolocation / Impossible Travel Rule
    const hasLocationAnomaly = location.toLowerCase().includes('russia') || location.toLowerCase().includes('amsterdam') || location.toLowerCase().includes('vpn');
    if (hasLocationAnomaly) {
      score += 26;
      rules.push({
        id: 'rule-geo',
        name: 'Impossible Travel / Cross-Border Proxy Discrepancy',
        category: 'Geolocation',
        weight: 26,
        status: 'Flagged',
        details: `IP (${ipAddress}) geographically resolves to ${location}, conflicting with resident KYC address and concurrent POS telemetry.`,
      });
    } else {
      rules.push({
        id: 'rule-geo',
        name: 'Geographical Coordinates & ISP Velocity',
        category: 'Geolocation',
        weight: 0,
        status: 'Passed',
        details: 'Origin IP matches registered domestic regional IP cluster in Nigeria.',
      });
    }

    // 3. Velocity / Burst Rule
    if (recentTransfers60s >= 4) {
      score += 22;
      rules.push({
        id: 'rule-vel',
        name: 'High-Frequency Burst Transfer Velocity',
        category: 'Velocity',
        weight: 22,
        status: 'Flagged',
        details: `${recentTransfers60s} consecutive outbound transfers initiated in under 60 seconds (Standard threshold <= 2).`,
      });
    } else if (recentTransfers60s >= 2) {
      score += 10;
      rules.push({
        id: 'rule-vel',
        name: 'Elevated Velocity Index',
        category: 'Velocity',
        weight: 10,
        status: 'Warning',
        details: `${recentTransfers60s} transfers initiated within 60 seconds. Elevated velocity detected.`,
      });
    } else {
      rules.push({
        id: 'rule-vel',
        name: 'Normal Transaction Pacing',
        category: 'Velocity',
        weight: 0,
        status: 'Passed',
        details: 'Transaction frequency conforms to standard user behavior models.',
      });
    }

    // 4. Device Fingerprint & Root Detection
    if (isRooted) {
      score += 18;
      rules.push({
        id: 'rule-dev',
        name: 'Jailbroken / Rooted Handset or Emulated Environment',
        category: 'Device/Root',
        weight: 18,
        status: 'Flagged',
        details: 'Hardware attestation failed: SU binary presence detected; safety-net integrity compromised; possible bot runner.',
      });
    } else {
      rules.push({
        id: 'rule-dev',
        name: 'Hardware TEE & Enclave Attestation',
        category: 'Device/Root',
        weight: 0,
        status: 'Passed',
        details: 'Genuine OEM hardware with encrypted Secure Enclave key storage.',
      });
    }

    // 5. Amount Structuring (CBN Anti-Smurfing Limit)
    // ₦5,000,000 threshold in Nigeria requires CTR
    if (currency === 'NGN' && amount >= 4500000 && amount < 5000000) {
      score += 16;
      rules.push({
        id: 'rule-struct',
        name: 'Statutory Currency Transaction Structuring (Smurfing)',
        category: 'Amount/Structuring',
        weight: 16,
        status: 'Flagged',
        details: `Amount of ₦${amount.toLocaleString()} is positioned just below the ₦5,000,000 mandatory statutory reporting threshold.`,
      });
    } else if (currency === 'NGN' && amount > 25000000) {
      score += 12;
      rules.push({
        id: 'rule-struct',
        name: 'Large-Value Outflow Trigger (CBN Section 4.2)',
        category: 'Amount/Structuring',
        weight: 12,
        status: 'Warning',
        details: `High-value sum of ₦${amount.toLocaleString()} requires secondary Maker-Checker authorization.`,
      });
    } else {
      rules.push({
        id: 'rule-struct',
        name: 'Statutory Threshold Conformity',
        category: 'Amount/Structuring',
        weight: 0,
        status: 'Passed',
        details: 'Transfer amount conforms with authorized tier parameters.',
      });
    }

    // 6. Identity & Blacklist Check
    if (isBlacklisted) {
      score += 35;
      rules.push({
        id: 'rule-black',
        name: 'Sanctions, NFIU or INTERPOL Watchlist Match',
        category: 'Watchlist/AML',
        weight: 35,
        status: 'Flagged',
        details: 'Associated IP address, device, or wallet appears on NFIU or inter-bank fraud blacklist.',
      });
    }

    if (!bvnMatch) {
      score += 24;
      rules.push({
        id: 'rule-bvn',
        name: 'NIBSS BVN / NIN Biometric Hash Mismatch',
        category: 'Identity/SIM',
        weight: 24,
        status: 'Flagged',
        details: 'Account identity credentials do not match cryptographic BVN record held at Central Bank registry.',
      });
    }

    const finalScore = Math.min(100, Math.max(0, score));

    let threatLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
    let recommendedAction: 'Approve' | 'Challenge 2FA' | 'Hold for Review' | 'Auto-Freeze Account' = 'Approve';

    if (finalScore >= 85) {
      threatLevel = 'Critical';
      recommendedAction = 'Auto-Freeze Account';
    } else if (finalScore >= 60) {
      threatLevel = 'High';
      recommendedAction = 'Hold for Review';
    } else if (finalScore >= 30) {
      threatLevel = 'Medium';
      recommendedAction = 'Challenge 2FA';
    } else {
      threatLevel = 'Low';
      recommendedAction = 'Approve';
    }

    return {
      transactionId,
      accountId,
      accountName,
      amount,
      currency,
      channel,
      timestamp: 'Just now (Real-time telemetry)',
      riskScore: finalScore,
      threatLevel,
      rules,
      recommendedAction,
      location,
      ipAddress,
      deviceFingerprint,
      simSwapDetected,
      bvnMatch,
      isBlacklisted,
    };
  }, [
    transactionId,
    accountId,
    accountName,
    amount,
    currency,
    channel,
    location,
    ipAddress,
    deviceFingerprint,
    isRooted,
    simSwapDetected,
    bvnMatch,
    recentTransfers60s,
    isBlacklisted,
  ]);

  const handleSimulateAnalysis = () => {
    setIsAnalyzing(true);
    setActionSuccessMessage(null);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 450);
  };

  const handleExecuteAction = (actionName: string) => {
    if (actionName === 'freeze') {
      setActionSuccessMessage(`Account ${accountId} has been quarantined. All wallet balances frozen, session keys revoked, and NFIU alert dispatched.`);
      if (onAccountFrozen) onAccountFrozen(accountId);
    } else if (actionName === 'stepup') {
      setActionSuccessMessage(`Out-of-band WebAuthn FIDO2 / Face ID challenge sent to verified phone of ${accountName}. Outbound rails paused.`);
    } else if (actionName === 'blacklist') {
      setIsBlacklisted(true);
      setActionSuccessMessage(`IP ${ipAddress} and Device ${deviceFingerprint.slice(0, 14)}... pushed to real-time Edge WAF Blacklist.`);
    } else if (actionName === 'sar') {
      setActionSuccessMessage(`Electronic Suspicious Activity Report (SAR-2026-${Math.floor(1000 + Math.random() * 9000)}) filed with NFIU & CBN SFU.`);
    } else if (actionName === 'whitelist') {
      setActionSuccessMessage(`Transaction ${transactionId} confirmed as Verified False Positive. Processing authorized on primary clearing switch.`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider border border-rose-500/40">
                  Real-Time Engine v4.2
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Multi-Vector Heuristic & Anomaly Sentinel
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Enterprise Fraud Detector & Risk Scoring Engine
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateAnalysis}
              disabled={isAnalyzing}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>Re-evaluate Signals</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Scenario Preset Selector Bar */}
        <div className="px-6 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Presets:
          </span>
          {PRESET_FRAUD_SCENARIOS.map((scen) => (
            <button
              key={scen.id}
              onClick={() => handleSelectScenario(scen)}
              className={`px-3 py-1.5 rounded-lg shrink-0 font-medium transition-all ${
                selectedScenarioId === scen.id
                  ? 'bg-rose-500 text-white font-semibold shadow-md shadow-rose-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-750'
              }`}
            >
              {scen.name}
            </button>
          ))}
        </div>

        {/* Success Action Notification Banner */}
        {actionSuccessMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccessMessage}</span>
            </div>
            <button 
              onClick={() => setActionSuccessMessage(null)}
              className="text-emerald-400 hover:text-emerald-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
          
          {/* Left Column: Transaction & Telemetry Parameters (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Transaction & Entity Telemetry
                </span>
                <span className="text-[10px] font-mono text-slate-500">Live Ingress Payload</span>
              </div>

              {/* Target Account & Name */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Target Account ID</label>
                  <input
                    type="text"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Account Holder</label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Amount & Currency & Channel */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Transaction Value</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-slate-500 font-mono">{currency === 'NGN' ? '₦' : '$'}</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full pl-7 pr-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono font-bold text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as 'NGN' | 'USD')}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="NGN">NGN (₦)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              {/* Channel */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Clearing Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none"
                >
                  <option value="NIP Bank Transfer">NIBSS Instant Payment (NIP Transfer)</option>
                  <option value="Card Online">Online 3DS Card Acquiring</option>
                  <option value="POS Terminal">SANEF Agency POS Terminal</option>
                  <option value="Virtual Account">Dynamic Virtual NUBAN Account</option>
                  <option value="USSD *990#">Offline Telco USSD *990#</option>
                </select>
              </div>

              {/* Geo & IP */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Location Telemetry</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Source IP Address</label>
                  <input
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Real-time Toggles for Anomaly Injection */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Simulate Attack Indicators:
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* SIM Swap */}
                  <button
                    type="button"
                    onClick={() => setSimSwapDetected(!simSwapDetected)}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition-colors ${
                      simSwapDetected
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>SIM Swap Alert</span>
                    <span className={`w-2 h-2 rounded-full ${simSwapDetected ? 'bg-rose-400 animate-ping' : 'bg-slate-600'}`}></span>
                  </button>

                  {/* Root / Jailbreak */}
                  <button
                    type="button"
                    onClick={() => setIsRooted(!isRooted)}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition-colors ${
                      isRooted
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>Rooted / Emulator</span>
                    <span className={`w-2 h-2 rounded-full ${isRooted ? 'bg-rose-400' : 'bg-slate-600'}`}></span>
                  </button>

                  {/* BVN Match */}
                  <button
                    type="button"
                    onClick={() => setBvnMatch(!bvnMatch)}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition-colors ${
                      !bvnMatch
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                        : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    <span>BVN Identity Match</span>
                    <span className={`text-[10px] font-mono ${bvnMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {bvnMatch ? 'MATCH' : 'MISMATCH'}
                    </span>
                  </button>

                  {/* Watchlist */}
                  <button
                    type="button"
                    onClick={() => setIsBlacklisted(!isBlacklisted)}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition-colors ${
                      isBlacklisted
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>Sanctions / Blacklist</span>
                    <span className={`w-2 h-2 rounded-full ${isBlacklisted ? 'bg-rose-400' : 'bg-slate-600'}`}></span>
                  </button>
                </div>

                {/* Velocity Slider */}
                <div className="pt-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Rapid Outflows in 60s:</span>
                    <span className="font-mono font-bold text-white">{recentTransfers60s} transfers</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={recentTransfers60s}
                    onChange={(e) => setRecentTransfers60s(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Composite Risk Gauge, Recommendation & Rule Audit (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Real-Time Risk Score Banner */}
            <div className={`p-5 rounded-2xl border transition-all ${
              analysisResult.threatLevel === 'Critical'
                ? 'bg-gradient-to-r from-rose-950/60 to-slate-950 border-rose-500/50 shadow-xl shadow-rose-950/40'
                : analysisResult.threatLevel === 'High'
                ? 'bg-gradient-to-r from-amber-950/60 to-slate-950 border-amber-500/50 shadow-xl shadow-amber-950/40'
                : analysisResult.threatLevel === 'Medium'
                ? 'bg-gradient-to-r from-yellow-950/40 to-slate-950 border-yellow-500/40'
                : 'bg-gradient-to-r from-emerald-950/40 to-slate-950 border-emerald-500/40'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-400">Composite Threat Index</span>
                    <span className="text-slate-600">•</span>
                    <span className={`text-xs font-bold uppercase tracking-wider font-mono ${
                      analysisResult.threatLevel === 'Critical'
                        ? 'text-rose-400 animate-pulse'
                        : analysisResult.threatLevel === 'High'
                        ? 'text-amber-400'
                        : analysisResult.threatLevel === 'Medium'
                        ? 'text-yellow-400'
                        : 'text-emerald-400'
                    }`}>
                      {analysisResult.threatLevel} Threat
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-extrabold font-mono tracking-tight ${
                      analysisResult.threatLevel === 'Critical'
                        ? 'text-rose-400'
                        : analysisResult.threatLevel === 'High'
                        ? 'text-amber-400'
                        : analysisResult.threatLevel === 'Medium'
                        ? 'text-yellow-300'
                        : 'text-emerald-400'
                    }`}>
                      {analysisResult.riskScore}
                    </span>
                    <span className="text-slate-500 font-mono text-sm">/ 100</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Automated Decision: <strong className="text-white font-mono uppercase underline decoration-rose-500">{analysisResult.recommendedAction}</strong>
                  </p>
                </div>

                {/* Progress Bar Gauge */}
                <div className="sm:w-48 space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Safe (0)</span>
                    <span>Critical (100)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        analysisResult.threatLevel === 'Critical'
                          ? 'bg-rose-500'
                          : analysisResult.threatLevel === 'High'
                          ? 'bg-amber-500'
                          : analysisResult.threatLevel === 'Medium'
                          ? 'bg-yellow-400'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${analysisResult.riskScore}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block text-right">
                    Calculated across 6 vectors
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleExecuteAction('freeze')}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-rose-600/20 transition-all"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Freeze Account & Funds</span>
                </button>

                <button
                  onClick={() => handleExecuteAction('stepup')}
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>Challenge 2FA Step-Up</span>
                </button>

                <button
                  onClick={() => handleExecuteAction('blacklist')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Blacklist IP & Device</span>
                </button>

                <button
                  onClick={() => handleExecuteAction('sar')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>File NFIU SAR</span>
                </button>

                <button
                  onClick={() => handleExecuteAction('whitelist')}
                  className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ml-auto"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Whitelist / False Positive</span>
                </button>
              </div>
            </div>

            {/* Individual Rule Evaluation Breakdown */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-400" /> Rule-by-Rule Heuristic Audit Breakdown
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {analysisResult.rules.filter((r) => r.status === 'Flagged').length} Triggered Rules
                </span>
              </div>

              <div className="space-y-2">
                {analysisResult.rules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`p-3 rounded-xl border text-xs transition-colors ${
                      rule.status === 'Flagged'
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                        : rule.status === 'Warning'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase font-mono ${
                          rule.status === 'Flagged'
                            ? 'bg-rose-500 text-white'
                            : rule.status === 'Warning'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {rule.status}
                        </span>
                        <span className="font-semibold text-white">{rule.name}</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-slate-400">
                        +{rule.weight} pts
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed pl-1">
                      {rule.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Regulatory Footer */}
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-[11px] text-slate-400 flex items-center justify-between">
              <span>
                Compliance: <strong>Central Bank of Nigeria (CBN) Cyber-Security & Anti-Fraud Guidelines 2025</strong>
              </span>
              <span className="font-mono text-cyan-400">Audit ID: FRD-ENG-{Date.now().toString().slice(-6)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
