export type DashboardRole = 
  | 'ceo'
  | 'board'
  | 'cto'
  | 'coo'
  | 'cfo'
  | 'cco'
  | 'cro'
  | 'legal'
  | 'cmo'
  | 'growth'
  | 'partners'
  | 'ifw_coin'
  | 'security'
  | 'hr'
  | 'audit'
  | 'dpo'
  | 'settings'
  | 'super_admin'
  | 'national_ops'
  | 'regional_ops'
  | 'state_ops'
  | 'lga_ops'
  | 'admin_roles';

export type UserRole = DashboardRole;

export interface UserPersona {
  id: string;
  name: string;
  title: string;
  role: DashboardRole;
  avatar: string;
  clearanceLevel: string;
}

export interface CeoMetrics {
  totalRegisteredUsers: number;
  activeUsers: number;
  newUsersToday: number;
  mau: number;
  transactionVolume: number;
  transactionValue: number; // in USD or equivalent
  revenueGenerated: number;
  growthRate: number; // percentage
  csatScore: number; // out of 5
  // Financial Overview
  totalWalletBalance: number;
  totalMoneyInflow: number;
  totalMoneyOutflow: number;
  settlementStatus: '100% Settled' | 'Pending Settlement' | 'Reconciling';
  partnerRevenueShare: number;
  commissionPaid: number;
  companyIncome: number;
  // Risk Overview
  fraudAlertsCount: number;
  suspiciousTxnCount: number;
  failedTxnCount: number;
  systemDowntime: string; // e.g. "99.992%"
  complianceAlertsCount: number;
  securityIncidentsCount: number;
}

export interface ExecutiveReport {
  id: string;
  title: string;
  period: 'Daily' | 'Weekly' | 'Monthly' | 'Annual';
  generatedAt: string;
  size: string;
  status: 'Ready' | 'Generating';
  highlights: string[];
  metricsSummary: {
    inflow: string;
    outflow: string;
    activeUsers: string;
    successRate: string;
  };
}

export interface BoardResolution {
  id: string;
  code: string;
  title: string;
  dateProposed: string;
  sponsor: string;
  status: 'Approved' | 'Pending Review' | 'Tabled' | 'In Execution';
  votesFor: number;
  votesAgainst: number;
  category: 'Corporate Governance' | 'Capital Allocation' | 'Tech Roadmap' | 'Regulatory';
}

export interface BoardMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendeesCount: number;
  status: 'Upcoming' | 'Completed';
  agendaItems: string[];
}

export interface ServerNode {
  id: string;
  name: string;
  region: string;
  status: 'Healthy' | 'Degraded' | 'Maintenance';
  cpuUsage: number;
  memoryUsage: number;
  latencyMs: number;
  uptime: string;
}

export interface MobileAppVersion {
  platform: 'Android' | 'iOS';
  version: string;
  adoptionRate: number;
  activeInstalls: number;
  crashFreeRate: number;
  releaseStatus: 'Live (100%)' | 'Phased Rollout (45%)' | 'Review';
  lastUpdated: string;
}

export interface DeveloperAccount {
  id: string;
  name: string;
  email: string;
  team: string;
  accessRole: 'Lead Architect' | 'Core Backend' | 'Mobile Engineer' | 'DevOps Lead';
  lastDeployment: string;
  commitsThisWeek: number;
  status: 'Active' | 'On Call';
}

export interface ApiClient {
  id: string;
  companyName: string;
  tier: 'Enterprise' | 'Growth' | 'Sandbox';
  apiKey: string;
  secretKeyMasked: string;
  env: 'Production' | 'Sandbox';
  dailyRequests: number;
  monthlyLimit: number;
  successRate: number;
  monthlyRevenue: number;
  whitelistedIps: string[];
  status: 'Active' | 'Restricted';
}

export interface ApiEndpointStat {
  product: 'Wallet API' | 'Payment API' | 'Virtual Account API' | 'KYC API';
  endpoint: string;
  method: 'POST' | 'GET';
  description: string;
  requestVolume: number;
  latencyMs: number;
  successRate: number;
}

export interface CustomerOperationMetric {
  totalCustomers: number;
  activeCustomers: number;
  suspendedAccounts: number;
  accountRecoveryRequests: number;
}

export interface ComplaintTicket {
  id: string;
  customerName: string;
  accountNumber: string;
  category: 'Transaction Dispute' | 'Failed Transfer' | 'Card Binding' | 'KYC Verification' | 'App Glitch';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Escalated' | 'Resolved';
  assignedTo: string;
  createdAt: string;
  responseTimeMin: number;
}

export interface RegionalHierarchyNode {
  regionName: string;
  regionalManager: {
    name: string;
    email: string;
    phone: string;
  };
  clusterManagers: {
    name: string;
    clusterArea: string;
    activeDevs: number;
    targetAchievement: number;
  }[];
  totalUsers: number;
  revenueGenerated: number;
  targetUsers: number;
  ranking: number;
}

export interface BusinessDeveloper {
  id: string;
  name: string;
  code: string;
  cluster: string;
  activeReferrals: number;
  newRegistrationsToday: number;
  commissionEarned: number;
  performanceTier: 'Diamond' | 'Gold' | 'Silver' | 'Bronze';
  status: 'Active' | 'Pending Review';
}

export interface BankTreasuryAccount {
  id: string;
  bankName: string;
  accountType: 'Commercial Bank' | 'Payment Service Bank (PSB)' | 'Microfinance Bank (MFB)';
  accountNumberMasked: string;
  balance: number;
  currency: string;
  settlementSpeed: string;
  status: 'Operational' | 'Settling';
}

export interface TransactionRecord {
  id: string;
  reference: string;
  type: 'Wallet Deposit' | 'Withdrawal' | 'Transfer' | 'Bill Payment' | 'Merchant Payment';
  amount: number;
  sender: string;
  recipient: string;
  timestamp: string;
  status: 'Successful' | 'Pending' | 'Flagged' | 'Failed';
  channel: 'Card' | 'Bank Transfer' | 'USSD' | 'IFW Token' | 'Virtual Account';
  fee: number;
}

export type KycStatus = 
  | 'Pending' 
  | 'Verified' 
  | 'Temporary Approved' 
  | 'Rejected' 
  | 'Pushed to Provider' 
  | 'High-Risk Escalated';

export type DocumentAnnotationCategory = 'Clearance' | 'Anomaly' | 'Discrepancy' | 'Observation';

export interface DocumentAnnotation {
  id: string;
  documentId: string;
  applicantId: string;
  pinNumber: number;
  // Normalized percentage position on the document canvas (0-100%)
  x: number; // percentage from left
  y: number; // percentage from top
  width?: number; // percentage width for highlight box
  height?: number; // percentage height for highlight box
  targetArea: string; // e.g. 'Full Legal Name OCR', 'NIN Barcode', 'Passport MRZ Strip', 'CAC Official Seal'
  category: DocumentAnnotationCategory;
  note: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
  resolved?: boolean;
}

export interface SubmittedDocument {
  id: string;
  docType: 
    | 'National ID Slip' 
    | 'International Passport' 
    | "Driver's License" 
    | 'Voter Card'
    | 'Proof of Address' 
    | 'Electricity Bill'
    | 'Waste Bill'
    | 'Water Bill'
    | 'Bank Statement'
    | 'Physical Address Verification Report'
    | 'CAC Certificate' 
    | 'CAC Status Report / MEMART'
    | 'Tax Clearance / TIN' 
    | 'Board Resolution & Signatory Mandate'
    | 'SCUML Certificate'
    | 'Liveness Selfie';
  title: string;
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  issuingAuthority: string;
  fileFormat: 'PDF' | 'JPEG' | 'PNG';
  fileSize: string;
  uploadDate: string;
  verificationStatus: 'Verified (OCR 99.4%)' | 'Verified (Biometric Matched)' | 'Under Review' | 'Flagged (Unclear/Blur)' | 'Pending Provider Check' | 'Validated (NIMC/CAC)';
  extractedFields: {
    label: string;
    value: string;
    matchStatus?: 'matched' | 'warning' | 'mismatch';
  }[];
  previewType: 'id_card' | 'passport' | 'utility_bill' | 'cac_cert' | 'selfie' | 'bank_statement' | 'corporate_doc';
  documentMeta?: Record<string, string>;
}

export interface ProviderPushLog {
  id: string;
  provider: 'Smile ID' | 'Prembly / Identitypass' | 'Dojah' | 'Seamfix' | 'NIBSS Direct' | 'ComplyAdvantage';
  dispatchTimestamp: string;
  ticketReference: string;
  reviewType: 'Biometric & Document OCR' | 'Sanctions & PEP Deep Scan' | 'Address Physical Inspection' | 'CAC Entity Verification';
  priority: 'Standard (1-2 hrs)' | 'Urgent (15 mins)' | 'Instant SLA (Sub-second)';
  status: 'Pushed (Awaiting Provider)' | 'Provider Approved' | 'Provider Flagged' | 'Provider Info Requested';
  responseConfidence?: number;
  callbackSummary?: string;
  callbackTimestamp?: string;
}

export type KycAuditActionCategory = 
  | 'Tier Upgrade Approved'
  | 'Temporary Approval Granted'
  | 'Application Rejected'
  | 'Escalated to AML'
  | 'Provider Push Dispatched'
  | 'Provider Webhook Received'
  | 'Document Inspected & Validated'
  | 'Biometric Check Completed';

export interface KycAuditLog {
  id: string;
  timestamp: string;
  timeAgo: string;
  applicantId: string;
  applicantName: string;
  applicantBvnMasked: string;
  tierRequested: string;
  actionCategory: KycAuditActionCategory;
  performedBy: string;
  actorRole: 'Chief Compliance Officer' | 'Senior Compliance Analyst' | 'AML Investigator' | 'External Provider Webhook' | 'Automated Risk Engine';
  actorIp?: string;
  previousStatus?: KycStatus;
  newStatus: KycStatus;
  summary: string;
  notes?: string;
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
  provisionalTerms?: {
    periodDays: number;
    dailyLimitNgn: number;
    reason: string;
  };
  rejectionReason?: string;
}

export type KycTier = 
  | 'Tier 1' 
  | 'Tier 2' 
  | 'Tier 3' 
  | 'Business/Corporate'
  | 'Company / Business (Corporate KYB)'
  | 'Tier 2 (Full KYB)' 
  | 'Tier 3 (Enterprise)';

export interface CorporateTailoredLimits {
  dailyTransferLimitNgn: number; // e.g. ₦50,000,000, ₦100,000,000, ₦500,000,000
  singleTransactionLimitNgn: number; // e.g. ₦25,000,000
  monthlyVolumeCapNgn: number; // -1 for unlimited
  maxDepositLimitNgn: number; // -1 for unlimited
  settlementRail: 'NIBSS Corporate NIP' | 'RTGS Central Bank' | 'Commercial Treasury Desk';
  customApprovedBy?: string;
  notes?: string;
}

export interface BeneficialOwnerVerification {
  id: string;
  fullName: string;
  role: 'Director' | 'Shareholder / UBO' | 'Managing Director / CEO' | 'Authorized Signatory';
  shareholdingPercentage: number; // e.g. 60%
  bvn: string;
  nin: string;
  idType: 'Passport' | 'National Identity Slip' | "Driver's License" | 'Voter Card';
  idNumber: string;
  pepStatus: 'Clear' | 'PEP Exposed' | 'Sanction Hit';
  verificationStatus: 'Verified' | 'Pending' | 'Flagged';
  verifiedAt?: string;
  isSignatory: boolean;
  biometricMatchScore?: number; // e.g. 99.4%
}

export interface BusinessCorporateDossier {
  companyName: string;
  rcNumber: string; // e.g. RC-994812
  taxIdNumber: string; // FIRS Tax ID / TIN
  vatRegistrationNumber?: string;
  incorporationDate?: string;
  businessType?: 'Private Limited Company (LTD)' | 'Public Limited Company (PLC)' | 'Enterprise / Business Name' | 'Fintech / PSP';
  registeredAddress?: string;
  boardResolutionRef: string;
  boardResolutionDate?: string;
  signatoryMandateType: 'Any Two to Sign' | 'Sole Signatory' | 'Joint Board Approval' | 'Tiered Dual Authorization';
  cacCertificateVerified: boolean;
  cacCertificateDocUrl?: string;
  boardResolutionVerified: boolean;
  boardResolutionDocUrl?: string;
  taxIdVerified: boolean;
  taxIdDocUrl?: string;
  beneficialOwnerIdVerified: boolean;
  beneficialOwners: BeneficialOwnerVerification[];
  tailoredLimits: CorporateTailoredLimits;
  scumlRegistrationNumber?: string;
  scumlVerified?: boolean;
}

export interface TierConsumption {
  dailyTransferSpentNgn: number;
  dailyTransferLimitNgn: number;
  cumulativeDepositBalanceNgn: number;
  cumulativeDepositLimitNgn: number; // -1 for unlimited
  singleTransactionSpentNgn?: number;
  singleTransactionLimitNgn?: number;
  monthlyVelocitySpentNgn?: number;
  monthlyVelocityLimitNgn?: number;
  lastTransferAt?: string;
  lastDepositAt?: string;
  activeBreachWarning?: boolean;
  breachFlagReason?: string;
  projectedTierDailyLimitNgn?: number;
}

export interface KycApplicant {
  id: string;
  fullName: string;
  email?: string;
  bvn: string;
  nin: string;
  phone: string;
  residentialAddress?: string;
  cityState?: string;
  tierRequested: KycTier;
  currentTier?: 'Tier 0 (Unverified)' | 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 2 (Full KYB)' | 'Business/Corporate';
  riskScore: number; // 0 - 100
  status: KycStatus;
  provisionalPeriodDays?: number; // e.g. 14, 30 days if Temporary Approved
  provisionalDailyLimitNgn?: number; // e.g. 250,000 NGN
  provisionalReason?: string;
  rejectionReason?: string;
  submittedAt: string;
  documentType: 'Passport' | "Driver's License" | 'National Identity Slip' | 'CAC Certificate' | 'Voter Card' | 'Utility Bill' | 'Corporate Dossier';
  accountCategory?: 'Individual' | 'Company / Business';
  consumption?: TierConsumption;
  businessCorporateDossier?: BusinessCorporateDossier;
  tailoredLimits?: CorporateTailoredLimits;
  // Verification flags for Tier Rules
  verificationChecks?: {
    bvnNinVerified: boolean;
    contactOrLivenessVerified: boolean;
    contactOrLivenessMethod?: 'Liveness' | 'Phone OTP' | 'Email OTP';
    utilityBillVerified?: boolean;
    utilityBillType?: 'Electric Bill' | 'Waste Bill' | 'Bank Statement' | 'Water Bill';
    govtIdVerified?: boolean;
    govtIdType?: string;
    physicalAddressVerified?: boolean;
    fieldAgentInspector?: string;
    corporateCacVerified?: boolean;
    corporateTinVerified?: boolean;
    corporateDirectorsVerified?: boolean;
    corporateBoardResolutionAttached?: boolean;
    corporateScumlVerified?: boolean;
    corporateBankReferencesVerified?: boolean;
  };
  submittedDocuments: SubmittedDocument[];
  providerPushes?: ProviderPushLog[];
  complianceNotes?: string;
}

export interface AmlCase {
  id: string;
  caseNumber: string;
  subjectName: string;
  transactionRef: string;
  flagType: 'Large Volume Velocity' | 'Sanctions List Hit' | 'Unusual Cross-Border' | 'Structurer Pattern';
  amount: number;
  riskScore: number;
  status: 'Under Investigation' | 'Frozen' | 'Cleared' | 'Reported to FIU';
  assignedAnalyst: string;
  updatedAt: string;
}

export interface FraudAlertItem {
  id: string;
  eventType: 'Brute Force Attack' | 'Multiple Device Swapping' | 'Card Velocity Surge' | 'SIM Swap Suspected';
  affectedAccount: string;
  ipAddress: string;
  location: string;
  severity: 'Critical' | 'High' | 'Medium';
  actionTaken: 'Account Auto-Frozen' | '2FA Challenged' | 'Transaction Held';
  timestamp: string;
}

export interface LegalContract {
  id: string;
  title: string;
  category: 'Bank Agreement' | 'Partner Agreement' | 'API Contract' | 'Vendor Contract' | 'Employment Contract';
  counterparty: string;
  signedDate: string;
  expiryDate: string;
  status: 'Active' | 'Reviewing Renewal' | 'Pending Sign-off';
  value: string;
}

export interface IntellectualPropertyAsset {
  id: string;
  name: string;
  type: 'Registered Trademark' | 'Software Copyright' | 'Patent Application' | 'Brand Asset';
  registrationNumber: string;
  jurisdiction: string;
  status: 'Protected' | 'Filed' | 'In Renewal';
  renewalDate: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: 'Digital / PPC' | 'Referral Drive' | 'Campus Ambassador' | 'Influencer Fintech';
  spend: number;
  newAcquisitions: number;
  cac: number;
  conversionRate: number;
  status: 'Live' | 'Scheduled' | 'Completed';
}

export interface PartnerEntity {
  id: string;
  name: string;
  category: 'Banking Partner' | 'Merchant Partner' | 'Strategic Partner';
  subCategory: 'PSB' | 'Commercial Bank' | 'MFB' | 'Retail E-commerce' | 'Supermarket Chain' | 'Cloud/Tech';
  totalVolume: number;
  settlementBalance: number;
  uptimeRate: number;
  status: 'Active' | 'Under Audit';
  contactPerson: string;
}

export interface IfwTokenomics {
  totalSupply: number; // 105,000,000 IFW
  circulatingSupply: number;
  lockedSupply: number;
  burnedTokens: number;
  treasuryHoldings: number;
  marketPriceUsd: number;
  marketCapUsd: number;
  allocations: {
    category: string;
    percentage: number;
    amount: number;
    color: string;
  }[];
  rewardMultipliers: {
    dailyLogin: number;
    transfer: number;
    referral: number;
    kycCompleted: number;
    loyaltyTier: number;
  };
}

export interface IfwStakingPool {
  id: string;
  name: string;
  durationDays: number;
  apyPercent: number;
  totalStaked: number;
  participants: number;
  status: 'Active' | 'Cap Reached';
}

export interface StaffProfile {
  id: string;
  name: string;
  department: 'Engineering' | 'Executive' | 'Operations' | 'Finance' | 'Risk & Compliance' | 'Marketing' | 'Legal';
  title: string;
  attendanceRate: number;
  performanceScore: number; // out of 100
  payrollStatus: 'Disbursed' | 'Pending Approval';
  monthlySalary: string;
}

export interface InternalAuditItem {
  id: string;
  controlCode: string;
  framework: 'PCI-DSS v4.0' | 'ISO/IEC 27001' | 'SOC 2 Type II' | 'CBN Guidelines';
  controlName: string;
  status: 'Compliant' | 'Remediation Required' | 'Tested & Verified';
  lastAudited: string;
  auditorNotes: string;
}

export interface DataPrivacyRequest {
  id: string;
  applicantName: string;
  requestType: 'Right to Access' | 'Right to be Forgotten' | 'Data Portability' | 'Consent Revocation';
  submissionDate: string;
  deadlineDate: string;
  status: 'Completed' | 'Processing' | 'Verified Identity';
  dpoDecision: 'Granted' | 'Pending Analysis';
}

export interface EcosystemPartner {
  id: string;
  name: string;
  category: string;
  integrationType: string;
  volumeMonth: number;
  commissionRate: string;
  outstandingBalance: number;
  settlementStatus: 'Settled' | 'Pending Clearing';
}

export interface TokenBurnEvent {
  id: string;
  txHash: string;
  amount: number;
  usdValue: number;
  burnedAt: string;
  quarter: string;
}

export interface SecurityAuditLog {
  id: string;
  operator: string;
  action: string;
  subsystem: string;
  ipAddress: string;
  severity: 'High' | 'Medium' | 'Low';
  timestamp: string;
}

export interface EmployeeRecord {
  id: string;
  name: string;
  department: string;
  role: string;
  walletAddress: string;
  salary: number;
  workMode: 'On-site' | 'Remote' | 'Hybrid';
  status: 'Active on Duty' | 'On Leave';
}

export interface PlatformFeeConfig {
  depositFeePercent: number;
  withdrawalFeePercent: number;
  p2pTransferFeePercent: number;
  billPaymentCommissionPercent: number;
  merchantMdrPercent: number;
  ifwCoinDiscountPercent: number;
}

export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  exchangeRateToUsd: number;
  enabled: boolean;
}

export type TerritorialLevel = 'national' | 'regional' | 'state' | 'lga';

export interface NigerianZone {
  id: string;
  name: string;
  code: 'NW' | 'SW' | 'NC' | 'SS' | 'SE' | 'NE';
  zonalDirector: string;
  directorEmail: string;
  directorPhone: string;
  statesCovered: string[];
  activeAgentsCount: number;
  activePosTerminals: number;
  dailyTransactionValueNgn: number;
  monthlyVolumeNgn: number;
  liquidityFloatNgn: number;
  cicoBalanceStatus: 'Surplus' | 'Balanced' | 'Deficit Warning';
  targetAchievementRate: number;
  growthRate: number;
  ranking: number;
  headquartersCity: string;
}

export interface NigerianStateData {
  id: string;
  stateName: string;
  zoneCode: 'NW' | 'SW' | 'NC' | 'SS' | 'SE' | 'NE';
  capitalCity: string;
  stateManager: string;
  contactPhone: string;
  totalLgas: number;
  registeredAgents: number;
  activeTerminals: number;
  dailyVolumeNgn: number;
  monthlyVolumeNgn: number;
  cashInCashOutRatio: string;
  birsTaxCollectionActive: boolean;
  cbnSanefComplianceScore: number;
  topLgas: string[];
}

export interface NigerianLgaData {
  id: string;
  lgaName: string;
  stateName: string;
  zoneCode: string;
  clusterOfficer: string;
  phone: string;
  agentCount: number;
  activePosTerminals: number;
  dailyCicoVolumeNgn: number;
  averageFloatBalanceNgn: number;
  ninBvnVerificationCount: number;
  offlineUssdAgents: number;
  openDisputes: number;
  status: 'Healthy' | 'Float Depleted' | 'Audit Escalated';
}

export interface AdminRoleDefinition {
  id: string;
  roleName: string;
  department: string;
  description: string;
  clearanceLevel: number;
  assignedUsersCount: number;
  cbnComplianceScope: string;
  permissions: {
    canViewTreasury: boolean;
    canInitiatePayout: boolean;
    canApprovePayout: boolean;
    canFreezeWallets: boolean;
    canModifyFees: boolean;
    canManageAgents: boolean;
    canAccessSanefSwitch: boolean;
    canExportAuditLogs: boolean;
    canTriggerEmergencyKillSwitch: boolean;
  };
}

export interface MakerCheckerApprovalItem {
  id: string;
  transactionRef: string;
  actionType: 'High-Value Settlement' | 'Reserve Withdrawal' | 'Fee Schedule Revision' | 'Agent Bulk Float Grant' | 'AML Blacklist Enactment';
  initiatorName: string;
  initiatorRole: string;
  amountNgn?: number;
  amountUsd?: number;
  details: string;
  initiatedAt: string;
  status: 'Pending Dual Signature' | 'Approved & Executed' | 'Rejected';
  riskAssessment: 'Low Risk' | 'Medium Risk' | 'High Risk';
  checkerName?: string;
}

export interface NationalFintechMetrics {
  totalAgencyLocations: number;
  totalPosTerminals: number;
  activeSanefAgents: number;
  cbnLicensedStatus: string;
  nibssDirectSwitchLatencyMs: number;
  cicoDailyVolumeNgn: number;
  nationalFloatReserveNgn: number;
  activeStatesCovered: number;
  activeLgasCovered: number;
  financialInclusionRuralPct: number;
}

export interface FraudDetectionRule {
  id: string;
  name: string;
  category: 'Velocity' | 'Geolocation' | 'Device/Root' | 'Identity/SIM' | 'Amount/Structuring' | 'Watchlist/AML';
  weight: number; // 0-100
  status: 'Passed' | 'Flagged' | 'Warning';
  details: string;
}

export interface FraudAnalysisResult {
  transactionId: string;
  accountId: string;
  accountName: string;
  amount: number;
  currency: string;
  channel: string;
  timestamp: string;
  riskScore: number; // 0 - 100
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  rules: FraudDetectionRule[];
  recommendedAction: 'Approve' | 'Challenge 2FA' | 'Hold for Review' | 'Auto-Freeze Account';
  location: string;
  ipAddress: string;
  deviceFingerprint: string;
  simSwapDetected: boolean;
  bvnMatch: boolean;
  isBlacklisted: boolean;
}

export interface HighRiskAlert {
  id: string;
  alertCode: string;
  title: string;
  description: string;
  affectedEntity: string;
  entityType: 'User Account' | 'POS Terminal' | 'Merchant API Key' | 'Agent Float' | 'Corporate Treasury';
  riskScore: number;
  severity: 'Critical' | 'High' | 'Elevated';
  detectionEngine: 'AI Anomaly Model' | 'Heuristic Rule v4' | 'Telco SIM Sentinel' | 'NIBSS Clearing Guard' | 'Geo-Velocity Sensor';
  timestamp: string;
  status: 'Active Unresolved' | 'Under Investigation' | 'Quarantined' | 'Mitigated' | 'Dismissed';
  suggestedMitigation: string;
  ipAddress?: string;
  location?: string;
  amount?: number;
}


