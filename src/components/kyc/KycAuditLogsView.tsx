import { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Send,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  ExternalLink,
  ChevronRight,
  FileText,
  Eye,
  Copy,
  Check,
  Building2,
  Cpu,
  Globe,
  Radio,
  FileCode2,
  RefreshCw,
  X
} from 'lucide-react';
import { KycAuditLog, KycAuditActionCategory, KycApplicant, KycStatus } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';

interface KycAuditLogsViewProps {
  auditLogs: KycAuditLog[];
  kycApplicants?: KycApplicant[];
  onOpenApplicantModal?: (applicant: KycApplicant) => void;
}

export const KycAuditLogsView = ({
  auditLogs,
  kycApplicants = [],
  onOpenApplicantModal,
}: KycAuditLogsViewProps) => {
  const { formatNgn } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedActorRole, setSelectedActorRole] = useState<string>('All');
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('All');
  const [selectedLogForDetail, setSelectedLogForDetail] = useState<KycAuditLog | null>(null);
  const [copiedPayloadId, setCopiedPayloadId] = useState<string | null>(null);

  // Status counts for dropdown options
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Approved: 0,
      'Temporary Approved': 0,
      'Pushed to Provider': 0,
      'High-Risk Escalated': 0,
      Rejected: 0,
      Pending: 0,
    };
    auditLogs.forEach((log) => {
      if (log.newStatus === 'Verified' || (log.newStatus as string) === 'Approved') {
        counts.Approved = (counts.Approved || 0) + 1;
      } else if (counts[log.newStatus] !== undefined) {
        counts[log.newStatus] = (counts[log.newStatus] || 0) + 1;
      }
    });
    return counts;
  }, [auditLogs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      // Search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        log.applicantName.toLowerCase().includes(searchLower) ||
        log.performedBy.toLowerCase().includes(searchLower) ||
        log.summary.toLowerCase().includes(searchLower) ||
        (log.notes && log.notes.toLowerCase().includes(searchLower)) ||
        log.applicantBvnMasked.includes(searchLower) ||
        (log.providerOutcome &&
          (log.providerOutcome.provider.toLowerCase().includes(searchLower) ||
            log.providerOutcome.ticketReference.toLowerCase().includes(searchLower)));

      // Status Filter
      const matchesStatus =
        selectedStatus === 'All' ||
        (selectedStatus === 'Approved' || selectedStatus === 'Verified'
          ? log.newStatus === 'Verified' || (log.newStatus as string) === 'Approved'
          : log.newStatus === selectedStatus);

      // Category
      const matchesCategory =
        selectedCategory === 'All' || log.actionCategory === selectedCategory;

      // Actor Role
      const matchesActor =
        selectedActorRole === 'All' || log.actorRole === selectedActorRole;

      // Provider
      const matchesProvider =
        selectedProvider === 'All' ||
        (log.providerOutcome && log.providerOutcome.provider === selectedProvider);

      // Timeframe
      let matchesTime = true;
      if (selectedTimeframe === 'Today') {
        matchesTime = log.timestamp.includes('2026-09-23') || log.timeAgo.includes('min') || log.timeAgo.includes('hour') || log.timeAgo.includes('Just');
      } else if (selectedTimeframe === 'Yesterday') {
        matchesTime = log.timeAgo.includes('Yesterday');
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesActor && matchesProvider && matchesTime;
    });
  }, [auditLogs, searchQuery, selectedStatus, selectedCategory, selectedActorRole, selectedProvider, selectedTimeframe]);

  // Aggregate Stats
  const totalEntries = auditLogs.length;
  const approvalsCount = auditLogs.filter(
    (l) => l.actionCategory === 'Tier Upgrade Approved' || l.actionCategory === 'Temporary Approval Granted'
  ).length;
  const providerWebhooksCount = auditLogs.filter(
    (l) => l.actionCategory === 'Provider Webhook Received'
  ).length;
  const rejectionsAndFlagsCount = auditLogs.filter(
    (l) => l.actionCategory === 'Application Rejected' || l.actionCategory === 'Escalated to AML'
  ).length;
  const providerPushesCount = auditLogs.filter((l) => Boolean(l.providerOutcome)).length;

  const handleCopyPayload = (payload: string, id: string) => {
    navigator.clipboard.writeText(payload);
    setCopiedPayloadId(id);
    setTimeout(() => setCopiedPayloadId(null), 2500);
  };

  const handleExportCsv = () => {
    const headers = [
      'Audit ID',
      'Timestamp',
      'Action Category',
      'Performed By',
      'Actor Role',
      'Applicant Name',
      'Applicant ID',
      'Target Tier',
      'New Status',
      'Provider',
      'Provider Ticket',
      'Provider Outcome',
      'Confidence Score',
      'Summary',
      'Officer Notes',
    ];

    const rows = filteredLogs.map((log) => [
      `"${log.id}"`,
      `"${log.timestamp}"`,
      `"${log.actionCategory}"`,
      `"${log.performedBy}"`,
      `"${log.actorRole}"`,
      `"${log.applicantName}"`,
      `"${log.applicantId}"`,
      `"${log.tierRequested}"`,
      `"${log.newStatus}"`,
      `"${log.providerOutcome?.provider || 'N/A'}"`,
      `"${log.providerOutcome?.ticketReference || 'N/A'}"`,
      `"${log.providerOutcome?.status || 'N/A'}"`,
      `"${log.providerOutcome?.confidenceScore ? log.providerOutcome.confidenceScore + '%' : 'N/A'}"`,
      `"${log.summary.replace(/"/g, '""')}"`,
      `"${(log.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kyc_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kyc_audit_trail_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getCategoryBadge = (category: KycAuditActionCategory) => {
    switch (category) {
      case 'Tier Upgrade Approved':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Tier Upgrade Approved
          </span>
        );
      case 'Temporary Approval Granted':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            Temporary Approval
          </span>
        );
      case 'Application Rejected':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 inline-flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-400" />
            Application Rejected
          </span>
        );
      case 'Escalated to AML':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-600/15 text-red-300 border border-red-500/40 inline-flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-red-400" />
            Escalated to AML
          </span>
        );
      case 'Provider Push Dispatched':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/30 inline-flex items-center gap-1">
            <Send className="w-3 h-3 text-sky-400" />
            Provider Dispatched
          </span>
        );
      case 'Provider Webhook Received':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 inline-flex items-center gap-1">
            <Radio className="w-3 h-3 text-indigo-400" />
            Provider Webhook
          </span>
        );
      case 'Document Inspected & Validated':
      case 'Biometric Check Completed':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-700/50 text-slate-300 border border-slate-600 inline-flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-slate-300" />
            {category}
          </span>
        );
    }
  };

  const getStatusBadge = (status: KycStatus | string) => {
    switch (status) {
      case 'Verified':
      case 'Approved':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
            Approved
          </span>
        );
      case 'Temporary Approved':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-amber-400" />
            Temporary Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 inline-flex items-center gap-1">
            <XCircle className="w-2.5 h-2.5 text-rose-400" />
            Rejected
          </span>
        );
      case 'Pushed to Provider':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/30 inline-flex items-center gap-1">
            <Send className="w-2.5 h-2.5 text-sky-400" />
            Pushed to Provider
          </span>
        );
      case 'High-Risk Escalated':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-600/15 text-red-300 border border-red-500/40 inline-flex items-center gap-1">
            <ShieldAlert className="w-2.5 h-2.5 text-red-400" />
            High-Risk Escalated
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700 inline-flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-slate-400" />
            {status}
          </span>
        );
    }
  };

  const getActorRoleIcon = (role: string) => {
    switch (role) {
      case 'Chief Compliance Officer':
        return <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Senior Compliance Analyst':
        return <UserCheck className="w-3.5 h-3.5 text-sky-400" />;
      case 'AML Investigator':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      case 'External Provider Webhook':
        return <Globe className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Automated Risk Engine':
      default:
        return <Cpu className="w-3.5 h-3.5 text-violet-400" />;
    }
  };

  const findApplicant = (id: string) => {
    return kycApplicants.find((a) => a.id === id);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          onClick={() => setSelectedStatus('All')}
          className={`p-4 rounded-xl text-left border shadow-sm transition-all ${
            selectedStatus === 'All'
              ? 'bg-slate-900 border-indigo-500/80 ring-1 ring-indigo-500/30'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Audit Events</span>
            <History className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{totalEntries}</div>
          <div className="text-[11px] text-slate-500 mt-1">Click to view all statuses</div>
        </button>

        <button
          onClick={() => setSelectedStatus(selectedStatus === 'Approved' ? 'All' : 'Approved')}
          className={`p-4 rounded-xl text-left border shadow-sm transition-all ${
            selectedStatus === 'Approved'
              ? 'bg-emerald-950/20 border-emerald-500/80 ring-1 ring-emerald-500/30'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Officer Authorizations</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{statusCounts['Approved'] || approvalsCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Filter by Approved / Verified</div>
        </button>

        <button
          onClick={() => setSelectedStatus(selectedStatus === 'Pushed to Provider' ? 'All' : 'Pushed to Provider')}
          className={`p-4 rounded-xl text-left border shadow-sm transition-all ${
            selectedStatus === 'Pushed to Provider'
              ? 'bg-sky-950/20 border-sky-500/80 ring-1 ring-sky-500/30'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Provider Push Telemetry</span>
            <Send className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400">{statusCounts['Pushed to Provider'] || providerPushesCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Filter by Pushed to Provider</div>
        </button>

        <button
          onClick={() => setSelectedStatus(selectedStatus === 'Rejected' ? 'All' : 'Rejected')}
          className={`p-4 rounded-xl text-left border shadow-sm transition-all ${
            selectedStatus === 'Rejected'
              ? 'bg-rose-950/20 border-rose-500/80 ring-1 ring-rose-500/30'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Flags & Rejections</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">{statusCounts['Rejected'] || rejectionsAndFlagsCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Filter by Rejected</div>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        {/* Header & Export Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              KYC / KYB Chronological Audit Log & Provider Callback History
            </h3>
            <p className="text-xs text-slate-400">
              Statutory tamper-evident ledger tracking identity actions, reviewer credentials, external provider push outcomes, and webhook verifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              Export CSV
            </button>
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
              Export JSON
            </button>
          </div>
        </div>

        {/* Quick Status Filters for Fast Investigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
          <span className="text-[11px] font-medium text-slate-400 mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3 text-slate-500" />
            Quick Status:
          </span>
          {[
            { id: 'All', label: 'All Statuses', count: auditLogs.length },
            { id: 'Approved', label: 'Approved', count: statusCounts['Approved'] || 0 },
            { id: 'Rejected', label: 'Rejected', count: statusCounts['Rejected'] || 0 },
            { id: 'Pushed to Provider', label: 'Pushed to Provider', count: statusCounts['Pushed to Provider'] || 0 },
            { id: 'Temporary Approved', label: 'Temporary Approved', count: statusCounts['Temporary Approved'] || 0 },
            { id: 'High-Risk Escalated', label: 'Escalated', count: statusCounts['High-Risk Escalated'] || 0 },
            { id: 'Pending', label: 'Pending', count: statusCounts['Pending'] || 0 },
          ].map((chip) => {
            const isActive = selectedStatus === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedStatus(chip.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap flex items-center gap-1.5 border shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850 hover:text-white'
                }`}
              >
                <span>{chip.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5 text-xs">
          {/* Search Box */}
          <div className="relative sm:col-span-2 lg:col-span-2 xl:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search applicant, actor, ticket ID, BVN, or summary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Status Dropdown Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`w-full px-2.5 py-2 bg-slate-950 border rounded-lg text-xs transition-colors focus:outline-none focus:border-indigo-500 ${
                selectedStatus !== 'All'
                  ? 'border-indigo-500 text-indigo-300 font-semibold bg-indigo-950/20'
                  : 'border-slate-800 text-slate-300'
              }`}
              aria-label="Filter audit logs by status"
            >
              <option value="All">All Statuses ({auditLogs.length})</option>
              <option value="Approved">Approved / Verified ({statusCounts['Approved'] || 0})</option>
              <option value="Rejected">Rejected ({statusCounts['Rejected'] || 0})</option>
              <option value="Pushed to Provider">Pushed to Provider ({statusCounts['Pushed to Provider'] || 0})</option>
              <option value="Temporary Approved">Temporary Approved ({statusCounts['Temporary Approved'] || 0})</option>
              <option value="High-Risk Escalated">High-Risk Escalated ({statusCounts['High-Risk Escalated'] || 0})</option>
              <option value="Pending">Pending ({statusCounts['Pending'] || 0})</option>
            </select>
          </div>

          {/* Action Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Actions ({auditLogs.length})</option>
              <option value="Tier Upgrade Approved">Tier Upgrade Approved</option>
              <option value="Temporary Approval Granted">Temporary Approval</option>
              <option value="Provider Webhook Received">Provider Webhook Received</option>
              <option value="Provider Push Dispatched">Provider Push Dispatched</option>
              <option value="Escalated to AML">Escalated to AML</option>
              <option value="Application Rejected">Application Rejected</option>
              <option value="Document Inspected & Validated">Document Validated</option>
            </select>
          </div>

          {/* Actor Role Filter */}
          <div>
            <select
              value={selectedActorRole}
              onChange={(e) => setSelectedActorRole(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Performed By</option>
              <option value="Chief Compliance Officer">Chief Compliance Officer</option>
              <option value="Senior Compliance Analyst">Senior Compliance Analyst</option>
              <option value="External Provider Webhook">External Provider Webhook</option>
              <option value="Automated Risk Engine">Automated Risk Engine</option>
            </select>
          </div>

          {/* Provider Filter */}
          <div>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All External Providers</option>
              <option value="Smile ID">Smile ID</option>
              <option value="Prembly / Identitypass">Prembly / Identitypass</option>
              <option value="ComplyAdvantage">ComplyAdvantage</option>
              <option value="Seamfix">Seamfix</option>
              <option value="Dojah">Dojah</option>
              <option value="NIBSS Direct">NIBSS Direct</option>
            </select>
          </div>
        </div>

        {/* Results summary pill */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-1 gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span>
              Showing <strong className="text-slate-200 font-mono">{filteredLogs.length}</strong> of{' '}
              <strong className="text-slate-200 font-mono">{auditLogs.length}</strong> recorded audit actions
            </span>
            {selectedStatus !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                Status: <strong>{selectedStatus}</strong>
                <button
                  onClick={() => setSelectedStatus('All')}
                  className="hover:text-white ml-0.5"
                  title="Clear status filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
          {(searchQuery || selectedStatus !== 'All' || selectedCategory !== 'All' || selectedActorRole !== 'All' || selectedProvider !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('All');
                setSelectedCategory('All');
                setSelectedActorRole('All');
                setSelectedProvider('All');
              }}
              className="text-indigo-400 hover:text-indigo-300 font-medium underline transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3.5 font-medium whitespace-nowrap">Timestamp</th>
                <th className="py-3 px-3.5 font-medium">Performed By</th>
                <th className="py-3 px-3.5 font-medium">Applicant Dossier</th>
                <th className="py-3 px-3.5 font-medium">Action & Category</th>
                <th className="py-3 px-3.5 font-medium">Provider Push Outcome</th>
                <th className="py-3 px-3.5 font-medium">Officer Notes / Terms</th>
                <th className="py-3 px-3.5 font-medium text-right">Forensic Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    <History className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
                    <p className="text-xs">No audit logs matching your current filters.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const applicant = findApplicant(log.applicantId);
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-850/45 transition-colors group cursor-pointer"
                      onClick={() => setSelectedLogForDetail(log)}
                    >
                      {/* Timestamp */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="font-mono text-slate-200 text-[11px] font-medium">
                          {log.timestamp}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {log.timeAgo}
                        </div>
                      </td>

                      {/* Performed By (Actor) */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-1.5 font-medium text-slate-100">
                          {getActorRoleIcon(log.actorRole)}
                          <span className="truncate max-w-[190px]" title={log.performedBy}>
                            {log.performedBy}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5 truncate max-w-[190px]">
                          {log.actorIp || log.actorRole}
                        </div>
                      </td>

                      {/* Applicant & Tier */}
                      <td className="py-3 px-3.5">
                        <div className="font-medium text-slate-100 flex items-center gap-1.5">
                          <span>{log.applicantName}</span>
                          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1 rounded">
                            {log.applicantId}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>BVN: {log.applicantBvnMasked}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-300 font-medium">{log.tierRequested}</span>
                        </div>
                      </td>

                      {/* Action Category & Status Transition */}
                      <td className="py-3 px-3.5">
                        <div>{getCategoryBadge(log.actionCategory)}</div>
                        <div className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1.5 flex-wrap">
                          {log.previousStatus && (
                            <>
                              <span className="text-slate-500 font-mono text-[10px]">{log.previousStatus}</span>
                              <ChevronRight className="w-3 h-3 text-slate-600 inline shrink-0" />
                            </>
                          )}
                          {getStatusBadge(log.newStatus)}
                        </div>
                      </td>

                      {/* Provider Push Outcome */}
                      <td className="py-3 px-3.5">
                        {log.providerOutcome ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-medium text-slate-200">
                                {log.providerOutcome.provider}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1 rounded">
                                {log.providerOutcome.ticketReference}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold inline-flex items-center gap-1 ${
                                  log.providerOutcome.status === 'Provider Approved'
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : log.providerOutcome.status === 'Provider Flagged'
                                    ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                                    : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                                }`}
                              >
                                {log.providerOutcome.status === 'Provider Approved' && (
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                )}
                                {log.providerOutcome.status === 'Provider Flagged' && (
                                  <AlertTriangle className="w-2.5 h-2.5" />
                                )}
                                {log.providerOutcome.status === 'Pushed (Awaiting Provider)' && (
                                  <Clock className="w-2.5 h-2.5" />
                                )}
                                {log.providerOutcome.status}
                              </span>

                              {log.providerOutcome.confidenceScore && (
                                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded">
                                  {log.providerOutcome.confidenceScore}% Match
                                </span>
                              )}
                            </div>

                            {log.providerOutcome.callbackSummary && (
                              <p className="text-[10px] text-slate-400 line-clamp-1 max-w-[220px]">
                                {log.providerOutcome.callbackSummary}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">
                            Internal Review (No Provider Push)
                          </span>
                        )}
                      </td>

                      {/* Officer Notes & Provisional Terms */}
                      <td className="py-3 px-3.5 max-w-[240px]">
                        {log.provisionalTerms ? (
                          <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 mb-1">
                            <span className="font-bold">Provisional:</span> {log.provisionalTerms.periodDays}d grace period • Limit: {formatNgn(log.provisionalTerms.dailyLimitNgn)}/day
                          </div>
                        ) : null}

                        {log.rejectionReason ? (
                          <div className="p-1.5 rounded bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-300 mb-1">
                            <span className="font-bold">Grounds:</span> {log.rejectionReason}
                          </div>
                        ) : null}

                        <p className="text-slate-300 text-[11px] line-clamp-2" title={log.notes || log.summary}>
                          {log.notes || log.summary}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLogForDetail(log);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-slate-700 rounded text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3 text-indigo-400" />
                          Inspect
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

      {/* Forensic Audit Detail Modal */}
      {selectedLogForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    KYC Forensic Audit Trail Record
                    <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {selectedLogForDetail.id}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Timestamp: {selectedLogForDetail.timestamp} ({selectedLogForDetail.timeAgo})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLogForDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Category & Status Summary Banner */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                    Action Category
                  </span>
                  <div>{getCategoryBadge(selectedLogForDetail.actionCategory)}</div>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                    Status Transition
                  </span>
                  <div className="flex items-center sm:justify-end gap-1.5 font-medium text-slate-200">
                    <span className="text-slate-400 font-mono text-xs">{selectedLogForDetail.previousStatus || 'Initiation'}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    {getStatusBadge(selectedLogForDetail.newStatus)}
                  </div>
                </div>
              </div>

              {/* Performed By & Verification Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                    Officer / Originating Actor
                  </span>
                  <div className="font-semibold text-slate-100 text-sm">{selectedLogForDetail.performedBy}</div>
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <span>Role:</span>
                    <span className="text-slate-200 font-medium">{selectedLogForDetail.actorRole}</span>
                  </div>
                  <div className="text-slate-400 font-mono text-[11px]">
                    IP / Switch Gateway: {selectedLogForDetail.actorIp || 'Internal Auth Seal'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-sky-400" />
                    Target Applicant Subject
                  </span>
                  <div className="font-semibold text-slate-100 text-sm flex items-center justify-between">
                    <span>{selectedLogForDetail.applicantName}</span>
                    <span className="font-mono text-xs text-sky-400">{selectedLogForDetail.applicantId}</span>
                  </div>
                  <div className="text-slate-400">
                    Masked BVN: <span className="font-mono text-slate-200">{selectedLogForDetail.applicantBvnMasked}</span>
                  </div>
                  <div className="text-slate-400">
                    Tier Requested: <span className="text-indigo-300 font-semibold">{selectedLogForDetail.tierRequested}</span>
                  </div>
                </div>
              </div>

              {/* Provider Push Outcome Detailed Telemetry */}
              {selectedLogForDetail.providerOutcome && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      External Provider Integration Telemetry
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        selectedLogForDetail.providerOutcome.status === 'Provider Approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : selectedLogForDetail.providerOutcome.status === 'Provider Flagged'
                          ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                          : 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                      }`}
                    >
                      {selectedLogForDetail.providerOutcome.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Service Provider</span>
                      <span className="text-white font-bold">{selectedLogForDetail.providerOutcome.provider}</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Ticket Reference</span>
                      <span className="text-indigo-400 font-bold">{selectedLogForDetail.providerOutcome.ticketReference}</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Review SLA</span>
                      <span className="text-slate-200">{selectedLogForDetail.providerOutcome.priority}</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Confidence / Match</span>
                      <span className="text-emerald-400 font-bold">
                        {selectedLogForDetail.providerOutcome.confidenceScore
                          ? `${selectedLogForDetail.providerOutcome.confidenceScore}% Match`
                          : 'Awaiting Webhook'}
                      </span>
                    </div>
                  </div>

                  {selectedLogForDetail.providerOutcome.callbackSummary && (
                    <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Provider Callback Summary
                      </span>
                      <p className="text-slate-200 text-xs">{selectedLogForDetail.providerOutcome.callbackSummary}</p>
                    </div>
                  )}

                  {selectedLogForDetail.providerOutcome.rawPayloadSnippet && (
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold flex items-center gap-1.5">
                          <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
                          Raw Webhook JSON Payload
                        </span>
                        <button
                          onClick={() =>
                            handleCopyPayload(
                              selectedLogForDetail.providerOutcome?.rawPayloadSnippet || '',
                              selectedLogForDetail.id
                            )
                          }
                          className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          {copiedPayloadId === selectedLogForDetail.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy JSON</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-2.5 bg-slate-950 rounded font-mono text-[11px] text-emerald-400/90 overflow-x-auto border border-slate-800/80">
                        {selectedLogForDetail.providerOutcome.rawPayloadSnippet}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Provisional Terms if applicable */}
              {selectedLogForDetail.provisionalTerms && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                  <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Statutory Provisional Terms & Limits
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400">Grace Period:</span>{' '}
                      <span className="text-white font-bold">{selectedLogForDetail.provisionalTerms.periodDays} Days</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Provisional Daily Limit:</span>{' '}
                      <span className="text-white font-bold">
                        {formatNgn(selectedLogForDetail.provisionalTerms.dailyLimitNgn)}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-amber-200/90">
                    <span className="font-semibold">Compliance Justification:</span> {selectedLogForDetail.provisionalTerms.reason}
                  </div>
                </div>
              )}

              {/* Rejection Grounds if applicable */}
              {selectedLogForDetail.rejectionReason && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-1">
                  <span className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" />
                    Statutory Rejection Grounds
                  </span>
                  <p className="text-rose-200 text-xs font-medium">{selectedLogForDetail.rejectionReason}</p>
                </div>
              )}

              {/* Compliance Notes & Remarks */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Executive Reviewer Remarks & Audit Notes
                </span>
                <p className="text-slate-200 text-xs leading-relaxed">
                  {selectedLogForDetail.notes || selectedLogForDetail.summary}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/90">
              <span className="text-[11px] font-mono text-slate-500">
                Seal Hash: SHA256:{selectedLogForDetail.id.slice(0, 8)}...
              </span>

              <div className="flex items-center gap-2">
                {findApplicant(selectedLogForDetail.applicantId) && onOpenApplicantModal && (
                  <button
                    onClick={() => {
                      const app = findApplicant(selectedLogForDetail.applicantId);
                      if (app) {
                        setSelectedLogForDetail(null);
                        onOpenApplicantModal(app);
                      }
                    }}
                    className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Inspect Applicant Dossier
                  </button>
                )}
                <button
                  onClick={() => setSelectedLogForDetail(null)}
                  className="px-4 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
