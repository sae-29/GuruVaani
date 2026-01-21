# Guru Vaani - AI-Powered Teacher Support Platform

Guru Vaani is a comprehensive platform designed to empower teachers through AI-assisted reflection, professional development, and administrative support.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
# Install dependencies for all workspaces
npm install
```

### Running the Platform
To start all services (Backend, Teacher App, Admin Dashboard) concurrently:
```bash
npm run dev
```

Or run them individually in separate terminals:

**1. Backend API** (Port 3001)
```bash
npm run dev:backend
```

**2. Teacher Web App** (Port 5176)
```bash
npm run dev:web
```

**3. Admin Dashboard** (Port 5183)
```bash
npm run dev:dashboard
```

## 🏗️ Architecture

- **`backend`**: Node.js/Express + Prisma (SQLite). Handles Auth, Users, Reflections, and AI processing.
- **`teacher-web-app`**: React + Vite (Mobile-first). "Your Journey" reflection tool, voice-to-text, and AI insights.
- **`web-dashboard`**: React + Vite (Admin). Teacher directory, analytics, and platform settings.
- **`shared`**: Shared TypeScript types, theme tokens, and utility functions.

## 🔧 Troubleshooting

### Common Issues
- **Vite Dependency Error**: If you see "dependencies imported but could not be resolved", try:
  ```bash
  # Clear Vite cache
  rm -rf node_modules/.vite
  npm run dev:dashboard -- --force
  ```
- **Port Conflicts**: The apps define default ports (3000, 3002, 3004) but will auto-switch if busy (e.g., to 5176, 5183). Check terminal output for the active URL.

## ✅ Verified Features (Phase 5)
- **Teacher Management**: Complete directory with search/filtering and "Last Active" tracking.
- **Settings**: Platform configuration and AI behavior controls.
- **Reflection Page**: Admin view with correct filtering by Subject and Grade.
- **CORS**: Configured to allow cross-origin requests from dynamic frontend ports.
