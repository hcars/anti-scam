import { Pool } from "pg";
import { Challenge, ChallengeResponse } from "../types";
import { generatePair, WordGenerator } from "../wordGenerator";
import { dateDiff } from "../utils/dateUtils";

export async function getChallengeForGroup(
  pool: Pool,
  groupId: number
): Promise<Challenge | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM challenge WHERE group_id = $1",
      [groupId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function createChallenge(
  pool: Pool,
  groupId: number,
  challenge: string,
  response: string,
  creationDate: string
): Promise<Challenge> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "INSERT INTO challenge (group_id, challenge, response, creation_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [groupId, challenge, response, creationDate]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function updateChallenge(
  pool: Pool,
  groupId: number,
  challenge: string,
  response: string,
  creationDate: string
): Promise<Challenge> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "UPDATE challenge SET challenge = $1, response = $2, creation_date = $3 WHERE group_id = $4 RETURNING *",
      [challenge, response, creationDate, groupId]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getOrCreateChallenge(
  pool: Pool,
  groupId: number,
  wordGenerator: WordGenerator
): Promise<ChallengeResponse> {
  const challenge = await getChallengeForGroup(pool, groupId);
  const [newCall, newResponse] = generatePair(wordGenerator);
  const newDate = new Date();
  const newDateString = newDate.toISOString().split("T")[0];

  if (!challenge) {
    // Create new challenge
    await createChallenge(pool, groupId, newCall, newResponse, newDateString);
    return {
      challenge: newCall,
      response: newResponse,
      daysLeft: 7,
    };
  }

  // Challenge exists, check if expired
  const oldDate = new Date(challenge.creation_date);
  const age = dateDiff(newDate, oldDate);

  if (age > 7) {
    // Rotate challenge
    await updateChallenge(pool, groupId, newCall, newResponse, newDateString);
    return {
      challenge: newCall,
      response: newResponse,
      creationDate: newDateString,
      daysLeft: 7,
    };
  }

  // Return existing challenge
  return {
    challenge: challenge.challenge,
    response: challenge.response,
    daysLeft: 7 - age,
  };
}
