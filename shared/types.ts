export interface WebAuthnCredential {
  id: string;
  publicKey: string;
  counter: number;
  transports?: string[];
}

export interface User { 
  id: string; 
  email: string; 
  name: string; 
  credentials?: WebAuthnCredential[];
}

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  createdAt: string;
  dueDate?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  category: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  time: string;
  text: string;
  user: string;
  type: 'auth' | 'task' | 'note' | 'system';
}

export interface KPIData {
  revenue: string;
  activeTasks: number;
  productivityScore: number;
  systemHealth: number;
}

// Business Operations Types

export type CustomerStatus = 'active' | 'inactive' | 'lead' | 'prospect';
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  segment: string;
  lastContact: string;
}

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';
export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  status: BookingStatus;
  date: string;
  value: string;
  serviceType: string;
}

export type AssetStatus = 'available' | 'in-use' | 'maintenance' | 'retired';
export interface Asset {
  id: string;
  name: string;
  type: string;
  status: AssetStatus;
  health: number; // 0-100
  location: string;
}

export type MaintenanceStatus = 'scheduled' | 'in-progress' | 'completed' | 'overdue';
export interface MaintenanceRecord {
  id: string;
  assetId: string;
  assetName: string;
  issue: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: MaintenanceStatus;
  dueDate: string;
}
