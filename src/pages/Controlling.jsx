// =====================================================
// CONTROLLING PAGE
// Placeholder for future relay/actuator control
// =====================================================

import TopBar from '../components/layout/TopBar';
import { MdTune, MdConstruction, MdPower, MdToggleOff } from 'react-icons/md';
import './Controlling.css';

export default function Controlling() {
  return (
    <div className="controlling-page">
      <TopBar title="Controlling" icon={MdTune} />

      <div className="controlling-content">
        {/* Coming Soon Hero */}
        <div className="controlling-hero">
          <div className="controlling-hero-icon">
            <MdConstruction size={56} />
          </div>
          <h3>Fitur Dalam Pengembangan</h3>
          <p>
            Halaman ini akan digunakan untuk mengontrol perangkat seperti relay,
            lampu, dan aktuator lainnya melalui Firebase.
          </p>
        </div>

        {/* Preview Cards */}
        <div className="controlling-preview">
          <h4 className="controlling-preview-title">Preview Kontrol (Coming Soon)</h4>
          <div className="controlling-grid">
            <div className="control-card disabled">
              <div className="control-card-header">
                <MdPower size={22} />
                <span>Relay 1 — Lampu Utama</span>
              </div>
              <div className="control-card-toggle">
                <MdToggleOff size={44} />
                <span>OFF</span>
              </div>
            </div>
            <div className="control-card disabled">
              <div className="control-card-header">
                <MdPower size={22} />
                <span>Relay 2 — AC</span>
              </div>
              <div className="control-card-toggle">
                <MdToggleOff size={44} />
                <span>OFF</span>
              </div>
            </div>
            <div className="control-card disabled">
              <div className="control-card-header">
                <MdPower size={22} />
                <span>Relay 3 — Projector</span>
              </div>
              <div className="control-card-toggle">
                <MdToggleOff size={44} />
                <span>OFF</span>
              </div>
            </div>
            <div className="control-card disabled">
              <div className="control-card-header">
                <MdPower size={22} />
                <span>Relay 4 — Fan</span>
              </div>
              <div className="control-card-toggle">
                <MdToggleOff size={44} />
                <span>OFF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
