import { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  X, 
  Sliders, 
  Radio, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { HighRiskAlert } from '../../types';

interface HighRiskAlertSentinelProps {
  alerts: HighRiskAlert[];
  onOpenAlertModal: () => void;
  onOpenFraudDetector: () => void;
  isAudioEnabled: boolean;
  onToggleAudio: () => void;
}

export const HighRiskAlertSentinel = ({
  alerts,
  onOpenAlertModal,
  onOpenFraudDetector,
  isAudioEnabled,
  onToggleAudio,
}: HighRiskAlertSentinelProps) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const activeCriticalAlerts = alerts.filter(
    (a) => a.severity === 'Critical' && a.status === 'Active Unresolved'
  );

  const activeHighAlerts = alerts.filter(
    (a) => a.severity === 'High' && a.status === 'Active Unresolved'
  );

  const totalUnresolved = activeCriticalAlerts.length + activeHighAlerts.length;

  if (isDismissed || totalUnresolved === 0) return null;

  const topAlert = activeCriticalAlerts[0] || activeHighAlerts[0];

  return (
    <div className="relative z-30 bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950/70 border-b border-rose-500/40 text-slate-100 px-4 py-2.5 shadow-lg transition-all animate-in slide-in-from-top-2">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        {/* Left: Blinking Beacon & Threat Ticker */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-300 text-[10px] font-extrabold uppercase tracking-wider border border-rose-500/50">
              High-Risk Sentinel
            </span>
          </div>

          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-rose-200 shrink-0">
              {activeCriticalAlerts.length} Critical Threats:
            </span>
            {topAlert && (
              <span className="text-slate-300 truncate">
                <strong className="text-white font-mono">{topAlert.alertCode}</strong> - {topAlert.title} ({topAlert.affectedEntity})
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          {/* Audio Beep Toggle */}
          <button
            onClick={onToggleAudio}
            className={`p-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-colors ${
              isAudioEnabled
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : 'bg-slate-800 border-slate-750 text-slate-400'
            }`}
            title={isAudioEnabled ? 'Mute Audio Siren' : 'Enable Siren Audio'}
          >
            {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5 text-rose-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Open High-Risk Alerts Modal */}
          <button
            onClick={onOpenAlertModal}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>High Risk Alert ({totalUnresolved})</span>
          </button>

          {/* Open Fraud Detector */}
          <button
            onClick={onOpenFraudDetector}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Fraud Detector</span>
          </button>

          {/* Dismiss Banner */}
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors ml-1"
            title="Minimize alert bar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
