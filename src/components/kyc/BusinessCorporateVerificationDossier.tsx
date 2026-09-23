import React, { useState } from 'react';
import {
  Building2,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Scale,
  Sliders,
  Sparkles,
  ExternalLink,
  Lock,
  Unlock,
  Check,
  X,
  FileText,
  AlertCircle,
  Plus,
  RefreshCw,
  Coins,
  ArrowRight
} from 'lucide-react';
import { 
  KycApplicant, 
  BusinessCorporateDossier, 
  CorporateTailoredLimits, 
  BeneficialOwnerVerification 
} from '../../types';

interface BusinessCorporateVerificationDossierProps {
  applicant: KycApplicant;
  onUpdateApplicant?: (updatedApplicant: KycApplicant) => void;
  onApproveCorporateTier?: (tailoredLimits: CorporateTailoredLimits) => void;
}

export const BusinessCorporateVerificationDossier: React.FC<BusinessCorporateVerificationDossierProps> = ({
  applicant,
  onUpdateApplicant,
  onApproveCorporateTier,
}) => {
  // Default mock dossier if not present on applicant
  const initialDossier: BusinessCorporateDossier = applicant.businessCorporateDossier || {
    companyName: applicant.fullName.includes('Ltd') || applicant.fullName.includes('PLC') || applicant.fullName.includes('Logistics')
      ? applicant.fullName
      : `${applicant.fullName} Enterprises Ltd`,
    rcNumber: 'RC-994812',
    taxIdNumber: 'TIN-8891024-0001',
    vatRegistrationNumber: 'VAT-NG-8891024',
    incorporationDate: '14 May 2018',
    businessType: 'Private Limited Company (LTD)',
    registeredAddress: applicant.residentialAddress || 'Plot 12A, Victoria Island Commercial Corridor, Lagos',
    boardResolutionRef: 'BR-2026-09-Q3',
    boardResolutionDate: '02 Sept 2026',
    signatoryMandateType: 'Any Two to Sign',
    cacCertificateVerified: true,
    cacCertificateDocUrl: 'https://cac.gov.ng/verify/RC-994812',
    boardResolutionVerified: true,
    boardResolutionDocUrl: 'https://storage.cloud.gov.ng/resolutions/BR-2026-09-Q3.pdf',
    taxIdVerified: true,
    taxIdDocUrl: 'https://taxportal.firs.gov.ng/verify/TIN-8891024-0001',
    beneficialOwnerIdVerified: true,
    scumlRegistrationNumber: 'SCUML-RN-449120',
    scumlVerified: true,
    tailoredLimits: applicant.tailoredLimits || {
      dailyTransferLimitNgn: 50000000,
      singleTransactionLimitNgn: 25000000,
      monthlyVolumeCapNgn: -1, // Unlimited
      maxDepositLimitNgn: -1, // Unlimited
      settlementRail: 'NIBSS Corporate NIP',
      customApprovedBy: 'Senior Compliance Director',
      notes: 'Statutory limits approved under CAMA 2020 Corporate Framework with dual-signatory mandate.',
    },
    beneficialOwners: [
      {
        id: 'ubo-01',
        fullName: 'Alhaji Aliko B. Dangote',
        role: 'Managing Director / CEO',
        shareholdingPercentage: 60,
        bvn: '22198471029',
        nin: '10928374615',
        idType: 'Passport',
        idNumber: 'A08912409',
        pepStatus: 'Clear',
        verificationStatus: 'Verified',
        verifiedAt: '2026-09-20',
        isSignatory: true,
        biometricMatchScore: 99.8,
      },
      {
        id: 'ubo-02',
        fullName: 'Mrs. Folorunsho A. Alakija',
        role: 'Director',
        shareholdingPercentage: 25,
        bvn: '22340192831',
        nin: '99281746201',
        idType: 'Passport',
        idNumber: 'B11948201',
        pepStatus: 'Clear',
        verificationStatus: 'Verified',
        verifiedAt: '2026-09-20',
        isSignatory: true,
        biometricMatchScore: 99.4,
      },
      {
        id: 'ubo-03',
        fullName: 'Dr. Amina Bello-Kano',
        role: 'Shareholder / UBO',
        shareholdingPercentage: 15,
        bvn: '22481092341',
        nin: '88102938471',
        idType: 'National Identity Slip',
        idNumber: 'NIN-88102938471',
        pepStatus: 'Clear',
        verificationStatus: 'Verified',
        verifiedAt: '2026-09-21',
        isSignatory: false,
        biometricMatchScore: 98.9,
      },
    ],
  };

  const [dossier, setDossier] = useState<BusinessCorporateDossier>(initialDossier);
  const [limits, setLimits] = useState<CorporateTailoredLimits>(initialDossier.tailoredLimits);
  const [isSavedMessage, setIsSavedMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pillars' | 'ubos' | 'tailored_limits'>('pillars');
  const [isAddUboOpen, setIsAddUboOpen] = useState<boolean>(false);

  // New UBO form state
  const [newUboName, setNewUboName] = useState('');
  const [newUboRole, setNewUboRole] = useState<'Director' | 'Shareholder / UBO' | 'Managing Director / CEO' | 'Authorized Signatory'>('Director');
  const [newUboShare, setNewUboShare] = useState<number>(10);
  const [newUboBvn, setNewUboBvn] = useState('');
  const [newUboNin, setNewUboNin] = useState('');
  const [newUboIdType, setNewUboIdType] = useState<'Passport' | 'National Identity Slip' | "Driver's License" | 'Voter Card'>('Passport');
  const [newUboIdNum, setNewUboIdNum] = useState('');

  // Format Nigerian Naira
  const formatNgn = (val: number) => {
    if (val === -1) return 'Unlimited';
    return '₦' + val.toLocaleString('en-NG');
  };

  // Toggle verification status for a pillar
  const handleTogglePillar = (pillar: 'cac' | 'board' | 'tax' | 'ubo') => {
    const updated = { ...dossier };
    if (pillar === 'cac') updated.cacCertificateVerified = !updated.cacCertificateVerified;
    if (pillar === 'board') updated.boardResolutionVerified = !updated.boardResolutionVerified;
    if (pillar === 'tax') updated.taxIdVerified = !updated.taxIdVerified;
    if (pillar === 'ubo') updated.beneficialOwnerIdVerified = !updated.beneficialOwnerIdVerified;

    setDossier(updated);
    notifyUpdate(updated, limits);
  };

  // Toggle individual UBO verification
  const handleToggleUbo = (uboId: string) => {
    const updatedUbos = dossier.beneficialOwners.map((u) => {
      if (u.id === uboId) {
        const nextStatus = u.verificationStatus === 'Verified' ? 'Pending' : 'Verified';
        return { ...u, verificationStatus: nextStatus as 'Verified' | 'Pending' };
      }
      return u;
    });

    const allVerified = updatedUbos.every((u) => u.verificationStatus === 'Verified');
    const updated = {
      ...dossier,
      beneficialOwners: updatedUbos,
      beneficialOwnerIdVerified: allVerified,
    };
    setDossier(updated);
    notifyUpdate(updated, limits);
  };

  // Add new UBO
  const handleAddUbo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUboName.trim()) return;

    const newUbo: BeneficialOwnerVerification = {
      id: `ubo-${Date.now()}`,
      fullName: newUboName,
      role: newUboRole,
      shareholdingPercentage: Number(newUboShare) || 5,
      bvn: newUboBvn || '22300000000',
      nin: newUboNin || '10000000000',
      idType: newUboIdType,
      idNumber: newUboIdNum || 'ID-NEW-01',
      pepStatus: 'Clear',
      verificationStatus: 'Verified',
      verifiedAt: new Date().toISOString().split('T')[0],
      isSignatory: newUboRole.includes('Signatory') || newUboRole.includes('Managing Director'),
      biometricMatchScore: 99.2,
    };

    const updated = {
      ...dossier,
      beneficialOwners: [...dossier.beneficialOwners, newUbo],
    };
    setDossier(updated);
    notifyUpdate(updated, limits);
    setIsAddUboOpen(false);
    setNewUboName('');
  };

  // Notify parent of updates
  const notifyUpdate = (updatedDossier: BusinessCorporateDossier, updatedLimits: CorporateTailoredLimits) => {
    if (onUpdateApplicant) {
      const updatedApplicant: KycApplicant = {
        ...applicant,
        tierRequested: 'Business/Corporate',
        accountCategory: 'Company / Business',
        businessCorporateDossier: {
          ...updatedDossier,
          tailoredLimits: updatedLimits,
        },
        tailoredLimits: updatedLimits,
        consumption: applicant.consumption ? {
          ...applicant.consumption,
          dailyTransferLimitNgn: updatedLimits.dailyTransferLimitNgn,
          cumulativeDepositLimitNgn: updatedLimits.maxDepositLimitNgn,
        } : undefined,
      };
      onUpdateApplicant(updatedApplicant);
    }
  };

  // Save tailored limits
  const handleSaveLimits = () => {
    const updatedDossier = {
      ...dossier,
      tailoredLimits: limits,
    };
    setDossier(updatedDossier);
    notifyUpdate(updatedDossier, limits);

    setIsSavedMessage('Tailored Business/Corporate limits saved and applied to statutory velocity throttles!');
    setTimeout(() => setIsSavedMessage(null), 4000);

    if (onApproveCorporateTier) {
      onApproveCorporateTier(limits);
    }
  };

  const allPillarsVerified =
    dossier.cacCertificateVerified &&
    dossier.boardResolutionVerified &&
    dossier.taxIdVerified &&
    dossier.beneficialOwnerIdVerified;

  return (
    <div className="space-y-6">
      {/* CORPORATE TIER HEADER & QUICK STATS */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Business / Corporate KYC Tier
                </span>
                <span className="text-[11px] text-slate-400">
                  CAMA 2020 & CBN AML/CFT/CPF 2022 Mandate
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  FATF R.24/25 UBO Compliant
                </span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>{dossier.companyName}</span>
                <span className="text-xs font-mono font-normal text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  {dossier.rcNumber}
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Corporate Tier requires statutory verification of four mandatory governance pillars:
                <strong className="text-indigo-200"> CAC Certificate</strong>, 
                <strong className="text-indigo-200"> Board Resolution</strong>, 
                <strong className="text-indigo-200"> Tax ID (TIN)</strong>, and 
                <strong className="text-indigo-200"> Beneficial Owner (UBO ≥ 5%) ID</strong> with custom tailored underwriting limits.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-end gap-2 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Tailored Daily Transfer</span>
              <span className="text-lg font-mono font-bold text-emerald-400">
                {formatNgn(limits.dailyTransferLimitNgn)}
              </span>
              <span className="text-[10px] text-indigo-300 block font-mono">
                Rail: {limits.settlementRail}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Status Summary Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800/80">
          {/* Pillar 1 */}
          <div 
            onClick={() => handleTogglePillar('cac')}
            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
              dossier.cacCertificateVerified 
                ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-medium mb-0.5">
              <span>1. CAC Certificate</span>
              {dossier.cacCertificateVerified ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-500" />}
            </div>
            <div className="text-[10px] font-mono text-slate-400">{dossier.rcNumber}</div>
          </div>

          {/* Pillar 2 */}
          <div 
            onClick={() => handleTogglePillar('board')}
            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
              dossier.boardResolutionVerified 
                ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-medium mb-0.5">
              <span>2. Board Resolution</span>
              {dossier.boardResolutionVerified ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-500" />}
            </div>
            <div className="text-[10px] font-mono text-slate-400">{dossier.boardResolutionRef}</div>
          </div>

          {/* Pillar 3 */}
          <div 
            onClick={() => handleTogglePillar('tax')}
            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
              dossier.taxIdVerified 
                ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-medium mb-0.5">
              <span>3. Tax ID (TIN)</span>
              {dossier.taxIdVerified ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-500" />}
            </div>
            <div className="text-[10px] font-mono text-slate-400">{dossier.taxIdNumber}</div>
          </div>

          {/* Pillar 4 */}
          <div 
            onClick={() => handleTogglePillar('ubo')}
            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
              dossier.beneficialOwnerIdVerified 
                ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-medium mb-0.5">
              <span>4. Beneficial Owners</span>
              {dossier.beneficialOwnerIdVerified ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-slate-500" />}
            </div>
            <div className="text-[10px] font-mono text-slate-400">{dossier.beneficialOwners.length} UBOs Checked</div>
          </div>
        </div>
      </div>

      {/* SUB-TABS: PILLARS VS UBOS VS TAILORED LIMITS */}
      <div className="flex border-b border-slate-800 bg-slate-950/80 px-2 text-xs font-medium gap-2">
        <button
          onClick={() => setActiveTab('pillars')}
          className={`py-2.5 px-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'pillars'
              ? 'border-indigo-400 text-indigo-300 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Statutory Governance Pillars (CAC, Board, Tax ID)</span>
        </button>

        <button
          onClick={() => setActiveTab('ubos')}
          className={`py-2.5 px-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'ubos'
              ? 'border-indigo-400 text-indigo-300 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Beneficial Owner ID Verification ({dossier.beneficialOwners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tailored_limits')}
          className={`py-2.5 px-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'tailored_limits'
              ? 'border-indigo-400 text-indigo-300 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Tailored Limits Engine</span>
        </button>
      </div>

      {isSavedMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{isSavedMessage}</span>
        </div>
      )}

      {/* TAB 1: GOVERNANCE PILLARS (CAC, BOARD RESOLUTION, TAX ID) */}
      {activeTab === 'pillars' && (
        <div className="space-y-4">
          {/* PILLAR 1: CAC CERTIFICATE */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg border ${
                  dossier.cacCertificateVerified
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <span>Corporate Affairs Commission (CAC) Registration</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      dossier.cacCertificateVerified 
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}>
                      {dossier.cacCertificateVerified ? 'Verified Active on CAC Registry' : 'Pending Verification'}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Statutory requirement: Valid Certificate of Incorporation (RC) or Business Registration (BN) + certified CAC Status Report / MEMART.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleTogglePillar('cac')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                  dossier.cacCertificateVerified
                    ? 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {dossier.cacCertificateVerified ? 'Revoke CAC Check' : 'Mark CAC Verified'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-400 block">RC / Registration Number</span>
                <span className="font-mono font-bold text-slate-200">{dossier.rcNumber}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-400 block">Entity Classification</span>
                <span className="text-slate-200 font-medium">{dossier.businessType}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-400 block">Incorporation Date</span>
                <span className="text-slate-200 font-medium">{dossier.incorporationDate}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-850 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                CAC Certified True Copy (CTC) Status Report & Objectives Verified
              </span>
              {dossier.cacCertificateDocUrl && (
                <a
                  href={dossier.cacCertificateDocUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>View CAC Certificate</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* PILLAR 2: BOARD RESOLUTION & SIGNATORY MANDATE */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg border ${
                  dossier.boardResolutionVerified
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <span>Board Resolution & Operational Signatory Mandate</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      dossier.boardResolutionVerified 
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}>
                      {dossier.boardResolutionVerified ? 'Resolution Verified' : 'Resolution Pending'}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Statutory requirement: Official Corporate Board Resolution signed by Chairman & Company Secretary designating account operational mandate.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleTogglePillar('board')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                  dossier.boardResolutionVerified
                    ? 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {dossier.boardResolutionVerified ? 'Revoke Resolution' : 'Mark Resolution Verified'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-400 block">Board Resolution Ref</span>
                <span className="font-mono font-bold text-slate-200">{dossier.boardResolutionRef}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-400 block">Resolution Date</span>
                <span className="text-slate-200 font-medium">{dossier.boardResolutionDate}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-400 block">Signatory Mandate</span>
                <span className="text-emerald-300 font-semibold font-mono">{dossier.signatoryMandateType}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-850 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Specimen signatures verified for Category A & B Authorized Officers
              </span>
              {dossier.boardResolutionDocUrl && (
                <a
                  href={dossier.boardResolutionDocUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>View Signed Resolution PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* PILLAR 3: TAX IDENTIFICATION NUMBER (TIN) */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg border ${
                  dossier.taxIdVerified
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <span>Tax Identification Number (Tax ID / TIN)</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      dossier.taxIdVerified 
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}>
                      {dossier.taxIdVerified ? 'FIRS Database Validated' : 'TIN Pending Validation'}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Statutory requirement: Verified Federal Inland Revenue Service (FIRS) / Joint Tax Board (JTB) Tax ID & active VAT registration.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleTogglePillar('tax')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                  dossier.taxIdVerified
                    ? 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {dossier.taxIdVerified ? 'Revoke Tax ID' : 'Mark Tax ID Verified'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-400 block">FIRS Tax ID (TIN)</span>
                <span className="font-mono font-bold text-slate-200">{dossier.taxIdNumber}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-400 block">VAT Registration No.</span>
                <span className="font-mono font-medium text-slate-200">{dossier.vatRegistrationNumber}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-400 block">Tax Clearance Status</span>
                <span className="text-emerald-400 font-semibold font-mono">Compliant & Active</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-850 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Live JTB & FIRS Tax Clearance Certificate (TCC) digital verification passed
              </span>
              {dossier.taxIdDocUrl && (
                <a
                  href={dossier.taxIdDocUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Verify on FIRS Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BENEFICIAL OWNER ID VERIFICATION (UBO ≥ 5%) */}
      {activeTab === 'ubos' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <span>Ultimate Beneficial Owners (UBO) & Directors Registry</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                CBN AML/CFT 2022 Part IV & FATF R.24 requires full identification and verification for any natural person holding ≥ 5% shares or operational control.
              </p>
            </div>

            <button
              onClick={() => setIsAddUboOpen(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Beneficial Owner</span>
            </button>
          </div>

          {/* Add UBO Modal Form inline */}
          {isAddUboOpen && (
            <form onSubmit={handleAddUbo} className="p-4 rounded-xl bg-slate-900 border border-indigo-500/40 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Add New Director or Beneficial Owner</span>
                <button 
                  type="button" 
                  onClick={() => setIsAddUboOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={newUboName}
                    onChange={(e) => setNewUboName(e.target.value)}
                    placeholder="e.g. Dr. Ngozi Okonjo-Iweala"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Role / Designation</label>
                  <select
                    value={newUboRole}
                    onChange={(e) => setNewUboRole(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Managing Director / CEO">Managing Director / CEO</option>
                    <option value="Director">Director</option>
                    <option value="Shareholder / UBO">Shareholder / UBO</option>
                    <option value="Authorized Signatory">Authorized Signatory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Shareholding %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newUboShare}
                    onChange={(e) => setNewUboShare(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">BVN (11 Digits)</label>
                  <input
                    type="text"
                    value={newUboBvn}
                    onChange={(e) => setNewUboBvn(e.target.value)}
                    placeholder="22XXXXXXXXX"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">NIN (11 Digits)</label>
                  <input
                    type="text"
                    value={newUboNin}
                    onChange={(e) => setNewUboNin(e.target.value)}
                    placeholder="10XXXXXXXXX"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">ID Document Type</label>
                  <select
                    value={newUboIdType}
                    onChange={(e) => setNewUboIdType(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Passport">International Passport</option>
                    <option value="National Identity Slip">National Identity Slip</option>
                    <option value="Driver's License">Driver's License</option>
                    <option value="Voter Card">Voter Card</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUboOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
                >
                  Save & Validate UBO
                </button>
              </div>
            </form>
          )}

          {/* List of Beneficial Owners */}
          <div className="space-y-3">
            {dossier.beneficialOwners.map((ubo) => {
              const isVerified = ubo.verificationStatus === 'Verified';
              return (
                <div
                  key={ubo.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isVerified
                      ? 'bg-slate-900/90 border-slate-800'
                      : 'bg-amber-950/20 border-amber-500/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg border shrink-0 ${
                        isVerified
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        <UserCheck className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-100 text-sm">{ubo.fullName}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                            {ubo.role}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                            {ubo.shareholdingPercentage}% Equity
                          </span>
                          {ubo.isSignatory && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                              Signatory Mandate
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1 font-mono">
                          <span>BVN: <strong className="text-slate-300">{ubo.bvn}</strong></span>
                          <span>NIN: <strong className="text-slate-300">{ubo.nin}</strong></span>
                          <span>{ubo.idType}: <strong className="text-slate-300">{ubo.idNumber}</strong></span>
                          {ubo.biometricMatchScore && (
                            <span className="text-emerald-400 font-semibold">Biometric: {ubo.biometricMatchScore}%</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-center">
                      <span className={`px-2 py-1 rounded text-xs font-mono font-semibold ${
                        isVerified
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}>
                        {isVerified ? '✓ Identity Verified' : 'Pending Verification'}
                      </span>

                      <button
                        onClick={() => handleToggleUbo(ubo.id)}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          isVerified
                            ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                            : 'bg-emerald-600 text-white border-emerald-500'
                        }`}
                        title={isVerified ? 'Mark as Pending' : 'Mark as Verified'}
                      >
                        {isVerified ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: TAILORED LIMITS ENGINE */}
      {activeTab === 'tailored_limits' && (
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Corporate Tailored Limits Underwriting</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure bespoke statutory limits, velocity throttles, and clearing rails for this corporate account based on audited turnover and risk score.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              CAMA / Treasury Grade
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Daily Outward Transfer Limit */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <label className="block text-xs font-bold text-slate-200">
                Daily Outward Transfer Limit (NGN)
              </label>
              
              <div className="flex flex-wrap gap-2">
                {[50000000, 100000000, 250000000, 500000000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setLimits({ ...limits, dailyTransferLimitNgn: preset })}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all ${
                      limits.dailyTransferLimitNgn === preset
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-700'
                    }`}
                  >
                    ₦{(preset / 1000000).toLocaleString()}M
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-mono text-slate-400">₦</span>
                <input
                  type="number"
                  value={limits.dailyTransferLimitNgn}
                  onChange={(e) => setLimits({ ...limits, dailyTransferLimitNgn: Number(e.target.value) })}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-750 rounded-lg text-slate-200 font-mono text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <p className="text-[10px] text-slate-400">Standard statutory default: ₦50,000,000 / day.</p>
            </div>

            {/* Single Transaction Limit */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <label className="block text-xs font-bold text-slate-200">
                Single Transaction Limit (NGN)
              </label>
              
              <div className="flex flex-wrap gap-2">
                {[10000000, 25000000, 50000000, 100000000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setLimits({ ...limits, singleTransactionLimitNgn: preset })}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all ${
                      limits.singleTransactionLimitNgn === preset
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-700'
                    }`}
                  >
                    ₦{(preset / 1000000).toLocaleString()}M
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-mono text-slate-400">₦</span>
                <input
                  type="number"
                  value={limits.singleTransactionLimitNgn}
                  onChange={(e) => setLimits({ ...limits, singleTransactionLimitNgn: Number(e.target.value) })}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-750 rounded-lg text-slate-200 font-mono text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <p className="text-[10px] text-slate-400">Per-transaction debit cap on automated instant rails.</p>
            </div>

            {/* Settlement Rail Routing */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <label className="block text-xs font-bold text-slate-200">
                Authorized Corporate Settlement Rail
              </label>
              <select
                value={limits.settlementRail}
                onChange={(e) => setLimits({ ...limits, settlementRail: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-750 rounded-lg text-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="NIBSS Corporate NIP">NIBSS Corporate NIP (Instant 24/7 Settlement)</option>
                <option value="RTGS Central Bank">RTGS Central Bank (High-Value Gross Settlement)</option>
                <option value="Commercial Treasury Desk">Commercial Treasury Desk (Bespoke Clearing & FX)</option>
              </select>
              <p className="text-[10px] text-slate-400">Designates statutory clearing channel for high-volume batches.</p>
            </div>

            {/* Deposit & Wallet Balance Ceiling */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <label className="block text-xs font-bold text-slate-200">
                Deposit & Balance Capacity
              </label>
              <div className="p-2 bg-slate-900 border border-slate-750 rounded-lg flex items-center justify-between text-xs">
                <span className="text-slate-300">Statutory Cumulative Balance</span>
                <span className="font-mono font-bold text-cyan-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  UNLIMITED (Tier 4 / Corporate)
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Business/Corporate accounts carry statutory unlimited deposit headroom.</p>
            </div>
          </div>

          {/* Underwriting Notes & Approver */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Underwriter / Approving Officer</label>
                <input
                  type="text"
                  value={limits.customApprovedBy || ''}
                  onChange={(e) => setLimits({ ...limits, customApprovedBy: e.target.value })}
                  placeholder="e.g. Senior AML Compliance Manager"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Compliance Justification Note</label>
                <input
                  type="text"
                  value={limits.notes || ''}
                  onChange={(e) => setLimits({ ...limits, notes: e.target.value })}
                  placeholder="e.g. Cleared under CAMA 2020 with verified audited financial statements."
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Save Tailored Limits Button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Updating limits adjusts velocity throttles and transaction rail routing in real time.
            </span>
            <button
              onClick={handleSaveLimits}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save & Apply Tailored Limits</span>
            </button>
          </div>
        </div>
      )}

      {/* OVERALL CORPORATE VERDICT FOOTER */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        allPillarsVerified ? 'bg-indigo-950/20 border-indigo-500/40' : 'bg-slate-950 border-slate-800'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl border ${
            allPillarsVerified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Corporate Tier Statutory Readiness</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                allPillarsVerified 
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              }`}>
                {allPillarsVerified ? 'All 4 Pillars Validated' : 'Action Required on Governance Pillars'}
              </span>
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {allPillarsVerified
                ? `CAC Certificate, Board Resolution, Tax ID, and Beneficial Owner checks are 100% complete. Corporate limits (${formatNgn(limits.dailyTransferLimitNgn)} daily) ready for deployment.`
                : 'Please verify CAC Certificate, Board Resolution, Tax ID (TIN), and Beneficial Owner IDs before concluding corporate underwriting.'}
            </p>
          </div>
        </div>

        {onApproveCorporateTier && (
          <button
            onClick={() => onApproveCorporateTier(limits)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-md self-start sm:self-auto"
          >
            <Unlock className="w-4 h-4" />
            <span>Approve Business/Corporate Tier</span>
          </button>
        )}
      </div>
    </div>
  );
};
