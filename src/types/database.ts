import { FatigueFormData, RiskCategory } from './fatigue';
import { PlannedDutyInputs, ForecastWarning, ForecastFactorItem } from '../utils/forecastCalculator';

export interface StoredFatigueAssessment {
  id: string;
  personnelId: string;
  userId: string;
  assessmentDate: string;
  assessmentTime: string;
  inputs: FatigueFormData;
  factorScores: {
    sleep: number;
    duty: number;
    circadian: number;
    consecutive: number;
    workload: number;
    samnPerelli: number;
    recovery: number;
  };
  totalScore: number;
  riskCategory: RiskCategory;
  baseCategory: RiskCategory;
  escalated: boolean;
  criticalTriggers: Array<{ type: string; title: string; description: string }>;
  primaryDrivers: Array<{ name: string; score: number }>;
  recommendations: string;
  modelVersion: string;
  isEdited: boolean;
  originalRecordId?: string;
  editedBy?: string;
  editReason?: string;
  editedAt?: string;
  createdAt: string;
}

export interface StoredFatigueForecast {
  id: string;
  personnelId: string;
  userId: string;
  plannedDutyDate: string;
  forecastInputs: PlannedDutyInputs;
  predictedScore: number;
  predictedCategory: RiskCategory;
  confidence: string;
  confidenceReason: string;
  warnings: ForecastWarning[];
  factorBreakdown: ForecastFactorItem[];
  primaryDrivers: Array<{ name: string; score: number }>;
  modelVersion: string;
  createdAt: string;
}

export interface StoredForecastComparison {
  id: string;
  forecastId: string;
  assessmentId: string;
  personnelId: string;
  plannedDate: string;
  predictedScore: number;
  actualScore: number;
  difference: number;
  accuracyTier: string;
  calculatedAt: string;
}
