import React, { useState } from 'react';
import { ReactionTest } from './ReactionTest';
import { SafetyBanner } from '../common/SafetyBanner';
import {
  Watch,
  HeartPulse,
  Activity,
  Cpu,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  Zap,
  TrendingDown,
  Sparkles,
  Layers,
  Radio
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';

export const FutureSensorsHub: React.FC = () => {
  const [syncing, setSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('2 mins ago');
  const [activeDevice, setActiveDevice] = useState<string>('garmin');

  // Simulated 12-Hour Fatigue Prediction Curve based on Circadian Rhythm & Sleep Debt
  const forecastData = [
    { hour: '14:00', score: 32, note: 'Post-lunch dip start' },
    { hour: '16:00', score: 28, note: 'Afternoon recovery peak' },
    { hour: '18:00', score: 34, note: 'Maintenance shift handover' },
    { hour: '20:00', score: 42, note: 'Evening fatigue ramp' },
    { hour: '22:00', score: 55, note: 'Melatonin onset' },
    { hour: '00:00', score: 68, note: 'Late night operational strain' },
    { hour: '02:00', score: 79, note: 'WOCL entrance' },
    { hour: '04:00', score: 85, note: 'Peak Circadian Trough (Critical)' },
    { hour: '06:00', score: 76, note: 'Dawn transition' },
    { hour: '08:00', score: 50, note: 'Cortisol awakening boost' },
  ];

  const handleSimulateSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSyncTime('Just now');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>SENSOR TELEMETRY LAB &amp; AI PREDICTION</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 font-mono tracking-wide">
            FUTURE INTEGRATION &amp; SENSOR HUB
          </h1>
          <p className="text-xs text-slate-400">
            Next-generation wearable synchronization, Heart Rate Variability (HRV), and biomathematical fatigue forecasting.
          </p>
        </div>

        <button
          onClick={handleSimulateSync}
          disabled={syncing}
          className="btn-primary text-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Synchronizing Sensors...' : 'Sync Wearables'}</span>
        </button>
      </div>

      <SafetyBanner compact />

      {/* WEARABLES & HRV TELEMETRY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Device 1: Garmin / Apple Watch Aviation */}
        <div className="cockpit-panel p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-aviation-navy text-aviation-accent border border-aviation-border">
                <Watch className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Garmin D2 Mach 1 Pro</h4>
                <span className="text-[10px] text-slate-400 font-mono">Aviation Smartwatch</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              CONNECTED
            </span>
          </div>

          <div className="pt-2 border-t border-aviation-border/60 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Last Sync:</span>
              <span className="text-slate-200">{lastSyncTime}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Rest Pulse:</span>
              <span className="text-emerald-400 font-bold">58 bpm</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Sleep Score:</span>
              <span className="text-aviation-accent font-bold">84 / 100</span>
            </div>
          </div>
        </div>

        {/* Device 2: HRV & Autonomic Stress */}
        <div className="cockpit-panel p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-aviation-navy text-rose-400 border border-aviation-border">
                <HeartPulse className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Heart Rate Variability (HRV)</h4>
                <span className="text-[10px] text-slate-400 font-mono">Autonomic Nervous State</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              OPTIMAL
            </span>
          </div>

          <div className="pt-2 border-t border-aviation-border/60 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">RMSSD Score:</span>
              <span className="text-emerald-400 font-bold">64 ms (High recovery)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Sympathetic Tone:</span>
              <span className="text-slate-200">Low Stress Balance</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Fatigue Modifier:</span>
              <span className="text-emerald-400 font-bold">-3 pts (Recovery Bonus)</span>
            </div>
          </div>
        </div>

        {/* Device 3: Android PWA Status */}
        <div className="cockpit-panel p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-aviation-navy text-amber-400 border border-aviation-border">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Android Flight Tablet</h4>
                <span className="text-[10px] text-slate-400 font-mono">PWA / APK Offline Ready</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              READY
            </span>
          </div>

          <div className="pt-2 border-t border-aviation-border/60 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Offline Sync:</span>
              <span className="text-slate-200">Local Cache Enabled</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Push Alerts:</span>
              <span className="text-emerald-400 font-bold">WOCL Danger Alerts Active</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Mobile Layout:</span>
              <span className="text-slate-200">Touch Optimized</span>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE PVT REACTION TASK */}
      <ReactionTest />

      {/* 12-HOUR PREDICTIVE FATIGUE FORECAST CURVE */}
      <div className="cockpit-panel p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-aviation-accent" />
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
                12-Hour Biomathematical Fatigue Forecast (SAFTE / FAST Model)
              </h3>
              <p className="text-xs text-slate-400">
                Predicts future fatigue score trajectory based on circadian phase and projected wakefulness.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-aviation-darkest px-2.5 py-1 rounded border border-aviation-border text-slate-300">
            ML Predictive Engine v1.8
          </span>
        </div>

        <div className="w-full h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#162C4E" />
              <XAxis dataKey="hour" stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis domain={[0, 100]} stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#060D1A',
                  borderColor: '#234475',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}
              />
              <ReferenceLine y={80} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'CRITICAL 80', fill: '#EF4444', fontSize: 10, position: 'right' }} />
              <ReferenceLine y={60} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'HIGH 60', fill: '#F59E0B', fontSize: 10, position: 'right' }} />

              <Area type="monotone" dataKey="score" name="Predicted Fatigue Risk" stroke="#F97316" fill="url(#forecastGradient)" strokeWidth={2.5} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3 bg-aviation-darkest/70 border border-aviation-border/60 rounded-lg text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400">Circadian Alert:</span>
            <span>Projected peak fatigue risk window predicted at <strong>04:00 UTC</strong> (Score 85/100). Implement controlled rest or shift relief prior to 03:30 UTC.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
