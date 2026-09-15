import React, { useState } from 'react';
import { useFatigue } from '../../context/FatigueContext';
import { GroundCrewCheckinData, ShiftType, WorkloadLevel } from '../../types/fatigue';
import { calculateFatigueRisk } from '../../utils/fatigueCalculator';
import { FactorSlider } from './FactorSlider';
import { SafetyBanner } from '../common/SafetyBanner';
import {
  Wrench,
  Moon,
  Clock,
  Briefcase,
  Activity,
  Sun,
  Sunrise,
  Sunset,
  Zap,
  Timer,
  ShieldAlert
} from 'lucide-react';

export const GroundCrewCheckin: React.FC = () => {
  const { submitCheckin, currentUser } = useFatigue();

  // Sleep Information
  const [sleepHours, setSleepHours] = useState<number>(6.5);
  const [sleepQuality, setSleepQuality] = useState<number>(3);
  const [wakeups, setWakeups] = useState<number>(1);
  const [sleepStartTime, setSleepStartTime] = useState<string>('14:00');
  const [sleepEndTime, setSleepEndTime] = useState<string>('20:30');

  // Shift Information
  const [shiftStartTime, setShiftStartTime] = useState<string>('22:00');
  const [expectedShiftEndTime, setExpectedShiftEndTime] = useState<string>('07:00');
  const [maintenanceHours, setMaintenanceHours] = useState<number>(8.0);
  const [breakDurationMinutes, setBreakDurationMinutes] = useState<number>(45);
  const [overtimeHours, setOvertimeHours] = useState<number>(2.0);
  const [consecutiveDutyDays, setConsecutiveDutyDays] = useState<number>(3);

  // Ground Specifics
  const [shiftType, setShiftType] = useState<ShiftType>('night');
  const [physicalWorkload, setPhysicalWorkload] = useState<WorkloadLevel>('high');

  // Self-Reported Fatigue (1-5)
  const [physical, setPhysical] = useState<number>(3);
  const [mental, setMental] = useState<number>(3);
  const [alertness, setAlertness] = useState<number>(3); // 5=high, 1=low
  const [sleepiness, setSleepiness] = useState<number>(3);

  // Presets
  const applyPreset = (type: 'day_line' | 'night_aog' | 'extended_overtime') => {
    if (type === 'day_line') {
      setSleepHours(7.5);
      setSleepQuality(4);
      setWakeups(0);
      setShiftType('day');
      setPhysicalWorkload('moderate');
      setMaintenanceHours(8.0);
      setOvertimeHours(0);
      setBreakDurationMinutes(60);
      setConsecutiveDutyDays(1);
      setPhysical(2);
      setMental(2);
      setAlertness(4);
      setSleepiness(1);
    } else if (type === 'night_aog') {
      setSleepHours(5.0);
      setSleepQuality(2);
      setWakeups(2);
      setShiftType('night');
      setPhysicalWorkload('very_high');
      setMaintenanceHours(10.0);
      setOvertimeHours(3.0);
      setBreakDurationMinutes(20);
      setConsecutiveDutyDays(4);
      setPhysical(4);
      setMental(4);
      setAlertness(2);
      setSleepiness(4);
    } else if (type === 'extended_overtime') {
      setSleepHours(4.0);
      setSleepQuality(2);
      setWakeups(3);
      setShiftType('night');
      setPhysicalWorkload('very_high');
      setMaintenanceHours(12.0);
      setOvertimeHours(4.5);
      setBreakDurationMinutes(15);
      setConsecutiveDutyDays(6);
      setPhysical(5);
      setMental(5);
      setAlertness(1);
      setSleepiness(5);
    }
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    const fatigueAlertnessScore = 6 - alertness;

    const checkinData: GroundCrewCheckinData = {
      sleepHours,
      sleepQuality,
      wakeups,
      sleepStartTime,
      sleepEndTime,
      shiftStartTime,
      expectedShiftEndTime,
      maintenanceHours,
      breakDurationMinutes,
      overtimeHours,
      consecutiveDutyDays,
      shiftType,
      physicalWorkload,
      selfReport: {
        physical,
        mental,
        alertness: fatigueAlertnessScore,
        sleepiness
      }
    };

    const result = calculateFatigueRisk('ground_crew', checkinData);

    submitCheckin(result, {
      sleepHours,
      dutyHours: maintenanceHours + overtimeHours,
      shiftType,
      workload: physicalWorkload,
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-100 font-mono tracking-wide">
                GROUND &amp; MAINTENANCE CREW FATIGUE CHECK-IN
              </h1>
              <p className="text-xs text-slate-400">
                Aviation Maintenance &amp; Ramp Safety Assessment (<span className="text-amber-400 font-mono">&lt; 2 Minutes</span>)
              </p>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">Preset:</span>
          <button
            type="button"
            onClick={() => applyPreset('day_line')}
            className="px-2.5 py-1 text-xs bg-aviation-navy hover:bg-aviation-card text-emerald-300 border border-emerald-500/30 rounded-lg transition-colors font-medium"
          >
            Day Line MX
          </button>
          <button
            type="button"
            onClick={() => applyPreset('night_aog')}
            className="px-2.5 py-1 text-xs bg-aviation-navy hover:bg-aviation-card text-amber-300 border border-amber-500/30 rounded-lg transition-colors font-medium"
          >
            Night AOG Shift
          </button>
          <button
            type="button"
            onClick={() => applyPreset('extended_overtime')}
            className="px-2.5 py-1 text-xs bg-aviation-navy hover:bg-aviation-card text-rose-300 border border-rose-500/30 rounded-lg transition-colors font-medium"
          >
            Critical Overtime
          </button>
        </div>
      </div>

      <SafetyBanner compact />

      <form onSubmit={handleCalculate} className="space-y-6">
        {/* SECTION 1: SLEEP INFORMATION */}
        <div className="cockpit-panel p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-aviation-border/60 pb-3">
            <Moon className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
              1. Sleep Duration &amp; Recovery Rest
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FactorSlider
              label="Sleep Duration"
              sublabel="Total hours slept in previous rest period"
              value={sleepHours}
              min={2.0}
              max={12.0}
              step={0.5}
              unit="hours"
              onChange={setSleepHours}
              inverted
            />

            <FactorSlider
              label="Sleep Quality"
              sublabel="Depth and restorative feeling of rest"
              value={sleepQuality}
              min={1}
              max={5}
              step={1}
              onChange={setSleepQuality}
              valueLabels={{
                1: 'Very Poor / Fragmented',
                2: 'Restless',
                3: 'Adequate',
                4: 'Good / Sound',
                5: 'Deep Rest'
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-aviation-darkest/70 border border-aviation-border/80 rounded-xl p-3">
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Sleep Awakenings
              </label>
              <select
                value={wakeups}
                onChange={e => setWakeups(parseInt(e.target.value))}
                className="cockpit-input w-full font-mono"
              >
                <option value={0}>0 — Slept uninterrupted</option>
                <option value={1}>1 — Brief awakening</option>
                <option value={2}>2 — Multiple interruptions</option>
                <option value={3}>3+ — Frequent awakenings</option>
              </select>
            </div>

            <div className="bg-aviation-darkest/70 border border-aviation-border/80 rounded-xl p-3">
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Sleep Start Time
              </label>
              <input
                type="time"
                value={sleepStartTime}
                onChange={e => setSleepStartTime(e.target.value)}
                className="cockpit-input w-full font-mono"
                required
              />
            </div>

            <div className="bg-aviation-darkest/70 border border-aviation-border/80 rounded-xl p-3">
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Sleep End (Wake-up) Time
              </label>
              <input
                type="time"
                value={sleepEndTime}
                onChange={e => setSleepEndTime(e.target.value)}
                className="cockpit-input w-full font-mono"
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: SHIFT & MAINTENANCE DETAILS */}
        <div className="cockpit-panel p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-aviation-border/60 pb-3">
            <Briefcase className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
              2. Shift Schedule, Overtime &amp; Breaks
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Shift Start Time
              </label>
              <input
                type="time"
                value={shiftStartTime}
                onChange={e => setShiftStartTime(e.target.value)}
                className="cockpit-input w-full font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Expected Shift End Time
              </label>
              <input
                type="time"
                value={expectedShiftEndTime}
                onChange={e => setExpectedShiftEndTime(e.target.value)}
                className="cockpit-input w-full font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Maintenance Working Hours
              </label>
              <input
                type="number"
                min="1.0"
                max="16.0"
                step="0.5"
                value={maintenanceHours}
                onChange={e => setMaintenanceHours(parseFloat(e.target.value) || 8)}
                className="cockpit-input w-full font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Overtime Hours Added
              </label>
              <input
                type="number"
                min="0"
                max="8.0"
                step="0.5"
                value={overtimeHours}
                onChange={e => setOvertimeHours(parseFloat(e.target.value) || 0)}
                className="cockpit-input w-full font-mono text-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Total Rest / Meal Break Duration (Minutes)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={10}
                  max={90}
                  step={5}
                  value={breakDurationMinutes}
                  onChange={e => setBreakDurationMinutes(parseInt(e.target.value))}
                  className="w-full h-2 bg-aviation-navy rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <span className="font-mono text-sm font-bold text-slate-200 px-3 py-1 bg-aviation-darkest border border-aviation-border rounded-lg shrink-0">
                  {breakDurationMinutes} min
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Consecutive Working Days
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={14}
                  step={1}
                  value={consecutiveDutyDays}
                  onChange={e => setConsecutiveDutyDays(parseInt(e.target.value))}
                  className="w-full h-2 bg-aviation-navy rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <span className="font-mono text-sm font-bold text-slate-200 px-3 py-1 bg-aviation-darkest border border-aviation-border rounded-lg shrink-0">
                  {consecutiveDutyDays} days
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: SHIFT TYPE & PHYSICAL WORKLOAD */}
        <div className="cockpit-panel p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-aviation-border/60 pb-3">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
              3. Shift Timing &amp; Physical Workload Intensity
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Maintenance Shift Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setShiftType('day')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    shiftType === 'day'
                      ? 'bg-amber-500/15 border-amber-400 text-slate-100 shadow-glow-amber/20'
                      : 'bg-aviation-darkest/70 border-aviation-border text-slate-400 hover:bg-aviation-dark'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-400 mb-2" />
                  <div>
                    <div className="text-xs font-bold text-slate-200">Day Shift</div>
                    <div className="text-[10px] text-slate-400">07:00 – 15:30</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setShiftType('evening')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    shiftType === 'evening'
                      ? 'bg-amber-500/15 border-amber-400 text-slate-100 shadow-glow-amber/20'
                      : 'bg-aviation-darkest/70 border-aviation-border text-slate-400 hover:bg-aviation-dark'
                  }`}
                >
                  <Sunset className="w-4 h-4 text-orange-400 mb-2" />
                  <div>
                    <div className="text-xs font-bold text-slate-200">Swing / Evening</div>
                    <div className="text-[10px] text-slate-400">15:00 – 23:30</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setShiftType('night')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    shiftType === 'night'
                      ? 'bg-rose-500/15 border-rose-500 text-slate-100 shadow-glow-red/20 ring-1 ring-rose-500/50'
                      : 'bg-aviation-darkest/70 border-aviation-border text-slate-400 hover:bg-aviation-dark'
                  }`}
                >
                  <Moon className="w-4 h-4 text-rose-400 mb-2" />
                  <div>
                    <div className="text-xs font-bold text-slate-200">Night Graveyard</div>
                    <div className="text-[10px] text-rose-300 font-mono">22:00 – 07:00 WOCL</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setShiftType('early_morning')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    shiftType === 'early_morning'
                      ? 'bg-amber-500/15 border-amber-500 text-slate-100 shadow-glow-amber/20'
                      : 'bg-aviation-darkest/70 border-aviation-border text-slate-400 hover:bg-aviation-dark'
                  }`}
                >
                  <Sunrise className="w-4 h-4 text-amber-400 mb-2" />
                  <div>
                    <div className="text-xs font-bold text-slate-200">Early Dawn Shift</div>
                    <div className="text-[10px] text-slate-400">05:00 – 13:30</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Physical Workload &amp; Ergonomic Demand
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'low', label: 'Low', desc: 'Documentation & light inspections' },
                  { key: 'moderate', label: 'Moderate', desc: 'Standard line checks / tire swap' },
                  { key: 'high', label: 'High', desc: 'Heavy structural / tight nacelle work' },
                  { key: 'very_high', label: 'Very High', desc: 'AOG engine change / heavy rigging' },
                ].map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setPhysicalWorkload(item.key as WorkloadLevel)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      physicalWorkload === item.key
                        ? 'bg-amber-500/15 border-amber-400 text-slate-100 font-semibold'
                        : 'bg-aviation-darkest/70 border-aviation-border text-slate-400 hover:bg-aviation-dark'
                    }`}
                  >
                    <div className="text-xs font-bold capitalize text-slate-200">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: SELF-REPORTED FATIGUE QUESTIONNAIRE */}
        <div className="cockpit-panel p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-aviation-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
                4. Self-Reported Fatigue Questionnaire
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Scale: 1 (Fresh) to 5 (Exhausted)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FactorSlider
              label="Physical Tiredness & Muscle Strain"
              sublabel="Physical heaviness, back or neck strain from tools"
              value={physical}
              min={1}
              max={5}
              onChange={setPhysical}
              valueLabels={{
                1: 'Completely Fresh',
                2: 'Mild Physical Strain',
                3: 'Moderate Tiredness',
                4: 'Heavy Muscular Fatigue',
                5: 'Physical Exhaustion'
              }}
            />

            <FactorSlider
              label="Mental Tiredness & Focus"
              sublabel="Ability to read wiring diagrams & troubleshoot"
              value={mental}
              min={1}
              max={5}
              onChange={setMental}
              valueLabels={{
                1: 'Sharp Focus',
                2: 'Normal Concentration',
                3: 'Slight Concentration Lag',
                4: 'High Mental Effort',
                5: 'Severe Brain Exhaustion'
              }}
            />

            <FactorSlider
              label="Alertness & Precision"
              sublabel="Vigilance during safety-critical sign-offs (RII)"
              value={alertness}
              min={1}
              max={5}
              onChange={setAlertness}
              valueLabels={{
                1: 'Low Alertness / Sluggish',
                2: 'Reduced Focus',
                3: 'Normal Alertness',
                4: 'High Precision',
                5: 'Maximum Sharpness'
              }}
              inverted
            />

            <FactorSlider
              label="Sleepiness & Heavy Eyes"
              sublabel="Tendency to doze off or fight drowsiness"
              value={sleepiness}
              min={1}
              max={5}
              onChange={setSleepiness}
              valueLabels={{
                1: 'Wide Awake',
                2: 'Steady Alert',
                3: 'Mild Drowsiness',
                4: 'Fighting Sleep',
                5: 'Severe Drowsiness'
              }}
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-amber-400 hover:bg-amber-300 text-aviation-darkest py-4 text-base font-black tracking-wider uppercase font-mono rounded-lg shadow-glow-amber flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            <Zap className="w-5 h-5 text-aviation-darkest" />
            <span>CALCULATE FATIGUE RISK SCORE</span>
          </button>
        </div>
      </form>
    </div>
  );
};
