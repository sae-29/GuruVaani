# Guru Vaani Web Dashboard

## ADMIN FLOW - Complete Implementation

A comprehensive admin dashboard for DIET/SCERT officials to manage teacher reflections, AI-powered clustering, training modules, and analytics.

### Features

- **Login & Authentication**: Secure role-based access (DIET Admin, SCERT Admin, Block Coordinator)
- **Dashboard Overview**: Real-time metrics, challenges, and alerts
- **Entries Review**: Filter, search, and detail view of teacher diary entries with AI analysis
- **Cluster Analysis**: AI-powered semantic clustering with module recommendations
- **Module Management**: Create, publish, and track training modules
- **Dispatch System**: Send training to teachers by cluster or filters
- **Analytics**: Real-time engagement, completion rates, sentiment analysis
- **Notifications**: Multi-channel alerts (app, SMS, in-app)

### Architecture

```
web-dashboard/
├── src/
│   ├── components/
│   │   ├── Layout.tsx         # Main layout with navigation
│   │   ├── EntriesList.tsx    # Entries table and detail view
│   │   └── ClusterGrid.tsx    # Cluster cards and analysis
│   ├── pages/
│   │   ├── Login.tsx          # Admin login
│   │   ├── Dashboard.tsx      # Overview dashboard
│   │   ├── Entries.tsx        # Entries management
│   │   ├── Clusters.tsx       # Cluster analysis
│   │   ├── Modules.tsx        # Module library
│   │   └── Analytics.tsx      # Analytics dashboard
│   ├── types/
│   │   └── admin.ts           # TypeScript interfaces
│   ├── theme/
│   │   └── theme.ts           # Material-UI theme
│   ├── App.tsx                # Main app component
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

### Design System

**Colors:**
- Primary: #FF7043 (Saffron Orange)
- Secondary: #26A69A (Teal)
- Accent: #5C6BC0 (Indigo)

**Typography:**
- Font: Noto Sans (multilingual)
- Responsive sizing: H1-H3, Body, Caption

### Getting Started

```bash
cd web-dashboard
npm install
npm run dev
```

Default credentials:
- Username: admin
- Password: admin123

### Key Screens

1. **Login** - District/role selector, secure authentication
2. **Dashboard** - Metrics cards, top challenges, recent alerts
3. **Entries** - Filterable table with entry details modal
4. **Clusters** - AI-generated theme cards with dispatch options
5. **Modules** - Library with create/edit/publish workflow
6. **Analytics** - Engagement trends, completion funnel, sentiment

### API Integration

All components ready to integrate with backend:
- `GET /api/entries` - Fetch diary entries
- `GET /api/clusters` - Get clusters
- `GET /api/modules` - Module library
- `POST /api/dispatch` - Send training
- `GET /api/analytics` - Analytics data

### Development Notes

- Built with React 18, TypeScript, Material-UI
- Responsive design (mobile-friendly)
- Recharts for data visualization
- Vite for fast development
- Path aliasing: @/ maps to src/

### Future Enhancements

- Real-time WebSocket updates for dispatch tracking
- Advanced filtering and saved filters
- Custom dashboard builder
- PDF/CSV export functionality
- Multi-language support
- Dark mode theme
- Accessibility (A11y) improvements
