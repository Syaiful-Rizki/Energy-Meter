// =====================================================
// LOADING SPINNER
// Full-screen loading state
// =====================================================

import './LoadingSpinner.css';

export default function LoadingSpinner({ message = 'Memuat...' }) {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
        <p className="loading-spinner-text">{message}</p>
      </div>
    </div>
  );
}
