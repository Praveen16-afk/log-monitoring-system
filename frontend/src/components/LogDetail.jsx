import { X, Clock, Server, AlertTriangle, Brain, Hash } from 'lucide-react';

export default function LogDetailPanel({ log, open, onClose }) {
  if (!log) return null;

  const getPriorityClass = (score) => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const getAIMessage = (score, severity) => {
    if (score >= 90) return 'This log requires immediate attention due to critical severity and detected error patterns.';
    if (score >= 70) return 'High priority - suggests potential service degradation or security concern.';
    if (score >= 40) return 'Medium priority - monitor for recurring patterns that may indicate issues.';
    return 'Low priority - informational log, no immediate action required.';
  };

  return (
    <div className={`log-detail-panel ${open ? 'open' : ''}`}>
      <div className="detail-header">
        <div className="detail-title">Log Details</div>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="detail-section">
        <div className="detail-label">
          <Hash size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          Log ID
        </div>
        <div className="detail-value">{log.id}</div>
      </div>

      <div className="detail-section">
        <div className="detail-label">
          <Clock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          Timestamp
        </div>
        <div className="detail-value">
          {new Date(log.timestamp).toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-label">
          <AlertTriangle size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          Severity
        </div>
        <div className="detail-value">
          <span className={`severity-badge ${log.severity}`} style={{ display: 'inline-block' }}>
            {log.severity}
          </span>
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-label">
          <Server size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          Service
        </div>
        <div className="detail-value">{log.service}</div>
      </div>

      <div className="detail-section">
        <div className="detail-label">Message</div>
        <div className="detail-value" style={{ 
          background: 'var(--bg-card)', 
          padding: 12, 
          borderRadius: 6,
          fontSize: 12,
          lineHeight: 1.6
        }}>
          {log.message}
        </div>
      </div>

      {log.metadata && (
        <div className="detail-section">
          <div className="detail-label">Metadata</div>
          <div style={{ 
            background: 'var(--bg-card)', 
            padding: 12, 
            borderRadius: 6,
            fontSize: 12
          }}>
            {Object.entries(log.metadata).map(([key, value]) => (
              <div key={key} style={{ marginBottom: 6 }}>
                <span style={{ color: 'var(--accent-primary)' }}>{key}:</span>{' '}
                <span style={{ color: 'var(--text-secondary)' }}>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="detail-section">
        <div className="detail-label">
          <Brain size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          AI Priority Score
        </div>
        <div className="detail-value">
          <span className={`priority-badge ${getPriorityClass(log.aiPriority)}`} style={{ display: 'inline-flex' }}>
            <span className="priority-score">{log.aiPriority}</span>
            {log.aiPriority >= 70 ? 'High' : log.aiPriority >= 40 ? 'Medium' : 'Low'}
          </span>
        </div>
      </div>

      <div className="ai-insight">
        <div className="ai-insight-title">
          <Brain size={16} />
          AI Insight
        </div>
        <div className="ai-insight-text">
          {getAIMessage(log.aiPriority, log.severity)}
        </div>
      </div>
    </div>
  );
}