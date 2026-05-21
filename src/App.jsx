// =====================================================
// APP COMPONENT
// Router setup with auth guard + layout
// =====================================================

import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Monitoring from './pages/Monitoring';
import Controlling from './pages/Controlling';
import DataHistory from './pages/DataHistory';
import LogActivity from './pages/LogActivity';

// Layout wrapper for authenticated pages
function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main fade-in">
        {children}
      </main>
    </div>
  );
}

// Protected page wrapper (auth + layout)
function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
        <Route path="/monitoring" element={<ProtectedPage><Monitoring /></ProtectedPage>} />
        <Route path="/controlling" element={<ProtectedPage><Controlling /></ProtectedPage>} />
        <Route path="/data" element={<ProtectedPage><DataHistory /></ProtectedPage>} />
        <Route path="/log" element={<ProtectedPage><LogActivity /></ProtectedPage>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
