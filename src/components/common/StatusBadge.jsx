// =====================================================
// STATUS BADGE
// Shows online/offline status indicator
// =====================================================

import './StatusBadge.css';

export default function StatusBadge({ status = 'offline' }) {
  const isOnline = status === 'online';

  return (
    <span className={`status-badge ${isOnline ? 'online' : 'offline'}`}>
      <span className="status-dot"></span>
      {isOnline ? 'Online' : 'Offline'}
    </span>
  );
}
