import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import sqlite3 from "sqlite3";
import fetch from "node-fetch"; 
import dotenv from "dotenv";


const app = express();
const PORT = 4000;
dotenv.config();
app.use(express.json());
app.use(cors());


//? Log all requests (Middleware)
app.use((req, res, next) => {
  const {text} = req.body;

  console.log("Request received at:", new Date());
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);
  console.log("Request body:", text ?? "No body");
  res.on("finish", () => {
    console.log("Response status code:", res.statusCode);
    console.log(""); // Add a blank line for better readability between requests
  });

  next();
});


//? Initialize SQLite database
const db = new sqlite3.Database("./tasks.db", (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    db.run(
      `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task TEXT,
        gpt_response TEXT
      )`
    );
  }
});


//? Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);


// ! HTTP METHODS
// ? GET /tasks
app.get("/tasks", async (req, res) => {
  const tasks = await db.all("SELECT * FROM tasks").then((response) => {return await response.json()});

  console.log(tasks);

  return res.json([]);
});


// ? POST /tasks
app.post("/tasks", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "text is required." });
  }

  //* Step 1: Ping GPT API (replace with actual endpoint and API key)
  let gptMessage = 'No response';

  try {
    const gptResponse = await fetch(process.env.GPT_URL + "random-greeting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_GPT_API_KEY",
      },
      body: JSON.stringify({ prompt: text }),
    });

    if (!gptResponse.ok) {
      console.log("there is an error")
      throw new Error(`GPT API request failed with status ${gptResponse.status}`);
    }
    const gptData = await gptResponse.json();
    gptMessage = gptData.message;
  } catch (error){
    return res.status(500).json({error: "connection to gpt server failed"});
  }


  //* Step 2: Insert task and GPT response into SQLite database git 
  const query = `INSERT INTO tasks (task, gpt_response) VALUES ('${text}', '${gptMessage}')`;
  db.run(query, function (err) {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    //* Step 3: Return the task and GPT response
    return res.status(201).json({
      task: text,
      gpt_response: gptMessage,
    });
  });
});



//! Start the server
app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server is running at http://localhost:${PORT}/`);
  } else {
    console.log("Error:", error);
  }
});
