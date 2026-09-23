import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  BarChart3, 
  Layers, 
  RefreshCw,
  Info
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

interface TimePoint {
  label: string;
  fullTime: string;
  inflowUsd: number;
  outflowUsd: number;
  txCount: number;
}

// 24-Hour hourly baseline data in USD
const HOURLY_24H_DATA: TimePoint[] = [
  { label: '00:00', fullTime: '00:00 - 01:00 WAT', inflowUsd: 2840000, outflowUsd: 1420000, txCount: 24100 },
  { label: '02:00', fullTime: '02:00 - 03:00 WAT', inflowUsd: 1950000, outflowUsd: 1100000, txCount: 16800 },
  { label: '04:00', fullTime: '04:00 - 05:00 WAT', inflowUsd: 2200000, outflowUsd: 1350000, txCount: 19200 },
  { label: '06:00', fullTime: '06:00 - 07:00 WAT', inflowUsd: 4100000, outflowUsd: 2600000, txCount: 38400 },
  { label: '08:00', fullTime: '08:00 - 09:00 WAT', inflowUsd: 8900000, outflowUsd: 5200000, txCount: 78900 },
  { label: '10:00', fullTime: '10:00 - 11:00 WAT', inflowUsd: 14200000, outflowUsd: 8900000, txCount: 124500 },
  { label: '12:00', fullTime: '12:00 - 13:00 WAT', inflowUsd: 16800000, outflowUsd: 11200000, txCount: 152000 },
  { label: '14:00', fullTime: '14:00 - 15:00 WAT', inflowUsd: 15400000, outflowUsd: 9800000, txCount: 139800 },
  { label: '16:00', fullTime: '16:00 - 17:00 WAT', inflowUsd: 18200000, outflowUsd: 11900000, txCount: 164200 },
  { label: '18:00', fullTime: '18:00 - 19:00 WAT', inflowUsd: 16100000, outflowUsd: 10400000, txCount: 147500 },
  { label: '20:00', fullTime: '20:00 - 21:00 WAT', inflowUsd: 12400000, outflowUsd: 7800000, txCount: 112300 },
  { label: '22:00', fullTime: '22:00 - 23:00 WAT', inflowUsd: 6800000, outflowUsd: 4200000, txCount: 61800 },
];

// 7-Day settlement baseline in USD
const DAILY_7D_DATA: TimePoint[] = [
  { label: 'Mon', fullTime: 'Monday, Sep 16', inflowUsd: 124000000, outflowUsd: 78000000, txCount: 1084000 },
  { label: 'Tue', fullTime: 'Tuesday, Sep 17', inflowUsd: 138000000, outflowUsd: 84000000, txCount: 1210000 },
  { label: 'Wed', fullTime: 'Wednesday, Sep 18', inflowUsd: 145000000, outflowUsd: 91000000, txCount: 1290000 },
  { label: 'Thu', fullTime: 'Thursday, Sep 19', inflowUsd: 152000000, outflowUsd: 96000000, txCount: 1345000 },
  { label: 'Fri', fullTime: 'Friday, Sep 20 (Payday)', inflowUsd: 184000000, outflowUsd: 118000000, txCount: 1680000 },
  { label: 'Sat', fullTime: 'Saturday, Sep 21', inflowUsd: 132000000, outflowUsd: 81000000, txCount: 1140000 },
  { label: 'Sun', fullTime: 'Sunday, Sep 22', inflowUsd: 112000000, outflowUsd: 69000000, txCount: 980000 },
];

// 30-Day weekly aggregation
const MONTHLY_30D_DATA: TimePoint[] = [
  { label: 'Week 1', fullTime: 'Days 1 - 7', inflowUsd: 840000000, outflowUsd: 520000000, txCount: 7820000 },
  { label: 'Week 2', fullTime: 'Days 8 - 14', inflowUsd: 910000000, outflowUsd: 570000000, txCount: 8450000 },
  { label: 'Week 3', fullTime: 'Days 15 - 21', inflowUsd: 985000000, outflowUsd: 610000000, txCount: 9120000 },
  { label: 'Week 4', fullTime: 'Days 22 - 28 (Peak Salary)', inflowUsd: 1240000000, outflowUsd: 780000000, txCount: 11400000 },
  { label: 'Current', fullTime: 'Days 29 - 30', inflowUsd: 380000000, outflowUsd: 230000000, txCount: 3540000 },
];

interface FinancialTransactionChartProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export const FinancialTransactionChart: React.FC<FinancialTransactionChartProps> = ({
  title = 'Real-Time Financial Transaction & Settlement Velocity',
  subtitle = 'Live inflow, debit clearance, and net interbank liquidity across all switches',
  compact = false,
}) => {
  const { currency, formatUsd, convertUsdToCurrent, exchangeRate } = useCurrency();
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [filterMode, setFilterMode] = useState<'both' | 'inflow' | 'outflow'>('both');

  const rawData = useMemo(() => {
    switch (timeframe) {
      case '7d':
        return DAILY_7D_DATA;
      case '30d':
        return MONTHLY_30D_DATA;
      case '24h':
      default:
        return HOURLY_24H_DATA;
    }
  }, [timeframe]);

  // Aggregate stats
  const totals = useMemo(() => {
    let totalInflow = 0;
    let totalOutflow = 0;
    let totalTx = 0;
    for (const d of rawData) {
      totalInflow += d.inflowUsd;
      totalOutflow += d.outflowUsd;
      totalTx += d.txCount;
    }
    const net = totalInflow - totalOutflow;
    return { totalInflow, totalOutflow, net, totalTx };
  }, [rawData]);

  // Chart dimensions
  const svgWidth = 800;
  const svgHeight = compact ? 220 : 280;
  const padding = { top: 25, right: 25, bottom: 40, left: 65 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Maximum value for Y scaling (in current currency)
  const maxInflowCurrent = Math.max(...rawData.map((d) => convertUsdToCurrent(d.inflowUsd)));
  const maxOutflowCurrent = Math.max(...rawData.map((d) => convertUsdToCurrent(d.outflowUsd)));
  const maxY = Math.max(maxInflowCurrent, maxOutflowCurrent) * 1.15 || 1;

  // Compute point coordinates
  const points = useMemo(() => {
    return rawData.map((d, i) => {
      const x = padding.left + (i / (rawData.length - 1)) * graphWidth;
      const inflowCurrent = convertUsdToCurrent(d.inflowUsd);
      const outflowCurrent = convertUsdToCurrent(d.outflowUsd);
      const yInflow = padding.top + graphHeight - (inflowCurrent / maxY) * graphHeight;
      const yOutflow = padding.top + graphHeight - (outflowCurrent / maxY) * graphHeight;
      return {
        ...d,
        x,
        yInflow,
        yOutflow,
        inflowCurrent,
        outflowCurrent,
        netCurrent: inflowCurrent - outflowCurrent,
      };
    });
  }, [rawData, convertUsdToCurrent, maxY, graphHeight, graphWidth, padding.left, padding.top]);

  // SVG Area & Line paths
  const inflowLinePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yInflow}`).join(' ');
  const inflowAreaPath = `${inflowLinePath} L ${points[points.length - 1].x} ${padding.top + graphHeight} L ${points[0].x} ${padding.top + graphHeight} Z`;

  const outflowLinePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yOutflow}`).join(' ');
  const outflowAreaPath = `${outflowLinePath} L ${points[points.length - 1].x} ${padding.top + graphHeight} L ${points[0].x} ${padding.top + graphHeight} Z`;

  // Active hover data point
  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  // Y-axis grid ticks (4 levels)
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => ({
    valueUsd: (maxY / (currency === 'USD' ? 1 : exchangeRate)) * pct,
    y: padding.top + graphHeight - pct * graphHeight,
  }));

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>Dynamic Switch Feed</span>
            </span>

            {/* Currency Notification Indicator */}
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
              <span>Displaying in:</span>
              <strong className={currency === 'NGN' ? 'text-emerald-400' : 'text-cyan-400'}>
                {currency === 'NGN' ? '₦ NGN (Naira)' : '$ USD (Dollar)'}
              </strong>
            </span>
          </div>

          <h2 className="text-sm md:text-base font-semibold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            {title}
          </h2>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>

        {/* Right Buttons: Timeframes & Series Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Stream Filter Toggle */}
          <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFilterMode('both')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                filterMode === 'both' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setFilterMode('inflow')}
              className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
                filterMode === 'inflow' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Inflow
            </button>
            <button
              onClick={() => setFilterMode('outflow')}
              className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
                filterMode === 'outflow' ? 'bg-rose-500/20 text-rose-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              Outflow
            </button>
          </div>

          {/* Timeframe Buttons */}
          <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            {(['24h', '7d', '30d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  timeframe === tf
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf === '24h' ? '24 Hours' : tf === '7d' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Volume Metric Chips (Dynamic Conversion) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-850 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Period Inflow</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5 transition-all duration-300">
            {formatUsd(totals.totalInflow, { decimals: 2 })}
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
            <ArrowUpRight className="w-3 h-3 text-emerald-400" />
            <span>Customer deposits & credits</span>
          </div>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-850 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Period Outflow</span>
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          </div>
          <div className="text-lg font-bold text-slate-200 font-mono mt-0.5 transition-all duration-300">
            {formatUsd(totals.totalOutflow, { decimals: 2 })}
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
            <ArrowDownRight className="w-3 h-3 text-rose-400" />
            <span>Debit clearing & payouts</span>
          </div>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-850 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Net Liquidity Surplus</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5 transition-all duration-300">
            +{formatUsd(totals.net, { decimals: 2 })}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">
            +{( (totals.net / totals.totalInflow) * 100 ).toFixed(1)}% retainage ratio
          </div>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-850 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Switch Velocity</span>
            <Layers className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
            {(totals.totalTx / 1000).toFixed(1)}K txns
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-between">
            <span>FX: 1 USD = ₦{exchangeRate.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div className="relative bg-slate-950 rounded-xl border border-slate-850 p-3 overflow-hidden">
        {/* Active Point Hover Overlay Banner */}
        {activePoint && (
          <div className="mb-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{activePoint.fullTime}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 font-mono">{activePoint.txCount.toLocaleString()} switches</span>
            </div>

            <div className="flex items-center gap-3">
              {(filterMode === 'both' || filterMode === 'inflow') && (
                <span className="flex items-center gap-1 text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Inflow: {formatUsd(activePoint.inflowUsd, { decimals: 2 })}
                </span>
              )}
              {(filterMode === 'both' || filterMode === 'outflow') && (
                <span className="flex items-center gap-1 text-rose-300 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                  Outflow: {formatUsd(activePoint.outflowUsd, { decimals: 2 })}
                </span>
              )}
              <span className="text-cyan-300 font-mono font-semibold">
                Net: {formatUsd(activePoint.inflowUsd - activePoint.outflowUsd, { decimals: 2 })}
              </span>
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            {/* Emerald Gradient for Inflow */}
            <linearGradient id="chartInflowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#10b981" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            {/* Rose Gradient for Outflow */}
            <linearGradient id="chartOutflowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#f43f5e" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y-axis labels */}
          {yTicks.map((tick, idx) => (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={tick.y}
                x2={svgWidth - padding.right}
                y2={tick.y}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray={idx === 0 ? undefined : '3 3'}
              />
              <text
                x={padding.left - 10}
                y={tick.y + 4}
                fill="#64748b"
                fontSize="10"
                textAnchor="end"
                fontFamily="monospace"
              >
                {formatUsd(tick.valueUsd, { compact: true, decimals: 1 })}
              </text>
            </g>
          ))}

          {/* Inflow Area & Line */}
          {(filterMode === 'both' || filterMode === 'inflow') && (
            <g className="transition-all duration-300">
              <path d={inflowAreaPath} fill="url(#chartInflowGrad)" />
              <path
                d={inflowLinePath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* Outflow Area & Line */}
          {(filterMode === 'both' || filterMode === 'outflow') && (
            <g className="transition-all duration-300">
              <path d={outflowAreaPath} fill="url(#chartOutflowGrad)" />
              <path
                d={outflowLinePath}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 2"
              />
            </g>
          )}

          {/* X-Axis labels & interactive hover trigger bars */}
          {points.map((p, i) => (
            <g key={i}>
              <text
                x={p.x}
                y={svgHeight - padding.bottom + 18}
                fill={hoveredIndex === i ? '#38bdf8' : '#64748b'}
                fontSize="10"
                fontWeight={hoveredIndex === i ? 'bold' : 'normal'}
                textAnchor="middle"
                fontFamily="monospace"
              >
                {p.label}
              </text>

              {/* Hover vertical crosshair line */}
              {hoveredIndex === i && (
                <line
                  x1={p.x}
                  y1={padding.top}
                  x2={p.x}
                  y2={svgHeight - padding.bottom}
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  opacity="0.8"
                />
              )}

              {/* Dot markers */}
              {(filterMode === 'both' || filterMode === 'inflow') && (
                <circle
                  cx={p.x}
                  cy={p.yInflow}
                  r={hoveredIndex === i ? 5 : 3}
                  fill="#10b981"
                  stroke="#022c22"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />
              )}
              {(filterMode === 'both' || filterMode === 'outflow') && (
                <circle
                  cx={p.x}
                  cy={p.yOutflow}
                  r={hoveredIndex === i ? 4 : 2.5}
                  fill="#f43f5e"
                  stroke="#4c0519"
                  strokeWidth="1.5"
                  className="transition-all duration-150"
                />
              )}

              {/* Invisible wide mouse sensor rect */}
              <rect
                x={p.x - graphWidth / (points.length * 2)}
                y={padding.top}
                width={graphWidth / points.length}
                height={graphHeight + padding.bottom}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
              />
            </g>
          ))}
        </svg>

        {/* Legend & CBN FX footnote */}
        <div className="mt-2 pt-2 border-t border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-400 rounded-full inline-block"></span>
              <span className="text-slate-300">Inflow Rails (NIP / POS / Virtual Accounts)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-rose-400 border-dashed border-t border-rose-400 inline-block"></span>
              <span className="text-slate-300">Outflow Rails (Settlement & Transfers)</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
            <Info className="w-3 h-3 text-cyan-400" />
            <span>FX Rate: 1 USD = ₦{exchangeRate.toLocaleString()} NAFEM Official Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};
