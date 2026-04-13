import { createContext, useContext, useState, useEffect } from 'react';

const LogContext = createContext();

export function LogProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [filters, setFilters] = useState({
    severity: [],
    service: '',
    search: '',
    sort: 'priority'
  });

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.severity.length) params.append('severity', filters.severity.join(','));
      if (filters.service) params.append('service', filters.service);
      if (filters.search) params.append('search', filters.search);
      params.append('sort', filters.sort);

      const response = await fetch(`${API_URL}/logs?${params}`);
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_URL}/analytics/summary`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchLogs(), fetchAnalytics()]);
      setLoading(false);
    };
    loadData();
  }, [filters]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLogs();
      fetchAnalytics();
    }, 5000);
    return () => clearInterval(interval);
  }, [filters]);

  const value = {
    logs,
    analytics,
    loading,
    selectedLog,
    setSelectedLog,
    filters,
    setFilters,
    fetchLogs,
    fetchAnalytics
  };

  return (
    <LogContext.Provider value={value}>
      {children}
    </LogContext.Provider>
  );
}

export function useLogs() {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLogs must be used within LogProvider');
  }
  return context;
}