import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // <-- TAMBAHAN BARU
import PenyetorDashboardMobile from './pages/PenyetorDashboardMobile'; 
import PengepulDashboard from './pages/PengepulDashboard';
import PendaurDashboard from './pages/PendaurDashboard';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  if (user.role === 'penyetor') return <Navigate to="/penyetor" />;
  if (user.role === 'pengepul') return <Navigate to="/pengepul" />;
  if (user.role === 'pendaur') return <Navigate to="/pendaur" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-poppins">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> {/* <-- TAMBAHAN BARU */}
        
        <Route path="/" element={<RoleBasedRedirect />} />

        <Route path="/penyetor" element={
          <ProtectedRoute allowedRoles={['penyetor']}><PenyetorDashboardMobile /></ProtectedRoute>
        } />
        <Route path="/pengepul" element={
          <ProtectedRoute allowedRoles={['pengepul']}><PengepulDashboard /></ProtectedRoute>
        } />
        <Route path="/pendaur" element={
          <ProtectedRoute allowedRoles={['pendaur']}><PendaurDashboard /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
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