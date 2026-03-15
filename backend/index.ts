import express, { response, type NextFunction } from "express";
import { ExpressAuth, getSession } from "@auth/express"
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from "pg"
import Google from "@auth/core/providers/google"
import 'dotenv/config'
import cors from 'cors';
import { generatePair, initWordGenerator } from "./wordGenerator";
import { dateDiff } from "./utils/dateUtils";



const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const app = express();

const wordGenerator = initWordGenerator("Oxford_5000.txt");

const frontend = process.env.FRONTEND_URL ?? "http://localhost:3000";

const authConfig = {
    providers: [Google({ clientId: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET })],
    adapter: PostgresAdapter(pool),
    trustHost: true,
    callbacks: {
        async redirect({ url, baseUrl }) {
         return `${frontend}/dashboard`
        }
      },
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
  };
// CORS must be first — before auth middleware — so credentialed requests work
app.use(
  cors({
    origin: frontend,
    credentials: true,                        
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.get("/", (req, res) => res.redirect(`${frontend}/dashboard`));
app.listen(3200, () => console.log("Server running on port 3200"));

app.set("trust proxy", true);
app.use(
  "/auth",
  ExpressAuth(authConfig)
);
app.use(async (req, res, next) => {
    res.locals.session = await getSession(req, authConfig);
    next()
})

app.get("/auth/signin",( req, res, next) => {
  console.log("here");
    ExpressAuth(authConfig)
    next(); // Pass to the next callback
  }, (req, res) => {
    console.log("here!");
    // Second callback: Executes after success
    res.redirect(`${frontend}/dashboard`);
});

 

 


app.get("/challenge", async (req, res) => {
  const session = res.locals.session
  
  if (!session?.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  
  const client = await pool.connect()
  const name = session.user.name;
  const email = session.user.email;
  try {
    const userIdQuery = await client.query('select id as userid FROM users WHERE name=$1 AND email=$2', [name, email]);
    if (userIdQuery.rows.length === 0) {
      return res.status(401).json({ error: "User not found." });
    }
    else {
      const userId = userIdQuery.rows[0]["userid"];
      const challenge = await client.query('SELECT * FROM challenge WHERE id=$1', [userId]);
      const [newCall, newResponse] = generatePair(wordGenerator);
      const newDate = new Date(Date.now());
      const newDateString = newDate.toISOString().split("T")[0];
      if (challenge.rows.length === 0) {
        client.query("INSERT INTO challenge VALUES ($1, $2 , $3, $4)", [userId, newCall, newResponse, newDateString]);
        return res.status(200).json({challenge: newCall, response: newResponse, daysLeft: 7});

      }
      else {
        const oldDate = new Date(challenge.rows[0]["creation_date"]);
        const age = dateDiff(newDate, oldDate);
        if (age > 7) {
          client.query("UPDATE challenge SET challenge=$1, response=$2, creation_date=$3", [newCall, newResponse, newDateString]);
          return res.status(200).json({challenge: newCall, response: newResponse, creationDate: newDateString, daysLeft: 7});
        }
        else {
          return res.status(200).json({challenge: challenge.rows[0]["challenge"], response: challenge.rows[0]["response"], daysLeft: 7 - age});
        }

      }
    }
  }
  catch (error) {
    console.error("Challenge endpoint error:", error);
    return res.status(500).json({ error: "Internal server error" });
  } 
  finally {
    client.release()
  }
});