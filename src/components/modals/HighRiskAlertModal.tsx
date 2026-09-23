import { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  X, 
  Filter, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Lock, 
  UserX, 
  ExternalLink, 
  Radio, 
  Clock, 
  MapPin, 
  ChevronRight,
  ShieldCheck,
  Search,
  Sparkles,
  Smartphone,
  CreditCard,
  Building2,
  Terminal,
  Zap
} from 'lucide-react';
import { HighRiskAlert } from '../../types';

interface HighRiskAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: HighRiskAlert[];
  onQuarantineAlert: (alertId: string) => void;
  onMitigateAlert: (alertId: string) => void;
  onDismissAlert: (alertId: string) => void;
  onInspectInFraudDetector: (alert: HighRiskAlert) => void;
  isAudioEnabled: boolean;
  onToggleAudio: () => void;
}

export const HighRiskAlertModal = ({
  isOpen,
  onClose,
  alerts,
  onQuarantineAlert,
  onMitigateAlert,
  onDismissAlert,
  onInspectInFraudDetector,
  isAudioEnabled,
  onToggleAudio,
}: HighRiskAlertModalProps) => {
  const [selectedSeverity, setSelectedSeverity] = useState<'All' | 'Critical' | 'High' | 'Elevated'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(alerts[0]?.id || null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = selectedSeverity === 'All' || alert.severity === selectedSeverity;
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.affectedEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.alertCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const selectedAlert = alerts.find((a) => a.id === selectedAlertId) || filteredAlerts[0];

  const handleQuarantine = (id: string) => {
    onQuarantineAlert(id);
    setStatusMessage(`Alert ${id} quarantined: entity frozen and session tokens invalidated.`);
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleMitigate = (id: string) => {
    onMitigateAlert(id);
    setStatusMessage(`Alert ${id} marked as Mitigated.`);
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const criticalCount = alerts.filter((a) => a.severity === 'Critical' && a.status === 'Active Unresolved').length;
  const highCount = alerts.filter((a) => a.severity === 'High' && a.status === 'Active Unresolved').length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-rose-500/40 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
              {criticalCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-lg animate-ping"></span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider border border-rose-500/30">
                  Critical Incident Command
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-rose-400 animate-pulse" /> Live Telemetry Sentinel
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                High-Risk Anomaly & Fraud Alert Sentinel
                <span className="text-xs font-semibold px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded-full border border-rose-500/30">
                  {criticalCount} Critical Active
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Audio Toggle */}
            <button
              onClick={onToggleAudio}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isAudioEnabled
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title={isAudioEnabled ? 'Siren Audio Alert Active (Click to Mute)' : 'Audio Muted (Click to Enable)'}
            >
              {isAudioEnabled ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{isAudioEnabled ? 'Audio Alert On' : 'Muted'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-slate-500 text-[11px] font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Severity:
            </span>
            {(['All', 'Critical', 'High', 'Elevated'] as const).map((sev) => {
              const count = sev === 'All' 
                ? alerts.length 
                : alerts.filter((a) => a.severity === sev).length;
              return (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                    selectedSeverity === sev
                      ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{sev}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    sev === 'Critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search entity, code, or vector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div className="mx-6 mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Master-Detail Split Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[70vh] overflow-y-auto">
          
          {/* Alerts List (5 cols) */}
          <div className="lg:col-span-5 space-y-2.5 overflow-y-auto pr-1">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 border border-slate-800 rounded-xl">
                No high-risk alerts found matching the criteria.
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isSelected = selectedAlert?.id === alert.id;
                return (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedAlertId(alert.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-rose-500/60 shadow-lg shadow-rose-950/30'
                        : 'bg-slate-950/80 hover:bg-slate-900 border-slate-850 hover:border-slate-750'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
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
                        <span className="font-mono text-[11px] text-slate-400">{alert.alertCode}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold">
                        <span className="text-slate-500">Risk:</span>
                        <span className={alert.riskScore >= 90 ? 'text-rose-400' : 'text-amber-400'}>
                          {alert.riskScore}/100
                        </span>
                      </div>
                    </div>

                    <h4 className="text-xs font-semibold text-white line-clamp-1 mb-1">
                      {alert.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                      {alert.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-850">
                      <span className="font-mono text-cyan-400">{alert.affectedEntity}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {alert.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Alert Details Dossier & Containment Panel (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {selectedAlert ? (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                
                {/* Dossier Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-850">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        selectedAlert.severity === 'Critical'
                          ? 'bg-rose-500 text-white animate-pulse'
                          : selectedAlert.severity === 'High'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {selectedAlert.severity} PRIORITY
                      </span>
                      <span className="text-xs font-mono text-slate-400">{selectedAlert.alertCode}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400">{selectedAlert.detectionEngine}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {selectedAlert.title}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Risk Score</span>
                    <span className={`text-2xl font-black font-mono ${
                      selectedAlert.riskScore >= 90 ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {selectedAlert.riskScore}
                    </span>
                    <span className="text-slate-500 font-mono text-xs"> / 100</span>
                  </div>
                </div>

                {/* Technical Overview Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Affected Entity</span>
                    <span className="font-mono text-cyan-400 font-semibold block mt-0.5 truncate">
                      {selectedAlert.affectedEntity}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{selectedAlert.entityType}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Location / Geo</span>
                    <span className="text-slate-200 font-medium block mt-0.5 truncate">
                      {selectedAlert.location || 'Distributed'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                      {selectedAlert.ipAddress || 'Internal Relay'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-850 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Amount at Risk</span>
                    <span className="text-base font-bold font-mono text-white block mt-0.5">
                      {selectedAlert.amount ? `₦${selectedAlert.amount.toLocaleString()}` : 'N/A'}
                    </span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">High-Value Clearance</span>
                  </div>
                </div>

                {/* Full Attack Vector Details */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-850 space-y-2 text-xs">
                  <span className="text-[11px] font-semibold text-slate-300 block">
                    Anomaly Analysis & Forensic Findings:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedAlert.description}
                  </p>
                </div>

                {/* Recommended Mitigation Protocol */}
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1.5 text-xs">
                  <span className="text-[11px] font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Prescribed Containment Protocol:
                  </span>
                  <p className="text-rose-200/90 leading-relaxed">
                    {selectedAlert.suggestedMitigation}
                  </p>
                </div>

                {/* Action Triggers */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => handleQuarantine(selectedAlert.id)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Instant Quarantine & Kill-Switch</span>
                  </button>

                  <button
                    onClick={() => onInspectInFraudDetector(selectedAlert)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-indigo-200" />
                    <span>Open in Fraud Detector Engine</span>
                  </button>

                  <button
                    onClick={() => handleMitigate(selectedAlert.id)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mark Mitigated</span>
                  </button>

                  <button
                    onClick={() => onDismissAlert(selectedAlert.id)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors ml-auto"
                  >
                    <span>Dismiss</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 border border-slate-800 rounded-2xl">
                Select an alert from the left to inspect forensic telemetry.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>NIBSS & CBN Financial Intelligence Unit (NFIU) Real-Time Hook Active</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            Encrypted TLS 1.3 • AES-256-GCM
          </span>
        </div>

      </div>
    </div>
  );
};
