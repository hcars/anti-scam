import { Router, Request, Response } from "express";
import { Pool } from "pg";
import { requireAuth, extractUserFromSession } from "../middleware/auth";
import {
  getGroupsByUserId,
  createGroup,
} from "../services/groupService";
import { getUserIdByNameAndEmail } from "../services/userService";
import { sendError, handleDatabaseError } from "../utils/errors";

export function createGroupsRouter(pool: Pool): Router {
  const router = Router();

  // GET /groups - Fetch all groups for the authenticated user
  router.get("/", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = extractUserFromSession(res.locals.session);
      const userId = await getUserIdByNameAndEmail(pool, user.name, user.email);
      const groups = await getGroupsByUserId(pool, userId);
      return res.status(200).json({ groups });
    } catch (error: any) {
      if (error.message === "User not found") {
        return sendError(res, 401, "User not found");
      }
      const { status, message } = handleDatabaseError(error, "Groups endpoint");
      return sendError(res, status, message);
    }
  });

  // POST /groups - Create a new group
  router.post("/", requireAuth, async (req: Request, res: Response) => {
    try {
      const { group_name } = req.body;
      if (!group_name) {
        return sendError(res, 400, "group_name is required");
      }

      const user = extractUserFromSession(res.locals.session);
      const userId = await getUserIdByNameAndEmail(pool, user.name, user.email);
      const group = await createGroup(pool, userId, group_name);

      return res.status(201).json({ group });
    } catch (error: any) {
      if (error.message === "User not found") {
        return sendError(res, 401, "User not found");
      }
      const { status, message } = handleDatabaseError(error, "Groups endpoint");
      return sendError(res, status, message);
    }
  });

  return router;
}
