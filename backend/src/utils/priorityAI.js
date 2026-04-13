const severityWeights = {
  critical: 100,
  error: 75,
  warning: 50,
  info: 25,
  debug: 10
};

const criticalKeywords = [
  'fatal', 'crash', 'out of memory', 'database connection failed',
  'authentication failed', 'unauthorized access', 'data breach',
  'service unavailable', 'timeout', 'heap overflow'
];

const warningKeywords = [
  'slow', 'degraded', 'retry', 'timeout', 'warning',
  'throttled', 'rate limit', 'memory high', 'cpu high'
];

function calculateAIPriority(log) {
  let score = 0;

  score += (severityWeights[log.severity] || 25) * 0.4;

  const messageLower = (log.message || '').toLowerCase();
  for (const keyword of criticalKeywords) {
    if (messageLower.includes(keyword)) {
      score += 30;
      break;
    }
  }

  for (const keyword of warningKeywords) {
    if (messageLower.includes(keyword)) {
      score += 15;
      break;
    }
  }

  const logHour = new Date(log.timestamp).getHours();
  if (logHour >= 9 && logHour <= 17) {
    score += 10;
  }

  if (log.metadata?.recurring) {
    score += 20;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

function sortByPriority(logs) {
  return [...logs].sort((a, b) => b.aiPriority - a.aiPriority);
}

module.exports = { calculateAIPriority, sortByPriority, severityWeights, criticalKeywords };