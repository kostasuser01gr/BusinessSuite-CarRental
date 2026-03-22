type EventCallback = (payload?: any) => void;

class EventBus {
  private events: { [key: string]: EventCallback[] } = {};

  // Subscribe to an event
  on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  // Unsubscribe from an event
  off(event: string, callback: EventCallback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  // Publish an event
  emit(event: string, payload?: any) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => {
      try {
        callback(payload);
      } catch (error) {
        console.error(`Error executing event callback for ${event}:`, error);
      }
    });
  }

  // Clear all events (useful for cleanup/testing)
  clear() {
    this.events = {};
  }
}

export const globalEventBus = new EventBus();

// Strongly typed event names for the system
export const SYSTEM_EVENTS = {
  TASK_CREATED: 'task:created',
  TASK_COMPLETED: 'task:completed',
  NETWORK_OFFLINE: 'network:offline',
  NETWORK_ONLINE: 'network:online',
  THEME_CHANGED: 'theme:changed',
  QUICK_ACTION_TRIGGERED: 'action:quick_trigger'
} as const;
