import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import PenyetorDashboardMobile from './pages/PenyetorDashboardMobile'; 
import PengepulDashboard from './pages/PengepulDashboard';
import PendaurDashboard from './pages/PendaurDashboard';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  // Mencegah user mengakses halaman role lain
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  
  return children;
};

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  // Penamaan role di sini HARUS sama persis dengan di RegisterPage
  if (user.role === 'Warga') return <Navigate to="/penyetor" />;
  if (user.role === 'Kurir') return <Navigate to="/pengepul" />;
  if (user.role === 'Admin') return <Navigate to="/admin" />;
  
  // Fallback (Pencegah layar putih jika role tidak dikenali)
  return <Navigate to="/login" />;
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
          <ProtectedRoute allowedRoles={['Warga']}><PenyetorDashboardMobile /></ProtectedRoute>
        } />
        
        <Route path="/pengepul" element={
          <ProtectedRoute allowedRoles={['Kurir']}><PengepulDashboard /></ProtectedRoute>
        } />
        
        {/* Rute Admin (Bisa digabung jika admin juga mengurus pendaur) */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>
        } />
        
        <Route path="/pendaur" element={
          <ProtectedRoute allowedRoles={['Admin']}><PendaurDashboard /></ProtectedRoute>
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