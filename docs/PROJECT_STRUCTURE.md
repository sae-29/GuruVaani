# Guru Vaani - Project Structure

## Overview
This document outlines the structure and organization of the Guru Vaani Teacher Reflection Platform project.

## Root Directory Structure

```
guru-vaani-platform/
├── README.md                 # Main project documentation
├── package.json             # Root package.json with workspace configuration
├── .gitignore              # Git ignore rules
├── mobile-app/             # React Native mobile application
├── web-dashboard/          # React.js web admin dashboard
├── backend/               # Node.js API server
├── shared/                # Shared utilities and types
└── docs/                  # Documentation and design assets
```

## Mobile App (`/mobile-app`)

React Native application for teachers to create and manage reflections.

```
mobile-app/
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/          # Screen components
│   ├── navigation/       # Navigation configuration
│   ├── store/           # Redux store and slices
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── theme/           # Theme configuration
│   ├── i18n/            # Internationalization
│   └── App.tsx          # Main app component
├── android/             # Android-specific files
├── ios/                 # iOS-specific files (future)
├── assets/              # Images, fonts, etc.
└── package.json         # Mobile app dependencies
```

## Web Dashboard (`/web-dashboard`)

React.js web application for administrators and mentors.

```
web-dashboard/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── store/          # Redux store and slices
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   ├── theme/          # Material-UI theme
│   ├── hooks/          # Custom React hooks
│   └── App.tsx         # Main app component
├── public/             # Static assets
├── dist/               # Build output
└── package.json        # Web dashboard dependencies
```

## Backend (`/backend`)

Node.js API server with Express and Prisma.

```
backend/
├── src/
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   └── index.ts        # Server entry point
├── prisma/
│   ├── schema.prisma   # Database schema
│   ├── migrations/     # Database migrations
│   └── seed.ts         # Database seeding
├── uploads/            # File uploads (development)
├── logs/               # Application logs
└── package.json        # Backend dependencies
```

## Shared (`/shared`)

Common utilities, types, and configurations shared across platforms.

```
shared/
├── src/
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Shared utility functions
│   ├── constants/      # Application constants
│   └── validators/     # Data validation schemas
└── package.json        # Shared package dependencies
```

## Documentation (`/docs`)

Project documentation, design assets, and guides.

```
docs/
├── PROJECT_STRUCTURE.md    # This file
├── API_DOCUMENTATION.md    # API endpoints documentation
├── DEPLOYMENT_GUIDE.md     # Deployment instructions
├── DESIGN_SYSTEM.md        # UI/UX design guidelines
├── CONTRIBUTING.md         # Contribution guidelines
├── assets/                 # Design assets, mockups
└── screenshots/            # Application screenshots
```

## Key Technologies

### Mobile App
- **React Native 0.72+**: Cross-platform mobile development
- **React Native Paper**: Material Design components
- **React Navigation**: Navigation library
- **Redux Toolkit**: State management
- **TypeScript**: Type safety

### Web Dashboard
- **React 18**: Frontend framework
- **Material-UI (MUI)**: Component library
- **Vite**: Build tool and dev server
- **Redux Toolkit**: State management
- **TypeScript**: Type safety

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **Prisma**: Database ORM
- **PostgreSQL**: Primary database
- **JWT**: Authentication
- **TypeScript**: Type safety

## Development Workflow

1. **Setup**: Run `npm run install:all` to install all dependencies
2. **Development**: 
   - Backend: `npm run dev:backend`
   - Web: `npm run dev:web`
   - Mobile: `npm run dev:mobile`
3. **Testing**: `npm test` runs tests across all packages
4. **Building**: `npm run build:all` builds production assets

## Environment Configuration

Each package has its own environment configuration:
- Backend: `.env` file with database, JWT, and service configurations
- Web Dashboard: Environment variables for API endpoints
- Mobile App: Configuration through app.json and environment-specific files

## Deployment Architecture

- **Mobile App**: Android APK/AAB for Google Play Store
- **Web Dashboard**: Static files deployed to CDN/hosting service
- **Backend**: Containerized deployment on cloud platform
- **Database**: Managed PostgreSQL service
- **File Storage**: Cloud storage service (AWS S3/Google Cloud Storage)