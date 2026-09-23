export interface ManagedAccount {
  id: string;
  accountNumber: string;
  accountName: string;
  phone: string;
  email: string;
  bvn: string;
  nin: string;
  tier: 'Tier 1 (Basic)' | 'Tier 2 (Verified)' | 'Tier 3 (Enterprise)' | 'Corporate KYB';
  accountType: 'Personal Wallet' | 'Merchant POS' | 'Corporate' | 'Super Agent';
  status: 'Active' | 'Frozen (Debit Blocked)' | 'Frozen (Total Freeze)' | 'Blocked (Blacklisted)' | 'Under Investigation';
  nairaBalance: number;
  ifwCoinBalance: number;
  dailyLimitNgn: number;
  location: string;
  joinedDate: string;
  lastActive: string;
  riskScore: number; // 0 to 100
  notes?: string;
}

export interface AccountAuditLog {
  id: string;
  accountId: string;
  accountNumber: string;
  accountName: string;
  actionType: 
    | 'FREEZE_ACCOUNT' 
    | 'UNFREEZE_ACCOUNT' 
    | 'BLOCK_ACCOUNT' 
    | 'UNBLOCK_ACCOUNT' 
    | 'REWARD_CASH_BONUS' 
    | 'REWARD_IFW_COIN' 
    | 'CASHBACK_REBATE' 
    | 'TIER_UPGRADE' 
    | 'RESET_PIN' 
    | 'KILL_SESSIONS' 
    | 'ADJUST_LIMIT' 
    | 'BIOMETRIC_STEP_UP';
  title: string;
  details: string;
  performedBy: string;
  timestamp: string;
  referenceCode: string;
  status: 'Success' | 'Dual-Control Verified';
}

export const INITIAL_MANAGED_ACCOUNTS: ManagedAccount[] = [
  {
    id: 'acc-01',
    accountNumber: '0812948190',
    accountName: 'Ibrahim Danjuma',
    phone: '+234 812 948 1901',
    email: 'i.danjuma@gmail.com',
    bvn: '22194830192',
    nin: '84920194821',
    tier: 'Tier 2 (Verified)',
    accountType: 'Personal Wallet',
    status: 'Active',
    nairaBalance: 485000,
    ifwCoinBalance: 250,
    dailyLimitNgn: 1000000,
    location: 'Kano Municipal, Kano',
    joinedDate: 'Jan 14, 2025',
    lastActive: '6 mins ago',
    riskScore: 14,
    notes: 'Regular salary earner and high-frequency utility biller.',
  },
  {
    id: 'acc-02',
    accountNumber: '0903119283',
    accountName: 'Chiamaka Eze',
    phone: '+234 903 119 2834',
    email: 'chiamaka.eze@technigeria.ng',
    bvn: '22401928471',
    nin: '77401928374',
    tier: 'Tier 3 (Enterprise)',
    accountType: 'Personal Wallet',
    status: 'Active',
    nairaBalance: 2450000,
    ifwCoinBalance: 1200,
    dailyLimitNgn: 10000000,
    location: 'Victoria Island, Lagos',
    joinedDate: 'Nov 02, 2024',
    lastActive: 'Just now',
    riskScore: 8,
    notes: 'High net-worth fintech executive, active international P2P transfer user.',
  },
  {
    id: 'acc-03',
    accountNumber: '0803441892',
    accountName: 'Alhaji Mohammed Bello',
    phone: '+234 803 441 8920',
    email: 'm.bello@katsinacotton.com',
    bvn: '22883344112',
    nin: '99011223344',
    tier: 'Tier 3 (Enterprise)',
    accountType: 'Merchant POS',
    status: 'Frozen (Debit Blocked)',
    nairaBalance: 14850000,
    ifwCoinBalance: 3500,
    dailyLimitNgn: 25000000,
    location: 'Funtua / Katsina City, Katsina',
    joinedDate: 'Aug 19, 2024',
    lastActive: '12 mins ago',
    riskScore: 92,
    notes: 'Frozen under AML smurfing alert. Inflow permitted; debit rails halted pending biometric challenge.',
  },
  {
    id: 'acc-04',
    accountNumber: '0701882990',
    accountName: 'Apex Logistics Global Ltd',
    phone: '+234 701 882 9901',
    email: 'ops@apexlogisticsng.com',
    bvn: '22998811223',
    nin: '66102938471',
    tier: 'Corporate KYB',
    accountType: 'Corporate',
    status: 'Blocked (Blacklisted)',
    nairaBalance: 820000,
    ifwCoinBalance: 0,
    dailyLimitNgn: 0,
    location: 'Ikeja Industrial Estate, Lagos',
    joinedDate: 'Mar 10, 2025',
    lastActive: '2 hours ago',
    riskScore: 96,
    notes: 'Blacklisted due to synthetic invoice fraud. All linked virtual accounts quarantined.',
  },
  {
    id: 'acc-05',
    accountNumber: '0809331902',
    accountName: 'Maryam Usman',
    phone: '+234 809 331 9022',
    email: 'maryam.u@zaria-agro.org',
    bvn: '22119933884',
    nin: '55443322110',
    tier: 'Tier 1 (Basic)',
    accountType: 'Personal Wallet',
    status: 'Active',
    nairaBalance: 42000,
    ifwCoinBalance: 75,
    dailyLimitNgn: 50000,
    location: 'Zaria City, Kaduna',
    joinedDate: 'Feb 28, 2026',
    lastActive: '34 mins ago',
    riskScore: 11,
    notes: 'Grassroots financial inclusion beneficiary with agricultural micro-loans.',
  },
  {
    id: 'acc-06',
    accountNumber: '0802991024',
    accountName: 'Kano Agro-Merchants Hub',
    phone: '+234 802 991 0244',
    email: 'merchants@kanoagro.ng',
    bvn: '22667788990',
    nin: '44556677889',
    tier: 'Corporate KYB',
    accountType: 'Super Agent',
    status: 'Active',
    nairaBalance: 38900000,
    ifwCoinBalance: 15400,
    dailyLimitNgn: 50000000,
    location: 'Kano Dawanau Grain Market, Kano',
    joinedDate: 'Oct 15, 2024',
    lastActive: '1 min ago',
    riskScore: 19,
    notes: 'Top tier cash-in cash-out SANEF master distributor with 142 POS agents.',
  },
  {
    id: 'acc-07',
    accountNumber: '0814990120',
    accountName: 'Babatunde Fashola-Cole',
    phone: '+234 814 990 1205',
    email: 'babatunde.fc@lagoslaw.com',
    bvn: '22334455667',
    nin: '88776655443',
    tier: 'Tier 2 (Verified)',
    accountType: 'Personal Wallet',
    status: 'Active',
    nairaBalance: 1120000,
    ifwCoinBalance: 420,
    dailyLimitNgn: 2000000,
    location: 'Lekki Phase 1, Lagos',
    joinedDate: 'Dec 05, 2025',
    lastActive: '18 mins ago',
    riskScore: 12,
    notes: 'Legal consultant, active user of automated standing order disbursements.',
  },
  {
    id: 'acc-08',
    accountNumber: '0708112233',
    accountName: 'Zainab Haruna',
    phone: '+234 708 112 2339',
    email: 'zainab.h@sokotostore.com',
    bvn: '22778899001',
    nin: '33221100998',
    tier: 'Tier 2 (Verified)',
    accountType: 'Merchant POS',
    status: 'Active',
    nairaBalance: 670000,
    ifwCoinBalance: 880,
    dailyLimitNgn: 3000000,
    location: 'Sokoto City, Sokoto',
    joinedDate: 'Jan 22, 2026',
    lastActive: '5 mins ago',
    riskScore: 15,
    notes: 'High-rated retail merchant in Northern corridor.',
  }
];

export const INITIAL_ACCOUNT_AUDIT_LOGS: AccountAuditLog[] = [
  {
    id: 'aud-log-01',
    accountId: 'acc-03',
    accountNumber: '0803441892',
    accountName: 'Alhaji Mohammed Bello',
    actionType: 'FREEZE_ACCOUNT',
    title: 'Post-No-Debit (PND) Freeze Applied',
    details: 'Triggered by AI Anomaly Model for micro-structuring under CBN ₦5M threshold. Debit rails quarantined.',
    performedBy: 'Viktor Zimmerman (CRO)',
    timestamp: 'Today 14:22 WAT',
    referenceCode: 'PND-CBN-2026-9901',
    status: 'Success',
  },
  {
    id: 'aud-log-02',
    accountId: 'acc-04',
    accountNumber: '0701882990',
    accountName: 'Apex Logistics Global Ltd',
    actionType: 'BLOCK_ACCOUNT',
    title: 'Complete Account Lockout & Hardware Blacklist',
    details: 'Synthetic invoice fraud flag confirmed. BVN and IMEI registered to blacklisted fraud cluster.',
    performedBy: 'Barrister Folake Adeleke (CCO)',
    timestamp: 'Today 13:05 WAT',
    referenceCode: 'BLK-AML-2026-4412',
    status: 'Dual-Control Verified',
  },
  {
    id: 'aud-log-03',
    accountId: 'acc-06',
    accountNumber: '0802991024',
    accountName: 'Kano Agro-Merchants Hub',
    actionType: 'REWARD_CASH_BONUS',
    title: '₦500,000 Super Agent Float Performance Rebate',
    details: 'Disbursed quarterly volume bonus for exceeding 100,000 monthly transactions in Kano Zone.',
    performedBy: 'Sharahbil Muhammd Sani (CEO)',
    timestamp: 'Today 11:15 WAT',
    referenceCode: 'BONUS-CEO-88910',
    status: 'Success',
  },
  {
    id: 'aud-log-04',
    accountId: 'acc-02',
    accountNumber: '0903119283',
    accountName: 'Chiamaka Eze',
    actionType: 'REWARD_IFW_COIN',
    title: '500 IFW Coin Staking Loyalty Bonus',
    details: 'Automated Web3 validator loyalty airdrop credited directly to decentralized non-custodial vault.',
    performedBy: 'Mansur Ismail Gotomo (CTO)',
    timestamp: 'Today 09:40 WAT',
    referenceCode: 'IFW-AIRDROP-7740',
    status: 'Success',
  },
];
