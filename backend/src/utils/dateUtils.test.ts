import { describe, it, expect } from "bun:test";
import { dateDiff } from "./dateUtils";

describe("dateDiff", () => {
  it("should return 0 for the same date", () => {
    const date = new Date("2023-01-01");
    expect(dateDiff(date, date)).toBe(0);
  });

  it("should return 1 for dates one day apart", () => {
    const date1 = new Date("2023-01-01");
    const date2 = new Date("2023-01-02");
    expect(dateDiff(date1, date2)).toBe(1);
  });

  it("should return the correct difference for dates in different months", () => {
    const date1 = new Date("2023-01-01");
    const date2 = new Date("2023-02-01");
    expect(dateDiff(date1, date2)).toBe(31);
  });

  it("should return the correct difference for dates in different years", () => {
    const date1 = new Date("2022-01-01");
    const date2 = new Date("2023-01-01");
    expect(dateDiff(date1, date2)).toBe(365);
  });

  it("should handle leap years correctly", () => {
    const date1 = new Date("2024-02-28");
    const date2 = new Date("2024-03-01");
    expect(dateDiff(date1, date2)).toBe(2); // Feb 29 is between
  });

  it("should return the same result regardless of order", () => {
    const date1 = new Date("2023-01-01");
    const date2 = new Date("2023-01-05");
    expect(dateDiff(date1, date2)).toBe(dateDiff(date2, date1));
  });

  it("should handle dates with time components (ignore time)", () => {
    const date1 = new Date("2023-01-01T00:00:00");
    const date2 = new Date("2023-01-02T00:00:00");
    expect(dateDiff(date1, date2)).toBe(1);
  });

  it("should round correctly for fractional days", () => {
    // Assuming rounding: 1.5 days should round to 2? Wait, Math.round(1.5)=2, but let's check.
    // Actually, since it's msDiff / msPerDay, and round.
    // For example, 1 day + 12 hours = 1.5, round to 2.
    const date1 = new Date("2023-01-01T00:00:00");
    const date2 = new Date("2023-01-02T12:00:00");
    expect(dateDiff(date1, date2)).toBe(2); // 36 hours, 1.5 days, round to 2
  });
});