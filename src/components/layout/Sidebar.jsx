// =====================================================
// SIDEBAR COMPONENT
// Navigation sidebar with user info & logout
// =====================================================
import { useState } from 'react';
import { MdMenu, MdClose } from 'react-icons/md';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import StatusBadge from '../common/StatusBadge';
import useRealtimeData from '../../hooks/useRealtimeData';
import {
  MdDashboard,
  MdMonitor,
  MdTune,
  MdStorage,
  MdHistory,
  MdLogout,
  MdSensors,
} from 'react-icons/md';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', Icon: MdDashboard },
  { path: '/monitoring', label: 'Monitoring', Icon: MdMonitor },
  { path: '/controlling', label: 'Controlling', Icon: MdTune },
  { path: '/data', label: 'Data', Icon: MdStorage },
  { path: '/log', label: 'Log Akses', Icon: MdHistory },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { data } = useRealtimeData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Mobile Toggle Button */}
      <button 
        className="mobile-menu-btn" 
        onClick={() => setIsOpen(true)}
      >
        <MdMenu size={28} />
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button
          className="sidebar-close-btn"
          onClick={() => setIsOpen(false)}
        >
          <MdClose size={24} />
        </button>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <MdSensors size={28} />
        </div>
        <div className="sidebar-brand-text">
          <h1>Energy Meter</h1>
          <span>Monitor</span>
        </div>
      </div>

      {/* Room Info */}
      <div className="sidebar-room">
        <div className="sidebar-room-label">Ruang Aktif</div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="sidebar-footer">
        <div className="sidebar-user-info">
          <div className="sidebar-user-label">Logged in as</div>
          <div className="sidebar-user-email">
            {currentUser?.email || 'Unknown'}
          </div>
          <div className="sidebar-connection">
            <span>Connection:</span>
            <StatusBadge status={data.status} />
          </div>
        </div>
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <MdLogout size={18} />
          Logout
        </button>
      </div>
    </aside>
    </>
  );
}
