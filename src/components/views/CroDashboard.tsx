import { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  Activity, 
  Database, 
  Server, 
  Lock, 
  Unlock,
  Radio,
  Sliders,
  UserX,
  Fingerprint,
  FileText,
  Search,
  Check,
  Zap,
  ArrowRight
} from 'lucide-react';
import { FRAUD_ALERTS } from '../../data/mockFintechData';
import { INITIAL_HIGH_RISK_ALERTS } from '../../data/fraudData';
import { FraudAlertItem, HighRiskAlert } from '../../types';

interface CroDashboardProps {
  onOpenFraudDetector?: () => void;
  onOpenHighRiskAlerts?: () => void;
}

export const CroDashboard = ({
  onOpenFraudDetector,
  onOpenHighRiskAlerts,
}: CroDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'high_risk' | 'incident_stream' | 'disaster_recovery'>('high_risk');
  const [alerts, setAlerts] = useState<FraudAlertItem[]>(FRAUD_ALERTS);
  const [highRiskAlerts, setHighRiskAlerts] = useState<HighRiskAlert[]>(INITIAL_HIGH_RISK_ALERTS);
  const [isDrillRunning, setIsDrillRunning] = useState(false);
  const [drillResult, setDrillResult] = useState<string | null>(null);
  const [mitigationToast, setMitigationToast] = useState<string | null>(null);

  const runDisasterRecoveryDrill = () => {
    setIsDrillRunning(true);
    setDrillResult(null);
    setTimeout(() => {
      setIsDrillRunning(false);
      setDrillResult('Automated switchover to Secondary Cluster eu-west-1-b completed in 11.8s. All transactions persisted without packet loss.');
      setTimeout(() => setDrillResult(null), 8000);
    }, 2000);
  };

  const handleQuarantine = (id: string, entity: string) => {
    setHighRiskAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Quarantined' as const } : a))
    );
    setMitigationToast(`Entity ${entity} immediately quarantined. Outgoing ledger rails frozen.`);
    setTimeout(() => setMitigationToast(null), 5000);
  };

  const handleStepUp = (id: string, entity: string) => {
    setMitigationToast(`FIDO2 biometric step-up challenge sent to ${entity}. Session locked until verified.`);
    setTimeout(() => setMitigationToast(null), 5000);
  };

  const handleClearAlert = (id: string) => {
    setHighRiskAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Mitigated' as const } : a))
    );
    setMitigationToast(`Alert ${id} cleared and marked as Mitigated.`);
    setTimeout(() => setMitigationToast(null), 5000);
  };

  const criticalCount = highRiskAlerts.filter(
    (a) => a.severity === 'Critical' && a.status === 'Active Unresolved'
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/50 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> CRO Risk & Fraud Sentinel
            </span>
            <span className="text-xs text-slate-400">admin.ifuturewallet.com • CBN Risk Command</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Fraud Detector, Threat Sentinel & Business Continuity
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Real-time biometric anomaly alerts, carrier SIM swap telemetry, CBN smurfing/structuring prevention, and emergency kill-switch containment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenFraudDetector && (
            <button
              onClick={onOpenFraudDetector}
              className="px-3.5 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Launch Fraud Detector</span>
            </button>
          )}

          {onOpenHighRiskAlerts && (
            <button
              onClick={onOpenHighRiskAlerts}
              className="px-3.5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all animate-pulse"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Review High Risk Alerts ({criticalCount})</span>
            </button>
          )}

          <button
            onClick={runDisasterRecoveryDrill}
            disabled={isDrillRunning}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDrillRunning ? 'animate-spin' : ''}`} />
            <span>{isDrillRunning ? 'Simulating Failover...' : 'Execute DR Drill'}</span>
          </button>
        </div>
      </div>

      {drillResult && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{drillResult}</span>
        </div>
      )}

      {mitigationToast && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center justify-between gap-2.5 animate-in fade-in">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{mitigationToast}</span>
          </div>
          <button 
            onClick={() => setMitigationToast(null)}
            className="text-rose-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Fraud & Threat KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Critical High-Risk Threats</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          </div>
          <span className="text-2xl font-bold text-rose-400 font-mono mt-1 block">
            {criticalCount} Active
          </span>
          <span className="text-[11px] text-slate-400">Immediate containment required</span>
        </div>

        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">Blocked Fraud Attempts</span>
          <span className="text-2xl font-bold text-amber-400 font-mono mt-1 block">428</span>
          <span className="text-[11px] text-emerald-400">100% Mitigated at Edge WAF</span>
        </div>

        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">Auto-Frozen Accounts</span>
          <span className="text-2xl font-bold text-white font-mono mt-1 block">19</span>
          <span className="text-[11px] text-slate-400">Awaiting 2FA / SFU clearance</span>
        </div>

        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">Platform Risk Index</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono mt-1 block">9.4 / 100</span>
          <span className="text-[11px] text-slate-400">Low Risk (Threshold &lt; 25)</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('high_risk')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 font-semibold ${
            activeTab === 'high_risk'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>High-Risk Threat Alerts</span>
          <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-mono font-bold">
            {criticalCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('incident_stream')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 font-semibold ${
            activeTab === 'incident_stream'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Live Anomaly Incident Stream</span>
        </button>

        <button
          onClick={() => setActiveTab('disaster_recovery')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 font-semibold ${
            activeTab === 'disaster_recovery'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Business Continuity & DR Matrix</span>
        </button>
      </div>

      {/* Tab Content: High-Risk Threat Alerts */}
      {activeTab === 'high_risk' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-white">
                  Active High-Risk Threats Awaiting Containment
                </p>
                <p className="text-slate-400 text-[11px]">
                  Alerts flagged by AI Anomaly Models, Telco SIM Sentinel, and NIBSS Clearing Guard.
                </p>
              </div>
            </div>

            {onOpenFraudDetector && (
              <button
                onClick={onOpenFraudDetector}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Simulate / Detect in Engine</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {highRiskAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all ${
                  alert.severity === 'Critical' && alert.status === 'Active Unresolved'
                    ? 'bg-slate-900/90 border-rose-500/50 shadow-lg shadow-rose-950/20'
                    : alert.status === 'Quarantined'
                    ? 'bg-slate-900/50 border-slate-800 opacity-80'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      alert.severity === 'Critical'
                        ? 'bg-rose-500 text-white'
                        : alert.severity === 'High'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="font-mono text-xs text-slate-400 font-semibold">{alert.alertCode}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-cyan-400 font-mono">{alert.affectedEntity}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">{alert.detectionEngine}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono font-bold ${
                      alert.riskScore >= 90 ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      Risk Score: {alert.riskScore}/100
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      alert.status === 'Active Unresolved'
                        ? 'bg-rose-500/20 text-rose-300'
                        : alert.status === 'Quarantined'
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-white mb-1">
                  {alert.title}
                </h4>

                <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                  {alert.description}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs mb-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-rose-300 font-semibold">Suggested Protocol:</span>
                    <span>{alert.suggestedMitigation}</span>
                  </div>
                  {alert.amount && (
                    <span className="font-mono font-bold text-emerald-400 shrink-0">
                      ₦{alert.amount.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={() => handleQuarantine(alert.id, alert.affectedEntity)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Instant Quarantine & Kill-Switch</span>
                  </button>

                  <button
                    onClick={() => handleStepUp(alert.id, alert.affectedEntity)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>Challenge 2FA Step-Up</span>
                  </button>

                  {onOpenFraudDetector && (
                    <button
                      onClick={onOpenFraudDetector}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Examine in Detector</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleClearAlert(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-emerald-400 hover:text-emerald-300 border border-slate-750 text-xs font-semibold flex items-center gap-1.5 transition-colors ml-auto"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Mitigated</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Incident Stream */}
      {activeTab === 'incident_stream' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Active Anomaly & Fraud Incident Stream
            </h3>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Telemetry
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-medium">Attack Vector</th>
                  <th className="pb-3 font-medium">Target Account</th>
                  <th className="pb-3 font-medium">IP Address / Geo</th>
                  <th className="pb-3 font-medium">Severity</th>
                  <th className="pb-3 font-medium">Automated Response</th>
                  <th className="pb-3 font-medium">Timestamp</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3 font-semibold text-slate-200">{alert.eventType}</td>
                    <td className="py-3 font-mono text-cyan-400">{alert.affectedAccount}</td>
                    <td className="py-3 text-slate-300">
                      <span className="font-mono text-slate-400">{alert.ipAddress}</span> ({alert.location})
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          alert.severity === 'Critical'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </td>
                    <td className="py-3 text-emerald-400 font-mono">{alert.actionTaken}</td>
                    <td className="py-3 text-slate-400">{alert.timestamp}</td>
                    <td className="py-3 text-right">
                      <button 
                        onClick={onOpenFraudDetector}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 rounded text-[10px] font-semibold transition-colors"
                      >
                        Inspect Trace
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Business Continuity & Disaster Recovery */}
      {activeTab === 'disaster_recovery' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            Business Continuity & Disaster Recovery Matrix
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-400 block font-medium">Multi-Region Hot Standby</span>
              <span className="text-base font-bold text-emerald-400 mt-1 block">Active / Hot Standby</span>
              <p className="text-slate-400 mt-1">Secondary database cluster synced with zero replication lag across AWS eu-west-1 and af-south-1.</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-400 block font-medium">Backup Integrity (Hourly Snapshots)</span>
              <span className="text-base font-bold text-cyan-400 mt-1 block">100% Verified AES-GCM</span>
              <p className="text-slate-400 mt-1">Immutable WORM (Write Once Read Many) backups with air-gapped cold storage retention for 7 years.</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-400 block font-medium">Last DR Simulation Result</span>
              <span className="text-base font-bold text-indigo-300 mt-1 block">RTO 11.8s • RPO 0.0s</span>
              <p className="text-slate-400 mt-1">Recovery Time Objective & Recovery Point Objective verified within stringent fintech standards.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
