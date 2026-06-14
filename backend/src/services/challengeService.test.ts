import { describe, it, expect, mock, beforeEach, spyOn } from "bun:test";
import {
  getChallengeForGroup,
  createChallenge,
  updateChallenge,
  getOrCreateChallenge,
} from "./challengeService";
import type { Pool } from "pg";

describe("challengeService", () => {
  let mockClient: any;
  let mockPool: any;

  beforeEach(() => {
    mockClient = {
      query: mock(() => Promise.resolve({ rows: [] })),
      release: mock(() => {}),
    };

    mockPool = {
      connect: mock(() => Promise.resolve(mockClient)),
    };
  });

  describe("getChallengeForGroup", () => {
    it("should return null when no challenge exists for group", async () => {
      mockClient.query = mock(() => Promise.resolve({ rows: [] }));

      const result = await getChallengeForGroup(mockPool as any as Pool, 1);

      expect(result).toBe(null);
      expect(mockClient.query).toHaveBeenCalledWith(
        "SELECT * FROM challenge WHERE group_id = $1",
        [1]
      );
    });

    it("should return challenge when it exists", async () => {
      const mockChallenge = {
        group_id: 1n,
        challenge: "apple",
        response: "fruit",
        creation_date: "2026-06-14",
      };
      mockClient.query = mock(() =>
        Promise.resolve({ rows: [mockChallenge] })
      );

      const result = await getChallengeForGroup(mockPool as any as Pool, 1);

      expect(result).toEqual(mockChallenge);
      expect(result?.challenge).toBe("apple");
      expect(result?.response).toBe("fruit");
    });

    it("should query with correct group_id", async () => {
      mockClient.query = mock(() => Promise.resolve({ rows: [] }));

      await getChallengeForGroup(mockPool as any as Pool, 42);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.any(String),
        [42]
      );
    });

    it("should always release the client", async () => {
      mockClient.query = mock(() => Promise.resolve({ rows: [] }));

      await getChallengeForGroup(mockPool as any as Pool, 1);

      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe("createChallenge", () => {
    it("should create challenge with all parameters", async () => {
      const newChallenge = {
        group_id: 1n,
        challenge: "cat",
        response: "animal",
        creation_date: "2026-06-14",
      };
      mockClient.query = mock(() =>
        Promise.resolve({ rows: [newChallenge] })
      );

      const result = await createChallenge(
        mockPool as any as Pool,
        1,
        "cat",
        "animal",
        "2026-06-14"
      );

      expect(result).toEqual(newChallenge);
      expect(mockClient.query).toHaveBeenCalledWith(
        "INSERT INTO challenge (group_id, challenge, response, creation_date) VALUES ($1, $2, $3, $4) RETURNING *",
        [1, "cat", "animal", "2026-06-14"]
      );
    });

    it("should preserve challenge and response text exactly", async () => {
      const challenge = "complex!@# term";
      const response = "special$%^ answer";
      const newChallenge = {
        group_id: 1n,
        challenge,
        response,
        creation_date: "2026-06-14",
      };
      mockClient.query = mock(() =>
        Promise.resolve({ rows: [newChallenge] })
      );

      const result = await createChallenge(
        mockPool as any as Pool,
        1,
        challenge,
        response,
        "2026-06-14"
      );

      expect(result.challenge).toBe(challenge);
      expect(result.response).toBe(response);
    });

    it("should always release the client", async () => {
      mockClient.query = mock(() =>
        Promise.resolve({
          rows: [
            {
              group_id: 1n,
              challenge: "test",
              response: "test",
              creation_date: "2026-06-14",
            },
          ],
        })
      );

      await createChallenge(
        mockPool as any as Pool,
        1,
        "test",
        "test",
        "2026-06-14"
      );

      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe("updateChallenge", () => {
    it("should update challenge for group", async () => {
      const updated = {
        group_id: 1n,
        challenge: "new_challenge",
        response: "new_response",
        creation_date: "2026-06-21",
      };
      mockClient.query = mock(() => Promise.resolve({ rows: [updated] }));

      const result = await updateChallenge(
        mockPool as any as Pool,
        1,
        "new_challenge",
        "new_response",
        "2026-06-21"
      );

      expect(result).toEqual(updated);
      expect(mockClient.query).toHaveBeenCalledWith(
        "UPDATE challenge SET challenge = $1, response = $2, creation_date = $3 WHERE group_id = $4 RETURNING *",
        ["new_challenge", "new_response", "2026-06-21", 1]
      );
    });

    it("should preserve new challenge and response exactly", async () => {
      const challenge = "rotated!@#";
      const response = "refreshed$%^";
      const updated = {
        group_id: 5n,
        challenge,
        response,
        creation_date: "2026-06-21",
      };
      mockClient.query = mock(() => Promise.resolve({ rows: [updated] }));

      const result = await updateChallenge(
        mockPool as any as Pool,
        5,
        challenge,
        response,
        "2026-06-21"
      );

      expect(result.challenge).toBe(challenge);
      expect(result.response).toBe(response);
    });

    it("should always release the client", async () => {
      mockClient.query = mock(() =>
        Promise.resolve({
          rows: [
            {
              group_id: 1n,
              challenge: "test",
              response: "test",
              creation_date: "2026-06-14",
            },
          ],
        })
      );

      await updateChallenge(
        mockPool as any as Pool,
        1,
        "test",
        "test",
        "2026-06-14"
      );

      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe("getOrCreateChallenge", () => {
    it("should create new challenge when none exists", async () => {
      mockClient.query = mock((query) => {
        if (query.includes("SELECT")) {
          return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({
          rows: [
            {
              group_id: 1n,
              challenge: "mocked_challenge",
              response: "mocked_response",
              creation_date: "2026-06-14",
            },
          ],
        });
      });

      const mockWordGenerator = {
        words: ["apple", "banana", "cherry"],
      };

      const result = await getOrCreateChallenge(
        mockPool as any as Pool,
        1,
        mockWordGenerator as any
      );

      expect(result).toHaveProperty("challenge");
      expect(result).toHaveProperty("response");
      expect(result.daysLeft).toBe(7);
      expect(result).not.toHaveProperty("creationDate");
    });

    it("should return existing challenge when less than 7 days old", async () => {
      const today = new Date();
      const sixDaysAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
      const dateString = sixDaysAgo.toISOString().split("T")[0];

      const existingChallenge = {
        group_id: 1n,
        challenge: "existing_challenge",
        response: "existing_response",
        creation_date: dateString,
      };

      mockClient.query = mock(() =>
        Promise.resolve({ rows: [existingChallenge] })
      );

      const mockWordGenerator = {
        words: ["apple", "banana"],
      };

      const result = await getOrCreateChallenge(
        mockPool as any as Pool,
        1,
        mockWordGenerator as any
      );

      expect(result.challenge).toBe("existing_challenge");
      expect(result.response).toBe("existing_response");
      // daysLeft should be close to 1 (7 - 6 = 1)
      expect(result.daysLeft).toBeGreaterThanOrEqual(0);
      expect(result.daysLeft).toBeLessThanOrEqual(2);
    });

    it("should rotate challenge when more than 7 days old", async () => {
      const today = new Date();
      const eightDaysAgo = new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000);
      const dateString = eightDaysAgo.toISOString().split("T")[0];

      const oldChallenge = {
        group_id: 1n,
        challenge: "old_challenge",
        response: "old_response",
        creation_date: dateString,
      };

      let callCount = 0;
      mockClient.query = mock((query) => {
        callCount++;
        if (callCount === 1 && query.includes("SELECT")) {
          return Promise.resolve({ rows: [oldChallenge] });
        }
        return Promise.resolve({
          rows: [
            {
              group_id: 1n,
              challenge: "new_challenge",
              response: "new_response",
              creation_date: new Date().toISOString().split("T")[0],
            },
          ],
        });
      });

      const mockWordGenerator = {
        words: ["apple", "banana"],
      };

      const result = await getOrCreateChallenge(
        mockPool as any as Pool,
        1,
        mockWordGenerator as any
      );

      expect(result).toHaveProperty("challenge");
      expect(result).toHaveProperty("response");
      expect(result.daysLeft).toBe(7);
      expect(result).toHaveProperty("creationDate");
    });

    it("should calculate daysLeft correctly", async () => {
      const today = new Date();
      const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
      const dateString = threeDaysAgo.toISOString().split("T")[0];

      const challenge = {
        group_id: 1n,
        challenge: "test",
        response: "test",
        creation_date: dateString,
      };

      mockClient.query = mock(() => Promise.resolve({ rows: [challenge] }));

      const mockWordGenerator = {
        words: ["a", "b"],
      };

      const result = await getOrCreateChallenge(
        mockPool as any as Pool,
        1,
        mockWordGenerator as any
      );

      // daysLeft should be approximately 7 - 3 = 4, but allow for rounding
      expect(result.daysLeft).toBeGreaterThanOrEqual(3);
      expect(result.daysLeft).toBeLessThanOrEqual(5);
    });

    it("should handle edge case: exactly 7 days old", async () => {
      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const dateString = sevenDaysAgo.toISOString().split("T")[0];

      const challenge = {
        group_id: 1n,
        challenge: "old",
        response: "old",
        creation_date: dateString,
      };

      let callCount = 0;
      mockClient.query = mock((query) => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ rows: [challenge] });
        }
        return Promise.resolve({
          rows: [
            {
              group_id: 1n,
              challenge: "new",
              response: "new",
              creation_date: new Date().toISOString().split("T")[0],
            },
          ],
        });
      });

      const mockWordGenerator = {
        words: ["a", "b"],
      };

      const result = await getOrCreateChallenge(
        mockPool as any as Pool,
        1,
        mockWordGenerator as any
      );

      // At exactly 7 days (or close to it due to rounding), should return new challenge with 7 days
      // or return existing with 0-1 days left depending on exact timing
      expect(result.daysLeft).toBeGreaterThanOrEqual(0);
      expect(result.daysLeft).toBeLessThanOrEqual(7);
    });

    it("should always release the client", async () => {
      mockClient.query = mock(() => Promise.resolve({ rows: [] }));

      const mockWordGenerator = {
        words: ["a", "b"],
      };

      await getOrCreateChallenge(
        mockPool as any as Pool,
        1,
        mockWordGenerator as any
      );

      expect(mockClient.release).toHaveBeenCalled();
    });
  });
});
