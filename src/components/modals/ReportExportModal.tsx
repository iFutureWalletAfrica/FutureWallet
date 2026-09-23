import { useState } from 'react';
import { Download, FileText, CheckCircle, ShieldCheck, Printer, X, Sparkles } from 'lucide-react';
import { EXECUTIVE_REPORTS } from '../../data/mockFintechData';
import { ExecutiveReport } from '../../types';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReportId?: string;
}

export const ReportExportModal = ({ isOpen, onClose, selectedReportId }: ReportExportModalProps) => {
  const [activeReport, setActiveReport] = useState<ExecutiveReport>(() => {
    return EXECUTIVE_REPORTS.find((r) => r.id === selectedReportId) || EXECUTIVE_REPORTS[0];
  });
  const [exportFormat, setExportFormat] = useState<'PDF' | 'XLSX' | 'JSON'>('PDF');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Executive Report Dispatcher</h3>
              <p className="text-xs text-slate-400">admin.ifuturewallet.com • Cryptographically Sealed Dossier</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Report Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Select Report Cadence</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {EXECUTIVE_REPORTS.map((rep) => (
                <button
                  key={rep.id}
                  onClick={() => setActiveReport(rep)}
                  className={`p-3 rounded-lg text-left border text-xs transition-all ${
                    activeReport.id === rep.id
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-medium'
                      : 'bg-slate-800/60 border-slate-750 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="block font-semibold">{rep.period}</span>
                  <span className="text-[11px] text-slate-400 truncate block mt-0.5">{rep.title.slice(0, 18)}...</span>
                </button>
              ))}
            </div>
          </div>

          {/* Report Preview Card */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {activeReport.period} Board Certified
                </span>
                <h4 className="text-base font-medium text-slate-100 mt-2">{activeReport.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">Generated: {activeReport.generatedAt} • Package Size: {activeReport.size}</p>
              </div>
            </div>

            {/* Metrics Snapshot */}
            <div className="grid grid-cols-4 gap-3 bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 block">Total Inflow</span>
                <span className="text-sm font-semibold text-emerald-400">{activeReport.metricsSummary.inflow}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Settled Outflow</span>
                <span className="text-sm font-semibold text-slate-200">{activeReport.metricsSummary.outflow}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Active Users</span>
                <span className="text-sm font-semibold text-cyan-400">{activeReport.metricsSummary.activeUsers}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Switch Success</span>
                <span className="text-sm font-semibold text-indigo-300">{activeReport.metricsSummary.successRate}</span>
              </div>
            </div>

            {/* Highlights */}
            <div>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">Key Executive Insights</span>
              <ul className="space-y-1.5">
                {activeReport.highlights.map((h, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Format Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Export Protocol & Format</label>
            <div className="flex gap-3">
              {(['PDF', 'XLSX', 'JSON'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                    exportFormat === fmt
                      ? 'bg-slate-100 text-slate-900 border-slate-100 shadow-sm'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {fmt === 'PDF' ? 'Encrypted PDF (Sign-off)' : fmt === 'XLSX' ? 'Full Ledger (XLSX)' : 'Audit Payload (JSON)'}
                </button>
              ))}
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-300 text-xs animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Report package compiled and authenticated. Download dispatched to authorized workstation.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Docket
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-500/10 transition-all disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Generating Dossier...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export {exportFormat} Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
