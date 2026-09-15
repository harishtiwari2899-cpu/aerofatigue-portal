/**
 * AeroFatigue - Evidence-Informed Aviation Operational Fatigue Scoring Engine (0-100 pts)
 * 
 * PROTOTYPE DECISION-SUPPORT SYSTEM ONLY.
 * Does not determine medical fitness, legal flight-duty compliance, maintenance authorization,
 * or replace organizational FRMS procedures.
 */

export interface FatigueInputs {
  sleepHours: number;
  sleepQuality: 'very_good' | 'good' | 'adequate' | 'poor' | 'very_poor';
  awakenings: number; // 0, 1, 2, 3, 4+
  dutyStartTime: string; // HH:mm
  expectedDutyEndTime: string; // HH:mm
  shiftType: 'day' | 'early_start' | 'evening' | 'night' | 'wocl_overlap';
  consecutiveDutyDays: number;
  workloadLevel: 'low' | 'moderate' | 'high' | 'very_high';
  samnPerelli: number; // 1 to 7
  offDutyHours: number; // Hours available off-duty
  groundTaskDemand?: string;
}

export interface FactorDetail {
  key: string;
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  desc: string;
}

export interface CriticalAttentionTrigger {
  type: 'HIGH_ATTENTION' | 'COMPOUND_ESCALATION';
  title: string;
  description: string;
}

export interface FatigueCalculationResult {
  totalScore: number;
  category: 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK' | 'CRITICAL RISK';
  baseCategory: 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK' | 'CRITICAL RISK';
  escalated: boolean;
  criticalTriggers: CriticalAttentionTrigger[];
  factorList: FactorDetail[];
  topContributors: FactorDetail[];
  explanation: string;
  calculatedDutyHours: number;
  inputs: FatigueInputs;
}

/**
 * Calculates duty duration in hours from start and end time strings (HH:mm),
 * correctly handling overnight duty periods crossing midnight.
 */
export function calculateDutyDurationHours(startTimeStr: string, endTimeStr: string): number {
  if (!startTimeStr || !endTimeStr) return 8.0;
  try {
    const [startH, startM] = startTimeStr.split(':').map(Number);
    const [endH, endM] = endTimeStr.split(':').map(Number);
    let startMins = startH * 60 + startM;
    let endMins = endH * 60 + endM;
    if (endMins < startMins) {
      endMins += 24 * 60; // Crosses midnight
    }
    const diffMins = endMins - startMins;
    return Math.round((diffMins / 60) * 10) / 10;
  } catch {
    return 8.0;
  }
}

/**
 * 1. SLEEP RISK (Max 30 points)
 */
export function calculateSleepRisk(sleepHours: number, sleepQuality: string, awakenings: number): number {
  let durationScore = 0;
  if (sleepHours >= 8.0) durationScore = 0;
  else if (sleepHours >= 7.0) durationScore = 3;
  else if (sleepHours >= 6.0) durationScore = 8;
  else if (sleepHours >= 5.0) durationScore = 15;
  else if (sleepHours >= 4.0) durationScore = 21;
  else durationScore = 25;

  let qualityScore = 0;
  switch (sleepQuality) {
    case 'very_good': qualityScore = 0; break;
    case 'good': qualityScore = 1; break;
    case 'adequate': qualityScore = 2; break;
    case 'poor': qualityScore = 4; break;
    case 'very_poor': qualityScore = 5; break;
    default: qualityScore = 1;
  }

  let awakeningsScore = 0;
  if (awakenings <= 1) awakeningsScore = 0;
  else if (awakenings === 2) awakeningsScore = 1;
  else if (awakenings === 3) awakeningsScore = 2;
  else awakeningsScore = 3;

  return Math.min(30, durationScore + qualityScore + awakeningsScore);
}

/**
 * 2. DUTY DURATION RISK (Max 15 points)
 */
export function calculateDutyDurationRisk(dutyHours: number): number {
  if (dutyHours < 8.0) return 0;
  if (dutyHours < 10.0) return 3;
  if (dutyHours < 12.0) return 7;
  if (dutyHours < 14.0) return 11;
  return 15;
}

/**
 * 3. CIRCADIAN / SHIFT RISK (Max 15 points)
 */
export function calculateCircadianRisk(shiftType: string): number {
  switch (shiftType) {
    case 'day': return 0;
    case 'early_start': return 5;
    case 'evening': return 7;
    case 'night': return 12;
    case 'wocl_overlap': return 15;
    default: return 0;
  }
}

/**
 * 4. CONSECUTIVE DUTY DAYS RISK (Max 10 points)
 */
export function calculateConsecutiveDutyRisk(days: number): number {
  if (days <= 3) return 0;
  if (days === 4) return 2;
  if (days === 5) return 4;
  if (days === 6) return 6;
  if (days === 7) return 8;
  return 10;
}

/**
 * 5. WORKLOAD / TASK DEMAND (Max 10 points)
 */
export function calculateWorkloadRisk(level: string): number {
  switch (level) {
    case 'low': return 0;
    case 'moderate': return 3;
    case 'high': return 6;
    case 'very_high': return 10;
    default: return 3;
  }
}

/**
 * 6. SUBJECTIVE FATIGUE — SAMN-PERELLI CREW STATUS CHECK (1 to 7) (Max 10 points)
 */
export function calculateSamnPerelliRisk(rating: number): number {
  const r = Number(rating) || 1;
  if (r <= 2) return 0;
  if (r === 3) return 1;
  if (r === 4) return 3;
  if (r === 5) return 5;
  if (r === 6) return 7;
  return 10;
}

/**
 * 7. RECOVERY OPPORTUNITY (Max 10 points)
 */
export function calculateRecoveryOpportunityRisk(offDutyHours: number): number {
  const h = Number(offDutyHours) || 14.0;
  if (h >= 14.0) return 0;
  if (h >= 12.0) return 2;
  if (h >= 10.0) return 4;
  if (h >= 8.0) return 7;
  return 10;
}

export function getRiskTier(score: number): 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK' | 'CRITICAL RISK' {
  if (score <= 24) return 'LOW RISK';
  if (score <= 49) return 'MODERATE RISK';
  if (score <= 74) return 'HIGH RISK';
  return 'CRITICAL RISK';
}

export function escalateRiskCategory(currentTier: 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK' | 'CRITICAL RISK'): 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK' | 'CRITICAL RISK' {
  if (currentTier === 'LOW RISK') return 'MODERATE RISK';
  if (currentTier === 'MODERATE RISK') return 'HIGH RISK';
  return 'CRITICAL RISK';
}

export function getSamnPerelliText(rating: number): string {
  switch (Number(rating)) {
    case 1: return 'Fully alert, wide awake';
    case 2: return 'Very lively and responsive';
    case 3: return 'Okay, somewhat fresh';
    case 4: return 'A little tired';
    case 5: return 'Moderately tired';
    case 6: return 'Extremely tired and difficult to concentrate';
    case 7: return 'Completely exhausted';
    default: return 'Okay, somewhat fresh';
  }
}

/**
 * Full Evidence-Informed Fatigue Risk Calculation
 */
export function calculateOperationalFatigue(inputs: FatigueInputs): FatigueCalculationResult {
  const dutyHours = calculateDutyDurationHours(inputs.dutyStartTime, inputs.expectedDutyEndTime);

  const sleepScore = calculateSleepRisk(inputs.sleepHours, inputs.sleepQuality, inputs.awakenings);
  const dutyScore = calculateDutyDurationRisk(dutyHours);
  const circadianScore = calculateCircadianRisk(inputs.shiftType);
  const consecutiveScore = calculateConsecutiveDutyRisk(inputs.consecutiveDutyDays);
  const workloadScore = calculateWorkloadRisk(inputs.workloadLevel);
  const samnPerelliScore = calculateSamnPerelliRisk(inputs.samnPerelli);
  const recoveryScore = calculateRecoveryOpportunityRisk(inputs.offDutyHours);

  const rawTotal = sleepScore + dutyScore + circadianScore + consecutiveScore + workloadScore + samnPerelliScore + recoveryScore;
  const totalScore = Math.min(100, Math.max(0, rawTotal));

  const baseCategory = getRiskTier(totalScore);
  let finalCategory = baseCategory;
  let escalated = false;

  const criticalTriggers: CriticalAttentionTrigger[] = [];
  const isNightDuty = inputs.shiftType === 'night' || inputs.shiftType === 'wocl_overlap';

  if (inputs.sleepHours < 4.0 && isNightDuty) {
    criticalTriggers.push({
      type: 'HIGH_ATTENTION',
      title: 'High Attention Trigger: Acute Sleep Deprivation on Night Shift',
      description: 'Sleep duration under 4 hours combined with night/biological night operations severely impairs cognitive vigilance.'
    });
  }

  if (dutyHours >= 14.0 && (inputs.workloadLevel === 'high' || inputs.workloadLevel === 'very_high')) {
    criticalTriggers.push({
      type: 'HIGH_ATTENTION',
      title: 'High Attention Trigger: Extended Duty with Intensive Workload',
      description: 'Duty duration of 14+ hours combined with high safety-critical task demand significantly increases procedural error risk.'
    });
  }

  if (inputs.sleepHours < 5.0 && isNightDuty && dutyHours > 12.0) {
    finalCategory = escalateRiskCategory(baseCategory);
    escalated = true;
    criticalTriggers.push({
      type: 'COMPOUND_ESCALATION',
      title: 'Compound Risk Escalation: Multi-Factor Severe Fatigue',
      description: `Simultaneous occurrence of acute sleep debt (<5h), night duty, and extended duty (>12h). Escalated from ${baseCategory} to ${finalCategory}.`
    });
  }

  const factorList: FactorDetail[] = [
    {
      key: 'sleep',
      name: 'Sleep Risk',
      score: sleepScore,
      maxScore: 30,
      percentage: Math.round((sleepScore / 30) * 100),
      desc: `${inputs.sleepHours}h sleep duration (${inputs.sleepQuality.replace('_', ' ')} quality, ${inputs.awakenings} awakenings).`
    },
    {
      key: 'duty',
      name: 'Duty Duration Risk',
      score: dutyScore,
      maxScore: 15,
      percentage: Math.round((dutyScore / 15) * 100),
      desc: `${dutyHours}h calculated duty (${inputs.dutyStartTime} to ${inputs.expectedDutyEndTime}).`
    },
    {
      key: 'circadian',
      name: 'Circadian / Shift Risk',
      score: circadianScore,
      maxScore: 15,
      percentage: Math.round((circadianScore / 15) * 100),
      desc: `${inputs.shiftType === 'wocl_overlap' ? 'Duty substantially overlaps biological night (WOCL)' : inputs.shiftType.replace('_', ' ').toUpperCase() + ' shift'}. Circadian strain depends on biological body clock.`
    },
    {
      key: 'consecutive',
      name: 'Consecutive Duty Days',
      score: consecutiveScore,
      maxScore: 10,
      percentage: Math.round((consecutiveScore / 10) * 100),
      desc: `Day ${inputs.consecutiveDutyDays} of active duty cycle.`
    },
    {
      key: 'workload',
      name: 'Workload / Task Demand',
      score: workloadScore,
      maxScore: 10,
      percentage: Math.round((workloadScore / 10) * 100),
      desc: `${inputs.workloadLevel.replace('_', ' ').toUpperCase()} intensity task demand.`
    },
    {
      key: 'samnPerelli',
      name: 'Subjective Fatigue (Samn-Perelli)',
      score: samnPerelliScore,
      maxScore: 10,
      percentage: Math.round((samnPerelliScore / 10) * 100),
      desc: `Samn-Perelli Level ${inputs.samnPerelli}/7 (${getSamnPerelliText(inputs.samnPerelli)}).`
    },
    {
      key: 'recovery',
      name: 'Recovery Opportunity',
      score: recoveryScore,
      maxScore: 10,
      percentage: Math.round((recoveryScore / 10) * 100),
      desc: `${inputs.offDutyHours}h available off-duty since previous duty shift.`
    }
  ];

  const sortedFactors = [...factorList].sort((a, b) => b.percentage - a.percentage);
  const topContributors = sortedFactors.slice(0, 3).filter(f => f.score > 0);
  if (topContributors.length === 0) topContributors.push(sortedFactors[0]);

  const topNames = topContributors.map(f => f.name.toLowerCase());
  let explanation = '';
  if (finalCategory === 'LOW RISK') {
    explanation = `Operational fatigue risk is within optimal margins (${totalScore}/100). Biological rest and duty parameters support normal cognitive performance.`;
  } else if (finalCategory === 'MODERATE RISK') {
    explanation = `Fatigue risk is MODERATE (${totalScore}/100), driven primarily by ${topNames.join(' and ')}. Routine CRM vigilance and tactical rest pacing are advised.`;
  } else if (finalCategory === 'HIGH RISK') {
    explanation = `Fatigue risk is HIGH (${totalScore}/100) primarily influenced by ${topNames.join(', ')}. Increased cross-check frequency and task reviews are recommended.`;
  } else {
    explanation = `CRITICAL FATIGUE RISK (${totalScore}/100). Severe risk elevation driven by ${topNames.join(', ')}. Elevated probability of lapses and micro-sleeps; supervisor operational review is required.`;
  }

  return {
    totalScore,
    category: finalCategory,
    baseCategory,
    escalated,
    criticalTriggers,
    factorList,
    topContributors,
    explanation,
    calculatedDutyHours: dutyHours,
    inputs
  };
}
