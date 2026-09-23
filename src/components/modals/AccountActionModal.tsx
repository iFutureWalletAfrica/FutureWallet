import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  ShieldAlert, 
  Snowflake, 
  Sun, 
  Ban, 
  CheckCircle2, 
  Gift, 
  Coins, 
  ArrowUpRight, 
  RotateCcw, 
  Key, 
  Smartphone, 
  Sliders, 
  FileText, 
  Clock, 
  AlertTriangle, 
  Check, 
  Sparkles,
  DollarSign,
  UserCheck,
  Building,
  UserX,
  CreditCard,
  History,
  Lock,
  Download,
  Fingerprint
} from 'lucide-react';
import { IFutureWalletLogo } from '../common/IFutureWalletLogo';
import { ManagedAccount, AccountAuditLog, INITIAL_MANAGED_ACCOUNTS, INITIAL_ACCOUNT_AUDIT_LOGS } from '../../data/accountActionData';

interface AccountActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAccountId?: string;
  onAccountUpdated?: (account: ManagedAccount) => void;
}

export const AccountActionModal: React.FC<AccountActionModalProps> = ({
  isOpen,
  onClose,
  initialAccountId,
  onAccountUpdated,
}) => {
  // Accounts State
  const [accounts, setAccounts] = useState<ManagedAccount[]>(INITIAL_MANAGED_ACCOUNTS);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    initialAccountId || INITIAL_MANAGED_ACCOUNTS[0].id
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeActionTab, setActiveActionTab] = useState<
    'freeze_block' | 'reward_bonus' | 'account_controls' | 'audit_history'
  >('freeze_block');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AccountAuditLog[]>(INITIAL_ACCOUNT_AUDIT_LOGS);

  // Freeze / Unfreeze Form State
  const [freezeType, setFreezeType] = useState<'pnd' | 'total'>('pnd');
  const [freezeReason, setFreezeReason] = useState<string>('CBN AML/CFT Regulatory Directive');
  const [customFreezeReason, setCustomFreezeReason] = useState<string>('');

  // Block Form State
  const [blockReason, setBlockReason] = useState<string>('Confirmed Fraud / Synthetic Identity');
  const [blacklistDevice, setBlacklistDevice] = useState<boolean>(true);

  // Reward / Bonus Form State
  const [bonusType, setBonusType] = useState<'naira' | 'ifw_coin' | 'cashback' | 'tier_upgrade'>('naira');
  const [nairaAmount, setNairaAmount] = useState<number>(25000);
  const [ifwAmount, setIfwAmount] = useState<number>(100);
  const [rewardCampaign, setRewardCampaign] = useState<string>('Top Merchant Monthly Volume Rebate');
  const [targetTier, setTargetTier] = useState<ManagedAccount['tier']>('Tier 3 (Enterprise)');

  // Control Actions Form State
  const [newDailyLimit, setNewDailyLimit] = useState<number>(5000000);
  const [pinResetChannel, setPinResetChannel] = useState<'sms' | 'email' | 'both'>('both');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'warning' | 'info'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Filter accounts by search query
  const filteredAccounts = useMemo(() => {
    if (!searchQuery.trim()) return accounts;
    const q = searchQuery.toLowerCase();
    return accounts.filter(
      (a) =>
        a.accountName.toLowerCase().includes(q) ||
        a.accountNumber.includes(q) ||
        a.phone.includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.bvn.includes(q) ||
        a.status.toLowerCase().includes(q)
    );
  }, [accounts, searchQuery]);

  // Currently selected account
  const currentAccount = useMemo(() => {
    const found = accounts.find((a) => a.id === selectedAccountId);
    return found || accounts[0];
  }, [accounts, selectedAccountId]);

  if (!isOpen) return null;

  // 1. FREEZE ACCOUNT ACTION
  const handleFreezeAccount = () => {
    if (!currentAccount) return;
    const isTotal = freezeType === 'total';
    const newStatus: ManagedAccount['status'] = isTotal ? 'Frozen (Total Freeze)' : 'Frozen (Debit Blocked)';
    const reasonText = customFreezeReason.trim() || freezeReason;

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === currentAccount.id
          ? {
              ...acc,
              status: newStatus,
              riskScore: Math.min(100, acc.riskScore + 20),
            }
          : acc
      )
    );

    const ref = `FRZ-${Date.now().toString().slice(-6)}`;
    const newLog: AccountAuditLog = {
      id: `log-${Date.now()}`,
      accountId: currentAccount.id,
      accountNumber: currentAccount.accountNumber,
      accountName: currentAccount.accountName,
      actionType: 'FREEZE_ACCOUNT',
      title: `${isTotal ? 'Total Account Freeze' : 'Debit Rail PND Freeze'} Applied`,
      details: `Reason: ${reasonText}. Inflow: ${isTotal ? 'Halted' : 'Permitted'}. Outflow: Halted.`,
      performedBy: 'Sharahbil Muhammd Sani (CEO Command)',
      timestamp: 'Just now',
      referenceCode: ref,
      status: 'Success',
    };

    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Account ${currentAccount.accountNumber} has been frozen (${newStatus}).`, 'warning');
    if (onAccountUpdated) onAccountUpdated({ ...currentAccount, status: newStatus });
  };

  // 2. UNFREEZE ACCOUNT ACTION
  const handleUnfreezeAccount = () => {
    if (!currentAccount) return;

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === currentAccount.id
          ? {
              ...acc,
              status: 'Active',
              riskScore: Math.max(5, acc.riskScore - 25),
            }
          : acc
      )
    );

    const ref = `UNFRZ-${Date.now().toString().slice(-6)}`;
    const newLog: AccountAuditLog = {
      id: `log-${Date.now()}`,
      accountId: currentAccount.id,
      accountNumber: currentAccount.accountNumber,
      accountName: currentAccount.accountName,
      actionType: 'UNFREEZE_ACCOUNT',
      title: 'Account Restrictions Fully Lifted',
      details: 'Account successfully unfrozen. Standard debit and credit rails restored to operational status.',
      performedBy: 'Sharahbil Muhammd Sani (CEO Command)',
      timestamp: 'Just now',
      referenceCode: ref,
      status: 'Success',
    };

    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Account ${currentAccount.accountNumber} unfreezed. All rails active.`, 'success');
    if (onAccountUpdated) onAccountUpdated({ ...currentAccount, status: 'Active' });
  };

  // 3. BLOCK ACCOUNT ACTION
  const handleBlockAccount = () => {
    if (!currentAccount) return;

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === currentAccount.id
          ? {
              ...acc,
              status: 'Blocked (Blacklisted)',
              riskScore: 99,
              dailyLimitNgn: 0,
            }
          : acc
      )
    );

    const ref = `BLK-${Date.now().toString().slice(-6)}`;
    const newLog: AccountAuditLog = {
      id: `log-${Date.now()}`,
      accountId: currentAccount.id,
      accountNumber: currentAccount.accountNumber,
      accountName: currentAccount.accountName,
      actionType: 'BLOCK_ACCOUNT',
      title: 'Account Blacklisted & Credentials Terminated',
      details: `Reason: ${blockReason}. Hardware IMEI & BVN ${currentAccount.bvn} added to central blacklist.`,
      performedBy: 'Mansur Ismail Gotomo (CTO / SysOps Command)',
      timestamp: 'Just now',
      referenceCode: ref,
      status: 'Dual-Control Verified',
    };

    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Account ${currentAccount.accountNumber} blocked and blacklisted.`, 'warning');
    if (onAccountUpdated) onAccountUpdated({ ...currentAccount, status: 'Blocked (Blacklisted)' });
  };

  // 4. UNBLOCK ACCOUNT ACTION
  const handleUnblockAccount = () => {
    if (!currentAccount) return;

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === currentAccount.id
          ? {
              ...acc,
              status: 'Active',
              riskScore: 20,
              dailyLimitNgn: 1000000,
            }
          : acc
      )
    );

    const ref = `UNBLK-${Date.now().toString().slice(-6)}`;
    const newLog: AccountAuditLog = {
      id: `log-${Date.now()}`,
      accountId: currentAccount.id,
      accountNumber: currentAccount.accountNumber,
      accountName: currentAccount.accountName,
      actionType: 'UNBLOCK_ACCOUNT',
      title: 'Account Blacklist Removed & Rails Restored',
      details: 'Dual-control compliance approval granted. Hardware and account reinstated to Active status.',
      performedBy: 'Sharahbil Muhammd Sani (CEO) & Mansur Ismail Gotomo (CTO)',
      timestamp: 'Just now',
      referenceCode: ref,
      status: 'Dual-Control Verified',
    };

    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Account ${currentAccount.accountNumber} successfully unblocked.`, 'success');
    if (onAccountUpdated) onAccountUpdated({ ...currentAccount, status: 'Active' });
  };

  // 5. REWARD & BONUS ACTION
  const handleDisburseReward = () => {
    if (!currentAccount) return;

    if (bonusType === 'naira') {
      const addedAmount = nairaAmount;
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === currentAccount.id
            ? { ...acc, nairaBalance: acc.nairaBalance + addedAmount }
            : acc
        )
      );

      const ref = `BONUS-NGN-${Date.now().toString().slice(-6)}`;
      const newLog: AccountAuditLog = {
        id: `log-${Date.now()}`,
        accountId: currentAccount.id,
        accountNumber: currentAccount.accountNumber,
        accountName: currentAccount.accountName,
        actionType: 'REWARD_CASH_BONUS',
        title: `₦${addedAmount.toLocaleString()} Cash Bonus Disbursed`,
        details: `Campaign: ${rewardCampaign}. Direct ledger wallet credit issued. New Balance: ₦${(
          currentAccount.nairaBalance + addedAmount
        ).toLocaleString()}.`,
        performedBy: 'Sharahbil Muhammd Sani (CEO Command)',
        timestamp: 'Just now',
        referenceCode: ref,
        status: 'Success',
      };

      setAuditLogs((prev) => [newLog, ...prev]);
      showToast(`₦${addedAmount.toLocaleString()} bonus credited to ${currentAccount.accountName}!`, 'success');
    } else if (bonusType === 'ifw_coin') {
      const addedTokens = ifwAmount;
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === currentAccount.id
            ? { ...acc, ifwCoinBalance: acc.ifwCoinBalance + addedTokens }
            : acc
        )
      );

      const ref = `IFW-AIR-${Date.now().toString().slice(-6)}`;
      const newLog: AccountAuditLog = {
        id: `log-${Date.now()}`,
        accountId: currentAccount.id,
        accountNumber: currentAccount.accountNumber,
        accountName: currentAccount.accountName,
        actionType: 'REWARD_IFW_COIN',
        title: `${addedTokens} IFW Coin Ecosystem Reward Credited`,
        details: `Ecosystem reward issued via Smart Contract Vault. Staking APY privileges activated.`,
        performedBy: 'Mansur Ismail Gotomo (CTO / Web3 Command)',
        timestamp: 'Just now',
        referenceCode: ref,
        status: 'Success',
      };

      setAuditLogs((prev) => [newLog, ...prev]);
      showToast(`${addedTokens} IFW Coins awarded to ${currentAccount.accountName}!`, 'success');
    } else if (bonusType === 'tier_upgrade') {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === currentAccount.id
            ? { ...acc, tier: targetTier, dailyLimitNgn: targetTier === 'Tier 3 (Enterprise)' ? 25000000 : 5000000 }
            : acc
        )
      );

      const ref = `TIER-UP-${Date.now().toString().slice(-6)}`;
      const newLog: AccountAuditLog = {
        id: `log-${Date.now()}`,
        accountId: currentAccount.id,
        accountNumber: currentAccount.accountNumber,
        accountName: currentAccount.accountName,
        actionType: 'TIER_UPGRADE',
        title: `Account Promoted to ${targetTier}`,
        details: `Promotional loyalty upgrade granted with increased daily limits and zero-fee transactions.`,
        performedBy: 'Sharahbil Muhammd Sani (CEO Command)',
        timestamp: 'Just now',
        referenceCode: ref,
        status: 'Success',
      };

      setAuditLogs((prev) => [newLog, ...prev]);
      showToast(`Account successfully upgraded to ${targetTier}!`, 'success');
    } else {
      // Cashback Rebate
      const rebateAmount = 15000;
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === currentAccount.id
            ? { ...acc, nairaBalance: acc.nairaBalance + rebateAmount }
            : acc
        )
      );
      const ref = `REBATE-${Date.now().toString().slice(-6)}`;
      const newLog: AccountAuditLog = {
        id: `log-${Date.now()}`,
        accountId: currentAccount.id,
        accountNumber: currentAccount.accountNumber,
        accountName: currentAccount.accountName,
        actionType: 'CASHBACK_REBATE',
        title: `₦${rebateAmount.toLocaleString()} Instant Fee Cashback Rebate`,
        details: `Rebate refunded on recent merchant interbank switching fees.`,
        performedBy: 'Corporate Treasury Rail',
        timestamp: 'Just now',
        referenceCode: ref,
        status: 'Success',
      };
      setAuditLogs((prev) => [newLog, ...prev]);
      showToast(`₦${rebateAmount.toLocaleString()} cashback rebate credited!`, 'success');
    }
  };

  // 6. GENERAL CONTROLS (RESET PIN, KILL SESSIONS, STEP-UP, ADJUST LIMIT)
  const handleResetPin = () => {
    if (!currentAccount) return;
    const ref = `PIN-RST-${Date.now().toString().slice(-6)}`;
    const newLog: AccountAuditLog = {
      id: `log-${Date.now()}`,
      accountId: currentAccount.id,
      accountNumber: currentAccount.accountNumber,
      accountName: currentAccount.accountName,
      actionType: 'RESET_PIN',
      title: 'Transaction PIN Invalidated & Secure Reset Sent',
      details: `Temporary OTP dispatch triggered via ${pinResetChannel.toUpperCase()} to ${currentAccount.phone}.`,
      performedBy: 'Mansur Ismail Gotomo (CTO / SysOps Command)',
      timestamp: 'Just now',
      referenceCode: ref,
      status: 'Success',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`PIN reset link & OTP sent to ${currentAccount.phone}.`, 'info');
  };

  const handleKillSessions = () => {
    if (!currentAccount) return;
    const ref = `KILL-SESS-${Date.now().toString().slice(-6)}`;
    const newLog: AccountAuditLog = {
      id: `log-${Date.now()}`,
      accountId: currentAccount.id,
      accountNumber: currentAccount.accountNumber,
      accountName: currentAccount.accountName,
      actionType: 'KILL_SESSIONS',
      title: 'All Active JWT Sessions Invalidated',
      details: 'All mobile tokens, web sessions, and authorized device IDs forcibly terminated at auth gateway.',
      performedBy: 'Mansur Ismail Gotomo (CTO Security Lead)',
      timestamp: 'Just now',
      referenceCode: ref,
      status: 'Success',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`All active sessions terminated for ${currentAccount.accountName}.`, 'warning');
  };

  const handleEnforceStepUp = () => {
    if (!currentAccount) return;
    const ref = `BIO-STEP-${Date.now().toString().slice(-6)}`;
    const newLog: AccountAuditLog = {
      id: `log-${Date.now()}`,
      accountId: currentAccount.id,
      accountNumber: currentAccount.accountNumber,
      accountName: currentAccount.accountName,
      actionType: 'BIOMETRIC_STEP_UP',
      title: 'FIDO2 Biometric Challenge Enforced',
      details: 'User flagged for mandatory biometric facial/fingerprint scan before next transaction.',
      performedBy: 'Risk & Sentinel Engine',
      timestamp: 'Just now',
      referenceCode: ref,
      status: 'Success',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Biometric challenge enforced on ${currentAccount.accountName}.`, 'info');
  };

  const handleAdjustLimit = () => {
    if (!currentAccount) return;
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === currentAccount.id ? { ...acc, dailyLimitNgn: newDailyLimit } : acc
      )
    );
    const ref = `LIM-ADJ-${Date.now().toString().slice(-6)}`;
    const newLog: AccountAuditLog = {
      id: `log-${Date.now()}`,
      accountId: currentAccount.id,
      accountNumber: currentAccount.accountNumber,
      accountName: currentAccount.accountName,
      actionType: 'ADJUST_LIMIT',
      title: `Daily Limit Updated to ₦${newDailyLimit.toLocaleString()}`,
      details: `Daily transfer ceiling calibrated per executive approval.`,
      performedBy: 'Sharahbil Muhammd Sani (CEO Command)',
      timestamp: 'Just now',
      referenceCode: ref,
      status: 'Success',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Daily limit set to ₦${newDailyLimit.toLocaleString()} for ${currentAccount.accountName}.`, 'success');
  };

  // Helper status color
  const getStatusBadge = (status: ManagedAccount['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Frozen (Debit Blocked)':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Frozen (Total Freeze)':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse';
      case 'Blocked (Blacklisted)':
        return 'bg-rose-600 text-white font-bold border-rose-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header with Official iFutureWallet Logo and Executive Authority */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <IFutureWalletLogo size="md" variant="horizontal" showSubtitle subtitleText="Account Action & Rewards Command" />
            <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-slate-800 text-[11px] text-slate-400">
              <span>CEO:</span>
              <span className="font-semibold text-white">Sharahbil Muhammd Sani</span>
              <span className="text-slate-600">•</span>
              <span>CTO:</span>
              <span className="font-semibold text-white">Mansur Ismail Gotomo</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>Root Clearance Level 5</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div
            className={`mx-5 mt-3 p-3 rounded-xl border flex items-center justify-between text-xs font-medium animate-in fade-in slide-in-from-top-2 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : toastMessage.type === 'warning'
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{toastMessage.text}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Grid: Left Account Selector + Right Action Workspace */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* LEFT PANEL: ACCOUNTS DIRECTORY & SEARCH (4 Cols) */}
          <div className="md:col-span-4 lg:col-span-4 border-r border-slate-800 bg-slate-950/60 flex flex-col overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, acct, phone, BVN..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 px-1">
                <span>{filteredAccounts.length} accounts found</span>
                <span className="text-emerald-400 font-mono">Live Core DB</span>
              </div>
            </div>

            {/* Scrollable Accounts List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-850 p-2 space-y-1">
              {filteredAccounts.map((acc) => {
                const isSelected = acc.id === currentAccount.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => setSelectedAccountId(acc.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border border-cyan-500/50 shadow-md'
                        : 'hover:bg-slate-900/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-semibold text-xs text-white truncate">
                        {acc.accountName}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] border font-medium ${getStatusBadge(
                          acc.status
                        )}`}
                      >
                        {acc.status.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span className="text-cyan-400">{acc.accountNumber}</span>
                      <span className="text-emerald-400 font-semibold">
                        ₦{acc.nairaBalance.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span>{acc.tier.split(' ')[0]}</span>
                      <span className="flex items-center gap-1">
                        <Coins className="w-2.5 h-2.5 text-amber-400" />
                        {acc.ifwCoinBalance} IFW
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Account Input Option */}
            <div className="p-3 border-t border-slate-800 bg-slate-950 text-xs">
              <span className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase tracking-wider">
                Need to act on an external or unlisted account?
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter NUBAN (e.g. 0819...)"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) {
                        const newAcc: ManagedAccount = {
                          id: `acc-custom-${Date.now()}`,
                          accountNumber: val,
                          accountName: `Custom Account (${val})`,
                          phone: '+234 800 000 0000',
                          email: `user.${val}@client.ifuturewallet.com`,
                          bvn: '22998877665',
                          nin: '88776655443',
                          tier: 'Tier 2 (Verified)',
                          accountType: 'Personal Wallet',
                          status: 'Active',
                          nairaBalance: 50000,
                          ifwCoinBalance: 50,
                          dailyLimitNgn: 1000000,
                          location: 'Abuja FCT',
                          joinedDate: 'Today',
                          lastActive: 'Just now',
                          riskScore: 25,
                        };
                        setAccounts((prev) => [newAcc, ...prev]);
                        setSelectedAccountId(newAcc.id);
                        (e.target as HTMLInputElement).value = '';
                        showToast(`Custom account ${val} loaded for action.`, 'info');
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: SELECTED ACCOUNT DETAILS & ACTION WORKSPACE (8 Cols) */}
          <div className="md:col-span-8 lg:col-span-8 flex flex-col overflow-hidden bg-slate-900">
            
            {/* Target Account Summary Banner */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {currentAccount.accountName}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                      currentAccount.status
                    )}`}
                  >
                    {currentAccount.status}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {currentAccount.accountType}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>NUBAN: <strong className="text-cyan-400">{currentAccount.accountNumber}</strong></span>
                  <span>•</span>
                  <span>BVN: <strong className="text-slate-200">{currentAccount.bvn}</strong></span>
                  <span>•</span>
                  <span>Phone: <strong className="text-slate-200">{currentAccount.phone}</strong></span>
                  <span>•</span>
                  <span>Loc: <span className="text-slate-300">{currentAccount.location}</span></span>
                </div>
              </div>

              {/* Wallet Balances Pill */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                <div>
                  <span className="text-[10px] text-slate-400 block">Naira Wallet</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    ₦{currentAccount.nairaBalance.toLocaleString()}
                  </span>
                </div>
                <div className="border-l border-slate-800 pl-3">
                  <span className="text-[10px] text-slate-400 block">IFW Token</span>
                  <span className="text-sm font-bold text-amber-400 font-mono flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    {currentAccount.ifwCoinBalance}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Tabs Bar */}
            <div className="flex items-center gap-2 px-4 border-b border-slate-800 bg-slate-950/80 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setActiveActionTab('freeze_block')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeActionTab === 'freeze_block'
                    ? 'border-rose-500 text-rose-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Snowflake className="w-3.5 h-3.5" />
                <span>Freeze & Block Controls</span>
              </button>

              <button
                onClick={() => setActiveActionTab('reward_bonus')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeActionTab === 'reward_bonus'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Disburse Reward & Bonus</span>
              </button>

              <button
                onClick={() => setActiveActionTab('account_controls')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeActionTab === 'account_controls'
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Account Controls & Security</span>
              </button>

              <button
                onClick={() => setActiveActionTab('audit_history')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeActionTab === 'audit_history'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Audit Trail ({auditLogs.length})</span>
              </button>
            </div>

            {/* TAB CONTENT 1: FREEZE, UNFREEZE, BLOCK, UNBLOCK */}
            {activeActionTab === 'freeze_block' && (
              <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
                
                {/* 1. FREEZE / UNFREEZE SECTION */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                        <Snowflake className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          Account Freeze Operations (PND / Total Freeze)
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Halt outbound ledger debits while maintaining deposits, or freeze all transaction rails under CBN guidelines.
                        </p>
                      </div>
                    </div>
                    {currentAccount.status.includes('Frozen') && (
                      <span className="px-2 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded font-bold font-mono">
                        Currently Frozen
                      </span>
                    )}
                  </div>

                  {/* Freeze Type Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFreezeType('pnd')}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        freezeType === 'pnd'
                          ? 'bg-amber-500/10 border-amber-500/50 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-amber-300">
                          Post-No-Debit (PND Freeze)
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Halts all transfers, ATM withdrawals, and POS debits. Incoming salary/transfers are still credited.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFreezeType('total')}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        freezeType === 'total'
                          ? 'bg-rose-500/10 border-rose-500/50 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-rose-300">
                          Total Account Freeze
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                          Total Lock
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Locks both inflow and outflow rails. Rejects all incoming commercial bank ACH / NIP deposits.
                      </p>
                    </button>
                  </div>

                  {/* Regulatory Reason */}
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      Freeze Justification & Regulatory Code:
                    </label>
                    <select
                      value={freezeReason}
                      onChange={(e) => setFreezeReason(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="CBN AML/CFT Regulatory Directive">CBN AML/CFT Circular & Sanctions Directive</option>
                      <option value="Suspected Account Takeover (ATO) / SIM Swap Flag">Suspected Account Takeover (ATO) / Telco SIM Swap</option>
                      <option value="Rapid Smurfing / Structuring Under ₦5M">Rapid Smurfing / Structuring Under ₦5M Threshold</option>
                      <option value="Court Order / Law Enforcement Lien (EFCC/NFIU)">Court Order / Law Enforcement Lien (EFCC / NFIU)</option>
                      <option value="Customer Emergency Distress / Stolen Phone Report">Customer Emergency Distress / Stolen Device Report</option>
                      <option value="Custom Protocol Note">Custom Protocol Note</option>
                    </select>

                    {freezeReason === 'Custom Protocol Note' && (
                      <input
                        type="text"
                        value={customFreezeReason}
                        onChange={(e) => setCustomFreezeReason(e.target.value)}
                        placeholder="Enter specific audit reason and ticket reference..."
                        className="w-full mt-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    )}
                  </div>

                  {/* Freeze Actions Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={handleFreezeAccount}
                      disabled={currentAccount.status === 'Blocked (Blacklisted)'}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50"
                    >
                      <Snowflake className="w-4 h-4" />
                      <span>Execute Freeze on Account</span>
                    </button>

                    {currentAccount.status.includes('Frozen') && (
                      <button
                        onClick={handleUnfreezeAccount}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                      >
                        <Sun className="w-4 h-4" />
                        <span>Unfreeze & Restore All Rails</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. BLOCK / UNBLOCK SECTION */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
                        <Ban className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          Account Blacklist & Terminal Block (Kill-Switch)
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Complete account lockout, device fingerprint ban, and BVN blacklisting across all NIBSS switches.
                        </p>
                      </div>
                    </div>

                    {currentAccount.status === 'Blocked (Blacklisted)' && (
                      <span className="px-2 py-1 bg-rose-600 text-white rounded font-bold font-mono">
                        Blacklisted
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">
                        Blacklist Grounds:
                      </label>
                      <select
                        value={blockReason}
                        onChange={(e) => setBlockReason(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-rose-500"
                      >
                        <option value="Confirmed Fraud / Synthetic Identity">Confirmed Fraud / Synthetic Identity</option>
                        <option value="Ransomware / Extortion Money Mule">Ransomware / Extortion Inflow Mule</option>
                        <option value="Central Bank Watchlist Directive">CBN / NFIU Permanent Blacklist Directive</option>
                        <option value="Card Cloned / ATM Skimmer Operation">Card Cloned / ATM Skimmer Operation</option>
                      </select>
                    </div>

                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={blacklistDevice}
                          onChange={(e) => setBlacklistDevice(e.target.checked)}
                          className="rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-rose-500"
                        />
                        <span>Also Blacklist Device IMEI & IP Subnet at WAF</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {currentAccount.status !== 'Blocked (Blacklisted)' ? (
                      <button
                        onClick={handleBlockAccount}
                        className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-rose-700/30 transition-all"
                      >
                        <UserX className="w-4 h-4" />
                        <span>Block & Blacklist Account</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleUnblockAccount}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Unblock & Remove from Blacklist</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT 2: REWARD & BONUS DISBURSAL */}
            {activeActionTab === 'reward_bonus' && (
              <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        Executive Reward & Bonus Engine
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Disburse instant Cash Naira bonuses, IFW Coin ecosystem grants, cashback fee rebates, and promotional tier upgrades.
                      </p>
                    </div>
                  </div>

                  {/* Bonus Type Toggle */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setBonusType('naira')}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        bonusType === 'naira'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <DollarSign className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                      <span>Naira Cash Bonus</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBonusType('ifw_coin')}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        bonusType === 'ifw_coin'
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Coins className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                      <span>IFW Coin Reward</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBonusType('cashback')}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        bonusType === 'cashback'
                          ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <RotateCcw className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                      <span>Cashback Rebate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBonusType('tier_upgrade')}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        bonusType === 'tier_upgrade'
                          ? 'bg-purple-500/15 border-purple-500 text-purple-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                      <span>Loyalty Tier Upgrade</span>
                    </button>
                  </div>

                  {/* Bonus Inputs according to selected type */}
                  {bonusType === 'naira' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">
                          Naira Bonus Amount (₦):
                        </label>
                        <div className="flex gap-2">
                          {[5000, 10000, 25000, 50000, 100000, 500000].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => setNairaAmount(amt)}
                              className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                                nairaAmount === amt
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              ₦{(amt / 1000).toFixed(0)}k
                            </button>
                          ))}
                        </div>
                        <input
                          type="number"
                          value={nairaAmount}
                          onChange={(e) => setNairaAmount(Number(e.target.value))}
                          className="w-full mt-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Current Balance:</span>
                        <span className="font-mono text-white">₦{currentAccount.nairaBalance.toLocaleString()}</span>
                        <span className="text-slate-400">After Bonus:</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          ₦{(currentAccount.nairaBalance + nairaAmount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {bonusType === 'ifw_coin' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">
                          IFW Coin Tokens to Grant:
                        </label>
                        <div className="flex gap-2">
                          {[25, 50, 100, 250, 500, 1000, 5000].map((tokens) => (
                            <button
                              key={tokens}
                              type="button"
                              onClick={() => setIfwAmount(tokens)}
                              className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                                ifwAmount === tokens
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              {tokens} IFW
                            </button>
                          ))}
                        </div>
                        <input
                          type="number"
                          value={ifwAmount}
                          onChange={(e) => setIfwAmount(Number(e.target.value))}
                          className="w-full mt-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Current Tokens:</span>
                        <span className="font-mono text-white">{currentAccount.ifwCoinBalance} IFW</span>
                        <span className="text-slate-400">After Reward:</span>
                        <span className="font-mono text-amber-400 font-bold">
                          {currentAccount.ifwCoinBalance + ifwAmount} IFW
                        </span>
                      </div>
                    </div>
                  )}

                  {bonusType === 'tier_upgrade' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">
                          Select New Account Tier:
                        </label>
                        <select
                          value={targetTier}
                          onChange={(e) => setTargetTier(e.target.value as any)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="Tier 2 (Verified)">Tier 2 (Verified - ₦5,000,000 / Day Limit)</option>
                          <option value="Tier 3 (Enterprise)">Tier 3 (Enterprise - ₦25,000,000 / Day Limit)</option>
                          <option value="Corporate KYB">Corporate KYB (Unlimited Float Clearing)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Campaign Reference */}
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      Campaign / Authority Reference:
                    </label>
                    <select
                      value={rewardCampaign}
                      onChange={(e) => setRewardCampaign(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Top Merchant Monthly Volume Rebate">Top Merchant Monthly Volume Rebate</option>
                      <option value="Welcome Activation Bonus">Welcome Activation Bonus</option>
                      <option value="Grassroots Financial Inclusion Stimulus">Grassroots Financial Inclusion Stimulus</option>
                      <option value="Eid-el-Kabir / Festive Seasonal Reward">Eid-el-Kabir / Festive Seasonal Reward</option>
                      <option value="Executive Discretionary Grant (CEO Sharahbil Muhammd Sani)">
                        Executive Discretionary Grant (CEO Sharahbil Muhammd Sani)
                      </option>
                      <option value="CTO Developer & Bug Bounty Reward (CTO Mansur Ismail Gotomo)">
                        CTO Developer & Bug Bounty Reward (CTO Mansur Ismail Gotomo)
                      </option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleDisburseReward}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Credit Bonus & Update Ledger</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: ACCOUNT CONTROLS & SECURITY ACTIONS */}
            {activeActionTab === 'account_controls' && (
              <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                
                {/* Reset PIN & Password */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold text-white">Reset Transaction PIN / Password</span>
                    </div>
                    <span className="text-[10px] text-slate-400">SMS / Email OTP</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Immediately invalidates current 4-digit PIN and dispatches a secure cryptographic reset token to user's registered phone ({currentAccount.phone}).
                  </p>
                  <div className="flex items-center gap-3">
                    <select
                      value={pinResetChannel}
                      onChange={(e) => setPinResetChannel(e.target.value as any)}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    >
                      <option value="both">Both SMS & Email</option>
                      <option value="sms">SMS Only</option>
                      <option value="email">Email Only</option>
                    </select>
                    <button
                      onClick={handleResetPin}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-cyan-500/30 rounded-lg font-semibold transition-colors"
                    >
                      Dispatch PIN Reset Link
                    </button>
                  </div>
                </div>

                {/* Kill Sessions */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-amber-400" />
                      <span className="font-semibold text-white">Force Session Logout (Kill Active Tokens)</span>
                    </div>
                    <span className="text-[10px] text-slate-400">All Devices</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Revokes all active JWT tokens across Android, iOS, POS, and Web. Requires user to re-authenticate with credentials and SMS OTP.
                  </p>
                  <button
                    onClick={handleKillSessions}
                    className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 rounded-lg font-semibold transition-colors"
                  >
                    Kill All Active Sessions Now
                  </button>
                </div>

                {/* Biometric Step-Up */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-purple-400" />
                      <span className="font-semibold text-white">Enforce Biometric Step-Up Challenge</span>
                    </div>
                    <span className="text-[10px] text-purple-400">FIDO2 / Face Scan</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Forces biometric facial verification on the user's mobile app before any outbound transfers or PIN changes are authorized.
                  </p>
                  <button
                    onClick={handleEnforceStepUp}
                    className="px-3 py-1.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 rounded-lg font-semibold transition-colors"
                  >
                    Enforce Biometric Challenge
                  </button>
                </div>

                {/* Daily Limit Adjustment */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-white">Adjust Daily Transaction Limits</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">
                      Current: ₦{currentAccount.dailyLimitNgn.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Configure maximum cumulative daily debit threshold across all banking switches.
                  </p>
                  <div className="flex items-center gap-3">
                    <select
                      value={newDailyLimit}
                      onChange={(e) => setNewDailyLimit(Number(e.target.value))}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    >
                      <option value={50000}>₦50,000 (Tier 1 Limit)</option>
                      <option value={1000000}>₦1,000,000 (Tier 2 Standard)</option>
                      <option value={5000000}>₦5,000,000 (High Volume)</option>
                      <option value={25000000}>₦25,000,000 (Tier 3 Enterprise)</option>
                      <option value={50000000}>₦50,000,000 (Super Agent Float)</option>
                    </select>
                    <button
                      onClick={handleAdjustLimit}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors"
                    >
                      Apply New Limit
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT 4: AUDIT TRAIL */}
            {activeActionTab === 'audit_history' && (
              <div className="flex-1 overflow-y-auto p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <History className="w-4 h-4 text-cyan-400" />
                    Immutable Account Governance Audit Trail
                  </span>
                  <span className="text-[10px] text-slate-400">Signed with Enterprise HSM</span>
                </div>

                <div className="space-y-2.5">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              log.actionType.includes('FREEZE') || log.actionType.includes('BLOCK')
                                ? 'bg-rose-500/20 text-rose-300'
                                : log.actionType.includes('REWARD') || log.actionType.includes('TIER')
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-cyan-500/20 text-cyan-300'
                            }`}
                          >
                            {log.actionType.replace('_', ' ')}
                          </span>
                          <span className="font-semibold text-white text-xs">{log.title}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-cyan-400 font-mono text-[11px]">{log.accountNumber}</span>
                        </div>
                        <p className="text-[11px] text-slate-300">{log.details}</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500">
                          <span>By: <strong className="text-slate-300">{log.performedBy}</strong></span>
                          <span>•</span>
                          <span>Ref: <strong className="text-slate-300 font-mono">{log.referenceCode}</strong></span>
                          <span>•</span>
                          <span>{log.timestamp}</span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Modal Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Audit Trail Cryptographically Timestamped</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium transition-colors"
                >
                  Close Manager
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
