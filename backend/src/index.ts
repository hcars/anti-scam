import express from "express";
import { Pool } from "pg";
import cors from "cors";
import "dotenv/config";
import { createAuthConfig } from "./authConfig";
import { registerRoutes } from "./routes";
import { initWordGenerator } from "./wordGenerator";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const app = express();
const frontend = process.env.FRONTEND_URL ?? "http://localhost:3000";
const wordGenerator = initWordGenerator("Oxford_5000.txt");

// Middleware
app.use(
  cors({
    origin: frontend,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", true);

// Auth and routes
const authConfig = createAuthConfig(pool);
registerRoutes(app, pool, authConfig, wordGenerator);

// Root redirect
app.get("/", (req, res) => res.redirect(`${frontend}/dashboard`));

// Start server
app.listen(3200, () => console.log("Server running on port 3200"));
