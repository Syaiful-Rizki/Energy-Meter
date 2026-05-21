// =====================================================
// MONITORING PAGE
// Detailed sensor readings with full-width charts
// =====================================================

import useRealtimeData from '../hooks/useRealtimeData';
import useHistoryData from '../hooks/useHistoryData';
import TopBar from '../components/layout/TopBar';
import MetricCard from '../components/cards/MetricCard';
import RealtimeChart from '../components/charts/RealtimeChart';
import StatusBadge from '../components/common/StatusBadge';
import { formatNumber, formatTimestamp } from '../utils/formatters';
import { CARD_GRADIENTS } from '../utils/constants';
import {
  MdMonitor,
  MdBolt,
  MdElectricalServices,
  MdPower,
  MdBatteryChargingFull,
  MdRefresh,
  MdSensors,
} from 'react-icons/md';
import './Monitoring.css';

export default function Monitoring() {
  const { data, loading, lastUpdated } = useRealtimeData();
  const { history } = useHistoryData(50);

  return (
    <div className="monitoring-page">
      <TopBar title="Monitoring" icon={MdMonitor} />

      <div className="monitoring-content">
        {/* ESP32 Device Header */}
        <div className="monitoring-device-header">
          <div className="monitoring-device-info">
            <MdSensors size={22} className="monitoring-device-icon" />
            <div>
              <h3>Monitoring Energy Meter (ESP32)</h3>
              <p>PZEM-004T — Real-time sensor readings</p>
            </div>
          </div>
          <StatusBadge status={data.status} />
        </div>

        {/* Metric Cards */}
        <div className="monitoring-metrics">
          <MetricCard
            title="Tegangan (V)"
            value={data.voltage}
            unit="V"
            icon={MdBolt}
            gradient={CARD_GRADIENTS.voltage}
            decimals={1}
          />
          <MetricCard
            title="Arus (A)"
            value={data.current}
            unit="A"
            icon={MdElectricalServices}
            gradient={CARD_GRADIENTS.current}
            decimals={2}
          />
          <MetricCard
            title="Daya (W)"
            value={data.power}
            unit="W"
            icon={MdPower}
            gradient={CARD_GRADIENTS.power}
            decimals={0}
          />
          <MetricCard
            title="Energi (kWh)"
            value={data.energy}
            unit="kWh"
            icon={MdBatteryChargingFull}
            gradient={CARD_GRADIENTS.energy}
            decimals={2}
          />
        </div>

        {/* Detailed Stats Table */}
        <div className="monitoring-detail-card">
          <h3 className="monitoring-detail-title">Detail Pembacaan Sensor</h3>
          <div className="monitoring-detail-table">
            <div className="monitoring-detail-row">
              <span className="detail-label">Tegangan</span>
              <span className="detail-value">{formatNumber(data.voltage, 1)} V</span>
              <span className="detail-range">Normal: 198 - 242 V</span>
            </div>
            <div className="monitoring-detail-row">
              <span className="detail-label">Arus</span>
              <span className="detail-value">{formatNumber(data.current, 2)} A</span>
              <span className="detail-range">Max: 100 A</span>
            </div>
            <div className="monitoring-detail-row">
              <span className="detail-label">Daya</span>
              <span className="detail-value">{formatNumber(data.power, 0)} W</span>
              <span className="detail-range">Max: 22000 W</span>
            </div>
            <div className="monitoring-detail-row">
              <span className="detail-label">Energi</span>
              <span className="detail-value">{formatNumber(data.energy, 2)} kWh</span>
              <span className="detail-range">Akumulasi total</span>
            </div>
            <div className="monitoring-detail-row">
              <span className="detail-label">Status</span>
              <StatusBadge status={data.status} />
              <span className="detail-range">Update: {formatTimestamp(lastUpdated)}</span>
            </div>
          </div>
        </div>

        {/* Full Charts */}
        <RealtimeChart
          data={history}
          lines={['voltage']}
          title="📊 Grafik Tegangan (V)"
          height={280}
        />

        <RealtimeChart
          data={history}
          lines={['current']}
          title="📊 Grafik Arus (A)"
          height={280}
        />

        <RealtimeChart
          data={history}
          lines={['power', 'energy']}
          title="📊 Grafik Daya & Energi"
          height={280}
        />
      </div>
    </div>
  );
}
