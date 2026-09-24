import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const getDB = (key, defaultVal) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};
const setDB = (key, val) => localStorage.setItem(key, JSON.stringify(val));

const PengepulDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [minyak, setMinyak] = useState(() => getDB('DropOil_minyak_kurir', 0));
  const [riwayat, setRiwayat] = useState(() => getDB('DropOil_riwayat_kurir', []));
  const [pendingJemput, setPendingJemput] = useState(() => getDB('DropOil_pending_jemput', 0));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // TOMBOL KAMERA BAWAH -> Tarik Minyak dari Warga
  const handleScanWarga = () => {
    const requestWarga = getDB('DropOil_pending_jemput', 0);
    if (requestWarga > 0) {
      // Pindahkan minyak ke Kurir
      const newMinyak = minyak + requestWarga;
      setMinyak(newMinyak);
      setDB('DropOil_minyak_kurir', newMinyak);
      
      // Hapus Request dari Warga
      setDB('DropOil_pending_jemput', 0);
      setPendingJemput(0);

      // Tambahkan saldo ke Warga (1 Liter = Rp 5.000)
      const currentSaldoWarga = getDB('DropOil_saldo_warga', 125000);
      setDB('DropOil_saldo_warga', currentSaldoWarga + (requestWarga * 5000));

      // Catat Riwayat
      const newRiwayat = [{ id: Date.now(), title: 'Jemput dari Warga', subtitle: `Selesai (${requestWarga} L)`, status: 'Selesai', color: 'green' }, ...riwayat];
      setRiwayat(newRiwayat);
      setDB('DropOil_riwayat_kurir', newRiwayat);

      const adminLogs = getDB('DropOil_log_admin', []);
      setDB('DropOil_log_admin', [{ id: Date.now(), title: 'Kurir Budi selesai jemput', subtitle: `Volume: ${requestWarga} L`, status: 'Baru saja', color: 'green' }, ...adminLogs]);
    }
  };

  const handleSetor = () => {
    if (minyak > 0) {
      // Pindahkan minyak ke pintu Pabrik
      setDB('DropOil_pending_pabrik', getDB('DropOil_pending_pabrik', 0) + minyak);
      
      const newRiwayat = [{ id: Date.now(), title: 'Setor ke Pabrik DropOil', subtitle: 'Menunggu scan Pabrik', status: 'Pending', color: 'orange' }, ...riwayat];
      setRiwayat(newRiwayat);
      setDB('DropOil_riwayat_kurir', newRiwayat);

      setMinyak(0);
      setDB('DropOil_minyak_kurir', 0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-poppins sm:py-6">
      <div className="w-full max-w-[400px] bg-white sm:rounded-[2rem] sm:border sm:border-gray-200 sm:shadow-2xl min-h-screen sm:min-h-[800px] flex flex-col relative overflow-hidden">
        
        <div className="flex justify-between items-center p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">Budi Kurir</h1>
              <span className="text-[11px] font-medium text-blue-600">Pengepul</span>
            </div>
          </div>
          <button onClick={handleLogout} className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
          </button>
        </div>

        <div className="px-6 mt-4">
          <div className="bg-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20 transition-all">
            <p className="text-white/80 text-[11px] font-medium mb-1 uppercase tracking-wider">Minyak di Kendaraan</p>
            <h2 className="text-3xl font-bold mb-1">{minyak.toFixed(1)} Liter</h2>
            <span className="inline-block bg-white/20 text-[10px] px-2 py-0.5 rounded font-medium">{minyak > 0 ? 'Siap disetor ke Pabrik' : 'Kendaraan Kosong'}</span>
            
            <div className="flex gap-3 mt-5">
              <button className="flex-1 bg-white text-blue-700 font-semibold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg> Navigasi
              </button>
              <button onClick={handleSetor} className="flex-1 bg-blue-800 text-white font-semibold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-900 active:scale-95 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> Setor Pabrik
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 mt-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Aktivitas Hari Ini</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
              <p className="text-sm font-bold text-gray-900">4.2 Km</p>
              <p className="text-[9px] text-gray-500 mt-1">Jarak Tempuh</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
              <p className="text-sm font-bold text-gray-900">1</p>
              <p className="text-[9px] text-gray-500 mt-1">Warga Dilayani</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
              <p className="text-sm font-bold text-gray-900">{minyak === 0 ? '2/5' : '1/5'}</p>
              <p className="text-[9px] text-gray-500 mt-1">Target Harian</p>
            </div>
          </div>
        </div>

        <div className="flex-1 mt-6 px-6 overflow-y-auto pb-24">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Jadwal & Riwayat</h3>
            <span className="text-xs font-medium text-blue-600 cursor-pointer hover:underline" onClick={() => window.location.reload()}>Cari Request Warga</span>
          </div>
          
          {/* Indikator Jika Ada Request Warga Masuk */}
          {pendingJemput > 0 && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-center shadow-sm animate-pulse">
               <p className="text-xs font-bold text-blue-700">Warga Butuh Jemputan ({pendingJemput} L)!</p>
               <p className="text-[10px] text-blue-500">Klik tombol kamera di bawah untuk memproses.</p>
            </div>
          )}

          <div className="space-y-3">
            {riwayat.length === 0 && <p className="text-xs text-gray-400 text-center mt-4">Belum ada tugas</p>}
            {riwayat.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'}`}>
                  {item.color === 'green' ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900">{item.title}</p>
                  <p className="text-[10px] text-gray-500">{item.subtitle}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-1 rounded ${item.color === 'green' ? 'text-green-700 bg-green-50' : 'text-orange-600 bg-orange-50'}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM NAV */}
        <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 flex justify-between items-center px-6 py-2 pb-4 z-20">
           <div className="flex flex-col items-center text-blue-600"><svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg><span className="text-[9px] font-semibold">Beranda</span></div>
           <div className="flex flex-col items-center text-gray-400"><svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg><span className="text-[9px]">Peta</span></div>
           
           {/* TOMBOL SCANNER UNTUK JEMPUT Warga */}
           <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg -mt-6 cursor-pointer hover:bg-blue-700 active:scale-95 transition-transform" onClick={handleScanWarga}><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
           
           <div className="flex flex-col items-center text-gray-400"><svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg><span className="text-[9px]">Tugas</span></div>
           <div className="flex flex-col items-center text-gray-400"><svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg><span className="text-[9px]">Profil</span></div>
        </div>
      </div>
    </div>
  );
};
export default PengepulDashboard;