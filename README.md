# 🌸 Guru Vaani Platform

**Human-Centered AI Platform for Teacher Reflection & Professional Development**

Guru Vaani is an offline-first, AI-powered platform designed to support teachers through reflection, mentorship, and professional development. It combines a mobile app for teachers and a web dashboard for administrators, all built with a "Senior UX Designer" approach to ensure the technology feels human, warm, and culturally respectful.

---

## 📚 Table of Contents

- [Project Overview](#project-overview)
- [Human-Centered Design System](#human-centered-design-system)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Web Dashboard (Admin)](#web-dashboard-admin)
- [Backend API](#backend-api)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🎨 Human-Centered Design System

Both the **Admin Dashboard** and **Teacher Web App** have been completely redesigned following **senior UX designer principles** — creating interfaces that feel hand-crafted, emotionally warm, and culturally respectful, not template-like.

### 7 Core Design Principles

1.  **✅ Visual Uniqueness**: Asymmetrical grid layouts (60/40), varied card heights, and mixed spacing to avoid a robotic, template-like feel.
2.  **✅ Human Microcopy**: Over 100+ warm, supportive phrases replacing standard robotic text (e.g., "Entry Saved" → "Thanks for sharing today. We're keeping it safe. 🙏").
3.  **✅ Color, Texture & Visual Soul**:
    *   **Primary**: `#FF7043` (Saffron Orange) - Warmth, trust, energy.
    *   **Secondary**: `#26A69A` (Teal) - Calm, growth.
    *   **Background**: `#FDFBF8` (Off-white/Cream) - Lived-in, paper-like feel.
    *   **Texture**: Subtle SVG dot patterns and soft shadows.
4.  **✅ Emotional Moments**: Hero sections with personalized greetings, success alerts that celebrate growth, and encouraging closing messages.
5.  **✅ Intentional Imperfection**: Deliberate variations in border radius, icon sizes, and alignment to signal human design.
6.  **✅ Natural Human-Like Animations**: Staggered, wave-like animations (max 300ms) that feel organic rather than mechanical.
7.  **✅ Cultural Touches**: Use of Indian design language (Saffron, Namaste 🙏, Wheat 🌾), multilingual typography (Noto Sans), and teacher-centric context.

---

## 🏗 Architecture & Tech Stack

The platform consists of three main components:

### 1. Web Dashboard (Frontend)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) 5.14 with custom theming
- **State Management**: Redux Toolkit
- **Visualization**: Chart.js / Recharts
- **Routing**: React Router 6

### 2. Backend API
- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis
- **AI Integration**: Grok API (NLP, clustering, recommendations)
- **Authentication**: JWT (Role-based: Teacher, Admin, DIET/SCERT)
- **Storage**: AWS S3 compatible

### 3. Mobile App (Teacher App)
- **Framework**: React Native / Flutter (referenced in project structure)
- **Features**: Offline-first journaling, media capture, peer collaboration

---

## 🖥 Web Dashboard (Admin)

A comprehensive admin dashboard for DIET/SCERT officials to manage teacher reflections, AI-powered clustering, training modules, and analytics.

### Key Features
- **Login & Authentication**: Secure role-based access.
- **Dashboard Overview**: Real-time metrics, challenges, and alerts.
- **Entries Review**: Filter, search, and view teacher diary entries with AI analysis.
- **Cluster Analysis**: AI-powered semantic clustering of reflections to identify common themes.
- **Module Management**: Create, publish, and track training modules.
- **Dispatch System**: targeted training dispatch based on clusters or filters.
- **Analytics**: Engagement trends, completion funnels, and sentiment analysis.

### Directory Structure (`web-dashboard/`)
```
web-dashboard/
├── src/
│   ├── components/    # Reusable UI components (Layout, Charts, etc.)
│   ├── pages/         # Page views (Dashboard, Entries, Analytics)
│   ├── theme/         # Custom MUI theme implementation
│   ├── utils/         # Helpers (Animations, Formatting)
│   └── constants/     # Static data (Microcopy, Config)
```

---

## ⚙️ Backend API

Production-ready backend supporting offline-first sync, AI analysis, and scalable data management.

### Key Features
- **Offline-First Sync**: Batch processing of offline entries when connectivity is restored.
- **AI Engine**: Grok AI integration for sentiment analysis, topic clustering, and personalized feedback.
- **Role-Based Access**: Granular permissions for Admins, Teachers, and Officials.
- **Security**: Helmet.js, CORS, Rate Limiting, and Input Validation.

### API Endpoints Overview
- **Auth**: `/api/auth/login`, `/api/auth/register`, `/api/auth/me`
- **Entries**: `/api/entries` (CRUD), `/api/entries/sync` (Batch)
- **Modules**: `/api/modules` (Management), `/api/modules/dispatch`
- **Analytics**: `/api/analytics/clusters`, `/api/analytics/impact`

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- Redis (optional, for caching)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd guru-vaani-platform
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    
    # Configure Environment
    cp .env.example .env
    # Update .env with DB credentials and API keys
    
    # Setup Database
    npx prisma generate
    npx prisma db push
    
    # Start Server
    npm run dev
    ```

    **Backend Environment Variables (.env):**
    ```env
    PORT=3001
    DATABASE_URL="postgresql://user:password@localhost:5432/guruvaani"
    JWT_SECRET="your-secret-key"
    GROK_API_KEY="your-grok-api-key" (Optional)
    REDIS_URL="redis://localhost:6379" (Optional)
    AWS_ACCESS_KEY_ID="your-access-key" (Optional for S3)
    AWS_SECRET_ACCESS_KEY="your-secret-key" (Optional for S3)
    ```

3.  **Web Dashboard Setup**
    ```bash
    cd ../web-dashboard
    npm install
    npm run dev
    ```

4.  **Access the Applications**
    - **Web Dashboard**: `http://localhost:5173` (Default Admin: `admin` / `admin123`)
    - **Backend API**: `http://localhost:3001`

---

## 📂 Project Structure

```
guru-vaani-platform/
├── mobile-app/          # React Native/Flutter mobile application
├── web-dashboard/       # React.js web admin dashboard
├── backend/             # Node.js API server
├── shared/              # Shared utilities and types
└── docs/                # Documentation and design assets
```

---

## 🤝 Contributing

Please read our contributing guidelines and code of conduct before submitting pull requests. We welcome contributions that align with our human-centered design philosophy.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
