import { useState, useMemo } from 'react';
import { 
  Search, 
  Compass, 
  Terminal, 
  Shield, 
  Coins, 
  Users, 
  Building, 
  ArrowRight, 
  X, 
  ShieldAlert, 
  Sliders, 
  AlertTriangle,
  Snowflake,
  Ban,
  Gift,
  UserCog
} from 'lucide-react';
import { IFutureWalletLogo } from '../common/IFutureWalletLogo';
import { DashboardRole } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (role: DashboardRole) => void;
  onOpenFraudDetector?: () => void;
  onOpenHighRiskAlerts?: () => void;
  onOpenAccountAction?: (initialAccountId?: string) => void;
}

export const GlobalSearchModal = ({ 
  isOpen, 
  onClose, 
  onNavigate,
  onOpenFraudDetector,
  onOpenHighRiskAlerts,
  onOpenAccountAction,
}: GlobalSearchModalProps) => {
  const [query, setQuery] = useState('');

  const searchItems = [
    { title: 'Freeze / Unfreeze Account Manager', category: 'Account Actions', role: 'cco' as DashboardRole, icon: Snowflake, tags: 'freeze unfreeze pnd debit blocked halt restriction post no debit', action: 'account_action' },
    { title: 'Block / Unblock & Blacklist Account', category: 'Account Actions', role: 'cco' as DashboardRole, icon: Ban, tags: 'block unblock blacklist hardware bvn fraud kill switch terminate', action: 'account_action' },
    { title: 'Reward & Bonus Disbursal Engine', category: 'Account Actions', role: 'ceo' as DashboardRole, icon: Gift, tags: 'reward give bonus naira ifw coin cashback tier upgrade float stimulate', action: 'account_action' },
    { title: 'CEO Executive Suite (Sharahbil Muhammd Sani)', category: 'Executive', role: 'ceo' as DashboardRole, icon: Compass, tags: 'ceo sharahbil muhammd sani executive command board resolutions overview revenue' },
    { title: 'CTO Tech & API Center (Mansur Ismail Gotomo)', category: 'Engineering', role: 'cto' as DashboardRole, icon: Terminal, tags: 'cto mansur ismail gotomo tech architecture apm mobile android ios api sandbox' },
    { title: 'Fraud Detector & Anomaly Engine', category: 'Risk & Sentinel', role: 'cro' as DashboardRole, icon: Sliders, tags: 'fraud detector dictetor scoring heuristics anomaly sim swap velocity structuring', action: 'fraud_detector' },
    { title: 'High-Risk Threat Alerts Sentinel', category: 'Risk & Sentinel', role: 'cro' as DashboardRole, icon: AlertTriangle, tags: 'high risk alart alert threats critical quarantine emergency kill switch', action: 'high_risk_alerts' },
    { title: 'CEO Executive Dashboard', category: 'Executive', role: 'ceo' as DashboardRole, icon: Compass, tags: 'overview revenue performance users mau' },
    { title: 'Board of Directors Portal', category: 'Governance', role: 'board' as DashboardRole, icon: Building, tags: 'resolutions meetings audit investor governance' },
    { title: 'CTO Technology Control Panel', category: 'Engineering', role: 'cto' as DashboardRole, icon: Terminal, tags: 'servers apm cloud mobile android ios devops' },
    { title: 'External API Management Center', category: 'Developers', role: 'cto' as DashboardRole, icon: Terminal, tags: 'api keys sandbox wallet payment virtual account kyc' },
    { title: 'COO Customer Operations & Complaints', category: 'Operations', role: 'coo' as DashboardRole, icon: Users, tags: 'customers complaints tickets recovery sla' },
    { title: 'North West Regional Management', category: 'Regional', role: 'coo' as DashboardRole, icon: Users, tags: 'kano kaduna katsina sokoto cluster business developers' },
    { title: 'CFO Financial & Treasury Control', category: 'Finance', role: 'cfo' as DashboardRole, icon: Building, tags: 'treasury banks zenith 9psb liquidity settlements' },
    { title: 'CCO Compliance & AML Sentinel', category: 'Compliance', role: 'cco' as DashboardRole, icon: Shield, tags: 'kyc kyb bvn nin aml sanctions blacklist' },
    { title: 'CRO Risk Management & Continuity', category: 'Risk', role: 'cro' as DashboardRole, icon: ShieldAlert, tags: 'fraud score failover disaster recovery brute force dictetor' },
    { title: 'Legal & Intellectual Property', category: 'Legal', role: 'legal' as DashboardRole, icon: Building, tags: 'contracts trademark ifw patent brand' },
    { title: 'CMO Marketing & Growth Campaigns', category: 'Marketing', role: 'cmo' as DashboardRole, icon: Users, tags: 'growth cac referrals ads campaigns' },
    { title: 'Chief Partnership Officer', category: 'Partners', role: 'partners' as DashboardRole, icon: Building, tags: 'banking partners merchants psb microfinance shoprite' },
    { title: 'IFW Coin (105M Supply) Command Center', category: 'Tokenomics', role: 'ifw_coin' as DashboardRole, icon: Coins, tags: 'tokenomics supply staking rewards blockchain 105m' },
    { title: 'Human Resources & Payroll', category: 'HR', role: 'hr' as DashboardRole, icon: Users, tags: 'staff attendance payroll salaries directory' },
    { title: 'Internal Audit & Controls', category: 'Audit', role: 'audit' as DashboardRole, icon: Shield, tags: 'audit soc2 pci iso27001 logs testing' },
    { title: 'National Operations & SANEF Command', category: 'Nigeria Hierarchy', role: 'national_ops' as DashboardRole, icon: Compass, tags: 'national federal nigeria cbn sanef nibss agency cico float' },
    { title: 'Regional Geopolitical Zones (6 Zones)', category: 'Nigeria Hierarchy', role: 'regional_ops' as DashboardRole, icon: Building, tags: 'regional zones north west south west north central south south south east north east kano lagos' },
    { title: 'State Operations (36 States + FCT)', category: 'Nigeria Hierarchy', role: 'state_ops' as DashboardRole, icon: Building, tags: 'state kano lagos abuja rivers kaduna anambra siris tax birs lgas' },
    { title: 'Local Government Areas (774 LGAs)', category: 'Nigeria Hierarchy', role: 'lga_ops' as DashboardRole, icon: Users, tags: 'lga local government grassroots cico agents pos float terminal bvn nin' },
    { title: 'Enterprise Super Admin Console', category: 'Admin Roles', role: 'super_admin' as DashboardRole, icon: Shield, tags: 'super admin master kill switch rbac security' },
    { title: 'Maker-Checker Dual Control & RBAC Matrix', category: 'Admin Roles', role: 'admin_roles' as DashboardRole, icon: Shield, tags: 'maker checker dual sign approval quorum permissions cbn' },
    { title: 'Data Protection Officer (DPO)', category: 'Privacy', role: 'dpo' as DashboardRole, icon: Shield, tags: 'dsar gdpr ndpr privacy data consent' },
    { title: 'Enterprise System Settings', category: 'System', role: 'settings' as DashboardRole, icon: Terminal, tags: 'security 2fa ip timeout maintenance' },
  ];

  const filtered = useMemo(() => {
    if (!query.trim()) return searchItems;
    const q = query.toLowerCase();
    return searchItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-100">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Search input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search freeze, unfreeze, block, reward, bonus, fraud, CEO, CTO..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-200 mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-800 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No matching modules found for "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.action === 'account_action' && onOpenAccountAction) {
                      onOpenAccountAction();
                    } else if (item.action === 'fraud_detector' && onOpenFraudDetector) {
                      onOpenFraudDetector();
                    } else if (item.action === 'high_risk_alerts' && onOpenHighRiskAlerts) {
                      onOpenHighRiskAlerts();
                    } else {
                      onNavigate(item.role);
                    }
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 text-left group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-slate-800 text-slate-300 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 border border-slate-700 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-200 group-hover:text-white block">
                        {item.title}
                      </span>
                      <span className="text-xs text-slate-400">{item.category}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })
          )}
        </div>

        {/* Quick Footer with IFutureWallet branding */}
        <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <IFutureWalletLogo size="xs" variant="icon" />
            <span>iFutureWallet™ Command Router • admin.ifuturewallet.com</span>
          </div>
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>esc Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

