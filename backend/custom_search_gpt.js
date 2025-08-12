// customSearch.js
const fs = require('fs');
const { VertexAI } = require('@google-cloud/vertexai');

const schemaFile = './los_data_12_aug.json';

// Load schema JSON once
function loadSchema() {
  let raw = fs.readFileSync(schemaFile, 'utf8');
  let parsed = JSON.parse(raw);
  return JSON.parse(parsed.schema_metadata);
}

// Initialize Vertex
const vertexAI = new VertexAI({
  project: process.env.PROJECT_ID,
  location: process.env.LOCATION || 'us-central1',
});
const model = vertexAI.getGenerativeModel({
  model: 'gemini-2.5-flash-lite',
});

async function generateSQL(userPrompt) {
  const schemaData = loadSchema();

  const prompt = `
You are a senior SQL expert.
Given the following PostgreSQL schema in JSON format:
${JSON.stringify(schemaData, null, 2)}

The user request is: "${userPrompt}".

1. Write a single valid SQL query using only the tables and columns in the schema.
2. Then, explain the result in human-readable form.
`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 512 }
  });

  return result.response.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

module.exports = { generateSQL };
