const express = require('express');
const router = express.Router();

let logs = [];

router.setLogs = (logData) => {
  logs = logData;
};

router.get('/summary', (req, res) => {
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

router.get('/timeline', (req, res) => {
  const { period = '24h' } = req.query;
  const now = Date.now();
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

module.exports = router;