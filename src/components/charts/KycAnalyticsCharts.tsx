import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  BarChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  TrendingUp,
  Activity,
  Server,
  ShieldCheck,
  Filter,
  BarChart3,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from 'lucide-react';
import { KycAuditLog, KycApplicant } from '../../types';

interface KycAnalyticsChartsProps {
  auditLogs: KycAuditLog[];
  kycApplicants?: KycApplicant[];
  onOpenApplicantModal?: (applicant: KycApplicant) => void;
}

type TimeframeOption = '24h' | '7d' | '30d';
type ProviderFilterOption = 'All' | 'Smile ID' | 'Prembly / Identitypass' | 'ComplyAdvantage' | 'Seamfix' | 'Dojah' | 'NIBSS Direct';
type LatencyUnitOption = 'ms' | 'sec';

interface TimeBucket {
  key: string;
  label: string;
  hour?: number;
  dateStr?: string;
  start?: string;
  end?: string;
}

// Helper to convert SLA response string to milliseconds
function parseLatencyToMs(slaString?: string): number | null {
  if (!slaString) return null;
  const str = slaString.trim().toLowerCase();
  if (str.includes('awaiting') || str.includes('in progress')) return null;

  // Match "< 1s"
  if (str.includes('< 1s')) return 800;

  // Match "680ms" or "490 ms"
  if (str.includes('ms')) {
    const val = parseFloat(str.replace(/[^0-9.]/g, ''));
    return isNaN(val) ? null : val;
  }

  // Match "1h 12m"
  if (str.includes('h')) {
    const parts = str.split('h');
    const hours = parseFloat(parts[0]) || 0;
    const mins = parseFloat(parts[1]?.replace(/[^0-9.]/g, '')) || 0;
    return (hours * 3600 + mins * 60) * 1000;
  }

  // Match "4m 18s"
  if (str.includes('m') && str.includes('s')) {
    const parts = str.split('m');
    const mins = parseFloat(parts[0]) || 0;
    const secs = parseFloat(parts[1]?.replace(/[^0-9.]/g, '')) || 0;
    return (mins * 60 + secs) * 1000;
  }

  // Match "15m sla"
  if (str.includes('m') && !str.includes('s')) {
    const mins = parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
    return mins * 60 * 1000;
  }

  // Match "2.4s" or "3s"
  if (str.includes('s')) {
    const secs = parseFloat(str.replace(/[^0-9.]/g, ''));
    return isNaN(secs) ? null : secs * 1000;
  }

  return null;
}

// Format milliseconds cleanly for display
function formatLatency(ms: number | null): string {
  if (ms === null || isNaN(ms)) return 'N/A';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const mins = Math.floor(ms / 60000);
  const secs = Math.round((ms % 60000) / 1000);
  return `${mins}m ${secs}s`;
}

export const KycAnalyticsCharts: React.FC<KycAnalyticsChartsProps> = ({
  auditLogs,
  kycApplicants = [],
  onOpenApplicantModal
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('7d');
  const [providerFilter, setProviderFilter] = useState<ProviderFilterOption>('All');
  const [latencyUnit, setLatencyUnit] = useState<LatencyUnitOption>('ms');
  const [chartViewMode, setChartViewMode] = useState<'composed' | 'stacked' | 'rateOnly'>('composed');

  // Baseline time aggregation buckets
  const timeBuckets: TimeBucket[] = useMemo(() => {
    if (timeframe === '24h') {
      return [
        { key: '00:00', label: '00:00 WAT', hour: 0, dateStr: '2026-09-23' },
        { key: '03:00', label: '03:00 WAT', hour: 3, dateStr: '2026-09-23' },
        { key: '06:00', label: '06:00 WAT', hour: 6, dateStr: '2026-09-23' },
        { key: '08:00', label: '08:00 WAT', hour: 8, dateStr: '2026-09-23' },
        { key: '09:00', label: '09:00 WAT', hour: 9, dateStr: '2026-09-23' },
        { key: '10:00', label: '10:00 WAT (Current)', hour: 10, dateStr: '2026-09-23' },
      ];
    } else if (timeframe === '7d') {
      return [
        { key: '2026-09-17', label: 'Thu, Sep 17', dateStr: '2026-09-17' },
        { key: '2026-09-18', label: 'Fri, Sep 18', dateStr: '2026-09-18' },
        { key: '2026-09-19', label: 'Sat, Sep 19', dateStr: '2026-09-19' },
        { key: '2026-09-20', label: 'Sun, Sep 20', dateStr: '2026-09-20' },
        { key: '2026-09-21', label: 'Mon, Sep 21', dateStr: '2026-09-21' },
        { key: '2026-09-22', label: 'Tue, Sep 22', dateStr: '2026-09-22' },
        { key: '2026-09-23', label: 'Wed, Sep 23 (Today)', dateStr: '2026-09-23' },
      ];
    } else {
      // 30 Days aggregated in 5-day intervals
      return [
        { key: 'Aug 25 - Aug 30', label: 'Aug 25-30', start: '2026-08-25', end: '2026-08-30' },
        { key: 'Aug 31 - Sep 04', label: 'Aug 31-Sep 04', start: '2026-08-31', end: '2026-09-04' },
        { key: 'Sep 05 - Sep 09', label: 'Sep 05-09', start: '2026-09-05', end: '2026-09-09' },
        { key: 'Sep 10 - Sep 14', label: 'Sep 10-14', start: '2026-09-10', end: '2026-09-14' },
        { key: 'Sep 15 - Sep 19', label: 'Sep 15-19', start: '2026-09-15', end: '2026-09-19' },
        { key: 'Sep 20 - Sep 23', label: 'Sep 20-23 (Current)', start: '2026-09-20', end: '2026-09-23' },
      ];
    }
  }, [timeframe]);

  // Aggregate Approval Rates & Decision Outcomes per Time Bucket
  const approvalChartData = useMemo(() => {
    return timeBuckets.map((bucket) => {
      // Find matching audit logs for this bucket
      const matchingLogs = auditLogs.filter((log) => {
        const logDate = log.timestamp.slice(0, 10);
        if (timeframe === '24h') {
          if (logDate !== '2026-09-23') return false;
          const logHour = parseInt(log.timestamp.slice(11, 13), 10);
          const h = bucket.hour ?? 0;
          if (h === 0) return logHour < 3;
          if (h === 3) return logHour >= 3 && logHour < 6;
          if (h === 6) return logHour >= 6 && logHour < 8;
          if (h === 8) return logHour >= 8 && logHour < 9;
          if (h === 9) return logHour >= 9 && logHour < 10;
          return logHour >= 10;
        } else if (timeframe === '7d') {
          return logDate === bucket.key;
        } else {
          // 30d range
          return Boolean(bucket.start && bucket.end && logDate >= bucket.start && logDate <= bucket.end);
        }
      });

      // Synthetic baseline data added to ensure realistic density across past historical dates
      let baseApproved = 0;
      let baseTemp = 0;
      let baseRejected = 0;
      let baseEscalated = 0;

      if (timeframe === '7d') {
        const seedMap: Record<string, [number, number, number, number]> = {
          '2026-09-17': [14, 2, 2, 1],
          '2026-09-18': [16, 3, 2, 1],
          '2026-09-19': [19, 4, 3, 2],
          '2026-09-20': [28, 6, 4, 2], // Sunday Payday
          '2026-09-21': [22, 5, 3, 1],
          '2026-09-22': [24, 4, 3, 2],
          '2026-09-23': [15, 3, 2, 1],
        };
        const [a, t, r, e] = seedMap[bucket.key] || [12, 2, 2, 1];
        baseApproved = a;
        baseTemp = t;
        baseRejected = r;
        baseEscalated = e;
      } else if (timeframe === '30d') {
        baseApproved = 65 + Math.floor(Math.random() * 15);
        baseTemp = 12 + Math.floor(Math.random() * 4);
        baseRejected = 9 + Math.floor(Math.random() * 3);
        baseEscalated = 4 + Math.floor(Math.random() * 2);
      } else {
        // 24h
        const hMap: Record<string, [number, number, number, number]> = {
          '00:00': [3, 1, 0, 0],
          '03:00': [4, 1, 1, 0],
          '06:00': [7, 2, 1, 0],
          '08:00': [11, 2, 1, 1],
          '09:00': [9, 1, 1, 1],
          '10:00': [6, 1, 0, 0],
        };
        const [a, t, r, e] = hMap[bucket.key] || [4, 1, 0, 0];
        baseApproved = a;
        baseTemp = t;
        baseRejected = r;
        baseEscalated = e;
      }

      // Count actual matching logs
      matchingLogs.forEach((log) => {
        if (log.actionCategory === 'Tier Upgrade Approved' || log.newStatus === 'Verified') {
          baseApproved += 1;
        } else if (log.actionCategory === 'Temporary Approval Granted' || log.newStatus === 'Temporary Approved') {
          baseTemp += 1;
        } else if (log.actionCategory === 'Application Rejected' || log.newStatus === 'Rejected') {
          baseRejected += 1;
        } else if (log.actionCategory === 'Escalated to AML' || log.newStatus === 'High-Risk Escalated') {
          baseEscalated += 1;
        }
      });

      const totalDecisions = baseApproved + baseTemp + baseRejected + baseEscalated;
      const combinedApproved = baseApproved + baseTemp;
      const approvalRate = totalDecisions > 0
        ? parseFloat(((combinedApproved / totalDecisions) * 100).toFixed(1))
        : 0;
      const strictRate = totalDecisions > 0
        ? parseFloat(((baseApproved / totalDecisions) * 100).toFixed(1))
        : 0;

      return {
        label: bucket.label,
        key: bucket.key,
        approved: baseApproved,
        temporary: baseTemp,
        rejected: baseRejected,
        escalated: baseEscalated,
        total: totalDecisions,
        approvalRate,
        strictRate,
        targetBenchmark: 85, // 85% Target regulatory standard
      };
    });
  }, [auditLogs, timeBuckets, timeframe]);

  // Aggregate Provider Latency Trends Over Time
  const providerLatencyData = useMemo(() => {
    return timeBuckets.map((bucket) => {
      // Find logs with provider outcomes in this bucket
      const matchingLogs = auditLogs.filter((log) => {
        if (!log.providerOutcome?.slaResponseTime) return false;
        const logDate = log.timestamp.slice(0, 10);
        if (timeframe === '24h') {
          if (logDate !== '2026-09-23') return false;
          const logHour = parseInt(log.timestamp.slice(11, 13), 10);
          const h = bucket.hour ?? 0;
          if (h === 0) return logHour < 3;
          if (h === 3) return logHour >= 3 && logHour < 6;
          if (h === 6) return logHour >= 6 && logHour < 8;
          if (h === 8) return logHour >= 8 && logHour < 9;
          if (h === 9) return logHour >= 9 && logHour < 10;
          return logHour >= 10;
        } else if (timeframe === '7d') {
          return logDate === bucket.key;
        } else {
          return Boolean(bucket.start && bucket.end && logDate >= bucket.start && logDate <= bucket.end);
        }
      });

      // Default baseline values by provider (in ms) to provide consistent telemetry curve
      let smileIdMs = 580;
      let premblySec = 220; // 3.6 mins
      let complyAdvantageSec = 620; // 10.3 mins
      let dojahMs = 520;
      let nibssDirectMs = 460;
      let seamfixMin = 54; // 54 mins

      // Adjust based on real logs
      matchingLogs.forEach((log) => {
        const p = log.providerOutcome?.provider;
        const latMs = parseLatencyToMs(log.providerOutcome?.slaResponseTime);
        if (latMs !== null) {
          if (p === 'Smile ID') smileIdMs = Math.round((smileIdMs + latMs) / 2);
          if (p === 'Dojah') dojahMs = Math.round((dojahMs + latMs) / 2);
          if (p === 'NIBSS Direct') nibssDirectMs = Math.round((nibssDirectMs + latMs) / 2);
          if (p === 'Prembly / Identitypass') premblySec = Math.round(((premblySec * 1000 + latMs) / 2) / 1000);
          if (p === 'ComplyAdvantage') complyAdvantageSec = Math.round(((complyAdvantageSec * 1000 + latMs) / 2) / 1000);
          if (p === 'Seamfix') seamfixMin = Math.round(((seamfixMin * 60000 + latMs) / 2) / 60000);
        }
      });

      // Unit conversions
      const isSec = latencyUnit === 'sec';
      return {
        label: bucket.label,
        key: bucket.key,
        // Sub-second API providers (displayed in ms or sec)
        smileId: isSec ? parseFloat((smileIdMs / 1000).toFixed(2)) : smileIdMs,
        dojah: isSec ? parseFloat((dojahMs / 1000).toFixed(2)) : dojahMs,
        nibss: isSec ? parseFloat((nibssDirectMs / 1000).toFixed(2)) : nibssDirectMs,
        // Asynchronous / Heavy Check providers
        prembly: isSec ? premblySec : premblySec * 1000,
        complyAdvantage: isSec ? complyAdvantageSec : complyAdvantageSec * 1000,
        seamfixMinutes: seamfixMin,
        instantSlaThreshold: isSec ? 1.0 : 1000, // 1000ms sub-second SLA threshold
      };
    });
  }, [auditLogs, timeBuckets, timeframe, latencyUnit]);

  // Provider Comparison Matrix / Performance Table Data
  const providerStats = useMemo(() => {
    const providers: {
      name: string;
      category: string;
      priority: string;
      avgLatencyMs: number;
      targetSlaMs: number;
      successRate: number;
      volumeCount: number;
      activeStatus: 'Optimal' | 'Stable' | 'Investigating';
    }[] = [
      {
        name: 'Smile ID',
        category: 'Biometric 3D Liveness & Document OCR',
        priority: 'Instant Sub-second',
        avgLatencyMs: 585,
        targetSlaMs: 1000,
        successRate: 99.8,
        volumeCount: 42,
        activeStatus: 'Optimal',
      },
      {
        name: 'NIBSS Direct',
        category: 'NIBSS Central Switch BVN/NIN Auth',
        priority: 'Instant Sub-second',
        avgLatencyMs: 445,
        targetSlaMs: 800,
        successRate: 99.4,
        volumeCount: 38,
        activeStatus: 'Optimal',
      },
      {
        name: 'Dojah',
        category: "Government ID & Driver's License OCR",
        priority: 'Instant Sub-second',
        avgLatencyMs: 530,
        targetSlaMs: 1000,
        successRate: 98.7,
        volumeCount: 29,
        activeStatus: 'Optimal',
      },
      {
        name: 'Prembly / Identitypass',
        category: 'CAC Corporate Registry & Tax Clearance',
        priority: 'Urgent (15 mins)',
        avgLatencyMs: 235000, // ~3.9 mins
        targetSlaMs: 900000, // 15 mins
        successRate: 99.1,
        volumeCount: 19,
        activeStatus: 'Stable',
      },
      {
        name: 'ComplyAdvantage',
        category: 'Sanctions, PEP & Adverse Media Deep Scan',
        priority: 'Urgent (15 mins)',
        avgLatencyMs: 640000, // ~10.6 mins
        targetSlaMs: 900000, // 15 mins
        successRate: 96.5,
        volumeCount: 14,
        activeStatus: 'Stable',
      },
      {
        name: 'Seamfix',
        category: 'Physical Geotagged Address Inspection',
        priority: 'Standard Field (1-2 hrs)',
        avgLatencyMs: 3840000, // ~64 mins
        targetSlaMs: 7200000, // 120 mins
        successRate: 94.2,
        volumeCount: 8,
        activeStatus: 'Stable',
      },
    ];

    // Recalculate based on real audit log occurrences
    auditLogs.forEach((log) => {
      const p = log.providerOutcome?.provider;
      if (!p) return;
      const stat = providers.find((item) => item.name === p || (p.includes('Prembly') && item.name.includes('Prembly')));
      if (stat) {
        stat.volumeCount += 1;
        const ms = parseLatencyToMs(log.providerOutcome?.slaResponseTime);
        if (ms !== null) {
          stat.avgLatencyMs = Math.round((stat.avgLatencyMs * 4 + ms) / 5);
        }
      }
    });

    if (providerFilter === 'All') return providers;
    return providers.filter((p) => p.name === providerFilter || p.name.includes(providerFilter));
  }, [auditLogs, providerFilter]);

  // High-Level Executive KPI summary cards
  const summaryKpis = useMemo(() => {
    let totalDecided = 0;
    let totalApproved = 0;
    let totalTemp = 0;
    let totalRejected = 0;
    let totalEscalated = 0;

    approvalChartData.forEach((d) => {
      totalDecided += d.total;
      totalApproved += d.approved;
      totalTemp += d.temporary;
      totalRejected += d.rejected;
      totalEscalated += d.escalated;
    });

    const combinedRate = totalDecided > 0
      ? ((totalApproved + totalTemp) / totalDecided) * 100
      : 84.5;
    const strictRate = totalDecided > 0
      ? (totalApproved / totalDecided) * 100
      : 72.8;

    // Fastest sub-second provider
    const instantProviders = providerStats.filter((p) => p.avgLatencyMs < 2000);
    const fastest = instantProviders.sort((a, b) => a.avgLatencyMs - b.avgLatencyMs)[0] || {
      name: 'NIBSS Direct',
      avgLatencyMs: 445,
    };

    // Sub-second P95 calculation
    const p95Latency = Math.round(fastest.avgLatencyMs * 1.35);

    return {
      overallApprovalRate: combinedRate.toFixed(1),
      strictApprovalRate: strictRate.toFixed(1),
      temporaryProvisionalRate: totalDecided > 0 ? ((totalTemp / totalDecided) * 100).toFixed(1) : '11.7',
      totalDecisionsRecorded: totalDecided,
      fastestProvider: fastest.name,
      fastestLatency: `${fastest.avgLatencyMs}ms`,
      p95Latency: `${p95Latency}ms`,
      slaComplianceRate: '98.6%',
    };
  }, [approvalChartData, providerStats]);

  return (
    <div className="space-y-6">
      {/* SECTION HEADER WITH CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              Compliance Telemetry & Verification Analytics
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-[11px] text-slate-400 font-mono">
              Live Audit Log Pipeline ({auditLogs.length} Events Logged)
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            KYC Approval Rates & External Provider Latency Trends
          </h2>
          <p className="text-xs text-slate-400">
            Real-time visual monitoring of identity verification conversion rates, provisional clearances, and external biometric / KYB partner latency against Central Bank SLAs.
          </p>
        </div>

        {/* Timeframe & Provider Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setTimeframe('24h')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                timeframe === '24h'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              24 Hours
            </button>
            <button
              onClick={() => setTimeframe('7d')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                timeframe === '7d'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeframe('30d')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                timeframe === '30d'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              30 Days
            </button>
          </div>

          {/* Provider Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value as any)}
              className="bg-transparent text-slate-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-slate-200">All Providers</option>
              <option value="Smile ID" className="bg-slate-900 text-slate-200">Smile ID (Biometrics)</option>
              <option value="NIBSS Direct" className="bg-slate-900 text-slate-200">NIBSS Direct (BVN/NIN)</option>
              <option value="Dojah" className="bg-slate-900 text-slate-200">Dojah (FRSC / NIN)</option>
              <option value="Prembly / Identitypass" className="bg-slate-900 text-slate-200">Prembly (CAC Registry)</option>
              <option value="ComplyAdvantage" className="bg-slate-900 text-slate-200">ComplyAdvantage (PEP/Sanctions)</option>
              <option value="Seamfix" className="bg-slate-900 text-slate-200">Seamfix (Address Field)</option>
            </select>
          </div>
        </div>
      </div>

      {/* EXECUTIVE KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Metric 1: Combined Approval Rate */}
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Overall Approval Rate</span>
            <span className="text-emerald-400 font-mono text-[10px]">Target ≥ 85%</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono">
              {summaryKpis.overallApprovalRate}%
            </span>
            <span className="text-[10px] text-slate-500 font-medium">combined</span>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Strict Full Tier: <strong className="text-slate-200">{summaryKpis.strictApprovalRate}%</strong></span>
          </div>
        </div>

        {/* Metric 2: Provisional Approvals */}
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Provisional / Temp Rate</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400 font-mono">
              {summaryKpis.temporaryProvisionalRate}%
            </span>
            <span className="text-[10px] text-slate-500 font-medium">capped</span>
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            Pending on-site / 14-30d terms
          </div>
        </div>

        {/* Metric 3: Fastest Sub-Second Provider */}
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Fastest Biometric Partner</span>
            <Zap className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-sky-400 font-mono">
              {summaryKpis.fastestLatency}
            </span>
          </div>
          <div className="text-[10px] text-slate-300 font-medium truncate">
            {summaryKpis.fastestProvider}
          </div>
        </div>

        {/* Metric 4: P95 Instant Biometric Latency */}
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Instant API P95 Latency</span>
            <span className="text-slate-500 text-[10px]">&lt; 1,000ms SLA</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-indigo-300 font-mono">
              {summaryKpis.p95Latency}
            </span>
          </div>
          <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Under Central Bank 1.0s Cap</span>
          </div>
        </div>

        {/* Metric 5: SLA Compliance */}
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1 col-span-2 sm:col-span-4 lg:col-span-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Partner SLA Compliance</span>
            <Server className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-100 font-mono">
              {summaryKpis.slaComplianceRate}
            </span>
            <span className="text-[10px] text-emerald-400">99.2% Uptime</span>
          </div>
          <div className="text-[10px] text-slate-400">
            {summaryKpis.totalDecisionsRecorded} decisions audited
          </div>
        </div>
      </div>

      {/* CHART 1: KYC APPROVAL RATES & DECISION DISTRIBUTION OVER TIME */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-slate-100">
                KYC Approval Rates & Decision Outcomes Over Time
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracking converted tier upgrades, provisional approvals, rejections, and AML escalations against the 85% compliance threshold.
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setChartViewMode('composed')}
              className={`px-2.5 py-1 rounded transition-colors ${
                chartViewMode === 'composed'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rate & Volume
            </button>
            <button
              onClick={() => setChartViewMode('stacked')}
              className={`px-2.5 py-1 rounded transition-colors ${
                chartViewMode === 'stacked'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Stacked Volume
            </button>
            <button
              onClick={() => setChartViewMode('rateOnly')}
              className={`px-2.5 py-1 rounded transition-colors ${
                chartViewMode === 'rateOnly'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Approval % Only
            </button>
          </div>
        </div>

        {/* Recharts Composed Container */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={approvalChartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} opacity={0.4} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: '#475569' }}
                tickLine={{ stroke: '#475569' }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: '#475569' }}
                tickLine={{ stroke: '#475569' }}
                allowDecimals={false}
                label={chartViewMode !== 'rateOnly' ? { value: 'Decisions', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 } : undefined}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tick={{ fill: '#34d399', fontSize: 11 }}
                axisLine={{ stroke: '#059669' }}
                tickLine={{ stroke: '#059669' }}
                tickFormatter={(val) => `${val}%`}
              />

              {/* Tooltip */}
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-950/95 border border-slate-700 rounded-xl p-3 shadow-2xl text-xs space-y-2 backdrop-blur-md min-w-[220px]">
                      <div className="font-bold text-slate-100 border-b border-slate-800 pb-1.5 flex items-center justify-between">
                        <span>{label}</span>
                        <span className="font-mono text-emerald-400 font-bold">{data.approvalRate}% Approval</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-emerald-400">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Approved (Full Tier)
                          </span>
                          <span className="font-mono font-bold">{data.approved}</span>
                        </div>
                        <div className="flex items-center justify-between text-amber-300">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                            Temporary Approved
                          </span>
                          <span className="font-mono font-bold">{data.temporary}</span>
                        </div>
                        <div className="flex items-center justify-between text-rose-400">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            Rejected
                          </span>
                          <span className="font-mono font-bold">{data.rejected}</span>
                        </div>
                        <div className="flex items-center justify-between text-purple-400">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            AML Escalated
                          </span>
                          <span className="font-mono font-bold">{data.escalated}</span>
                        </div>
                        <div className="border-t border-slate-800 pt-1 flex items-center justify-between text-slate-400 font-medium">
                          <span>Total Decisions:</span>
                          <span className="font-mono text-slate-200 font-bold">{data.total}</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />

              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 10, fontSize: 11 }}
              />

              {/* Reference line for 85% Target Regulatory Approval Benchmark */}
              <ReferenceLine
                yAxisId="right"
                y={85}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: '85% Regulatory Benchmark',
                  fill: '#10b981',
                  position: 'insideTopRight',
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />

              {/* Chart Series depending on viewMode */}
              {chartViewMode !== 'rateOnly' && (
                <>
                  <Bar
                    yAxisId="left"
                    dataKey="approved"
                    name="Approved (Tier Cleared)"
                    fill="#10b981"
                    stackId={chartViewMode === 'stacked' ? 'decisions' : undefined}
                    radius={chartViewMode === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="temporary"
                    name="Temporary Approved (Provisional)"
                    fill="#f59e0b"
                    stackId={chartViewMode === 'stacked' ? 'decisions' : undefined}
                    radius={chartViewMode === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="rejected"
                    name="Rejected"
                    fill="#f43f5e"
                    stackId={chartViewMode === 'stacked' ? 'decisions' : undefined}
                    radius={chartViewMode === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="escalated"
                    name="AML Escalated"
                    fill="#a855f7"
                    stackId={chartViewMode === 'stacked' ? 'decisions' : undefined}
                    radius={chartViewMode === 'stacked' ? [4, 4, 0, 0] : [4, 4, 0, 0]}
                  />
                </>
              )}

              {/* Approval Rate Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="approvalRate"
                name="Approval Rate %"
                stroke="#34d399"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10b981', stroke: '#064e3b', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#34d399', stroke: '#ffffff', strokeWidth: 2 }}
              />

              {chartViewMode === 'rateOnly' && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="strictRate"
                  name="Strict Approved % (No Temp)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#38bdf8' }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 2: PROVIDER LATENCY TRENDS OVER TIME */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-semibold text-slate-100">
                External Identity Provider Latency Trends
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous monitoring of webhook response times across biometric, CAC, and sanctions gateways.
            </p>
          </div>

          {/* Unit Toggle: Milliseconds vs Seconds */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Display Scale:</span>
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setLatencyUnit('ms')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  latencyUnit === 'ms'
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Instant APIs (ms)
              </button>
              <button
                onClick={() => setLatencyUnit('sec')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  latencyUnit === 'sec'
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Providers (sec)
              </button>
            </div>
          </div>
        </div>

        {/* Latency LineChart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={providerLatencyData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} opacity={0.4} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: '#475569' }}
                tickLine={{ stroke: '#475569' }}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: '#475569' }}
                tickLine={{ stroke: '#475569' }}
                tickFormatter={(val) => (latencyUnit === 'ms' ? `${val}ms` : `${val}s`)}
                label={{
                  value: latencyUnit === 'ms' ? 'Latency (ms)' : 'Latency (seconds)',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#64748b',
                  fontSize: 10,
                }}
              />

              {/* Tooltip */}
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;
                  return (
                    <div className="bg-slate-950/95 border border-slate-700 rounded-xl p-3 shadow-2xl text-xs space-y-2 backdrop-blur-md min-w-[230px]">
                      <div className="font-bold text-slate-100 border-b border-slate-800 pb-1.5 flex items-center justify-between">
                        <span>{label}</span>
                        <span className="text-[11px] text-slate-400">Response Latencies</span>
                      </div>
                      <div className="space-y-1 font-mono">
                        {payload.map((entry: any) => (
                          <div key={entry.name} className="flex items-center justify-between" style={{ color: entry.color }}>
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                              {entry.name}
                            </span>
                            <span className="font-bold">
                              {latencyUnit === 'ms' ? `${entry.value}ms` : `${entry.value}s`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }}
              />

              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 10, fontSize: 11 }}
              />

              {/* SLA Target Reference Line for Instant Biometrics */}
              {latencyUnit === 'ms' && (
                <ReferenceLine
                  y={1000}
                  stroke="#38bdf8"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: '1,000ms SLA Target',
                    fill: '#38bdf8',
                    position: 'insideTopRight',
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
              )}

              {/* Lines for Providers */}
              {(providerFilter === 'All' || providerFilter === 'Smile ID') && (
                <Line
                  type="monotone"
                  dataKey="smileId"
                  name="Smile ID (Biometric)"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#0284c7' }}
                  activeDot={{ r: 6 }}
                />
              )}

              {(providerFilter === 'All' || providerFilter === 'NIBSS Direct') && (
                <Line
                  type="monotone"
                  dataKey="nibss"
                  name="NIBSS Direct (BVN/NIN)"
                  stroke="#34d399"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#059669' }}
                  activeDot={{ r: 6 }}
                />
              )}

              {(providerFilter === 'All' || providerFilter === 'Dojah') && (
                <Line
                  type="monotone"
                  dataKey="dojah"
                  name="Dojah (FRSC / NIN)"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#d97706' }}
                />
              )}

              {latencyUnit === 'sec' && (providerFilter === 'All' || providerFilter.includes('Prembly')) && (
                <Line
                  type="monotone"
                  dataKey="prembly"
                  name="Prembly (CAC Registry)"
                  stroke="#818cf8"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#4f46e5' }}
                />
              )}

              {latencyUnit === 'sec' && (providerFilter === 'All' || providerFilter === 'ComplyAdvantage') && (
                <Line
                  type="monotone"
                  dataKey="complyAdvantage"
                  name="ComplyAdvantage (PEP Scan)"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#e11d48' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 3: PROVIDER PERFORMANCE SCORECARD & SLA MATRIX */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Statutory Verification Partner SLA Scorecard
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated latency, uptime, and callback reliability for CBN Compliance Audit filings.
            </p>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Evaluated against CBN BSD/DIR/GEN/LAB/14/083
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-medium">Provider & Endpoint</th>
                <th className="pb-3 font-medium">Verification Scope</th>
                <th className="pb-3 font-medium">Priority Tier</th>
                <th className="pb-3 font-medium">Average Latency</th>
                <th className="pb-3 font-medium">SLA Limit</th>
                <th className="pb-3 font-medium">Success Rate</th>
                <th className="pb-3 font-medium">Audit Sample</th>
                <th className="pb-3 font-medium text-right">Gateway Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {providerStats.map((p) => {
                const isUnderSla = p.avgLatencyMs <= p.targetSlaMs;
                return (
                  <tr key={p.name} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3">
                      <div className="font-semibold text-slate-200">{p.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">https://api.{p.name.toLowerCase().replace(/[^a-z]/g, '')}.com</div>
                    </td>
                    <td className="py-3 text-slate-300">{p.category}</td>
                    <td className="py-3">
                      <span className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded text-[11px] font-mono">
                        {p.priority}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold">
                      <span className={isUnderSla ? 'text-emerald-400' : 'text-rose-400'}>
                        {formatLatency(p.avgLatencyMs)}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-slate-400">
                      {formatLatency(p.targetSlaMs)}
                    </td>
                    <td className="py-3 font-mono text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <span>{p.successRate}%</span>
                        <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${p.successRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-slate-400">
                      {p.volumeCount} requests
                    </td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {p.activeStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
