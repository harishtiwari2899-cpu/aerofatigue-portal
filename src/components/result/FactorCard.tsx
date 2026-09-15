import React from 'react';
import { FactorScore } from '../../types/fatigue';
import { Moon, Clock, Compass, Activity, CalendarDays, Brain, AlertTriangle, ShieldCheck } from 'lucide-react';

interface FactorCardProps {
  factor: FactorScore;
}

export const FactorCard: React.FC<FactorCardProps> = ({ factor }) => {
  const getIcon = () => {
    switch (factor.key) {
      case 'sleep':
        return <Moon className="w-4 h-4 text-aviation-accent" />;
      case 'duty':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'circadian':
        return <Compass className="w-4 h-4 text-indigo-400" />;
      case 'workload':
        return <Activity className="w-4 h-4 text-rose-400" />;
      case 'consecutiveDays':
        return <CalendarDays className="w-4 h-4 text-teal-400" />;
      case 'selfReport':
        return <Brain className="w-4 h-4 text-purple-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const getProgressColor = () => {
    switch (factor.level) {
      case 'low':
        return 'bg-emerald-500';
      case 'moderate':
        return 'bg-amber-500';
      case 'high':
        return 'bg-orange-500';
      case 'critical':
        return 'bg-rose-500';
    }
  };

  const getBadgeStyle = () => {
    switch (factor.level) {
      case 'low':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'moderate':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'high':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'critical':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    }
  };

  return (
    <div className="bg-aviation-dark/80 border border-aviation-border/80 rounded-xl p-4 flex flex-col justify-between hover:border-aviation-borderLight transition-all">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-aviation-navy border border-aviation-border">
              {getIcon()}
            </div>
            <h4 className="text-xs font-bold text-slate-200">{factor.name}</h4>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getBadgeStyle()}`}>
            {factor.level}
          </span>
        </div>

        {/* Score & Bar */}
        <div className="my-2.5">
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-400">Contribution:</span>
            <span className="font-bold text-slate-100">
              {factor.score} <span className="text-slate-500 font-normal">/ {factor.maxScore} pts</span>
            </span>
          </div>
          <div className="w-full h-2 bg-aviation-darkest rounded-full overflow-hidden border border-aviation-border/60">
            <div
              className={`h-full ${getProgressColor()} transition-all duration-700`}
              style={{ width: `${Math.max(4, factor.percentage)}%` }}
            />
          </div>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed mt-2">
          {factor.description}
        </p>
      </div>
    </div>
  );
};
