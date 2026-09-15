import { UserProfile, FatigueRecord, AircrewCheckinData, GroundCrewCheckinData } from '../types/fatigue';
import { calculateFatigueRisk } from './fatigueCalculator';

export const MOCK_PROFILES: UserProfile[] = [
  {
    id: 'user-air-01',
    name: 'Capt. Sarah Jenkins',
    role: 'aircrew',
    roleTitle: 'B787 Long-Haul Captain',
    callSign: 'Speedbird-84',
    badgeId: 'AC-8842',
    baseStation: 'KJFK (New York)',
    fleetOrUnit: 'B787-9 Widebody Fleet',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    lastCheckinScore: 38,
    lastCheckinCategory: 'MODERATE'
  },
  {
    id: 'user-air-02',
    name: 'FO Liam Davies',
    role: 'aircrew',
    roleTitle: 'A320 Short-Haul First Officer',
    callSign: 'Airbus-12',
    badgeId: 'AC-9410',
    baseStation: 'EGLL (London Heathrow)',
    fleetOrUnit: 'A320neo Multi-Sector Fleet',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    lastCheckinScore: 74,
    lastCheckinCategory: 'HIGH'
  },
  {
    id: 'user-air-03',
    name: 'Marcus Vance',
    role: 'aircrew',
    roleTitle: 'SAR Helicopter Pilot',
    callSign: 'Rescue-55',
    badgeId: 'RW-4091',
    baseStation: 'YSSY (Sydney SAR Bay)',
    fleetOrUnit: 'AW139 Offshore & SAR Unit',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    lastCheckinScore: 22,
    lastCheckinCategory: 'LOW'
  },
  {
    id: 'user-gnd-01',
    name: 'Elena Rostova',
    role: 'ground_crew',
    roleTitle: 'Lead Avionics Specialist',
    callSign: 'Avionics-Lead',
    badgeId: 'MX-3104',
    baseStation: 'KJFK Line MX Hangar 3',
    fleetOrUnit: 'Line Avionics & Systems',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    lastCheckinScore: 68,
    lastCheckinCategory: 'HIGH'
  },
  {
    id: 'user-gnd-02',
    name: 'David Miller',
    role: 'ground_crew',
    roleTitle: 'A&P Airframe & Powerplant Tech',
    callSign: 'Powerplant-02',
    badgeId: 'MX-7821',
    baseStation: 'KORD Base MX',
    fleetOrUnit: 'Heavy Engine Shop & AOG',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    lastCheckinScore: 84,
    lastCheckinCategory: 'CRITICAL'
  },
  {
    id: 'user-gnd-03',
    name: 'Kenji Tanaka',
    role: 'ground_crew',
    roleTitle: 'Structures Maintenance Lead',
    callSign: 'Structures-01',
    badgeId: 'MX-5519',
    baseStation: 'RJAA Line Maintenance',
    fleetOrUnit: 'Composite & Sheetmetal Bay',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    lastCheckinScore: 28,
    lastCheckinCategory: 'LOW'
  },
  {
    id: 'user-sup-01',
    name: 'Capt. Robert Sterling',
    role: 'supervisor',
    roleTitle: 'Director of Flight Operations & FRMS',
    callSign: 'Operations-Command',
    badgeId: 'HQ-0012',
    baseStation: 'Global Flight Operations Center',
    fleetOrUnit: 'Aviation Safety & Operations Directorate',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    lastCheckinScore: 18,
    lastCheckinCategory: 'LOW'
  }
];

// Generate 14-day history for the active demo profiles
function generateMockHistory(): FatigueRecord[] {
  const records: FatigueRecord[] = [];
  const now = new Date();

  // 1. History for Capt Sarah Jenkins (Aircrew - 14 days)
  const sarahBaseDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().split('T')[0];
  });

  const sarahDataSamples: Array<{ sleep: number; qual: number; duty: number; flt: number; sorties: number; shift: 'day' | 'evening' | 'night' | 'early_morning'; wl: 'low' | 'moderate' | 'high' | 'very_high'; cons: number; sr: [number, number, number, number] }> = [
    { sleep: 7.8, qual: 4, duty: 7.5, flt: 5.5, sorties: 2, shift: 'day', wl: 'moderate', cons: 1, sr: [2, 1, 2, 1] },
    { sleep: 7.5, qual: 4, duty: 8.0, flt: 6.0, sorties: 2, shift: 'day', wl: 'moderate', cons: 2, sr: [2, 2, 2, 2] },
    { sleep: 6.8, qual: 3, duty: 9.0, flt: 6.5, sorties: 3, shift: 'evening', wl: 'moderate', cons: 3, sr: [3, 2, 2, 2] },
    { sleep: 6.0, qual: 3, duty: 10.5, flt: 8.0, sorties: 3, shift: 'night', wl: 'high', cons: 4, sr: [3, 3, 3, 3] },
    { sleep: 8.5, qual: 5, duty: 0.0, flt: 0.0, sorties: 0, shift: 'day', wl: 'low', cons: 0, sr: [1, 1, 1, 1] }, // Rest day
    { sleep: 8.0, qual: 4, duty: 0.0, flt: 0.0, sorties: 0, shift: 'day', wl: 'low', cons: 0, sr: [1, 1, 1, 1] }, // Rest day
    { sleep: 7.2, qual: 4, duty: 7.0, flt: 5.0, sorties: 2, shift: 'day', wl: 'moderate', cons: 1, sr: [2, 2, 1, 2] },
    { sleep: 6.5, qual: 3, duty: 8.5, flt: 6.2, sorties: 3, shift: 'early_morning', wl: 'moderate', cons: 2, sr: [3, 2, 3, 3] },
    { sleep: 5.8, qual: 2, duty: 11.0, flt: 8.5, sorties: 4, shift: 'night', wl: 'high', cons: 3, sr: [4, 3, 4, 4] },
    { sleep: 5.2, qual: 2, duty: 12.5, flt: 9.5, sorties: 4, shift: 'night', wl: 'very_high', cons: 4, sr: [4, 4, 4, 4] },
    { sleep: 8.5, qual: 5, duty: 0.0, flt: 0.0, sorties: 0, shift: 'day', wl: 'low', cons: 0, sr: [1, 1, 1, 1] }, // Rest day
    { sleep: 7.8, qual: 4, duty: 6.5, flt: 4.5, sorties: 2, shift: 'day', wl: 'low', cons: 1, sr: [2, 1, 1, 1] },
    { sleep: 7.0, qual: 4, duty: 8.0, flt: 6.0, sorties: 2, shift: 'day', wl: 'moderate', cons: 2, sr: [2, 2, 2, 2] },
    { sleep: 6.8, qual: 4, duty: 8.5, flt: 6.5, sorties: 3, shift: 'evening', wl: 'moderate', cons: 3, sr: [2, 3, 2, 2] },
  ];

  sarahBaseDates.forEach((dateStr, idx) => {
    const s = sarahDataSamples[idx];
    const checkin: AircrewCheckinData = {
      sleepHours: s.sleep,
      sleepQuality: s.qual,
      wakeups: s.qual < 3 ? 2 : (s.qual < 4 ? 1 : 0),
      sleepStartTime: '23:00',
      sleepEndTime: '06:00',
      dutyStartTime: '07:30',
      expectedDutyEndTime: '16:00',
      previousDutyHours: s.duty,
      consecutiveDutyDays: s.cons,
      flyingHours: s.flt,
      sortiesCount: s.sorties,
      shiftType: s.shift,
      workload: s.wl,
      selfReport: {
        physical: s.sr[0],
        mental: s.sr[1],
        alertness: s.sr[2],
        sleepiness: s.sr[3]
      }
    };
    const res = calculateFatigueRisk('aircrew', checkin);
    records.push({
      id: `rec-sarah-${idx}`,
      userId: 'user-air-01',
      userName: 'Capt. Sarah Jenkins',
      role: 'aircrew',
      callSign: 'Speedbird-84',
      badgeId: 'AC-8842',
      baseStation: 'KJFK (New York)',
      fleetOrUnit: 'B787-9 Widebody Fleet',
      date: dateStr,
      timestamp: `${dateStr}T06:45:00Z`,
      sleepHours: s.sleep,
      dutyHours: s.duty,
      shiftType: s.shift,
      workload: s.wl,
      score: res.totalScore,
      category: res.category,
      result: res,
      mitigationStatus: res.category === 'HIGH' ? 'Controlled Rest Approved' : 'None'
    });
  });

  // 2. History for Elena Rostova (Ground Crew - 14 days)
  const elenaDataSamples: Array<{ sleep: number; qual: number; duty: number; ot: number; brk: number; shift: 'day' | 'evening' | 'night' | 'early_morning'; wl: 'low' | 'moderate' | 'high' | 'very_high'; cons: number; sr: [number, number, number, number] }> = [
    { sleep: 7.5, qual: 4, duty: 8.0, ot: 0, brk: 45, shift: 'day', wl: 'moderate', cons: 1, sr: [2, 2, 1, 2] },
    { sleep: 7.0, qual: 4, duty: 8.5, ot: 1, brk: 40, shift: 'day', wl: 'moderate', cons: 2, sr: [2, 2, 2, 2] },
    { sleep: 6.5, qual: 3, duty: 9.0, ot: 1.5, brk: 30, shift: 'evening', wl: 'high', cons: 3, sr: [3, 2, 2, 3] },
    { sleep: 5.5, qual: 2, duty: 10.5, ot: 2.5, brk: 20, shift: 'night', wl: 'high', cons: 4, sr: [4, 3, 3, 4] },
    { sleep: 4.8, qual: 2, duty: 12.0, ot: 4.0, brk: 15, shift: 'night', wl: 'very_high', cons: 5, sr: [5, 4, 4, 5] },
    { sleep: 8.5, qual: 5, duty: 0.0, ot: 0, brk: 60, shift: 'day', wl: 'low', cons: 0, sr: [1, 1, 1, 1] },
    { sleep: 8.0, qual: 4, duty: 0.0, ot: 0, brk: 60, shift: 'day', wl: 'low', cons: 0, sr: [1, 1, 1, 1] },
    { sleep: 7.2, qual: 4, duty: 8.0, ot: 0, brk: 45, shift: 'day', wl: 'moderate', cons: 1, sr: [2, 1, 2, 1] },
    { sleep: 6.8, qual: 3, duty: 8.5, ot: 0.5, brk: 40, shift: 'evening', wl: 'moderate', cons: 2, sr: [2, 2, 2, 2] },
    { sleep: 6.0, qual: 3, duty: 10.0, ot: 2.0, brk: 30, shift: 'night', wl: 'high', cons: 3, sr: [3, 3, 3, 3] },
    { sleep: 5.2, qual: 2, duty: 11.5, ot: 3.5, brk: 20, shift: 'night', wl: 'high', cons: 4, sr: [4, 4, 4, 4] },
    { sleep: 8.2, qual: 4, duty: 0.0, ot: 0, brk: 60, shift: 'day', wl: 'low', cons: 0, sr: [1, 1, 1, 1] },
    { sleep: 7.4, qual: 4, duty: 8.0, ot: 0, brk: 45, shift: 'day', wl: 'low', cons: 1, sr: [2, 1, 1, 2] },
    { sleep: 5.5, qual: 2, duty: 11.0, ot: 3.0, brk: 25, shift: 'night', wl: 'high', cons: 2, sr: [4, 3, 3, 4] }
  ];

  sarahBaseDates.forEach((dateStr, idx) => {
    const s = elenaDataSamples[idx];
    const checkin: GroundCrewCheckinData = {
      sleepHours: s.sleep,
      sleepQuality: s.qual,
      wakeups: s.qual < 3 ? 2 : 1,
      sleepStartTime: '14:00',
      sleepEndTime: '20:00',
      shiftStartTime: '22:00',
      expectedShiftEndTime: '07:00',
      maintenanceHours: s.duty,
      breakDurationMinutes: s.brk,
      overtimeHours: s.ot,
      consecutiveDutyDays: s.cons,
      shiftType: s.shift,
      physicalWorkload: s.wl,
      selfReport: {
        physical: s.sr[0],
        mental: s.sr[1],
        alertness: s.sr[2],
        sleepiness: s.sr[3]
      }
    };
    const res = calculateFatigueRisk('ground_crew', checkin);
    records.push({
      id: `rec-elena-${idx}`,
      userId: 'user-gnd-01',
      userName: 'Elena Rostova',
      role: 'ground_crew',
      callSign: 'Avionics-Lead',
      badgeId: 'MX-3104',
      baseStation: 'KJFK Line MX Hangar 3',
      fleetOrUnit: 'Line Avionics & Systems',
      date: dateStr,
      timestamp: `${dateStr}T21:40:00Z`,
      sleepHours: s.sleep,
      dutyHours: s.duty + s.ot,
      shiftType: s.shift,
      workload: s.wl,
      score: res.totalScore,
      category: res.category,
      result: res,
      mitigationStatus: res.category === 'CRITICAL' ? 'Shift Shortened' : (res.category === 'HIGH' ? 'Secondary Review Scheduled' : 'None')
    });
  });

  // 3. Add latest records for other team members for supervisor dashboard
  const otherMembers: Array<{ profile: UserProfile; checkin: AircrewCheckinData | GroundCrewCheckinData; date: string }> = [
    {
      profile: MOCK_PROFILES[1], // FO Liam Davies (High Risk)
      date: sarahBaseDates[13],
      checkin: {
        sleepHours: 4.8,
        sleepQuality: 2,
        wakeups: 3,
        sleepStartTime: '01:00',
        sleepEndTime: '05:45',
        dutyStartTime: '06:30',
        expectedDutyEndTime: '17:30',
        previousDutyHours: 11.0,
        consecutiveDutyDays: 5,
        flyingHours: 8.2,
        sortiesCount: 4,
        shiftType: 'early_morning',
        workload: 'high',
        selfReport: { physical: 4, mental: 4, alertness: 4, sleepiness: 4 }
      }
    },
    {
      profile: MOCK_PROFILES[2], // Marcus Vance (Low Risk)
      date: sarahBaseDates[13],
      checkin: {
        sleepHours: 8.2,
        sleepQuality: 5,
        wakeups: 0,
        sleepStartTime: '22:00',
        sleepEndTime: '06:15',
        dutyStartTime: '08:00',
        expectedDutyEndTime: '16:00',
        previousDutyHours: 6.5,
        consecutiveDutyDays: 2,
        flyingHours: 3.5,
        sortiesCount: 1,
        shiftType: 'day',
        workload: 'low',
        selfReport: { physical: 1, mental: 1, alertness: 1, sleepiness: 1 }
      }
    },
    {
      profile: MOCK_PROFILES[4], // David Miller (Critical Risk)
      date: sarahBaseDates[13],
      checkin: {
        sleepHours: 3.5,
        sleepQuality: 1,
        wakeups: 4,
        sleepStartTime: '15:00',
        sleepEndTime: '18:30',
        shiftStartTime: '20:00',
        expectedShiftEndTime: '08:00',
        maintenanceHours: 12.0,
        breakDurationMinutes: 15,
        overtimeHours: 4.5,
        consecutiveDutyDays: 6,
        shiftType: 'night',
        physicalWorkload: 'very_high',
        selfReport: { physical: 5, mental: 5, alertness: 4, sleepiness: 5 }
      }
    },
    {
      profile: MOCK_PROFILES[5], // Kenji Tanaka (Low Risk)
      date: sarahBaseDates[13],
      checkin: {
        sleepHours: 7.6,
        sleepQuality: 4,
        wakeups: 0,
        sleepStartTime: '23:00',
        sleepEndTime: '06:35',
        shiftStartTime: '08:00',
        expectedShiftEndTime: '16:30',
        maintenanceHours: 8.0,
        breakDurationMinutes: 50,
        overtimeHours: 0,
        consecutiveDutyDays: 2,
        shiftType: 'day',
        physicalWorkload: 'moderate',
        selfReport: { physical: 2, mental: 2, alertness: 1, sleepiness: 2 }
      }
    }
  ];

  otherMembers.forEach((item, i) => {
    const res = calculateFatigueRisk(item.profile.role, item.checkin);
    records.push({
      id: `rec-team-${i}`,
      userId: item.profile.id,
      userName: item.profile.name,
      role: item.profile.role,
      callSign: item.profile.callSign,
      badgeId: item.profile.badgeId,
      baseStation: item.profile.baseStation,
      fleetOrUnit: item.profile.fleetOrUnit,
      date: item.date,
      timestamp: `${item.date}T07:00:00Z`,
      sleepHours: item.checkin.sleepHours,
      dutyHours: (item.checkin as any).flyingHours || (item.checkin as any).maintenanceHours || 8,
      shiftType: item.checkin.shiftType,
      workload: (item.checkin as any).workload || (item.checkin as any).physicalWorkload || 'moderate',
      score: res.totalScore,
      category: res.category,
      result: res,
      mitigationStatus: res.category === 'CRITICAL' ? 'Shift Shortened' : 'None'
    });
  });

  return records;
}

export const INITIAL_FATIGUE_RECORDS: FatigueRecord[] = generateMockHistory();
