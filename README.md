# Guru Vaani - AI-Powered Teacher Reflection Platform

Guru Vaani is a comprehensive platform designed to empower teachers through AI-assisted reflection and provide administrators with actionable insights into educational trends.

## 🏗️ Project Structure

The project is organized as a monorepo with the following packages:

- **`backend`**: Node.js/Express server using Prisma (SQLite) for data persistence and authentication.
- **`teacher-web-app`**: sleek, mobile-first React application for teachers to submit reflections (text/voice).
- **`web-dashboard`**: Admin interface for viewing analytics, managing teachers, and monitoring reflections.
- **`shared`**: Common UI components, design tokens, and utilities shared between frontends.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Database Setup**:
    Initialize the SQLite database:
    ```bash
    cd backend
    npx prisma migrate dev --name init
    npx prisma generate
    cd ..
    ```

### Running the Platform
To start all services (Backend, Teacher App, Admin Dashboard) concurrently:

```bash
npm run dev
```

Or run them individually:
- **Backend** (Port 3001): `npm run dev:backend`
- **Teacher App** (Port 3002): `npm run dev:web`
- **Admin Dashboard** (Port 3004/3005): `npm run dev:dashboard`

## 🔑 Key Features

### For Teachers (Mobile App)
- **AI-Guided Reflection**: "Share a Story" feature with mood tracking.
- **Voice Support**: Integrated voice recording for easy input.
- **My Entries**: View past reflections and growth insights.

### For Admins (Web Dashboard)
- **Teacher Directory**: Track educator engagement and "Last Active" status.
- **Reflection Analysis**: View AI-driven sentiment analysis and clustering.
- **Settings**: Configure platform behaviors.

## 🛠️ Technology Stack
- **Frontend**: React, Vite, Material UI (MUI), Recharts
- **Backend**: Express.js, Prisma ORM, SQLite
- **Authentication**: JWT & Role-Based Access Control (RBAC)
- **Styling**: Emotion, Custom Design Tokens

## 📝 License
Proprietary - Guru Vaani
