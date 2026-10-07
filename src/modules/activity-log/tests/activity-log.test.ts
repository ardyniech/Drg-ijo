import { describe, it, expect } from "vitest";
import { getActivityLogs, recordActivityLog } from "../storage/activity-log-storage";

describe("Activity Log Module", () => {
  it("should fetch initial seed activity logs", () => {
    const logs = getActivityLogs();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].actorRole).toBeDefined();
    expect(logs[0].action).toBeDefined();
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
  });
});
