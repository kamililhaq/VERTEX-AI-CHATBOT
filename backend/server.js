require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { VertexAI } = require('@google-cloud/vertexai');

const app = express();
app.use(express.json());
app.use(cors());

const project = process.env.PROJECT_ID;
const location = process.env.LOCATION || 'us-central1';
const vertexAI = new VertexAI({ project, location });

const model = vertexAI.getGenerativeModel({
  model: 'gemini-2.5-flash-lite'
});

app.post('/api/ask', async (req, res) => {
  try {
    const { question } = req.body;
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: question }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024
      },
      tools: [{ googleSearch: {} }]
    });

    const answer = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "(No response)";
    const sources = result.response.candidates?.[0]?.groundingMetadata?.webSearchSources || [];

    res.json({ answer, sources });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
