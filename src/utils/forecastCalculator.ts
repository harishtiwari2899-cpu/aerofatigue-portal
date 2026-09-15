/**
 * AeroFatigue - Predictive Fatigue Forecast & Early Warning Engine
 * Transparent rule-based decision-support model (0-100 pts)
 */

import { calculateDutyDurationHours, getRiskTier } from './fatigueCalculator';

export interface PlannedDutyInputs {
  plannedDutyDate: string;
  plannedDutyStartTime: string;
  plannedDutyEndTime: string;
  expectedShiftType: 'day' | 'early_start' | 'evening' | 'night' | 'wocl_overlap';
  expectedWorkload: 'low' | 'moderate' | 'high' | 'very_high';
  expectedConsecutiveDutyDay: number;
  expectedRecoveryHours: number;
  expectedSleepHours: number;
}

export interface HistoricalRecord {
  date: string;
  sleep: number;
  duty: number;
  shift: string;
  workload: string;
  score: number;
  category: string;
  personnelId?: string;
  priorForecastScore?: number | null;
}

export interface HistoricalAnalysisResult {
  recordCount: number;
  confidence: 'Low Confidence' | 'Moderate Confidence' | 'Higher Confidence';
  confidenceReason: string;
  avgSleep: number;
  avgDuty: number;
  trend: string;
  highRiskCount: number;
  criticalRiskCount: number;
  nightDutyCount: number;
  trendModifier: number;
  sleepDebtModifier: number;
  elevatedRiskModifier: number;
  totalHistoryModifier: number;
  recentRecords: HistoricalRecord[];
}

export interface ForecastWarning {
  type: string;
  text: string;
}

export interface ForecastFactorItem {
  name: string;
  score: number;
  maxScore: number;
  explanation: string;
}

export interface ForecastResult {
  predictedScore: number;
  predictedCategory: 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK' | 'CRITICAL RISK';
  calculatedDutyHours: number;
  confidence: string;
  confidenceReason: string;
  warnings: ForecastWarning[];
  factorBreakdown: ForecastFactorItem[];
  primaryDrivers: ForecastFactorItem[];
  inputs: PlannedDutyInputs;
  historicalAnalysis: HistoricalAnalysisResult;
}

/**
 * Analyzes historical fatigue records for the selected individual
 */
export function analyzeHistoricalFatigue(historyRecords: HistoricalRecord[]): HistoricalAnalysisResult {
  if (!historyRecords || historyRecords.length === 0) {
    return {
      recordCount: 0,
      confidence: 'Low Confidence',
      confidenceReason: 'Limited historical data (0 records) – forecast confidence is reduced.',
      avgSleep: 7.0,
      avgDuty: 8.0,
      trend: 'Stable',
      highRiskCount: 0,
      criticalRiskCount: 0,
      nightDutyCount: 0,
      trendModifier: 0,
      sleepDebtModifier: 0,
      elevatedRiskModifier: 0,
      totalHistoryModifier: 0,
      recentRecords: []
    };
  }

  const sorted = [...historyRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recent = sorted.slice(0, 14);
  const count = recent.length;

  let totalSleep = 0;
  let totalDuty = 0;
  let highCount = 0;
  let critCount = 0;
  let nightCount = 0;

  recent.forEach(r => {
    totalSleep += Number(r.sleep) || 7;
    totalDuty += Number(r.duty) || 8;
    if (r.category === 'HIGH RISK' || r.score >= 50) highCount++;
    if (r.category === 'CRITICAL RISK' || r.score >= 75) critCount++;
    if (r.shift && (r.shift.toLowerCase().includes('night') || r.shift.toLowerCase().includes('wocl'))) nightCount++;
  });

  const avgSleep = Math.round((totalSleep / count) * 10) / 10;
  const avgDuty = Math.round((totalDuty / count) * 10) / 10;

  let trend = 'Stable';
  let trendModifier = 0;
  if (recent.length >= 3) {
    const scoreNewest = recent[0].score;
    const scoreOlder = recent[Math.min(recent.length - 1, 3)].score;
    if (scoreNewest - scoreOlder >= 14) {
      trend = 'Increasing (Deteriorating)';
      trendModifier = 5;
    } else if (scoreNewest - scoreOlder >= 7) {
      trend = 'Slightly Increasing';
      trendModifier = 3;
    } else if (scoreOlder - scoreNewest >= 10) {
      trend = 'Decreasing (Improving)';
      trendModifier = -2;
    }
  }

  let sleepDebtModifier = 0;
  if (avgSleep < 5.5) sleepDebtModifier = 6;
  else if (avgSleep < 6.5) sleepDebtModifier = 3;

  let elevatedRiskModifier = 0;
  if (critCount >= 1 || highCount >= 2) elevatedRiskModifier = 4;
  else if (highCount === 1) elevatedRiskModifier = 2;

  const totalHistoryModifier = Math.max(-2, Math.min(15, trendModifier + sleepDebtModifier + elevatedRiskModifier));

  let confidence: 'Low Confidence' | 'Moderate Confidence' | 'Higher Confidence' = 'Low Confidence';
  let confidenceReason = '';
  if (count <= 2) {
    confidence = 'Low Confidence';
    confidenceReason = `Limited historical data (${count} record${count === 1 ? '' : 's'}) – forecast confidence is reduced.`;
  } else if (count <= 6) {
    confidence = 'Moderate Confidence';
    confidenceReason = `${count} historical records analyzed across past operational shifts. Prototype confidence based on data quantity.`;
  } else {
    confidence = 'Higher Confidence';
    confidenceReason = `${count} recent telemetry logs available for consistent multi-shift trend evaluation.`;
  }

  return {
    recordCount: count,
    confidence,
    confidenceReason,
    avgSleep,
    avgDuty,
    trend,
    highRiskCount: highCount,
    criticalRiskCount: critCount,
    nightDutyCount: nightCount,
    trendModifier,
    sleepDebtModifier,
    elevatedRiskModifier,
    totalHistoryModifier,
    recentRecords: recent
  };
}

/**
 * Calculates rule-based prototype forecast for next duty
 */
export function calculateFatigueForecast(inputs: PlannedDutyInputs, historicalAnalysis: HistoricalAnalysisResult): ForecastResult {
  const dutyHours = calculateDutyDurationHours(inputs.plannedDutyStartTime, inputs.plannedDutyEndTime);

  // A. Expected Sleep Risk (0-25)
  const expSleepHours = Number(inputs.expectedSleepHours) || 7.0;
  let expSleepRisk = 0;
  if (expSleepHours >= 8.0) expSleepRisk = 0;
  else if (expSleepHours >= 7.0) expSleepRisk = 3;
  else if (expSleepHours >= 6.0) expSleepRisk = 8;
  else if (expSleepHours >= 5.0) expSleepRisk = 15;
  else if (expSleepHours >= 4.0) expSleepRisk = 21;
  else expSleepRisk = 25;

  // B. Expected Duty Duration Risk (0-15)
  let expDutyRisk = 0;
  if (dutyHours < 8.0) expDutyRisk = 0;
  else if (dutyHours < 10.0) expDutyRisk = 3;
  else if (dutyHours < 12.0) expDutyRisk = 7;
  else if (dutyHours < 14.0) expDutyRisk = 11;
  else expDutyRisk = 15;

  // C. Expected Circadian Risk (0-15)
  let expCircadianRisk = 0;
  switch (inputs.expectedShiftType) {
    case 'day': expCircadianRisk = 0; break;
    case 'early_start': expCircadianRisk = 5; break;
    case 'evening': expCircadianRisk = 7; break;
    case 'night': expCircadianRisk = 12; break;
    case 'wocl_overlap': expCircadianRisk = 15; break;
    default: expCircadianRisk = 0;
  }

  // D. Expected Workload Risk (0-10)
  let expWorkloadRisk = 0;
  switch (inputs.expectedWorkload) {
    case 'low': expWorkloadRisk = 0; break;
    case 'moderate': expWorkloadRisk = 3; break;
    case 'high': expWorkloadRisk = 6; break;
    case 'very_high': expWorkloadRisk = 10; break;
    default: expWorkloadRisk = 3;
  }

  // E. Expected Consecutive Duty Risk (0-10)
  const streak = Number(inputs.expectedConsecutiveDutyDay) || 1;
  let expConsecutiveRisk = 0;
  if (streak <= 3) expConsecutiveRisk = 0;
  else if (streak === 4) expConsecutiveRisk = 2;
  else if (streak === 5) expConsecutiveRisk = 4;
  else if (streak === 6) expConsecutiveRisk = 6;
  else if (streak === 7) expConsecutiveRisk = 8;
  else expConsecutiveRisk = 10;

  // F. Expected Recovery Opportunity (0-10)
  const offDuty = Number(inputs.expectedRecoveryHours) || 14.0;
  let expRecoveryRisk = 0;
  if (offDuty >= 14.0) expRecoveryRisk = 0;
  else if (offDuty >= 12.0) expRecoveryRisk = 2;
  else if (offDuty >= 10.0) expRecoveryRisk = 4;
  else if (offDuty >= 8.0) expRecoveryRisk = 7;
  else expRecoveryRisk = 10;

  // G. Historical Trend Modifier (0 to 15)
  const historyModifier = historicalAnalysis ? historicalAnalysis.totalHistoryModifier : 0;

  // Total Predicted Score
  const rawTotal = expSleepRisk + expDutyRisk + expCircadianRisk + expWorkloadRisk + expConsecutiveRisk + expRecoveryRisk + historyModifier;
  const predictedScore = Math.min(100, Math.max(0, rawTotal));
  const predictedCategory = getRiskTier(predictedScore);

  // Early Warning Alerts
  const warnings: ForecastWarning[] = [];
  if (expSleepHours < 5.0) {
    warnings.push({
      type: 'SLEEP_WARNING',
      text: 'Warning: Planned sleep opportunity (<5h) may contribute significantly to elevated operational fatigue risk.'
    });
  }
  if ((inputs.expectedShiftType === 'night' || inputs.expectedShiftType === 'wocl_overlap') && historicalAnalysis && (historicalAnalysis.trendModifier > 0 || historicalAnalysis.nightDutyCount >= 2)) {
    warnings.push({
      type: 'NIGHT_TREND_WARNING',
      text: 'Warning: Night duty combined with an increasing fatigue trend or multiple night shifts may increase operational fatigue risk.'
    });
  }
  if (historicalAnalysis && (historicalAnalysis.highRiskCount >= 2 || historicalAnalysis.criticalRiskCount >= 1)) {
    warnings.push({
      type: 'RECENT_PATTERN_WARNING',
      text: 'Warning: Recent elevated fatigue pattern detected (High/Critical risk events in recent history).'
    });
  }
  if (offDuty < 10.0) {
    warnings.push({
      type: 'RECOVERY_WARNING',
      text: 'Warning: Limited recovery opportunity (<10h off-duty) before planned duty.'
    });
  }

  const factorBreakdown: ForecastFactorItem[] = [
    { name: 'Expected Sleep Risk', score: expSleepRisk, maxScore: 25, explanation: `${expSleepHours}h planned sleep window.` },
    { name: 'Duty Duration Risk', score: expDutyRisk, maxScore: 15, explanation: `${dutyHours}h planned duty period.` },
    { name: 'Circadian / Shift Risk', score: expCircadianRisk, maxScore: 15, explanation: `${inputs.expectedShiftType.replace('_', ' ').toUpperCase()} shift timing.` },
    { name: 'Workload Risk', score: expWorkloadRisk, maxScore: 10, explanation: `${inputs.expectedWorkload.toUpperCase()} task intensity.` },
    { name: 'Consecutive Duty Risk', score: expConsecutiveRisk, maxScore: 10, explanation: `Planned Day ${streak} of duty cycle.` },
    { name: 'Recovery Opportunity Risk', score: expRecoveryRisk, maxScore: 10, explanation: `${offDuty}h rest before duty.` },
    { name: 'Recent Trend / Sleep Debt Modifier', score: historyModifier, maxScore: 15, explanation: `Trend: ${historicalAnalysis ? historicalAnalysis.trend : 'Stable'}, Sleep Debt: ${historicalAnalysis ? historicalAnalysis.avgSleep + 'h avg' : 'N/A'}.` }
  ];

  const sortedDrivers = [...factorBreakdown].sort((a, b) => b.score - a.score);
  const primaryDrivers = sortedDrivers.slice(0, 3).filter(d => d.score > 0);
  if (primaryDrivers.length === 0) primaryDrivers.push(sortedDrivers[0]);

  return {
    predictedScore,
    predictedCategory,
    calculatedDutyHours: dutyHours,
    confidence: historicalAnalysis ? historicalAnalysis.confidence : 'Low Confidence',
    confidenceReason: historicalAnalysis ? historicalAnalysis.confidenceReason : 'Limited data.',
    warnings,
    factorBreakdown,
    primaryDrivers,
    inputs,
    historicalAnalysis
  };
}
