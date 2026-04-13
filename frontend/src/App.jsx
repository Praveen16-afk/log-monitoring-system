import { useState } from 'react';
import { Cloud, Bell, User, Activity, FileText, BarChart3, Settings, X, Moon, Sun, RefreshCw, ExternalLink, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { LogProvider } from './context/LogContext';
import Dashboard from './components/Dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);

  const notifications = [
    { id: 1, type: 'critical', message: 'Database connection failed', time: '2 min ago' },
    { id: 2, type: 'warning', message: 'High memory usage detected', time: '5 min ago' },
    { id: 3, type: 'info', message: 'Scheduled backup completed', time: '15 min ago' }
  ];

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'critical': return <AlertTriangle size={16} className="text-critical" />;
      case 'warning': return <AlertTriangle size={16} className="text-warning" />;
      case 'info': return <Info size={16} className="text-info" />;
      default: return <CheckCircle size={16} />;
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'light' : 'dark');
  };

  return (
    <LogProvider>
      <div className="app">
        <header className="header">
          <div className="logo">
            <div className="logo-icon">
              <Cloud size={20} />
            </div>
            <span>CloudLog AI</span>
          </div>
          
          <nav className="nav">
            <button 
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <Activity size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Dashboard
            </button>
            <button 
              className={`nav-btn ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              <FileText size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Logs
            </button>
            <button 
              className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Analytics
            </button>
          </nav>

          <div className="header-right">
            <div className="icon-wrapper">
              <button 
                className="icon-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowSettings(false);
                  setShowUserMenu(false);
                }}
              >
                <Bell size={20} />
                <span className="notification-badge"></span>
              </button>
              {showNotifications && (
                <div className="dropdown-panel notifications-panel">
                  <div className="dropdown-header">
                    <span>Notifications</span>
                    <button className="icon-btn-small" onClick={() => setShowNotifications(false)}>
                      <X size={14} />
                    </button>
                  </div>
                  <div className="notifications-list">
                    {notifications.map(notif => (
                      <div key={notif.id} className="notification-item">
                        {getNotificationIcon(notif.type)}
                        <div className="notification-content">
                          <div className="notification-message">{notif.message}</div>
                          <div className="notification-time">{notif.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="view-all-btn">View All Alerts</button>
                </div>
              )}
            </div>

            <div className="icon-wrapper">
              <button 
                className="icon-btn"
                onClick={() => {
                  setShowSettings(!showSettings);
                  setShowNotifications(false);
                  setShowUserMenu(false);
                }}
              >
                <Settings size={20} />
              </button>
              {showSettings && (
                <div className="dropdown-panel settings-panel">
                  <div className="dropdown-header">
                    <span>Settings</span>
                    <button className="icon-btn-small" onClick={() => setShowSettings(false)}>
                      <X size={14} />
                    </button>
                  </div>
                  <div className="settings-list">
                    <div className="setting-item">
                      <div className="setting-label">
                        <Moon size={16} />
                        <span>Dark Mode</span>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={darkMode} 
                          onChange={toggleDarkMode}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <div className="setting-label">
                        <RefreshCw size={16} />
                        <span>Auto Refresh</span>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={autoRefresh} 
                          onChange={() => setAutoRefresh(!autoRefresh)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <div className="setting-label">
                        <span>Refresh Interval</span>
                      </div>
                      <select 
                        className="setting-select"
                        value={refreshInterval}
                        onChange={(e) => setRefreshInterval(e.target.value)}
                      >
                        <option value={3}>3 seconds</option>
                        <option value={5}>5 seconds</option>
                        <option value={10}>10 seconds</option>
                        <option value={30}>30 seconds</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="icon-wrapper">
              <button 
                className="user-avatar-btn"
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                  setShowSettings(false);
                }}
              >
                <User size={18} />
              </button>
              {showUserMenu && (
                <div className="dropdown-panel user-panel">
                  <div className="user-info">
                    <div className="user-avatar-large">
                      <User size={24} />
                    </div>
                    <div className="user-details">
                      <div className="user-name">DevOps Admin</div>
                      <div className="user-email">admin@cloudlog.ai</div>
                    </div>
                  </div>
                  <div className="user-menu">
                    <button className="user-menu-item">Profile Settings</button>
                    <button className="user-menu-item">API Keys</button>
                    <button className="user-menu-item">Documentation</button>
                    <button className="user-menu-item logout">Sign Out</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <Dashboard activeTab={activeTab} />
      </div>

      <style>{`
        .icon-wrapper {
          position: relative;
        }
        
        .dropdown-panel {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .notifications-panel {
          width: 320px;
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color);
          font-weight: 600;
          font-size: 14px;
        }

        .notifications-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: background 0.2s;
        }

        .notification-item:hover {
          background: var(--bg-elevated);
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-content {
          flex: 1;
        }

        .notification-message {
          font-size: 13px;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .notification-time {
          font-size: 11px;
          color: var(--text-muted);
        }

        .text-critical { color: var(--severity-critical); }
        .text-warning { color: var(--severity-warning); }
        .text-info { color: var(--severity-info); }

        .view-all-btn {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: none;
          border-top: 1px solid var(--border-color);
          color: var(--accent-primary);
          font-size: 13px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .view-all-btn:hover {
          background: var(--bg-elevated);
        }

        .settings-panel {
          width: 260px;
        }

        .settings-list {
          padding: 8px;
        }

        .setting-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          border-radius: 6px;
        }

        .setting-item:hover {
          background: var(--bg-elevated);
        }

        .setting-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .toggle-switch {
          position: relative;
          width: 44px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--bg-secondary);
          border-radius: 24px;
          transition: 0.3s;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background: var(--text-muted);
          border-radius: 50%;
          transition: 0.3s;
        }

        .toggle-switch input:checked + .toggle-slider {
          background: var(--accent-primary);
        }

        .toggle-switch input:checked + .toggle-slider:before {
          transform: translateX(20px);
          background: white;
        }

        .setting-select {
          padding: 6px 10px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          color: var(--text-primary);
          font-size: 12px;
        }

        .user-avatar-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          color: white;
          transition: transform 0.2s;
        }

        .user-avatar-btn:hover {
          transform: scale(1.05);
        }

        .user-panel {
          width: 240px;
          right: 0;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .user-avatar-large {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .user-name {
          font-weight: 600;
          font-size: 14px;
          color: var(--text-primary);
        }

        .user-email {
          font-size: 12px;
          color: var(--text-muted);
        }

        .user-menu {
          padding: 8px;
        }

        .user-menu-item {
          width: 100%;
          padding: 10px 12px;
          background: transparent;
          border: none;
          border-radius: 6px;
          text-align: left;
          font-size: 13px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: background 0.2s;
        }

        .user-menu-item:hover {
          background: var(--bg-elevated);
        }

        .user-menu-item.logout {
          color: var(--severity-critical);
        }

        .icon-btn-small {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
        }
      `}</style>
    </LogProvider>
  );
}