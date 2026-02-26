import express from "express";
import { ExpressAuth } from "@auth/express"
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from "pg"
import Google from "@auth/core/providers/google"
import 'dotenv/config' 

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

const app = express();
app.get("/", (req, res) => res.send("Hello from Bun!"));
app.listen(3200, () => console.log("Server running on port 3200"));
  
app.set("trust proxy", true);
app.use(
  "/auth",
  ExpressAuth({
    providers: [Google({ clientId: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET })],
    adapter: PostgresAdapter(pool),
  })
);