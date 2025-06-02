
export interface Device {
  id: string;
  name: string;
  type: 'Home' | 'Hotel' | 'Office' | 'Construction';
  status: 'Online' | 'Offline' | 'Error' | 'Updating';
  lastPing: string; // ISO date string
  location?: string;
  ipAddress?: string;
  firmwareVersion?: string;
}

export type UserRole = 
  | 'Admin' 
  | 'HomeOwner' 
  | 'HotelManager' 
  | 'OfficeManager' 
  | 'ConstructionSupervisor' 
  | 'Technician' 
  | 'Guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastLogin: string; // ISO date string
  avatarUrl?: string;
}

export interface AlertRule {
  id: string;
  name: string;
  targetType: 'Device' | 'Group' | 'DeviceType';
  targetValue: string; // deviceId, groupId, or type
  sensor: string; // e.g., 'temperature', 'vibration', 'motion'
  conditionOperator: '>' | '<' | '=' | '!=' | '>=' | '<=';
  conditionValue: number | string;
  notificationMethods: ('Email' | 'SMS' | 'Push')[];
  isActive: boolean;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentType: string;
  status: 'Healthy' | 'Needs Check' | 'Maintenance Required' | 'Critical';
  lastCheckDate: string; // ISO date string
  nextCheckDate?: string; // ISO date string
  prediction?: {
    predictedFailure: boolean;
    failureReason: string;
    recommendedActions: string;
    confidenceLevel: number;
  };
}

export interface DashboardStat {
  title: string;
  value: string;
  icon: React.ElementType;
  change?: string; // e.g., "+5.2%"
  changeType?: 'positive' | 'negative';
}
