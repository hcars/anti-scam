import { Response } from "express";

export function sendError(res: Response, status: number, message: string) {
  return res.status(status).json({ error: message });
}

export function handleDatabaseError(error: any, context: string) {
  console.error(`${context} error:`, error);
  return {
    status: 500,
    message: "Internal server error",
  };
}

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Not authenticated") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Access denied") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
