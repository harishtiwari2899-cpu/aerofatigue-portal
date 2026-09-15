import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  BarChart,
  Bar,
  Legend,
  Area,
  ComposedChart
} from 'recharts';
import { FatigueRecord } from '../../types/fatigue';

interface TrendChartProps {
  records: FatigueRecord[];
}

export const FatigueTrendChart: React.FC<TrendChartProps> = ({ records }) => {
  // Sort ascending by date for timeline
  const chartData = [...records]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7)
    .map(r => ({
      date: r.date.slice(5), // 'MM-DD'
      fullDate: r.date,
      score: r.score,
      category: r.category,
      sleep: r.sleepHours,
      duty: r.dutyHours
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-aviation-darkest border border-aviation-border p-3 rounded-lg shadow-xl text-xs font-mono">
          <div className="font-bold text-slate-200 border-b border-aviation-border pb-1 mb-1.5">
            Date: {data.fullDate}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Fatigue Score:</span>
            <span className="font-bold text-aviation-accent">{data.score} / 100</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-slate-400">Risk Level:</span>
            <span className={`font-bold ${
              data.score <= 30 ? 'text-emerald-400' :
              data.score <= 60 ? 'text-amber-400' :
              data.score <= 80 ? 'text-orange-400' : 'text-rose-400'
            }`}>
              {data.category}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Sleep: {data.sleep}h • Duty: {data.duty}h
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#162C4E" />
          <XAxis
            dataKey="date"
            stroke="#64748B"
            tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }}
          />
          <YAxis
            domain={[0, 100]}
            stroke="#64748B"
            tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Risk Threshold Reference Lines */}
          <ReferenceLine y={30} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'LOW 30', fill: '#10B981', fontSize: 10, position: 'right' }} />
          <ReferenceLine y={60} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'MOD 60', fill: '#F59E0B', fontSize: 10, position: 'right' }} />
          <ReferenceLine y={80} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'HIGH 80', fill: '#EF4444', fontSize: 10, position: 'right' }} />

          <Area
            type="monotone"
            dataKey="score"
            fill="url(#scoreGradient)"
            stroke="#00E5FF"
            strokeWidth={3}
            dot={{ r: 4, fill: '#00E5FF', stroke: '#060D1A', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#33EBFF', stroke: '#FFFFFF', strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export const SleepVsDutyChart: React.FC<TrendChartProps> = ({ records }) => {
  const chartData = [...records]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7)
    .map(r => ({
      date: r.date.slice(5),
      fullDate: r.date,
      sleep: r.sleepHours,
      duty: r.dutyHours
    }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#162C4E" />
          <XAxis
            dataKey="date"
            stroke="#64748B"
            tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }}
          />
          <YAxis
            domain={[0, 16]}
            stroke="#64748B"
            tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }}
            unit="h"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#060D1A',
              borderColor: '#234475',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
          <Bar dataKey="sleep" name="Sleep Hours" fill="#00E5FF" radius={[4, 4, 0, 0]} />
          <Bar dataKey="duty" name="Duty Hours" fill="#F59E0B" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
