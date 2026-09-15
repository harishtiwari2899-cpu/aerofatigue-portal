export type UserRole = 'aircrew' | 'ground_crew' | 'supervisor';

export type RiskCategory = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type ShiftType = 'day' | 'evening' | 'night' | 'early_morning';

export type WorkloadLevel = 'low' | 'moderate' | 'high' | 'very_high';

export interface SelfReportRatings {
  physical: number;   // 1 (fresh) to 5 (exhausted)
  mental: number;     // 1 (sharp) to 5 (brain fog/drained)
  alertness: number;  // 1 (extremely alert) to 5 (drowsy/struggling)
  sleepiness: number; // 1 (wide awake) to 5 (fighting sleep)
}

export interface AircrewCheckinData {
  // Sleep Information
  sleepHours: number;
  sleepQuality: number; // 1-5
  wakeups: number;
  sleepStartTime: string;
  sleepEndTime: string;

  // Duty Information
  dutyStartTime: string;
  expectedDutyEndTime: string;
  previousDutyHours: number;
  consecutiveDutyDays: number;

  // Flight Specifics
  flyingHours: number;
  sortiesCount: number;
  shiftType: ShiftType;
  workload: WorkloadLevel;

  // Self-reported
  selfReport: SelfReportRatings;
}

export interface GroundCrewCheckinData {
  // Sleep Information
  sleepHours: number;
  sleepQuality: number; // 1-5
  wakeups: number;
  sleepStartTime: string;
  sleepEndTime: string;

  // Shift Information
  shiftStartTime: string;
  expectedShiftEndTime: string;
  maintenanceHours: number;
  breakDurationMinutes: number;
  overtimeHours: number;
  consecutiveDutyDays: number;

  // Ground Specifics
  shiftType: ShiftType;
  physicalWorkload: WorkloadLevel;

  // Self-reported
  selfReport: SelfReportRatings;
}

export interface FactorScore {
  key: string;
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
  recommendation?: string;
}

export interface FatigueCalculationResult {
  totalScore: number;
  category: RiskCategory;
  categoryLabel: string;
  factorScores: {
    sleep: FactorScore;
    duty: FactorScore;
    circadian: FactorScore;
    workload: FactorScore;
    consecutiveDays: FactorScore;
    selfReport: FactorScore;
  };
  primaryContributors: string[];
  explanation: string;
  recommendations: string[];
  operationalActions: string[];
  calculatedAt: string;
}

export interface FatigueRecord {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  callSign?: string;
  badgeId: string;
  baseStation: string;
  fleetOrUnit: string;
  date: string;
  timestamp: string;
  sleepHours: number;
  dutyHours: number;
  shiftType: ShiftType;
  workload: WorkloadLevel;
  score: number;
  category: RiskCategory;
  result: FatigueCalculationResult;
  mitigationStatus?: 'None' | 'Controlled Rest Approved' | 'Secondary Review Scheduled' | 'Relief Crew Assigned' | 'Shift Shortened';
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  callSign?: string;
  badgeId: string;
  baseStation: string;
  fleetOrUnit: string;
  avatar: string;
  lastCheckinScore?: number;
  lastCheckinCategory?: RiskCategory;
}
