import { describe, it, expect, mock, beforeEach } from "bun:test";
import { getUserIdByNameAndEmail, getUserById } from "./userService";
import { NotFoundError } from "../utils/errors";
import type { Pool, PoolClient } from "pg";

describe("userService", () => {
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

  describe("getUserIdByNameAndEmail", () => {
    it("should return user id when user exists", async () => {
      const mockUser = { id: 42 };
      mockClient.query = mock(() =>
        Promise.resolve({ rows: [mockUser] })
      );

      const result = await getUserIdByNameAndEmail(
        mockPool as any as Pool,
        "John Doe",
        "john@example.com"
      );

      expect(result).toBe(42);
      expect(mockClient.query).toHaveBeenCalledWith(
        "SELECT id FROM users WHERE name = $1 AND email = $2",
        ["John Doe", "john@example.com"]
      );
      expect(mockClient.release).toHaveBeenCalled();
    });

    it("should throw NotFoundError when user does not exist", async () => {
      mockClient.query = mock(() => Promise.resolve({ rows: [] }));

      try {
        await getUserIdByNameAndEmail(
          mockPool as any as Pool,
          "Jane Doe",
          "jane@example.com"
        );
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
      }
    });

    it("should always release the client", async () => {
      mockClient.query = mock(() => Promise.resolve({ rows: [] }));

      try {
        await getUserIdByNameAndEmail(
          mockPool as any as Pool,
          "test",
          "test@test.com"
        );
      } catch {
        // Expected to throw
      }

      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe("getUserById", () => {
    it("should return user when user exists", async () => {
      const mockUser = {
        id: 1,
        name: "Alice",
        email: "alice@example.com",
      };
      mockClient.query = mock(() =>
        Promise.resolve({ rows: [mockUser] })
      );

      const result = await getUserById(mockPool as any as Pool, 1);

      expect(result).toEqual(mockUser);
      expect(mockClient.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE id = $1",
        [1]
      );
      expect(mockClient.release).toHaveBeenCalled();
    });

    it("should throw NotFoundError when user does not exist", async () => {
      mockClient.query = mock(() => Promise.resolve({ rows: [] }));

      try {
        await getUserById(mockPool as any as Pool, 999);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
      }
    });

    it("should always release the client on error", async () => {
      mockClient.query = mock(() => Promise.resolve({ rows: [] }));

      try {
        await getUserById(mockPool as any as Pool, 999);
      } catch {
        // Expected to throw
      }

      expect(mockClient.release).toHaveBeenCalled();
    });

    it("should handle user with all fields", async () => {
      const mockUser = {
        id: 5,
        name: "Bob Smith",
        email: "bob@example.com",
        created_at: "2026-06-14T10:00:00Z",
      };
      mockClient.query = mock(() =>
        Promise.resolve({ rows: [mockUser] })
      );

      const result = await getUserById(mockPool as any as Pool, 5);

      expect(result).toEqual(mockUser);
      expect(result.name).toBe("Bob Smith");
    });
  });
});
