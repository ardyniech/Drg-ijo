import { describe, it, expect, beforeEach } from "vitest";
import { getActivityLogs, recordActivityLog } from "../storage/activity-log-storage";

describe("Activity Log Module", () => {
  beforeEach(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("drg_system_activity_logs_v1");
    }
  });

  it("should start with an empty log until a real action is recorded", () => {
    const logs = getActivityLogs();
    expect(logs.length).toBe(0);
  });

  it("should append a new activity log entry", () => {
    const initialCount = getActivityLogs().length;
    const updated = recordActivityLog({
      actorId: "usr-ketua-01",
      actorName: "H. Hendra Wijaya",
      actorRole: "ketua",
      action: "Uji Coba Audit Log",
      module: "roles",
      description: "Melakukan pengujian pengesahan hak akses baru.",
    });

    expect(updated.length).toBe(initialCount + 1);
    expect(updated[0].action).toBe("Uji Coba Audit Log");
    expect(updated[0].actorRole).toBeDefined();
  });
});
