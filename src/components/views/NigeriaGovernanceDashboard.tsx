import { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Users, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  Phone, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Check, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle,
  Smartphone,
  Landmark,
  Layers,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { 
  NATIONAL_FINTECH_METRICS, 
  NIGERIAN_ZONES, 
  NIGERIAN_STATES, 
  NIGERIAN_LGAS 
} from '../../data/mockFintechData';
import { NigerianZone, NigerianStateData, NigerianLgaData, TerritorialLevel } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';

interface NigeriaGovernanceDashboardProps {
  initialLevel?: TerritorialLevel;
  onOpenReportExport?: () => void;
  onNavigateToMakerChecker?: () => void;
}

export const NigeriaGovernanceDashboard = ({
  initialLevel = 'national',
  onOpenReportExport,
  onNavigateToMakerChecker,
}: NigeriaGovernanceDashboardProps) => {
  const { formatNgn, currency } = useCurrency();
  const [activeLevel, setActiveLevel] = useState<TerritorialLevel>(initialLevel);
  const [selectedZone, setSelectedZone] = useState<NigerianZone>(NIGERIAN_ZONES[0]);
  const [selectedState, setSelectedState] = useState<NigerianStateData>(NIGERIAN_STATES[0]);
  const [lgaSearchQuery, setLgaSearchQuery] = useState('');
  const [lgaStateFilter, setLgaStateFilter] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const nat = NATIONAL_FINTECH_METRICS;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered LGAs
  const filteredLgas = NIGERIAN_LGAS.filter((lga) => {
    const matchesSearch = 
      lga.lgaName.toLowerCase().includes(lgaSearchQuery.toLowerCase()) ||
      lga.clusterOfficer.toLowerCase().includes(lgaSearchQuery.toLowerCase()) ||
      lga.stateName.toLowerCase().includes(lgaSearchQuery.toLowerCase());
    const matchesState = lgaStateFilter === 'All' || lga.stateName === lgaStateFilter;
    return matchesSearch && matchesState;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 shadow-2xl flex items-center gap-3 text-xs animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1.5">
              <span>🇳🇬</span> Nigeria Fintech & Territorial Command
            </span>
            <span className="text-xs text-slate-400 font-mono">SANEF • NIBSS Direct Switch • CBN Tier-1</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            National, Regional, State & Local Government (LGA) Hierarchy
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Centralized governance of Nigeria's 6 Geopolitical Zones, 36 States + FCT Abuja, and 774 Local Government Areas according to CBN Agency Banking & SANEF regulations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>CBN Licensed MMO (Tier 1)</span>
          </div>
          {onOpenReportExport && (
            <button
              onClick={onOpenReportExport}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-medium border border-emerald-500/30 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export SANEF Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Territorial Level Selector Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-medium gap-2">
        <button
          onClick={() => setActiveLevel('national')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeLevel === 'national'
              ? 'border-emerald-400 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>1. National Federal Command (Nigeria)</span>
        </button>

        <button
          onClick={() => setActiveLevel('regional')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeLevel === 'regional'
              ? 'border-emerald-400 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>2. Regional / 6 Geopolitical Zones ({NIGERIAN_ZONES.length})</span>
        </button>

        <button
          onClick={() => setActiveLevel('state')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeLevel === 'state'
              ? 'border-emerald-400 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>3. State Operations (36 States + FCT)</span>
        </button>

        <button
          onClick={() => setActiveLevel('lga')}
          className={`pb-3 px-3 transition-colors flex items-center gap-2 border-b-2 ${
            activeLevel === 'lga'
              ? 'border-emerald-400 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>4. Local Government Areas (774 LGAs & CICO)</span>
        </button>
      </div>

      {/* LEVEL 1: NATIONAL FEDERAL COMMAND */}
      {activeLevel === 'national' && (
        <div className="space-y-6">
          {/* National KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Total Agency Network</span>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                {nat.totalAgencyLocations.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">Across 36 States + FCT</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Active POS Terminals</span>
              <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
                {nat.totalPosTerminals.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">Android & Linux Terminals</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">SANEF Verified Agents</span>
              <div className="text-lg font-bold font-mono text-indigo-400 mt-0.5">
                {nat.activeSanefAgents.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">NIBSS BVN/NIN Linked</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Daily CICO Volume</span>
              <div className="text-lg font-bold font-mono text-amber-400 mt-0.5 transition-all duration-300">
                {formatNgn(nat.cicoDailyVolumeNgn, { decimals: 2 })}
              </div>
              <span className="text-[10px] text-slate-500">Cash-In / Cash-Out</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">National Float Reserve</span>
              <div className="text-lg font-bold font-mono text-emerald-300 mt-0.5 transition-all duration-300">
                {formatNgn(nat.nationalFloatReserveNgn, { decimals: 1 })}
              </div>
              <span className="text-[10px] text-slate-500">Commercial Bank Backed ({currency})</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">LGA Inclusion Rate</span>
              <div className="text-lg font-bold font-mono text-purple-400 mt-0.5">
                {nat.financialInclusionRuralPct}%
              </div>
              <span className="text-[10px] text-slate-500">684 / 774 LGAs active</span>
            </div>
          </div>

          {/* Federal Switch & Regulatory Architecture */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* National Operations Director Roster */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-200">Federal Leadership & Regulators</span>
                <span className="text-[10px] text-emerald-400 font-mono">HQ Abuja & Lagos</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                      ASB
                    </div>
                    <div>
                      <span className="font-semibold text-white block">Dr. Aminu Sanusi Bello</span>
                      <span className="text-[11px] text-slate-400 block">National Director of Agency Operations</span>
                      <span className="text-[10px] text-emerald-400 font-mono">SANEF & NIBSS Switch Coordinator</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-medium">NIBSS NIP Direct Switch</span>
                    <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      14ms Latency (Online)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">Direct ISO 8583 switch with Zenith, Access & 9PSB.</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-medium">SANEF Agent Registration Portal</span>
                    <span className="text-indigo-400 font-mono font-bold">Connected</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">Instant BVN / NIN KYC validation for new grassroots kiosk agents.</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => showToast('Federal Liquidity Reconciliation initiated with NIBSS')}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Synchronize National Switch & Reserves
                </button>
              </div>
            </div>

            {/* Geopolitical Zones Overview Table */}
            <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-slate-200">The 6 Geopolitical Zones of Nigeria</span>
                  <span className="text-[11px] text-slate-400 block">Performance & Zonal Liquidity Ranking</span>
                </div>
                <button
                  onClick={() => setActiveLevel('regional')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <span>Drill down to zones</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-2 font-medium">Rank</th>
                      <th className="pb-2 font-medium">Zone Name</th>
                      <th className="pb-2 font-medium">Zonal Director</th>
                      <th className="pb-2 font-medium">Agents</th>
                      <th className="pb-2 font-medium">Monthly NGN Volume</th>
                      <th className="pb-2 font-medium">Float Status</th>
                      <th className="pb-2 font-medium text-right">Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {NIGERIAN_ZONES.map((zone) => (
                      <tr 
                        key={zone.id} 
                        className="hover:bg-slate-800/40 cursor-pointer"
                        onClick={() => {
                          setSelectedZone(zone);
                          setActiveLevel('regional');
                        }}
                      >
                        <td className="py-2.5 font-bold font-mono text-slate-400">#{zone.ranking}</td>
                        <td className="py-2.5 font-semibold text-slate-200">{zone.name}</td>
                        <td className="py-2.5 text-slate-400">{zone.zonalDirector}</td>
                        <td className="py-2.5 font-mono text-cyan-400">{zone.activeAgentsCount.toLocaleString()}</td>
                        <td className="py-2.5 font-mono text-emerald-400 font-bold transition-all duration-300">
                          {formatNgn(zone.monthlyVolumeNgn, { decimals: 1 })}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              zone.cicoBalanceStatus === 'Surplus'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : zone.cicoBalanceStatus === 'Balanced'
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {zone.cicoBalanceStatus}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-mono text-emerald-400 font-semibold">
                          {zone.targetAchievementRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 2: REGIONAL / 6 GEOPOLITICAL ZONES */}
      {activeLevel === 'regional' && (
        <div className="space-y-6">
          {/* Zone Selector Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {NIGERIAN_ZONES.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedZone.id === zone.id
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200 shadow-lg shadow-emerald-950/40'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-emerald-400">{zone.code} Zone</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                    Rank #{zone.ranking}
                  </span>
                </div>
                <div className="font-semibold text-xs text-white truncate">{zone.name.split(' ')[0]} {zone.name.split(' ')[1]}</div>
                <div className="text-[10px] text-slate-400 mt-1 transition-all duration-300">{formatNgn(zone.monthlyVolumeNgn, { decimals: 1 })} / mo</div>
              </button>
            ))}
          </div>

          {/* Selected Zone Deep Dive */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Zone Identity & Director Card */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold">
                    {selectedZone.code} Zonal Directorate
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{selectedZone.name}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-xs font-mono font-bold text-emerald-400">
                  #{selectedZone.ranking} in Nigeria
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-850 space-y-2 text-xs">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Zonal Director on Duty
                </span>
                <div className="font-bold text-white text-sm">{selectedZone.zonalDirector}</div>
                <div className="text-slate-400">{selectedZone.directorEmail}</div>
                <div className="text-emerald-400 font-mono">{selectedZone.directorPhone}</div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Headquarters: <span className="text-slate-300">{selectedZone.headquartersCity}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  Federation States Covered ({selectedZone.statesCovered.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedZone.statesCovered.map((st) => (
                    <span 
                      key={st}
                      className="px-2 py-1 rounded bg-slate-800 text-slate-200 text-xs border border-slate-700"
                    >
                      {st} State
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    const firstState = NIGERIAN_STATES.find((s) => s.zoneCode === selectedZone.code) || NIGERIAN_STATES[0];
                    setSelectedState(firstState);
                    setActiveLevel('state');
                  }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  View States in {selectedZone.name}
                </button>
              </div>
            </div>

            {/* Zone Operational Telemetry */}
            <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-xs font-semibold text-slate-200">
                  {selectedZone.name} Agency & Cash Float Telemetry
                </h3>
                <span className="text-xs text-slate-400 font-mono">CBN Liquidity Standard</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                  <span className="text-slate-400 block text-[11px]">Active Agents</span>
                  <div className="text-base font-bold font-mono text-cyan-400 mt-1">
                    {selectedZone.activeAgentsCount.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500">SANEF Registered</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                  <span className="text-slate-400 block text-[11px]">Active POS Terminals</span>
                  <div className="text-base font-bold font-mono text-indigo-400 mt-1">
                    {selectedZone.activePosTerminals.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500">Android/Linux Fleet</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                  <span className="text-slate-400 block text-[11px]">Daily Transaction Value</span>
                  <div className="text-base font-bold font-mono text-emerald-400 mt-1 transition-all duration-300">
                    {formatNgn(selectedZone.dailyTransactionValueNgn, { decimals: 0 })}
                  </div>
                  <span className="text-[10px] text-slate-500">24-hour CICO flow</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                  <span className="text-slate-400 block text-[11px]">Zonal Liquidity Float</span>
                  <div className="text-base font-bold font-mono text-amber-400 mt-1 transition-all duration-300">
                    {formatNgn(selectedZone.liquidityFloatNgn, { decimals: 2 })}
                  </div>
                  <span className="text-[10px] text-slate-500">{selectedZone.cicoBalanceStatus}</span>
                </div>
              </div>

              {/* Progress & Target attainment */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">
                    Quarterly Target Attainment vs. Central Bank Inclusion Mandate
                  </span>
                  <span className="font-mono font-bold text-emerald-400">{selectedZone.targetAchievementRate}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(selectedZone.targetAchievementRate, 100)}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Year-Over-Year Growth: +{selectedZone.growthRate}%</span>
                  <span>Clearing Speed: Instant NIP Inter-Bank Netting</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  Direct liaison available for regional cash shortage or POS restock orders.
                </span>
                <button
                  onClick={() => showToast(`Emergency Liquidity Buffer dispatched to ${selectedZone.name}`)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-md"
                >
                  Replenish Zonal Float
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 3: STATE OPERATIONS */}
      {activeLevel === 'state' && (
        <div className="space-y-6">
          {/* State Selector grid */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-200">Select Nigerian Federation State</span>
              <span className="text-[11px] text-emerald-400 font-mono">36 States + FCT Abuja</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {NIGERIAN_STATES.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedState(st)}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    selectedState.id === st.id
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-bold shadow'
                      : 'bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs truncate">{st.stateName.replace(' State', '')}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{st.zoneCode} Zone</div>
                </button>
              ))}
            </div>
          </div>

          {/* State Specific Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* State Leadership & Tax Collection Card */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold">
                    {selectedState.zoneCode} Zone • {selectedState.totalLgas} LGAs
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedState.stateName}</h3>
                </div>
                <span className="text-xs font-mono text-slate-400">Capital: {selectedState.capitalCity}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-850 space-y-2 text-xs">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                  State Operations Coordinator
                </span>
                <div className="font-bold text-white text-sm">{selectedState.stateManager}</div>
                <div className="text-emerald-400 font-mono">{selectedState.contactPhone}</div>
                <div className="text-slate-400 pt-1">
                  CBN SANEF Compliance Score: <strong className="text-emerald-300">{selectedState.cbnSanefComplianceScore}/100</strong>
                </div>
              </div>

              {/* State BIR / Tax Remittance Integration */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-850 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">State Internal Revenue Service (BIRS)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    ACTIVE AUTO-REMIT
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Direct electronic tax & market levy collection integration with the State Ministry of Finance.
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  Top Commercial LGAs in {selectedState.stateName}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedState.topLgas.map((lga) => (
                    <span 
                      key={lga}
                      className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-700"
                    >
                      {lga}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* State Financial Flow & Terminal Fleet */}
            <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-xs font-semibold text-slate-200">
                  {selectedState.stateName} Terminal Inventory & Volume
                </h3>
                <span className="text-xs text-slate-400 font-mono">CICO Float Ratio: {selectedState.cashInCashOutRatio}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                  <span className="text-slate-400 block text-[11px]">Registered Agents</span>
                  <div className="text-base font-bold font-mono text-cyan-400 mt-1">
                    {selectedState.registeredAgents.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500">Across {selectedState.totalLgas} LGAs</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                  <span className="text-slate-400 block text-[11px]">Active POS Terminals</span>
                  <div className="text-base font-bold font-mono text-indigo-400 mt-1">
                    {selectedState.activeTerminals.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500">Online & Acquiring</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                  <span className="text-slate-400 block text-[11px]">Daily State Volume</span>
                  <div className="text-base font-bold font-mono text-emerald-400 mt-1 transition-all duration-300">
                    {formatNgn(selectedState.dailyVolumeNgn, { decimals: 0 })}
                  </div>
                  <span className="text-[10px] text-slate-500">24h Net Inflow</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                  <span className="text-slate-400 block text-[11px]">Monthly Clearing</span>
                  <div className="text-base font-bold font-mono text-amber-400 mt-1 transition-all duration-300">
                    {formatNgn(selectedState.monthlyVolumeNgn, { decimals: 2 })}
                  </div>
                  <span className="text-[10px] text-slate-500">NIP Settlement</span>
                </div>
              </div>

              {/* State Terminal Logistics Action */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-semibold text-white block">Dispatch POS Terminals & Float Buffer</span>
                  <span className="text-[11px] text-slate-400">
                    Order 250 Android POS devices to {selectedState.stateName} main logistics warehouse in {selectedState.capitalCity}.
                  </span>
                </div>
                <button
                  onClick={() => showToast(`250 POS terminals requisitioned for ${selectedState.stateName}`)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shrink-0 transition-colors"
                >
                  Authorize Batch Dispatch
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setLgaStateFilter(selectedState.stateName);
                    setActiveLevel('lga');
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                >
                  <span>Explore all LGAs in {selectedState.stateName}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 4: LOCAL GOVERNMENT AREAS (774 LGAs) */}
      {activeLevel === 'lga' && (
        <div className="space-y-6">
          {/* LGA Search & State Filter Controls */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search LGA name, cluster officer, or state..."
                value={lgaSearchQuery}
                onChange={(e) => setLgaSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Filter State:</span>
              <select
                value={lgaStateFilter}
                onChange={(e) => setLgaStateFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="All">All Federation States</option>
                <option value="Kano State">Kano State (NW)</option>
                <option value="Lagos State">Lagos State (SW)</option>
                <option value="Federal Capital Territory (FCT)">FCT Abuja (NC)</option>
                <option value="Rivers State">Rivers State (SS)</option>
                <option value="Kaduna State">Kaduna State (NW)</option>
                <option value="Anambra State">Anambra State (SE)</option>
              </select>
            </div>
          </div>

          {/* LGA Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLgas.map((lga) => (
              <div 
                key={lga.id}
                className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <span className="font-bold text-sm text-white block">{lga.lgaName}</span>
                    <span className="text-[11px] text-slate-400">{lga.stateName} • {lga.zoneCode}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      lga.status === 'Healthy'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : lga.status === 'Float Depleted'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {lga.status}
                  </span>
                </div>

                <div className="text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Cluster Supervisor:</span>
                    <strong className="text-slate-200">{lga.clusterOfficer}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Phone:</span>
                    <span className="text-emerald-400 font-mono">{lga.phone}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Agents / POS Terminals:</span>
                    <span className="text-cyan-400 font-mono font-bold">
                      {lga.agentCount} agents / {lga.activePosTerminals} POS
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Daily CICO Flow:</span>
                    <span className="text-emerald-400 font-mono font-bold transition-all duration-300">
                      {formatNgn(lga.dailyCicoVolumeNgn, { decimals: 1 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>NIN/BVN Verifications:</span>
                    <span className="text-indigo-400 font-mono">{lga.ninBvnVerificationCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Offline USSD (*990#) Agents:</span>
                    <span className="text-amber-400 font-mono">{lga.offlineUssdAgents} kiosks</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Open Merchant Disputes:</span>
                    <span className={`font-mono ${lga.openDisputes > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                      {lga.openDisputes} tickets
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => showToast(`Float auto-refill triggered for ${lga.lgaName}`)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    Refill Cash Float
                  </button>
                  <button
                    onClick={() => showToast(`Audit team dispatched to ${lga.lgaName} cluster`)}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    Inspect Cluster
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
