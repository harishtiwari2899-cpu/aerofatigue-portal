import React, { useState, useMemo } from 'react';
import { useFatigue } from '../../context/FatigueContext';
import { FatigueRecord, RiskCategory, UserRole, ShiftType } from '../../types/fatigue';
import { RiskBadge } from '../common/RiskBadge';
import { SafetyBanner } from '../common/SafetyBanner';
import { MitigationModal } from './MitigationModal';
import {
  Users,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Plane,
  Wrench,
  Filter,
  TrendingUp,
  Search,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  Sliders,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  ComposedChart,
  Area
} from 'recharts';

export const SupervisorDashboard: React.FC = () => {
  const { records, applyMitigation } = useFatigue();

  // Filters
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'aircrew' | 'ground_crew'>('ALL');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskCategory>('ALL');
  const [shiftFilter, setShiftFilter] = useState<'ALL' | ShiftType>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [privacyMode, setPrivacyMode] = useState<boolean>(true);
  const [selectedRecordForMitigation, setSelectedRecordForMitigation] = useState<FatigueRecord | null>(null);

  // Group latest records per unique user to show current operational team readiness
  const latestPersonnelRecords = useMemo(() => {
    const map = new Map<string, FatigueRecord>();
    // sort chronological ascending so newest overwrites
    const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    sorted.forEach(r => {
      map.set(r.userId, r);
    });
    return Array.from(map.values());
  }, [records]);

  // Filtered roster
  const filteredPersonnel = useMemo(() => {
    return latestPersonnelRecords.filter(r => {
      if (roleFilter !== 'ALL' && r.role !== roleFilter) return false;
      if (riskFilter !== 'ALL' && r.category !== riskFilter) return false;
      if (shiftFilter !== 'ALL' && r.shiftType !== shiftFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = r.userName.toLowerCase().includes(q);
        const matchCall = r.callSign ? r.callSign.toLowerCase().includes(q) : false;
        const matchBadge = r.badgeId.toLowerCase().includes(q);
        const matchStation = r.baseStation.toLowerCase().includes(q);
        if (!matchName && !matchCall && !matchBadge && !matchStation) return false;
      }
      return true;
    });
  }, [latestPersonnelRecords, roleFilter, riskFilter, shiftFilter, searchQuery]);

  // Risk Counts across current operational personnel
  const riskCounts = useMemo(() => {
    const counts = { LOW: 0, MODERATE: 0, HIGH: 0, CRITICAL: 0 };
    latestPersonnelRecords.forEach(r => {
      if (r.category in counts) {
        counts[r.category as keyof typeof counts]++;
      }
    });
    return counts;
  }, [latestPersonnelRecords]);

  // Priority Attention Queue (High and Critical risk personnel)
  const attentionQueue = useMemo(() => {
    return latestPersonnelRecords
      .filter(r => r.category === 'CRITICAL' || r.category === 'HIGH')
      .sort((a, b) => b.score - a.score);
  }, [latestPersonnelRecords]);

  // Aircrew vs Ground Crew comparative stats
  const aircrewStats = useMemo(() => {
    const air = latestPersonnelRecords.filter(r => r.role === 'aircrew');
    const avgScore = air.length > 0 ? Math.round(air.reduce((a, b) => a + b.score, 0) / air.length) : 0;
    const elevated = air.filter(r => r.category === 'HIGH' || r.category === 'CRITICAL').length;
    return { total: air.length, avgScore, elevated };
  }, [latestPersonnelRecords]);

  const groundStats = useMemo(() => {
    const gnd = latestPersonnelRecords.filter(r => r.role === 'ground_crew');
    const avgScore = gnd.length > 0 ? Math.round(gnd.reduce((a, b) => a + b.score, 0) / gnd.length) : 0;
    const elevated = gnd.filter(r => r.category === 'HIGH' || r.category === 'CRITICAL').length;
    return { total: gnd.length, avgScore, elevated };
  }, [latestPersonnelRecords]);

  // 7-day team trend aggregated
  const teamTrendData = useMemo(() => {
    const dayMap = new Map<string, { totalScore: number; count: number; date: string }>();
    records.forEach(r => {
      const current = dayMap.get(r.date) || { totalScore: 0, count: 0, date: r.date };
      current.totalScore += r.score;
      current.count += 1;
      dayMap.set(r.date, current);
    });

    return Array.from(dayMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7)
      .map(d => ({
        date: d.date.slice(5),
        fullDate: d.date,
        avgScore: Math.round(d.totalScore / d.count),
        personnelCount: d.count
      }));
  }, [records]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Operational Flight Safety &amp; FRMS Directorate
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 font-mono tracking-wide">
            SUPERVISOR FATIGUE MONITORING COMMAND
          </h1>
          <p className="text-xs text-slate-400">
            Real-time fatigue risk oversight across active aircrew squadrons and ground maintenance wings.
          </p>
        </div>

        {/* Privacy Safeguard Toggle */}
        <div className="flex items-center gap-3 bg-aviation-navy border border-aviation-border px-3.5 py-2 rounded-xl">
          <Lock className="w-4 h-4 text-aviation-accent" />
          <div className="text-left">
            <div className="text-xs font-semibold text-slate-200">Privacy Safeguard</div>
            <div className="text-[10px] text-slate-400 font-mono">
              {privacyMode ? 'Role / Call-Sign Obfuscated' : 'Full Operational Roster'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPrivacyMode(!privacyMode)}
            className={`ml-2 px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-colors ${
              privacyMode
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-aviation-dark text-slate-400 border-aviation-border'
            }`}
          >
            {privacyMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <SafetyBanner compact />

      {/* 4 SUMMARY RISK METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* LOW RISK */}
        <div className="cockpit-panel p-4 border-emerald-500/30 bg-gradient-to-br from-aviation-navy to-emerald-950/20">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-mono font-bold tracking-wider uppercase">LOW RISK (0–30)</span>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-mono font-black text-slate-100">{riskCounts.LOW}</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">Optimal Rest</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Personnel clear for standard duty with routine CRM vigilance.
          </p>
        </div>

        {/* MODERATE RISK */}
        <div className="cockpit-panel p-4 border-amber-500/30 bg-gradient-to-br from-aviation-navy to-amber-950/20">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-mono font-bold tracking-wider uppercase">MODERATE (31–60)</span>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-mono font-black text-slate-100">{riskCounts.MODERATE}</span>
            <span className="text-xs font-mono text-amber-400 font-bold">Standard Watch</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Mild fatigue accumulation. Scheduled hydration and breaks advised.
          </p>
        </div>

        {/* HIGH RISK */}
        <div className="cockpit-panel p-4 border-orange-500/40 bg-gradient-to-br from-aviation-navy to-orange-950/20">
          <div className="flex items-center justify-between text-orange-400 mb-2">
            <span className="text-xs font-mono font-bold tracking-wider uppercase">HIGH RISK (61–80)</span>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-mono font-black text-slate-100">{riskCounts.HIGH}</span>
            <span className="text-xs font-mono text-orange-400 font-bold">Mitigation Req.</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Secondary verification required. Consider controlled rest or task rebalance.
          </p>
        </div>

        {/* CRITICAL RISK */}
        <div className="cockpit-panel p-4 border-rose-500/40 bg-gradient-to-br from-aviation-navy to-rose-950/30">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-mono font-bold tracking-wider uppercase">CRITICAL (81–100)</span>
            <AlertOctagon className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-mono font-black text-rose-400">{riskCounts.CRITICAL}</span>
            <span className="text-xs font-mono text-rose-400 font-bold animate-pulse">Immediate Action</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Severe fatigue risk. Mandatory supervisor intervention or relief dispatch.
          </p>
        </div>
      </div>

      {/* AIRCREW VS GROUND CREW OVERVIEW STRIP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aircrew Overview */}
        <div className="cockpit-panel p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-aviation-border/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Plane className="w-5 h-5 transform -rotate-45" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-mono">Aircrew Squadron Status</h3>
                <p className="text-xs text-slate-400">Pilots, First Officers &amp; Helicopter SAR</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-slate-200">
                Avg: <span className="text-aviation-accent">{aircrewStats.avgScore}/100</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {aircrewStats.elevated} Elevated Risk
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2.5 bg-aviation-darkest/70 rounded-lg border border-aviation-border/60">
              <div className="text-slate-400 text-[10px]">Active Pilots</div>
              <div className="text-base font-bold text-slate-100">{aircrewStats.total}</div>
            </div>
            <div className="p-2.5 bg-aviation-darkest/70 rounded-lg border border-aviation-border/60">
              <div className="text-slate-400 text-[10px]">High / Crit</div>
              <div className="text-base font-bold text-orange-400">{aircrewStats.elevated}</div>
            </div>
            <div className="p-2.5 bg-aviation-darkest/70 rounded-lg border border-aviation-border/60">
              <div className="text-slate-400 text-[10px]">Avg Flight Time</div>
              <div className="text-base font-bold text-slate-100">6.4h</div>
            </div>
          </div>
        </div>

        {/* Ground Crew Overview */}
        <div className="cockpit-panel p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-aviation-border/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-mono">Ground Crew &amp; Maintenance Status</h3>
                <p className="text-xs text-slate-400">Line Technicians, Avionics &amp; Powerplant</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-slate-200">
                Avg: <span className="text-amber-400">{groundStats.avgScore}/100</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {groundStats.elevated} Elevated Risk
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2.5 bg-aviation-darkest/70 rounded-lg border border-aviation-border/60">
              <div className="text-slate-400 text-[10px]">Active Techs</div>
              <div className="text-base font-bold text-slate-100">{groundStats.total}</div>
            </div>
            <div className="p-2.5 bg-aviation-darkest/70 rounded-lg border border-aviation-border/60">
              <div className="text-slate-400 text-[10px]">High / Crit</div>
              <div className="text-base font-bold text-rose-400">{groundStats.elevated}</div>
            </div>
            <div className="p-2.5 bg-aviation-darkest/70 rounded-lg border border-aviation-border/60">
              <div className="text-slate-400 text-[10px]">Avg Shift + OT</div>
              <div className="text-base font-bold text-slate-100">9.8h</div>
            </div>
          </div>
        </div>
      </div>

      {/* TEAM FATIGUE TRAJECTORY (7-DAY SQUADRON CHART) */}
      <div className="cockpit-panel p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-aviation-accent" />
            <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
              7-Day Team Operational Fatigue Trajectory
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Aggregated Fleet Average</span>
        </div>

        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={teamTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="teamGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#162C4E" />
              <XAxis dataKey="date" stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis domain={[0, 100]} stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#060D1A',
                  borderColor: '#234475',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}
              />
              <Area type="monotone" dataKey="avgScore" name="Team Avg Score" stroke="#10B981" fill="url(#teamGradient)" strokeWidth={2.5} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PERSONNEL REQUIRING ATTENTION (PRIORITY QUEUE) */}
      <div className="cockpit-panel p-5 space-y-4 border-orange-500/30">
        <div className="flex items-center justify-between border-b border-aviation-border/60 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-orange-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
                Priority Attention Queue — Elevated Fatigue Risk
              </h3>
              <p className="text-xs text-slate-400">
                Personnel flagged for immediate supervisor awareness and operational review
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">
            {attentionQueue.length} Action Items
          </span>
        </div>

        {attentionQueue.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-mono text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            No personnel currently in High or Critical risk categories. Operations nominal.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attentionQueue.map(item => (
              <div
                key={item.id}
                className="bg-aviation-darkest/90 border border-aviation-border hover:border-aviation-borderLight rounded-xl p-4 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-sm">
                          {privacyMode ? (item.callSign || item.badgeId) : item.userName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-aviation-navy px-1.5 py-0.5 rounded border border-aviation-border">
                          {item.role === 'aircrew' ? 'Aircrew' : 'Ground MX'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {item.baseStation} • Duty Shift: {item.shiftType.toUpperCase()}
                      </div>
                    </div>
                    <RiskBadge category={item.category} size="sm" />
                  </div>

                  <div className="my-2 p-2.5 bg-aviation-navy/50 rounded-lg border border-aviation-border/50 text-xs">
                    <div className="flex justify-between font-mono mb-1">
                      <span className="text-slate-400">Score:</span>
                      <span className="font-bold text-rose-400">{item.score} / 100</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      <strong>Primary Trigger:</strong> {item.result?.primaryContributors?.join(', ') || 'Short sleep duration / Night shift'}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-aviation-border/50 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-400">
                    Status: <strong className="text-slate-200">{item.mitigationStatus || 'Pending'}</strong>
                  </span>
                  <button
                    onClick={() => setSelectedRecordForMitigation(item)}
                    className="btn-primary text-xs py-1.5 px-3"
                  >
                    <span>Assign Mitigation</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FILTERABLE ALL-PERSONNEL ROSTER */}
      <div className="cockpit-panel p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-aviation-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-aviation-accent" />
            <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
              Operational Fleet &amp; Crew Roster
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as any)}
              className="cockpit-input font-mono text-xs py-1.5"
            >
              <option value="ALL">All Roles</option>
              <option value="aircrew">Aircrew Only</option>
              <option value="ground_crew">Ground Crew Only</option>
            </select>

            {/* Risk Filter */}
            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value as any)}
              className="cockpit-input font-mono text-xs py-1.5"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="LOW">Low</option>
              <option value="MODERATE">Moderate</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>

            {/* Shift Filter */}
            <select
              value={shiftFilter}
              onChange={e => setShiftFilter(e.target.value as any)}
              className="cockpit-input font-mono text-xs py-1.5"
            >
              <option value="ALL">All Shifts</option>
              <option value="day">Day</option>
              <option value="evening">Evening</option>
              <option value="night">Night / WOCL</option>
              <option value="early_morning">Early Morning</option>
            </select>
          </div>
        </div>

        {/* Roster Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-aviation-border text-slate-400 uppercase text-[10px] bg-aviation-darkest/60">
                <th className="py-3 px-3">Personnel / Call Sign</th>
                <th className="py-3 px-3">Role &amp; Fleet</th>
                <th className="py-3 px-3">Base Station</th>
                <th className="py-3 px-3">Shift Type</th>
                <th className="py-3 px-3">Fatigue Score</th>
                <th className="py-3 px-3">Risk Tier</th>
                <th className="py-3 px-3">Mitigation Action</th>
                <th className="py-3 px-3 text-right">Dispatch Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aviation-border/40">
              {filteredPersonnel.map(person => (
                <tr key={person.id} className="hover:bg-aviation-card/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-100">
                    {privacyMode ? (person.callSign || person.badgeId) : person.userName}
                    <div className="text-[10px] text-slate-400 font-normal">{person.badgeId}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <span className="capitalize">{person.role.replace('_', ' ')}</span>
                    <div className="text-[10px] text-slate-500">{person.fleetOrUnit}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{person.baseStation.split(' ')[0]}</td>
                  <td className="py-3 px-3 capitalize text-slate-300">{person.shiftType.replace('_', ' ')}</td>
                  <td className="py-3 px-3 font-bold text-slate-100">{person.score} / 100</td>
                  <td className="py-3 px-3">
                    <RiskBadge category={person.category} size="sm" />
                  </td>
                  <td className="py-3 px-3">
                    {person.mitigationStatus && person.mitigationStatus !== 'None' ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        {person.mitigationStatus}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">None Required</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedRecordForMitigation(person)}
                      className="btn-secondary text-[11px] py-1 px-2.5"
                    >
                      <span>Manage</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mitigation Modal */}
      {selectedRecordForMitigation && (
        <MitigationModal
          record={selectedRecordForMitigation}
          onClose={() => setSelectedRecordForMitigation(null)}
          onApply={applyMitigation}
        />
      )}
    </div>
  );
};
