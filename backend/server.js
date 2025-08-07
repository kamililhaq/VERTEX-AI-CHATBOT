require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { VertexAI } = require('@google-cloud/vertexai');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

console.log("🚀 Starting backend server...");

// Vertex AI
const vertexAI = new VertexAI({
  project: process.env.PROJECT_ID,
  location: process.env.LOCATION || 'us-central1',
});
const model = vertexAI.getGenerativeModel({
  model: 'gemini-2.5-flash-lite',
});

// PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 🧠 Smart AI Endpoint
app.post('/api/ask', async (req, res) => {
  const { question } = req.body;

  const prompt = `
You're an intelligent assistant. Decide if the user's message needs a SQL query from this DB:

users(id, name, email, created_at)  
orders(id, user_id, product_name, amount, order_date)

Reply in this JSON format (and ONLY this format):

{
  "action": "sql" | "chat",
  "sql": "..." (optional),
  "reply": "..." (required)
}

Message: """${question}"""
`;

  try {
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 512
      }
    });

    const raw = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const parsed = JSON.parse(raw);
    console.log("==================",parsed);
    if (parsed.action === "sql" && parsed.sql?.toLowerCase().startsWith("select")) {
      const dbRes = await pool.query(parsed.sql);
      return res.json({
        answer: "```json\n" + JSON.stringify(dbRes.rows, null, 2) + "\n```",
        sql: parsed.sql
      });
    } else {
      return res.json({ answer: parsed.reply });
    }
  } catch (err) {
    console.error("AI error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
