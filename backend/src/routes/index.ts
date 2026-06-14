import type { Express } from "express";
import { Pool } from "pg";
import { ExpressAuth } from "@auth/express";
import type { ExpressAuthConfig } from "@auth/express";
import { createSessionMiddleware } from "../middleware/auth";
import { createGroupsRouter } from "./groups";
import { createChallengesRouter } from "./challenges";
import { WordGenerator } from "../wordGenerator";

export function registerRoutes(
  app: Express,
  pool: Pool,
  authConfig: ExpressAuthConfig,
  wordGenerator: WordGenerator
) {
  // Auth routes
  app.use("/auth", ExpressAuth(authConfig));

  // Session middleware
  app.use(createSessionMiddleware(authConfig));

  // Groups routes
  app.use("/groups", createGroupsRouter(pool));

  // Challenge routes
  app.use("/challenge", createChallengesRouter(pool, wordGenerator));
}
