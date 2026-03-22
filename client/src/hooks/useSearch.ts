import { useQuery } from '@tanstack/react-query';
import { Task, Note, Customer, Booking, Asset } from '../../../shared/types';

interface SearchResult {
  id: string
  name: string
  type: 'task' | 'note' | 'customer' | 'booking' | 'asset' | 'nav' | 'action'
  path: string
  description?: string
  score?: number
}

// This simulates a semantic search engine using fuzzy matching and context scores
export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      
      // Artificial delay to simulate heavy indexing/semantic lookup
      await new Promise(resolve => setTimeout(resolve, 350));
      
      const results: SearchResult[] = [];
      const lowQuery = query.toLowerCase();
      
      // 1. Search in Assets (Fleet)
      const assets: Asset[] = JSON.parse(localStorage.getItem('assets') || '[]');
      assets.forEach(a => {
        if (a.name.toLowerCase().includes(lowQuery) || a.id.toLowerCase().includes(lowQuery)) {
          results.push({ 
            id: a.id, 
            name: a.name, 
            type: 'asset', 
            path: '/assets',
            description: `${a.type} • ${a.health}% Health` 
          });
        }
      });
      
      // 2. Search in Tasks
      const tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
      tasks.forEach(t => {
        if (t.title.toLowerCase().includes(lowQuery)) {
          results.push({ 
            id: t.id, 
            name: t.title, 
            type: 'task', 
            path: '/dashboard',
            description: `Priority: ${t.priority}` 
          });
        }
      });
      
      // 3. Search in Notes
      const notes: Note[] = JSON.parse(localStorage.getItem('notes') || '[]');
      notes.forEach(n => {
        if (n.title.toLowerCase().includes(lowQuery) || n.content.toLowerCase().includes(lowQuery)) {
          results.push({ 
            id: n.id, 
            name: n.title, 
            type: 'note', 
            path: '/dashboard',
            description: n.category 
          });
        }
      });

      // 4. Semantic / Intent-based results (The "Intelligence" part)
      if (lowQuery.includes('low') || lowQuery.includes('fail') || lowQuery.includes('broken')) {
        const failing = assets.filter(a => a.health < 60);
        failing.forEach(a => {
          results.push({
            id: `intent-${a.id}`,
            name: `Critical: ${a.name} is failing`,
            type: 'asset',
            path: '/assets',
            description: 'Semantic match for failure intent'
          });
        });
      }

      if (lowQuery.includes('money') || lowQuery.includes('revenue') || lowQuery.includes('pay')) {
        results.push({
          id: 'action-billing',
          name: 'Review Billing & Revenue',
          type: 'nav',
          path: '/bookings',
          description: 'Navigate to dispatch pipeline'
        });
      }
      
      // 5. Navigation
      const nav = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Customers', path: '/customers' },
        { name: 'Bookings', path: '/bookings' },
        { name: 'Fleet & Assets', path: '/assets' },
        { name: 'Maintenance', path: '/maintenance' },
        { name: 'Knowledge', path: '/knowledge' },
        { name: 'Settings', path: '/settings' },
      ];
      
      nav.forEach(item => {
        if (item.name.toLowerCase().includes(lowQuery)) {
          results.push({ id: `nav-${item.name}`, name: item.name, type: 'nav', path: item.path });
        }
      });

      return results;
    },
    enabled: query.length >= 2,
  });
}
