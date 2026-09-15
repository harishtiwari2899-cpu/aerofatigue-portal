import { UserProfile, FatigueRecord } from '../types/fatigue';
import { MOCK_PROFILES, INITIAL_FATIGUE_RECORDS } from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'aerofatigue_current_user',
  FATIGUE_RECORDS: 'aerofatigue_records',
  CUSTOM_PROFILES: 'aerofatigue_profiles',
};

export function getStoredCurrentUser(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load current user from localStorage', e);
  }
  return MOCK_PROFILES[0]; // Default to Capt. Sarah Jenkins (Aircrew)
}

export function setStoredCurrentUser(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save current user to localStorage', e);
  }
}

export function getStoredRecords(): FatigueRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FATIGUE_RECORDS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load records from localStorage', e);
  }
  // Initialize with rich mock data if empty
  setStoredRecords(INITIAL_FATIGUE_RECORDS);
  return INITIAL_FATIGUE_RECORDS;
}

export function setStoredRecords(records: FatigueRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FATIGUE_RECORDS, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save records to localStorage', e);
  }
}

export function saveNewRecord(record: FatigueRecord): FatigueRecord[] {
  const current = getStoredRecords();
  // Filter out if duplicate ID exists, otherwise prepend
  const updated = [record, ...current.filter(r => r.id !== record.id)];
  setStoredRecords(updated);
  return updated;
}

export function updateRecordMitigation(recordId: string, mitigation: NonNullable<FatigueRecord['mitigationStatus']>): FatigueRecord[] {
  const current = getStoredRecords();
  const updated = current.map(r => r.id === recordId ? { ...r, mitigationStatus: mitigation } : r);
  setStoredRecords(updated);
  return updated;
}

export function resetToDemoData(): FatigueRecord[] {
  setStoredRecords(INITIAL_FATIGUE_RECORDS);
  return INITIAL_FATIGUE_RECORDS;
}
