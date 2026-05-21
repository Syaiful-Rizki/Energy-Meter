// =====================================================
// APP CONSTANTS
// =====================================================

// Firebase Realtime Database paths (matches kode.c++)
export const DB_PATHS = {
  ENERGY_METER: '/energy_meter',
  ENERGY_HISTORY: '/energy_history',
};

// Sensor field names
export const SENSOR_FIELDS = {
  VOLTAGE: 'voltage',
  CURRENT: 'current',
  POWER: 'power',
  ENERGY: 'energy',
  STATUS: 'status',
};

// Navigation items
export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'MdDashboard' },
  { path: '/monitoring', label: 'Monitoring', icon: 'MdMonitor' },
  { path: '/controlling', label: 'Controlling', icon: 'MdTune' },
  { path: '/data', label: 'Data', icon: 'MdStorage' },
  { path: '/log', label: 'Log Akses', icon: 'MdHistory' },
];

// Chart colors
export const CHART_COLORS = {
  voltage: '#3b82f6',
  current: '#f59e0b',
  power: '#ef4444',
  energy: '#22c55e',
};

// Metric card gradients
export const CARD_GRADIENTS = {
  voltage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  current: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  power: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  energy: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
};
