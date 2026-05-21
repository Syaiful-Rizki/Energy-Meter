// =====================================================
// LOG ACTIVITY PAGE
// Displays device connection & activity log
// =====================================================

import { useState, useEffect } from 'react';
import { ref, onValue, query, limitToLast, remove } from 'firebase/database';
import { db } from '../config/firebase';
import TopBar from '../components/layout/TopBar';
import useRealtimeData from '../hooks/useRealtimeData';
import { formatTimestamp } from '../utils/formatters';
import {
  MdHistory,
  MdWifi,
  MdWifiOff,
  MdSensors,
  MdLogin,
  MdInfo,
} from 'react-icons/md';
import './LogActivity.css';


export default function LogActivity() {
  const { data, lastUpdated } = useRealtimeData();
  const [logs, setLogs] = useState([]);

  // Generate activity logs based on real-time data changes
  useEffect(() => {
    // Listen to energy_history to generate "data sent" logs
    const historyRef = query(ref(db, '/energy_history'), limitToLast(20));

    const unsubscribe = onValue(historyRef, (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.val();
        const entries = Object.entries(raw)
          .map(([key, val]) => ({
            id: key,
            type: 'data',
            message: `Data sensor terkirim — V:${val.voltage}V, I:${val.current}A, P:${val.power}W`,
            timestamp: val.timestamp,
            icon: 'sensor',
          }))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setLogs(entries);
      }
    });

    return () => unsubscribe();
  }, []);

  const getLogIcon = (type) => {
    switch (type) {
      case 'online':
        return <MdWifi size={18} className="log-icon online" />;
      case 'offline':
        return <MdWifiOff size={18} className="log-icon offline" />;
      case 'sensor':
      case 'data':
        return <MdSensors size={18} className="log-icon data" />;
      case 'login':
        return <MdLogin size={18} className="log-icon login" />;
      default:
        return <MdInfo size={18} className="log-icon info" />;
    }
  };

  const clearLog = async () => {
  const confirmClear = window.confirm(
    'Apakah yakin ingin menghapus semua log aktivitas?'
  );

  if (!confirmClear) return;

  try {
    await remove(ref(db, '/energy_history'));

    alert('Log berhasil dihapus');
  } catch (error) {
    console.error(error);
    alert('Gagal menghapus log');
  }
};

  // Add a current status entry at top
  const allLogs = [
    {
      id: 'current-status',
      type: data.status === 'online' ? 'online' : 'offline',
      message: data.status === 'online'
        ? 'ESP32 terhubung dan mengirim data'
        : 'ESP32 tidak terhubung',
      timestamp: lastUpdated,
      icon: data.status === 'online' ? 'online' : 'offline',
    },
    ...logs,
  ];

  return (
    <div className="log-page">
      <TopBar title="Log Akses" icon={MdHistory} />

      <div className="log-content">
        {/* Summary */}
        <div className="log-summary">
          <div className="log-summary-item">
            <div className="log-summary-icon online">
              <MdWifi size={22} />
            </div>
            <div>
              <div className="log-summary-label">Status</div>
              <div className="log-summary-value">
                {data.status === 'online' ? 'Terhubung' : 'Terputus'}
              </div>
            </div>
          </div>
          <div className="log-summary-item">
            <div className="log-summary-icon data">
              <MdSensors size={22} />
            </div>
            <div>
              <div className="log-summary-label">Total Log</div>
              <div className="log-summary-value">{logs.length}</div>
            </div>
          </div>
          <div className="log-summary-item">
            <div className="log-summary-icon info">
              <MdHistory size={22} />
            </div>
            <div>
              <div className="log-summary-label">Update Terakhir</div>
              <div className="log-summary-value">{formatTimestamp(lastUpdated)}</div>
            </div>
          </div>
        </div>

        {/* Log List */}
        <div className="log-list-card">
         <div className="log-header">
          <h3 className="log-list-title">Riwayat Aktivitas</h3>
          <button className="clear-log-btn" onClick={clearLog}>
            Clear Log
          </button>
        </div>
          <div className="log-list">
            {allLogs.length === 0 ? (
              <div className="log-empty">Belum ada aktivitas</div>
            ) : (
              allLogs.map((log) => (
                <div key={log.id} className={`log-item ${log.type}`}>
                  <div className="log-item-icon">
                    {getLogIcon(log.type || log.icon)}
                  </div>
                  <div className="log-item-content">
                    <p className="log-item-message">{log.message}</p>
                    <span className="log-item-time">
                      {formatTimestamp(log.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
