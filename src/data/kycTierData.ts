// Central Bank of Nigeria (CBN) Three-Tiered KYC & Corporate Account Framework
// Circular FPR/DIR/GEN/CIR/01/001 & Money Laundering (Prevention and Prohibition) Act 2022

export interface KycTierConfig {
  id: 'tier_1' | 'tier_2' | 'tier_3' | 'corporate_kyb' | 'business_corporate';
  code: string;
  name: string;
  shortName: string;
  category: 'Individual / Personal' | 'Company / Business';
  description: string;
  dailyTransferLimit: number;
  dailyTransferLimitLabel: string;
  maxDepositLimit: number; // Maximum amount deposited / cumulative balance limit
  maxDepositLimitLabel: string;
  singleTransferLimit: number;
  singleTransferLimitLabel: string;
  badgeColor: string;
  borderColor: string;
  bgColor: string;
  tailoredLimitsSupported?: boolean;
  requirements: {
    title: string;
    description: string;
    isMandatory: boolean;
    ruleType: 'all_of' | 'one_of';
    options: string[];
  }[];
  standardChecklist: string[];
  cbnRegulatoryReference: string;
}

export const KYC_TIERS_CONFIG: Record<string, KycTierConfig> = {
  tier_1: {
    id: 'tier_1',
    code: 'Tier 1',
    name: 'Tier 1 (Basic Personal Account)',
    shortName: 'Tier 1',
    category: 'Individual / Personal',
    description: 'Low-value digital wallet onboarding with flexible entry-level identification.',
    dailyTransferLimit: 50000,
    dailyTransferLimitLabel: '₦50,000 / day',
    maxDepositLimit: 500000,
    maxDepositLimitLabel: '₦500,000 max cumulative balance / deposit',
    singleTransferLimit: 50000,
    singleTransferLimitLabel: '₦50,000 / txn',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    borderColor: 'border-amber-500/40',
    bgColor: 'bg-amber-500/5',
    requirements: [
      {
        title: 'National Identity Identifier',
        description: 'Requires either Bank Verification Number (BVN) OR National Identity Number (NIN).',
        isMandatory: true,
        ruleType: 'one_of',
        options: ['Bank Verification Number (BVN)', 'National Identification Number (NIN)'],
      },
      {
        title: 'Contact / Biometric Verification',
        description: 'Requires at least one valid channel: Liveness Selfie OR Phone Verification (OTP) OR Email Verification.',
        isMandatory: true,
        ruleType: 'one_of',
        options: [
          '3D Facial Liveness Biometric Check',
          'Phone Number SMS OTP Verification',
          'Email Address Confirmation / OTP',
        ],
      },
    ],
    standardChecklist: [
      'BVN OR NIN (at least one valid statutory identifier)',
      'Liveness OR Phone Number Verification OR Email Verification',
      'Daily Transfer Limit: ₦50,000',
      'Maximum Amount Deposited / Cumulative Balance: ₦500,000',
      'No physical utility bill or in-person address verification required',
    ],
    cbnRegulatoryReference:
      'CBN 3-Tier KYC Framework Section 1.1: Basic Low-Value Account. Daily Debit: ₦50K, Max Balance: ₦500K.',
  },

  tier_2: {
    id: 'tier_2',
    code: 'Tier 2',
    name: 'Tier 2 (Verified Personal Account)',
    shortName: 'Tier 2',
    category: 'Individual / Personal',
    description: 'Medium-value personal account with statutory proof of address and official photo ID.',
    dailyTransferLimit: 500000,
    dailyTransferLimitLabel: '₦500,000 / day',
    maxDepositLimit: 5000000,
    maxDepositLimitLabel: '₦5,000,000 max cumulative balance / deposit',
    singleTransferLimit: 200000,
    singleTransferLimitLabel: '₦200,000 - ₦500,000 / txn',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    borderColor: 'border-cyan-500/40',
    bgColor: 'bg-cyan-500/5',
    requirements: [
      {
        title: 'National Identity Identifier',
        description: 'BVN OR NIN validated against NIBSS / NIMC central database.',
        isMandatory: true,
        ruleType: 'one_of',
        options: ['Bank Verification Number (BVN)', 'National Identification Number (NIN)'],
      },
      {
        title: 'Contact / Biometric Verification',
        description: 'Liveness Selfie OR Phone Number Verification OR Email Verification.',
        isMandatory: true,
        ruleType: 'one_of',
        options: [
          '3D Facial Liveness Biometric Check',
          'Phone Number SMS OTP Verification',
          'Email Address Confirmation / OTP',
        ],
      },
      {
        title: 'Utility / Financial Statement Proof',
        description: 'Any ONE valid statutory utility or bank statement (< 90 days old).',
        isMandatory: true,
        ruleType: 'one_of',
        options: [
          'Electric Bill (DisCo Prepaid / Postpaid Receipt)',
          'Waste Bill (LAWMA / PSP / State Waste Authority Receipt)',
          'Bank Statement (Official 3-Month Bank PDF)',
          'Water Bill (State Water Board / Corporation)',
        ],
      },
      {
        title: 'Means of Identification',
        description: 'Valid government-issued photo identity credential.',
        isMandatory: true,
        ruleType: 'one_of',
        options: [
          'National Identity Card / NIMC Digital Slip',
          'International e-Passport',
          "Federal Road Safety Corps (FRSC) Driver's License",
          "Independent National Electoral Commission (INEC) Permanent Voter's Card",
        ],
      },
    ],
    standardChecklist: [
      'BVN OR NIN',
      'Liveness OR Phone Number Verification OR Email Verification',
      'Utility: Electric Bill, Waste Bill, Bank Statement, OR Water Bill',
      'Means of Identification (Govt-issued ID)',
      'Daily Transfer Limit: ₦500,000',
      'Maximum Amount Deposited / Cumulative Balance: ₦5,000,000',
    ],
    cbnRegulatoryReference:
      'CBN 3-Tier KYC Framework Section 1.2: Medium-Value Account. Daily Debit: ₦500K, Max Balance: ₦5M.',
  },

  tier_3: {
    id: 'tier_3',
    code: 'Tier 3',
    name: 'Tier 3 (Premium Personal Account)',
    shortName: 'Tier 3',
    category: 'Individual / Personal',
    description: 'High-value full personal account with physical in-person address verification and unlimited deposits.',
    dailyTransferLimit: 5000000,
    dailyTransferLimitLabel: '₦5,000,000 / day',
    maxDepositLimit: Infinity,
    maxDepositLimitLabel: 'Unlimited Maximum Deposit',
    singleTransferLimit: 5000000,
    singleTransferLimitLabel: '₦1,000,000 - ₦5,000,000 / txn',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-500/5',
    requirements: [
      {
        title: 'National Identity Identifier',
        description: 'BVN OR NIN validated against NIBSS / NIMC central database.',
        isMandatory: true,
        ruleType: 'one_of',
        options: ['Bank Verification Number (BVN)', 'National Identification Number (NIN)'],
      },
      {
        title: 'Contact / Biometric Verification',
        description: 'Liveness Selfie OR Phone Number Verification OR Email Verification.',
        isMandatory: true,
        ruleType: 'one_of',
        options: [
          '3D Facial Liveness Biometric Check',
          'Phone Number SMS OTP Verification',
          'Email Address Confirmation / OTP',
        ],
      },
      {
        title: 'Utility / Financial Statement Proof',
        description: 'Electric Bill, Waste Bill, Bank Statement, OR Water Bill.',
        isMandatory: true,
        ruleType: 'one_of',
        options: [
          'Electric Bill (DisCo Prepaid / Postpaid Receipt)',
          'Waste Bill (LAWMA / PSP / State Waste Authority Receipt)',
          'Bank Statement (Official Bank PDF)',
          'Water Bill (State Water Board / Corporation)',
        ],
      },
      {
        title: 'Means of Identification',
        description: 'Valid government-issued photo identity credential.',
        isMandatory: true,
        ruleType: 'one_of',
        options: [
          'National Identity Card / NIMC Digital Slip',
          'International e-Passport',
          "Federal Road Safety Corps (FRSC) Driver's License",
          "Permanent Voter's Card (PVC)",
        ],
      },
      {
        title: 'Physical In-Person Address Verification',
        description: 'Mandatory field agent physical inspection, geotagged GPS confirmation, and residence report.',
        isMandatory: true,
        ruleType: 'all_of',
        options: [
          'Field Agent Physical Site Visit & Geotagged GPS Confirmation',
          'Neighbor / Landlord Statutory Verification Report',
        ],
      },
    ],
    standardChecklist: [
      'BVN OR NIN',
      'Liveness OR Phone Number Verification OR Email Verification',
      'Utility: Electric Bill, Waste Bill, Bank Statement, OR Water Bill',
      'Means of Identification (Govt-issued ID)',
      'AND Address Verification (Physical In-Person Field Agent Inspection)',
      'Daily Transfer Limit: ₦5,000,000',
      'Maximum Amount Deposited: Unlimited',
    ],
    cbnRegulatoryReference:
      'CBN 3-Tier KYC Framework Section 1.3: High-Value Account. Daily Debit: ₦5M, Max Cumulative Balance: Unlimited.',
  },

  corporate_kyb: {
    id: 'corporate_kyb',
    code: 'Company / Business (Corporate KYB)',
    name: 'Company / Business Account (Corporate KYB)',
    shortName: 'Company / Business',
    category: 'Company / Business',
    description: 'Corporate and merchant accounts governed by CAMA 2020, CBN AML/CFT/CPF 2022, and FATF guidelines.',
    dailyTransferLimit: 50000000,
    dailyTransferLimitLabel: '₦50,000,000 / day (Configurable up to Enterprise Rail)',
    maxDepositLimit: Infinity,
    maxDepositLimitLabel: 'Unlimited Maximum Deposit',
    singleTransferLimit: 25000000,
    singleTransferLimitLabel: '₦10,000,000 - ₦25,000,000 / txn',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    borderColor: 'border-indigo-500/40',
    bgColor: 'bg-indigo-500/5',
    requirements: [
      {
        title: 'CAC Corporate Registration & Status',
        description: 'Certificate of Incorporation (RC Number) or Business Name Registration (BN Number) + CAC Status Report.',
        isMandatory: true,
        ruleType: 'all_of',
        options: [
          'CAC Certificate of Incorporation / Business Name (RC/BN Number)',
          'Certified Status Report / MEMART / Form CAC 1.1 / CAC 2 & CAC 7',
        ],
      },
      {
        title: 'Tax Identification & Regulatory Clearances',
        description: 'Company Tax Identification Number (TIN) & FIRS Tax Clearance / VAT Certificate.',
        isMandatory: true,
        ruleType: 'all_of',
        options: [
          'Federal Inland Revenue Service (FIRS) / JTB Tax Identification Number (TIN)',
          'SCUML (Special Control Unit Against Money Laundering) Certificate (where applicable for DNFBPs)',
        ],
      },
      {
        title: 'Directors & Ultimate Beneficial Owners (UBO) Verification',
        description: 'Complete KYC on all Directors and UBOs holding ≥ 5% equity or voting control.',
        isMandatory: true,
        ruleType: 'all_of',
        options: [
          'BVN and NIN validation for all Directors & Signatories',
          'Valid Government Photo ID for all Directors & UBOs',
          'Proof of Residential Address for all Directors (< 90 days)',
        ],
      },
      {
        title: 'Corporate Governance & Signatory Mandate',
        description: 'Official Board Resolution approving account opening and designating authorized signatories.',
        isMandatory: true,
        ruleType: 'all_of',
        options: [
          'Board Resolution / Mandate signed by Chairman & Secretary',
          'Specimen Signatures & Operational Category Designation',
        ],
      },
      {
        title: 'Business Premises Address Verification',
        description: 'Physical inspection of corporate premises / registered office with commercial utility bill.',
        isMandatory: true,
        ruleType: 'all_of',
        options: [
          'Physical Site Inspection Report of Business Premises (Geotagged)',
          'Commercial Premises Utility Bill (Electric / Waste / Water / Tenancy)',
        ],
      },
      {
        title: 'Bank Reference & Financial Track Record',
        description: 'Corporate bank references or statement of operational account.',
        isMandatory: true,
        ruleType: 'all_of',
        options: [
          'Two (2) Independent Commercial Bank Reference Letters',
          '6-Month Operating Corporate Bank Statement',
        ],
      },
    ],
    standardChecklist: [
      'CAC Certificate of Incorporation / Business Name Registration (RC / BN)',
      'Status Report / Form CAC 1.1 / MEMART',
      'Tax Identification Number (TIN) & Tax Clearance / VAT',
      'Directors & UBO (≥5%) BVN, NIN, Valid ID & Proof of Address',
      'Board Resolution authorizing account & designated Signatories Mandate',
      'Physical Business Premises Verification & Commercial Utility Bill',
      'SCUML Certificate (Mandatory for DNFBPs - Real Estate, Legal, Advisory, etc.)',
      'Two (2) Bank Reference Letters / 6-Month Corporate Statement',
      'Daily Transfer Limit: ₦50,000,000 (Extendable for Corporate Treasury)',
      'Maximum Amount Deposited: Unlimited',
    ],
    cbnRegulatoryReference:
      'CBN AML/CFT/CPF Regulations 2022 (Part IV - Customer Due Diligence on Legal Persons) & CAMA 2020.',
  },

  business_corporate: {
    id: 'business_corporate',
    code: 'Business/Corporate',
    name: 'Business / Corporate Account Tier',
    shortName: 'Business/Corporate',
    category: 'Company / Business',
    description: 'Corporate and commercial entity accounts for registered companies (LTD, PLC, LLPs) requiring CAC, Board Resolution, Tax ID, and Beneficial Owner verification with tailored statutory limits.',
    dailyTransferLimit: 50000000,
    dailyTransferLimitLabel: '₦50,000,000 / day (Tailored up to ₦500,000,000)',
    maxDepositLimit: Infinity,
    maxDepositLimitLabel: 'Unlimited Maximum Cumulative Deposit',
    singleTransferLimit: 25000000,
    singleTransferLimitLabel: '₦25,000,000 / single txn (Corporate NIP / RTGS)',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    borderColor: 'border-indigo-500/40',
    bgColor: 'bg-indigo-500/5',
    tailoredLimitsSupported: true,
    requirements: [
      {
        title: 'CAC Corporate Registration Certificate',
        description: 'CAC Certificate of Incorporation (RC Number for Limited Companies) or Business Name Registration (BN Number) plus Certified Status Report / Form CAC 1.1 / MEMART.',
        isMandatory: true,
        ruleType: 'all_of',
        options: [
          'CAC Certificate of Incorporation (RC/BN Certificate)',
          'Certified Status Report / MEMART / Form CAC 1.1',
        ],
      },
      {
        title: 'Board Resolution & Signatory Mandate',
        description: 'Certified Board Resolution signed by the Company Chairman & Secretary authorizing the account opening, operational mandates, and authorized signatories.',
        isMandatory: true,
        ruleType: 'all_of',
        options: [
          'Board Resolution approving corporate account opening and operation',
          'Designation of Authorized Signatories (Category A & B specimen signatures)',
        ],
      },
      {
        title: 'Tax Identification Number (Tax ID / TIN)',
        description: 'Official corporate Tax ID validated via Federal Inland Revenue Service (FIRS) / Joint Tax Board (JTB) and active VAT registration.',
        isMandatory: true,
        ruleType: 'all_of',
        options: [
          'FIRS / JTB Company Tax Identification Number (TIN)',
          'FIRS VAT Registration Certificate or Tax Clearance Certificate (TCC)',
        ],
      },
      {
        title: 'Beneficial Owner ID Verification (UBO ≥ 5%)',
        description: 'Statutory verification (BVN, NIN, and Government-issued photo ID) for all Directors, key controllers, and Ultimate Beneficial Owners holding 5% or more shares.',
        isMandatory: true,
        ruleType: 'all_of',
        options: [
          'Valid Government Photo ID (Passport / National ID / DL) for all UBOs',
          'Biometric BVN & NIN verification across NIBSS / NIMC registries',
          'Automated Sanctions, PEP, and Adverse Media screening on all Beneficial Owners',
        ],
      },
      {
        title: 'Physical Premises & Commercial Utility Billing',
        description: 'Physical inspection report of operating business premises and commercial address proof.',
        isMandatory: true,
        ruleType: 'all_of',
        options: [
          'Geotagged site inspection report of registered physical office',
          'Commercial utility bill (< 90 days) or valid commercial tenancy lease',
        ],
      },
    ],
    standardChecklist: [
      'CAC Certificate of Incorporation / Registration (RC / BN Number)',
      'Board Resolution authorizing account & designated Signatories Mandate',
      'Tax Identification Number (Tax ID / TIN) verified against FIRS',
      'Beneficial Owner ID Verification (BVN, NIN, Photo ID for all UBOs ≥ 5%)',
      'Tailored Limits Engine (₦50M base, configurable up to ₦500M with RTGS rail)',
      'Physical Office Inspection & Commercial Utility Bill',
      'SCUML Certificate (for DNFBPs) or Exemption Declaration',
    ],
    cbnRegulatoryReference:
      'CBN AML/CFT/CPF Regulations 2022 Part IV (Due Diligence on Legal Persons) & CAMA 2020.',
  },
};

export const getKycTierConfig = (tierName: string): KycTierConfig => {
  const normalized = tierName.toLowerCase();
  if (normalized.includes('business/corporate') || normalized === 'business/corporate' || normalized.includes('business / corporate')) {
    return KYC_TIERS_CONFIG.business_corporate;
  }
  if (normalized.includes('corporate') || normalized.includes('company') || normalized.includes('business') || normalized.includes('enterprise') || normalized.includes('kyb')) {
    if (normalized.includes('tier 2') && !normalized.includes('tier 3')) {
      return KYC_TIERS_CONFIG.tier_2;
    }
    if (normalized.includes('tier 3')) {
      return KYC_TIERS_CONFIG.tier_3;
    }
    return KYC_TIERS_CONFIG.business_corporate || KYC_TIERS_CONFIG.corporate_kyb;
  }
  if (normalized.includes('tier 3') || normalized.includes('tier3')) {
    return KYC_TIERS_CONFIG.tier_3;
  }
  if (normalized.includes('tier 2') || normalized.includes('tier2')) {
    return KYC_TIERS_CONFIG.tier_2;
  }
  return KYC_TIERS_CONFIG.tier_1;
};
