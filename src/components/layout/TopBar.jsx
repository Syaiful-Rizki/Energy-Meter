// =====================================================
// TOPBAR COMPONENT
// Page header with title and Firebase status
// =====================================================

import { MdCloud } from 'react-icons/md';
import './TopBar.css';

export default function TopBar({ title, icon: Icon }) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        {Icon && <Icon size={24} className="topbar-title-icon" />}
        <h2>{title}</h2>
      </div>
      <div className="topbar-status">
        <MdCloud size={16} />
        <span>Data sesuai Firebase</span>
      </div>
    </header>
  );
}
