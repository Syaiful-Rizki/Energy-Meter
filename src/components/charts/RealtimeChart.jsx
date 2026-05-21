// =====================================================
// REALTIME CHART
// Line chart for historical sensor data
// =====================================================

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatChartTime } from '../../utils/formatters';
import { CHART_COLORS } from '../../utils/constants';
import './RealtimeChart.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{formatChartTime(label)}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="chart-tooltip-item" style={{ color: entry.color }}>
          <span className="chart-tooltip-dot" style={{ background: entry.color }}></span>
          {entry.name}: <strong>{Number(entry.value).toFixed(2)}</strong>
        </p>
      ))}
    </div>
  );
};

export default function RealtimeChart({
  data = [],
  lines = ['voltage', 'current'],
  title = 'Grafik Sensor',
  height = 300,
}) {
  if (!data.length) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-empty">
          <p>Belum ada data historis</p>
        </div>
      </div>
    );
  }

  const lineConfig = {
    voltage: { name: 'Voltage (V)', color: CHART_COLORS.voltage },
    current: { name: 'Current (A)', color: CHART_COLORS.current },
    power: { name: 'Power (W)', color: CHART_COLORS.power },
    energy: { name: 'Energy (kWh)', color: CHART_COLORS.energy },
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-wrapper" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatChartTime}
              stroke="var(--text-secondary)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--text-secondary)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '0.8rem', paddingTop: '0.5rem' }}
            />
            {lines.map((key) => {
              const cfg = lineConfig[key];
              if (!cfg) return null;
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={cfg.name}
                  stroke={cfg.color}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                  animationDuration={800}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
