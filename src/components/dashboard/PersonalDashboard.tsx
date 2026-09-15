import React from 'react';
import { useFatigue } from '../../context/FatigueContext';
import { ScoreGauge } from '../common/ScoreGauge';
import { RiskBadge } from '../common/RiskBadge';
import { SafetyBanner } from '../common/SafetyBanner';
import { FatigueTrendChart, SleepVsDutyChart } from './TrendChart';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Moon,
  Clock,
  Calendar,
  Activity,
  PlusCircle,
  History,
  Plane,
  Wrench,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const PersonalDashboard: React.FC = () => {
  const { currentUser, userRecords, latestUserRecord, setActiveTab, switchRole } = useFatigue();

  // Compute 7-day metrics
  const last7Records = [...userRecords]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7);

  const avgSleep = last7Records.length > 0
    ? (last7Records.reduce((acc, r) => acc + r.sleepHours, 0) / last7Records.length).toFixed(1)
    : '7.2';

  const totalDuty = last7Records.length > 0
    ? last7Records.reduce((acc, r) => acc + r.dutyHours, 0).toFixed(1)
    : '42.0';

  // Compute trend (compare latest score vs 3-day rolling average before latest)
  const getTrendIndicator = () => {
    if (userRecords.length < 2) return { text: 'Stable Baseline', icon: <Minus className="w-4 h-4 text-slate-400" />, color: 'text-slate-400' };
    const latest = userRecords[0].score;
    const prev = userRecords[1].score;
    const diff = latest - prev;
    if (diff > 5) {
      return {
        text: `Increasing Risk (+${diff} pts)`,
        icon: <TrendingUp className="w-4 h-4 text-rose-400" />,
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
      };
    } else if (diff < -5) {
      return {
        text: `Decreasing Risk (${diff} pts)`,
        icon: <TrendingDown className="w-4 h-4 text-emerald-400" />,
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      };
    }
    return {
      text: 'Fatigue Risk Stable',
      icon: <Minus className="w-4 h-4 text-sky-400" />,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/30'
    };
  };

  const trend = getTrendIndicator();

  const currentScore = latestUserRecord ? latestUserRecord.score : 35;
  const currentCategory = latestUserRecord ? latestUserRecord.category : 'MODERATE';
  const currentSleep = latestUserRecord ? latestUserRecord.sleepHours : 7.0;
  const currentDuty = latestUserRecord ? latestUserRecord.dutyHours : 8.5;
  const currentWorkload = latestUserRecord ? latestUserRecord.workload : 'moderate';
  const consecutiveDays = latestUserRecord?.details?.consecutiveDutyDays ?? 3;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Welcome & Quick Profile Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              {currentUser.role === 'aircrew' ? 'FLIGHT DECK TELEMETRY' : 'MAINTENANCE SHIFT TELEMETRY'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Station: {currentUser.baseStation}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono">
            {currentUser.name}
          </h1>
          <p className="text-xs text-slate-400">
            {currentUser.roleTitle} • Fleet: <span className="text-slate-200">{currentUser.fleetOrUnit}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('future_sensors')}
            className="btn-secondary text-xs"
          >
            <Zap className="w-4 h-4 text-aviation-accent" />
            <span>PVT Reaction Test</span>
          </button>
          <button
            onClick={() => setActiveTab('checkin')}
            className="btn-primary text-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Daily Check-In</span>
          </button>
        </div>
      </div>

      <SafetyBanner compact />

      {/* 6 TOP OPERATIONAL METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* 1. Fatigue Score Hero Box (2 cols on large) */}
        <div className="lg:col-span-2 cockpit-panel p-5 flex items-center justify-between gap-4 relative overflow-hidden bg-gradient-to-br from-aviation-navy to-aviation-darkest">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
              Current Fatigue Risk Score
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-mono font-black text-slate-100">{currentScore}</span>
              <span className="text-sm font-mono text-slate-400">/ 100</span>
            </div>
            <div>
              <RiskBadge category={currentCategory} size="sm" />
            </div>
            {/* Trend pill */}
            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border ${trend.color}`}>
              {trend.icon}
              <span>{trend.text}</span>
            </div>
          </div>
          <div className="shrink-0">
            <ScoreGauge score={currentScore} category={currentCategory} size="sm" showCategoryLabel={false} />
          </div>
        </div>

        {/* 2. Sleep Duration */}
        <div className="cockpit-panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Previous Sleep</span>
            <Moon className="w-4 h-4 text-aviation-accent" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-slate-100">
              {currentSleep} <span className="text-xs text-slate-400 font-normal">hrs</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              7-Day Avg: <strong className="text-slate-200 font-mono">{avgSleep}h</strong>
            </div>
          </div>
        </div>

        {/* 3. Duty Duration */}
        <div className="cockpit-panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Current Duty</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-slate-100">
              {currentDuty} <span className="text-xs text-slate-400 font-normal">hrs</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              7-Day Sum: <strong className="text-slate-200 font-mono">{totalDuty}h</strong>
            </div>
          </div>
        </div>

        {/* 4. Consecutive Duty Days */}
        <div className="cockpit-panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Duty Streak</span>
            <Calendar className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-slate-100">
              Day {consecutiveDays}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {consecutiveDays >= 5 ? (
                <span className="text-amber-400 font-medium">Near rotation limit</span>
              ) : (
                <span className="text-emerald-400 font-medium">Within standard cycle</span>
              )}
            </div>
          </div>
        </div>

        {/* 5. Workload Level */}
        <div className="cockpit-panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Workload</span>
            <Activity className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <div className="text-lg font-mono font-bold capitalize text-slate-100">
              {currentWorkload.replace('_', ' ')}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {currentUser.role === 'aircrew' ? 'Flight Deck Load' : 'Ergonomic Demand'}
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Fatigue Score Trend */}
        <div className="cockpit-panel p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
                7-Day Operational Fatigue Trajectory
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Thresholds: 30 / 60 / 80</span>
          </div>
          <FatigueTrendChart records={userRecords} />
        </div>

        {/* 7-Day Sleep vs Duty Hours */}
        <div className="cockpit-panel p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
                7-Day Sleep Duration vs Duty Hours
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Hours per day</span>
          </div>
          <SleepVsDutyChart records={userRecords} />
        </div>
      </div>

      {/* RECENT CHECK-INS TABLE SUMMARY */}
      <div className="cockpit-panel p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-aviation-border/60 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-aviation-accent" />
            <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
              Recent Check-In Telemetry Log
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs text-aviation-accent hover:underline font-mono flex items-center gap-1"
          >
            <span>Full History Archive</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-aviation-border text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Sleep</th>
                <th className="py-2.5 px-3">Duty / Flight</th>
                <th className="py-2.5 px-3">Shift Type</th>
                <th className="py-2.5 px-3">Workload</th>
                <th className="py-2.5 px-3">Fatigue Score</th>
                <th className="py-2.5 px-3">Risk Tier</th>
                <th className="py-2.5 px-3">Mitigation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aviation-border/40">
              {userRecords.slice(0, 5).map(record => (
                <tr key={record.id} className="hover:bg-aviation-card/50 transition-colors">
                  <td className="py-2.5 px-3 text-slate-200 font-bold">{record.date}</td>
                  <td className="py-2.5 px-3 text-slate-300">{record.sleepHours}h</td>
                  <td className="py-2.5 px-3 text-slate-300">{record.dutyHours}h</td>
                  <td className="py-2.5 px-3 capitalize text-slate-400">{record.shiftType.replace('_', ' ')}</td>
                  <td className="py-2.5 px-3 capitalize text-slate-400">{record.workload.replace('_', ' ')}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-100">{record.score} / 100</td>
                  <td className="py-2.5 px-3">
                    <RiskBadge category={record.category} size="sm" />
                  </td>
                  <td className="py-2.5 px-3">
                    {record.mitigationStatus && record.mitigationStatus !== 'None' ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        {record.mitigationStatus}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Standard</span>
                    )}
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
