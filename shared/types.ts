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
  role?: 'admin' | 'manager' | 'technician' | 'viewer';
  department?: string;
  credentials?: WebAuthnCredential[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  dueDate?: string;
  assignedTo?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  pinned: boolean;
  updatedAt: string;
}

export type AssetStatus = 'available' | 'in-use' | 'maintenance' | 'retired';

export interface Asset {
  id: string;
  name: string;
  type: string;
  status: AssetStatus;
  health: number;
  location: string;
  department?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  status: BookingStatus;
  date: string;
  value: string;
  serviceType: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  status: 'active' | 'inactive' | 'lead' | 'prospect';
  segment: string;
  lastContact: string;
  joinedDate?: string;
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

export interface AssistantAction {
  type:
    | 'create_task'
    | 'create_note'
    | 'schedule_maintenance'
    | 'create_automation'
    | 'open_module';
  payload: any;
  label: string;
}

export type MaintenanceStatus = 'pending' | 'in-progress' | 'completed' | 'overdue' | 'scheduled';
export interface MaintenanceRecord {
  id: string;
  assetId: string;
  assetName: string;
  issue: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: MaintenanceStatus;
  dueDate: string;
}
