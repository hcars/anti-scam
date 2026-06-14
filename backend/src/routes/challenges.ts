import { Router, Request, Response } from "express";
import { Pool } from "pg";
import { requireAuth, extractUserFromSession } from "../middleware/auth";
import {
  getOrCreateChallenge,
} from "../services/challengeService";
import { assertGroupOwnership } from "../services/groupService";
import { getUserIdByNameAndEmail } from "../services/userService";
import { sendError, handleDatabaseError, ValidationError } from "../utils/errors";
import { WordGenerator } from "../wordGenerator";

export function createChallengesRouter(
  pool: Pool,
  wordGenerator: WordGenerator
): Router {
  const router = Router();

  // GET /challenge - Get challenge for a group
  router.get("/", requireAuth, async (req: Request, res: Response) => {
    try {
      const { groupId } = req.query;

      if (!groupId) {
        return sendError(res, 400, "groupId query parameter is required");
      }

      const groupIdNum = parseInt(groupId as string, 10);
      if (isNaN(groupIdNum)) {
        return sendError(res, 400, "groupId must be a valid number");
      }

      const user = extractUserFromSession(res.locals.session);
      const userId = await getUserIdByNameAndEmail(pool, user.name, user.email);

      // Verify user owns this group
      await assertGroupOwnership(pool, userId, groupIdNum);

      // Get or create challenge
      const challenge = await getOrCreateChallenge(
        pool,
        groupIdNum,
        wordGenerator
      );

      return res.status(200).json(challenge);
    } catch (error: any) {
      if (error.name === "ForbiddenError") {
        return sendError(res, 403, error.message);
      }
      if (error.name === "ValidationError") {
        return sendError(res, 400, error.message);
      }
      if (error.message === "User not found") {
        return sendError(res, 401, "User not found");
      }
      const { status, message } = handleDatabaseError(error, "Challenge endpoint");
      return sendError(res, status, message);
    }
  });

  return router;
}
