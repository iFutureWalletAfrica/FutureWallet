import { 
  LayoutDashboard,
  Building2,
  Users,
  Wallet,
  ArrowLeftRight,
  Landmark,
  ShieldAlert,
  Scale,
  Handshake,
  Code2,
  GitFork,
  TrendingUp,
  Coins,
  UserCog,
  FileCheck2,
  ShieldCheck,
  LockKeyhole,
  Settings,
  ChevronRight,
  Shield,
  Globe,
  Layers,
  MapPin,
  Key,
  Gift,
  Snowflake
} from 'lucide-react';
import { IFutureWalletLogo } from './common/IFutureWalletLogo';
import { DashboardRole } from '../types';

interface SidebarProps {
  currentRole: DashboardRole;
  onSelectRole: (role: DashboardRole) => void;
  currentViewId?: string;
  onSelectView?: (viewId: string) => void;
  isOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenAccountAction?: () => void;
}

export const Sidebar = ({ 
  currentRole, 
  onSelectRole, 
  currentViewId,
  onSelectView,
  isOpen = false, 
  onCloseMobile = () => {},
  onOpenAccountAction
}: SidebarProps) => {
  const menuGroups = [
    {
      groupTitle: 'Core Command',
      items: [
        { id: 'ceo' as DashboardRole, label: 'Executive Overview', icon: LayoutDashboard, badge: 'CEO' },
        { id: 'board' as DashboardRole, label: 'Board Portal', icon: Building2, badge: 'Trustee' },
      ],
    },
    {
      groupTitle: 'Territorial Hierarchy (Nigeria)',
      items: [
        { id: 'national_ops' as DashboardRole, label: 'National Federal Command', icon: Globe, badge: 'SANEF' },
        { id: 'regional_ops' as DashboardRole, label: '6 Geopolitical Zones', icon: Layers, badge: '6 Zones' },
        { id: 'state_ops' as DashboardRole, label: 'State Operations (36+FCT)', icon: Building2, badge: 'SIRS Tax' },
        { id: 'lga_ops' as DashboardRole, label: 'Local Govts (774 LGAs)', icon: MapPin, badge: 'CICO' },
      ],
    },
    {
      groupTitle: 'Admin Roles & Quorum (CBN)',
      items: [
        { id: 'super_admin' as DashboardRole, label: 'Super Admin Console', icon: LockKeyhole, badge: 'Root Lvl 5' },
        { id: 'admin_roles' as DashboardRole, label: 'Maker-Checker & RBAC', icon: Key, badge: 'Dual-Sign' },
      ],
    },
    {
      groupTitle: 'Customer & Operations',
      items: [
        { id: 'coo' as DashboardRole, label: 'Operations & Field Ops', icon: Users, badge: '4.8M' },
        { id: 'cfo' as DashboardRole, label: 'Treasury & Reserves', icon: Landmark, badge: '$612M' },
        { id: 'partners' as DashboardRole, label: 'Ecosystem & Banking', icon: Handshake },
      ],
    },
    {
      groupTitle: 'Technology & Security',
      items: [
        { id: 'cto' as DashboardRole, label: 'CTO Tech & API Center', icon: Code2, badge: 'Sandbox' },
        { id: 'security' as DashboardRole, label: 'Cyber & Firewall', icon: ShieldCheck, badge: 'WAF' },
      ],
    },
    {
      groupTitle: 'IFW Coin Ecosystem',
      items: [
        { id: 'ifw_coin' as DashboardRole, label: 'IFW Tokenomics & Staking', icon: Coins, badge: '105M' },
      ],
    },
    {
      groupTitle: 'Risk, Legal & Compliance',
      items: [
        { id: 'cco' as DashboardRole, label: 'Compliance & KYC Sentinel', icon: Shield, badge: 'AML' },
        { id: 'cro' as DashboardRole, label: 'Fraud & Continuity', icon: ShieldAlert, badge: 'DR' },
        { id: 'legal' as DashboardRole, label: 'Contracts & Trademark IP', icon: Scale },
      ],
    },
    {
      groupTitle: 'Enterprise & Growth',
      items: [
        { id: 'growth' as DashboardRole, label: 'Marketing & Acquisition', icon: TrendingUp },
        { id: 'hr' as DashboardRole, label: 'Human Resources & Payroll', icon: UserCog },
        { id: 'settings' as DashboardRole, label: 'System Settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <IFutureWalletLogo size="sm" variant="horizontal" showSubtitle subtitleText="Enterprise Command" />
        </div>

        {/* Quick Action: Freeze / Unfreeze / Reward / Bonus */}
        {onOpenAccountAction && (
          <div className="px-3 pt-3">
            <button
              onClick={() => {
                onOpenAccountAction();
                onCloseMobile();
              }}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 hover:from-emerald-500/20 hover:to-cyan-500/20 border border-emerald-500/30 flex items-center justify-between text-left group transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                  <UserCog className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Account Action & Bonus</span>
                  <span className="text-[10px] text-emerald-300 block">Freeze • Block • Reward</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </button>
          </div>
        )}

        {/* Menu Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <span className="px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                {group.groupTitle}
              </span>
              <div className="space-y-0.5">
                {group.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  const isActive = currentRole === item.id;
                  return (
                    <button
                      key={iIdx}
                      onClick={() => {
                        onSelectRole(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium text-xs transition-all group ${
                        isActive
                          ? 'bg-slate-800/90 text-slate-100 font-semibold border border-slate-700/80 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-tight ${
                            isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom System Health Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 text-[11px]">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Nominal
            </span>
            <span className="font-mono text-emerald-400">99.994%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
            <div className="bg-emerald-400 h-1 rounded-full w-[99.9%]" />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
            <span>admin.ifuturewallet.com</span>
            <span>v4.18.2</span>
          </div>
        </div>
      </aside>
    </>
  );
};
