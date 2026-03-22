import { useQuery } from '@tanstack/react-query';

export interface AuditEvent {
  id: string
  actor: string
  action: string
  entityType: string
  entityId: string
  timestamp: string
  ip: string
  metadata?: Record<string, any>
}

const fetchAuditLogs = async (): Promise<AuditEvent[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const stored = localStorage.getItem('audit_logs');
  if (stored) return JSON.parse(stored);
  
  const initial: AuditEvent[] = [
    { id: 'EVT-001', actor: 'Admin User', action: 'LOGIN', entityType: 'AUTH', entityId: 'USR-001', timestamp: new Date().toISOString(), ip: '192.168.1.1' },
    { id: 'EVT-002', actor: 'Admin User', action: 'CREATE', entityType: 'ASSET', entityId: 'AST-001', timestamp: new Date(Date.now() - 3600000).toISOString(), ip: '192.168.1.1' },
  ];
  localStorage.setItem('audit_logs', JSON.stringify(initial));
  return initial;
};

export const logSystemEvent = (action: string, entityType: string, entityId: string, metadata?: any) => {
  const logs: AuditEvent[] = JSON.parse(localStorage.getItem('audit_logs') || '[]');
  const newEvent: AuditEvent = {
    id: `EVT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    actor: 'Admin User', // Hardcoded for now as example
    action,
    entityType,
    entityId,
    timestamp: new Date().toISOString(),
    ip: '127.0.0.1',
    metadata
  };
  localStorage.setItem('audit_logs', JSON.stringify([newEvent, ...logs].slice(0, 100)));
};

export function useAuditLogs() {
  return useQuery({
    queryKey: ['audit-logs'],
    queryFn: fetchAuditLogs,
  });
}
