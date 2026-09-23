import React, { useState, useRef, useMemo } from 'react';
import { 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Eye, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Maximize2, 
  Minimize2, 
  Sliders, 
  ExternalLink,
  Pin,
  MousePointer
} from 'lucide-react';
import { SubmittedDocument, DocumentAnnotation, DocumentAnnotationCategory } from '../../types';
import { DocumentAnnotationSidebar } from './DocumentAnnotationSidebar';
import { INITIAL_DOCUMENT_ANNOTATIONS } from '../../data/kycAnnotationData';

interface DocumentSpecimenCardProps {
  document: SubmittedDocument;
  applicantName: string;
  annotations?: DocumentAnnotation[];
  selectedPinId?: string | null;
  onSelectPin?: (id: string | null) => void;
  onAddAnnotation?: (annotation: Omit<DocumentAnnotation, 'id' | 'createdAt'>) => void;
  onUpdateAnnotation?: (id: string, updates: Partial<DocumentAnnotation>) => void;
  onDeleteAnnotation?: (id: string) => void;
  isPinningMode?: boolean;
  onTogglePinningMode?: () => void;
  pendingPinCoords?: { x: number; y: number } | null;
  onDocumentClick?: (coords: { x: number; y: number }) => void;
  onClearPendingPin?: () => void;
  sidebarTab?: 'ocr' | 'annotations';
  onSidebarTabChange?: (tab: 'ocr' | 'annotations') => void;
}

const CATEGORY_PIN_THEME: Record<
  DocumentAnnotationCategory,
  {
    bg: string;
    border: string;
    badgeBg: string;
    text: string;
  }
> = {
  Clearance: {
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-400 border-dashed',
    badgeBg: 'bg-emerald-400',
    text: 'text-emerald-400',
  },
  Anomaly: {
    bg: 'bg-rose-500/25',
    border: 'border-rose-400 border-dashed animate-pulse',
    badgeBg: 'bg-rose-500',
    text: 'text-rose-400',
  },
  Discrepancy: {
    bg: 'bg-amber-500/20',
    border: 'border-amber-400 border-dashed',
    badgeBg: 'bg-amber-400',
    text: 'text-amber-400',
  },
  Observation: {
    bg: 'bg-sky-500/20',
    border: 'border-sky-400 border-dashed',
    badgeBg: 'bg-sky-400',
    text: 'text-sky-400',
  },
};

export const DocumentSpecimenCard = ({ 
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
  pendingPinCoords,
  onDocumentClick,
  onClearPendingPin,
  sidebarTab,
  onSidebarTabChange
}: DocumentSpecimenCardProps) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [filterMode, setFilterMode] = useState<'normal' | 'contrast' | 'invert'>('normal');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Local fallback state
  const [localAnnotations, setLocalAnnotations] = useState<DocumentAnnotation[]>(INITIAL_DOCUMENT_ANNOTATIONS);
  const [localSelectedPinId, setLocalSelectedPinId] = useState<string | null>(null);
  const [localPinningMode, setLocalPinningMode] = useState<boolean>(false);
  const [localPendingPin, setLocalPendingPin] = useState<{ x: number; y: number } | null>(null);
  const [localSidebarTab, setLocalSidebarTab] = useState<'ocr' | 'annotations'>('ocr');

  const artifactContainerRef = useRef<HTMLDivElement>(null);

  const currentAnnotations = annotations || localAnnotations;
  const activePinId = selectedPinId !== undefined ? selectedPinId : localSelectedPinId;
  const isPinningActive = isPinningMode !== undefined ? isPinningMode : localPinningMode;
  const pendingCoords = pendingPinCoords !== undefined ? pendingPinCoords : localPendingPin;
  const activeRightTab = sidebarTab !== undefined ? sidebarTab : localSidebarTab;

  const handleSelectPin = (id: string | null) => {
    if (onSelectPin) onSelectPin(id);
    else setLocalSelectedPinId(id);
  };

  const handleTogglePinning = () => {
    if (onTogglePinningMode) onTogglePinningMode();
    else setLocalPinningMode((p) => !p);
  };

  const handleTabChange = (tab: 'ocr' | 'annotations') => {
    if (onSidebarTabChange) onSidebarTabChange(tab);
    else setLocalSidebarTab(tab);
  };

  const handleAddAnnotation = (ann: Omit<DocumentAnnotation, 'id' | 'createdAt'>) => {
    if (onAddAnnotation) {
      onAddAnnotation(ann);
    } else {
      const created: DocumentAnnotation = {
        ...ann,
        id: `ann-${Date.now()}`,
        createdAt: 'Just now',
      };
      setLocalAnnotations((prev) => [created, ...prev]);
    }
  };

  const handleUpdateAnnotation = (id: string, updates: Partial<DocumentAnnotation>) => {
    if (onUpdateAnnotation) {
      onUpdateAnnotation(id, updates);
    } else {
      setLocalAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    }
  };

  const handleDeleteAnnotation = (id: string) => {
    if (onDeleteAnnotation) {
      onDeleteAnnotation(id);
    } else {
      setLocalAnnotations((prev) => prev.filter((a) => a.id !== id));
      if (localSelectedPinId === id) setLocalSelectedPinId(null);
    }
  };

  const docAnnotations = useMemo(() => {
    return currentAnnotations.filter((a) => a.documentId === document.id);
  }, [currentAnnotations, document.id]);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.75));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleReset = () => {
    setZoomLevel(1);
    setRotation(0);
    setFilterMode('normal');
  };

  const handleArtifactClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPinningActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(5, Math.min(90, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
    
    if (onDocumentClick) {
      onDocumentClick({ x, y });
    } else {
      setLocalPendingPin({ x, y });
      setLocalPinningMode(false);
    }
    handleTabChange('annotations');
  };

  const getFilterStyle = () => {
    switch (filterMode) {
      case 'contrast':
        return 'contrast-200 brightness-110 saturate-150';
      case 'invert':
        return 'invert hue-rotate-180 contrast-150';
      default:
        return '';
    }
  };

  return (
    <div className={`flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden transition-all duration-200 ${
      isExpanded ? 'fixed inset-4 z-50 shadow-2xl bg-slate-950/98 backdrop-blur-md' : 'relative'
    }`}>
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FileText className="w-4 h-4" />
          </span>
          <div>
            <h4 className="font-semibold text-slate-100 flex items-center gap-2">
              {document.title}
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                document.verificationStatus.includes('Verified') || document.verificationStatus.includes('Validated')
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : document.verificationStatus.includes('Flagged')
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
              }`}>
                {document.verificationStatus}
              </span>
            </h4>
            <span className="text-[11px] text-slate-400">
              Issuing Authority: <span className="text-slate-300">{document.issuingAuthority}</span> • {document.fileFormat} ({document.fileSize})
            </span>
          </div>
        </div>

        {/* Forensic Inspection Controls & Annotation Triggers */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Annotation Mode Toggle Button */}
          <button
            onClick={() => handleTabChange(activeRightTab === 'annotations' ? 'ocr' : 'annotations')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 transition-all border ${
              activeRightTab === 'annotations'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850 hover:text-white'
            }`}
          >
            <Pin className="w-3.5 h-3.5 text-indigo-400" />
            <span>Annotations</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-indigo-500/20 text-indigo-300">
              {docAnnotations.length}
            </span>
          </button>

          <button
            onClick={handleTogglePinning}
            title={isPinningActive ? 'Cancel Pin Placement' : 'Click to Drop Highlight Pin on Specimen'}
            className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all border ${
              isPinningActive
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
          >
            <MousePointer className="w-3 h-3" />
            <span>{isPinningActive ? 'Pinning...' : 'Pin Tool'}</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Color & Forensic filters */}
          <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() => setFilterMode('normal')}
              title="Normal Color View"
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                filterMode === 'normal' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Color
            </button>
            <button
              onClick={() => setFilterMode('contrast')}
              title="High Contrast (Tampering / Alteration Check)"
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                filterMode === 'contrast' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Forensic
            </button>
            <button
              onClick={() => setFilterMode('invert')}
              title="Invert / Hologram Inspection"
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                filterMode === 'invert' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Invert
            </button>
          </div>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            disabled={zoomLevel <= 0.75}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded disabled:opacity-40"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-slate-400 w-10 text-center">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            disabled={zoomLevel >= 2.5}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded disabled:opacity-40"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleRotate}
            title="Rotate 90° Clockwise"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Restore Size' : 'Expand Fullscreen'}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Inspection Canvas & Side-by-Side Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 overflow-hidden min-h-[420px]">
        {/* Visual Document Renderer */}
        <div className="lg:col-span-7 xl:col-span-8 p-6 flex items-center justify-center bg-slate-950/80 overflow-auto relative border-b lg:border-b-0 lg:border-r border-slate-850">
          {/* Subtle watermark background grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Active Pinning Banner floating indicator */}
          {isPinningActive && (
            <div className="absolute top-3 left-3 z-30 px-3 py-1.5 rounded-lg bg-rose-600/90 text-white font-medium text-[11px] shadow-lg flex items-center gap-1.5 border border-rose-400/50 backdrop-blur-md animate-bounce">
              <MousePointer className="w-3.5 h-3.5" />
              <span>Click anywhere on the document to drop an annotation pin</span>
            </div>
          )}

          {/* Rendered Document Physical Artifact Container with Zoom & Rotation */}
          <div 
            style={{ 
              transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out'
            }}
            className={`transition-all ${getFilterStyle()}`}
          >
            {/* Clickable relative container for precise percentage coordinate pinning */}
            <div 
              ref={artifactContainerRef}
              onClick={handleArtifactClick}
              className={`relative inline-block select-none transition-all ${
                isPinningActive ? 'cursor-crosshair ring-2 ring-rose-500/50 rounded-xl' : 'cursor-default'
              }`}
            >
              {/* 1. National ID Slip (NIMC) */}
              {document.previewType === 'id_card' && (
                <div className="w-[420px] rounded-xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 p-4 border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden text-slate-100">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center font-bold text-xs text-emerald-400">
                        🇳🇬
                      </div>
                      <div>
                        <div className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">Federal Republic of Nigeria</div>
                        <div className="text-xs font-semibold text-slate-200">National Identity Management Commission</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      NIMC NIN SLIP
                    </span>
                  </div>

                  <div className="grid grid-cols-12 gap-3 pt-3 items-center">
                    <div className="col-span-4 flex flex-col items-center">
                      <div className="w-24 h-28 rounded-lg bg-slate-800 border-2 border-slate-700 overflow-hidden relative flex flex-col items-center justify-center shadow-inner">
                        <div className="w-16 h-16 rounded-full bg-slate-700/80 border border-slate-600 flex items-center justify-center text-slate-400 font-bold text-lg">
                          {applicantName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="absolute bottom-1 right-1 px-1 rounded text-[8px] font-mono bg-emerald-500 text-slate-950 font-bold">
                          VERIFIED
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 font-mono">CHIP ID: 9941</span>
                    </div>

                    <div className="col-span-8 space-y-1.5 text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Full Name</span>
                        <span className="font-bold text-slate-100 text-sm tracking-tight">{applicantName}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 block">NIN Number</span>
                          <span className="font-mono font-bold text-emerald-400 tracking-wider">
                            {document.documentNumber || '8492 0194 8210'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Expiry</span>
                          <span className="font-mono text-slate-200">{document.expiryDate || '10 YRS VALID'}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>NIMC AUTH: VALIDATED</span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> DIGITAL SEAL
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Simulated Barcode */}
                  <div className="mt-3 pt-2 border-t border-dashed border-slate-800 flex items-center justify-between">
                    <div className="h-4 w-48 bg-slate-800/80 rounded flex items-center px-1 gap-1">
                      {[...Array(24)].map((_, i) => (
                        <span key={i} className={`h-full ${i % 3 === 0 ? 'w-1 bg-slate-400' : 'w-0.5 bg-slate-600'}`} />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono text-slate-400">SECURE DIGITALLY ENCRYPTED</span>
                  </div>
                </div>
              )}

              {/* 2. International Passport */}
              {document.previewType === 'passport' && (
                <div className="w-[440px] rounded-xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 p-4 border-2 border-indigo-500/40 shadow-2xl relative text-slate-100">
                  <div className="flex items-center justify-between pb-2.5 border-b border-indigo-500/30">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇳🇬</span>
                      <div>
                        <div className="text-[9px] tracking-widest text-indigo-400 uppercase font-bold">Federal Republic of Nigeria</div>
                        <div className="text-xs font-semibold text-slate-200">Electronic Passport / Passeport Électronique</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      TYPE P • NGA
                    </span>
                  </div>

                  <div className="grid grid-cols-12 gap-3 pt-3 items-center">
                    <div className="col-span-4 flex flex-col items-center">
                      <div className="w-24 h-32 rounded bg-slate-800 border-2 border-indigo-500/30 overflow-hidden relative flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-lg">
                          {applicantName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none mix-blend-overlay" />
                      </div>
                    </div>

                    <div className="col-span-8 space-y-1.5 text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Surname / Nom</span>
                        <span className="font-bold text-slate-100 text-sm">{applicantName.split(' ').slice(-1)[0]}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Given Names / Prénoms</span>
                        <span className="font-semibold text-slate-200">{applicantName.split(' ').slice(0, -1).join(' ') || applicantName}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Passport No.</span>
                          <span className="font-mono font-bold text-cyan-400">{document.documentNumber || 'A10984219'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Nationality</span>
                          <span className="font-semibold text-slate-200">NIGERIAN</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MRZ Zone */}
                  <div className="mt-3 p-2 bg-slate-950/90 rounded border border-slate-800 font-mono text-[9px] text-cyan-300 tracking-widest leading-relaxed select-all">
                    <div>P&lt;NGAMOHAMMED&lt;&lt;FATIMA&lt;ZAHRA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
                    <div>A109842197NGA9208154F3209094849201948210&lt;&lt;64</div>
                  </div>
                </div>
              )}

              {/* 3. Liveness Selfie */}
              {document.previewType === 'selfie' && (
                <div className="w-[380px] rounded-xl bg-slate-900 p-4 border-2 border-cyan-500/40 shadow-2xl relative text-slate-100 text-center">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                    <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> 3D Liveness Anti-Spoofing Scan
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      PASS 99.8%
                    </span>
                  </div>

                  <div className="my-4 relative w-48 h-48 mx-auto rounded-2xl border-2 border-dashed border-cyan-400/60 overflow-hidden flex items-center justify-center bg-slate-950 shadow-inner">
                    <div className="absolute inset-3 border border-cyan-500/40 rounded-xl pointer-events-none" />
                    <div className="w-28 h-28 rounded-full bg-slate-800 border-2 border-cyan-400 flex items-center justify-center font-bold text-2xl text-cyan-300">
                      {applicantName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="absolute top-16 left-16 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <div className="absolute top-16 right-16 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <div className="absolute bottom-16 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-mono bg-emerald-500 text-slate-950 font-bold">
                      LIVE HUMAN
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-left bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Facial Match to ID</span>
                      <span className="text-emerald-400 font-mono font-bold">98.4% Match</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Spoof Detection</span>
                      <span className="text-emerald-400 font-semibold">0% Synthetic / Mask</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Utility Bill / Proof of Address */}
              {document.previewType === 'utility_bill' && (
                <div className="w-[420px] rounded-xl bg-slate-900 p-4 border-2 border-amber-500/40 shadow-2xl relative text-slate-100">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⚡</span>
                      <div>
                        <div className="text-xs font-bold text-amber-400 uppercase">{document.issuingAuthority}</div>
                        <div className="text-[11px] text-slate-300">Statutory Electricity / Utility Bill Receipt</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      VALID &lt; 90 DAYS
                    </span>
                  </div>

                  <div className="py-3 space-y-2 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                      <span className="text-[10px] text-slate-400 block uppercase">Service Address (Geocoded)</span>
                      <span className="text-slate-100 font-semibold">{document.extractedFields.find(f => f.label.includes('Address'))?.value || '14 Admiralty Way, Lekki Phase 1, Lagos'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                        <span className="text-[10px] text-slate-400 block">Account / Meter No.</span>
                        <span className="font-mono text-cyan-400">{document.documentNumber || '0129-4820-11'}</span>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                        <span className="text-[10px] text-slate-400 block">Bill Date</span>
                        <span className="font-mono text-emerald-400">{document.issueDate || '12 Sep 2026'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>DISCO AUDIT: CLEAR</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> OFFICIAL RECEIPT STAMP
                    </span>
                  </div>
                </div>
              )}

              {/* 5. CAC Certificate (Corporate) */}
              {document.previewType === 'cac_cert' && (
                <div className="w-[450px] rounded-xl bg-slate-900 p-4 border-2 border-purple-500/40 shadow-2xl relative text-slate-100">
                  <div className="flex items-center justify-between pb-3 border-b border-purple-500/30">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🏛️</span>
                      <div>
                        <div className="text-xs font-bold text-purple-400 uppercase">Corporate Affairs Commission (CAC)</div>
                        <div className="text-[11px] text-slate-300">Certificate of Incorporation • Companies and Allied Matters Act</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      RC-1940291
                    </span>
                  </div>

                  <div className="py-3 space-y-2 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                      <span className="text-[10px] text-slate-400 block uppercase">Incorporated Entity Name</span>
                      <span className="text-slate-100 font-bold text-sm">{applicantName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-slate-950 p-2 rounded border border-slate-850">
                        <span className="text-[9px] text-slate-400 block">Registration Date</span>
                        <span className="font-mono text-slate-200">{document.issueDate || '04 Jan 2022'}</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded border border-slate-850">
                        <span className="text-[9px] text-slate-400 block">Entity Classification</span>
                        <span className="font-semibold text-indigo-300">Private Ltd Company</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>SEAL OF REGISTRAR GENERAL</span>
                    <span className="text-purple-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> EMBOSSED SEAL VERIFIED
                    </span>
                  </div>
                </div>
              )}

              {/* 6. Bank Statement */}
              {document.previewType === 'bank_statement' && (
                <div className="w-[440px] rounded-xl bg-slate-900 p-4 border-2 border-blue-500/40 shadow-2xl relative text-slate-100">
                  <div className="flex items-center justify-between pb-3 border-b border-blue-500/30">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🏦</span>
                      <div>
                        <div className="text-xs font-bold text-blue-400 uppercase">{document.issuingAuthority}</div>
                        <div className="text-[11px] text-slate-300">Official Treasury Bank Account Statement</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      6 MONTH AUDIT
                    </span>
                  </div>

                  <div className="py-3 space-y-2 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                      <span className="text-[10px] text-slate-400 block uppercase">Account Holder</span>
                      <span className="text-slate-100 font-semibold">{applicantName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-slate-950 p-2 rounded border border-slate-850">
                        <span className="text-[9px] text-slate-400 block">Account Reference</span>
                        <span className="font-mono text-cyan-400 font-bold">{document.documentNumber || 'ACC-99014'}</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded border border-slate-850">
                        <span className="text-[9px] text-slate-400 block">Turnover Velocity</span>
                        <span className="font-semibold text-emerald-400 font-mono">Healthy Surplus</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>AUDITOR VERIFIED STAMP</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> BANK SEAL CONFIRMED
                    </span>
                  </div>
                </div>
              )}

              {/* OVERLAY: Pinned Document Annotations & Highlight Boxes */}
              {docAnnotations.map((ann) => {
                const isSelected = activePinId === ann.id;
                const cfg = CATEGORY_PIN_THEME[ann.category];
                const hasBoundingBox = Boolean(ann.width && ann.height);

                return (
                  <div
                    key={ann.id}
                    style={{
                      left: `${ann.x}%`,
                      top: `${ann.y}%`,
                      width: hasBoundingBox ? `${ann.width}%` : undefined,
                      height: hasBoundingBox ? `${ann.height}%` : undefined,
                      transform: hasBoundingBox ? 'none' : 'translate(-50%, -50%)',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPin(ann.id);
                      handleTabChange('annotations');
                    }}
                    className={`absolute z-20 transition-all cursor-pointer group ${
                      hasBoundingBox
                        ? `rounded-lg border-2 ${cfg.border} ${cfg.bg} backdrop-blur-[0.5px] ${
                            isSelected 
                              ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950 shadow-xl' 
                              : 'hover:border-white'
                          }`
                        : ''
                    }`}
                  >
                    {/* Pin Badge with Number */}
                    <div 
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-slate-950 shadow-lg border-2 border-slate-900 transition-all ${
                        hasBoundingBox ? 'absolute -top-3 -left-3' : ''
                      } ${cfg.badgeBg} ${
                        isSelected ? 'scale-125 ring-2 ring-white z-30' : 'hover:scale-110 z-20'
                      }`}
                    >
                      #{ann.pinNumber}
                    </div>

                    {/* Tooltip on Hover / Focus */}
                    <div className={`absolute left-0 bottom-full mb-1.5 w-48 p-2 rounded-lg bg-slate-900/95 border border-slate-700 shadow-2xl text-[10px] pointer-events-none transition-all ${
                      isSelected 
                        ? 'opacity-100 scale-100 z-40' 
                        : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 z-30'
                    }`}>
                      <div className="flex items-center justify-between text-[9px] font-semibold mb-0.5">
                        <span className={cfg.text}>#{ann.pinNumber} {ann.targetArea}</span>
                        <span className="text-slate-400 font-mono text-[8px]">{ann.category}</span>
                      </div>
                      <p className="text-slate-200 line-clamp-2 leading-tight">"{ann.note}"</p>
                      <span className="text-[8px] text-slate-400 mt-1 block font-mono">
                        {ann.authorName} • {ann.createdAt}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Switchable between OCR Extracted Fields and Document Annotations */}
        <div className="lg:col-span-5 xl:col-span-4 bg-slate-900/90 flex flex-col justify-between border-t lg:border-t-0 border-slate-800 text-xs overflow-hidden">
          {/* Top Switcher Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/80 px-4 pt-2 text-xs font-semibold gap-3 shrink-0">
            <button
              onClick={() => handleTabChange('ocr')}
              className={`pb-2.5 px-1 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeRightTab === 'ocr'
                  ? 'border-indigo-400 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>OCR Fields</span>
            </button>
            <button
              onClick={() => handleTabChange('annotations')}
              className={`pb-2.5 px-1 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeRightTab === 'annotations'
                  ? 'border-indigo-400 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Pin className="w-3.5 h-3.5" />
              <span>Document Annotations</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300">
                {docAnnotations.length}
              </span>
            </button>
          </div>

          {/* Tab 1: Document Annotations Sidebar */}
          {activeRightTab === 'annotations' ? (
            <div className="flex-1 overflow-hidden">
              <DocumentAnnotationSidebar
                document={document}
                applicantName={applicantName}
                annotations={currentAnnotations}
                selectedPinId={activePinId}
                onSelectPin={handleSelectPin}
                onAddAnnotation={handleAddAnnotation}
                onUpdateAnnotation={handleUpdateAnnotation}
                onDeleteAnnotation={handleDeleteAnnotation}
                isPinningMode={isPinningActive}
                onTogglePinningMode={handleTogglePinning}
                pendingPinCoords={pendingCoords}
                onClearPendingPin={() => {
                  if (onClearPendingPin) onClearPendingPin();
                  else setLocalPendingPin(null);
                }}
              />
            </div>
          ) : (
            /* Tab 2: OCR Extracted Fields Sidebar */
            <div className="p-4 flex flex-col justify-between h-full overflow-y-auto space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    OCR Extracted Fields
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    100% Match
                  </span>
                </div>

                <div className="space-y-2">
                  {document.extractedFields.map((field, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{field.label}</span>
                        {field.matchStatus === 'matched' && (
                          <span className="text-emerald-400 flex items-center gap-0.5 text-[9px] font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Matched
                          </span>
                        )}
                        {field.matchStatus === 'warning' && (
                          <span className="text-amber-400 flex items-center gap-0.5 text-[9px] font-medium">
                            <AlertTriangle className="w-3 h-3" /> Review
                          </span>
                        )}
                        {field.matchStatus === 'mismatch' && (
                          <span className="text-rose-400 flex items-center gap-0.5 text-[9px] font-medium">
                            <AlertTriangle className="w-3 h-3" /> Mismatch
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-slate-100 mt-0.5 font-mono text-[11px] truncate">
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/20 text-[11px] text-indigo-300">
                  <span className="font-semibold block mb-0.5">Automated Integrity Check</span>
                  Digital signature checksum verified against government public key infrastructure (PKI). No pixel artifact tampering detected.
                </div>

                {/* Quick link to switch to Document Annotations */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-200 block">Forensic Notes & Highlights</span>
                    <span className="text-[11px] text-slate-400">
                      {docAnnotations.length} pinned observations recorded
                    </span>
                  </div>
                  <button
                    onClick={() => handleTabChange('annotations')}
                    className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Pin className="w-3 h-3" />
                    <span>Open Annotations</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Uploaded {document.uploadDate}</span>
                <button 
                  onClick={handleReset}
                  className="text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Reset View
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
