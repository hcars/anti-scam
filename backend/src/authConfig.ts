import type { ExpressAuthConfig } from "@auth/express";
import PostgresAdapter from "@auth/pg-adapter";
import Google from "@auth/core/providers/google";
import { Pool } from "pg";
import "dotenv/config";

const frontend = process.env.FRONTEND_URL ?? "http://localhost:3000";

export function createAuthConfig(pool: Pool): any {
  return {
    providers: [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    adapter: PostgresAdapter(pool),
    trustHost: true,
    callbacks: {
      async redirect({ url, baseUrl }: any) {
        return `${frontend}/dashboard`;
      },
    },
    cookies: {
      sessionToken: {
        name: `__Secure-authjs.session-token`,
        options: {
          httpOnly: true,
          sameSite: "none" as any,
          path: "/",
          secure: true,
        },
      },
      callbackUrl: {
        name: `__Secure-authjs.callback-url`,
        options: {
          sameSite: "none" as any,
          path: "/",
          secure: true,
        },
      },
      csrfToken: {
        name: `__Host-authjs.csrf-token`,
        options: {
          sameSite: "none" as any,
          path: "/",
          secure: true,
        },
      },
    },
  } as any;
}
