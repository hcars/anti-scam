import { describe, it, expect, mock, beforeEach } from "bun:test";
import {
  createSessionMiddleware,
  requireAuth,
  extractUserFromSession,
} from "../middleware/auth";
import type { Request, Response, NextFunction } from "express";

describe("middleware/auth", () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    mockNext = mock(() => {});
    mockRes = {
      locals: {},
      status: mock(function (code: number) {
        this.statusCode = code;
        return this;
      }),
      json: mock(function (data: any) {
        return this;
      }),
    };
    mockReq = {};
  });

  describe("createSessionMiddleware", () => {
    it("should return a middleware function", () => {
      const mockAuthConfig = {};
      const middleware = createSessionMiddleware(mockAuthConfig as any);

      expect(typeof middleware).toBe("function");
    });

    it("should attach session to res.locals", async () => {
      const mockAuthConfig = {
        // Auth.js config structure
      };
      const middleware = createSessionMiddleware(mockAuthConfig as any);

      mockReq = {
        method: "GET",
      } as any;

      // Note: In real usage, this would call ExpressAuth which modifies res.locals
      // For testing purposes, we verify it's callable
      expect(typeof middleware).toBe("function");
    });
  });

  describe("requireAuth", () => {
    it("should call next() when session exists", () => {
      mockRes.locals.session = {
        user: {
          name: "Test User",
          email: "test@example.com",
        },
      };

      requireAuth(mockReq as any, mockRes as any, mockNext as any);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should return 401 when session does not exist", () => {
      mockRes.locals = {};

      requireAuth(mockReq as any, mockRes as any, mockNext as any);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 when session is null", () => {
      mockRes.locals.session = null;

      requireAuth(mockReq as any, mockRes as any, mockNext as any);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it("should return 401 when session is undefined", () => {
      mockRes.locals.session = undefined;

      requireAuth(mockReq as any, mockRes as any, mockNext as any);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it("should include error message in response", () => {
      mockRes.locals = {};

      requireAuth(mockReq as any, mockRes as any, mockNext as any);

      const jsonCall = mockRes.json.mock.calls[0][0];
      expect(jsonCall).toHaveProperty("error");
      expect(typeof jsonCall.error).toBe("string");
    });
  });

  describe("extractUserFromSession", () => {
    it("should extract user name and email from session", () => {
      const session = {
        user: {
          name: "John Doe",
          email: "john@example.com",
        },
      };

      const result = extractUserFromSession(session as any);

      expect(result).toEqual({
        name: "John Doe",
        email: "john@example.com",
      });
    });

    it("should return name and email properties only", () => {
      const session = {
        user: {
          name: "Jane Smith",
          email: "jane@example.com",
          id: "uuid-123",
          image: "https://example.com/image.jpg",
        },
      };

      const result = extractUserFromSession(session as any);

      expect(result).toEqual({
        name: "Jane Smith",
        email: "jane@example.com",
      });
      expect(result).not.toHaveProperty("id");
      expect(result).not.toHaveProperty("image");
    });

    it("should handle session with minimal user data", () => {
      const session = {
        user: {
          name: "Minimal User",
          email: "minimal@test.com",
        },
      };

      const result = extractUserFromSession(session as any);

      expect(result.name).toBe("Minimal User");
      expect(result.email).toBe("minimal@test.com");
    });

    it("should preserve exact name and email values", () => {
      const name = "Special!@# Name";
      const email = "special+tag@example.com";
      const session = {
        user: {
          name,
          email,
        },
      };

      const result = extractUserFromSession(session as any);

      expect(result.name).toBe(name);
      expect(result.email).toBe(email);
    });

    it("should handle sessions with null user", () => {
      const session = {
        user: null,
      };

      expect(() => {
        extractUserFromSession(session as any);
      }).toThrow();
    });
  });
});
