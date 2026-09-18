<div align="center">
  <h1>🌉 ClassBridge</h1>
  <p><strong>The AI-powered school communication bridge that turns noisy WhatsApp circulars and paper notices into structured, actionable student task plans.</strong></p>
  <img src="https://img.shields.io/badge/Powered%20By-Gemini%202.5%20Flash-4285F4?style=for-the-badge&logo=google" />
  <img src="https://img.shields.io/badge/Built%20With-React%2019%20%2B%20TypeScript-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Stack-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js" />
</div>

---

## 🎯 The Problem

Google Classroom handles formal assignments — but it misses the **80% of daily school communication** that happens in parent WhatsApp groups, photographed bulletin board notices, and verbal classroom reminders. **82% of students** miss at least one crucial deadline per semester because it was buried in an unread WhatsApp message or misplaced paper circular.

**ClassBridge is the bridge between messy school communication and clear student action.**

---

## ✨ Core Features

### 🤖 AI-Powered Circular Scanner
- Paste text **or drag-and-drop a photo** of any school notice
- Google Gemini 2.5 Flash extracts: deadline, location, required materials, urgency level, and required action
- Multimodal Vision AI reads photographs of physical paper circulars and WhatsApp screenshots
- Translates extracted notices into Hindi, Tamil, or Spanish

### 🎓 Student Portal
- **Dashboard** with dynamic 7-day deadline collision detection
- **Online Quiz Runner** with countdown timer and instant graded results
- **🎉 Confetti Celebration** when scoring 80%+ or submitting projects
- **Attendance Tracker** with subject-wise breakdown
- **Class Notes Library** — browse and download teacher-uploaded materials
- **Leaderboard** — 🥇🥈🥉 podium with School Toppers, Attendance Champions, Quiz Champions, and Project Stars

### 👩‍🏫 Teacher Portal
- **Quiz Creator** with custom time limits (Practice / 10 / 15 / 20 / 30 / 45 / 60 min)
- **Batch Attendance Marking** with Mark All Present
- **Project Assignment Manager** with online submission toggle and grading
- **Class Notes Uploader** for lecture notes, formula sheets, and assessments

---

## 🚀 Running Locally

**Prerequisites**: Node.js 18+

```bash
# 1. Clone and install
git clone https://github.com/[your-username]/classbridge
cd classbridge
npm install --legacy-peer-deps

# 2. (Optional) Add Gemini API key for live AI
echo "GEMINI_API_KEY=your_key_here" > .env

# 3. Start the development server
npm run dev
# → Opens at http://localhost:3000
```

> **Note**: The app works fully without a `GEMINI_API_KEY` — a built-in heuristic extraction engine handles the AI circular parsing during demo/offline mode.

## Demo Logins (No Sign-Up Required)
| Role | Button | User |
|---|---|---|
| Student | "Try Student Demo" | Maya Sharma, Grade 10-A |
| Teacher | "Try Teacher Demo" | Mr. Sharma, Science Dept |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React, Motion |
| **Backend** | Node.js, Express 4, tsx, esbuild |
| **AI / API** | Google Gemini 2.5 Flash (`@google/genai`), multimodal `inlineData` vision, `responseSchema` structured output |
| **Custom Engines** | Canvas Confetti physics engine, rolling 7-day conflict detection clustering algorithm |

---

## 🤖 AI Disclosure

ClassBridge uses **Google Gemini 2.5 Flash** as a core product feature:
- **Text Extraction**: Structured JSON via `responseSchema` enforced prompts
- **Vision OCR**: Base64 `inlineData` image payloads for paper circular photos
- **Translation**: Live multilingual output for Hindi, Tamil, and Spanish
- **Plain Language**: "Explain Simply" mode rewrites complex notices for students

We also used **Google Antigravity (AI coding assistant)** to help build the codebase — including the dual-portal architecture, TypeScript type system, and dynamic conflict detection algorithm. We understand every part of what we built and can explain it clearly.

---

## 📁 Project Structure

```
classbridge/
├── server.ts                    # Express API (Gemini AI endpoints)
├── src/
│   ├── App.tsx                  # Dual-portal state machine
│   ├── types.ts                 # TypeScript type definitions
│   ├── components/              # 22 React components
│   │   ├── AnnouncementAnalyzer.tsx   ← AI Circular Parser
│   │   ├── StudentQuizView.tsx        ← Quiz runner + confetti
│   │   ├── LeaderboardView.tsx        ← Honor Roll podium
│   │   └── DemoGuideModal.tsx         ← Judge pitch script
│   ├── utils/
│   │   ├── confetti.ts                ← Canvas physics engine
│   │   └── conflictDetector.ts        ← 7-day clustering algorithm
│   └── data/mockData.ts               ← Pre-seeded school demo data
```

---

<div align="center">
  <p>Built for the Hackathon · Powered by Google Gemini · Made with ❤️ for students everywhere</p>
</div>
