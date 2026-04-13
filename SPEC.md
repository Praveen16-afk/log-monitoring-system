# AI Log Monitoring System - Specification

## 1. Project Overview

- **Project Name**: CloudLog AI - AI-Powered Log Monitoring System
- **Project Type**: Full-stack Web Application (React + Node.js Express)
- **Core Functionality**: Real-time AI-powered log monitoring system with intelligent priority sorting, visual analytics, and cloud-ready deployment for Vercel
- **Target Users**: DevOps engineers, developers, and system administrators who need intelligent log analysis

## 2. UI/UX Specification

### Layout Structure

**Header**
- Fixed top navigation bar (height: 64px)
- Logo on left: "CloudLog AI" with cloud icon
- Navigation: Dashboard, Logs, Analytics, Settings
- Right side: Theme toggle, notifications bell, user avatar

**Main Content Area**
- Left sidebar (240px): Quick filters, severity filters, date range
- Main content: Dynamic based on selected view
- Right panel (collapsible, 320px): Log details panel

**Responsive Breakpoints**
- Desktop: > 1200px (full layout)
- Tablet: 768px - 1200px (collapsed sidebar)
- Mobile: < 768px (hamburger menu, stacked layout)

### Visual Design

**Color Palette**
- Background Primary: #0a0f1c (deep navy)
- Background Secondary: #111827 (dark slate)
- Background Card: #1a2332 (elevated surface)
- Accent Primary: #00d4ff (cyan glow)
- Accent Secondary: #7c3aed (violet)
- Accent AI: #10b981 (emerald for AI features)
- Severity Critical: #ef4444 (red)
- Severity Error: #f97316 (orange)
- Severity Warning: #eab308 (yellow)
- Severity Info: #3b82f6 (blue)
- Severity Debug: #6b7280 (gray)
- Text Primary: #f9fafb
- Text Secondary: #9ca3af
- Text Muted: #6b7280

**Typography**
- Font Family: "JetBrains Mono" for logs, "Inter" for UI
- Headings: Inter Bold, sizes 32/24/20/16px
- Body: Inter Regular 14px
- Code/Logs: JetBrains Mono 13px
- Line height: 1.6 for readability

**Spacing System**
- Base unit: 4px
- Padding small: 8px
- Padding medium: 16px
- Padding large: 24px
- Border radius: 8px (cards), 6px (buttons), 4px (inputs)

**Visual Effects**
- Card shadows: 0 4px 20px rgba(0, 212, 255, 0.08)
- Glow effects on critical items: 0 0 20px rgba(239, 68, 68, 0.3)
- Glassmorphism on modals: backdrop-filter: blur(12px)
- Smooth transitions: 200ms ease-out

### Components

**Log Entry Card**
- Timestamp (left)
- Severity badge (color-coded)
- AI Priority Score badge (animated)
- Source/Service name
- Message preview (truncated)
- Hover: expand to show full message
- Click: open detail panel

**AI Priority Indicator**
- Circular badge with score 0-100
- Color gradient: green (low) -> yellow (medium) -> red (high)
- Animated pulse for high priority items

**Dashboard Widgets**
- Log Volume Chart (area chart)
- Severity Distribution (donut chart)
- AI Priority Heatmap
- Top Services (horizontal bar)
- Recent Alerts (list with timestamps)

**Filter Sidebar**
- Severity checkboxes with counts
- Date range picker
- Service/Source multi-select
- AI Priority slider (min-max)
- Search with regex support

## 3. Functionality Specification

### Core Features

**1. Log Ingestion**
- REST API endpoint for log submission
- Support JSON log format
- Auto-extract: timestamp, severity, source, message, metadata
- Store in memory (demo) with option for database

**2. AI Priority Scoring**
- Algorithm considers:
  - Severity level (40% weight)
  - Keyword detection (30% weight)
  - Frequency/recurrence (20% weight)
  - Time of occurrence (10% weight)
- Score range: 0-100
- Higher score = higher priority

**3. Intelligent Sorting**
- Default: AI Priority descending
- Options: Time-based, Severity-based, Source-based
- Real-time re-sorting on new logs

**4. Analytics Dashboard**
- Log volume over time (last 24h, 7d, 30d)
- Severity breakdown pie chart
- Priority distribution histogram
- Top error sources
- Alert frequency trends

**5. Search & Filter**
- Full-text search across logs
- Filter by severity (multi-select)
- Filter by time range
- Filter by source/service
- Filter by AI priority range

**6. Real-time Updates**
- Polling every 5 seconds (simulated real-time)
- Visual notification for new high-priority logs

### User Interactions

- Click log entry → show full details in side panel
- Hover severity badge → show severity description
- Click chart segment → filter logs by that category
- Drag date range → update all widgets
- Toggle theme → switch dark/light mode

### Data Handling

- Frontend: React state management with Context API
- Backend: Express with in-memory storage (demo)
- API: RESTful endpoints
- Sample data: Generate realistic demo logs on startup

### Edge Cases

- Empty log list: Show "No logs found" with illustration
- API error: Show error toast with retry button
- Large log volume: Virtual scrolling for performance
- Invalid log format: Return 400 with error message

## 4. Technical Architecture

### Backend (Node.js/Express)
```
/backend
  /src
    index.js (main server)
    /routes
      logs.js (log endpoints)
      analytics.js (stats endpoints)
    /utils
      priorityAI.js (AI scoring algorithm)
      sampleData.js (demo data generator)
  package.json
  vercel.json (Vercel config)
```

### Frontend (React/Vite)
```
/frontend
  /src
    main.jsx
    App.jsx
    /components
      Header.jsx
      Sidebar.jsx
      LogList.jsx
      LogEntry.jsx
      LogDetail.jsx
      Charts.jsx
      Dashboard.jsx
    /hooks
      useLogs.js
    /context
      LogContext.jsx
    /styles
      index.css
  package.json
  vite.config.js
```

### Vercel Deployment

**Backend**: Vercel Serverless Functions or Node.js server
**Frontend**: Vercel static hosting
**Configuration**: vercel.json for both projects

## 5. Acceptance Criteria

1. ✅ Frontend loads without errors
2. ✅ Backend API returns logs successfully
3. ✅ AI Priority sorting works correctly (highest first)
4. ✅ All charts render with sample data
5. ✅ Responsive design works on mobile
6. ✅ Vercel deployment configuration is correct
7. ✅ Visual design matches dark theme specification
8. ✅ Filter functionality works
9. ✅ Log detail panel displays correctly
10. ✅ Project showcases cloud computing skills for resume