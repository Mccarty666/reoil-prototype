import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const getDB = (key, defaultVal) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Membaca data Global yang disimpan oleh ekosistem
  const [totalGlobal, setTotalGlobal] = useState(() => getDB('reoil_total_global', 3455));
  const [adminLogs, setAdminLogs] = useState(() => getDB('reoil_log_admin', []));

  // Auto-refresh jika ada aktivitas di tab lain
  useEffect(() => {
    setTotalGlobal(getDB('reoil_total_global', 3455));
    setAdminLogs(getDB('reoil_log_admin', []));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const refreshLive = () => {
    setTotalGlobal(getDB('reoil_total_global', 3455));
    setAdminLogs(getDB('reoil_log_admin', []));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-poppins sm:py-6">
      <div className="w-full max-w-[400px] bg-white sm:rounded-[2rem] sm:border sm:border-gray-200 sm:shadow-2xl min-h-screen sm:min-h-[800px] flex flex-col relative overflow-hidden">
        
        <div className="flex justify-between items-center p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">Admin Utama</h1>
              <span className="text-[11px] font-medium text-slate-500">Sistem Kendali</span>
            </div>
          </div>
          <button onClick={handleLogout} className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
          </button>
        </div>

        <div className="px-6 mt-4">
          <div className="bg-slate-800 rounded-2xl p-5 text-white shadow-lg shadow-slate-800/20">
            <p className="text-white/70 text-[11px] font-medium mb-1 uppercase tracking-wider">Total Minyak Terselamatkan</p>
            <h2 className="text-3xl font-bold mb-1 text-white">{totalGlobal.toLocaleString()} Liter</h2>
            <span className="inline-block bg-white/10 text-[10px] px-2 py-0.5 rounded font-medium text-slate-300">Global Data System</span>
            
            <div className="flex gap-3 mt-5">
              <button className="flex-1 bg-white text-slate-800 font-semibold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" /></svg> Analitik
              </button>
              <button className="flex-1 bg-slate-700 text-white font-semibold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 border border-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /></svg> Keuangan
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 mt-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Master Data</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
              <p className="text-sm font-bold text-gray-900">1,245</p>
              <p className="text-[9px] text-gray-500 mt-1">Total Warga</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
              <p className="text-sm font-bold text-gray-900">48</p>
              <p className="text-[9px] text-gray-500 mt-1">Kurir Aktif</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
              <p className="text-sm font-bold text-gray-900">12</p>
              <p className="text-[9px] text-gray-500 mt-1">Mitra Pabrik</p>
            </div>
          </div>
        </div>

        <div className="flex-1 mt-6 px-6 overflow-y-auto pb-24">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Log Aktivitas Sistem</h3>
            <span className="text-xs font-bold text-slate-500 cursor-pointer hover:text-slate-800" onClick={refreshLive}>Live 🔄</span>
          </div>
          <div className="space-y-3">
            {adminLogs.length === 0 && <p className="text-xs text-gray-400 text-center mt-4">Belum ada log sistem</p>}
            
            {adminLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${log.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'}`}>
                  {log.color === 'green' ? (
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900">{log.title}</p>
                  <p className="text-[10px] text-gray-500">{log.subtitle}</p>
                </div>
                <span className="text-[10px] text-gray-400">{log.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM NAV */}
        <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 flex justify-between items-center px-6 py-2 pb-4 z-20">
           <div className="flex flex-col items-center text-slate-800"><svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg></div>
           <div className="flex flex-col items-center text-gray-400"><svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg></div>
           <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white shadow-lg -mt-6"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg></div>
           <div className="flex flex-col items-center text-gray-400"><svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg></div>
           <div className="flex flex-col items-center text-gray-400"><svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg></div>
        </div>

      </div>
    </div>
  );
};
export default AdminDashboard;