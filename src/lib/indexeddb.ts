/**
 * IndexedDB Local Caching Layer for Incident Data & Offline Persistence (SOP v4.0)
 */

export interface CachedIncident {
  id: string;
  userId: string;
  status: string;
  latitude?: number | null;
  longitude?: number | null;
  alamat?: string;
  deskripsi?: string;
  kategori?: string;
  driverName?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

const DB_NAME = "drg_incidents_offline_db";
const DB_VERSION = 1;
const STORE_NAME = "incidents";

export function openIncidentDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this environment"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("status", "status", { unique: false });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveIncidentToLocalCache(incident: CachedIncident): Promise<void> {
  const db = await openIncidentDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(incident);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getCachedIncidents(): Promise<CachedIncident[]> {
  const db = await openIncidentDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();

    req.onsuccess = () => resolve((req.result as CachedIncident[]) || []);
    req.onerror = () => reject(req.error);
  });
}

export async function getCachedIncidentById(id: string): Promise<CachedIncident | null> {
  const db = await openIncidentDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);

    req.onsuccess = () => resolve((req.result as CachedIncident | undefined) ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function clearCachedIncidents(): Promise<void> {
  const db = await openIncidentDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.clear();

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
