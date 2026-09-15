import React, { useState } from 'react';
import { useFatigue } from '../../context/FatigueContext';
import { AircrewCheckinData, ShiftType, WorkloadLevel } from '../../types/fatigue';
import { calculateFatigueRisk } from '../../utils/fatigueCalculator';
import { FactorSlider } from './FactorSlider';
import { SafetyBanner } from '../common/SafetyBanner';
import {
  Plane,
  Moon,
  Clock,
  Briefcase,
  Activity,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Sun,
  Sunrise,
  Sunset,
  Zap,
  Info
} from 'lucide-react';

export const AircrewCheckin: React.FC = () => {
  const { submitCheckin, currentUser } = useFatigue();

  // Sleep Information State
  const [sleepHours, setSleepHours] = useState<number>(7.0);
  const [sleepQuality, setSleepQuality] = useState<number>(4);
  const [wakeups, setWakeups] = useState<number>(1);
  const [sleepStartTime, setSleepStartTime] = useState<string>('23:30');
  const [sleepEndTime, setSleepEndTime] = useState<string>('06:30');

  // Duty Information State
  const [dutyStartTime, setDutyStartTime] = useState<string>('08:00');
  const [expectedDutyEndTime, setExpectedDutyEndTime] = useState<string>('17:00');
  const [previousDutyHours, setPreviousDutyHours] = useState<number>(8.0);
  const [consecutiveDutyDays, setConsecutiveDutyDays] = useState<number>(2);

  // Flight Specifics
  const [flyingHours, setFlyingHours] = useState<number>(5.5);
  const [sortiesCount, setSortiesCount] = useState<number>(2);
  const [shiftType, setShiftType] = useState<ShiftType>('day');
  const [workload, setWorkload] = useState<WorkloadLevel>('moderate');

  // Self-Reported Fatigue (1-5)
  const [physical, setPhysical] = useState<number>(2);
  const [mental, setMental] = useState<number>(2);
  const [alertness, setAlertness] = useState<number>(4); // 5=high alertness, 1=low (we invert in calculation)
  const [sleepiness, setSleepiness] = useState<number>(2);

  // Quick Preset Handlers for Rapid Pre-Flight Check-in
  const applyPreset = (type: 'optimal' | 'night_transatlantic' | 'multi_sector_fatigued') => {
    if (type === 'optimal') {
      setSleepHours(8.0);
      setSleepQuality(5);
      setWakeups(0);
      setShiftType('day');
      setWorkload('moderate');
      setConsecutiveDutyDays(1);
      setFlyingHours(4.0);
      setSortiesCount(1);
      setPhysical(1);
      setMental(1);
      setAlertness(5);
      setSleepiness(1);
    } else if (type === 'night_transatlantic') {
      setSleepHours(5.5);
      setSleepQuality(3);
      setWakeups(2);
      setShiftType('night');
      setWorkload('high');
      setConsecutiveDutyDays(3);
      setFlyingHours(9.5);
      setSortiesCount(1);
      setPhysical(4);
      setMental(3);
      setAlertness(3);
      setSleepiness(4);
    } else if (type === 'multi_sector_fatigued') {
      setSleepHours(4.5);
      setSleepQuality(2);
      setWakeups(3);
      setShiftType('early_morning');
      setWorkload('very_high');
      setConsecutiveDutyDays(5);
      setFlyingHours(7.5);
      setSortiesCount(4);
      setPhysical(4);
      setMental(5);
      setAlertness(2);
      setSleepiness(4);
    }
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    // Map alertness rating: 1(low) to 5(high) -> inverted for fatigue scoring where 1 is best, 5 is worst
    const fatigueAlertnessScore = 6 - alertness;

    const checkinData: AircrewCheckinData = {
      sleepHours,
      sleepQuality,
      wakeups,
      sleepStartTime,
      sleepEndTime,
      dutyStartTime,
      expectedDutyEndTime,
      previousDutyHours,
      consecutiveDutyDays,
      flyingHours,
      sortiesCount,
      shiftType,
      workload,
      selfReport: {
        physical,
        mental,
        alertness: fatigueAlertnessScore,
        sleepiness
      }
    };

    const result = calculateFatigueRisk('aircrew', checkinData);

    submitCheckin(result, {
      sleepHours,
      dutyHours: flyingHours + 2,
      shiftType,
      workload,
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/30">
              <Plane className="w-5 h-5 transform -rotate-45" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-100 font-mono tracking-wide">
                AIRCREW DAILY FATIGUE CHECK-IN
              </h1>
              <p className="text-xs text-slate-400">
                Pilot & Flight Crew Pre-Flight Operational Assessment (<span className="text-aviation-accent font-mono">&lt; 2 Minutes</span>)
              </p>
            </div>
          </div>
        </div>

        {/* Quick Presets for Demo */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">Scenario:</span>
          <button
            type="button"
            onClick={() => applyPreset('optimal')}
            className="px-2.5 py-1 text-xs bg-aviation-navy hover:bg-aviation-card text-emerald-300 border border-emerald-500/30 rounded-lg transition-colors font-medium"
          >
            Optimal Rest
          </button>
          <button
            type="button"
            onClick={() => applyPreset('night_transatlantic')}
            className="px-2.5 py-1 text-xs bg-aviation-navy hover:bg-aviation-card text-amber-300 border border-amber-500/30 rounded-lg transition-colors font-medium"
          >
            Night WOCL
          </button>
          <button
            type="button"
            onClick={() => applyPreset('multi_sector_fatigued')}
            className="px-2.5 py-1 text-xs bg-aviation-navy hover:bg-aviation-card text-rose-300 border border-rose-500/30 rounded-lg transition-colors font-medium"
          >
            Multi-Sector Strain
          </button>
        </div>
      </div>

      <SafetyBanner compact />

      <form onSubmit={handleCalculate} className="space-y-6">
        {/* SECTION 1: SLEEP INFORMATION */}
        <div className="cockpit-panel p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-aviation-border/60 pb-3">
            <Moon className="w-5 h-5 text-aviation-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
              1. Sleep Information &amp; Rest Period
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sleep Duration */}
            <FactorSlider
              label="Sleep Duration"
              sublabel="Total hours slept in previous sleep period (target > 7.5h)"
              value={sleepHours}
              min={2.0}
              max={12.0}
              step={0.5}
              unit="hours"
              onChange={setSleepHours}
              inverted
            />

            {/* Sleep Quality */}
            <FactorSlider
              label="Sleep Quality"
              sublabel="Subjective restorative depth of rest"
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
                5: 'Deep / Restorative'
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Awakenings */}
            <div className="bg-aviation-darkest/70 border border-aviation-border/80 rounded-xl p-3">
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Night Awakenings
              </label>
              <select
                value={wakeups}
                onChange={e => setWakeups(parseInt(e.target.value))}
                className="cockpit-input w-full font-mono"
              >
                <option value={0}>0 — Slept uninterrupted</option>
                <option value={1}>1 — Brief awakening</option>
                <option value={2}>2 — Multiple awakenings</option>
                <option value={3}>3+ — Highly interrupted sleep</option>
              </select>
            </div>

            {/* Sleep Start Time */}
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

            {/* Sleep End Time */}
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

        {/* SECTION 2: DUTY & FLIGHT PROFILE */}
        <div className="cockpit-panel p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-aviation-border/60 pb-3">
            <Briefcase className="w-5 h-5 text-aviation-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
              2. Flight Duty Period &amp; Operational Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Duty Start Time (UTC/Local)
              </label>
              <input
                type="time"
                value={dutyStartTime}
                onChange={e => setDutyStartTime(e.target.value)}
                className="cockpit-input w-full font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Expected Duty End Time
              </label>
              <input
                type="time"
                value={expectedDutyEndTime}
                onChange={e => setExpectedDutyEndTime(e.target.value)}
                className="cockpit-input w-full font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Planned Flight Hours (Stick Time)
              </label>
              <input
                type="number"
                min="0.5"
                max="18.0"
                step="0.5"
                value={flyingHours}
                onChange={e => setFlyingHours(parseFloat(e.target.value) || 0)}
                className="cockpit-input w-full font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Number of Sorties / Sectors
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={sortiesCount}
                onChange={e => setSortiesCount(parseInt(e.target.value) || 1)}
                className="cockpit-input w-full font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Consecutive Duty Days (Rotation Streak)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={12}
                  step={1}
                  value={consecutiveDutyDays}
                  onChange={e => setConsecutiveDutyDays(parseInt(e.target.value))}
                  className="w-full h-2 bg-aviation-navy rounded-lg appearance-none cursor-pointer accent-aviation-accent"
                />
                <span className="font-mono text-sm font-bold text-slate-200 px-3 py-1 bg-aviation-darkest border border-aviation-border rounded-lg shrink-0">
                  {consecutiveDutyDays} {consecutiveDutyDays === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Previous Shift / Duty Duration
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={16}
                  step={0.5}
                  value={previousDutyHours}
                  onChange={e => setPreviousDutyHours(parseFloat(e.target.value))}
                  className="w-full h-2 bg-aviation-navy rounded-lg appearance-none cursor-pointer accent-aviation-accent"
                />
                <span className="font-mono text-sm font-bold text-slate-200 px-3 py-1 bg-aviation-darkest border border-aviation-border rounded-lg shrink-0">
                  {previousDutyHours} hrs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: SHIFT TYPE & WORKLOAD LEVEL */}
        <div className="cockpit-panel p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-aviation-border/60 pb-3">
            <Clock className="w-5 h-5 text-aviation-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
              3. Operational Shift Window &amp; Workload Complexity
            </h2>
          </div>

          <div className="space-y-4">
            {/* Shift Type Radios */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Flight Window / Shift Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setShiftType('day')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    shiftType === 'day'
                      ? 'bg-cyan-500/15 border-aviation-accent text-slate-100 shadow-glow-cyan/20'
                      : 'bg-aviation-darkest/70 border-aviation-border text-slate-400 hover:bg-aviation-dark'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-400 mb-2" />
                  <div>
                    <div className="text-xs font-bold text-slate-200">Day Flight</div>
                    <div className="text-[10px] text-slate-400">07:00 – 18:00</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setShiftType('evening')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    shiftType === 'evening'
                      ? 'bg-cyan-500/15 border-aviation-accent text-slate-100 shadow-glow-cyan/20'
                      : 'bg-aviation-darkest/70 border-aviation-border text-slate-400 hover:bg-aviation-dark'
                  }`}
                >
                  <Sunset className="w-4 h-4 text-orange-400 mb-2" />
                  <div>
                    <div className="text-xs font-bold text-slate-200">Evening Flight</div>
                    <div className="text-[10px] text-slate-400">18:00 – 23:00</div>
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
                    <div className="text-xs font-bold text-slate-200">Night / WOCL</div>
                    <div className="text-[10px] text-rose-300 font-mono">02:00 – 06:00 Circadian</div>
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
                    <div className="text-xs font-bold text-slate-200">Early Morning</div>
                    <div className="text-[10px] text-slate-400">04:00 – 07:00 Dawn</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Workload Level Radios */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Expected Flight Complexity &amp; Workload
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'low', label: 'Low', desc: 'Single-leg CAVOK cruise' },
                  { key: 'moderate', label: 'Moderate', desc: 'Standard airline sectors' },
                  { key: 'high', label: 'High', desc: 'Adverse weather / Multi-leg' },
                  { key: 'very_high', label: 'Very High', desc: 'SAR / Mountain / Emergencies' },
                ].map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setWorkload(item.key as WorkloadLevel)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      workload === item.key
                        ? 'bg-aviation-accent/15 border-aviation-accent text-slate-100 font-semibold'
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
              <Activity className="w-5 h-5 text-aviation-accent" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
                4. Self-Reported Fatigue Questionnaire (Samn-Perelli / Karolinska Index)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Scale: 1 (Optimal) to 5 (Severe)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FactorSlider
              label="Physical Tiredness"
              sublabel="Body heaviness, muscle fatigue, or eye strain"
              value={physical}
              min={1}
              max={5}
              onChange={setPhysical}
              valueLabels={{
                1: 'Completely Fresh',
                2: 'Mild Tiredness',
                3: 'Moderate Fatigue',
                4: 'Heavy Fatigue',
                5: 'Physical Exhaustion'
              }}
            />

            <FactorSlider
              label="Mental Exhaustion"
              sublabel="Cognitive processing speed & decision fatigue"
              value={mental}
              min={1}
              max={5}
              onChange={setMental}
              valueLabels={{
                1: 'Sharp & Agile',
                2: 'Normal Mental Pace',
                3: 'Slight Mental Lag',
                4: 'Noticeable Brain Fog',
                5: 'Severe Mental Drain'
              }}
            />

            <FactorSlider
              label="Alertness & Vigilance"
              sublabel="Ability to monitor instruments and detect anomalies"
              value={alertness}
              min={1}
              max={5}
              onChange={setAlertness}
              valueLabels={{
                1: 'Low Alertness / Drowsy',
                2: 'Sluggish',
                3: 'Adequately Alert',
                4: 'High Vigilance',
                5: 'Extremely Sharp'
              }}
              inverted
            />

            <FactorSlider
              label="Sleepiness & Drowsiness"
              sublabel="Tendency to fight sleep or experience heavy eyelids"
              value={sleepiness}
              min={1}
              max={5}
              onChange={setSleepiness}
              valueLabels={{
                1: 'Wide Awake',
                2: 'Awake / Stable',
                3: 'Mild Drowsiness',
                4: 'Fighting Sleep',
                5: 'Severe Micro-Sleeps'
              }}
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full btn-primary py-4 text-base font-black tracking-wider uppercase font-mono shadow-glow-cyan flex items-center justify-center gap-3"
          >
            <Zap className="w-5 h-5 text-aviation-darkest" />
            <span>CALCULATE FATIGUE RISK SCORE</span>
          </button>
        </div>
      </form>
    </div>
  );
};
