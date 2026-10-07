/**
 * DRG App Storage Migration Guard & Auto-Heal Safe-Guard (SOP v4.0)
 * Menjalankan migrasi versi skema database lokal secara otomatis & aman tanpa intervensi manual.
 */

import {
  runSchemaMigrations,
  verifySchemaIntegrity,
  autoHealCorruptedKeys,
  createBrowserMigrationContext,
  LATEST_TARGET_VERSION,
} from "@/core/migrations";

export { LATEST_TARGET_VERSION };

export function runStorageMigrationGuard() {
  if (typeof window === "undefined" || !window.localStorage) return;

  try {
    const ctx = createBrowserMigrationContext();

    // 1. Isolasi key yang korup sebelum migrasi
    autoHealCorruptedKeys(ctx);

    // 2. Jalankan engine migrasi versi skema dengan rollback otomatis jika terjadi kegagalan
    runSchemaMigrations(ctx, LATEST_TARGET_VERSION)
      .then((result) => {
        if (result.success && result.appliedVersions.length > 0) {
          console.log(
            `[StorageMigrationGuard] Sukses migrasi skema: v${result.fromVersion} -> v${result.toVersion}.`,
          );
        }
      })
      .catch((err) => {
        console.error("[StorageMigrationGuard] Kesalahan tak terduga saat migrasi:", err);
      });
  } catch (error) {
    console.error("[StorageMigrationGuard] Kegagalan inisialisasi guard:", error);
  }
}

export function checkStorageHealth() {
  if (typeof window === "undefined" || !window.localStorage) {
    return {
      isHealthy: true,
      currentVersion: LATEST_TARGET_VERSION,
      targetVersion: LATEST_TARGET_VERSION,
      corruptedKeys: [],
      totalRecordsChecked: 0,
    };
  }
  const ctx = createBrowserMigrationContext();
  return verifySchemaIntegrity(ctx);
}
