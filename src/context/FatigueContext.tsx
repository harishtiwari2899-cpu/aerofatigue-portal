import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { UserProfile, UserRole, FatigueRecord, FatigueCalculationResult } from '../types/fatigue';
import { MOCK_PROFILES } from '../utils/mockData';
import {
  getStoredCurrentUser,
  setStoredCurrentUser,
  getStoredRecords,
  saveNewRecord,
  updateRecordMitigation,
  resetToDemoData
} from '../utils/storage';

interface FatigueContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  allProfiles: UserProfile[];
  records: FatigueRecord[];
  userRecords: FatigueRecord[];
  latestUserRecord: FatigueRecord | null;
  currentResult: FatigueCalculationResult | null;
  setCurrentResult: (res: FatigueCalculationResult | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  submitCheckin: (result: FatigueCalculationResult, recordData: Partial<FatigueRecord>) => FatigueRecord;
  applyMitigation: (recordId: string, status: NonNullable<FatigueRecord['mitigationStatus']>) => void;
  resetAllDemoData: () => void;
}

const FatigueContext = createContext<FatigueContextType | undefined>(undefined);

export const FatigueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<UserProfile>(getStoredCurrentUser());
  const [records, setRecords] = useState<FatigueRecord[]>(getStoredRecords());
  const [currentResult, setCurrentResult] = useState<FatigueCalculationResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  useEffect(() => {
    setStoredCurrentUser(currentUser);
  }, [currentUser]);

  const setCurrentUser = (user: UserProfile) => {
    setCurrentUserState(user);
    // When switching user, if they are supervisor, go to supervisor tab; otherwise dashboard
    if (user.role === 'supervisor') {
      setActiveTab('supervisor');
    } else {
      setActiveTab('dashboard');
    }
  };

  const switchRole = (role: UserRole) => {
    const profile = MOCK_PROFILES.find(p => p.role === role) || MOCK_PROFILES[0];
    setCurrentUser(profile);
  };

  const userRecords = useMemo(() => {
    return records
      .filter(r => r.userId === currentUser.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [records, currentUser.id]);

  const latestUserRecord = useMemo(() => {
    return userRecords.length > 0 ? userRecords[0] : null;
  }, [userRecords]);

  const submitCheckin = (result: FatigueCalculationResult, recordData: Partial<FatigueRecord>): FatigueRecord => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newRec: FatigueRecord = {
      id: `rec-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      callSign: currentUser.callSign,
      badgeId: currentUser.badgeId,
      baseStation: currentUser.baseStation,
      fleetOrUnit: currentUser.fleetOrUnit,
      date: recordData.date || todayStr,
      timestamp: new Date().toISOString(),
      sleepHours: recordData.sleepHours || 7,
      dutyHours: recordData.dutyHours || 8,
      shiftType: recordData.shiftType || 'day',
      workload: recordData.workload || 'moderate',
      score: result.totalScore,
      category: result.category,
      result,
      mitigationStatus: 'None',
      ...recordData
    };

    const updated = saveNewRecord(newRec);
    setRecords(updated);
    setCurrentResult(result);
    setActiveTab('result');

    // Update current profile latest score in view
    setCurrentUserState(prev => ({
      ...prev,
      lastCheckinScore: result.totalScore,
      lastCheckinCategory: result.category
    }));

    return newRec;
  };

  const applyMitigation = (recordId: string, status: NonNullable<FatigueRecord['mitigationStatus']>) => {
    const updated = updateRecordMitigation(recordId, status);
    setRecords(updated);
  };

  const resetAllDemoData = () => {
    const reset = resetToDemoData();
    setRecords(reset);
    setCurrentUserState(MOCK_PROFILES[0]);
    setActiveTab('dashboard');
  };

  return (
    <FatigueContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        allProfiles: MOCK_PROFILES,
        records,
        userRecords,
        latestUserRecord,
        currentResult,
        setCurrentResult,
        activeTab,
        setActiveTab,
        submitCheckin,
        applyMitigation,
        resetAllDemoData
      }}
    >
      {children}
    </FatigueContext.Provider>
  );
};

export function useFatigue() {
  const context = useContext(FatigueContext);
  if (!context) {
    throw new Error('useFatigue must be used within a FatigueProvider');
  }
  return context;
}
