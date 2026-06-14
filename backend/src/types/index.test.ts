import { describe, it, expect } from "bun:test";
import type { User, Group, Challenge, ChallengeResponse, AuthSession } from "../types";

describe("types", () => {
  describe("User interface", () => {
    it("should have required properties", () => {
      const user: User = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      };

      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("email");
    });

    it("should accept user with all fields", () => {
      const user: User = {
        id: 42,
        name: "Test User",
        email: "test@example.com",
      };

      expect(user.id).toBe(42);
      expect(user.name).toBe("Test User");
      expect(user.email).toBe("test@example.com");
    });

    it("should have id as number", () => {
      const user: User = {
        id: 5,
        name: "User",
        email: "user@test.com",
      };

      expect(typeof user.id).toBe("number");
    });

    it("should have name as string", () => {
      const user: User = {
        id: 1,
        name: "Alice",
        email: "alice@test.com",
      };

      expect(typeof user.name).toBe("string");
    });

    it("should have email as string", () => {
      const user: User = {
        id: 1,
        name: "Bob",
        email: "bob@example.com",
      };

      expect(typeof user.email).toBe("string");
    });
  });

  describe("Group interface", () => {
    it("should have required properties", () => {
      const group: Group = {
        group_id: 1n,
        owner_id: 1,
        group_name: "Test Group",
      };

      expect(group).toHaveProperty("group_id");
      expect(group).toHaveProperty("owner_id");
      expect(group).toHaveProperty("group_name");
    });

    it("should have group_id as bigint", () => {
      const group: Group = {
        group_id: 100n,
        owner_id: 5,
        group_name: "Group",
      };

      expect(typeof group.group_id).toBe("bigint");
    });

    it("should have owner_id as number", () => {
      const group: Group = {
        group_id: 1n,
        owner_id: 42,
        group_name: "My Group",
      };

      expect(typeof group.owner_id).toBe("number");
    });

    it("should have group_name as string", () => {
      const group: Group = {
        group_id: 1n,
        owner_id: 1,
        group_name: "Named Group",
      };

      expect(typeof group.group_name).toBe("string");
    });

    it("should support special characters in group_name", () => {
      const specialName = "Group!@#$%^&*()";
      const group: Group = {
        group_id: 1n,
        owner_id: 1,
        group_name: specialName,
      };

      expect(group.group_name).toBe(specialName);
    });
  });

  describe("Challenge interface", () => {
    it("should have required properties", () => {
      const challenge: Challenge = {
        group_id: 1n,
        challenge: "apple",
        response: "fruit",
        creation_date: "2026-06-14",
      };

      expect(challenge).toHaveProperty("group_id");
      expect(challenge).toHaveProperty("challenge");
      expect(challenge).toHaveProperty("response");
      expect(challenge).toHaveProperty("creation_date");
    });

    it("should have group_id as bigint", () => {
      const challenge: Challenge = {
        group_id: 5n,
        challenge: "test",
        response: "answer",
        creation_date: "2026-06-14",
      };

      expect(typeof challenge.group_id).toBe("bigint");
    });

    it("should have challenge as string", () => {
      const challenge: Challenge = {
        group_id: 1n,
        challenge: "word",
        response: "type",
        creation_date: "2026-06-14",
      };

      expect(typeof challenge.challenge).toBe("string");
    });

    it("should have response as string", () => {
      const challenge: Challenge = {
        group_id: 1n,
        challenge: "cat",
        response: "animal",
        creation_date: "2026-06-14",
      };

      expect(typeof challenge.response).toBe("string");
    });

    it("should have creation_date as string", () => {
      const challenge: Challenge = {
        group_id: 1n,
        challenge: "test",
        response: "test",
        creation_date: "2026-06-14",
      };

      expect(typeof challenge.creation_date).toBe("string");
    });

    it("should support ISO date format", () => {
      const challenge: Challenge = {
        group_id: 1n,
        challenge: "word",
        response: "answer",
        creation_date: "2026-06-14",
      };

      expect(challenge.creation_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("ChallengeResponse interface", () => {
    it("should have required properties", () => {
      const response: ChallengeResponse = {
        challenge: "apple",
        response: "fruit",
        daysLeft: 5,
      };

      expect(response).toHaveProperty("challenge");
      expect(response).toHaveProperty("response");
      expect(response).toHaveProperty("daysLeft");
    });

    it("should have challenge as string", () => {
      const response: ChallengeResponse = {
        challenge: "test",
        response: "answer",
        daysLeft: 3,
      };

      expect(typeof response.challenge).toBe("string");
    });

    it("should have response as string", () => {
      const response: ChallengeResponse = {
        challenge: "word",
        response: "meaning",
        daysLeft: 2,
      };

      expect(typeof response.response).toBe("string");
    });

    it("should have daysLeft as number", () => {
      const response: ChallengeResponse = {
        challenge: "test",
        response: "test",
        daysLeft: 4,
      };

      expect(typeof response.daysLeft).toBe("number");
    });

    it("should have optional creationDate", () => {
      const responseWithDate: ChallengeResponse = {
        challenge: "test",
        response: "test",
        daysLeft: 7,
        creationDate: "2026-06-14",
      };

      expect(responseWithDate).toHaveProperty("creationDate");
    });

    it("should work without creationDate", () => {
      const responseWithoutDate: ChallengeResponse = {
        challenge: "test",
        response: "test",
        daysLeft: 5,
      };

      expect(responseWithoutDate).not.toHaveProperty("creationDate");
    });

    it("should have daysLeft between 0 and 7", () => {
      const validDaysLeft = [0, 1, 3, 5, 7];

      validDaysLeft.forEach((days) => {
        const response: ChallengeResponse = {
          challenge: "test",
          response: "test",
          daysLeft: days,
        };

        expect(response.daysLeft).toBeGreaterThanOrEqual(0);
        expect(response.daysLeft).toBeLessThanOrEqual(7);
      });
    });
  });

  describe("AuthSession interface", () => {
    it("should have user property", () => {
      const session: AuthSession = {
        user: {
          name: "Test",
          email: "test@example.com",
        },
      };

      expect(session).toHaveProperty("user");
    });

    it("should have user with name and email", () => {
      const session: AuthSession = {
        user: {
          name: "John Doe",
          email: "john@example.com",
        },
      };

      expect(session.user).toHaveProperty("name");
      expect(session.user).toHaveProperty("email");
    });

    it("should support additional user properties", () => {
      const session: AuthSession = {
        user: {
          name: "Jane",
          email: "jane@example.com",
          id: "uuid-123",
          image: "https://example.com/image.jpg",
        },
      };

      expect(session.user.name).toBe("Jane");
      expect(session.user.email).toBe("jane@example.com");
    });
  });

  describe("Type compatibility", () => {
    it("should allow creating user from partial data", () => {
      const userData = {
        id: 1,
        name: "User",
        email: "user@test.com",
      };

      const user: User = userData;

      expect(user.id).toBe(1);
    });

    it("should allow creating group from query result", () => {
      const queryResult = {
        group_id: 1n,
        owner_id: 1,
        group_name: "Test",
      };

      const group: Group = queryResult;

      expect(group.group_id).toBe(1n);
    });

    it("should allow creating challenge response", () => {
      const data = {
        challenge: "word",
        response: "meaning",
        daysLeft: 3,
      };

      const response: ChallengeResponse = data;

      expect(response.challenge).toBe("word");
    });

    it("should support optional fields correctly", () => {
      const responseWithoutDate: ChallengeResponse = {
        challenge: "test",
        response: "test",
        daysLeft: 5,
      };

      const responseWithDate: ChallengeResponse = {
        ...responseWithoutDate,
        creationDate: "2026-06-14",
      };

      expect(!("creationDate" in responseWithoutDate)).toBe(true);
      expect("creationDate" in responseWithDate).toBe(true);
    });
  });
});
