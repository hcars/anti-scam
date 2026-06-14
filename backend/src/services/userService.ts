import { Pool } from "pg";
import { NotFoundError } from "../utils/errors";
import type { User } from "../types";

export async function getUserIdByNameAndEmail(
  pool: Pool,
  name: string,
  email: string
): Promise<number> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT id FROM users WHERE name = $1 AND email = $2",
      [name, email]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError("User");
    }

    return result.rows[0].id;
  } finally {
    client.release();
  }
}

export async function getUserById(pool: Pool, id: number): Promise<User> {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      throw new NotFoundError("User");
    }

    return result.rows[0];
  } finally {
    client.release();
  }
}
