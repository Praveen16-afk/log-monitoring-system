const express = require('express');
const router = express.Router();
const { calculateAIPriority, sortByPriority } = require('../utils/priorityAI');

let logs = [];

router.post('/', (req, res) => {
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
    metadata: metadata || {}
  };

  log.aiPriority = calculateAIPriority(log);
  logs.unshift(log);
  
  if (logs.length > 1000) {
    logs = logs.slice(0, 1000);
  }

  res.status(201).json(log);
});

router.get('/', (req, res) => {
  const { severity, service, minPriority, maxPriority, search, sort } = req.query;
  
  let filtered = [...logs];

  if (severity) {
    const severities = severity.split(',');
    filtered = filtered.filter(log => severities.includes(log.severity));
  }

  if (service) {
    const services = service.split(',');
    filtered = filtered.filter(log => services.includes(log.service));
  }

  if (minPriority) {
    filtered = filtered.filter(log => log.aiPriority >= parseInt(minPriority));
  }

  if (maxPriority) {
    filtered = filtered.filter(log => log.aiPriority <= parseInt(maxPriority));
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(log => 
      log.message.toLowerCase().includes(searchLower) ||
      log.service.toLowerCase().includes(searchLower)
    );
  }

  if (sort === 'priority') {
    filtered = sortByPriority(filtered);
  } else if (sort === 'time') {
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else if (sort === 'severity') {
    const severityOrder = { critical: 0, error: 1, warning: 2, info: 3, debug: 4 };
    filtered.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  }

  res.json(filtered);
});

router.get('/:id', (req, res) => {
  const log = logs.find(l => l.id === req.params.id);
  if (!log) {
    return res.status(404).json({ error: 'Log not found' });
  }
  res.json(log);
});

router.delete('/:id', (req, res) => {
  const index = logs.findIndex(l => l.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Log not found' });
  }
  logs.splice(index, 1);
  res.json({ message: 'Log deleted successfully' });
});

module.exports = router;