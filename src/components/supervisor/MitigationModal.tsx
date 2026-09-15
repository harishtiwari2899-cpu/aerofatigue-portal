import React, { useState } from 'react';
import { FatigueRecord } from '../../types/fatigue';
import { ShieldAlert, CheckCircle2, X, AlertTriangle, User, FileText } from 'lucide-react';

interface MitigationModalProps {
  record: FatigueRecord;
  onClose: () => void;
  onApply: (recordId: string, mitigation: NonNullable<FatigueRecord['mitigationStatus']>) => void;
}

export const MitigationModal: React.FC<MitigationModalProps> = ({ record, onClose, onApply }) => {
  const [selectedMitigation, setSelectedMitigation] = useState<NonNullable<FatigueRecord['mitigationStatus']>>(
    record.category === 'CRITICAL' ? 'Shift Shortened' : 'Controlled Rest Approved'
  );
  const [notes, setNotes] = useState<string>('');

  const isAircrew = record.role === 'aircrew';

  const aircrewMitigations: Array<{ label: NonNullable<FatigueRecord['mitigationStatus']>; desc: string }> = [
    { label: 'Controlled Rest Approved', desc: 'Authorize 20-30 min controlled rest in cockpit cruise phase with alert co-pilot' },
    { label: 'Relief Crew Assigned', desc: 'Dispatch augmentation pilot from reserve pool to relieve high-risk duty sector' },
    { label: 'Secondary Review Scheduled', desc: 'Chief Pilot consultation & cross-check before subsequent dispatch' },
    { label: 'Shift Shortened', desc: 'Curtail flight duty period at next waypoint / base transfer' },
  ];

  const groundCrewMitigations: Array<{ label: NonNullable<FatigueRecord['mitigationStatus']>; desc: string }> = [
    { label: 'Secondary Review Scheduled', desc: 'Mandatory Independent Required Inspection Item (RII) for all sign-offs' },
    { label: 'Shift Shortened', desc: 'Release technician early from high-power engine / hazardous tasks' },
    { label: 'Controlled Rest Approved', desc: 'Schedule 45 min tactical recovery rest in crew break facility' },
  ];

  const mitigationsList = isAircrew ? aircrewMitigations : groundCrewMitigations;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(record.id, selectedMitigation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-aviation-darkest border border-aviation-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-aviation-border/60 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-aviation-accent" />
            <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
              Assign Operational Fatigue Mitigation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-aviation-navy"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Personnel Header Info */}
        <div className="p-3 bg-aviation-navy/70 border border-aviation-border/60 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-100">{record.userName}</div>
            <div className="text-[11px] text-slate-400 font-mono">
              Badge: {record.badgeId} • {record.callSign || record.fleetOrUnit}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono font-bold text-slate-100">
              Score: <span className="text-rose-400">{record.score}/100</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">{record.category} RISK</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
              Select FRMS SOP Approved Countermeasure:
            </label>
            <div className="space-y-2">
              {mitigationsList.map(item => (
                <label
                  key={item.label}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedMitigation === item.label
                      ? 'bg-aviation-accent/15 border-aviation-accent text-slate-100 font-semibold'
                      : 'bg-aviation-navy/40 border-aviation-border text-slate-300 hover:bg-aviation-card'
                  }`}
                >
                  <input
                    type="radio"
                    name="mitigation"
                    checked={selectedMitigation === item.label}
                    onChange={() => setSelectedMitigation(item.label)}
                    className="mt-1 accent-aviation-accent"
                  />
                  <div>
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[11px] text-slate-400 font-normal mt-0.5">{item.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Supervisor Operational Notes / Dispatch Log (Optional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              className="cockpit-input w-full text-xs font-mono"
              placeholder="e.g. Co-pilot notified. Secondary inspection lead assigned to line check."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-aviation-border/60">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm &amp; Log Mitigation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
