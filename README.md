# VERTEX-AI-CHATBOT
# 🌐 Vertex AI Chatbot with Google Search Integration

An **AI-powered chatbot** built with **Google Cloud Vertex AI (Gemini)** that can use **Google Search** to provide live, grounded answers.  
Full-stack setup with **Node.js + Express** backend and **React + Tailwind CSS** frontend.

---

## 🚀 Features
- **Google Gemini (Vertex AI) API integration**
- **Live Google Search** grounding
- **Full-stack app** (React + Tailwind frontend, Express backend)
- **CORS-enabled** backend for local dev
- **Easy deployment-ready structure**

---

## 📂 Project Structure
vertex-ai-chatbot/
│
├── backend/ # Node.js + Express backend
│ ├── server.js # Backend entry point
│ ├── package.json
│ ├── .env # Environment variables (ignored by Git)
│
├── frontend/ # React + Tailwind frontend
│ ├── src/App.jsx # Main UI
│ ├── package.json
│
└── README.md


---

## ⚙️ Prerequisites
- **Node.js v20+** (`nvm use 20.19.0`)
- **Google Cloud Project** with Vertex AI API enabled
- **Service Account JSON key** for authentication
- **gcloud CLI** (optional for auth)

---

## 📦 Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/vertex-ai-chatbot.git
cd vertex-ai-chatbot


env-setup

PROJECT_ID=your-gcp-project-id
LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json

cd backend
npm install


run backend

node server.js
# or
npx nodemon server.js

http://localhost:3000


cd ../frontend
npm install
npm run dev
http://localhost:5173


How It Works
Frontend sends a POST request to /api/ask with the user’s question.

Backend calls Vertex AI’s generateContent API with googleSearch tool enabled.

Gemini returns a grounded answer + sources.

Frontend renders the answer with clickable source links.

🖥 API Example
Request:curl -X POST http://localhost:3000/api/ask \
-H "Content-Type: application/json" \
-d '{"question": "What is the weather in Noida"}'

{
  "answer": "The weather in Noida is sunny, around 34°C.",
  "sources": [
    { "title": "Weather.com", "url": "https://weather.com/noida" }
  ]
}
Deployment Guide
Backend: Deploy on Render, Railway, or GCP Cloud Run.

Frontend: Deploy on Vercel or Netlify.

Update frontend API calls to use your production backend URL.

Set all .env variables in hosting platform.


