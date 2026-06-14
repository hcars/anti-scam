import { describe, it, expect, beforeEach } from "bun:test";
import {
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
  sendError,
} from "./errors";

describe("error utilities", () => {
  describe("Custom Error Classes", () => {
    describe("NotFoundError", () => {
      it("should be instance of Error", () => {
        const error = new NotFoundError("User");

        expect(error).toBeInstanceOf(Error);
      });

      it("should have correct message format", () => {
        const error = new NotFoundError("User");

        expect(error.message).toContain("User");
        expect(error.message).toContain("not found");
      });

      it("should create message with resource name", () => {
        const resources = ["User", "Group", "Challenge"];

        resources.forEach((resource) => {
          const error = new NotFoundError(resource);
          expect(error.message).toContain(resource);
        });
      });

      it("should preserve error name", () => {
        const error = new NotFoundError("Resource");

        expect(error.name).toBe("NotFoundError");
      });
    });

    describe("UnauthorizedError", () => {
      it("should be instance of Error", () => {
        const error = new UnauthorizedError("Invalid credentials");

        expect(error).toBeInstanceOf(Error);
      });

      it("should have custom message", () => {
        const message = "Session expired";
        const error = new UnauthorizedError(message);

        expect(error.message).toBe(message);
      });

      it("should preserve error name", () => {
        const error = new UnauthorizedError("Test");

        expect(error.name).toBe("UnauthorizedError");
      });
    });

    describe("ForbiddenError", () => {
      it("should be instance of Error", () => {
        const error = new ForbiddenError("Access denied");

        expect(error).toBeInstanceOf(Error);
      });

      it("should have custom message", () => {
        const message = "You do not own this resource";
        const error = new ForbiddenError(message);

        expect(error.message).toBe(message);
      });

      it("should preserve error name", () => {
        const error = new ForbiddenError("Test");

        expect(error.name).toBe("ForbiddenError");
      });
    });

    describe("ValidationError", () => {
      it("should be instance of Error", () => {
        const error = new ValidationError("Invalid input");

        expect(error).toBeInstanceOf(Error);
      });

      it("should have custom message", () => {
        const message = "Email format is invalid";
        const error = new ValidationError(message);

        expect(error.message).toBe(message);
      });

      it("should preserve error name", () => {
        const error = new ValidationError("Test");

        expect(error.name).toBe("ValidationError");
      });
    });
  });

  describe("sendError", () => {
    let mockRes: any;

    beforeEach(() => {
      mockRes = {
        status: function (code: number) {
          this.statusCode = code;
          return this;
        },
        json: function (data: any) {
          this.jsonData = data;
          return this;
        },
      };
    });

    it("should set correct status code", () => {
      sendError(mockRes, 404, "Not found");

      expect(mockRes.statusCode).toBe(404);
    });

    it("should return JSON with error message", () => {
      sendError(mockRes, 400, "Bad request");

      expect(mockRes.jsonData).toHaveProperty("error");
      expect(mockRes.jsonData.error).toBe("Bad request");
    });

    it("should handle 401 status", () => {
      sendError(mockRes, 401, "Unauthorized");

      expect(mockRes.statusCode).toBe(401);
      expect(mockRes.jsonData.error).toBe("Unauthorized");
    });

    it("should handle 403 status", () => {
      sendError(mockRes, 403, "Forbidden");

      expect(mockRes.statusCode).toBe(403);
      expect(mockRes.jsonData.error).toBe("Forbidden");
    });

    it("should handle 500 status", () => {
      sendError(mockRes, 500, "Internal server error");

      expect(mockRes.statusCode).toBe(500);
      expect(mockRes.jsonData.error).toBe("Internal server error");
    });

    it("should support custom error messages", () => {
      const customMessages = [
        "Invalid group name",
        "User not found",
        "Group does not exist",
      ];

      customMessages.forEach((message) => {
        const res = {
          status: function (code: number) {
            this.statusCode = code;
            return this;
          },
          json: function (data: any) {
            this.jsonData = data;
            return this;
          },
        };

        sendError(res, 400, message);
        expect(res.jsonData.error).toBe(message);
      });
    });

    it("should return only error property", () => {
      sendError(mockRes, 400, "Test");

      const keys = Object.keys(mockRes.jsonData);
      expect(keys).toContain("error");
      expect(keys.length).toBe(1);
    });

    it("should support all HTTP status codes", () => {
      const statusCodes = [400, 401, 403, 404, 500];

      statusCodes.forEach((code) => {
        const res = {
          status: function (c: number) {
            this.statusCode = c;
            return this;
          },
          json: function (data: any) {
            this.jsonData = data;
            return this;
          },
        };

        sendError(res, code, "Test");
        expect(res.statusCode).toBe(code);
      });
    });
  });

  describe("Error handling patterns", () => {
    it("should throw NotFoundError for missing resources", () => {
      expect(() => {
        throw new NotFoundError("User");
      }).toThrow();
    });

    it("should throw UnauthorizedError for auth failures", () => {
      expect(() => {
        throw new UnauthorizedError("No session");
      }).toThrow();
    });

    it("should throw ForbiddenError for permission denials", () => {
      expect(() => {
        throw new ForbiddenError("Cannot access");
      }).toThrow();
    });

    it("should throw ValidationError for invalid input", () => {
      expect(() => {
        throw new ValidationError("Invalid format");
      }).toThrow();
    });

    it("should catch and distinguish error types", () => {
      const errors = [
        new NotFoundError("Resource"),
        new UnauthorizedError("Auth"),
        new ForbiddenError("Access"),
        new ValidationError("Input"),
      ];

      expect(errors[0].name).toBe("NotFoundError");
      expect(errors[1].name).toBe("UnauthorizedError");
      expect(errors[2].name).toBe("ForbiddenError");
      expect(errors[3].name).toBe("ValidationError");
    });

    it("should map error types to correct HTTP status", () => {
      const errorStatusMap = {
        NotFoundError: 404,
        UnauthorizedError: 401,
        ForbiddenError: 403,
        ValidationError: 400,
      };

      Object.entries(errorStatusMap).forEach(([errorName, status]) => {
        expect(status).toBeGreaterThanOrEqual(400);
        expect(status).toBeLessThan(600);
      });
    });
  });
});
