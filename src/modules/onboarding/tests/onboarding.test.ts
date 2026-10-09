import { describe, it, expect } from "vitest";

describe("Onboarding Missions & Flow", () => {
  it("should calculate progressive mission milestones accurately", () => {
    const missions = [
      { id: "profile", completed: true },
      { id: "piket", completed: false },
      { id: "kas", completed: false },
    ];
    const completedCount = missions.filter((m) => m.completed).length;
    const progressPercent = Math.round((completedCount / missions.length) * 100);

    expect(completedCount).toBe(1);
    expect(progressPercent).toBe(33);
  });
});
