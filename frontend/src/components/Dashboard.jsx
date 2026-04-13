import { useState } from 'react';
import { 
  Search, AlertTriangle, XCircle, AlertCircle, Info, 
  X, Brain, Zap, Clock, Server
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { useLogs } from '../context/LogContext';
import LogDetailPanel from './LogDetail';

const SEVERITY_CONFIG = {
  critical: { label: 'Critical', color: '#ef4444', icon: XCircle },
  error: { label: 'Error', color: '#f97316', icon: AlertCircle },
  warning: { label: 'Warning', color: '#eab308', icon: AlertTriangle },
  info: { label: 'Info', color: '#3b82f6', icon: Info },
  debug: { label: 'Debug', color: '#6b7280', icon: Info }
};

const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#6b7280'];

export default function Dashboard({ activeTab }) {
  const { 
    logs, analytics, loading, selectedLog, setSelectedLog, 
    filters, setFilters 
  } = useLogs();
  const [detailOpen, setDetailOpen] = useState(false);

  const handleLogClick = (log) => {
    setSelectedLog(log);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedLog(null);
  };

  const handleSeverityToggle = (severity) => {
    const current = filters.severity;
    const updated = current.includes(severity)
      ? current.filter(s => s !== severity)
      : [...current, severity];
    setFilters({ ...filters, severity: updated });
  };

  const getPriorityClass = (score) => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const severityData = analytics ? [
    { name: 'Critical', value: analytics.bySeverity.critical, color: '#ef4444' },
    { name: 'Error', value: analytics.bySeverity.error, color: '#f97316' },
    { name: 'Warning', value: analytics.bySeverity.warning, color: '#eab308' },
    { name: 'Info', value: analytics.bySeverity.info, color: '#3b82f6' },
    { name: 'Debug', value: analytics.bySeverity.debug, color: '#6b7280' }
  ] : [];

  const priorityData = analytics ? [
    { name: 'High Priority', value: analytics.byPriority.high },
    { name: 'Medium Priority', value: analytics.byPriority.medium },
    { name: 'Low Priority', value: analytics.byPriority.low }
  ] : [];

  const topServicesData = analytics?.topServices.map(s => ({
    name: s.service.split('-')[0] || s.service,
    count: s.count
  })) || [];

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="main-content">
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title">Search</div>
            <input
              type="text"
              className="search-input"
              placeholder="Search logs..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Severity Filter</div>
            {Object.entries(SEVERITY_CONFIG).map(([key, config]) => (
              <label key={key} className="filter-label">
                <input
                  type="checkbox"
                  className="filter-checkbox"
                  checked={filters.severity.includes(key)}
                  onChange={() => handleSeverityToggle(key)}
                />
                <config.icon size={14} style={{ color: config.color }} />
                <span>{config.label}</span>
                <span className="filter-count">
                  {analytics?.bySeverity[key] || 0}
                </span>
              </label>
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Services</div>
            <select
              className="search-input"
              value={filters.service}
              onChange={(e) => setFilters({ ...filters, service: e.target.value })}
            >
              <option value="">All Services</option>
              {analytics?.topServices.map(s => (
                <option key={s.service} value={s.service}>{s.service}</option>
              ))}
            </select>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">AI Priority Range</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="number"
                className="search-input"
                placeholder="Min"
                style={{ width: '50%' }}
                onChange={(e) => setFilters({ ...filters, minPriority: e.target.value })}
              />
              <input
                type="number"
                className="search-input"
                placeholder="Max"
                style={{ width: '50%' }}
                onChange={(e) => setFilters({ ...filters, maxPriority: e.target.value })}
              />
            </div>
          </div>
        </aside>

        <main className="content-area">
          {activeTab === 'dashboard' && (
            <>
              <div className="dashboard-grid">
                <div className="stat-card">
                  <div className="stat-card-header">
                    <div className="stat-icon critical">
                      <AlertTriangle size={20} />
                    </div>
                  </div>
                  <div className="stat-value">{analytics?.bySeverity.critical || 0}</div>
                  <div className="stat-label">Critical Issues</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-header">
                    <div className="stat-icon error">
                      <XCircle size={20} />
                    </div>
                  </div>
                  <div className="stat-value">{analytics?.bySeverity.error || 0}</div>
                  <div className="stat-label">Errors</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-header">
                    <div className="stat-icon warning">
                      <AlertCircle size={20} />
                    </div>
                  </div>
                  <div className="stat-value">{analytics?.bySeverity.warning || 0}</div>
                  <div className="stat-label">Warnings</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-header">
                    <div className="stat-icon info">
                      <Info size={20} />
                    </div>
                  </div>
                  <div className="stat-value">{analytics?.total || 0}</div>
                  <div className="stat-label">Total Logs</div>
                </div>
              </div>

              <div className="charts-row">
                <div className="chart-card">
                  <div className="chart-header">
                    <div className="chart-title">AI Priority Distribution</div>
                    <Brain size={18} color="#10b981" />
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={priorityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ background: '#1a2332', border: '1px solid #374151' }}
                        labelStyle={{ color: '#f9fafb' }}
                      />
                      <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <div className="chart-header">
                    <div className="chart-title">Severity Distribution</div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={severityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {severityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ background: '#1a2332', border: '1px solid #374151' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card" style={{ marginBottom: 24 }}>
                <div className="chart-header">
                  <div className="chart-title">Top Services by Log Volume</div>
                  <Server size={18} color="#00d4ff" />
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={topServicesData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                    <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} width={100} />
                    <Tooltip 
                      contentStyle={{ background: '#1a2332', border: '1px solid #374151' }}
                    />
                    <Bar dataKey="count" fill="#00d4ff" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          <div className="logs-section">
            <div className="logs-header">
              <div className="logs-title">
                <Zap size={18} color="#10b981" style={{ marginRight: 8, verticalAlign: 'middle' }} />
                AI-Prioritized Logs
              </div>
              <select
                className="sort-select"
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              >
                <option value="priority">AI Priority</option>
                <option value="time">Time (Newest)</option>
                <option value="severity">Severity</option>
              </select>
            </div>

            <div className="log-list">
              {logs.length === 0 ? (
                <div className="empty-state">
                  <Search className="empty-icon" />
                  <div className="empty-title">No logs found</div>
                  <div className="empty-text">Try adjusting your filters</div>
                </div>
              ) : (
                logs.map(log => (
                  <div 
                    key={log.id} 
                    className={`log-entry ${log.severity}`}
                    onClick={() => handleLogClick(log)}
                  >
                    <span className="log-time">
                      <Clock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                      {formatTime(log.timestamp)}
                    </span>
                    <span className={`severity-badge ${log.severity}`}>
                      {log.severity}
                    </span>
                    <span className={`priority-badge ${getPriorityClass(log.aiPriority)}`}>
                      <span className="priority-score">{log.aiPriority}</span>
                      Priority
                    </span>
                    <span className="log-service">{log.service}</span>
                    <span className="log-message">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <LogDetailPanel log={selectedLog} open={detailOpen} onClose={closeDetail} />
    </>
  );
}