/**
 * A simple Promise-based wrapper around IndexedDB for local-first storage.
 * Designed to replace synchronous localStorage for large datasets.
 */

const DB_NAME = 'adaptiveai-db';
const DB_VERSION = 1;

export const STORES = {
  ASSETS: 'assets',
  CUSTOMERS: 'customers',
  TASKS: 'tasks',
  NOTES: 'notes',
  BOOKINGS: 'bookings',
  EVENTS: 'events',
} as const;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create all necessary stores
      Object.values(STORES).forEach(storeName => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      });
    };
  });

  return dbPromise;
}

export const Storage = {
  async get<T>(storeName: string, id: string): Promise<T | null> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as T || null);
    });
  },

  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as T[] || []);
    });
  },

  async put<T extends { id: string }>(storeName: string, item: T): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(request.error);
    });
  },

  async putMany<T extends { id: string }>(storeName: string, items: T[]): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      items.forEach(item => store.put(item));
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  },

  async delete(storeName: string, id: string): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(request.error);
    });
  },

  async clear(storeName: string): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(request.error);
    });
  }
};
