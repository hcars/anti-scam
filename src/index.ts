import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes (SPA fallback)
    "/*": index,

    // Placeholder auth routes
    "/api/auth/login": {
      async POST(req) {
        const body = (await req.json()) as { email: string; name?: string };
        return Response.json({
          user: {
            id: "user_1",
            email: body.email,
            name: "Sarah Johnson",
            plan: "free",
          },
        });
      },
    },

    "/api/auth/register": {
      async POST(req) {
        const body = (await req.json()) as { name: string; email: string };
        return Response.json({
          user: {
            id: "user_1",
            email: body.email,
            name: body.name,
            plan: "free",
          },
        });
      },
    },

    // Placeholder group listing
    "/api/groups": {
      GET() {
        return Response.json([
          {
            id: "grp_abc123",
            name: "Johnson Family",
            code: "MAPLE-9234",
            daysUntilRotation: 4,
          },
        ]);
      },
    },

    // Placeholder group code lookup (public, no auth)
    "/api/group/:id/code": {
      GET(req) {
        return Response.json({
          groupName: "Johnson Family",
          code: "MAPLE-9234",
        });
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`Server running at ${server.url}`);
