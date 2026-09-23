import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CeoDashboard } from './components/views/CeoDashboard';
import { BoardDashboard } from './components/views/BoardDashboard';
import { CtoDashboard } from './components/views/CtoDashboard';
import { CooDashboard } from './components/views/CooDashboard';
import { CfoDashboard } from './components/views/CfoDashboard';
import { CcoDashboard } from './components/views/CcoDashboard';
import { CroDashboard } from './components/views/CroDashboard';
import { LegalDashboard } from './components/views/LegalDashboard';
import { PartnersDashboard } from './components/views/PartnersDashboard';
import { IfwCoinDashboard } from './components/views/IfwCoinDashboard';
import { SecurityDashboard } from './components/views/SecurityDashboard';
import { GrowthDashboard } from './components/views/GrowthDashboard';
import { HrDashboard } from './components/views/HrDashboard';
import { SettingsDashboard } from './components/views/SettingsDashboard';
import { NigeriaGovernanceDashboard } from './components/views/NigeriaGovernanceDashboard';
import { AdminRolesDashboard } from './components/views/AdminRolesDashboard';

import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { ApiTesterModal } from './components/modals/ApiTesterModal';
import { ReportExportModal } from './components/modals/ReportExportModal';
import { KycReviewModal } from './components/modals/KycReviewModal';
import { FraudDetectorModal } from './components/modals/FraudDetectorModal';
import { HighRiskAlertModal } from './components/modals/HighRiskAlertModal';
import { AccountActionModal } from './components/modals/AccountActionModal';
import { HighRiskAlertSentinel } from './components/alerts/HighRiskAlertSentinel';

import { DashboardRole, KycApplicant, KycStatus, ProviderPushLog, HighRiskAlert, KycAuditLog, KycAuditActionCategory } from './types';
import { KYC_APPLICANTS } from './data/mockFintechData';
import { INITIAL_HIGH_RISK_ALERTS } from './data/fraudData';
import { INITIAL_KYC_AUDIT_LOGS } from './data/kycAuditData';
import { CurrencyProvider } from './context/CurrencyContext';

export default function App() {
  const [currentRole, setCurrentRole] = useState<DashboardRole>('ceo');
  const [currentViewId, setCurrentViewId] = useState<string>('ceo_overview');

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isApiTesterOpen, setIsApiTesterOpen] = useState(false);
  const [apiTesterProduct, setApiTesterProduct] = useState<'Wallet API' | 'Payment API' | 'Virtual Account API' | 'KYC API'>('Wallet API');
  const [isReportExportOpen, setIsReportExportOpen] = useState(false);
  const [kycApplicants, setKycApplicants] = useState<KycApplicant[]>(KYC_APPLICANTS);
  const [selectedKycApplicant, setSelectedKycApplicant] = useState<KycApplicant | null>(null);
  const [kycAuditLogs, setKycAuditLogs] = useState<KycAuditLog[]>(INITIAL_KYC_AUDIT_LOGS);

  // Fraud Detector & High-Risk Alert State
  const [isFraudDetectorOpen, setIsFraudDetectorOpen] = useState(false);
  const [fraudDetectorTargetAccount, setFraudDetectorTargetAccount] = useState<string | undefined>(undefined);
  const [isHighRiskAlertModalOpen, setIsHighRiskAlertModalOpen] = useState(false);
  const [highRiskAlerts, setHighRiskAlerts] = useState<HighRiskAlert[]>(INITIAL_HIGH_RISK_ALERTS);
  const [isAudioAlertsEnabled, setIsAudioAlertsEnabled] = useState(false);

  // Account Actions & Rewards Engine State (Freeze, Unfreeze, Block, Unblock, Reward, Bonus)
  const [isAccountActionOpen, setIsAccountActionOpen] = useState(false);
  const [selectedActionAccountId, setSelectedActionAccountId] = useState<string | undefined>(undefined);

  // Audio tone generator for security alerts
  const playRadarBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch {
      // Audio context policy fallback
    }
  };

  const handleToggleAudio = () => {
    const nextState = !isAudioAlertsEnabled;
    setIsAudioAlertsEnabled(nextState);
    if (nextState) {
      playRadarBeep();
    }
  };

  // Global hotkey for quick search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRoleChange = (role: DashboardRole) => {
    setCurrentRole(role);
    const defaultViewMap: Record<string, string> = {
      ceo: 'ceo_overview',
      board: 'board_portal',
      cto: 'tech_command',
      coo: 'regional_hierarchy',
      cfo: 'treasury',
      cco: 'kyc_verification',
      cro: 'fraud_sentinel',
      legal: 'contract_management',
      partners: 'banking_partners',
      ifw_coin: 'coin_overview',
      security: 'security_dashboard',
      growth: 'user_acquisition',
      hr: 'employee_management',
      settings: 'platform_settings',
      super_admin: 'super_admin_command',
      admin_roles: 'maker_checker_queue',
      national_ops: 'national_command',
      regional_ops: 'regional_command',
      state_ops: 'state_command',
      lga_ops: 'lga_command',
    };
    setCurrentViewId(defaultViewMap[role] || 'ceo_overview');
  };

  const handleSelectView = (viewId: string) => {
    setCurrentViewId(viewId);
  };

  const handleOpenApiTester = (product?: string) => {
    if (product === 'Payment API' || product === 'Virtual Account API' || product === 'KYC API') {
      setApiTesterProduct(product);
    } else {
      setApiTesterProduct('Wallet API');
    }
    setIsApiTesterOpen(true);
  };

  const handleOpenKycModal = (applicant: KycApplicant) => {
    setSelectedKycApplicant(applicant);
  };

  const handleKycActionComplete = (
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
  ) => {
    const targetApplicant = kycApplicants.find((app) => app.id === applicantId);

    setKycApplicants((prev) =>
      prev.map((app) => {
        if (app.id !== applicantId) return app;
        const updatedPushes = extraData?.providerPush 
          ? [extraData.providerPush, ...(app.providerPushes || []).filter(p => p.id !== extraData.providerPush?.id)]
          : app.providerPushes || [];
        
        return {
          ...app,
          status: newStatus,
          provisionalPeriodDays: extraData?.provisionalPeriodDays ?? app.provisionalPeriodDays,
          provisionalDailyLimitNgn: extraData?.provisionalDailyLimitNgn ?? app.provisionalDailyLimitNgn,
          provisionalReason: extraData?.provisionalReason ?? app.provisionalReason,
          rejectionReason: extraData?.rejectionReason ?? app.rejectionReason,
          complianceNotes: extraData?.notes ?? app.complianceNotes,
          providerPushes: updatedPushes,
        };
      })
    );

    // Keep active applicant reference synchronized in real time
    setSelectedKycApplicant((curr) => {
      if (!curr || curr.id !== applicantId) return null;
      const updatedPushes = extraData?.providerPush 
        ? [extraData.providerPush, ...(curr.providerPushes || []).filter(p => p.id !== extraData.providerPush?.id)]
        : curr.providerPushes || [];
      return {
        ...curr,
        status: newStatus,
        provisionalPeriodDays: extraData?.provisionalPeriodDays ?? curr.provisionalPeriodDays,
        provisionalDailyLimitNgn: extraData?.provisionalDailyLimitNgn ?? curr.provisionalDailyLimitNgn,
        provisionalReason: extraData?.provisionalReason ?? curr.provisionalReason,
        rejectionReason: extraData?.rejectionReason ?? curr.rejectionReason,
        complianceNotes: extraData?.notes ?? curr.complianceNotes,
        providerPushes: updatedPushes,
      };
    });

    // Record into KYC Audit Trail
    if (targetApplicant) {
      const actionCategory: KycAuditActionCategory =
        extraData?.actionCategory ||
        (newStatus === 'Verified'
          ? 'Tier Upgrade Approved'
          : newStatus === 'Temporary Approved'
          ? 'Temporary Approval Granted'
          : newStatus === 'Rejected'
          ? 'Application Rejected'
          : newStatus === 'High-Risk Escalated'
          ? 'Escalated to AML'
          : newStatus === 'Pushed to Provider'
          ? 'Provider Push Dispatched'
          : 'Document Inspected & Validated');

      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} WAT`;

      const newAuditEntry: KycAuditLog = {
        id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: timeStr,
        timeAgo: 'Just now',
        applicantId: targetApplicant.id,
        applicantName: targetApplicant.fullName,
        applicantBvnMasked: targetApplicant.bvn.length > 5
          ? `${targetApplicant.bvn.slice(0, 5)}****${targetApplicant.bvn.slice(-2)}`
          : targetApplicant.bvn,
        tierRequested: targetApplicant.tierRequested,
        actionCategory,
        performedBy: extraData?.performedBy || 'Barrister Folake Adeleke (CCO)',
        actorRole: extraData?.actorRole || 'Chief Compliance Officer',
        actorIp: '102.89.44.112 (iFutureWallet HQ, Lagos)',
        previousStatus: targetApplicant.status,
        newStatus,
        summary: extraData?.notes || `${actionCategory}: KYC status transitioned to ${newStatus}`,
        notes: extraData?.notes,
        providerOutcome: extraData?.providerOutcome || (extraData?.providerPush ? {
          provider: extraData.providerPush.provider,
          ticketReference: extraData.providerPush.ticketReference,
          reviewType: extraData.providerPush.reviewType,
          priority: extraData.providerPush.priority,
          status: extraData.providerPush.status,
          confidenceScore: extraData.providerPush.responseConfidence,
          callbackSummary: extraData.providerPush.callbackSummary,
        } : undefined),
        provisionalTerms: extraData?.provisionalPeriodDays
          ? {
              periodDays: extraData.provisionalPeriodDays,
              dailyLimitNgn: extraData.provisionalDailyLimitNgn || 250000,
              reason: extraData.provisionalReason || 'Provisional Review',
            }
          : undefined,
        rejectionReason: extraData?.rejectionReason,
      };

      setKycAuditLogs((prev) => [newAuditEntry, ...prev]);
    }
  };

  // Fraud & Alert Action Handlers
  const handleOpenFraudDetector = (initialAccount?: string) => {
    setFraudDetectorTargetAccount(initialAccount);
    setIsFraudDetectorOpen(true);
  };

  const handleOpenHighRiskAlerts = () => {
    if (isAudioAlertsEnabled) {
      playRadarBeep();
    }
    setIsHighRiskAlertModalOpen(true);
  };

  const handleQuarantineAlert = (alertId: string) => {
    setHighRiskAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Quarantined' as const } : a))
    );
    if (isAudioAlertsEnabled) {
      playRadarBeep();
    }
  };

  const handleMitigateAlert = (alertId: string) => {
    setHighRiskAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Mitigated' as const } : a))
    );
  };

  const handleDismissAlert = (alertId: string) => {
    setHighRiskAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Dismissed' as const } : a))
    );
  };

  const handleInspectInFraudDetector = (alert: HighRiskAlert) => {
    setIsHighRiskAlertModalOpen(false);
    handleOpenFraudDetector(alert.affectedEntity);
  };

  // Account Action & Rewards Handler (Freeze, Unfreeze, Block, Unblock, Reward, Bonus)
  const handleOpenAccountAction = (accountId?: string) => {
    setSelectedActionAccountId(accountId);
    setIsAccountActionOpen(true);
  };

  const criticalCount = highRiskAlerts.filter(
    (a) => a.severity === 'Critical' && a.status === 'Active Unresolved'
  ).length;

  // Render main active view based on role
  const renderDashboardView = () => {
    switch (currentRole) {
      case 'ceo':
        return (
          <CeoDashboard
            onOpenReportExport={() => setIsReportExportOpen(true)}
            onNavigateToRole={(role) => handleRoleChange(role as DashboardRole)}
            onOpenAccountAction={handleOpenAccountAction}
          />
        );
      case 'board':
        return (
          <BoardDashboard
            onOpenReportExport={() => setIsReportExportOpen(true)}
          />
        );
      case 'cto':
        return (
          <CtoDashboard
            onOpenApiTester={(product) => handleOpenApiTester(product)}
            onOpenAccountAction={handleOpenAccountAction}
          />
        );
      case 'coo':
        return <CooDashboard />;
      case 'cfo':
        return <CfoDashboard />;
      case 'cco':
        return (
          <CcoDashboard
            kycList={kycApplicants}
            auditLogs={kycAuditLogs}
            onOpenKycModal={handleOpenKycModal}
            onOpenReportExport={() => setIsReportExportOpen(true)}
          />
        );
      case 'cro':
        return (
          <CroDashboard
            onOpenFraudDetector={() => handleOpenFraudDetector()}
            onOpenHighRiskAlerts={handleOpenHighRiskAlerts}
          />
        );
      case 'legal':
        return <LegalDashboard />;
      case 'partners':
        return <PartnersDashboard />;
      case 'ifw_coin':
        return <IfwCoinDashboard />;
      case 'security':
        return <SecurityDashboard />;
      case 'growth':
        return <GrowthDashboard />;
      case 'hr':
        return <HrDashboard />;
      case 'settings':
        return <SettingsDashboard />;
      case 'super_admin':
      case 'admin_roles':
        return (
          <AdminRolesDashboard
            onOpenReportExport={() => setIsReportExportOpen(true)}
            onNavigateToTerritory={(level) => {
              if (level === 'national') handleRoleChange('national_ops');
              else if (level === 'regional') handleRoleChange('regional_ops');
              else if (level === 'state') handleRoleChange('state_ops');
              else handleRoleChange('lga_ops');
            }}
          />
        );
      case 'national_ops':
        return (
          <NigeriaGovernanceDashboard
            initialLevel="national"
            onOpenReportExport={() => setIsReportExportOpen(true)}
            onNavigateToMakerChecker={() => handleRoleChange('admin_roles')}
          />
        );
      case 'regional_ops':
        return (
          <NigeriaGovernanceDashboard
            initialLevel="regional"
            onOpenReportExport={() => setIsReportExportOpen(true)}
            onNavigateToMakerChecker={() => handleRoleChange('admin_roles')}
          />
        );
      case 'state_ops':
        return (
          <NigeriaGovernanceDashboard
            initialLevel="state"
            onOpenReportExport={() => setIsReportExportOpen(true)}
            onNavigateToMakerChecker={() => handleRoleChange('admin_roles')}
          />
        );
      case 'lga_ops':
        return (
          <NigeriaGovernanceDashboard
            initialLevel="lga"
            onOpenReportExport={() => setIsReportExportOpen(true)}
            onNavigateToMakerChecker={() => handleRoleChange('admin_roles')}
          />
        );
      default:
        return (
          <CeoDashboard
            onOpenReportExport={() => setIsReportExportOpen(true)}
            onNavigateToRole={(role) => handleRoleChange(role as DashboardRole)}
          />
        );
    }
  };

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
        {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenApiTester={() => handleOpenApiTester()}
        onOpenReportExport={() => setIsReportExportOpen(true)}
        unreadAlertsCount={3}
        criticalAlertsCount={criticalCount}
        onOpenFraudDetector={() => handleOpenFraudDetector()}
        onOpenHighRiskAlerts={handleOpenHighRiskAlerts}
        onOpenAccountAction={handleOpenAccountAction}
      />

      {/* High-Risk Alert Sentinel Bar */}
      <HighRiskAlertSentinel
        alerts={highRiskAlerts}
        onOpenAlertModal={handleOpenHighRiskAlerts}
        onOpenFraudDetector={() => handleOpenFraudDetector()}
        isAudioEnabled={isAudioAlertsEnabled}
        onToggleAudio={handleToggleAudio}
      />

      {/* Main Shell: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          currentRole={currentRole}
          currentViewId={currentViewId}
          onSelectRole={handleRoleChange}
          onSelectView={handleSelectView}
          onOpenAccountAction={handleOpenAccountAction}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          {renderDashboardView()}
        </main>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(role) => handleRoleChange(role)}
        onOpenFraudDetector={() => handleOpenFraudDetector()}
        onOpenHighRiskAlerts={handleOpenHighRiskAlerts}
        onOpenAccountAction={handleOpenAccountAction}
      />

      <ApiTesterModal
        isOpen={isApiTesterOpen}
        onClose={() => setIsApiTesterOpen(false)}
        defaultProduct={apiTesterProduct}
      />

      <ReportExportModal
        isOpen={isReportExportOpen}
        onClose={() => setIsReportExportOpen(false)}
      />

      <KycReviewModal
        isOpen={!!selectedKycApplicant}
        applicant={selectedKycApplicant}
        onClose={() => setSelectedKycApplicant(null)}
        onActionComplete={handleKycActionComplete}
      />

      {/* Real-Time Fraud Detector Engine Modal */}
      <FraudDetectorModal
        isOpen={isFraudDetectorOpen}
        onClose={() => {
          setIsFraudDetectorOpen(false);
          setFraudDetectorTargetAccount(undefined);
        }}
        initialAccountId={fraudDetectorTargetAccount}
      />

      {/* High-Risk Threat Alerts Sentinel Modal */}
      <HighRiskAlertModal
        isOpen={isHighRiskAlertModalOpen}
        onClose={() => setIsHighRiskAlertModalOpen(false)}
        alerts={highRiskAlerts}
        onQuarantineAlert={handleQuarantineAlert}
        onMitigateAlert={handleMitigateAlert}
        onDismissAlert={handleDismissAlert}
        onInspectInFraudDetector={handleInspectInFraudDetector}
        isAudioEnabled={isAudioAlertsEnabled}
        onToggleAudio={handleToggleAudio}
      />

      {/* Account Action & Rewards Modal (Freeze, Unfreeze, Block, Unblock, Reward, Bonus) */}
      <AccountActionModal
        isOpen={isAccountActionOpen}
        onClose={() => setIsAccountActionOpen(false)}
        initialAccountId={selectedActionAccountId}
      />
    </div>
    </CurrencyProvider>
  );
}
