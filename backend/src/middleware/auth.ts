import { Request, Response, NextFunction } from "express";
import { getSession } from "@auth/express";
import { ExpressAuthConfig } from "@auth/express";
import { AuthSession } from "../types";
import { UnauthorizedError } from "../utils/errors";

declare global {
  namespace Express {
    interface Locals {
      session: AuthSession;
    }
  }
}

export function createSessionMiddleware(authConfig: ExpressAuthConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.locals.session = await getSession(req, authConfig);
      next();
    } catch (error) {
      console.error("Session middleware error:", error);
      res.locals.session = undefined;
      next();
    }
  };
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!res.locals.session?.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

export function extractUserFromSession(session: AuthSession) {
  if (!session?.user) {
    throw new UnauthorizedError();
  }

  return {
    name: session.user.name,
    email: session.user.email,
  };
}
