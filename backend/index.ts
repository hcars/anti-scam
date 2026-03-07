import express, { type NextFunction } from "express";
import { ExpressAuth, getSession } from "@auth/express"
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from "pg"
import Google from "@auth/core/providers/google"
import 'dotenv/config'
import path from "path";
import fs from 'fs';


if (process.env.SUPABASE_CA_CERT) {
  const certPath = path.join('/tmp', 'supabase-ca.crt');
  
  // 1. Write the string to a physical file in the only writable Vercel directory
  fs.writeFileSync(certPath, process.env.SUPABASE_CA_CERT);
  
  // 2. Tell Node.js to include this file in its trusted CA chain
  process.env.NODE_EXTRA_CA_CERTS = certPath;
  
  console.log("SSL: Global CA certificate injected successfully.");
}

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.SUPABASE_CA_CERT,
  },
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