import { useState } from 'react';
import { 
  UserCheck, 
  ShieldAlert, 
  CheckCircle, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Phone, 
  CreditCard, 
  X, 
  Clock, 
  Send, 
  Building, 
  Sparkles, 
  MapPin, 
  AlertTriangle, 
  ExternalLink, 
  Download, 
  Activity, 
  RefreshCw, 
  Sliders, 
  FileCheck,
  Check,
  ChevronRight,
  Pin,
  MousePointer,
  Scale,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { KycApplicant, KycStatus, SubmittedDocument, ProviderPushLog, KycAuditActionCategory, DocumentAnnotation } from '../../types';
import { DocumentSpecimenCard } from '../kyc/DocumentSpecimenCard';
import { useCurrency } from '../../context/CurrencyContext';
import { INITIAL_DOCUMENT_ANNOTATIONS } from '../../data/kycAnnotationData';
import { getKycTierConfig } from '../../data/kycTierData';
import { KycTierComplianceChecklistView } from '../kyc/KycTierComplianceChecklistView';
import { KycTierPolicyModal } from './KycTierPolicyModal';
import { KycTierLimitConsumptionVisualizer } from '../kyc/KycTierLimitConsumptionVisualizer';

interface KycReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: KycApplicant | null;
  onActionComplete: (
    applicantId: string, 
    newStatus: KycStatus,
    extraData?: {
      provisionalPeriodDays?: number;
      provisionalDailyLimitNgn?: number;
      provisionalReason?: string;
      rejectionReason?: string;
      notes?: string;
      providerPush?: ProviderPushLog;
      actionCategory?: KycAuditActionCategory;
      performedBy?: string;
      actorRole?: 'Chief Compliance Officer' | 'Senior Compliance Analyst' | 'AML Investigator' | 'External Provider Webhook' | 'Automated Risk Engine';
      providerOutcome?: {
        provider: 'Smile ID' | 'Prembly / Identitypass' | 'Dojah' | 'Seamfix' | 'NIBSS Direct' | 'ComplyAdvantage';
        ticketReference: string;
        reviewType: string;
        priority: string;
        status: 'Pushed (Awaiting Provider)' | 'Provider Approved' | 'Provider Flagged' | 'Provider Info Requested';
        confidenceScore?: number;
        callbackSummary?: string;
        slaResponseTime?: string;
        rawPayloadSnippet?: string;
      };
    }
  ) => void;
}

const SERVICE_PROVIDERS = [
  {
    name: 'Smile ID',
    category: 'Biometrics & 3D SmartSelfie™',
    sla: 'Instant (< 2s)',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    description: 'Direct NIBSS BVN, NIMC NIN Biometrics & Passport MRZ Verification with anti-spoofing.',
  },
  {
    name: 'Prembly / Identitypass',
    category: 'Nigerian Identity & CAC Registry',
    sla: 'Sub-second',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    description: 'Deep CAC incorporation filings, TIN validation, and telecom subscriber data.',
  },
  {
    name: 'Dojah',
    category: 'End-to-End African Onboarding',
    sla: 'Instant (< 3s)',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    description: 'Combined KYC, AML watchlist screening, and financial statement analysis.',
  },
  {
    name: 'Seamfix / Verified.ng',
    category: 'Physical Address & Field Verification',
    sla: '1 - 2 Hours',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    description: 'Licensed field agent physical address inspection and geotagged landmark confirmation.',
  },
  {
    name: 'NIBSS Direct API',
    category: 'Central Bank of Nigeria Tier Rails',
    sla: 'Direct Rails',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    description: 'Official CBN Tier 1/2/3 account validation and direct account linkage.',
  },
  {
    name: 'ComplyAdvantage',
    category: 'Global PEP & Sanctions Sentinel',
    sla: 'Instant Batch',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    description: 'UN, OFAC, EU, UK, and Nigerian FIU sanctions and Politically Exposed Persons (PEP).',
  },
] as const;

const REJECTION_REASONS = [
  'Document image blurred, truncated or unreadable',
  'Full legal name does not match BVN / NIMC records',
  'Government ID has expired past statutory threshold',
  'Proof of address utility bill exceeds 90-day validity window',
  'Suspected digital manipulation or fraudulent document artifact',
  '3D facial liveness check failed / anti-spoofing alert triggered',
  'Corporate registration (CAC) inactive or missing beneficial owner'
];

export const KycReviewModal = ({ isOpen, onClose, applicant, onActionComplete }: KycReviewModalProps) => {
  const { formatNgn } = useCurrency();
  const [activeTab, setActiveTab] = useState<'documents' | 'providers' | 'tier_compliance' | 'profile' | 'audit'>('documents');
  const [selectedDocIndex, setSelectedDocIndex] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showPolicyModal, setShowPolicyModal] = useState<boolean>(false);

  // Sub-dialogs
  const [showTemporaryApproveDialog, setShowTemporaryApproveDialog] = useState<boolean>(false);
  const [provisionalDays, setProvisionalDays] = useState<number>(14);
  const [provisionalDailyLimit, setProvisionalDailyLimit] = useState<number>(
    applicant?.tierRequested?.includes('3') ? 1000000 : applicant?.tierRequested?.includes('2') ? 250000 : 25000
  );
  const [provisionalReason, setProvisionalReason] = useState<string>(
    'Awaiting Physical Address Geolocation Inspection by Field Agent'
  );

  const [showRejectDialog, setShowRejectDialog] = useState<boolean>(false);
  const [selectedRejectionReason, setSelectedRejectionReason] = useState<string>(REJECTION_REASONS[0]);
  const [customRejectionNote, setCustomRejectionNote] = useState<string>('');

  // Provider Dispatch Form
  const [selectedProvider, setSelectedProvider] = useState<string>('Smile ID');
  const [selectedReviewType, setSelectedReviewType] = useState<
    'Biometric & Document OCR' | 'Sanctions & PEP Deep Scan' | 'Address Physical Inspection' | 'CAC Entity Verification'
  >('Biometric & Document OCR');
  const [selectedPriority, setSelectedPriority] = useState<
    'Standard (1-2 hrs)' | 'Urgent (15 mins)' | 'Instant SLA (Sub-second)'
  >('Instant SLA (Sub-second)');
  const [providerPushSuccess, setProviderPushSuccess] = useState<string | null>(null);

  // Document Annotations & Pinned Notes
  const [annotations, setAnnotations] = useState<DocumentAnnotation[]>(INITIAL_DOCUMENT_ANNOTATIONS);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [isPinningMode, setIsPinningMode] = useState<boolean>(false);
  const [pendingPinCoords, setPendingPinCoords] = useState<{ x: number; y: number } | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'ocr' | 'annotations'>('annotations');

  const handleAddAnnotation = (ann: Omit<DocumentAnnotation, 'id' | 'createdAt'>) => {
    const created: DocumentAnnotation = {
      ...ann,
      id: `ann-${Date.now()}`,
      createdAt: 'Just now',
    };
    setAnnotations((prev) => [created, ...prev]);
  };

  const handleUpdateAnnotation = (id: string, updates: Partial<DocumentAnnotation>) => {
    setAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
    if (selectedPinId === id) setSelectedPinId(null);
  };

  if (!isOpen || !applicant) return null;

  const currentDocs = applicant.submittedDocuments || [];
  const activeDocument = currentDocs[selectedDocIndex] || currentDocs[0];
  const providerLogs = applicant.providerPushes || [];

  // Actions
  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onActionComplete(applicant.id, 'Verified', {
        notes: notes || 'Compliance Officer Approved. Full Tier Upgrade cleared.',
        actionCategory: 'Tier Upgrade Approved',
        performedBy: 'Barrister Folake Adeleke (CCO)',
        actorRole: 'Chief Compliance Officer',
      });
      onClose();
    }, 600);
  };

  const handleConfirmTemporaryApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onActionComplete(applicant.id, 'Temporary Approved', {
        provisionalPeriodDays: provisionalDays,
        provisionalDailyLimitNgn: provisionalDailyLimit,
        provisionalReason,
        notes: notes || `Provisional clearance for ${provisionalDays} days. Reason: ${provisionalReason}`,
        actionCategory: 'Temporary Approval Granted',
        performedBy: 'Barrister Folake Adeleke (CCO)',
        actorRole: 'Chief Compliance Officer',
      });
      setShowTemporaryApproveDialog(false);
      onClose();
    }, 600);
  };

  const handleConfirmReject = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onActionComplete(applicant.id, 'Rejected', {
        rejectionReason: `${selectedRejectionReason}. ${customRejectionNote}`.trim(),
        notes: notes || `Application rejected: ${selectedRejectionReason}`,
        actionCategory: 'Application Rejected',
        performedBy: 'Barrister Folake Adeleke (CCO)',
        actorRole: 'Chief Compliance Officer',
      });
      setShowRejectDialog(false);
      onClose();
    }, 600);
  };

  const handleEscalateToAml = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onActionComplete(applicant.id, 'High-Risk Escalated', {
        notes: notes || 'Escalated to AML Sentinel and FIU Investigation unit.',
        actionCategory: 'Escalated to AML',
        performedBy: 'Amina Bello (Senior Compliance Analyst)',
        actorRole: 'Senior Compliance Analyst',
      });
      onClose();
    }, 600);
  };

  const handleDispatchToProvider = () => {
    setIsProcessing(true);
    const ticketId = `${selectedProvider.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newPush: ProviderPushLog = {
      id: `push-${Date.now()}`,
      provider: selectedProvider as any,
      dispatchTimestamp: 'Just now',
      ticketReference: ticketId,
      reviewType: selectedReviewType,
      priority: selectedPriority,
      status: 'Pushed (Awaiting Provider)',
      callbackSummary: `Dossier submitted to ${selectedProvider}. Automatic webhook listener armed.`,
    };

    setTimeout(() => {
      setIsProcessing(false);
      setProviderPushSuccess(`Successfully dispatched dossier to ${selectedProvider} (Ticket: ${ticketId})`);
      onActionComplete(applicant.id, 'Pushed to Provider', {
        providerPush: newPush,
        notes: notes || `Pushed to ${selectedProvider} for ${selectedReviewType}. Ticket: ${ticketId}`,
        actionCategory: 'Provider Push Dispatched',
        performedBy: 'Amina Bello (Senior Compliance Analyst)',
        actorRole: 'Senior Compliance Analyst',
        providerOutcome: {
          provider: selectedProvider as any,
          ticketReference: ticketId,
          reviewType: selectedReviewType,
          priority: selectedPriority,
          status: 'Pushed (Awaiting Provider)',
          callbackSummary: `Dossier submitted to ${selectedProvider}. Webhook listener armed.`,
          slaResponseTime: selectedPriority === 'Instant SLA (Sub-second)' ? '< 1s' : '15m SLA',
        },
      });
      setTimeout(() => setProviderPushSuccess(null), 4000);
    }, 800);
  };

  const handleSimulateProviderCallback = (pushId: string, result: 'Approve' | 'Flag') => {
    setIsProcessing(true);
    const targetPush = providerLogs.find(p => p.id === pushId);
    const providerName = targetPush?.provider || selectedProvider;
    const ticketId = targetPush?.ticketReference || `SMI-${Math.floor(100000 + Math.random() * 900000)}`;
    const isApproved = result === 'Approve';
    const confidenceScore = isApproved ? 99.8 : 31.4;
    const callbackSummary = isApproved
      ? `External provider webhook returned: APPROVED (Confidence: ${confidenceScore}%). Biometric match confirmed & anti-spoof passed.`
      : `External provider webhook returned: HIGH RISK FLAGGED (Confidence: ${confidenceScore}%). Synthetic face artifact or PEP match detected.`;

    const updatedPush: ProviderPushLog = targetPush
      ? {
          ...targetPush,
          status: isApproved ? 'Provider Approved' : 'Provider Flagged',
          responseConfidence: confidenceScore,
          callbackSummary,
          callbackTimestamp: 'Just now',
        }
      : {
          id: pushId,
          provider: providerName as any,
          dispatchTimestamp: 'Just now',
          ticketReference: ticketId,
          reviewType: 'Biometric & Document OCR',
          priority: 'Instant SLA (Sub-second)',
          status: isApproved ? 'Provider Approved' : 'Provider Flagged',
          responseConfidence: confidenceScore,
          callbackSummary,
          callbackTimestamp: 'Just now',
        };

    const rawPayload = JSON.stringify(
      {
        event: 'identity.webhook.callback',
        provider: providerName,
        ticket_ref: ticketId,
        outcome: isApproved ? 'APPROVED' : 'FLAGGED',
        confidence_score: confidenceScore / 100,
        liveness_verified: isApproved,
        pep_sanctions_hit: !isApproved,
        dispatch_latency: isApproved ? '490ms' : '1m 14s',
        timestamp: new Date().toISOString(),
      },
      null,
      2
    );

    setTimeout(() => {
      setIsProcessing(false);
      onActionComplete(applicant.id, isApproved ? 'Verified' : 'High-Risk Escalated', {
        providerPush: updatedPush,
        notes: callbackSummary,
        actionCategory: 'Provider Webhook Received',
        performedBy: `${providerName} Webhook Gateway`,
        actorRole: 'External Provider Webhook',
        providerOutcome: {
          provider: providerName as any,
          ticketReference: ticketId,
          reviewType: updatedPush.reviewType,
          priority: updatedPush.priority,
          status: isApproved ? 'Provider Approved' : 'Provider Flagged',
          confidenceScore,
          callbackSummary,
          slaResponseTime: isApproved ? '490ms' : '1m 14s',
          rawPayloadSnippet: rawPayload,
        },
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl my-auto overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-20 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">{applicant.fullName}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  applicant.status === 'Verified'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : applicant.status === 'Temporary Approved'
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                    : applicant.status === 'High-Risk Escalated'
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                    : applicant.status === 'Pushed to Provider'
                    ? 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                    : applicant.status === 'Rejected'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {applicant.status === 'Temporary Approved' && applicant.provisionalPeriodDays
                    ? `Temporary Approved (${applicant.provisionalPeriodDays}d)`
                    : applicant.status}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">ID: {applicant.id}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-slate-400">
                  Requested: <span className="text-indigo-300 font-semibold">{applicant.tierRequested}</span> • Submitted {applicant.submittedAt}
                </p>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-semibold">
                  {applicant.tierRequested.includes('1')
                    ? 'Limit: ₦50K/d • Dep: ₦500K'
                    : applicant.tierRequested.includes('2')
                    ? 'Limit: ₦500K/d • Dep: ₦5M'
                    : applicant.tierRequested.includes('3')
                    ? 'Limit: ₦5M/d • Dep: Unlimited'
                    : 'Limit: ₦50M/d • Dep: Unlimited'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={() => setShowPolicyModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-indigo-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
              title="View Central Bank of Nigeria 3-Tier and Corporate KYC limits & rules"
            >
              <Scale className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">CBN Policy Matrix</span>
            </button>

            <div className="text-right hidden sm:block border-l border-slate-800 pl-2.5">
              <span className="text-[10px] text-slate-400 block uppercase">Risk Engine Score</span>
              <span className={`text-xs font-bold font-mono ${
                applicant.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {applicant.riskScore} / 100 ({applicant.riskScore > 50 ? 'Elevated' : 'Low Risk'})
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time CBN Tier Consumption & Limits Progress Bar Visualizer */}
        <KycTierLimitConsumptionVisualizer
          applicant={applicant}
          onFastApproveUpgrade={handleApprove}
          onOpenChecklist={() => setActiveTab('tier_compliance')}
        />

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/70 px-6 text-xs font-medium gap-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('tier_compliance')}
            className={`py-3 px-1 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'tier_compliance'
                ? 'border-indigo-400 text-indigo-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-4 h-4 text-indigo-400" />
            <span>Tier Checklist & Limits ({applicant.tierRequested})</span>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-1 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'documents'
                ? 'border-indigo-400 text-indigo-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Submitted Documents ({currentDocs.length})
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`py-3 px-1 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'providers'
                ? 'border-indigo-400 text-indigo-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-4 h-4" />
            Push to Service Providers ({providerLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-1 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-indigo-400 text-indigo-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Applicant Profile & Biometrics
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-1 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-indigo-400 text-indigo-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Compliance Audit & Notes
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          {providerPushSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{providerPushSuccess}</span>
            </div>
          )}

          {/* TAB 1: SUBMITTED DOCUMENTS & DOCUMENT ANNOTATIONS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-indigo-400" />
                    All Submitted Documents & Digital Attachments
                  </h4>
                  <p className="text-xs text-slate-400">
                    Click each submitted document below to inspect OCR metadata, forensic authenticity, and attach pinned notes.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {currentDocs.length} Documents Attached
                  </span>
                  <button
                    onClick={() => setSidebarTab(sidebarTab === 'annotations' ? 'ocr' : 'annotations')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                      sidebarTab === 'annotations'
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Pin className="w-3.5 h-3.5" />
                    <span>Annotation Sidebar</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-200">
                      {annotations.filter((a) => a.documentId === activeDocument?.id).length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Document Thumbnails Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {currentDocs.map((doc, idx) => {
                  const docPins = annotations.filter((a) => a.documentId === doc.id);
                  return (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDocIndex(idx)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        selectedDocIndex === idx
                          ? 'bg-slate-800/90 border-indigo-500 shadow-md ring-1 ring-indigo-500/30'
                          : 'bg-slate-950/70 border-slate-800 hover:bg-slate-850/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-200 truncate">{doc.docType}</span>
                        <div className="flex items-center gap-1.5">
                          {docPins.length > 0 && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-0.5">
                              <Pin className="w-2.5 h-2.5" />
                              {docPins.length}
                            </span>
                          )}
                          <span className={`w-2 h-2 rounded-full ${
                            doc.verificationStatus.includes('Verified') || doc.verificationStatus.includes('Validated')
                              ? 'bg-emerald-400'
                              : doc.verificationStatus.includes('Flagged')
                              ? 'bg-rose-400'
                              : 'bg-amber-400'
                          }`} />
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{doc.title}</div>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">{doc.fileFormat} • {doc.fileSize}</div>
                    </button>
                  );
                })}
              </div>

              {/* Active Document Full Specimen Card with Integrated Document Annotation Sidebar */}
              {activeDocument ? (
                <DocumentSpecimenCard
                  document={activeDocument}
                  applicantName={applicant.fullName}
                  annotations={annotations}
                  selectedPinId={selectedPinId}
                  onSelectPin={setSelectedPinId}
                  onAddAnnotation={handleAddAnnotation}
                  onUpdateAnnotation={handleUpdateAnnotation}
                  onDeleteAnnotation={handleDeleteAnnotation}
                  isPinningMode={isPinningMode}
                  onTogglePinningMode={() => setIsPinningMode((p) => !p)}
                  pendingPinCoords={pendingPinCoords}
                  onDocumentClick={(coords) => {
                    setPendingPinCoords(coords);
                    setIsPinningMode(false);
                    setSidebarTab('annotations');
                  }}
                  onClearPendingPin={() => setPendingPinCoords(null)}
                  sidebarTab={sidebarTab}
                  onSidebarTabChange={setSidebarTab}
                />
              ) : (
                <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-500 text-xs">
                  No submitted documents found for this applicant.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PUSH TO SERVICE PROVIDERS */}
          {activeTab === 'providers' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-slate-950 to-slate-950 border border-indigo-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-sm font-semibold text-slate-100">
                    Dispatch to Authorized Service Providers for Secondary Review
                  </h4>
                </div>
                <p className="text-xs text-slate-300">
                  Select a licensed biometric or identity provider (Smile ID, Prembly, Dojah, Seamfix, NIBSS, ComplyAdvantage) 
                  to run third-party cross-checks, field address verification, or automated PEP/AML audits.
                </p>
              </div>

              {/* Provider Selection Grid */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">1. Select Verification Provider</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {SERVICE_PROVIDERS.map((prov) => (
                    <button
                      key={prov.name}
                      onClick={() => setSelectedProvider(prov.name)}
                      className={`p-3.5 rounded-xl border text-left transition-all relative ${
                        selectedProvider === prov.name
                          ? 'bg-indigo-600/10 border-indigo-500 ring-1 ring-indigo-500'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {selectedProvider === prov.name && (
                        <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                      <div className="font-bold text-xs text-slate-100">{prov.name}</div>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-medium border mt-1 mb-1.5 ${prov.badgeColor}`}>
                        {prov.category}
                      </span>
                      <p className="text-[11px] text-slate-400 leading-snug">{prov.description}</p>
                      <div className="text-[10px] text-slate-500 font-mono mt-2">SLA: {prov.sla}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Push Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">2. Verification Scope / Inspection Type</label>
                  <select
                    value={selectedReviewType}
                    onChange={(e: any) => setSelectedReviewType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Biometric & Document OCR">Biometric & Document OCR Check</option>
                    <option value="Sanctions & PEP Deep Scan">Sanctions & PEP Deep Watchlist Scan</option>
                    <option value="Address Physical Inspection">Address Physical Inspection & Landmark Geotag</option>
                    <option value="CAC Entity Verification">CAC Entity Verification & Shareholder Audit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">3. Provider Processing Priority</label>
                  <select
                    value={selectedPriority}
                    onChange={(e: any) => setSelectedPriority(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Instant SLA (Sub-second)">Instant SLA (Sub-second automated webhook)</option>
                    <option value="Urgent (15 mins)">Urgent (15 mins expedited analyst review)</option>
                    <option value="Standard (1-2 hrs)">Standard (1-2 hours batch processing)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleDispatchToProvider}
                  disabled={isProcessing}
                  className="px-5 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Dispatch Dossier to {selectedProvider}
                </button>
              </div>

              {/* Provider Logs & History */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  Provider Dispatch History & Webhook Callbacks
                </h4>

                {providerLogs.length === 0 ? (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 text-xs text-slate-500 text-center">
                    No external provider dispatches yet. Use the selector above to push this application.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {providerLogs.map((log) => (
                      <div key={log.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-200">{log.provider}</span>
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                              Ticket: {log.ticketReference}
                            </span>
                            <span className="text-[11px] text-slate-400">• {log.reviewType}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            log.status === 'Provider Approved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : log.status === 'Provider Flagged'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          }`}>
                            {log.status}
                          </span>
                        </div>

                        {log.callbackSummary && (
                          <div className="text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-850">
                            {log.callbackSummary}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                          <span>Dispatched {log.dispatchTimestamp} • Priority: {log.priority}</span>
                          {/* Simulator button */}
                          {log.status === 'Pushed (Awaiting Provider)' && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400">Simulate Response:</span>
                              <button
                                onClick={() => handleSimulateProviderCallback(log.id, 'Approve')}
                                className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 font-medium"
                              >
                                Trigger Approved
                              </button>
                              <button
                                onClick={() => handleSimulateProviderCallback(log.id, 'Flag')}
                                className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 font-medium"
                              >
                                Trigger Flag
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: TIER REQUIREMENTS & STATUTORY LIMITS CHECKLIST */}
          {activeTab === 'tier_compliance' && (
            <KycTierComplianceChecklistView
              applicant={applicant}
              onGrantProvisional={() => setShowTemporaryApproveDialog(true)}
              onApproveTier={handleApprove}
              onPushToProvider={(provider, reviewType) => {
                setSelectedProvider(provider as any);
                setSelectedReviewType(reviewType as any);
                setActiveTab('providers');
              }}
              onOpenPolicyGuide={() => setShowPolicyModal(true)}
            />
          )}

          {/* TAB 3: APPLICANT PROFILE & BIOMETRICS */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-100">{applicant.fullName}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Current: <span className="text-slate-300">{applicant.currentTier || 'Tier 1'}</span> ➔ Upgrading to: <span className="text-indigo-300 font-semibold">{applicant.tierRequested}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Biometric Match Index</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">98.4% Matched</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-850 text-xs">
                  <div>
                    <span className="text-slate-400 block flex items-center gap-1.5 mb-1">
                      <CreditCard className="w-3.5 h-3.5 text-indigo-400" /> Bank Verification Number (BVN)
                    </span>
                    <span className="font-mono text-slate-200 bg-slate-900 px-2 py-1.5 rounded block border border-slate-800">
                      {applicant.bvn} (NIBSS Direct Match: 100%)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block flex items-center gap-1.5 mb-1">
                      <FileText className="w-3.5 h-3.5 text-indigo-400" /> National Identity Number (NIN)
                    </span>
                    <span className="font-mono text-slate-200 bg-slate-900 px-2 py-1.5 rounded block border border-slate-800">
                      {applicant.nin} (NIMC Database Active)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block flex items-center gap-1.5 mb-1">
                      <Phone className="w-3.5 h-3.5 text-indigo-400" /> Registered Phone
                    </span>
                    <span className="text-slate-200 bg-slate-900 px-2 py-1.5 rounded block border border-slate-800 font-mono">
                      {applicant.phone} (NCC Telecom Validated)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block flex items-center gap-1.5 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Residential / Registered Office
                    </span>
                    <span className="text-slate-200 bg-slate-900 px-2 py-1.5 rounded block border border-slate-800 truncate">
                      {applicant.residentialAddress || '14 Admiralty Way, Lekki Phase 1'}, {applicant.cityState || 'Lagos State'}
                    </span>
                  </div>
                </div>
              </div>

              {applicant.status === 'Temporary Approved' && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-amber-300">
                    <Clock className="w-4 h-4" />
                    Provisional Clearance Active ({applicant.provisionalPeriodDays || 14} Days)
                  </div>
                  <div>
                    Provisional Daily Limit: <span className="font-mono font-bold">{formatNgn(applicant.provisionalDailyLimitNgn || 250000)}</span>
                  </div>
                  <div className="text-[11px] text-amber-300/80">
                    Justification: {applicant.provisionalReason || 'Awaiting secondary address verification'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COMPLIANCE AUDIT & NOTES */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Compliance Officer Review Justification & Legal Notes
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record justification, exceptions granted, verification IDs, or remarks for internal audit."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {applicant.complianceNotes && (
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Previous Note</span>
                  <p className="text-slate-200">{applicant.complianceNotes}</p>
                </div>
              )}

              {applicant.rejectionReason && (
                <div className="p-3.5 bg-rose-500/10 rounded-xl border border-rose-500/30 text-xs text-rose-300">
                  <span className="text-[10px] text-rose-400 uppercase tracking-wider block mb-1">Rejection Grounds</span>
                  <p>{applicant.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* DECISION ACTION FOOTER */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/95 sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleEscalateToAml}
              disabled={isProcessing}
              className="px-3 py-2 text-xs font-medium bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <ShieldAlert className="w-4 h-4" />
              Escalate to AML
            </button>
            <button
              onClick={() => setActiveTab('providers')}
              className="px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-4 h-4 text-indigo-400" />
              Push to Provider
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Reject Button */}
            <button
              onClick={() => setShowRejectDialog(true)}
              disabled={isProcessing}
              className="px-3.5 py-2 text-xs font-medium bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              Reject Application
            </button>

            {/* Temporary Approved Button */}
            <button
              onClick={() => setShowTemporaryApproveDialog(true)}
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Clock className="w-4 h-4" />
              Temporary Approved
            </button>

            {/* Full Approve Button */}
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="px-5 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              Approve & Upgrade Tier
            </button>
          </div>
        </div>
      </div>

      {/* POPUP: TEMPORARY APPROVED CONFIGURATION */}
      {showTemporaryApproveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Grant Temporary Approval</h3>
                <p className="text-xs text-slate-400">Provisional status with restricted daily cap pending full verification</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Provisional Grace Period</label>
                <div className="grid grid-cols-3 gap-2">
                  {[14, 30, 60].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setProvisionalDays(days)}
                      className={`py-2 px-3 rounded-lg border text-center font-semibold transition-colors ${
                        provisionalDays === days
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Provisional Daily Transaction Cap</label>
                <div className="grid grid-cols-3 gap-2">
                  {[250000, 500000, 1000000].map((cap) => (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => setProvisionalDailyLimit(cap)}
                      className={`py-2 px-2 rounded-lg border text-center font-mono font-semibold transition-colors text-[11px] ${
                        provisionalDailyLimit === cap
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {formatNgn(cap)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Provisional Reason / Justification</label>
                <select
                  value={provisionalReason}
                  onChange={(e) => setProvisionalReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Awaiting Physical Address Geolocation Inspection by Field Agent">
                    Awaiting Physical Address Geolocation Inspection by Field Agent
                  </option>
                  <option value="CAC Hardcopy Certified True Copy (CTC) Document In Transit">
                    CAC Hardcopy Certified True Copy (CTC) Document In Transit
                  </option>
                  <option value="Foreign Passport Consular Verification in Progress">
                    Foreign Passport Consular Verification in Progress
                  </option>
                  <option value="Utility Bill DisCo Token Re-submission Window">
                    Utility Bill DisCo Token Re-submission Window
                  </option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowTemporaryApproveDialog(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmTemporaryApprove}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 rounded-xl"
              >
                Confirm Temporary Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP: REJECTION REASON CONFIGURATION */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Reject Application</h3>
                <p className="text-xs text-slate-400">Specify statutory reason for notification and re-submission</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Primary Rejection Ground</label>
                <select
                  value={selectedRejectionReason}
                  onChange={(e) => setSelectedRejectionReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  {REJECTION_REASONS.map((r, i) => (
                    <option key={i} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Instructions for User Re-submission</label>
                <textarea
                  rows={3}
                  value={customRejectionNote}
                  onChange={(e) => setCustomRejectionNote(e.target.value)}
                  placeholder="e.g. Please capture your national identity card with clear lighting without flash reflections."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowRejectDialog(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-semibold bg-rose-500 text-white hover:bg-rose-400 rounded-xl"
              >
                Confirm Rejection & Notify User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CBN TIER POLICY MODAL */}
      <KycTierPolicyModal
        isOpen={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
        initialTier={
          applicant.tierRequested.includes('3')
            ? 'tier_3'
            : applicant.tierRequested.includes('2')
            ? 'tier_2'
            : applicant.tierRequested.includes('Company') || applicant.tierRequested.includes('Corporate')
            ? 'corporate_kyb'
            : 'tier_1'
        }
      />
    </div>
  );
};
