import { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Activity, 
  Flame, 
  Globe, 
  Key, 
  CheckCircle2, 
  Radio, 
  Terminal,
  AlertOctagon
} from 'lucide-react';
import { SECURITY_AUDIT_LOGS } from '../../data/mockFintechData';

export const SecurityDashboard = () => {
  const [wafStatus, setWafStatus] = useState<'Normal' | 'Under Attack Mode'>('Normal');
  const [logs] = useState(SECURITY_AUDIT_LOGS);

  const toggleWafShield = () => {
    setWafStatus((prev) => (prev === 'Normal' ? 'Under Attack Mode' : 'Normal'));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full">
              CISO Cyber Command Center
            </span>
            <span className="text-xs text-slate-400">admin.ifuturewallet.com • PCI-DSS Level 1 Enclave</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Firewall Defense, Threat Intelligence & Immutable Audit Trail
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Cloudflare Enterprise DDoS mitigation, AWS WAF rulesets, biometric MFA enforcement, and real-time security incident response.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleWafShield}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
              wafStatus === 'Under Attack Mode'
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            {wafStatus === 'Under Attack Mode' ? 'WAF: Under Attack Mode (Active)' : 'Activate Under Attack Shield'}
          </button>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">Edge WAF Status</span>
          <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">99.999% Filtered</span>
          <span className="text-[11px] text-slate-500">14.2M bad requests stopped</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">DDoS Protection</span>
          <span className="text-xl font-bold text-cyan-400 font-mono mt-1 block">Active (Anycast)</span>
          <span className="text-[11px] text-slate-500">Cloudflare Magic Transit</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">MFA Enforcement</span>
          <span className="text-xl font-bold text-white font-mono mt-1 block">100% Mandatory</span>
          <span className="text-[11px] text-emerald-400">FIDO2 / Hardware token</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">Pen-Test Clearance</span>
          <span className="text-xl font-bold text-indigo-300 font-mono mt-1 block">Grade A+</span>
          <span className="text-[11px] text-slate-500">Audited by Bishop Fox</span>
        </div>
      </div>

      {/* Active Defense Grid */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            Firewall Rulesets & Bot Protection Enclaves
          </h3>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> Threat Feeds Live
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-slate-400 block font-medium">Rate Limiting Threshold</span>
            <span className="text-base font-bold text-slate-200 mt-1 block">300 Req/min per IP</span>
            <p className="text-slate-400 mt-1">Automatic progressive tar-pitting and biometric captcha challenge for anomalies.</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-slate-400 block font-medium">Credential Stuffing Guard</span>
            <span className="text-base font-bold text-emerald-400 mt-1 block">Zero False Positives</span>
            <p className="text-slate-400 mt-1">Dark web leak matching blocks compromised passwords before hitting authentication endpoints.</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-slate-400 block font-medium">Zero-Trust Network Access</span>
            <span className="text-base font-bold text-cyan-400 mt-1 block">mTLS Strict Tunnel</span>
            <p className="text-slate-400 mt-1">Internal database and server shell accessible strictly via mutual TLS cryptographic handshakes.</p>
          </div>
        </div>
      </div>

      {/* Security Audit Trail Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4 text-emerald-400" />
          Immutable Administrative & Security Audit Trail
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-medium">Admin Operator</th>
                <th className="pb-3 font-medium">Action Performed</th>
                <th className="pb-3 font-medium">Target Subsystem</th>
                <th className="pb-3 font-medium">Origin IP Address</th>
                <th className="pb-3 font-medium">Severity</th>
                <th className="pb-3 font-medium text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-3 font-semibold text-slate-200">{log.operator}</td>
                  <td className="py-3 text-slate-300">{log.action}</td>
                  <td className="py-3 font-mono text-cyan-400">{log.subsystem}</td>
                  <td className="py-3 font-mono text-slate-400">{log.ipAddress}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        log.severity === 'High'
                          ? 'bg-rose-500/20 text-rose-300'
                          : log.severity === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400 text-right">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
