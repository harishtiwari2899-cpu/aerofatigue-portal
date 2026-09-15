import React, { useState, useMemo } from 'react';
import { useFatigue } from '../../context/FatigueContext';
import { RiskCategory, ShiftType, FatigueRecord } from '../../types/fatigue';
import { RiskBadge } from '../common/RiskBadge';
import { SafetyBanner } from '../common/SafetyBanner';
import { FatigueTrendChart, SleepVsDutyChart } from '../dashboard/TrendChart';
import {
  History,
  Filter,
  Download,
  Calendar,
  Search,
  RotateCcw,
  BarChart2,
  FileSpreadsheet,
  CheckCircle,
  Eye,
  X
} from 'lucide-react';

export const FatigueHistory: React.FC = () => {
  const { userRecords, currentUser, setCurrentResult, setActiveTab } = useFatigue();

  // Filters
  const [timeFilter, setTimeFilter] = useState<'7' | '30' | 'custom'>('14');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [shiftFilter, setShiftFilter] = useState<string>('ALL');
  const [selectedRecordForModal, setSelectedRecordForModal] = useState<FatigueRecord | null>(null);

  // Filter records
  const filteredRecords = useMemo(() => {
    let list = [...userRecords];

    // Date range
    const now = new Date();
    if (timeFilter === '7') {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 7);
      list = list.filter(r => new Date(r.date) >= cutoff);
    } else if (timeFilter === '30') {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 30);
      list = list.filter(r => new Date(r.date) >= cutoff);
    } else if (timeFilter === 'custom' && startDate && endDate) {
      list = list.filter(r => r.date >= startDate && r.date <= endDate);
    }

    // Risk category filter
    if (riskFilter !== 'ALL') {
      list = list.filter(r => r.category === riskFilter);
    }

    // Shift type filter
    if (shiftFilter !== 'ALL') {
      list = list.filter(r => r.shiftType === shiftFilter);
    }

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [userRecords, timeFilter, startDate, endDate, riskFilter, shiftFilter]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Date', 'User', 'Role', 'Badge ID', 'Sleep Hours', 'Duty Hours', 'Shift Type', 'Workload', 'Fatigue Score', 'Risk Tier', 'Mitigation'];
    const rows = filteredRecords.map(r => [
      r.date,
      `"${r.userName}"`,
      r.role,
      r.badgeId,
      r.sleepHours,
      r.dutyHours,
      r.shiftType,
      r.workload,
      r.score,
      r.category,
      `"${r.mitigationStatus || 'None'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aerofatigue_history_${currentUser.badgeId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInspectRecord = (rec: FatigueRecord) => {
    if (rec.result) {
      setCurrentResult(rec.result);
      setActiveTab('result');
    } else {
      setSelectedRecordForModal(rec);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-aviation-navy border border-aviation-border text-aviation-accent">
              <History className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-100 font-mono tracking-wide">
              FATIGUE RISK HISTORY &amp; AUDIT LOGS
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Historical operational fatigue telemetry for <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.badgeId})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="btn-secondary text-xs"
            title="Download CSV report"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <SafetyBanner compact />

      {/* FILTER CONTROLS */}
      <div className="cockpit-panel p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400 border-b border-aviation-border/60 pb-2">
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-aviation-accent" />
            <span>Data Range &amp; Category Filters</span>
          </div>
          <span>Showing {filteredRecords.length} records</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Time Preset */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-mono">Time Period</label>
            <select
              value={timeFilter}
              onChange={e => setTimeFilter(e.target.value as any)}
              className="cockpit-input w-full font-mono text-xs"
            >
              <option value="7">Last 7 Days</option>
              <option value="14">Last 14 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-mono">Risk Level</label>
            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value)}
              className="cockpit-input w-full font-mono text-xs"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="LOW">Low Risk (0-30)</option>
              <option value="MODERATE">Moderate Risk (31-60)</option>
              <option value="HIGH">High Risk (61-80)</option>
              <option value="CRITICAL">Critical Risk (81-100)</option>
            </select>
          </div>

          {/* Shift Type */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-mono">Shift Type</label>
            <select
              value={shiftFilter}
              onChange={e => setShiftFilter(e.target.value)}
              className="cockpit-input w-full font-mono text-xs"
            >
              <option value="ALL">All Shifts</option>
              <option value="day">Day Flight/Shift</option>
              <option value="evening">Evening</option>
              <option value="night">Night / WOCL</option>
              <option value="early_morning">Early Morning</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setTimeFilter('14');
                setRiskFilter('ALL');
                setShiftFilter('ALL');
                setStartDate('');
                setEndDate('');
              }}
              className="w-full btn-secondary text-xs py-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Custom Date Range picker row */}
        {timeFilter === 'custom' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-aviation-border/40">
            <div>
              <label className="block text-[10px] text-slate-400 mb-1 font-mono">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="cockpit-input w-full font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1 font-mono">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="cockpit-input w-full font-mono text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* TREND CHART PREVIEW OVER FILTERED RANGE */}
      <div className="cockpit-panel p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-aviation-accent" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Fatigue Trend Trajectory (Filtered Range)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">ICAO FRMS Compliant Metric Line</span>
        </div>
        <FatigueTrendChart records={filteredRecords} />
      </div>

      {/* HISTORY TABLE */}
      <div className="cockpit-panel p-5">
        <div className="flex items-center justify-between border-b border-aviation-border/60 pb-3 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
            Detailed Daily Telemetry Logs
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {filteredRecords.length} Entries Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-aviation-border text-slate-400 uppercase text-[10px] bg-aviation-darkest/60">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Sleep Duration</th>
                <th className="py-3 px-3">Duty Hours</th>
                <th className="py-3 px-3">Shift Type</th>
                <th className="py-3 px-3">Workload</th>
                <th className="py-3 px-3">Score</th>
                <th className="py-3 px-3">Risk Tier</th>
                <th className="py-3 px-3">Mitigation / SOP</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aviation-border/40">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 font-sans">
                    No fatigue records match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(record => (
                  <tr key={record.id} className="hover:bg-aviation-card/50 transition-colors">
                    <td className="py-3 px-3 text-slate-200 font-bold">{record.date}</td>
                    <td className="py-3 px-3 text-slate-300">{record.sleepHours} hrs</td>
                    <td className="py-3 px-3 text-slate-300">{record.dutyHours} hrs</td>
                    <td className="py-3 px-3 capitalize text-slate-300">{record.shiftType.replace('_', ' ')}</td>
                    <td className="py-3 px-3 capitalize text-slate-300">{record.workload.replace('_', ' ')}</td>
                    <td className="py-3 px-3 font-bold text-slate-100">{record.score} / 100</td>
                    <td className="py-3 px-3">
                      <RiskBadge category={record.category} size="sm" />
                    </td>
                    <td className="py-3 px-3">
                      {record.mitigationStatus && record.mitigationStatus !== 'None' ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                          {record.mitigationStatus}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleInspectRecord(record)}
                        className="p-1.5 rounded-md hover:bg-aviation-navy text-aviation-accent hover:text-white transition-colors"
                        title="View Full Attribution Breakdown"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
