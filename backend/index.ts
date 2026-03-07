import express, { type NextFunction } from "express";
import { ExpressAuth, getSession } from "@auth/express"
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from "pg"
import Google from "@auth/core/providers/google"
import 'dotenv/config'




const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const app = express();

const frontend = process.env.FRONTEND_URL ?? "http://localhost:3000";

// CORS must be first — before auth middleware — so credentialed requests work
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", frontend);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

app.get("/", (req, res) => res.redirect(`${frontend}/dashboard`));
app.listen(3200, () => console.log("Server running on port 3200"));

app.set("trust proxy", true);
app.use(
  "/auth",
  ExpressAuth({
    providers: [Google({ clientId: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET })],
    adapter: PostgresAdapter(pool),
    callbacks: {
        async redirect({ url, baseUrl }) {

         return `${frontend}/dashboard`
        }
      },
    trustHost: true,
    cookies: {
      sessionToken: {
          name: `__Secure-authjs.session-token`,
          options: {
            httpOnly: true,
            sameSite: 'none', // Required for cross-site (Vercel -> Render)
            path: '/',
            secure: true      // Required for sameSite: 'none'
          }
      },
      callbackUrl: {
        name: `__Secure-authjs.callback-url`,
        options: {
          sameSite: 'none',
          path: '/',
          secure: true
        }
      },
      csrfToken: {
        name: `__Host-authjs.csrf-token`,
        options: {
          sameSite: 'none',
          path: '/',
          secure: true
        }
      }
    }
  })
);
app.use((req, res, next) => {
  res.locals.session = getSession(req, {
    providers: [Google({ clientId: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET })],
    adapter: PostgresAdapter(pool),
  }).then(() => next());
})

app.get("/auth/signin",( req, res, next) => {
  console.log("here");
    ExpressAuth({
      providers: [Google({ clientId: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET })],
      adapter: PostgresAdapter(pool),
    })
    next(); // Pass to the next callback
  }, (req, res) => {
    console.log("here!");
    // Second callback: Executes after success
    res.redirect(`${frontend}/dashboard`);
});

