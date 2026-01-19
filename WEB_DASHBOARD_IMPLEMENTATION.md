# GURU VAANI ADMIN DASHBOARD - WEB IMPLEMENTATION GUIDE

## Project Overview

A comprehensive React + Material-UI admin dashboard for managing teacher professional development through the Guru Vaani platform. Supports 9 main screens with real-time analytics, AI-powered clustering, and training dispatch.

---

## ARCHITECTURE & TECH STACK

### Frontend Framework
- **React 18.2** - Component library
- **TypeScript 5.2** - Type safety
- **Material-UI 5.14** - Component library  
- **Recharts 2.10** - Data visualization
- **React Router 6.16** - Client-side routing
- **Vite 4.5** - Build tool with HMR

### Development Setup
```bash
cd d:\Downloads\GuruVaani\web-dashboard
npm install
npm run dev          # Dev server on http://localhost:3001
npm run build        # Production build
npm run type-check   # TypeScript validation
```

### Folder Structure
```
src/
├── pages/           # 9 main screens
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Entries.tsx
│   ├── Clusters.tsx
│   ├── Modules.tsx
│   └── Analytics.tsx
├── components/      # Reusable components
│   ├── Layout.tsx          # Main app layout
│   ├── EntriesList.tsx     # Entries table
│   └── ClusterGrid.tsx     # Cluster cards
├── types/          # TypeScript interfaces
│   └── dashboard.ts # Comprehensive type definitions
├── theme/          # Design system
│   └── theme.ts    # Material-UI theme
└── App.tsx         # Router setup
```

---

## SCREEN 1: LOGIN PAGE

### Features
- ✅ District selector dropdown (required)
- ✅ Username input with user icon
- ✅ Password input with show/hide toggle
- ✅ Remember me checkbox
- ✅ Full-width orange login button (48px height)
- ✅ Loading spinner during submission
- ✅ Error alert banner (red)
- ✅ Forgot password link
- ✅ Gradient background (orange to teal)
- ✅ Centered card layout (max-width 480px)

### File: `src/pages/Login2.tsx`
```typescript
// Implemented with:
// - District selector with dropdown options
// - Password visibility toggle (eye icon)
// - Form validation & error handling
// - Loading state with spinner
// - Responsive styling
```

### Styling
- Background: Linear gradient (135deg, #FF7043 → #26A69A)
- Card: Rounded 16px, shadow elevation
- Buttons: 48px height, orange gradient
- Form inputs: 48px height, icon adorners

---

## SCREEN 2: DASHBOARD OVERVIEW

### Section 1: Key Metrics (4 Cards)
```
Card 1: Active Teachers
- Icon: Users (teal, 48px)
- Value: "247" (36px bold)
- Trend: "+12 this week" (green)
- Sparkline: Last 7 days mini chart

Card 2: New Entries This Week
- Icon: Notebook (orange)
- Value: "89"
- Breakdown: "62 text, 27 voice"

Card 3: Training Completion Rate
- Icon: Graduation cap (purple)
- Circular progress: 78%
- Donut chart (orange/gray)

Card 4: Avg. Teacher Satisfaction
- Icon: Star (gold)
- Rating: "4.3 ⭐"
- Count: "Based on 234 reviews"
```

### Section 2: Top Challenges & Geographic (2-column)
- **Left (60%)**: Horizontal bar chart showing challenges by teacher count
- **Right (40%)**: Alerts panel (scrollable, priority-colored), Quick Actions (3 buttons), Activity timeline

### Section 3: Navigation
- Fixed top app bar (64px)
- Tabs: Overview, Entries, Clusters, Modules, Analytics
- Notification bell with badge count
- User profile dropdown (My Profile, Settings, Logout)

### Implementation Details
- Responsive grid: 4 columns (desktop) → 2 (tablet) → 1 (mobile)
- Metric cards use Material-UI Paper component
- Charts powered by Recharts
- Uses mock data (ready for API integration)

---

## SCREEN 3: ENTRIES REVIEW

### Filter Bar (Sticky)
- Date Range Picker (calendar modal)
- Subject/Grade/Block multi-select dropdowns
- Entry Type radio buttons (All/Text/Voice)
- Status dropdown (All/Unreviewed/Tagged/In Progress/Resolved)
- Search input (debounced 300ms)
- Apply Filters & Reset buttons

### Data Table
- Sortable columns: Date/Time, Teacher ID, School/Block, Grade|Subject, Snippet, Type, Sentiment, Tags, Actions
- Alternate row shading
- Hover state (light blue)
- Checkbox select (individual + select all)
- Bulk actions toolbar (cluster assignment, mark reviewed, export)
- Pagination (25/50/100 rows per page)

### View Toggle
- List View (active)
- Cluster View (inactive)

### Implementation
- Material-UI Table component
- Search with debounce hook
- Filter state in URL params
- Mock data with 50+ entries

---

## SCREEN 4: ENTRY DETAIL MODAL

### Layout
- Semi-transparent overlay (80% opacity)
- White card (max-width 800px, max-height 90vh)
- Fixed header with navigation arrows (Previous/Next entry)
- Close button (X)
- Scrollable content

### Content Sections
1. **Entry Metadata**: Teacher ID, School, Date/Time, Entry ID
2. **Context Tags**: Chips with orange background
3. **Entry Content**: Text paragraph OR audio player with waveform
4. **AI Analysis Panel** (collapsible):
   - Detected keywords
   - Sentiment (emoji + confidence %)
   - Suggested cluster (with match score)
   - Priority badge
   - Similar entries link
5. **Admin Actions**:
   - Tag management (add/remove)
   - Cluster assignment dropdown
   - Suggested trainings (checkboxes)
   - Direct message text area (500 char limit)
   - Status update dropdown
6. **Entry History Timeline**: Submitted → Analyzed → Tagged → Training Sent → Resolved

### Implementation
- Material-UI Dialog component
- Modal content scrollable
- AI Analysis mock data
- Training recommendations list

---

## SCREEN 5: CLUSTER MANAGEMENT

### Left Sidebar (25%)
- **Clustering Settings**:
  - AI Model selector (Semantic/Keyword/Topic Modeling)
  - Sensitivity slider (1-10)
  - Time period dropdown (Last 7/30 days, All time)
  - Subject filter checkboxes
  - Refresh Clusters button
  - Last updated timestamp

### Main Content (75%)
- **Cluster Cards Grid** (3 columns, responsive)
  - Title with edit pencil icon
  - Urgency color bar (red/yellow/green top border)
  - Teacher count badge (24 affected)
  - Word cloud (keywords sized by frequency)
  - Trend indicator (+8 new this week)
  - Sample snippet
  - Suggested training match card
  - Action buttons (View All, Assign Training, Menu)

### Cluster Detail Panel
- Slide-in from right (50% width)
- Cluster name (inline editable)
- Metadata cards (teachers, subjects, grades, blocks, first reported)
- Collapsible Entries list
- AI Insights section
- Recommended Trainings (ranked by relevance)
- Action buttons (Dispatch, Merge, Mark Priority, Export)

### Implementation
- Grid layout with 3 columns
- Word cloud visualization
- Mock cluster data with 50+ clusters
- Drawer component for detail panel

---

## SCREEN 6: MODULE MANAGEMENT

### Header & Controls
- Title: "Training Modules"
- "+ Create New Module" button
- Tabs: All Modules, Published, Drafts, Archived
- Search input
- Filters: Subject, Grade, Format, Source, Sort by

### Module Cards Grid
- 4 columns (desktop), responsive to 2/1
- Thumbnail (160px height, play icon for videos)
- Title (16px, 2 lines max)
- Duration badge (orange pill)
- Format icon + tag chips
- Usage stats ("Sent to 42 teachers, 83% completed")
- Rating (4.5⭐, 23 reviews)
- Last updated date
- Action icons (Preview, Edit, Duplicate, Archive, Send)

### Implementation
- Material-UI Grid component
- 16px gap between cards
- Responsive breakpoints
- Mock module data (20+ modules)

---

## SCREEN 7: MODULE CREATOR WIZARD

### Multi-Step Flow (Progress Indicator)

#### Step 1: Basic Information
- Module Title (max 100 chars, counter)
- Short Description (200 char max)
- Full Description (rich text, 1000 char max)
- Duration (number input + slider, 3-30 min)
- Subject dropdown
- Grade levels (checkboxes 1-12, chip style)
- Topic tags (autocomplete, chip output)
- Languages (dropdown + translation checkboxes)
- Thumbnail uploader (drag-drop or browse)

#### Step 2: Content Upload
- Format tabs: Video, Audio, Text/Slides, External Link
- For Video: drag-drop uploader (MP4/MOV, 200MB max), progress bar, auto-compress checkbox, subtitle upload
- For Audio: MP3 uploader (20MB max), transcript upload
- For Text: rich text editor with slide pagination
- For External: URL input + preview fetch
- Supplementary materials (PDFs, activity guides)

#### Step 3: Interactive Elements
- Quiz toggle (MCQ/True-False/Short answer builder)
- Reflection prompt toggle
- Classroom activity toggle
- Pass threshold slider

#### Step 4: Review & Publish
- Left: Full preview (mobile/tablet/web view toggle)
- Right: Publication settings
  - Save as Draft vs Publish
  - Feature on homepage
  - Recommended for new teachers
  - Prerequisites dropdown
  - Difficulty level (Beginner/Intermediate/Advanced)
  - NEP alignment checkboxes
  - Copyright/attribution input
- Publish button with success animation

### Implementation
- Stepper component (Material-UI)
- Left sidebar preview pane
- Form validation on each step
- State management for multi-step form

---

## SCREEN 8: DISPATCH TRAINING WIZARD

### Step 1: Select Recipients
**Tab Navigation:**
1. **From Cluster**: Dropdown to select cluster, scrollable teacher table (Teacher ID, School, Grade, Subject), checkboxes to deselect
2. **By Filters**: Subject/Grade/Block multi-select, Recent Activity dropdown, Keyword search
3. **Individual Selection**: Search bar with autocomplete, selected as chips
4. **Broadcast to All**: Warning text, confirmation checkbox (must check)

**Recipients Summary Panel** (right sidebar):
- Total count (42 teachers)
- Breakdown by Block/Subject
- Review Full List button

### Step 2: Notification Configuration
- Notification channels (checkboxes): App Push, SMS, USSD, In-App
- Message customization:
  - SMS (160 char max, template with variables)
  - Push notification (title + body with phone preview)
  - In-App message (rich editor)
- Scheduling: Send Immediately OR Schedule for Later (date picker, time, IST timezone)
- Follow-up settings: Reminder after X days, survey after completion
- Completion tracking: Deadline, certificate award
- Send time optimization suggestion

### Step 3: Final Review & Confirm
**Summary Card** displays:
- Module details (thumbnail, title, duration, format)
- Recipients (count, blocks, subjects breakdown)
- Notification settings (channels, time, follow-up, deadline)
- Estimated impact (data usage MB, SMS cost ₹, budget remaining, reach %)

**Confirmation Checklist** (all required):
- Reviewed recipient list ✓
- Messages are appropriate ✓
- Content relevant to recipients ✓
- Approval to send (if required) ✓

**Buttons**: Back to Edit, Confirm & Send (requires 2nd confirmation)

### Post-Dispatch Tracking
- Success animation (envelope flying + confetti)
- Real-time tracking dashboard (auto-updates every 10s)
- Delivery status cards (app notifications sent, SMS delivered, first opens)
- Engagement funnel chart (Sent → Delivered → Opened → Started → Completed → Rated)
- Teacher status table (Teacher ID, School, timestamps, current status)
- Export status report button
- Action buttons (Send reminder, Schedule follow-up, View analytics)

### Implementation
- Stepper component (Material-UI)
- Tabs for recipient selection
- Mock recipient data (100+ teachers in clusters)
- Real-time status with polling

---

## SCREEN 9: ANALYTICS DASHBOARD

### Time Period Selector (Sticky)
- Segmented control: Last 7 Days, Last 30 Days, Last 3 Months, Custom Range
- Export dropdown: PDF Report, Export CSV, Email Report, Schedule Report

### Section 1: Overview Metrics (4 Cards)
- Total Entries (342, +15% trend, text/voice breakdown, sparkline)
- Training Completions (267, 78% circular progress)
- Avg. Teacher Satisfaction (4.3⭐ with star distribution)
- Active Teachers (247/312, 79% engagement)

### Section 2: Engagement Trends
- Full-width line chart: entries, completions, logins, posts
- Time granularity toggle: Daily/Weekly/Monthly
- Download chart button

### Section 3: Two-Column Layout
**Left Column (55%)**:
- Module Performance Leaderboard (table: rank, module name, completion %, rating, total completions, avg time, impact score)
- Color coding: Green (>80%), Yellow (60-80%), Red (<60%)
- Low-Performing Modules (<4.0⭐) sub-section
- Training Impact bar chart (before/after challenge counts)

**Right Column (45%)**:
- Challenge Categories stacked area chart (Math concepts, Classroom management, Student engagement, Assessment, Other)
- Geographic Performance choropleth map (blocks colored by metric: entry volume, completion rate, satisfaction, active %)

### Section 4: Teacher Engagement Funnel
- Horizontal funnel: All Teachers (312) → Entry (247, 79%) → Training (198, 63%) → Community (124, 40%) → Super User (42, 13%)
- Drop-off indicators between stages
- Target Inactive button

### Section 5: Feedback Deep-Dive
- Sentiment distribution donut (Positive 68%, Neutral 24%, Negative 8%)
- Sentiment trend line
- Common Feedback Themes word cloud (interactive, click to filter)
- Verbatim Feedback table (Date, Teacher ID, Module, Rating, Comment, Sentiment)
- Pagination & export CSV button
- Net Promoter Score (72 - Excellent, breakdown: Promoters 65%, Passives 22%, Detractors 13%)

### Section 6: Reports & Exports
- Generate Executive Summary PDF
- Export Raw Data (CSV, select datasets)
- Email Weekly Digest
- Create Custom Dashboard (drag-drop widgets)

### Implementation
- Line charts (Recharts)
- Bar & stacked area charts
- Donut/pie charts
- Choropleth map (simplif iied version)
- Tables with sorting/filtering
- Mock analytics data for 30-90 days

---

## DESIGN SYSTEM

### Color Palette
```
Primary:    #FF7043  (Saffron Orange)     - Actions, buttons, active states
Secondary:  #26A69A  (Teal)               - Success, badges
Accent:     #5C6BC0  (Indigo)             - Links, info
Error:      #E53935  (Red)                - Errors, critical alerts
Warning:    #FFA726  (Amber)              - Warnings
Success:    #66BB6A  (Green)              - Success states
Info:       #29B6F6  (Blue)               - Information

Background: #FAFAFA  (Light Gray)
Surface:    #FFFFFF  (White)
Text:       #333333  (Dark Gray)
```

### Typography
- Font: Noto Sans (multilingual support)
- H1: 28px, Bold
- H2: 22px, Bold
- H3: 18px, Bold
- H4: 16px, Bold
- Body: 16px, Regular
- Small: 14px, Regular
- Caption: 12px, Regular

### Spacing System (Base 8px)
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

### Component Defaults
- Border Radius: 8-12px (modern, soft edges)
- Card Shadow: 0 2px 4px rgba(0,0,0,0.1)
- Button Height: 48px (accessible touch target)
- Input Height: 48px
- Focus Outline: 2px orange

---

## RESPONSIVE DESIGN

### Breakpoints
- Mobile: <640px
- Tablet: 640px - 1024px
- Desktop: >1024px
- Large Desktop: >1440px

### Mobile Adaptations
- Single column layouts
- Collapsible sections (accordions)
- Bottom navigation
- Full-width buttons
- Minimum 48px touch targets
- Swipe gestures

### Tablet Adaptations
- 2-column layouts collapse to 1
- Side panels become bottom sheets
- Horizontal table scroll

### Desktop Optimizations
- Multi-column layouts
- Side-by-side modals
- Keyboard shortcuts (Ctrl+N, Ctrl+F, Esc, Tab)
- Hover states on all interactive elements

---

## ACCESSIBILITY (WCAG AA)

### Color & Contrast
- Text contrast: 4.5:1 minimum (3:1 for large)
- Never rely on color alone (use icons + text)
- Focus indicator: 2px orange outline

### Keyboard Navigation
- Tab order follows visual layout
- Skip links: "Skip to main content"
- Focus trapping in modals
- All functions keyboard-accessible

### Screen Reader Support
- Semantic HTML (header, nav, main, section, article, footer)
- ARIA labels on icons
- ARIA live regions for notifications
- Alt text on all images
- Form labels associated with inputs

### Text & Typography
- Minimum font size: 14px
- Line height: 1.5 for body text
- Text scales to 200% without breaking
- Video captions/subtitles
- Audio transcripts

---

## ANIMATION & MICRO-INTERACTIONS

### Principles
- Purposeful: Every animation serves a function
- Subtle: Max 300ms transitions
- Skippable: Respect `prefers-reduced-motion`

### Common Animations
- Page transitions: Fade in (200ms)
- Modal open: Slide up (250ms)
- Button press: Scale (0.95, 100ms each)
- Loading spinner: Continuous rotation (1s)
- Success checkmark: Draw animation (500ms)
- Toast: Slide in right (300ms ease-out)
- Skeleton pulse: Opacity loop (1.5s)

### Hover States
- Cards: Lift with shadow (150ms)
- Buttons: Darken 10% (150ms)
- Links: Underline appears (100ms)

---

## OFFLINE FUNCTIONALITY

### Service Worker Strategy
- Cache-First: UI shell, static assets, fonts, icons
- Network-First: API calls (3s timeout fallback to cache)
- Background Sync: Queue user actions when offline

### Offline Indicators
- Banner: "You're offline"
- Sync icon: Crossed-out cloud
- Modules: "✓ Available Offline" vs "☁️ Requires Internet"

### Data Sync Behavior
- Auto-sync on WiFi reconnection
- Manual "Sync Now" button
- Conflict resolution: Server wins
- Sync queue visibility

---

## LOCALIZATION (i18n)

### Text Direction
- LTR: English, Hindi (Devanagari)
- RTL: Urdu (future)

### Number & Date Formatting
- Numbers: Indian (1,00,000 not 100,000)
- Dates: DD/MM/YYYY
- Time: 12-hour AM/PM
- Currency: ₹

### Language Switching
- Instant (no reload)
- Persistent (user profile)
- Fallback: English

---

## API INTEGRATION POINTS

### Endpoints (Mock Ready for Real API)

#### Entries
```
GET    /api/entries?filters=...         → Fetch with filters
POST   /api/entries/:id/tag             → Add tags
POST   /api/entries/:id/assign-cluster  → Assign to cluster
```

#### Clusters
```
GET    /api/clusters                    → Get all clusters
GET    /api/clusters/:id/entries        → Entries in cluster
POST   /api/clusters/:id/assign-training → Send training
```

#### Modules
```
GET    /api/modules                     → Module library
POST   /api/modules                     → Create module
PATCH  /api/modules/:id                 → Edit module
POST   /api/modules/:id/dispatch        → Send to teachers
```

#### Analytics
```
GET    /api/analytics/dashboard         → Overview metrics
GET    /api/analytics/engagement        → Trends
GET    /api/analytics/completion        → Funnel
```

#### Dispatch
```
POST   /api/dispatch                    → Send training
GET    /api/dispatch/:id/status         → Track delivery
```

---

## DEVELOPMENT CHECKLIST

### Phase 1: Core Setup ✅
- [x] Project initialization with Vite
- [x] React Router setup
- [x] Material-UI theming
- [x] TypeScript configuration
- [x] Comprehensive types file

### Phase 2: Screens (In Progress)
- [x] Login page
- [x] App layout with navigation
- [x] Dashboard (basic structure)
- [ ] Entries with full table & filters
- [ ] Cluster grid & detail panel
- [ ] Module management & wizard
- [ ] Dispatch wizard (3 steps)
- [ ] Analytics dashboard

### Phase 3: Features
- [ ] Form validation & submission
- [ ] Data fetching & state management
- [ ] Search & filtering logic
- [ ] Modal interactions
- [ ] Chart data processing
- [ ] Export functionality

### Phase 4: Polish
- [ ] Responsive testing
- [ ] Accessibility audit
- [ ] Animation implementation
- [ ] Error handling
- [ ] Loading states
- [ ] Offline support (Service Worker)

### Phase 5: Deployment
- [ ] Production build
- [ ] Environment configuration
- [ ] API integration testing
- [ ] Performance optimization
- [ ] Security review
- [ ] Analytics tracking

---

## QUICK START

### Running the Dashboard

```bash
# Navigate to project
cd d:\Downloads\GuruVaani\web-dashboard

# Install dependencies (if not done)
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:3001

# TypeScript checking
npm run type-check

# Production build
npm run build

# Preview build
npm run preview
```

### Current Status
- ✅ Dashboard loads directly on startup (authentication bypass for demo)
- ✅ Top navigation with tabs (Overview, Entries, Clusters, Modules, Analytics)
- ✅ Material-UI theme applied (Guru Vaani brand colors)
- ✅ 0 TypeScript errors
- ✅ Responsive layout
- ✅ Mock data ready for all screens

### Next Steps
1. Implement Entries list view with filters
2. Build Cluster cards grid
3. Create Module manager
4. Build Dispatch wizard
5. Implement Analytics charts
6. Connect to backend API endpoints

---

## NOTES

- All components use Material-UI for consistency and accessibility
- Mock data is structured to match future API response format
- Types are comprehensive and ready for real data
- Responsive design implemented throughout
- Design system tokens centralized in `theme.ts`
- Ready for API integration (replace mock data with API calls)

