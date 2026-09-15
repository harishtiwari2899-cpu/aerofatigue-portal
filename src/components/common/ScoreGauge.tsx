import React from 'react';
import { RiskCategory } from '../../types/fatigue';

interface ScoreGaugeProps {
  score: number;
  category: RiskCategory;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showCategoryLabel?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  category,
  size = 'hero',
  showCategoryLabel = true
}) => {
  // Determine color based on risk category
  const getColor = () => {
    switch (category) {
      case 'LOW':
        return {
          stroke: '#10B981',
          glow: 'rgba(16, 185, 129, 0.4)',
          text: 'text-emerald-400',
          bgRing: 'rgba(16, 185, 129, 0.15)',
        };
      case 'MODERATE':
        return {
          stroke: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.4)',
          text: 'text-amber-400',
          bgRing: 'rgba(245, 158, 11, 0.15)',
        };
      case 'HIGH':
        return {
          stroke: '#F97316',
          glow: 'rgba(249, 115, 22, 0.45)',
          text: 'text-orange-400',
          bgRing: 'rgba(249, 115, 22, 0.15)',
        };
      case 'CRITICAL':
        return {
          stroke: '#EF4444',
          glow: 'rgba(239, 68, 68, 0.6)',
          text: 'text-rose-400',
          bgRing: 'rgba(239, 68, 68, 0.2)',
        };
    }
  };

  const colors = getColor();

  // SVG dimensions
  const dimensionMap = {
    sm: { size: 100, strokeWidth: 8, radius: 40, textSize: 'text-2xl', subText: 'text-[9px]' },
    md: { size: 140, strokeWidth: 10, radius: 56, textSize: 'text-3xl', subText: 'text-[11px]' },
    lg: { size: 190, strokeWidth: 12, radius: 76, textSize: 'text-4xl', subText: 'text-xs' },
    hero: { size: 240, strokeWidth: 14, radius: 98, textSize: 'text-6xl', subText: 'text-sm' },
  };

  const { size: dim, strokeWidth, radius, textSize, subText } = dimensionMap[size];
  const circumference = 2 * Math.PI * radius;
  // Arc spans 260 degrees (leaving bottom gap for avionics meter feel)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * Math.min(100, Math.max(0, score))) / 100;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        width={dim}
        height={dim}
        viewBox={`0 0 ${dim} ${dim}`}
        className="transform -rotate-90"
      >
        {/* Background Track Arc */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke="#162C4E"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          className="opacity-70"
        />

        {/* Animated Value Arc */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 10px ${colors.glow})`,
            transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease'
          }}
        />

        {/* Decorative inner HUD ring */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius - strokeWidth - 4}
          fill="none"
          stroke="#234475"
          strokeWidth={1}
          strokeDasharray="4 6"
          className="opacity-40"
        />
      </svg>

      {/* Center Value Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`font-mono font-extrabold tracking-tight ${textSize} ${colors.text}`}>
          {score}
        </span>
        <span className={`font-medium tracking-wider uppercase text-slate-400 ${subText}`}>
          / 100 Score
        </span>
      </div>

      {showCategoryLabel && (
        <div className="mt-2 text-center">
          <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
            Fatigue Risk Level
          </span>
        </div>
      )}
    </div>
  );
};
