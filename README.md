# CloudLog AI - AI-Powered Log Monitoring System

A full-stack AI-powered log monitoring system built with React, Node.js/Express, and MongoDB. Features intelligent AI priority sorting that brings the most critical issues to the top.

![CloudLog AI Dashboard](https://via.placeholder.com/800x400?text=CloudLog+AI+Dashboard)

## Features

- **AI Priority Scoring**: Intelligent algorithm that analyzes severity, keywords, and patterns to calculate priority scores (0-100)
- **Real-time Updates**: Auto-refresh every 5 seconds for live monitoring
- **Advanced Filtering**: Filter by severity, service, search text, and priority range
- **Analytics Dashboard**: Visual charts showing severity distribution, priority breakdown, and top services
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Cloud Ready**: Deployment-ready for Vercel
- **Interactive UI**: Settings panel, notifications dropdown, user menu

## Tech Stack

### Frontend
- React 18 with Vite
- Recharts for data visualization
- Lucide React icons
- Context API for state management

### Backend
- Node.js with Express
- MongoDB for database (falls back to demo mode if unavailable)
- AI Priority Algorithm with weighted scoring

### Deployment
- Frontend: Vercel static hosting
- Backend: Vercel serverless functions

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas) or use demo mode

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd log-monitoring-ai
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

### Running Locally

1. Start MongoDB (optional - works without)
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas and set MONGODB_URI in backend/.env
```

2. Start backend
```bash
cd backend
npm start
```
Backend runs on http://localhost:3001

3. Start frontend
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/logs` | Get all logs (supports query params) |
| POST | `/api/logs` | Create new log |
| GET | `/api/logs/:id` | Get single log |
| DELETE | `/api/logs/:id` | Delete log |
| GET | `/api/analytics/summary` | Get analytics summary |
| GET | `/api/analytics/timeline` | Get timeline data |

### Query Parameters for `/api/logs`

| Parameter | Values | Description |
|-----------|--------|-------------|
| severity | comma-separated | Filter by severity (critical,error,warning,info,debug) |
| service | string | Filter by service name |
| minPriority | number | Minimum AI priority (0-100) |
| maxPriority | number | Maximum AI priority (0-100) |
| search | string | Search in message and service |
| sort | priority, time, severity | Sort order |

## AI Priority Algorithm

The AI calculates priority scores (0-100) based on:

- **Severity (40%)**: Critical=100, Error=75, Warning=50, Info=25, Debug=10
- **Keywords (30%)**: Detects critical terms like "fatal", "crash", "timeout"
- **Recurrence (20%)**: Flags recurring issues
- **Time of Day (10%)**: Business hours get higher priority

Higher scores = More urgent issues

---

# Deploy to Vercel

## Option 1: Deploy as Two Separate Projects (Recommended)

### Step 1: Deploy Backend
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select the `backend` folder
5. Configure:
   - Framework Preset: **Other**
   - Build Command: `npm run build` (or leave empty)
   - Output Directory: `src` (or leave empty)
6. Add Environment Variables:
   - `MONGODB_URI` = your MongoDB Atlas connection string
     ```
     mongodb+srv://<username>:<password>@cluster.mongodb.net/cloudlog_ai?retryWrites=true&w=majority
     ```
   - `PORT` = 3001
7. Click "Deploy"

Your backend will be available at: `https://your-project.vercel.app`

### Step 2: Deploy Frontend
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select the `frontend` folder
5. Configure:
   - Framework Preset: **Vite**
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
6. Add Environment Variables:
   - `VITE_API_URL` = your backend URL (from Step 1)
     ```
     https://your-backend-project.vercel.app/api
     ```
7. Click "Deploy"

Your frontend will be available at: `https://your-project.vercel.app`

## Option 2: Deploy Using GitHub Integration

### Connect Both Projects
1. Import your repository to Vercel
2. Vercel will auto-detect both `/backend` and `/frontend`
3. Each folder will be deployed as a separate project

### Environment Variables
Set these in each project's settings:

**Backend Project:**
- `MONGODB_URI` - MongoDB Atlas connection string

**Frontend Project:**
- `VITE_API_URL` - URL of your backend project

## Get MongoDB Atlas Free Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a free cluster:
   - Choose "Free" tier (M0)
   - Select a region near you
   - Create cluster
4. Create database user:
   - Go to "Database Access"
   - Add new user (记住用户名和密码)
5. Network access:
   - Go to "Network Access"
   - Add IP Address: `0.0.0.0/0` (allows all IPs)
6. Get connection string:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

Example connection string:
```
mongodb+srv://myuser:mypassword@cluster0.mongodb.net/cloudlog_ai?retryWrites=true&w=majority
```

## Verifying Deployment

After deployment:

1. **Test Backend Health**
   ```
   https://your-backend.vercel.app/api/health
   ```
   Expected response:
   ```json
   {"status":"ok","timestamp":"2026-04-13T...","mongodb":"connected"}
   ```

2. **Test Logs API**
   ```
   https://your-backend.vercel.app/api/logs
   ```
   Expected: Array of log objects

3. **Test Frontend**
   - Open your frontend URL
   - You should see the dashboard with charts and logs

## Troubleshooting

### CORS Errors
If frontend can't connect to backend:
1. Check that backend has CORS enabled (included in src/index.js)
2. Verify `VITE_API_URL` is set correctly in frontend

### MongoDB Connection Failed
- Verify `MONGODB_URI` is correct
- Check IP whitelist includes 0.0.0.0/0
- Ensure database user has proper permissions

### Empty Logs
- Backend runs in demo mode without MongoDB
- All data will be lost on restart
- Connect MongoDB for persistent storage

---

## Project Structure

```
log-monitoring-ai/
├── backend/
│   ├── src/
│   │   ├── index.js        # Main server (all routes inline)
│   │   └── utils/       # AI and data utilities
│   ├── package.json
│   ├── vercel.json       # Vercel config
│   └── .env.example    # Environment template
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── context/    # State management
│   │   └── styles/     # CSS styles
│   ├── package.json
│   ├── vercel.json    # Vercel config
│   └── .env         # Dev environment
├── SPEC.md           # Detailed specification
└── README.md        # This file
```

## Screenshots

The dashboard includes:
- Stat cards showing critical issues, errors, warnings, and total logs
- AI Priority distribution chart
- Severity distribution pie chart
- Top services bar chart
- AI-Prioritized log list with click-to-view details
- Settings panel with dark mode toggle
- Notifications dropdown
- User menu

## License

MIT License - Feel free to use for your resume or projects!

## Author

Built with for cloud computing and DevOps showcase
Perfect for adding to your resume as a full-stack project