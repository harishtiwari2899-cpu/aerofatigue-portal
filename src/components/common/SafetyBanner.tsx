import React, { useState } from 'react';
import { ShieldAlert, Info, ChevronDown, ChevronUp } from 'lucide-react';

export const SafetyBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [expanded, setExpanded] = useState(false);

  if (compact) {
    return (
      <div className="bg-aviation-navy/90 border border-aviation-border/80 rounded-lg px-3 py-2 text-xs text-slate-300 flex items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Safety Notice:</strong> Operational decision-support tool only. Does not provide medical diagnosis.
          </span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-aviation-accent hover:underline text-[11px] font-mono shrink-0 ml-2"
        >
          {expanded ? 'Less' : 'Policy'}
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Aviation Safety Disclaimer"
      className="bg-gradient-to-r from-aviation-navy/90 via-aviation-card/80 to-aviation-navy/90 border border-amber-500/30 rounded-xl p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-100 tracking-wide">
                OPERATIONAL SAFETY & FRMS DECISION-SUPPORT NOTICE
              </h4>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-amber-500/30">
                ICAO / FAA COMPLIANT
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              This system provides an <strong>operational fatigue risk estimate</strong> and is intended as a decision-support tool. It does not provide a medical diagnosis and should not be used as the sole basis for determining fitness for duty.
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 p-1 hover:bg-aviation-card rounded transition-colors"
          title="Toggle FRMS Policy Details"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-aviation-border/60 text-xs text-slate-400 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className="bg-aviation-darkest/60 p-2.5 rounded border border-aviation-border/40">
              <strong className="text-slate-200 block mb-1">Crew Duty & Reporting Obligation:</strong>
              Personnel experiencing acute fatigue symptoms or incapacitation must immediately exercise safety pause rights and report through standard Fatigue Hazard Reporting (FHR) channels.
            </div>
            <div className="bg-aviation-darkest/60 p-2.5 rounded border border-aviation-border/40">
              <strong className="text-slate-200 block mb-1">Data Privacy Safeguard:</strong>
              Supervisory views anonymize granular sleep and physiological metrics, exposing only operational risk categories and duty mitigation statuses.
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
