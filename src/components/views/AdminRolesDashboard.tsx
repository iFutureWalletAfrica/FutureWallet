import { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Lock, 
  Key, 
  AlertTriangle, 
  FileText, 
  Download, 
  RefreshCw,
  Search,
  Filter,
  Check,
  Building2,
  Terminal,
  Activity
} from 'lucide-react';
import { 
  ADMIN_ROLES_CATALOG, 
  MAKER_CHECKER_QUEUE,
  NATIONAL_FINTECH_METRICS
} from '../../data/mockFintechData';
import { MakerCheckerApprovalItem, AdminRoleDefinition } from '../../types';
import { NigeriaAdminTreemap } from '../charts/NigeriaAdminTreemap';
import { Network } from 'lucide-react';

interface AdminRolesDashboardProps {
  onOpenReportExport?: () => void;
  onNavigateToTerritory?: (level: 'national' | 'regional' | 'state' | 'lga') => void;
}

export const AdminRolesDashboard = ({
  onOpenReportExport,
  onNavigateToTerritory
}: AdminRolesDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'maker_checker' | 'rbac_matrix' | 'treemap' | 'emergency_controls' | 'cbn_audit'>('maker_checker');
  const [approvalQueue, setApprovalQueue] = useState<MakerCheckerApprovalItem[]>(MAKER_CHECKER_QUEUE);
  const [searchRoleQuery, setSearchRoleQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<AdminRoleDefinition | null>(ADMIN_ROLES_CATALOG[0]);
  const [notification, setNotification] = useState<string | null>(null);

  // Emergency Killswitch states
  const [killSwitches, setKillSwitches] = useState({
    globalSettlementSwitch: true, // true = online / active
    cicoAgentFloatCap: true,
    instantNipSwitch: true,
    thirdPartyApiGateway: true,
    ussdBankingSwitch: true,
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleApprove = (id: string) => {
    setApprovalQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Approved & Executed',
              checkerName: 'Engr. Kabiru Sani (Super Admin Dual Signature)',
            }
          : item
      )
    );
    showToast('Transaction dual-signed and broadcast to NIBSS clearing rails successfully.');
  };

  const handleReject = (id: string) => {
    setApprovalQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Rejected',
              checkerName: 'Rejected by Admin Quorum',
            }
          : item
      )
    );
    showToast('Item rejected and returned to initiator with audit note.');
  };

  const toggleSwitch = (key: keyof typeof killSwitches, label: string) => {
    setKillSwitches((prev) => {
      const nextVal = !prev[key];
      showToast(`${label} is now ${nextVal ? 'ENABLED (Normal)' : 'EMERGENCY FROZEN'}`);
      return { ...prev, [key]: nextVal };
    });
  };

  const pendingCount = approvalQueue.filter((item) => item.status === 'Pending Dual Signature').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 shadow-2xl flex items-center gap-3 text-xs animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full flex items-center gap-1.5">
              <Key className="w-3 h-3" />
              Central Bank of Nigeria (CBN) RBAC Standard
            </span>
            <span className="text-xs text-slate-400 font-mono">admin.ifuturewallet.com • Master Admin Matrix</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Admin Roles & Maker-Checker Governance Console
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Multi-tier role-based access control (RBAC), CBN-mandated Dual-Control Maker-Checker authorization workflows, and emergency infrastructure failover switches.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{pendingCount} Dual Approvals Pending</span>
          </div>
          {onOpenReportExport && (
            <button
              onClick={onOpenReportExport}
              className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Trail</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-slate-800 text-xs font-medium gap-2">
        <button
          onClick={() => setActiveTab('maker_checker')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'maker_checker'
              ? 'border-indigo-400 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Maker-Checker Approval Queue</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('rbac_matrix')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'rbac_matrix'
              ? 'border-indigo-400 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Admin Roles & Permissions Matrix ({ADMIN_ROLES_CATALOG.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('treemap')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'treemap'
              ? 'border-emerald-400 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Nigeria Admin Hierarchy Treemap</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
            D3.js
          </span>
        </button>

        <button
          onClick={() => setActiveTab('emergency_controls')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'emergency_controls'
              ? 'border-rose-400 text-rose-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Emergency Kill-Switches & CBN Circuit Breakers</span>
        </button>

        <button
          onClick={() => setActiveTab('cbn_audit')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'cbn_audit'
              ? 'border-emerald-400 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Regulatory Compliance Dossier</span>
        </button>
      </div>

      {/* Tab Content: Maker-Checker Approval Queue */}
      {activeTab === 'maker_checker' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-slate-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-amber-300 mb-0.5">
                  Central Bank of Nigeria (CBN) Dual-Control Requirement (Section 4.2 - Mobile Money Framework)
                </p>
                <p className="text-slate-400">
                  Transactions exceeding ₦25,000,000, state revenue remittances, emergency liquidity grants, and AML freeze orders require dual cryptographic signatures. The initiator ("Maker") cannot unilaterally release funds without "Checker" sign-off.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('treemap')}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Network className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inspect Admin Treemap</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {approvalQueue.map((item) => {
              const isPending = item.status === 'Pending Dual Signature';
              const isApproved = item.status === 'Approved & Executed';

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-xl border transition-all ${
                    isPending
                      ? 'bg-slate-900/90 border-slate-700 shadow-md'
                      : isApproved
                      ? 'bg-slate-950/70 border-emerald-900/40'
                      : 'bg-slate-950/70 border-rose-900/40'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="font-mono text-xs font-bold text-indigo-400">{item.transactionRef}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          {item.actionType}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            item.riskAssessment === 'High Risk'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              : item.riskAssessment === 'Medium Risk'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {item.riskAssessment}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white">{item.details}</h3>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      {item.amountNgn && (
                        <div>
                          <div className="text-lg font-bold font-mono text-emerald-400">
                            ₦{item.amountNgn.toLocaleString()}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            ≈ ${(item.amountUsd || 0).toLocaleString()} USD
                          </div>
                        </div>
                      )}

                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            isPending
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : isApproved
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {isPending && <Clock className="w-3.5 h-3.5 animate-spin" />}
                          {isApproved && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {!isPending && !isApproved && <XCircle className="w-3.5 h-3.5" />}
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata and Action controls */}
                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400">
                      <span>
                        <strong className="text-slate-300">Maker:</strong> {item.initiatorName} ({item.initiatorRole})
                      </span>
                      <span>•</span>
                      <span>
                        <strong className="text-slate-300">Initiated:</strong> {item.initiatedAt}
                      </span>
                      {item.checkerName && (
                        <>
                          <span>•</span>
                          <span>
                            <strong className="text-slate-300">Checker:</strong> {item.checkerName}
                          </span>
                        </>
                      )}
                    </div>

                    {isPending && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReject(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium transition-colors"
                        >
                          Reject Request
                        </button>
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Sign & Approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content: Admin Roles & Permissions Matrix */}
      {activeTab === 'rbac_matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Roles Selector list */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-200">Catalog of Admin Roles</span>
              <span className="text-[10px] text-indigo-400 font-mono">RBAC v4.2</span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search roles or departments..."
                value={searchRoleQuery}
                onChange={(e) => setSearchRoleQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5 max-h-[480px] overflow-y-auto">
              {ADMIN_ROLES_CATALOG.filter((r) =>
                r.roleName.toLowerCase().includes(searchRoleQuery.toLowerCase()) ||
                r.department.toLowerCase().includes(searchRoleQuery.toLowerCase())
              ).map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left p-2.5 rounded-lg transition-all border ${
                    selectedRole?.id === role.id
                      ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-200'
                      : 'bg-slate-950/60 border-slate-850 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-white">{role.roleName}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400">
                      Lvl {role.clearanceLevel}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{role.department}</div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>{role.assignedUsersCount} active officers</span>
                    <span className="text-indigo-400">View matrix →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Role Details and Permission Table */}
          {selectedRole && (
            <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-semibold">
                      Clearance Level {selectedRole.clearanceLevel}
                    </span>
                    <span className="text-xs text-slate-400">{selectedRole.department}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">{selectedRole.roleName}</h2>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
                    {selectedRole.assignedUsersCount} Active Seats
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-xs font-semibold text-slate-300 block mb-1">Operational Mandate & Scope</span>
                <p className="text-xs text-slate-400 mb-2">{selectedRole.description}</p>
                <div className="text-[11px] text-indigo-300 flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Governed by: {selectedRole.cbnComplianceScope}</span>
                </div>
              </div>

              {/* Granular Permission Flags */}
              <div>
                <h3 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                  Cryptographic Authority & System Grants
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(selectedRole.permissions).map(([permKey, granted]) => {
                    const labelMap: Record<string, string> = {
                      canViewTreasury: 'View Treasury & Bank Clearing Balances',
                      canInitiatePayout: 'Initiate High-Value NIP & Agency Payouts',
                      canApprovePayout: 'Checker Dual-Sign High-Value Transfers',
                      canFreezeWallets: 'Enact Emergency AML & Fraud Account Freeze',
                      canModifyFees: 'Modify Platform Fee & FX Margin Schedules',
                      canManageAgents: 'Onboard & Supervise SANEF POS Agents',
                      canAccessSanefSwitch: 'Direct Access to SANEF / NIBSS Routing Rails',
                      canExportAuditLogs: 'Export Tamper-Evident Ledger Audit Records',
                      canTriggerEmergencyKillSwitch: 'Trigger Global Emergency Infrastructure Kill-Switch',
                    };

                    return (
                      <div
                        key={permKey}
                        className={`p-3 rounded-lg border flex items-center justify-between ${
                          granted
                            ? 'bg-emerald-500/5 border-emerald-500/30 text-slate-200'
                            : 'bg-slate-950 border-slate-850 text-slate-500'
                        }`}
                      >
                        <span className="font-medium text-xs pr-2">{labelMap[permKey] || permKey}</span>
                        {granted ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] shrink-0">
                            GRANTED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-500 text-[10px] shrink-0">
                            DENIED
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Modifications require Root Super Admin & Dual-Signature Quorum.
                </span>
                <button
                  onClick={() => showToast(`Audit snapshot generated for ${selectedRole.roleName}`)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Generate Role Audit Certificate
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Emergency Kill-Switches */}
      {activeTab === 'emergency_controls' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-slate-300 text-xs flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-rose-300 text-sm mb-1">
                Emergency Circuit Breakers & Disaster Recovery Controls
              </h3>
              <p className="text-slate-400">
                In compliance with the CBN Cybersecurity Framework for Financial Institutions, these switches immediately isolate network sub-segments to prevent systemic contagion in the event of an active cyber exploit, zero-day threat, or liquidity anomaly.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Switch 1 */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Global Settlement & Outflow Switch</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Halts all outbound NIP disbursements and bank clearing transfers across all commercial partners.
                </span>
                <span className="text-[10px] font-mono text-emerald-400 mt-2 block">
                  Status: {killSwitches.globalSettlementSwitch ? 'OPERATIONAL (Normal)' : 'EMERGENCY HALTED'}
                </span>
              </div>
              <button
                onClick={() => toggleSwitch('globalSettlementSwitch', 'Global Settlement Switch')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ml-4 ${
                  killSwitches.globalSettlementSwitch
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500 hover:text-white'
                    : 'bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400'
                }`}
              >
                {killSwitches.globalSettlementSwitch ? 'Trigger Halt' : 'Restore Online'}
              </button>
            </div>

            {/* Switch 2 */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">SANEF Grassroots CICO Float Cap</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Restricts maximum cash-out limit per agent kiosk to ₦100,000 during cash shortage alerts.
                </span>
                <span className="text-[10px] font-mono text-emerald-400 mt-2 block">
                  Status: {killSwitches.cicoAgentFloatCap ? 'ENFORCED (Standard)' : 'RELAXED'}
                </span>
              </div>
              <button
                onClick={() => toggleSwitch('cicoAgentFloatCap', 'SANEF CICO Float Cap')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ml-4 ${
                  killSwitches.cicoAgentFloatCap
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-white'
                    : 'bg-emerald-500 text-slate-950 font-bold'
                }`}
              >
                {killSwitches.cicoAgentFloatCap ? 'Relax Limits' : 'Enforce Cap'}
              </button>
            </div>

            {/* Switch 3 */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Direct NIBSS NIP Routing Rails</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Instant inter-bank payment switch connection with 14ms latency telemetry.
                </span>
                <span className="text-[10px] font-mono text-emerald-400 mt-2 block">
                  Status: {killSwitches.instantNipSwitch ? 'ACTIVE (99.98% SLA)' : 'ISOLATED'}
                </span>
              </div>
              <button
                onClick={() => toggleSwitch('instantNipSwitch', 'NIBSS NIP Rails')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ml-4 ${
                  killSwitches.instantNipSwitch
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500 hover:text-white'
                    : 'bg-emerald-500 text-slate-950 font-bold'
                }`}
              >
                {killSwitches.instantNipSwitch ? 'Isolate Switch' : 'Reconnect Rails'}
              </button>
            </div>

            {/* Switch 4 */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Offline USSD Agent Banking Switch (*990#)</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Telco gateway session switch servicing rural and low-connectivity agent terminals.
                </span>
                <span className="text-[10px] font-mono text-emerald-400 mt-2 block">
                  Status: {killSwitches.ussdBankingSwitch ? 'ACTIVE (MTN/Airtel/Glo)' : 'SUSPENDED'}
                </span>
              </div>
              <button
                onClick={() => toggleSwitch('ussdBankingSwitch', 'USSD Telco Switch')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ml-4 ${
                  killSwitches.ussdBankingSwitch
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-white'
                    : 'bg-emerald-500 text-slate-950 font-bold'
                }`}
              >
                {killSwitches.ussdBankingSwitch ? 'Suspend USSD' : 'Activate USSD'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Regulatory Compliance Dossier */}
      {activeTab === 'cbn_audit' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block">CBN Regulatory License</span>
              <div className="text-sm font-bold text-white mt-1">Tier-1 PSSP & MMO</div>
              <div className="text-[10px] text-emerald-400 font-mono mt-1">Ref: CBN/MMO/2024/091</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block">NFIU SAR/STR Submissions</span>
              <div className="text-sm font-bold text-white mt-1">Direct API Pipe</div>
              <div className="text-[10px] text-cyan-400 font-mono mt-1">3 Suspicious Filings This Month</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block">NDIC Deposit Protection</span>
              <div className="text-sm font-bold text-white mt-1">Insured & Certified</div>
              <div className="text-[10px] text-indigo-400 font-mono mt-1">Pass-Through Custody Ratio 100%</div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Statutory Regulatory Filings & Export Center</h3>
            <p className="text-xs text-slate-400">
              Generate certified compliance packs formatted according to Central Bank of Nigeria (CBN) and Nigeria Inter-Bank Settlement System (NIBSS) technical reporting standards.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 block">Monthly SANEF Agent Deployment Registry</span>
                  <span className="text-[11px] text-slate-500">184,200 agents indexed with BVN/NIN</span>
                </div>
                <button
                  onClick={() => showToast('SANEF Agent Registry exported to CSV (CBN Format)')}
                  className="px-3 py-1.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30"
                >
                  Export
                </button>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 block">Daily Cash Reserve Ratio (CRR) Buffer</span>
                  <span className="text-[11px] text-slate-500">Certified by Zenith & Access Bank Custody</span>
                </div>
                <button
                  onClick={() => showToast('Daily CRR Buffer Snapshot exported to PDF')}
                  className="px-3 py-1.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30"
                >
                  Export
                </button>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 block">State Internal Revenue Service Remittances</span>
                  <span className="text-[11px] text-slate-500">Kano KIRS, Lagos LIRS, Rivers RIRS breakdown</span>
                </div>
                <button
                  onClick={() => showToast('State BIR Tax Remittance Schedule exported')}
                  className="px-3 py-1.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30"
                >
                  Export
                </button>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 block">AML/CFT Cryptographic Audit Trail</span>
                  <span className="text-[11px] text-slate-500">Immutable blockchain & server event hashes</span>
                </div>
                <button
                  onClick={() => showToast('AML Audit Trail dossier generated for examiners')}
                  className="px-3 py-1.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: D3.js Hierarchical Treemap */}
      {activeTab === 'treemap' && (
        <NigeriaAdminTreemap />
      )}
    </div>
  );
};
