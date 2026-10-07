export interface MigrationContext {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  getAllKeys: () => string[];
}

export interface SchemaMigrationRecord {
  version: number;
  name: string;
  batch: number;
  execution_time_ms: number;
  checksum: string;
  applied_at: string;
  status: "applied" | "rolled_back" | "failed";
}

export interface MigrationStep {
  version: number;
  name: string;
  description: string;
  checksum?: string;
  up: (ctx: MigrationContext) => void | Promise<void>;
  down?: (ctx: MigrationContext) => void | Promise<void>;
}

export interface MigrationResult {
  success: boolean;
  fromVersion: number;
  toVersion: number;
  appliedVersions: number[];
  batch: number;
  backupKey?: string;
  error?: string;
}

export interface SchemaHealthReport {
  isHealthy: boolean;
  currentVersion: number;
  targetVersion: number;
  totalApplied: number;
  corruptedKeys: string[];
  totalRecordsChecked: number;
  lastMigrationAt?: string;
}
