// =====================================================
// METRIC CARD
// Reusable sensor value display card
// =====================================================

import { formatNumber } from '../../utils/formatters';
import './MetricCard.css';

export default function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  gradient,
  decimals = 1,
  subtitle,
}) {
  return (
    <div className="metric-card" style={{ '--card-gradient': gradient }}>
      <div className="metric-card-header">
        <span className="metric-card-title">{title}</span>
        {Icon && <Icon size={22} className="metric-card-icon" />}
      </div>
      <div className="metric-card-value">
        {formatNumber(value, decimals)}
        {unit && <span className="metric-card-unit">{unit}</span>}
      </div>
      {subtitle && (
        <div className="metric-card-subtitle">{subtitle}</div>
      )}
    </div>
  );
}
