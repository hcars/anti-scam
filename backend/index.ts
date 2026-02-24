import express from "express";
import { ExpressAuth } from "@auth/express"
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from "pg"

require('dotenv').config();

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

const app = express();
app.get("/", (req, res) => res.send("Hello from Bun!"));
app.listen(3200, () => console.log("Server running on port 3200"));
  
app.set("trust proxy", true);
app.use(
  "/auth",
  ExpressAuth({
    providers: [],
    adapter: PostgresAdapter(pool),
  })
);