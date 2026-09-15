import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Zap, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';

export const ReactionTest: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'result' | 'early'>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const timeoutRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  const startTest = () => {
    setGameState('waiting');
    setReactionTime(null);

    // Random delay between 1.8s and 4.5s
    const delay = Math.floor(Math.random() * 2700) + 1800;
    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setGameState('ready');
    }, delay);
  };

  const handleAction = () => {
    if (gameState === 'waiting') {
      clearTimeout(timeoutRef.current);
      setGameState('early');
    } else if (gameState === 'ready') {
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      setReactionTime(elapsed);
      setHistory(prev => [elapsed, ...prev].slice(0, 5));
      setGameState('result');
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getEvaluation = (ms: number) => {
    if (ms < 250) return { label: 'OPTIMAL VIGILANCE', color: 'text-emerald-400', desc: 'Fast reaction latency typical of well-rested crew.' };
    if (ms < 350) return { label: 'STANDARD REACTION', color: 'text-sky-400', desc: 'Normal aviation operational reaction speed.' };
    if (ms < 450) return { label: 'MILD SLUGGISHNESS', color: 'text-amber-400', desc: 'Mild cognitive slowing detected.' };
    return { label: 'SIGNIFICANT IMPAIRMENT', color: 'text-rose-400', desc: 'Substantial reaction delay characteristic of severe fatigue.' };
  };

  return (
    <div className="cockpit-panel p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-aviation-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-aviation-accent" />
          <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
            Psychomotor Vigilance Task (PVT) — Quick Alertness Reaction Test
          </h3>
        </div>
        <span className="text-[11px] font-mono text-aviation-accent bg-aviation-navy px-2 py-0.5 rounded border border-aviation-border">
          FAA / NASA FRMS Benchmark
        </span>
      </div>

      <p className="text-xs text-slate-300">
        Measures millisecond behavioral alertness and sustained attention. Tap or click as soon as the target turns <strong>BRIGHT GREEN</strong>.
      </p>

      {/* Interactive Testing Box */}
      <div
        onClick={handleAction}
        className={`h-56 rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none transition-all duration-100 border ${
          gameState === 'idle'
            ? 'bg-aviation-darkest border-aviation-border hover:border-aviation-accent'
            : gameState === 'waiting'
            ? 'bg-rose-950/40 border-rose-500/50'
            : gameState === 'ready'
            ? 'bg-emerald-500 border-emerald-300 shadow-glow-green animate-pulse text-aviation-darkest'
            : gameState === 'early'
            ? 'bg-amber-950/40 border-amber-500/50'
            : 'bg-aviation-darkest border-aviation-border'
        }`}
      >
        {gameState === 'idle' && (
          <div className="space-y-2">
            <Play className="w-10 h-10 text-aviation-accent mx-auto" />
            <div className="text-base font-bold text-slate-100 font-mono">CLICK TO INITIATE PVT TEST</div>
            <div className="text-xs text-slate-400">Wait for the screen to turn GREEN before tapping</div>
          </div>
        )}

        {gameState === 'waiting' && (
          <div className="space-y-2">
            <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-lg font-bold text-rose-300 font-mono">WAIT FOR GREEN SIGNAL...</div>
            <div className="text-xs text-slate-400">Do not click yet</div>
          </div>
        )}

        {gameState === 'ready' && (
          <div className="space-y-1">
            <div className="text-4xl font-black text-aviation-darkest font-mono">TAP NOW!</div>
            <div className="text-xs text-aviation-darkest font-bold font-mono">MEASURING LATENCY...</div>
          </div>
        )}

        {gameState === 'early' && (
          <div className="space-y-2">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
            <div className="text-base font-bold text-amber-300 font-mono">TOO EARLY (FALSE START)</div>
            <div className="text-xs text-slate-400">You clicked before the green signal</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startTest();
              }}
              className="btn-secondary text-xs mt-2"
            >
              Try Again
            </button>
          </div>
        )}

        {gameState === 'result' && reactionTime && (
          <div className="space-y-2">
            <div className="text-4xl font-black font-mono text-slate-100">
              {reactionTime} <span className="text-sm font-normal text-slate-400">ms</span>
            </div>
            <div className={`text-xs font-bold font-mono ${getEvaluation(reactionTime).color}`}>
              {getEvaluation(reactionTime).label}
            </div>
            <p className="text-[11px] text-slate-300 max-w-sm mx-auto">
              {getEvaluation(reactionTime).desc}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startTest();
              }}
              className="btn-primary text-xs mt-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retest Alertness</span>
            </button>
          </div>
        )}
      </div>

      {/* History Trials */}
      {history.length > 0 && (
        <div className="p-3 bg-aviation-darkest/70 rounded-xl border border-aviation-border/60 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Recent Reaction Trials:</span>
          <div className="flex items-center gap-2">
            {history.map((t, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-aviation-navy text-slate-200 border border-aviation-border">
                {t}ms
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
