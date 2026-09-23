import { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  ShieldAlert, 
  AlertTriangle, 
  Search, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Filter, 
  Clock, 
  Send, 
  Sparkles, 
  Layers, 
  Check,
  History,
  BarChart3,
  TrendingUp,
  Activity,
  ArrowRight,
  Scale,
  Building2,
  Info,
  ChevronRight
} from 'lucide-react';
import { KYC_APPLICANTS, AML_CASES } from '../../data/mockFintechData';
import { KycApplicant, AmlCase, KycStatus, KycAuditLog } from '../../types';
import { INITIAL_KYC_AUDIT_LOGS } from '../../data/kycAuditData';
import { KycAuditLogsView } from '../kyc/KycAuditLogsView';
import { KycAnalyticsCharts } from '../charts/KycAnalyticsCharts';
import { KycTierPolicyModal } from '../modals/KycTierPolicyModal';
import { KYC_TIERS_CONFIG } from '../../data/kycTierData';

interface CcoDashboardProps {
  onOpenKycModal: (applicant: KycApplicant) => void;
  onOpenReportExport: () => void;
  kycList?: KycApplicant[];
  auditLogs?: KycAuditLog[];
}

export const CcoDashboard = ({
  onOpenKycModal,
  onOpenReportExport,
  kycList: externalKycList,
  auditLogs: externalAuditLogs,
}: CcoDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'kyc' | 'analytics' | 'audit' | 'aml' | 'regulatory'>('kyc');
  const [amlCases, setAmlCases] = useState<AmlCase[]>(AML_CASES);
  const [localKycList, setLocalKycList] = useState<KycApplicant[]>(KYC_APPLICANTS);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPolicyModal, setShowPolicyModal] = useState<boolean>(false);
  const [policyInitialTier, setPolicyInitialTier] = useState<'tier_1' | 'tier_2' | 'tier_3' | 'corporate_kyb'>('tier_1');

  const currentKycList = externalKycList || localKycList;
  const currentAuditLogs = externalAuditLogs || INITIAL_KYC_AUDIT_LOGS;

  // Filtered applicants
  const filteredApplicants = useMemo(() => {
    return currentKycList.filter((app) => {
      const matchesSearch = 
        app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.bvn.includes(searchQuery) ||
        app.nin.includes(searchQuery) ||
        app.phone.includes(searchQuery) ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === 'All' ? true :
        statusFilter === 'Pending' ? app.status === 'Pending' :
        statusFilter === 'Temporary Approved' ? app.status === 'Temporary Approved' :
        statusFilter === 'Verified' ? app.status === 'Verified' :
        statusFilter === 'Pushed to Provider' ? app.status === 'Pushed to Provider' :
        statusFilter === 'Rejected' ? app.status === 'Rejected' :
        statusFilter === 'High-Risk Escalated' ? app.status === 'High-Risk Escalated' : true;

      const matchesTier =
        tierFilter === 'All'
          ? true
          : tierFilter === 'Company / Business'
          ? app.tierRequested.includes('Company') || app.tierRequested.includes('Corporate') || app.tierRequested.includes('KYB')
          : app.tierRequested.includes(tierFilter);

      return matchesSearch && matchesStatus && matchesTier;
    });
  }, [currentKycList, searchQuery, statusFilter, tierFilter]);

  // Dynamic KPI Counts
  const pendingCount = currentKycList.filter(a => a.status === 'Pending').length;
  const tempApprovedCount = currentKycList.filter(a => a.status === 'Temporary Approved').length;
  const verifiedCount = currentKycList.filter(a => a.status === 'Verified').length;
  const providerReviewCount = currentKycList.filter(a => a.status === 'Pushed to Provider').length;
  const flaggedCount = currentKycList.filter(a => a.status === 'High-Risk Escalated').length;

  const handleAmlStatusChange = (caseId: string, newStatus: any) => {
    setAmlCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
              CCO Compliance & AML Sentinel
            </span>
            <span className="text-xs text-slate-400">admin.ifuturewallet.com • Regulatory Seal</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            KYC/KYB Identity Verification, AML Sentinel & Central Bank Filings
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Automated verification against NIBSS BVN, NIMC NIN biometric databases, sanctions screening, and suspicious transaction reports (STR/SAR).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenReportExport}
            className="px-3.5 py-2 text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-500/10 transition-colors"
          >
            <Download className="w-4 h-4" />
            Statutory FIU Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-medium gap-2">
        <button
          onClick={() => setActiveTab('kyc')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'kyc'
              ? 'border-indigo-400 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          KYC / KYB Verification Queue
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'analytics'
              ? 'border-indigo-400 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Approval Rates & Latency Trends
          <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Live Recharts
          </span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'audit'
              ? 'border-indigo-400 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          Audit Logs
          <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            {currentAuditLogs.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('aml')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'aml'
              ? 'border-indigo-400 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          AML Monitoring & Investigation Cases
        </button>
        <button
          onClick={() => setActiveTab('regulatory')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'regulatory'
              ? 'border-indigo-400 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Regulatory Compliance Reports
        </button>
      </div>

      {/* TAB 1: KYC / KYB */}
      {activeTab === 'kyc' && (
        <div className="space-y-6">
          {/* Status Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Verified / Approved</span>
              <span className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">{verifiedCount}</span>
              <span className="text-[10px] text-slate-500">Tier cleared & active</span>
            </div>
            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Temporary Approved
              </span>
              <span className="text-xl font-bold text-amber-400 font-mono mt-0.5 block">{tempApprovedCount}</span>
              <span className="text-[10px] text-amber-500/80">Provisional limits</span>
            </div>
            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Pending Queue</span>
              <span className="text-xl font-bold text-slate-200 font-mono mt-0.5 block">{pendingCount}</span>
              <span className="text-[10px] text-slate-500">Awaiting officer review</span>
            </div>
            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                <Send className="w-3 h-3 text-sky-400" /> Pushed to Providers
              </span>
              <span className="text-xl font-bold text-sky-400 font-mono mt-0.5 block">{providerReviewCount}</span>
              <span className="text-[10px] text-sky-500/80">External partner review</span>
            </div>
            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">High-Risk Flagged</span>
              <span className="text-xl font-bold text-rose-400 font-mono mt-0.5 block">{flaggedCount}</span>
              <span className="text-[10px] text-rose-400/80">PEP / Watchlist hit</span>
            </div>
          </div>

          {/* Quick Telemetry Banner linking to Analytics */}
          <div className="p-3 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 rounded-xl border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-200 font-medium flex flex-wrap items-center gap-2">
                  <span>Current 7-Day KYC Approval Rate: <strong className="text-emerald-400">84.8%</strong></span>
                  <span className="text-slate-600 hidden sm:inline">·</span>
                  <span>Instant Biometric P95: <strong className="text-sky-400">680ms</strong> (&lt; 1,000ms SLA)</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Visualized using Recharts with multi-day historical audit data across Smile ID, Prembly, Dojah, and NIBSS Direct.
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg flex items-center gap-1.5 text-xs transition-colors self-start sm:self-auto shrink-0 shadow-sm"
            >
              <span>View Recharts Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CBN Tiered KYC & Corporate Account Policy Matrix Bar */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    Central Bank of Nigeria (CBN) Tiered KYC & Corporate Account Framework
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Statutory daily transfer limits and cumulative deposit ceilings enforced across payment rails.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setPolicyInitialTier('tier_1');
                  setShowPolicyModal(true);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-indigo-500/30 font-medium rounded-lg flex items-center gap-1.5 text-xs transition-colors self-start sm:self-auto shrink-0 shadow-sm"
              >
                <Scale className="w-3.5 h-3.5 text-indigo-400" />
                <span>Full Tier Policy Matrix</span>
                <ChevronRight className="w-3 h-3 text-indigo-400" />
              </button>
            </div>

            {/* 4 Interactive Tier Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* TIER 1 */}
              <div 
                onClick={() => {
                  setTierFilter('Tier 1');
                }}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  tierFilter === 'Tier 1'
                    ? 'bg-amber-950/20 border-amber-500/50 ring-1 ring-amber-500/30'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                    Tier 1 (Basic)
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPolicyInitialTier('tier_1');
                      setShowPolicyModal(true);
                    }}
                    className="text-[10px] text-slate-400 hover:text-indigo-300"
                  >
                    Rules ↗
                  </button>
                </div>
                <div className="text-xs font-bold text-white font-mono">
                  Limit: <span className="text-emerald-400">₦50,000/d</span>
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  Max Deposit: <span className="text-cyan-400">₦500,000</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 leading-tight line-clamp-2">
                  BVN or NIN + Phone/Email or Liveness. No utility bill required.
                </div>
              </div>

              {/* TIER 2 */}
              <div 
                onClick={() => {
                  setTierFilter('Tier 2');
                }}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  tierFilter === 'Tier 2'
                    ? 'bg-cyan-950/20 border-cyan-500/50 ring-1 ring-cyan-500/30'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-cyan-300 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">
                    Tier 2 (Verified)
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPolicyInitialTier('tier_2');
                      setShowPolicyModal(true);
                    }}
                    className="text-[10px] text-slate-400 hover:text-indigo-300"
                  >
                    Rules ↗
                  </button>
                </div>
                <div className="text-xs font-bold text-white font-mono">
                  Limit: <span className="text-emerald-400">₦500,000/d</span>
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  Max Deposit: <span className="text-cyan-400">₦5,000,000</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 leading-tight line-clamp-2">
                  BVN/NIN + Contact + Electric/Waste/Water/Statement + Means of ID.
                </div>
              </div>

              {/* TIER 3 */}
              <div 
                onClick={() => {
                  setTierFilter('Tier 3');
                }}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  tierFilter === 'Tier 3'
                    ? 'bg-emerald-950/20 border-emerald-500/50 ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                    Tier 3 (Premium)
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPolicyInitialTier('tier_3');
                      setShowPolicyModal(true);
                    }}
                    className="text-[10px] text-slate-400 hover:text-indigo-300"
                  >
                    Rules ↗
                  </button>
                </div>
                <div className="text-xs font-bold text-white font-mono">
                  Limit: <span className="text-emerald-400">₦5,000,000/d</span>
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  Max Deposit: <span className="text-cyan-400">UNLIMITED</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 leading-tight line-clamp-2">
                  Tier 2 + In-Person Address Verification (Physical Inspection).
                </div>
              </div>

              {/* COMPANY / BUSINESS */}
              <div 
                onClick={() => {
                  setTierFilter('Company / Business');
                }}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  tierFilter === 'Company / Business'
                    ? 'bg-indigo-950/20 border-indigo-500/50 ring-1 ring-indigo-500/30'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-indigo-300 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
                    Company / Business
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPolicyInitialTier('corporate_kyb');
                      setShowPolicyModal(true);
                    }}
                    className="text-[10px] text-slate-400 hover:text-indigo-300"
                  >
                    Rules ↗
                  </button>
                </div>
                <div className="text-xs font-bold text-white font-mono">
                  Limit: <span className="text-emerald-400">₦50,000,000/d</span>
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  Max Deposit: <span className="text-cyan-400">UNLIMITED</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 leading-tight line-clamp-2">
                  CAC, Status/MEMART, TIN, Directors' ID/BVN, Board Res, SCUML.
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search applicant name, BVN, NIN, phone, ID..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 overflow-x-auto">
                {['All', 'Pending', 'Temporary Approved', 'Verified', 'Pushed to Provider', 'High-Risk Escalated'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors whitespace-nowrap ${
                      statusFilter === st
                        ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st === 'All' ? `All (${currentKycList.length})` : st}
                  </button>
                ))}
              </div>

              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Tiers ({currentKycList.length})</option>
                <option value="Tier 1">Tier 1 (₦50K Daily / ₦500K Dep)</option>
                <option value="Tier 2">Tier 2 (₦500K Daily / ₦5M Dep)</option>
                <option value="Tier 3">Tier 3 (₦5M Daily / Unlimited)</option>
                <option value="Company / Business">Company / Business Account (Corporate)</option>
              </select>
            </div>
          </div>

          {/* Verification Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-400" />
                  Active Verification Queue & Document Inspection Desk
                </h3>
                <span className="text-xs text-slate-400">
                  Showing {filteredApplicants.length} applicants • Review submitted documents, approve, reject, temporary approve, or push to providers
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-medium">Applicant Details</th>
                    <th className="pb-3 font-medium">Tier Target</th>
                    <th className="pb-3 font-medium">BVN & NIN</th>
                    <th className="pb-3 font-medium">Submitted Docs</th>
                    <th className="pb-3 font-medium">Provider Status</th>
                    <th className="pb-3 font-medium">Risk Score</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredApplicants.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-500">
                        No applicants found matching "{searchQuery}"
                      </td>
                    </tr>
                  ) : (
                    filteredApplicants.map((app) => {
                      const latestPush = app.providerPushes && app.providerPushes.length > 0 
                        ? app.providerPushes[0] 
                        : null;
                      
                      return (
                        <tr key={app.id} className="hover:bg-slate-850/50 transition-colors">
                          <td className="py-3">
                            <div className="font-semibold text-slate-200">{app.fullName}</div>
                            <div className="text-[11px] text-slate-400">{app.email || app.phone}</div>
                          </td>
                          <td className="py-3">
                            <div>
                              <span className={`font-semibold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1 ${
                                app.tierRequested.includes('1')
                                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                  : app.tierRequested.includes('2')
                                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                                  : app.tierRequested.includes('3')
                                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                  : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                              }`}>
                                {app.tierRequested}
                              </span>
                              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                {app.tierRequested.includes('1')
                                  ? '₦50K/d • Max ₦500K'
                                  : app.tierRequested.includes('2')
                                  ? '₦500K/d • Max ₦5M'
                                  : app.tierRequested.includes('3')
                                  ? '₦5M/d • Unlimited'
                                  : '₦50M/d • Unlimited'}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 font-mono text-[11px] text-slate-300">
                            <div>BVN: {app.bvn}</div>
                            <div className="text-slate-400">NIN: {app.nin}</div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-300 font-medium">
                                {app.submittedDocuments?.length || 0} Docs
                              </span>
                              <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                                {app.documentType}
                              </span>
                            </div>
                          </td>
                          <td className="py-3">
                            {latestPush ? (
                              <div className="space-y-0.5">
                                <span className="text-slate-300 font-medium block">
                                  {latestPush.provider}
                                </span>
                                <span className="font-mono text-[10px] text-slate-500 bg-slate-800/80 px-1 rounded inline-block">
                                  {latestPush.ticketReference}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-[11px] italic">Direct Review</span>
                            )}
                          </td>
                          <td className="py-3 font-mono font-bold">
                            <span className={app.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}>
                              {app.riskScore} / 100
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2.5 py-1 rounded text-[10px] font-semibold inline-flex items-center gap-1 ${
                                app.status === 'Verified'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : app.status === 'Temporary Approved'
                                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                                  : app.status === 'High-Risk Escalated'
                                  ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                                  : app.status === 'Pushed to Provider'
                                  ? 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                                  : app.status === 'Rejected'
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {app.status === 'Temporary Approved' && <Clock className="w-3 h-3" />}
                              {app.status === 'Pushed to Provider' && <Send className="w-3 h-3" />}
                              {app.status === 'Temporary Approved' && app.provisionalPeriodDays 
                                ? `Temporary Approved (${app.provisionalPeriodDays}d)`
                                : app.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => onOpenKycModal(app)}
                              className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 ml-auto transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Review Dossier
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ANALYTICS & LATENCY TRENDS */}
      {activeTab === 'analytics' && (
        <KycAnalyticsCharts
          auditLogs={currentAuditLogs}
          kycApplicants={currentKycList}
          onOpenApplicantModal={onOpenKycModal}
        />
      )}

      {/* TAB 2: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Quick Jump Banner to Analytics */}
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">
                Looking for aggregated charts and partner latency trends?
              </span>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-medium rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <span>View Recharts Visualizations</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <KycAuditLogsView
            auditLogs={currentAuditLogs}
            kycApplicants={currentKycList}
            onOpenApplicantModal={onOpenKycModal}
          />
        </div>
      )}

      {/* TAB 3: AML MONITORING */}
      {activeTab === 'aml' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Anti-Money Laundering (AML) Sentinel & High-Risk Case Management
              </h3>
              <p className="text-xs text-slate-400">Automatic velocity rules, large transaction thresholds (&gt;$10,000), and FIU SAR escalations</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-medium">Case Number</th>
                  <th className="pb-3 font-medium">Subject Entity</th>
                  <th className="pb-3 font-medium">Transaction Ref</th>
                  <th className="pb-3 font-medium">Trigger Flag</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Risk Score</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {amlCases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-855/40 transition-colors">
                    <td className="py-3 font-mono font-bold text-slate-200">{c.caseNumber}</td>
                    <td className="py-3 font-medium text-slate-100">{c.subjectName}</td>
                    <td className="py-3 font-mono text-cyan-400">{c.transactionRef}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30">
                        {c.flagType}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-emerald-400">${c.amount.toLocaleString()}</td>
                    <td className="py-3 font-mono text-rose-400 font-bold">{c.riskScore}/100</td>
                    <td className="py-3">
                      <span className="text-slate-300 font-medium">{c.status}</span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {c.status !== 'Frozen' && (
                          <button
                            onClick={() => handleAmlStatusChange(c.id, 'Frozen')}
                            className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold"
                          >
                            Freeze Wallet
                          </button>
                        )}
                        {c.status !== 'Reported to FIU' && (
                          <button
                            onClick={() => handleAmlStatusChange(c.id, 'Reported to FIU')}
                            className="px-2.5 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold"
                          >
                            SAR File
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: REGULATORY REPORTS */}
      {activeTab === 'regulatory' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Central Bank & Regulatory Compliance Dossiers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <h4 className="font-semibold text-slate-200 mb-1">Monthly AML Suspicious Activity Report (SAR)</h4>
              <p className="text-slate-400">Electronic submission to Financial Intelligence Unit with transaction audit hashes.</p>
              <div className="mt-3 flex items-center justify-between text-slate-500">
                <span>Status: Filed & Cleared</span>
                <span className="text-emerald-400 font-semibold">Sept 2026 Conformed</span>
              </div>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <h4 className="font-semibold text-slate-200 mb-1">CBN Capital Adequacy & Trust Account Audit</h4>
              <p className="text-slate-400">Custodial reserve verification across Zenith, Access, and 9PSB settlement accounts.</p>
              <div className="mt-3 flex items-center justify-between text-slate-500">
                <span>Ratio: 24.8%</span>
                <span className="text-emerald-400 font-semibold">Unreserved</span>
              </div>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <h4 className="font-semibold text-slate-200 mb-1">Partner Bank Compliance SLA Scorecard</h4>
              <p className="text-slate-400">Monthly bilateral reviews of merchant acquiring guidelines and dispute arbitration.</p>
              <div className="mt-3 flex items-center justify-between text-slate-500">
                <span>Score: 99.4%</span>
                <span className="text-emerald-400 font-semibold">Full Compliance</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CBN TIER POLICY MODAL */}
      <KycTierPolicyModal
        isOpen={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
        initialTier={policyInitialTier}
      />
    </div>
  );
};
