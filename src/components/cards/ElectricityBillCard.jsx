import React from 'react';
import './ElectricityBillCard.css';

export default function ElectricityBillCard({ billAmount, todaysUsage, efficiency, voltageStability, powerUsage, status }) {
  return (
    <div className="eb-card-container">
      <div className="eb-card-header">
        <span className="eb-card-subtitle">CURRENT ELECTRICITY BILL</span>
        <h2 className="eb-card-amount">Rp {billAmount.toLocaleString('id-ID')}</h2>
      </div>

      <div className="eb-card-pills">
        <div className="eb-pill">
          <span className="eb-pill-label">Today's Usage</span>
          <span className="eb-pill-value">{todaysUsage} kWh</span>
        </div>
        <div className="eb-pill">
          <span className="eb-pill-label">Efficiency</span>
          <span className="eb-pill-value">{efficiency}%</span>
        </div>
      </div>

      <div className="eb-glass-panel">
        <div className="eb-glass-header">
          <span className="eb-glass-title">Status</span>
          <span className={`eb-glass-status ${status.toLowerCase()}`}>{status}</span>
        </div>

        <div className="eb-progress-row">
          <div className="eb-progress-labels">
            <span>Voltage Stability</span>
            <span>{voltageStability}%</span>
          </div>
          <div className="eb-progress-track">
            <div 
              className="eb-progress-fill green" 
              style={{ width: `${voltageStability}%` }}
            ></div>
          </div>
        </div>

        <div className="eb-progress-row">
          <div className="eb-progress-labels">
            <span>Power Usage</span>
            <span>{powerUsage}%</span>
          </div>
          <div className="eb-progress-track">
            <div 
              className="eb-progress-fill yellow" 
              style={{ width: `${powerUsage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
