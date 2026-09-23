import React, { useState, useMemo } from 'react';
import { 
  Pin, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  Sliders, 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  MousePointer, 
  Filter,
  FileText
} from 'lucide-react';
import { DocumentAnnotation, DocumentAnnotationCategory, SubmittedDocument } from '../../types';

interface DocumentAnnotationSidebarProps {
  document: SubmittedDocument;
  applicantName: string;
  annotations: DocumentAnnotation[];
  selectedPinId: string | null;
  onSelectPin: (id: string | null) => void;
  onAddAnnotation: (annotation: Omit<DocumentAnnotation, 'id' | 'createdAt'>) => void;
  onUpdateAnnotation: (id: string, updates: Partial<DocumentAnnotation>) => void;
  onDeleteAnnotation: (id: string) => void;
  isPinningMode: boolean;
  onTogglePinningMode: () => void;
  onClose?: () => void;
  pendingPinCoords?: { x: number; y: number } | null;
  onClearPendingPin?: () => void;
}

const CATEGORY_CONFIG: Record<
  DocumentAnnotationCategory,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    icon: React.ElementType;
    badgeBg: string;
  }
> = {
  Clearance: {
    label: 'Clearance Verified',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    icon: ShieldCheck,
    badgeBg: 'bg-emerald-500',
  },
  Anomaly: {
    label: 'Anomaly / Alert',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    icon: AlertTriangle,
    badgeBg: 'bg-rose-500',
  },
  Discrepancy: {
    label: 'Discrepancy',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    icon: Sliders,
    badgeBg: 'bg-amber-500',
  },
  Observation: {
    label: 'Observation',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
    icon: Eye,
    badgeBg: 'bg-sky-500',
  },
};

const PRESET_TARGET_AREAS = [
  { label: 'MRZ Machine Strip', defaultCategory: 'Clearance' as DocumentAnnotationCategory, x: 25, y: 85, width: 68, height: 12 },
  { label: 'Full Legal Name OCR', defaultCategory: 'Clearance' as DocumentAnnotationCategory, x: 45, y: 35, width: 40, height: 12 },
  { label: 'Facial Biometric Portrait', defaultCategory: 'Clearance' as DocumentAnnotationCategory, x: 18, y: 40, width: 22, height: 26 },
  { label: 'Official CAC / NIMC Seal', defaultCategory: 'Observation' as DocumentAnnotationCategory, x: 74, y: 22, width: 18, height: 16 },
  { label: 'Document Expiry Date', defaultCategory: 'Clearance' as DocumentAnnotationCategory, x: 65, y: 55, width: 26, height: 10 },
  { label: 'Proof of Address Meter No.', defaultCategory: 'Observation' as DocumentAnnotationCategory, x: 50, y: 45, width: 40, height: 14 },
  { label: 'Suspected Font Tampering', defaultCategory: 'Anomaly' as DocumentAnnotationCategory, x: 40, y: 50, width: 35, height: 14 },
];

const COMPLIANCE_SNIPPETS = [
  'Hologram and watermarks verified without digital alterations.',
  'Cross-referenced with NIBSS Central Bank biometric switch.',
  'ICAO Doc 9303 compliant MRZ format with valid check digits.',
  'Utility bill dated within statutory 90-day validity window.',
  'Beneficial owner flagged on PEP watchlist; enhanced diligence required.',
  'Font kerning and pixel alignment indicate possible digital artifact.',
];

export const DocumentAnnotationSidebar: React.FC<DocumentAnnotationSidebarProps> = ({
  document,
  applicantName,
  annotations,
  selectedPinId,
  onSelectPin,
  onAddAnnotation,
  onUpdateAnnotation,
  onDeleteAnnotation,
  isPinningMode,
  onTogglePinningMode,
  onClose,
  pendingPinCoords,
  onClearPendingPin,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Form State
  const [targetArea, setTargetArea] = useState<string>('');
  const [category, setCategory] = useState<DocumentAnnotationCategory>('Clearance');
  const [note, setNote] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('Barrister Folake Adeleke');
  const [authorRole, setAuthorRole] = useState<string>('Chief Compliance Officer');
  const [pinCoords, setPinCoords] = useState<{ x: number; y: number; width?: number; height?: number }>({
    x: 50,
    y: 50,
    width: 25,
    height: 14,
  });

  // Automatically open composer when user clicks canvas to place pin
  React.useEffect(() => {
    if (pendingPinCoords) {
      setIsComposing(true);
      setEditingId(null);
      setPinCoords({
        x: Math.round(pendingPinCoords.x),
        y: Math.round(pendingPinCoords.y),
        width: 24,
        height: 12,
      });
      if (!targetArea) {
        setTargetArea('Inspection Highlight Area');
      }
    }
  }, [pendingPinCoords]);

  // Filtered annotations for this document
  const docAnnotations = useMemo(() => {
    return annotations.filter((a) => a.documentId === document.id);
  }, [annotations, document.id]);

  const filteredAnnotations = useMemo(() => {
    if (filterCategory === 'All') return docAnnotations;
    return docAnnotations.filter((a) => a.category === filterCategory);
  }, [docAnnotations, filterCategory]);

  // Summary counts
  const clearanceCount = docAnnotations.filter((a) => a.category === 'Clearance').length;
  const anomalyCount = docAnnotations.filter((a) => a.category === 'Anomaly').length;
  const discrepancyCount = docAnnotations.filter((a) => a.category === 'Discrepancy').length;
  const observationCount = docAnnotations.filter((a) => a.category === 'Observation').length;

  const handleStartCompose = (preset?: typeof PRESET_TARGET_AREAS[0]) => {
    setEditingId(null);
    if (preset) {
      setTargetArea(preset.label);
      setCategory(preset.defaultCategory);
      setPinCoords({
        x: preset.x,
        y: preset.y,
        width: preset.width,
        height: preset.height,
      });
      setNote(
        preset.defaultCategory === 'Clearance'
          ? `Verified authentic ${preset.label.toLowerCase()} against statutory benchmark.`
          : preset.defaultCategory === 'Anomaly'
          ? `Flagged possible tampering artifact on ${preset.label.toLowerCase()}.`
          : `Field observation recorded for ${preset.label.toLowerCase()}.`
      );
    } else {
      setTargetArea('');
      setCategory('Clearance');
      setNote('');
      setPinCoords({ x: 50, y: 50, width: 25, height: 14 });
    }
    setIsComposing(true);
  };

  const handleStartEdit = (ann: DocumentAnnotation) => {
    setEditingId(ann.id);
    setTargetArea(ann.targetArea);
    setCategory(ann.category);
    setNote(ann.note);
    setAuthorName(ann.authorName);
    setAuthorRole(ann.authorRole);
    setPinCoords({
      x: ann.x,
      y: ann.y,
      width: ann.width || 25,
      height: ann.height || 14,
    });
    setIsComposing(true);
  };

  const handleSaveAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetArea.trim() || !note.trim()) return;

    if (editingId) {
      onUpdateAnnotation(editingId, {
        targetArea: targetArea.trim(),
        category,
        note: note.trim(),
        authorName,
        authorRole,
        x: pinCoords.x,
        y: pinCoords.y,
        width: pinCoords.width,
        height: pinCoords.height,
      });
    } else {
      const nextPinNumber = docAnnotations.length > 0 
        ? Math.max(...docAnnotations.map((a) => a.pinNumber)) + 1 
        : 1;

      onAddAnnotation({
        documentId: document.id,
        applicantId: annotations[0]?.applicantId || 'kyc-01',
        pinNumber: nextPinNumber,
        x: pinCoords.x,
        y: pinCoords.y,
        width: pinCoords.width,
        height: pinCoords.height,
        targetArea: targetArea.trim(),
        category,
        note: note.trim(),
        authorName,
        authorRole,
        resolved: false,
      });
    }

    setIsComposing(false);
    setEditingId(null);
    if (onClearPendingPin) onClearPendingPin();
  };

  const handleCancelCompose = () => {
    setIsComposing(false);
    setEditingId(null);
    if (onClearPendingPin) onClearPendingPin();
  };

  const handleCopySummary = () => {
    const text = [
      `DOCUMENT ANNOTATION DOSSIER: ${document.title} (${document.fileFormat})`,
      `Applicant: ${applicantName} | Status: ${document.verificationStatus}`,
      `Total Pinned Annotations: ${docAnnotations.length} (Clearances: ${clearanceCount}, Flags: ${anomalyCount}, Discrepancies: ${discrepancyCount}, Observations: ${observationCount})`,
      '--------------------------------------------------',
      ...docAnnotations.map(
        (a, i) =>
          `[#${a.pinNumber}] ${a.category.toUpperCase()} - ${a.targetArea}\nNote: "${a.note}"\nOfficer: ${a.authorName} (${a.authorRole}) | ${a.createdAt} | Status: ${a.resolved ? 'RESOLVED' : 'ACTIVE'}\n`
      ),
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 text-xs">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Pin className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-100 flex items-center gap-1.5">
                Document Annotations
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {docAnnotations.length}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                {document.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopySummary}
              title="Copy Forensic Dossier Summary"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {copiedSummary ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Toolbar: Pin Mode Toggle & Add Button */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onTogglePinningMode}
            className={`px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-1.5 text-xs transition-all ${
              isPinningMode
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20 ring-2 ring-rose-400/40 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
            }`}
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span>{isPinningMode ? 'Cancel Pinning' : 'Click to Pin'}</span>
          </button>

          <button
            onClick={() => handleStartCompose()}
            className="px-3 py-2 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 text-xs shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Annotation</span>
          </button>
        </div>

        {/* Status Indicators Pill Strip */}
        <div className="flex items-center justify-between text-[11px] px-1 text-slate-400 border-t border-slate-800/60 pt-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {clearanceCount} Clean
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            {anomalyCount} Flagged
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {discrepancyCount} Check
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            {observationCount} Note
          </span>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
          {['All', 'Clearance', 'Anomaly', 'Discrepancy', 'Observation'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Body Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Interactive Pinning Mode Active Banner */}
        {isPinningMode && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40 border border-rose-500/30 text-slate-200 space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-rose-300 font-semibold">
              <MousePointer className="w-4 h-4 animate-bounce" />
              <span>Interactive Pinning Active</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Click anywhere directly on the document image to drop a new pinned highlight, or choose a preset zone below:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_TARGET_AREAS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleStartCompose(preset)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-[10px] font-medium transition-colors"
                >
                  + {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Annotation Composer Form (Drawer/Card) */}
        {isComposing && (
          <form
            onSubmit={handleSaveAnnotation}
            className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/40 shadow-xl space-y-3 animate-in fade-in"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-200 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>{editingId ? 'Edit Pinned Annotation' : 'New Forensic Pin'}</span>
              </div>
              <button
                type="button"
                onClick={handleCancelCompose}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Target Area Name */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Target Area on Document
              </label>
              <input
                type="text"
                value={targetArea}
                onChange={(e) => setTargetArea(e.target.value)}
                placeholder="e.g. Passport MRZ Strip, NIN Barcode, Photo..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {['MRZ Strip', 'Name OCR', 'Portrait Biometric', 'Official Seal', 'Expiry Date'].map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTargetArea(t)}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Annotation Category
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['Clearance', 'Anomaly', 'Discrepancy', 'Observation'] as DocumentAnnotationCategory[]).map((cat) => {
                  const Icon = CATEGORY_CONFIG[cat].icon;
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-colors ${
                        isSelected
                          ? `${CATEGORY_CONFIG[cat].bg} ${CATEGORY_CONFIG[cat].border} ${CATEGORY_CONFIG[cat].text} font-semibold ring-1 ring-indigo-500/30`
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-[10px]">{CATEGORY_CONFIG[cat].label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Coordinate Fine-tuning */}
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold text-slate-300">Highlight Box Coordinates</span>
                <span className="font-mono text-indigo-400">X: {pinCoords.x}% · Y: {pinCoords.y}%</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-400">
                <div>
                  <label className="block mb-0.5">Horizontal Pos: {pinCoords.x}%</label>
                  <input
                    type="range"
                    min="5"
                    max="90"
                    value={pinCoords.x}
                    onChange={(e) => setPinCoords((p) => ({ ...p, x: Number(e.target.value) }))}
                    className="w-full accent-indigo-500 h-1 bg-slate-800 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-0.5">Vertical Pos: {pinCoords.y}%</label>
                  <input
                    type="range"
                    min="5"
                    max="90"
                    value={pinCoords.y}
                    onChange={(e) => setPinCoords((p) => ({ ...p, y: Number(e.target.value) }))}
                    className="w-full accent-indigo-500 h-1 bg-slate-800 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Note Textarea */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Compliance Officer Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter forensic observation, biometric comparison result, or compliance reason..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                required
              />
              <div className="mt-1 space-y-1">
                <span className="text-[10px] text-slate-400 block">Quick Standard Snippets:</span>
                <div className="flex flex-col gap-1">
                  {COMPLIANCE_SNIPPETS.slice(0, 3).map((snippet, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNote(snippet)}
                      className="text-left text-[10px] text-indigo-300 hover:text-indigo-200 bg-slate-900/60 p-1 rounded border border-slate-850 truncate"
                    >
                      "{snippet}"
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Officer Signature */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Reviewing Officer</label>
                <select
                  value={authorName}
                  onChange={(e) => {
                    setAuthorName(e.target.value);
                    if (e.target.value.includes('Folake')) setAuthorRole('Chief Compliance Officer');
                    else if (e.target.value.includes('Amina')) setAuthorRole('Senior Compliance Analyst');
                    else setAuthorRole('AML Investigator');
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-200"
                >
                  <option value="Barrister Folake Adeleke">Barrister Folake Adeleke</option>
                  <option value="Amina Bello">Amina Bello</option>
                  <option value="Tunde Bakare">Tunde Bakare</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Officer Role</label>
                <input
                  type="text"
                  value={authorRole}
                  readOnly
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-400"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleCancelCompose}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm text-xs transition-colors"
              >
                {editingId ? 'Update Annotation' : 'Pin Note to Document'}
              </button>
            </div>
          </form>
        )}

        {/* Annotations List */}
        {filteredAnnotations.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
            <Pin className="w-6 h-6 text-slate-600 mx-auto" />
            <div className="font-semibold text-slate-300">No Annotations Found</div>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              {filterCategory !== 'All'
                ? `No annotations matching "${filterCategory}".`
                : 'Click "Click to Pin" above and select an area on the document specimen to attach your first forensic observation.'}
            </p>
            <button
              onClick={() => handleStartCompose()}
              className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Pin</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredAnnotations.map((ann) => {
              const cfg = CATEGORY_CONFIG[ann.category];
              const Icon = cfg.icon;
              const isSelected = selectedPinId === ann.id;

              return (
                <div
                  key={ann.id}
                  onClick={() => onSelectPin(ann.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-slate-850 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                      : 'bg-slate-950/70 border-slate-800 hover:bg-slate-850/60'
                  }`}
                >
                  {/* Top Bar of Card */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full ${cfg.badgeBg} text-slate-950 flex items-center justify-center font-bold text-[10px] shadow-sm`}>
                        #{ann.pinNumber}
                      </span>
                      <span className="font-semibold text-slate-100 text-xs">
                        {ann.targetArea}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold border flex items-center gap-1 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        <Icon className="w-2.5 h-2.5" />
                        {cfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Note Body */}
                  <p className="text-slate-300 text-xs leading-relaxed my-1.5 pl-7">
                    "{ann.note}"
                  </p>

                  {/* Metadata and Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-850/80 text-[10px] pl-7">
                    <div className="text-slate-400">
                      <span className="font-medium text-slate-300">{ann.authorName}</span>
                      <span className="text-slate-500"> • {ann.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onUpdateAnnotation(ann.id, { resolved: !ann.resolved })}
                        title={ann.resolved ? 'Mark as Unresolved' : 'Mark as Resolved'}
                        className={`p-1 rounded transition-colors ${
                          ann.resolved
                            ? 'text-emerald-400 hover:bg-emerald-500/10'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleStartEdit(ann)}
                        title="Edit Pinned Note"
                        className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteAnnotation(ann.id)}
                        title="Delete Pin"
                        className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-300">
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>Statutory Dossier Attached</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          Normalized Canvas v2.4
        </span>
      </div>
    </div>
  );
};
