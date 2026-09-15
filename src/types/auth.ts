export type UserRole = 'aircrew' | 'ground_crew' | 'supervisor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  personnelId: string;
  passwordHash: string;
  role: UserRole;
  organizationId: string;
  unitId: string;
  teamId?: string;
  status: 'active' | 'archived' | 'suspended';
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface Personnel {
  id: string;
  userId?: string | null;
  name: string;
  operationalRole: UserRole;
  orgId: string;
  unitId: string;
  teamId?: string;
  aircraftCategory: string;
  station: string;
  supervisorId?: string | null;
  isArchived: boolean;
  archivedReason?: string;
  archivedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  type: 'airline' | 'military' | 'sar_operator' | 'charter_cargo' | 'mro_maintenance';
}

export interface SquadronUnit {
  id: string;
  orgId: string;
  name: string;
  code: string;
  parentUnitId?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  actionType:
    | 'USER_LOGIN'
    | 'USER_LOGOUT'
    | 'USER_REGISTER'
    | 'PASSWORD_RESET'
    | 'SETTINGS_UPDATED'
    | 'ASSESSMENT_LOGGED'
    | 'ASSESSMENT_EDITED'
    | 'FORECAST_CREATED'
    | 'PERSONNEL_ARCHIVED'
    | 'SUPERVISOR_ASSIGNMENT_CHANGED'
    | 'DATA_MIGRATED'
    | 'DATA_EXPORTED'
    | 'DATA_IMPORTED'
    | 'SYSTEM_CONFIG';
  targetResource: string;
  details: string;
}
