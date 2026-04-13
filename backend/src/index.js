const { MongoClient } = require('mongodb');
const cors = require('cors');
const express = require('express');
const { calculateAIPriority, sortByPriority } = require('./utils/priorityAI');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let db;
let logsCollection;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'cloudlog_ai';

async function connectToMongoDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    logsCollection = db.collection('logs');
    console.log('Connected to MongoDB');
    
    const count = await logsCollection.countDocuments();
    if (count === 0) {
      await seedSampleData();
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Running in demo mode without MongoDB');
  }
}

async function seedSampleData() {
  const { generateSampleLogs } = require('./utils/sampleData');
  const sampleLogs = generateSampleLogs(150);
  
  for (const log of sampleLogs) {
    log.aiPriority = calculateAIPriority(log);
    log.createdAt = new Date(log.timestamp);
  }
  
  await logsCollection.insertMany(sampleLogs);
  console.log(`Seeded ${sampleLogs.length} sample logs to MongoDB`);
}

app.post('/api/logs', async (req, res) => {
  const { timestamp, severity, service, message, metadata } = req.body;
  
  if (!timestamp || !severity || !message) {
    return res.status(400).json({ error: 'Missing required fields: timestamp, severity, message' });
  }

  const log = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp,
    severity,
    service: service || 'unknown',
    message,
    metadata: metadata || {},
    aiPriority: 0,
    createdAt: new Date()
  };

  log.aiPriority = calculateAIPriority(log);

  if (logsCollection) {
    await logsCollection.insertOne(log);
  }

  res.status(201).json(log);
});

app.get('/api/logs', async (req, res) => {
  const { severity, service, minPriority, maxPriority, search, sort } = req.query;
  
  let query = {};

  if (severity) {
    const severities = severity.split(',');
    query.severity = { $in: severities };
  }

  if (service) {
    const services = service.split(',');
    query.service = { $in: services };
  }

  if (minPriority) {
    query.aiPriority = { ...query.aiPriority, $gte: parseInt(minPriority) };
  }

  if (maxPriority) {
    query.aiPriority = { ...query.aiPriority, $lte: parseInt(maxPriority) };
  }

  if (search) {
    query.$or = [
      { message: { $regex: search, $options: 'i' } },
      { service: { $regex: search, $options: 'i' } }
    ];
  }

  let logs;
  if (logsCollection) {
    logs = await logsCollection.find(query).toArray();
  } else {
    return res.json([]);
  }

  if (sort === 'priority') {
    logs = sortByPriority(logs);
  } else if (sort === 'time') {
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else if (sort === 'severity') {
    const severityOrder = { critical: 0, error: 1, warning: 2, info: 3, debug: 4 };
    logs.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  }

  res.json(logs);
});

app.get('/api/logs/:id', async (req, res) => {
  let log;
  if (logsCollection) {
    log = await logsCollection.findOne({ id: req.params.id });
  }
  if (!log) {
    return res.status(404).json({ error: 'Log not found' });
  }
  res.json(log);
});

app.delete('/api/logs/:id', async (req, res) => {
  if (logsCollection) {
    await logsCollection.deleteOne({ id: req.params.id });
  }
  res.json({ message: 'Log deleted successfully' });
});

app.get('/api/analytics/summary', async (req, res) => {
  let logs = [];
  if (logsCollection) {
    logs = await logsCollection.find().toArray();
  }
  
  const total = logs.length;
  
  const bySeverity = {
    critical: logs.filter(l => l.severity === 'critical').length,
    error: logs.filter(l => l.severity === 'error').length,
    warning: logs.filter(l => l.severity === 'warning').length,
    info: logs.filter(l => l.severity === 'info').length,
    debug: logs.filter(l => l.severity === 'debug').length
  };

  const byPriority = {
    high: logs.filter(l => l.aiPriority >= 70).length,
    medium: logs.filter(l => l.aiPriority >= 40 && l.aiPriority < 70).length,
    low: logs.filter(l => l.aiPriority < 40).length
  };

  const byService = {};
  logs.forEach(log => {
    byService[log.service] = (byService[log.service] || 0) + 1;
  });

  const topServices = Object.entries(byService)
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const highPriorityLogs = logs.filter(l => l.aiPriority >= 70).slice(0, 10);

  res.json({
    total,
    bySeverity,
    byPriority,
    byService,
    topServices,
    highPriorityLogs
  });
});

app.get('/api/analytics/timeline', async (req, res) => {
  const { period = '24h' } = req.query;
  let logs = [];
  if (logsCollection) {
    logs = await logsCollection.find().toArray();
  }

  let interval;
  switch(period) {
    case '24h':
      interval = 3600000;
      break;
    case '7d':
      interval = 86400000;
      break;
    case '30d':
      interval = 86400000;
      break;
    default:
      interval = 3600000;
  }

  const timeline = {};
  logs.forEach(log => {
    const logTime = new Date(log.timestamp).getTime();
    const bucket = Math.floor(logTime / interval) * interval;
    const key = new Date(bucket).toISOString();
    timeline[key] = (timeline[key] || 0) + 1;
  });

  const result = Object.entries(timeline)
    .map(([time, count]) => ({ time, count }))
    .sort((a, b) => new Date(a.time) - new Date(b.time));

  res.json(result);
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: logsCollection ? 'connected' : 'disconnected'
  });
});

connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`CloudLog AI Backend running on port ${PORT}`);
  });
});

module.exports = app;