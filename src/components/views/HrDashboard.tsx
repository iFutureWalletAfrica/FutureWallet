import { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Check,
  Send
} from 'lucide-react';
import { EMPLOYEES_LIST } from '../../data/mockFintechData';

export const HrDashboard = () => {
  const [employees] = useState(EMPLOYEES_LIST);
  const [payrollStatus, setPayrollStatus] = useState<'Pending Disbursement' | 'Disbursed via IFW Rails'>('Pending Disbursement');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDisbursePayroll = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPayrollStatus('Disbursed via IFW Rails');
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
              People & Payroll Operations
            </span>
            <span className="text-xs text-slate-400">admin.ifuturewallet.com • Corporate Staff Registry</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Human Resources, Staff Directory & Instant Wallet Payroll
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Managing 184 full-time staff across 8 global departments, automated salary disbursement via internal wallet rails, and leave tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDisbursePayroll}
            disabled={isProcessing || payrollStatus === 'Disbursed via IFW Rails'}
            className="px-3.5 py-2 text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-500/15 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {isProcessing
              ? 'Transmitting Payments...'
              : payrollStatus === 'Disbursed via IFW Rails'
              ? 'Payroll Disbursed'
              : 'Run Monthly Payroll ($640k)'}
          </button>
        </div>
      </div>

      {/* HR KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">Total Staff Headcount</span>
          <span className="text-xl font-bold text-white font-mono mt-1 block">184</span>
          <span className="text-[11px] text-slate-500">Across 8 core departments</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">Monthly Base Payroll</span>
          <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">$640,000 USD</span>
          <span className="text-[11px] text-slate-500">100% automated batch</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">Commissions & Bonuses</span>
          <span className="text-xl font-bold text-cyan-400 font-mono mt-1 block">$225,000 USD</span>
          <span className="text-[11px] text-slate-500">Sales & field BD incentives</span>
        </div>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">Current Payroll Status</span>
          <span
            className={`text-sm font-bold font-mono mt-1 block ${
              payrollStatus === 'Disbursed via IFW Rails' ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {payrollStatus}
          </span>
          <span className="text-[11px] text-slate-500">Cycle: September 2026</span>
        </div>
      </div>

      {/* Employees Directory Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-indigo-400" />
          Enterprise Staff Directory & Payroll Ledger
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-medium">Employee Name</th>
                <th className="pb-3 font-medium">Designation & Department</th>
                <th className="pb-3 font-medium">Internal Wallet</th>
                <th className="pb-3 font-medium">Monthly Salary</th>
                <th className="pb-3 font-medium">Work Mode</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-3 font-semibold text-slate-200">{emp.name}</td>
                  <td className="py-3">
                    <span className="text-slate-200 block font-medium">{emp.role}</span>
                    <span className="text-[11px] text-slate-500">{emp.department}</span>
                  </td>
                  <td className="py-3 font-mono text-cyan-400 text-[11px]">{emp.walletAddress}</td>
                  <td className="py-3 font-mono text-emerald-400 font-semibold">${emp.salary.toLocaleString()}</td>
                  <td className="py-3 text-slate-300">{emp.workMode}</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
