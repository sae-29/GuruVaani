# Guru Vaani Backend API

Production-ready backend for Guru Vaani - an offline-first, AI-powered teacher reflection and professional development platform.

## Tech Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Cache/Sessions**: Redis
- **AI Provider**: Grok API
- **Authentication**: JWT
- **File Storage**: S3-compatible (configurable)

## Features

- ✅ Offline-first batch sync
- ✅ Grok AI integration for NLP and clustering
- ✅ Role-based access control (Teacher, Admin, DIET/SCERT)
- ✅ Diary entry management with voice support
- ✅ Training module creation and dispatch
- ✅ Analytics and clustering engine
- ✅ Feedback and impact tracking
- ✅ Notification service (Push, SMS, In-app)

## Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+
- Redis 6+ (optional, falls back to mock if unavailable)
- Grok API key (optional, falls back to mock responses)

## Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
npx prisma generate
npx prisma db push
# Or use migrations: npx prisma migrate dev

# Seed database (optional)
npm run db:seed
```

## Environment Variables

Create a `.env` file:

```env
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3002

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/guruvaani"

# Redis (optional)
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# Grok AI (optional)
GROK_API_KEY="your-grok-api-key"
GROK_API_URL="https://api.x.ai/v1"
GROK_MODEL="grok-beta"

# File Storage (S3-compatible)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_BUCKET="guruvaani-uploads"
AWS_ENDPOINT="" # Leave empty for AWS S3, set for S3-compatible services

# SMS Provider (optional)
SMS_PROVIDER="twilio" # or "aws-sns"
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""
```

## Running the Server

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Health check
curl http://localhost:3001/health
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Teacher/Admin login
- `POST /api/auth/register` - Teacher registration
- `GET /api/auth/me` - Get current user

### Diary Entries

- `POST /api/entries` - Create single entry (online)
- `POST /api/entries/sync` - Batch sync entries (offline-first)
- `GET /api/entries/my` - Get user's entries
- `GET /api/entries/:id` - Get single entry with AI suggestions
- `GET /api/entries/admin/list` - Get entries for admin (anonymized)

### Training Modules

- `POST /api/modules` - Create module (Admin only)
- `GET /api/modules` - List modules
- `GET /api/modules/:id` - Get single module
- `POST /api/modules/dispatch` - Dispatch modules to teachers/clusters

### Analytics (Admin Only)

- `GET /api/analytics/clusters` - Get clusters of similar entries
- `GET /api/analytics/alerts` - Get priority alerts
- `GET /api/analytics/impact` - Get impact metrics

### Feedback

- `POST /api/feedback` - Submit module feedback
- `GET /api/feedback/module-performance` - Get module performance stats

## API Examples

### Batch Sync (Offline-First)

```bash
POST /api/entries/sync
Authorization: Bearer <token>
Content-Type: application/json

{
  "entries": [
    {
      "id": "client-generated-id-1",
      "textContent": "Students struggled with division today...",
      "grade": "Class 4",
      "subject": "Mathematics",
      "topicTags": ["division", "visual-aids"],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "deviceId": "device-123",
  "lastSyncTimestamp": "2024-01-14T10:00:00Z"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "synced": ["server-entry-id-1"],
    "conflicts": [],
    "errors": []
  }
}
```

### Get AI Suggestions

```bash
GET /api/entries/:id
Authorization: Bearer <token>
```

Response includes `aiResponse`:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "content": "...",
    "aiResponse": {
      "acknowledgement": "Thank you for sharing...",
      "tips": ["Try using visual aids...", "Consider peer tutoring..."],
      "suggestedModules": [
        {
          "id": "module-1",
          "title": "Visual Learning Strategies",
          "relevanceScore": 0.92,
          "reasoning": "Matches your recent challenges..."
        }
      ],
      "similarIssues": [
        {
          "count": 15,
          "description": "Similar division challenges reported"
        }
      ]
    }
  }
}
```

### Generate Clusters (Admin)

```bash
GET /api/analytics/clusters?region=DistrictA&startDate=2024-01-01
Authorization: Bearer <admin-token>
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "cluster-1",
      "title": "Division Concept Challenges",
      "description": "Teachers reporting difficulty teaching division...",
      "entryIds": ["entry-1", "entry-2"],
      "frequency": 12,
      "avgSentiment": -0.3,
      "priority": "HIGH"
    }
  ]
}
```

## Database Schema

See `prisma/schema.prisma` for full schema. Key models:

- `User` - Teachers, Admins, Officials
- `Reflection` - Diary entries
- `Cluster` - AI-generated clusters
- `TrainingModule` - Training content
- `UserTraining` - Module assignments and completions
- `UserNotification` - In-app notifications

## Offline Sync Flow

1. Client stores entries locally when offline
2. On reconnect, client sends batch via `POST /api/entries/sync`
3. Server processes entries, checks for conflicts
4. Server triggers AI analysis asynchronously
5. Server returns sync result with any conflicts
6. Client reconciles conflicts and updates local state

## AI Integration

The backend uses Grok API for:

1. **Teacher-side**: Empathetic responses, tips, module recommendations
2. **Admin-side**: Clustering, priority ranking, alert generation

AI responses are cached in Redis for 24 hours to reduce API calls.

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE" // Optional
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch
```

## Deployment

### Docker

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure production database URL
3. Set secure JWT secrets
4. Configure Redis for caching
5. Set up S3-compatible storage
6. Configure Grok API key

## Monitoring

- Health check: `GET /health`
- Logs: Winston logger (see `logs/` directory)
- Metrics: Add Prometheus/StatsD as needed

## Security

- ✅ Helmet.js for security headers
- ✅ CORS configured
- ✅ Rate limiting (100 req/15min per IP)
- ✅ JWT authentication
- ✅ Input validation (Joi)
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection (Helmet)

## License

Proprietary - Guru Vaani Platform
