# PickUP — AI Campaign Intelligence

PickUP is a modern, full-stack platform designed for brand marketing teams, growth leads, and agencies to manage their entire influencer and creator campaign lifecycle. Instead of juggling spreadsheets, DMs, and disconnected analytics tools, PickUP provides a unified workspace for discovery, vetting, execution, and measurement.

## ✨ Key Features

- **Creator Discovery:** Advanced filtering by platform, niche, and match score with a dynamic, fillable discovery brief and a side-by-side comparison table.
- **ROI Predictor:** An interactive, dynamic calculator to forecast campaign performance (reach, conversions, revenue, ROAS) before budget approval.
- **Campaign Management:** A centralized command center featuring high-level stats dashboards, a Kanban pipeline, and an activity timeline.
- **Fraud Detection:** Simulated AI-powered fraud scanning to identify fake followers and engagement bots.
- **Workspace Settings:** Robust configuration suite including integration management, billing/usage meters, and team seat tracking.

## 🏗 Architecture

This project is built using a modern, lightweight tech stack:

- **Frontend:** React (v19) powered by Vite. Features responsive, beautifully crafted CSS with glassmorphism and modern UI paradigms.
- **Backend:** Node.js + Express REST API (`server/index.js`).
- **Data Store:** File-based JSON data (`server/data/*.json`). The API reads and writes to these JSON files, ensuring data persists across sessions without the need for a complex database setup.

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd pickup
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Application

PickUP comes with a proxy configured so the frontend development server and the backend API can communicate seamlessly. 

The easiest way to start both the frontend and backend simultaneously is to run:

```bash
npm run dev:full
```

This will:
1. Start the Express API server on `http://localhost:3001`
2. Start the Vite React app on `http://localhost:5173` (or the next available port)

Open your browser to the Vite local URL to view the app!

### Running Separately

If you prefer to run them in separate terminal instances:

**Start the Backend:**
```bash
npm run server
```

**Start the Frontend:**
```bash
npm run dev
```

## 📜 Available Scripts

- `npm run dev:full` — Runs both the frontend and backend concurrently.
- `npm run dev` — Starts the Vite development server.
- `npm run server` — Starts the Express API server.
- `npm run build` — Builds the Vite frontend for production.
- `npm run preview` — Locally preview the production build.
- `npm run lint` — Lints the codebase using ESLint.

## 📁 Directory Structure

```text
pickup/
├── server/               # Express backend API
│   ├── data/             # JSON data store
│   ├── middleware/       # Express middleware (e.g., error handling)
│   ├── routes/           # API route modules
│   └── index.js          # Express entry point
├── src/                  # React frontend
│   ├── hooks/            # Custom React hooks (useApi, useScrollReveal)
│   ├── App.jsx           # Main application and UI views
│   ├── index.css         # Global styles and modern CSS variables
│   └── main.jsx          # React entry point
├── vite.config.js        # Vite configuration (includes API proxy)
└── package.json          # Project dependencies and scripts
```
