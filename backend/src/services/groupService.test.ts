import { describe, it, expect, mock, beforeEach } from "bun:test";
import {
  getGroupsByUserId,
  createGroup,
  verifyGroupOwnership,
  assertGroupOwnership,
} from "./groupService";
import { ForbiddenError } from "../utils/errors";
import type { Pool } from "pg";

describe("groupService", () => {
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

  describe("getGroupsByUserId", () => {
    it("should return empty array when user has no groups", async () => {
      mockClient.query = mock(() => Promise.resolve({ rows: [] }));

      const result = await getGroupsByUserId(mockPool as any as Pool, 1);

      expect(result).toEqual([]);
      expect(mockClient.query).toHaveBeenCalledWith(
        "SELECT group_id, owner_id, group_name FROM groups WHERE owner_id = $1 ORDER BY group_id DESC",
        [1]
      );
    });

    it("should return all groups owned by user", async () => {
      const mockGroups = [
        { group_id: 3n, owner_id: 1, group_name: "Group C" },
        { group_id: 2n, owner_id: 1, group_name: "Group B" },
        { group_id: 1n, owner_id: 1, group_name: "Group A" },
      ];
      mockClient.query = mock(() => Promise.resolve({ rows: mockGroups }));

      const result = await getGroupsByUserId(mockPool as any as Pool, 1);

      expect(result).toEqual(mockGroups);
      expect(result.length).toBe(3);
    });

    it("should only return groups for specified user", async () => {
      const mockGroups = [{ group_id: 1n, owner_id: 2, group_name: "User2Group" }];
      mockClient.query = mock(() => Promise.resolve({ rows: mockGroups }));

      const result = await getGroupsByUserId(mockPool as any as Pool, 2);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.any(String),
        [2]
      );
      expect(result[0].owner_id).toBe(2);
    });

    it("should always release the client", async () => {
      mockClient.query = mock(() => Promise.resolve({ rows: [] }));

      await getGroupsByUserId(mockPool as any as Pool, 1);

      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe("createGroup", () => {
    it("should create and return a new group", async () => {
      const newGroup = {
        group_id: 10n,
        owner_id: 1,
        group_name: "New Group",
      };
      mockClient.query = mock(() => Promise.resolve({ rows: [newGroup] }));

      const result = await createGroup(
        mockPool as any as Pool,
        1,
        "New Group"
      );

      expect(result).toEqual(newGroup);
      expect(mockClient.query).toHaveBeenCalledWith(
        "INSERT INTO groups (owner_id, group_name) VALUES ($1, $2) RETURNING group_id, owner_id, group_name",
        [1, "New Group"]
      );
    });

    it("should set the correct owner_id", async () => {
      const newGroup = {
        group_id: 5n,
        owner_id: 42,
        group_name: "Test Group",
      };
      mockClient.query = mock(() => Promise.resolve({ rows: [newGroup] }));

      const result = await createGroup(
        mockPool as any as Pool,
        42,
        "Test Group"
      );

      expect(result.owner_id).toBe(42);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.any(String),
        [42, "Test Group"]
      );
    });

    it("should preserve group_name exactly", async () => {
      const groupName = "My Special Group!@#";
      const newGroup = {
        group_id: 1n,
        owner_id: 1,
        group_name: groupName,
      };
      mockClient.query = mock(() => Promise.resolve({ rows: [newGroup] }));

      const result = await createGroup(mockPool as any as Pool, 1, groupName);

      expect(result.group_name).toBe(groupName);
    });

    it("should always release the client", async () => {
      mockClient.query = mock(() =>
        Promise.resolve({
          rows: [{ group_id: 1n, owner_id: 1, group_name: "Test" }],
        })
      );

      await createGroup(mockPool as any as Pool, 1, "Test");

      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe("verifyGroupOwnership", () => {
    it("should return true when user owns the group", async () => {
      mockClient.query = mock(() =>
        Promise.resolve({ rows: [{ group_id: 1n }] })
      );

      const result = await verifyGroupOwnership(
        mockPool as any as Pool,
        1,
        1
      );

      expect(result).toBe(true);
      expect(mockClient.query).toHaveBeenCalledWith(
        "SELECT group_id FROM groups WHERE group_id = $1 AND owner_id = $2",
        [1, 1]
      );
    });

    it("should return false when user does not own the group", async () => {
      mockClient.query = mock(() => Promise.resolve({ rows: [] }));

      const result = await verifyGroupOwnership(
        mockPool as any as Pool,
        1,
        999
      );

      expect(result).toBe(false);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.any(String),
        [999, 1]
      );
    });

    it("should check both group_id and owner_id", async () => {
      mockClient.query = mock(() => Promise.resolve({ rows: [] }));

      await verifyGroupOwnership(mockPool as any as Pool, 5, 10);

      const callArgs = mockClient.query.mock.calls[0];
      expect(callArgs[1]).toEqual([10, 5]);
    });

    it("should always release the client", async () => {
      mockClient.query = mock(() => Promise.resolve({ rows: [] }));

      await verifyGroupOwnership(mockPool as any as Pool, 1, 1);

      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe("assertGroupOwnership", () => {
    it("should not throw when user owns the group", async () => {
      mockClient.query = mock(() =>
        Promise.resolve({ rows: [{ group_id: 1n }] })
      );

      expect(async () => {
        await assertGroupOwnership(mockPool as any as Pool, 1, 1);
      }).not.toThrow();
    });

    it("should throw ForbiddenError when user does not own the group", async () => {
      mockClient.query = mock(() => Promise.resolve({ rows: [] }));

      try {
        await assertGroupOwnership(mockPool as any as Pool, 1, 999);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenError);
        expect((error as Error).message).toContain("do not own");
      }
    });

    it("should have correct error message", async () => {
      mockClient.query = mock(() => Promise.resolve({ rows: [] }));

      try {
        await assertGroupOwnership(mockPool as any as Pool, 1, 1);
      } catch (error) {
        expect((error as Error).message).toBe("You do not own this group");
      }
    });

    it("should always release the client even on error", async () => {
      mockClient.query = mock(() => Promise.resolve({ rows: [] }));

      try {
        await assertGroupOwnership(mockPool as any as Pool, 1, 1);
      } catch {
        // Expected to throw
      }

      expect(mockClient.release).toHaveBeenCalled();
    });
  });
});
