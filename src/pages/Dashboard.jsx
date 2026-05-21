// =====================================================
// DASHBOARD PAGE
// Main overview with metric cards, chart, device status
// =====================================================

import useRealtimeData from '../hooks/useRealtimeData';
import useHistoryData from '../hooks/useHistoryData';
import TopBar from '../components/layout/TopBar';
import MetricCard from '../components/cards/MetricCard';
import RealtimeChart from '../components/charts/RealtimeChart';
import StatusBadge from '../components/common/StatusBadge';
import { formatTimestamp } from '../utils/formatters';
import { CARD_GRADIENTS } from '../utils/constants';
import {
  MdDashboard,
  MdBolt,
  MdElectricalServices,
  MdPower,
  MdBatteryChargingFull,
  MdDevices,
  MdAccessTime,
} from 'react-icons/md';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import './Dashboard.css';

export default function Dashboard() {
  const { data, loading, lastUpdated } = useRealtimeData();
  const { history } = useHistoryData(30);

  const isOnline = data.status === 'online';

  // Device status pie chart data
  const deviceStatusData = [
    { name: 'Online', value: isOnline ? 1 : 0 },
    { name: 'Offline', value: isOnline ? 0 : 1 },
  ];
  const PIE_COLORS = ['#22c55e', '#334155'];

  // Energy usage percentage (arbitrary max for visual)
  const maxEnergy = 100; // kWh
  const energyPercent = data.energy
    ? Math.min((data.energy / maxEnergy) * 100, 100)
    : 0;

  return (
    <div className="dashboard-page">
      <TopBar title="Dashboard" icon={MdDashboard} />

      <div className="dashboard-content">
        {/* Metric Cards Row */}
        <div className="dashboard-metrics">
          <MetricCard
            title="Tegangan (V)"
            value={data.voltage}
            unit="V"
            icon={MdBolt}
            gradient={CARD_GRADIENTS.voltage}
            decimals={1}
            subtitle={`⏱ Terakhir: ${formatTimestamp(lastUpdated)}`}
          />
          <MetricCard
            title="Arus (A)"
            value={data.current}
            unit="A"
            icon={MdElectricalServices}
            gradient={CARD_GRADIENTS.current}
            decimals={2}
            subtitle={`⏱ Terakhir: ${formatTimestamp(lastUpdated)}`}
          />
          <MetricCard
            title="Daya (W)"
            value={data.power}
            unit="W"
            icon={MdPower}
            gradient={CARD_GRADIENTS.power}
            decimals={0}
            subtitle={`⏱ Terakhir: ${formatTimestamp(lastUpdated)}`}
          />
          <MetricCard
            title="Energi (kWh)"
            value={data.energy}
            unit="kWh"
            icon={MdBatteryChargingFull}
            gradient={CARD_GRADIENTS.energy}
            decimals={2}
            subtitle={`⏱ Terakhir: ${formatTimestamp(lastUpdated)}`}
          />
        </div>

        {/* Status Strip */}
        <div className="dashboard-status-strip">
          <div className="dashboard-status-item">
            <MdDevices size={20} />
            <span>Perangkat Aktif</span>
            <strong>{isOnline ? '1' : '0'}</strong>
          </div>
          <div className="dashboard-status-item">
            <span>Status Koneksi</span>
            <StatusBadge status={data.status} />
          </div>
        </div>

        {/* Energy Usage Bar */}
        <div className="dashboard-energy-bar-section">
          <div className="dashboard-energy-bar-header">
            <span className="dashboard-energy-label">Konsumsi Energi</span>
            <span className="dashboard-energy-value">{energyPercent.toFixed(1)}%</span>
          </div>
          <div className="dashboard-energy-bar-track">
            <div
              className="dashboard-energy-bar-fill"
              style={{ width: `${energyPercent}%` }}
            ></div>
          </div>
          <div className="dashboard-energy-bar-legend">
            <span>Kosong</span>
            <span>Penuh</span>
          </div>
          <div className="dashboard-last-update">
            <MdAccessTime size={14} />
            <span>Update terakhir: {formatTimestamp(lastUpdated)}</span>
          </div>
        </div>

        {/* Charts Row */}
        <div className="dashboard-charts-row">
          <div className="dashboard-chart-main">
            <RealtimeChart
              data={history}
              lines={['voltage', 'current']}
              title="📈 Grafik Tegangan & Arus"
              height={280}
            />
          </div>
          <div className="dashboard-chart-side">
            <div className="chart-container">
              <h3 className="chart-title">🔌 Status Perangkat</h3>
              <div className="dashboard-pie-wrapper">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={deviceStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      animationDuration={800}
                    >
                      {deviceStatusData.map((entry, index) => (
                        <Cell key={entry.name} fill={PIE_COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="dashboard-pie-center">
                  <span className={`pie-status ${isOnline ? 'online' : 'offline'}`}>
                    {isOnline ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
              <div className="dashboard-pie-legend">
                <div className="pie-legend-item">
                  <span className="pie-legend-dot" style={{ background: '#22c55e' }}></span>
                  Online
                </div>
                <div className="pie-legend-item">
                  <span className="pie-legend-dot" style={{ background: '#334155' }}></span>
                  Offline
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
