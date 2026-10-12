# Performance Optimization and Offline Sync Resilience Implementation Plan

This plan outlines the architecture and execution steps for hardening the emergency response system with advanced performance optimizations and robust offline sync resilience, ensuring zero data loss and lightning-fast responsiveness even in low-connectivity disaster zones.

## User Review & Critical Decisions

> [!IMPORTANT]
> - **Local Persistence Storage**: We will use IndexedDB (via `idb` or `dexie`) alongside Firestore offline persistence to cache active incidents, satgas device tokens, and pending outbox operations.
> - **Outbox Sync Pattern**: Mutations (creating SOS reports, updating incident statuses) performed offline will be safely queued in a local `pending_ops` store and automatically replayed with exponential backoff upon reconnection.

- **Confirmed Area**: Performance optimization (memoization, virtual scrolling for logs, lazy loading) & offline sync resilience.

## 1. Overview & Core Concept

- **What It Does**: Enhances the React frontend and Firebase/local storage data layer to support seamless offline operation (queueing SOS reports and status updates locally when offline and syncing automatically when connectivity returns) while optimizing rendering performance for large incidents and audit logs.
- **Key Value**: First responders and field units (Satgas/Korlap) can report emergencies and update incident statuses instantly without waiting for network acknowledgment, preventing dropped reports during cellular blackouts.

## 2. Architectural Design & Component Hierarchy

```
┌────────────────────────────────────────────────────────┐
│                     Client UI Layer                    │
│   (Incident Dashboard, Map, SOS Modal, Log Explorer)   │
└────────────┬───────────────────────────────┬───────────┘
             │                               │
             ▼                               ▼
┌─────────────────────────┐     ┌────────────────────────┐
│    Performance Layer    │     │   Offline Sync Layer   │
│  - React.memo / useMemo │     │  - IndexedDB Local DB  │
│  - Virtualized Lists    │     │  - Outbox Queue Manager│
│  - Code Splitting       │     │  - Network Status Hook │
└─────────────────────────┘     └────────────┬───────────┘
                                             │
                                             ▼
                                ┌────────────────────────┐
                                │    Firebase Firestore  │
                                │    & Backend API       │
                                └────────────────────────┘
```

## 3. Proposed Changes

### A. Offline Storage & Outbox Pattern (`src/lib/offline-store.ts`)
- Implement a robust IndexedDB helper using standard browser APIs (`indexedDB`) to store:
  - `offline_incidents`: Cached copy of recent incidents.
  - `outbox_mutations`: Unsynced POST/PATCH operations (e.g., new SOS reports, status transitions).
- Provide `enqueueMutation(mutation)`, `getPendingMutations()`, and `removeMutation(id)` helpers.

### B. Network Connectivity & Sync Manager (`src/hooks/use-offline-sync.ts`)
- Listen to `navigator.onLine`, `online`, and `offline` events.
- When online, automatically drain the outbox queue, replaying mutations against `/api/incidents` or Firestore with idempotency keys.
- Expose `isOnline`, `pendingCount`, and `syncNow()` status to UI banner.

### C. Performance Optimizations in UI (`src/modules/...`)
- Memoize incident card components (`React.memo`).
- Add pagination or virtual scrolling or efficient chunk rendering for large incident log feeds.
- Debounce search and filter inputs on dashboard tables.

## 4. Verification Plan

### Automated Tests
- Run `npm test` or vitest unit tests for offline sync queueing and outbox retry logic.
- Verify component compilation with `compile_applet`.

### Manual Verification
- Test offline mode simulation in browser devtools:
  1. Go offline.
  2. Create an SOS report or update an incident status.
  3. Verify it is safely saved locally and appears in the UI with a "Pending Sync" badge.
  4. Go back online.
  5. Verify automatic synchronization with Firestore and clearing of the pending badge.
