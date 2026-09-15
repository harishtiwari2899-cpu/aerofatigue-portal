import React from 'react';

interface FactorSliderProps {
  label: string;
  sublabel?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
  unit?: string;
  valueLabels?: Record<number, string>;
  inverted?: boolean;
}

export const FactorSlider: React.FC<FactorSliderProps> = ({
  label,
  sublabel,
  value,
  min = 1,
  max = 5,
  step = 1,
  onChange,
  unit = '',
  valueLabels,
  inverted = false
}) => {
  const currentLabel = valueLabels ? valueLabels[value] : undefined;

  // Determine indicator color based on severity
  const getBadgeColor = () => {
    const effectiveVal = inverted ? (max + min - value) : value;
    const ratio = (effectiveVal - min) / (max - min);
    if (ratio <= 0.25) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (ratio <= 0.5) return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
    if (ratio <= 0.75) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  };

  return (
    <div className="bg-aviation-darkest/70 border border-aviation-border/80 rounded-xl p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <span className="text-xs font-semibold text-slate-200 block">{label}</span>
          {sublabel && <span className="text-[11px] text-slate-400">{sublabel}</span>}
        </div>
        <div className={`px-2.5 py-1 rounded-md border text-xs font-mono font-bold shrink-0 ${getBadgeColor()}`}>
          {value} {unit} {currentLabel && `— ${currentLabel}`}
        </div>
      </div>

      <div className="space-y-1.5 pt-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-aviation-navy rounded-lg appearance-none cursor-pointer accent-aviation-accent"
        />

        {valueLabels && (
          <div className="flex justify-between text-[10px] text-slate-500 font-mono px-0.5">
            <span>{valueLabels[min] || min}</span>
            <span>{valueLabels[max] || max}</span>
          </div>
        )}
      </div>
    </div>
  );
};
