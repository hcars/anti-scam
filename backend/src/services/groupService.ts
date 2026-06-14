import { Pool } from "pg";
import { Group } from "../types";
import { ForbiddenError } from "../utils/errors";

export async function getGroupsByUserId(
  pool: Pool,
  userId: number
): Promise<Group[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT group_id, owner_id, group_name FROM groups WHERE owner_id = $1 ORDER BY group_id DESC",
      [userId]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function createGroup(
  pool: Pool,
  userId: number,
  groupName: string
): Promise<Group> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "INSERT INTO groups (owner_id, group_name) VALUES ($1, $2) RETURNING group_id, owner_id, group_name",
      [userId, groupName]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function verifyGroupOwnership(
  pool: Pool,
  userId: number,
  groupId: number
): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT group_id FROM groups WHERE group_id = $1 AND owner_id = $2",
      [groupId, userId]
    );

    if (result.rows.length === 0) {
      return false;
    }

    return true;
  } finally {
    client.release();
  }
}

export async function assertGroupOwnership(
  pool: Pool,
  userId: number,
  groupId: number
): Promise<void> {
  const owns = await verifyGroupOwnership(pool, userId, groupId);
  if (!owns) {
    throw new ForbiddenError("You do not own this group");
  }
}
