import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import PenyetorDashboardMobile from './pages/PenyetorDashboardMobile'; 
import PengepulDashboard from './pages/PengepulDashboard';
import PendaurDashboard from './pages/PendaurDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  // Mencegah user mengakses halaman role lain
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return children;
};

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  // Penamaan role di sini SEKARANG SUDAH SAMA dengan di RegisterPage
  if (user.role === 'Penyetor') return <Navigate to="/penyetor" replace />;
  if (user.role === 'Pengepul') return <Navigate to="/pengepul" replace />;
  if (user.role === 'Pendaur Ulang') return <Navigate to="/pendaur" replace />;
  
  // Fallback (Pencegah layar putih jika role tidak dikenali)
  return <Navigate to="/login" replace />;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-poppins">
      <Routes>
        {/* Rute Publik */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rute Utama (Otomatis melempar ke dashboard masing-masing) */}
        <Route path="/" element={<RoleBasedRedirect />} />

        {/* Rute Terproteksi Berdasarkan Role yang Cocok */}
        <Route path="/penyetor" element={
          <ProtectedRoute allowedRoles={['Penyetor']}><PenyetorDashboardMobile /></ProtectedRoute>
        } />
        
        <Route path="/pengepul" element={
          <ProtectedRoute allowedRoles={['Pengepul']}><PengepulDashboard /></ProtectedRoute>
        } />
        
        <Route path="/pendaur" element={
          <ProtectedRoute allowedRoles={['Pendaur Ulang']}><PendaurDashboard /></ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;