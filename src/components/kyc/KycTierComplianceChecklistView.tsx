import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Scale, 
  FileText, 
  UserCheck, 
  Zap, 
  Building2, 
  MapPin, 
  ArrowRight,
  ExternalLink,
  Info,
  Check
} from 'lucide-react';
import { KycApplicant, SubmittedDocument } from '../../types';
import { getKycTierConfig, KYC_TIERS_CONFIG, KycTierConfig } from '../../data/kycTierData';

interface KycTierComplianceChecklistViewProps {
  applicant: KycApplicant;
  onGrantProvisional?: () => void;
  onApproveTier?: () => void;
  onPushToProvider?: (provider: string, reviewType: string) => void;
  onOpenPolicyGuide?: () => void;
}

export const KycTierComplianceChecklistView: React.FC<KycTierComplianceChecklistViewProps> = ({
  applicant,
  onGrantProvisional,
  onApproveTier,
  onPushToProvider,
  onOpenPolicyGuide,
}) => {
  const config = getKycTierConfig(applicant.tierRequested);
  const docs = applicant.submittedDocuments || [];

  // 1. Identity Check (BVN OR NIN)
  const hasBvn = Boolean(applicant.bvn && applicant.bvn.length >= 10);
  const hasNin = Boolean(applicant.nin && applicant.nin.length >= 10);
  const isIdentitySatisfied = hasBvn || hasNin;

  // 2. Contact / Biometric Check (Liveness OR Phone OR Email)
  const hasLivenessDoc = docs.some(
    (d) => d.previewType === 'selfie' || d.docType === 'Liveness Selfie' || d.verificationStatus.includes('Biometric')
  );
  const hasPhone = Boolean(applicant.phone && applicant.phone.length >= 10);
  const hasEmail = Boolean(applicant.email && applicant.email.includes('@'));
  const isContactSatisfied = hasLivenessDoc || hasPhone || hasEmail;

  // 3. Utility / Financial Statement Check (Electric, Waste (WEST BILL), Bank Statement, Water Bill)
  const electricBill = docs.find(
    (d) => d.docType === 'Electricity Bill' || d.title.toLowerCase().includes('electric') || d.title.toLowerCase().includes('eko') || d.title.toLowerCase().includes('ikedc') || d.title.toLowerCase().includes('kedco')
  );
  const wasteBill = docs.find(
    (d) => d.docType === 'Waste Bill' || d.title.toLowerCase().includes('waste') || d.title.toLowerCase().includes('lawma') || d.title.toLowerCase().includes('kasupda')
  );
  const bankStatement = docs.find(
    (d) => d.docType === 'Bank Statement' || d.previewType === 'bank_statement' || d.title.toLowerCase().includes('statement')
  );
  const waterBill = docs.find(
    (d) => d.docType === 'Water Bill' || d.title.toLowerCase().includes('water')
  );
  const genericUtility = docs.find(
    (d) => d.previewType === 'utility_bill' || d.docType === 'Proof of Address'
  );

  const matchedUtilityDoc = electricBill || wasteBill || bankStatement || waterBill || genericUtility;
  const isUtilitySatisfied = Boolean(matchedUtilityDoc);

  // 4. Means of Identification Check (Govt ID)
  const govtIdDoc = docs.find(
    (d) => 
      d.previewType === 'id_card' || 
      d.previewType === 'passport' || 
      d.docType === 'National ID Slip' || 
      d.docType === 'International Passport' || 
      d.docType === "Driver's License" ||
      d.docType === 'Voter Card'
  );
  const isGovtIdSatisfied = Boolean(govtIdDoc);

  // 5. Physical Address Verification (In-Person Field Agent Inspection)
  const addressReportDoc = docs.find(
    (d) => d.docType === 'Physical Address Verification Report' || d.title.toLowerCase().includes('physical address') || d.title.toLowerCase().includes('geotagged')
  );
  const hasPhysicalInspection = Boolean(
    addressReportDoc || 
    applicant.verificationChecks?.physicalAddressVerified || 
    applicant.providerPushes?.some(p => p.reviewType.includes('Address') && p.status === 'Provider Approved')
  );

  // 6. Corporate / Business KYB Checks
  const cacCertDoc = docs.find(
    (d) => d.docType === 'CAC Certificate' || d.previewType === 'cac_cert' || d.title.toLowerCase().includes('cac') || d.title.toLowerCase().includes('incorporation')
  );
  const cacStatusDoc = docs.find(
    (d) => d.docType === 'CAC Status Report / MEMART' || d.title.toLowerCase().includes('status report') || d.title.toLowerCase().includes('memart')
  );
  const tinDoc = docs.find(
    (d) => d.docType === 'Tax Clearance / TIN' || d.title.toLowerCase().includes('tin') || d.title.toLowerCase().includes('tax')
  );
  const boardResDoc = docs.find(
    (d) => d.docType === 'Board Resolution & Signatory Mandate' || d.title.toLowerCase().includes('resolution') || d.title.toLowerCase().includes('mandate')
  );
  const scumlDoc = docs.find(
    (d) => d.docType === 'SCUML Certificate' || d.title.toLowerCase().includes('scuml')
  );
  const corporateBankRef = bankStatement || docs.find(d => d.title.toLowerCase().includes('reference'));

  // Corporate Specific Statutory Pillars:
  const isCacVerified = Boolean(
    cacCertDoc || 
    applicant.businessCorporateDossier?.cacCertificateVerified || 
    applicant.verificationChecks?.corporateCacVerified
  );
  const isBoardResolutionVerified = Boolean(
    boardResDoc || 
    applicant.businessCorporateDossier?.boardResolutionVerified || 
    applicant.verificationChecks?.corporateBoardResolutionAttached
  );
  const isTaxIdVerified = Boolean(
    tinDoc || 
    applicant.businessCorporateDossier?.taxIdVerified || 
    applicant.verificationChecks?.corporateTinVerified
  );
  const isBeneficialOwnerVerified = Boolean(
    applicant.businessCorporateDossier?.beneficialOwnerIdVerified || 
    applicant.verificationChecks?.corporateDirectorsVerified ||
    (applicant.businessCorporateDossier?.beneficialOwners && applicant.businessCorporateDossier.beneficialOwners.length > 0)
  );

  // Calculate overall eligibility based on Tier
  let isFullyEligible = false;
  let eligibilitySummary = '';

  if (config.id === 'tier_1') {
    isFullyEligible = isIdentitySatisfied && isContactSatisfied;
    eligibilitySummary = isFullyEligible
      ? 'All Tier 1 requirements met (BVN/NIN + Contact verification verified). Ready for approval with ₦50K daily transfer limit and ₦500K max balance.'
      : 'Missing either BVN/NIN identifier or phone/email/liveness contact verification.';
  } else if (config.id === 'tier_2') {
    isFullyEligible = isIdentitySatisfied && isContactSatisfied && isUtilitySatisfied && isGovtIdSatisfied;
    eligibilitySummary = isFullyEligible
      ? 'All Tier 2 requirements met (BVN/NIN, Contact verification, Utility/Statement, and Means of ID). Eligible for ₦500K daily transfer limit and ₦5M max balance.'
      : 'Pending required documents for Tier 2 (Utility bill or valid Government ID).';
  } else if (config.id === 'tier_3') {
    isFullyEligible = isIdentitySatisfied && isContactSatisfied && isUtilitySatisfied && isGovtIdSatisfied && hasPhysicalInspection;
    eligibilitySummary = isFullyEligible
      ? 'All Tier 3 requirements met including in-person physical address inspection. Eligible for ₦5M daily limit and Unlimited deposit capacity.'
      : hasPhysicalInspection 
        ? 'Pending documentary requirements for Tier 3.' 
        : 'In-person physical address verification pending. Compliance Officer may grant Temporary Approval (provisional limits) or dispatch field agent.';
  } else if (config.id === 'business_corporate') {
    isFullyEligible = isCacVerified && isBoardResolutionVerified && isTaxIdVerified && isBeneficialOwnerVerified;
    eligibilitySummary = isFullyEligible
      ? 'All Business/Corporate KYC requirements met (CAC Certificate, Board Resolution, Tax ID, and Beneficial Owner ID verification). Tailored limits active.'
      : 'Pending required corporate documentation: CAC Certificate, Board Resolution, Tax ID (TIN), or Beneficial Owner ID verification.';
  } else {
    // Corporate KYB
    const isCorporateComplete = Boolean(cacCertDoc && tinDoc && corporateBankRef && (boardResDoc || isGovtIdSatisfied));
    isFullyEligible = isCorporateComplete && !applicant.complianceNotes?.includes('AML');
    eligibilitySummary = isFullyEligible
      ? 'Corporate KYB verified against CAC and FIRS databases. Standard corporate limits active (₦50M daily / Unlimited deposit).'
      : 'Corporate dossier under multi-signatory / registry verification. Review CAC Status Report and UBO records.';
  }

  return (
    <div className="space-y-5">
      {/* TIER HERO BANNER */}
      <div className={`p-4 rounded-xl border ${config.borderColor} ${config.bgColor} space-y-3`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${config.badgeColor}`}>
              {config.category === 'Company / Business' ? (
                <Building2 className="w-5 h-5" />
              ) : (
                <UserCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${config.badgeColor}`}>
                  {config.shortName}
                </span>
                <span className="text-xs text-slate-400">• {config.category}</span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">{config.name}</h3>
            </div>
          </div>

          {onOpenPolicyGuide && (
            <button
              onClick={onOpenPolicyGuide}
              className="px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs text-indigo-300 font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0"
            >
              <Scale className="w-3.5 h-3.5 text-indigo-400" />
              <span>CBN Policy Guide</span>
            </button>
          )}
        </div>

        {/* FINANCIAL LIMITS STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80">
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Daily Transfer Limit</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              {config.dailyTransferLimitLabel.split(' ')[0]}
            </span>
            <span className="text-[10px] text-slate-500 block">per calendar day</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Max Amount Deposited</span>
            <span className="text-sm font-bold text-cyan-400 font-mono">
              {config.maxDepositLimit === Infinity ? 'UNLIMITED' : config.maxDepositLimitLabel.split(' ')[0]}
            </span>
            <span className="text-[10px] text-slate-500 block">cumulative balance ceiling</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Single Transaction Cap</span>
            <span className="text-sm font-bold text-indigo-300 font-mono">
              {config.singleTransferLimitLabel.split(' ')[0]}
            </span>
            <span className="text-[10px] text-slate-500 block">instant rail debit limit</span>
          </div>
        </div>
      </div>

      {/* VERIFICATION CHECKLIST ACCORDING TO USER'S SPECIFICATIONS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Statutory Requirements Checklist for {config.shortName}
          </h4>
          <span className="text-[11px] text-slate-400">
            Enforces CBN FPR/DIR/GEN/CIR/01/001 & CAMA 2020
          </span>
        </div>

        {/* 1. NATIONAL IDENTIFIER: BVN OR NIN */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono text-indigo-300 flex items-center justify-center font-bold">
                1
              </span>
              <span className="text-xs font-semibold text-slate-200">
                National Identity Identifier (BVN OR NIN)
              </span>
            </div>
            <span
              className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                isIdentitySatisfied
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isIdentitySatisfied ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  Validated (BVN / NIN Matched)
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  Missing Identifier
                </>
              )}
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Rule: Only requires <strong className="text-slate-200">either BVN OR NIN</strong> for valid identity resolution against NIBSS / NIMC databases.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
            <div className={`p-2 rounded-lg border ${hasBvn ? 'bg-slate-900 border-slate-750 text-slate-200' : 'bg-slate-950 border-slate-850 text-slate-500'}`}>
              <div className="text-[10px] text-slate-400 mb-0.5">Bank Verification Number (BVN)</div>
              <div className="font-mono flex items-center justify-between">
                <span>{applicant.bvn || 'Not Provided'}</span>
                {hasBvn && <span className="text-[10px] text-emerald-400 font-semibold">100% NIBSS Match</span>}
              </div>
            </div>

            <div className={`p-2 rounded-lg border ${hasNin ? 'bg-slate-900 border-slate-750 text-slate-200' : 'bg-slate-950 border-slate-850 text-slate-500'}`}>
              <div className="text-[10px] text-slate-400 mb-0.5">National Identification Number (NIN)</div>
              <div className="font-mono flex items-center justify-between">
                <span>{applicant.nin || 'Not Provided'}</span>
                {hasNin && <span className="text-[10px] text-emerald-400 font-semibold">NIMC Active</span>}
              </div>
            </div>
          </div>
        </div>

        {/* 2. CONTACT / BIOMETRIC CHECK: LIVENESS OR PHONE OR EMAIL */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono text-indigo-300 flex items-center justify-center font-bold">
                2
              </span>
              <span className="text-xs font-semibold text-slate-200">
                Contact & Biometric Presence (Liveness OR Phone OR Email Verification)
              </span>
            </div>
            <span
              className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                isContactSatisfied
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isContactSatisfied ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  Verified (At least 1 Channel Satisfied)
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  Unverified
                </>
              )}
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Rule: Only requires <strong className="text-slate-200">Liveness OR Phone Number verification OR Email verification</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
            <div className={`p-2 rounded-lg border ${hasLivenessDoc ? 'bg-slate-900 border-emerald-500/30 text-slate-200' : 'bg-slate-950 border-slate-850 text-slate-500'}`}>
              <div className="text-[10px] text-slate-400">Option A: 3D Facial Liveness</div>
              <div className="font-medium mt-0.5 flex items-center gap-1">
                {hasLivenessDoc ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> 99.8% Live Human
                  </span>
                ) : (
                  <span>Available on Mobile</span>
                )}
              </div>
            </div>

            <div className={`p-2 rounded-lg border ${hasPhone ? 'bg-slate-900 border-emerald-500/30 text-slate-200' : 'bg-slate-950 border-slate-850 text-slate-500'}`}>
              <div className="text-[10px] text-slate-400">Option B: Phone SMS OTP</div>
              <div className="font-mono text-[11px] mt-0.5 truncate flex items-center gap-1">
                {hasPhone ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 truncate">
                    <Check className="w-3 h-3 shrink-0" /> {applicant.phone}
                  </span>
                ) : (
                  <span>Not Provided</span>
                )}
              </div>
            </div>

            <div className={`p-2 rounded-lg border ${hasEmail ? 'bg-slate-900 border-emerald-500/30 text-slate-200' : 'bg-slate-950 border-slate-850 text-slate-500'}`}>
              <div className="text-[10px] text-slate-400">Option C: Email Verification</div>
              <div className="text-[11px] mt-0.5 truncate flex items-center gap-1">
                {hasEmail ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 truncate">
                    <Check className="w-3 h-3 shrink-0" /> {applicant.email}
                  </span>
                ) : (
                  <span>Not Provided</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. UTILITY / FINANCIAL STATEMENT CHECK (TIER 2, TIER 3, CORPORATE) */}
        {config.id === 'tier_1' ? (
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850 text-slate-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-center font-bold">
                3
              </span>
              <div>
                <span className="font-semibold text-slate-300">Utility / Financial Statement Proof</span>
                <span className="block text-[11px] text-slate-500 mt-0.5">
                  Electric bill, waste bill, bank statement, or water bill are <strong>NOT required for Tier 1</strong>.
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Tier 1 Exempt
            </span>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono text-indigo-300 flex items-center justify-center font-bold">
                  3
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  Utility / Financial Statement Proof (Electric, Waste, Water, or Bank Statement)
                </span>
              </div>
              <span
                className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                  isUtilitySatisfied
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {isUtilitySatisfied ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Verified ({matchedUtilityDoc?.docType})
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3" />
                    Missing Utility Proof
                  </>
                )}
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Rule: Requires <strong className="text-slate-200">any ONE</strong> of Electric Bill, Waste Bill (WEST BILL), Bank Statement, OR Water Bill (&lt; 90 days old).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
              <div className={`p-2 rounded-lg border ${electricBill ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                <div className="text-[10px] text-slate-400">Electric Bill</div>
                <div className="text-[11px] font-medium mt-0.5 truncate">
                  {electricBill ? '✓ Detected' : 'Not attached'}
                </div>
              </div>

              <div className={`p-2 rounded-lg border ${wasteBill ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                <div className="text-[10px] text-slate-400">Waste Bill (West Bill)</div>
                <div className="text-[11px] font-medium mt-0.5 truncate">
                  {wasteBill ? '✓ Detected (LAWMA)' : 'Not attached'}
                </div>
              </div>

              <div className={`p-2 rounded-lg border ${bankStatement ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                <div className="text-[10px] text-slate-400">Bank Statement</div>
                <div className="text-[11px] font-medium mt-0.5 truncate">
                  {bankStatement ? '✓ Official PDF' : 'Not attached'}
                </div>
              </div>

              <div className={`p-2 rounded-lg border ${waterBill ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                <div className="text-[10px] text-slate-400">Water Bill</div>
                <div className="text-[11px] font-medium mt-0.5 truncate">
                  {waterBill ? '✓ Water Board' : 'Not attached'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. MEANS OF IDENTIFICATION (TIER 2, TIER 3, CORPORATE) */}
        {config.id === 'tier_1' ? (
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850 text-slate-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-center font-bold">
                4
              </span>
              <div>
                <span className="font-semibold text-slate-300">Means of Identification (Govt ID)</span>
                <span className="block text-[11px] text-slate-500 mt-0.5">
                  Physical government ID card is <strong>NOT required for Tier 1</strong> (BVN/NIN digital resolution is sufficient).
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Tier 1 Exempt
            </span>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono text-indigo-300 flex items-center justify-center font-bold">
                  4
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  Means of Identification (Government-Issued Photo ID)
                </span>
              </div>
              <span
                className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                  isGovtIdSatisfied
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {isGovtIdSatisfied ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Verified ({govtIdDoc?.docType})
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3" />
                    Missing Government ID
                  </>
                )}
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Rule: Requires valid <strong className="text-slate-200">NIN Slip, International Passport, Driver's License, or Voter's Card</strong>.
            </p>

            {govtIdDoc && (
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 block">{govtIdDoc.title}</span>
                  <span className="text-[11px] text-slate-400">
                    Doc No: {govtIdDoc.documentNumber || 'Validated'} • Issuing Auth: {govtIdDoc.issuingAuthority}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {govtIdDoc.verificationStatus}
                </span>
              </div>
            )}
          </div>
        )}

        {/* 5. ADDRESS VERIFICATION (MANDATORY FOR TIER 3 & CORPORATE) */}
        {config.id === 'tier_3' || config.id === 'corporate_kyb' ? (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono text-indigo-300 flex items-center justify-center font-bold">
                  5
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  In-Person Physical Address Verification (Mandatory for {config.shortName})
                </span>
              </div>
              <span
                className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                  hasPhysicalInspection
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                }`}
              >
                {hasPhysicalInspection ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Inspection Completed & Geotagged
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3" />
                    Agent Inspection Pending
                  </>
                )}
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Rule: Requires <strong className="text-slate-200">physical field agent visit, GPS geotagged coordinates</strong>, and residence inspection report for Tier 3 Unlimited deposit unlock.
            </p>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-slate-300 font-medium block">
                  Location: {applicant.residentialAddress || 'Registered Address'}, {applicant.cityState}
                </span>
                <span className="text-[11px] text-slate-400">
                  {hasPhysicalInspection
                    ? 'Field agent report confirmed resident occupancy. Geotagged coordinates verified.'
                    : 'Physical inspection agent can be dispatched via Seamfix / Verified.ng network.'}
                </span>
              </div>

              {!hasPhysicalInspection && onGrantProvisional && (
                <button
                  onClick={onGrantProvisional}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  <Clock className="w-3.5 h-3.5" />
                  Grant Provisional Approval
                </button>
              )}
            </div>
          </div>
        ) : null}

        {/* 6. BUSINESS / CORPORATE KYB STATUTORY REQUIREMENTS */}
        {(config.id === 'business_corporate' || config.id === 'corporate_kyb') && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono text-indigo-300 flex items-center justify-center font-bold">
                  6
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  Business / Corporate Statutory Requirements & Tailored Governance
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                CAMA 2020 & CBN AML/CFT 2022
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {/* CAC Certificate */}
              <div className={`p-3 rounded-lg border ${
                isCacVerified 
                  ? 'bg-slate-900/90 border-emerald-500/30' 
                  : 'bg-slate-900/70 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    1. CAC Certificate (RC/BN)
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isCacVerified 
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}>
                    {isCacVerified ? '✓ Verified Active' : 'Pending CAC'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {applicant.businessCorporateDossier?.rcNumber ? `RC: ${applicant.businessCorporateDossier.rcNumber} • ` : ''}
                  Certificate of Incorporation and certified CAC Status Report / MEMART.
                </p>
              </div>

              {/* Board Resolution */}
              <div className={`p-3 rounded-lg border ${
                isBoardResolutionVerified 
                  ? 'bg-slate-900/90 border-emerald-500/30' 
                  : 'bg-slate-900/70 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-indigo-400" />
                    2. Board Resolution & Mandate
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isBoardResolutionVerified 
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}>
                    {isBoardResolutionVerified ? '✓ Resolution Passed' : 'Pending Resolution'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {applicant.businessCorporateDossier?.boardResolutionRef ? `Ref: ${applicant.businessCorporateDossier.boardResolutionRef} • ` : ''}
                  Signed by Chairman & Secretary with designated authorized signatories mandate.
                </p>
              </div>

              {/* Tax ID (TIN) */}
              <div className={`p-3 rounded-lg border ${
                isTaxIdVerified 
                  ? 'bg-slate-900/90 border-emerald-500/30' 
                  : 'bg-slate-900/70 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    3. Tax ID (TIN) & FIRS
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isTaxIdVerified 
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}>
                    {isTaxIdVerified ? '✓ Validated FIRS' : 'Pending Tax ID'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {applicant.businessCorporateDossier?.taxIdNumber ? `TIN: ${applicant.businessCorporateDossier.taxIdNumber} • ` : ''}
                  FIRS/JTB Tax Identification Number & active VAT registration clearance.
                </p>
              </div>

              {/* Beneficial Owner ID Verification */}
              <div className={`p-3 rounded-lg border ${
                isBeneficialOwnerVerified 
                  ? 'bg-slate-900/90 border-emerald-500/30' 
                  : 'bg-slate-900/70 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                    4. Beneficial Owner ID (UBO ≥ 5%)
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isBeneficialOwnerVerified 
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}>
                    {isBeneficialOwnerVerified ? '✓ UBOs Verified' : 'Pending UBO Check'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {applicant.businessCorporateDossier?.beneficialOwners?.length 
                    ? `${applicant.businessCorporateDossier.beneficialOwners.length} UBOs & Directors screened • ` 
                    : ''}
                  BVN, NIN, and Government Photo ID verified for all owners with ≥ 5% equity.
                </p>
              </div>
            </div>

            {/* Tailored Limits summary snippet */}
            <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-indigo-300 font-semibold">Tailored Limits Profile:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {applicant.tailoredLimits?.dailyTransferLimitNgn
                    ? `₦${(applicant.tailoredLimits.dailyTransferLimitNgn / 1000000).toLocaleString()}M Daily`
                    : '₦50,000,000 Standard Daily'}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300 font-mono">
                  Rail: {applicant.tailoredLimits?.settlementRail || 'NIBSS Corporate NIP'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-indigo-300">
                Statutory Deposit: Unlimited
              </span>
            </div>
          </div>
        )}
      </div>

      {/* COMPLIANCE VERDICT FOOTER CARD */}
      <div className={`p-4 rounded-xl border ${isFullyEligible ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-950 border-slate-800'} space-y-3`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
              Compliance Officer Automated Evaluation
            </span>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              {isFullyEligible ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Applicant Meets All Criteria for {config.name}
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Criteria Assessment for {config.shortName}
                </>
              )}
            </h4>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">{eligibilitySummary}</p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 block">Target Limits</span>
            <span className="text-xs font-mono font-bold text-emerald-400 block">
              {config.dailyTransferLimitLabel.split(' ')[0]} daily
            </span>
            <span className="text-[10px] font-mono text-cyan-400">
              {config.maxDepositLimit === Infinity ? 'Unlimited Deposit' : `${config.maxDepositLimitLabel.split(' ')[0]} max`}
            </span>
          </div>
        </div>

        {onApproveTier && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end gap-2.5">
            {onGrantProvisional && config.id === 'tier_3' && !hasPhysicalInspection && (
              <button
                onClick={onGrantProvisional}
                className="px-4 py-2 text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Clock className="w-4 h-4" />
                Grant Temporary Approval (₦500K Daily)
              </button>
            )}

            <button
              onClick={onApproveTier}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md ${
                isFullyEligible
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve for {config.shortName}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
