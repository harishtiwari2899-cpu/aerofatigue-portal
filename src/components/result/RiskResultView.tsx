import React from 'react';
import { useFatigue } from '../../context/FatigueContext';
import { ScoreGauge } from '../common/ScoreGauge';
import { RiskBadge } from '../common/RiskBadge';
import { FactorCard } from './FactorCard';
import { SafetyBanner } from '../common/SafetyBanner';
import {
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Printer,
  RotateCcw,
  LayoutDashboard,
  FileCheck,
  AlertOctagon,
  Clock,
  User
} from 'lucide-react';

export const RiskResultView: React.FC = () => {
  const { currentResult, currentUser, setActiveTab, latestUserRecord } = useFatigue();

  if (!currentResult) {
    return (
      <div className="cockpit-panel p-12 text-center max-w-xl mx-auto space-y-4">
        <Clock className="w-12 h-12 text-aviation-accent mx-auto" />
        <h3 className="text-lg font-bold text-slate-100 font-mono">NO ACTIVE FATIGUE CALCULATION</h3>
        <p className="text-xs text-slate-400">
          Please complete a daily fatigue check-in to generate your operational risk score.
        </p>
        <button
          onClick={() => setActiveTab('checkin')}
          className="btn-primary"
        >
          Start Daily Check-In
        </button>
      </div>
    );
  }

  const { totalScore, category, factorScores, explanation, recommendations, operationalActions } = currentResult;
  const factorsArray = Object.values(factorScores);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-aviation-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-aviation-navy border border-aviation-border text-aviation-accent">
              Telemetry Logged
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {new Date(currentResult.calculatedAt).toLocaleString()}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-100 font-mono tracking-wide mt-1">
            OPERATIONAL FATIGUE RISK ASSESSMENT RESULT
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="btn-secondary text-xs"
            title="Print FRMS Safety Sheet"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export / Print</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="btn-primary text-xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Go to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <SafetyBanner />

      {/* MAIN SCORE HERO CARD */}
      <div className="cockpit-panel p-6 sm:p-8 relative overflow-hidden bg-gradient-to-b from-aviation-navy/90 to-aviation-darkest">
        {/* Subtle background avionics crosshairs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-aviation-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Large Gauge Score */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-aviation-darkest/60 border border-aviation-border/80 rounded-2xl">
            <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase mb-2">
              OPERATIONAL FATIGUE RISK SCORE
            </div>

            <ScoreGauge score={totalScore} category={category} size="hero" showCategoryLabel={false} />

            <div className="mt-4">
              <RiskBadge category={category} size="lg" />
            </div>

            <div className="mt-2 text-[10px] font-mono text-slate-400">
              Normalized FRMS Standard (0 – 100 Scale)
            </div>
          </div>

          {/* Right: Operational Summary & Dynamic Explanation */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-aviation-card border border-aviation-border">
                <User className="w-4 h-4 text-aviation-accent" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-100">{currentUser.name}</div>
                <div className="text-xs text-slate-400 font-mono">
                  {currentUser.roleTitle} • {currentUser.badgeId} • {currentUser.baseStation}
                </div>
              </div>
            </div>

            {/* Dynamic Natural Language Explanation */}
            <div className="p-4 rounded-xl bg-aviation-dark/90 border border-aviation-border/90">
              <h3 className="text-xs font-mono uppercase tracking-wider text-aviation-accent font-bold mb-1.5 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" />
                Operational Risk Factor Analysis
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                "{explanation}"
              </p>
            </div>

            {/* Safety-Oriented Recommendation */}
            <div className="p-4 rounded-xl bg-aviation-navy border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono uppercase">
                <ShieldAlert className="w-4 h-4" />
                <span>Operational Safety Recommendations (FRMS SOP)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Operational Action Plan */}
            <div className="p-3 bg-aviation-darkest/70 border border-aviation-border/60 rounded-lg text-xs text-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold font-mono text-slate-200">Dispatch Status:</span>
                <span className={`font-semibold ${
                  category === 'LOW' ? 'text-emerald-400' :
                  category === 'MODERATE' ? 'text-amber-400' :
                  category === 'HIGH' ? 'text-orange-400' : 'text-rose-400 font-black'
                }`}>
                  {category === 'LOW' ? 'Normal Operations Approved' :
                   category === 'MODERATE' ? 'Heightened Monitoring Advised' :
                   category === 'HIGH' ? 'Mitigation Procedures Active' : 'Immediate Supervisor Review Required'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: 6 CONTRIBUTING FACTOR CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
            <span>Contributing Factor Breakdown</span>
            <span className="text-xs text-slate-400 font-normal">(6 Operational Pillars)</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Total Weight: 100 Points</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {factorsArray.map(factor => (
            <FactorCard key={factor.key} factor={factor} />
          ))}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-aviation-border/60">
        <button
          onClick={() => setActiveTab('checkin')}
          className="btn-secondary w-full sm:w-auto"
        >
          <RotateCcw className="w-4 h-4 text-aviation-accent" />
          <span>Re-calculate / Update Today's Check-In</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('history')}
            className="btn-secondary flex-1 sm:flex-initial"
          >
            <span>View 14-Day History</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="btn-primary flex-1 sm:flex-initial"
          >
            <span>Proceed to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
