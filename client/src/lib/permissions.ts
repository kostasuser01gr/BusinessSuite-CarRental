import { User } from '../../../shared/types';

export type PermissionAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'EXECUTE' | 'MANAGE';
export type PermissionResource = 'ASSET' | 'BOOKING' | 'TASK' | 'NOTE' | 'AUTOMATION' | 'AUDIT' | 'USER';

export interface Permission {
  resource: PermissionResource;
  action: PermissionAction;
  attributes?: Record<string, any>; // For fine-grained control, e.g., { department: 'Engineering' }
}

/**
 * ABAC Rule Engine
 * Checks if a user has permission to perform an action on a resource based on their role and attributes.
 */
export function hasPermission(
  user: User | null, 
  resource: PermissionResource, 
  action: PermissionAction,
  resourceData?: any
): boolean {
  if (!user) return false;

  // Global Admin always has access
  if (user.role === 'admin') return true;

  // Define permissions by role
  const rolePermissions: Record<string, Permission[]> = {
    'manager': [
      { resource: 'ASSET', action: 'READ' },
      { resource: 'ASSET', action: 'UPDATE' },
      { resource: 'BOOKING', action: 'MANAGE' },
      { resource: 'TASK', action: 'MANAGE' },
      { resource: 'NOTE', action: 'MANAGE' },
      { resource: 'AUTOMATION', action: 'READ' },
    ],
    'technician': [
      { resource: 'ASSET', action: 'READ' },
      { resource: 'TASK', action: 'READ' },
      { resource: 'TASK', action: 'UPDATE' },
      { resource: 'NOTE', action: 'CREATE' },
      { resource: 'NOTE', action: 'READ' },
    ],
    'viewer': [
      { resource: 'ASSET', action: 'READ' },
      { resource: 'BOOKING', action: 'READ' },
      { resource: 'TASK', action: 'READ' },
      { resource: 'KNOWLEDGE', action: 'READ' } as any,
    ]
  };

  const userPermissions = rolePermissions[user.role || 'viewer'] || [];

  // 1. Basic role-based check
  const hasBasePermission = userPermissions.some(p => 
    p.resource === resource && (p.action === action || p.action === 'MANAGE')
  );

  if (!hasBasePermission) return false;

  // 2. Attribute-based check (The "Adaptive" part)
  // Example: Users can only update tasks they are assigned to, unless they are managers
  if (resource === 'TASK' && action === 'UPDATE' && user.role !== 'manager' && resourceData) {
    return resourceData.assignedTo === user.id;
  }

  // Example: Technicians can only view assets in their specific region/location
  if (resource === 'ASSET' && action === 'READ' && user.role === 'technician' && resourceData) {
    if (user.department && resourceData.department) {
      return user.department === resourceData.department;
    }
  }

  return true;
}
