const services = ['auth-service', 'api-gateway', 'payment-service', 'user-service', 'notification-service', 'database', 'cache-server', 'load-balancer'];
const severities = ['critical', 'error', 'warning', 'info', 'debug'];

const messages = {
  critical: [
    'Database connection failed - Unable to establish connection to PostgreSQL',
    'Fatal error: Out of memory exception in worker process',
    'Service unavailable: Payment gateway timeout after 30s',
    'Security alert: Unauthorized access attempt detected from IP 192.168.1.100',
    'Critical: Disk space exhausted on primary storage volume'
  ],
  error: [
    'Error processing request: Invalid JSON payload received',
    'Failed to authenticate user: JWT token expired',
    'API request failed with status code 500 Internal Server Error',
    'Database query timeout after 30 seconds',
    'Failed to connect to Redis cache: Connection refused'
  ],
  warning: [
    'High memory usage detected: 85% of allocated heap used',
    'API response time degraded: Average latency > 500ms',
    'Rate limit approaching: 90% of quota consumed',
    'Retry attempt 2/3: External service responding slowly',
    'Certificate expiring in 7 days - renew immediately'
  ],
  info: [
    'User logged in successfully from IP 45.67.89.123',
    'Scheduled job completed: Daily backup finished',
    'New user registration: account created for user@example.com',
    'API endpoint called: GET /api/v1/users',
    'Configuration reload: Settings updated successfully'
  ],
  debug: [
    'Processing request ID: req_abc123def456',
    'Cache hit for key: user_session_xyz789',
    'Database query executed: SELECT * FROM users WHERE id = ?',
    'HTTP request headers: Content-Type: application/json',
    'Function execution time: 45ms'
  ]
};

function generateRandomLog(id) {
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const service = services[Math.floor(Math.random() * services.length)];
  const messageList = messages[severity];
  const message = messageList[Math.floor(Math.random() * messageList.length)];
  
  const now = Date.now();
  const randomOffset = Math.floor(Math.random() * 86400000);
  const timestamp = new Date(now - randomOffset).toISOString();

  return {
    id: `log_${id}_${Date.now()}`,
    timestamp,
    severity,
    service,
    message,
    metadata: {
      host: `server-${Math.floor(Math.random() * 10) + 1}`,
      environment: 'production',
      version: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
      recurring: Math.random() > 0.7
    }
  };
}

function generateSampleLogs(count = 100) {
  const logs = [];
  for (let i = 0; i < count; i++) {
    logs.push(generateRandomLog(i));
  }
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

module.exports = { generateSampleLogs, services, severities };