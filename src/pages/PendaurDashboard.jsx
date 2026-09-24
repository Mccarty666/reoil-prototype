import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const getDB = (key, defaultVal) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};
const setDB = (key, val) => localStorage.setItem(key, JSON.stringify(val));

const PendaurDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [stokGudang, setStokGudang] = useState(() => getDB('reoil_stok_pabrik', 455));
  const [diolah, setDiolah] = useState(() => getDB('reoil_diolah_pabrik', 300));
  
  // State ini akan otomatis turun jika warga berbelanja di Toko
  const [produkJadi, setProdukJadi] = useState(() => getDB('reoil_produk_jadi', 85));
  const [riwayat, setRiwayat] = useState(() => getDB('reoil_riwayat_pabrik', []));
  
  const [showModalOlah, setShowModalOlah] = useState(false);
  const [inputOlah, setInputOlah] = useState('');

  // Sinkronisasi Data Live saat Pabrik menekan tombol refresh
  const refreshLive = () => {
    setProdukJadi(getDB('reoil_produk_jadi', 85));
    setRiwayat(getDB('reoil_riwayat_pabrik', []));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleScanKurir = () => {
    const kurirSetor = getDB('reoil_pending_pabrik', 0);
    if (kurirSetor > 0) {
      const newStok = stokGudang + kurirSetor;
      setStokGudang(newStok);
      setDB('reoil_stok_pabrik', newStok);
      setDB('reoil_pending_pabrik', 0);

      setDB('reoil_total_global', getDB('reoil_total_global', 3455) + kurirSetor);

      const newRiwayat = [{ id: Date.now(), title: 'Terima dari Kurir ReOil', subtitle: 'Baru saja', volume: `+${kurirSetor} L` }, ...riwayat];
      setRiwayat(newRiwayat);
      setDB('reoil_riwayat_pabrik', newRiwayat);

      const adminLogs = getDB('reoil_log_admin', []);
      setDB('reoil_log_admin', [{ id: Date.now(), title: 'Pabrik terima setoran', subtitle: `Kurir (${kurirSetor} L)`, status: 'Baru saja', color: 'green' }, ...adminLogs]);
    } else {
      alert("Belum ada Kurir yang menyetor ke Pabrik.");
    }
  };

  const handleOlahStok = (e) => {
    e.preventDefault();
    const volumeOlah = parseInt(inputOlah);
    
    if (volumeOlah && stokGudang >= volumeOlah) {
      const sisaStok = stokGudang - volumeOlah;
      const totalDiolah = diolah + volumeOlah;
      const totalProduk = produkJadi + Math.floor(volumeOlah / 3); // 3L Jelantah = 1 Sabun

      setStokGudang(sisaStok);
      setDiolah(totalDiolah);
      setProdukJadi(totalProduk);

      setDB('reoil_stok_pabrik', sisaStok);
      setDB('reoil_diolah_pabrik', totalDiolah);
      setDB('reoil_produk_jadi', totalProduk); // Tambah stok yang akan ditarik ke Toko Warga

      setShowModalOlah(false);
      setInputOlah('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-poppins sm:py-6">
      <div className="w-full max-w-[400px] bg-white sm:rounded-[2rem] sm:border sm:border-gray-200 sm:shadow-2xl min-h-screen sm:min-h-[800px] flex flex-col relative overflow-hidden">
        
        <div className="flex justify-between items-center p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">Mitra Pabrik</h1>
              <span className="text-[11px] font-medium text-green-600">Pendaur Ulang</span>
            </div>
          </div>
          <button onClick={handleLogout} className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
          </button>
        </div>

        <div className="px-6 mt-4">
          <div className="bg-green-600 rounded-2xl p-5 text-white shadow-lg shadow-green-500/20">
            <p className="text-white/80 text-[11px] font-medium mb-1 uppercase tracking-wider">Total Stok Gudang</p>
            <h2 className="text-3xl font-bold mb-1">{stokGudang} Liter</h2>
            <span className="inline-block bg-white/20 text-[10px] px-2 py-0.5 rounded font-medium">Monitoring Real-time</span>
            
            <div className="flex gap-3 mt-5">
              <button onClick={handleScanKurir} className="flex-1 bg-white text-green-700 font-semibold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50 active:scale-95 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM18.375 15.75h-3.375m0 0v-3.375m0 3.375v3.375m0-3.375h3.375m-3.375 0v3.375m0-3.375h3.375" /></svg> Scan Kurir
              </button>
              <button onClick={() => setShowModalOlah(true)} className="flex-1 bg-green-800 text-white font-semibold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-green-900 active:scale-95 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg> Olah Stok
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 mt-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Produktivitas Pabrik</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
              <p className="text-sm font-bold text-gray-900">12</p>
              <p className="text-[9px] text-gray-500 mt-1">Kurir Aktif</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
              <p className="text-sm font-bold text-gray-900">{diolah} L</p>
              <p className="text-[9px] text-gray-500 mt-1">Selesai Diolah</p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-3 text-center border border-orange-100 relative">
              {/* Highlight bahwa ini adalah stok toko */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>
              <p className="text-sm font-bold text-orange-600">{produkJadi}</p>
              <p className="text-[9px] text-orange-500 mt-1 font-medium">Stok di Toko</p>
            </div>
          </div>
        </div>

        <div className="flex-1 mt-6 px-6 overflow-y-auto pb-24">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Riwayat Transaksi</h3>
            <span className="text-xs font-bold text-green-600 cursor-pointer hover:underline" onClick={refreshLive}>Cek Penjualan 🔄</span>
          </div>
          <div className="space-y-3">
            {riwayat.length === 0 && <p className="text-xs text-gray-400 text-center mt-4">Belum ada pasokan/penjualan</p>}
            {riwayat.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                  {item.volume.includes('-') ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900">{item.title}</p>
                  <p className="text-[10px] text-gray-500">{item.subtitle}</p>
                </div>
                <span className={`text-xs font-bold ${item.volume.includes('-') ? 'text-orange-600' : 'text-green-600'}`}>{item.volume}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM NAV */}
        <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 flex justify-between items-center px-6 py-2 pb-4 z-20">
           <div className="flex flex-col items-center text-green-600"><svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg></div>
           <div className="flex flex-col items-center text-gray-400"><svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg></div>
           <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg -mt-6 cursor-pointer hover:bg-green-700 active:scale-95 transition-transform" onClick={() => setShowModalOlah(true)}><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" /></svg></div>
           <div className="flex flex-col items-center text-gray-400"><svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg></div>
           <div className="flex flex-col items-center text-gray-400"><svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
        </div>

        {/* MODAL OLAH STOK */}
        {showModalOlah && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full shadow-2xl">
              <h3 className="font-bold text-lg mb-2">Olah Minyak Jelantah</h3>
              <form onSubmit={handleOlahStok}>
                <input type="number" min="1" max={stokGudang} required value={inputOlah} onChange={(e) => setInputOlah(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4 outline-none focus:border-green-500 font-bold text-gray-800" placeholder={`Maks: ${stokGudang} L`} />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowModalOlah(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl">Batal</button>
                  <button type="submit" className="flex-1 py-3 text-sm font-bold text-white bg-green-600 rounded-xl">Proses Jadi Sabun</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PendaurDashboard;