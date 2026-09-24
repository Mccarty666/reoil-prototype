import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

// Helper Simulasi Database
const getDB = (key, defaultVal) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};
const setDB = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// DAFTAR 5 PRODUK TOKO
const daftarProduk = [
  { id: 1, name: 'Sabun Cuci Eco', desc: 'Ramah lingkungan, aman untuk perabotan.', price: 15000, icon: '🧼' },
  { id: 2, name: 'Lilin Aromaterapi', desc: 'Wangi lavender & sereh pengusir nyamuk.', price: 20000, icon: '🕯️' },
  { id: 3, name: 'Pembersih Lantai', desc: 'Cairan pembersih lantai anti-bakteri.', price: 25000, icon: '🧴' },
  { id: 4, name: 'Bio-Briket BBQ', desc: 'Bahan bakar padat tahan lama (1 Kg).', price: 10000, icon: '🔥' },
  { id: 5, name: 'Pelumas Anti-Karat', desc: 'Perawatan engsel pintu & rantai motor.', price: 30000, icon: '⚙️' }
];

const PenyetorDashboardMobile = () => {
  const { user, logout } = useAuth(); // Memanggil data user dari Context
  const navigate = useNavigate();

  const [saldo, setSaldo] = useState(() => getDB('reoil_saldo_warga', 125000));
  const [riwayat, setRiwayat] = useState(() => getDB('reoil_riwayat_warga', []));
  
  const [showModalSetor, setShowModalSetor] = useState(false);
  const [showModalTarik, setShowModalTarik] = useState(false);
  const [showModalToko, setShowModalToko] = useState(false);
  
  const [inputVolume, setInputVolume] = useState('');
  const [inputTarik, setInputTarik] = useState('');
  
  const [stokPabrik, setStokPabrik] = useState(0);

  useEffect(() => {
    setSaldo(getDB('reoil_saldo_warga', 125000));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSetor = (e) => {
    e.preventDefault();
    const vol = parseFloat(inputVolume);
    if (vol > 0) {
      const newRiwayat = [{ id: Date.now(), title: `Request Jemput (${vol} L)`, subtitle: 'Mencari Kurir...', status: 'Proses', color: 'orange' }, ...riwayat];
      setRiwayat(newRiwayat);
      setDB('reoil_riwayat_warga', newRiwayat);
      setDB('reoil_pending_jemput', getDB('reoil_pending_jemput', 0) + vol);
      
      const adminLogs = getDB('reoil_log_admin', []);
      // Menggunakan nama user secara dinamis pada log admin
      setDB('reoil_log_admin', [{ id: Date.now(), title: `Warga ${user?.name || 'Warga'} request jemput`, subtitle: `Area: Bintaro (${vol} L)`, status: 'Baru saja', color: 'orange' }, ...adminLogs]);

      setShowModalSetor(false);
      setInputVolume('');
    }
  };

  const handleTarik = (e) => {
    e.preventDefault();
    const tarik = parseInt(inputTarik);
    if (tarik && saldo >= tarik) {
      const newSaldo = saldo - tarik;
      setSaldo(newSaldo);
      setDB('reoil_saldo_warga', newSaldo);
      const newRiwayat = [{ id: Date.now(), title: `Tarik Saldo`, subtitle: 'Transfer Bank', status: `-Rp${(tarik/1000)}k`, color: 'gray' }, ...riwayat];
      setRiwayat(newRiwayat);
      setDB('reoil_riwayat_warga', newRiwayat);
      setShowModalTarik(false);
      setInputTarik('');
    } else {
      alert("Saldo tidak mencukupi!");
    }
  };

  // FUNGSI BELI PRODUK DINAMIS
  const handleBeliProduk = (produk) => {
    const stokSaatIni = getDB('reoil_produk_jadi', 85); 

    if (stokSaatIni > 0 && saldo >= produk.price) {
      // 1. Kurangi Saldo
      const newSaldo = saldo - produk.price;
      setSaldo(newSaldo);
      setDB('reoil_saldo_warga', newSaldo);

      // 2. Kurangi Stok Unit Pabrik
      const newStok = stokSaatIni - 1;
      setStokPabrik(newStok);
      setDB('reoil_produk_jadi', newStok);

      // 3. Catat Riwayat Warga
      const newRiwayatWarga = [{ id: Date.now(), title: `Beli ${produk.name}`, subtitle: 'Toko ReOil', status: `-Rp${produk.price/1000}k`, color: 'gray' }, ...riwayat];
      setRiwayat(newRiwayatWarga);
      setDB('reoil_riwayat_warga', newRiwayatWarga);

      // 4. Catat Penjualan di Pabrik (Nama pembeli dinamis)
      const riwayatPabrik = getDB('reoil_riwayat_pabrik', []);
      setDB('reoil_riwayat_pabrik', [{ id: Date.now(), title: 'Penjualan Produk', subtitle: `Dibeli oleh: ${user?.name || 'Warga'}`, volume: `-1 ${produk.name.split(' ')[0]}` }, ...riwayatPabrik]);

      // 5. Catat Log Admin (Nama produk & pembeli dinamis)
      const adminLogs = getDB('reoil_log_admin', []);
      setDB('reoil_log_admin', [{ id: Date.now(), title: 'Transaksi Toko ReOil', subtitle: `${user?.name || 'Warga'} beli 1 ${produk.name}`, status: 'Baru saja', color: 'green' }, ...adminLogs]);

      alert(`🎉 Berhasil membeli 1 ${produk.name}!`);
    } else if (stokSaatIni <= 0) {
      alert("Mohon maaf, semua produk di Pabrik sedang habis.");
    } else {
      alert("Saldo Anda tidak mencukupi untuk membeli produk ini.");
    }
  };

  const openToko = () => {
    setStokPabrik(getDB('reoil_produk_jadi', 85)); 
    setShowModalToko(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-poppins sm:py-6">
      <div className="w-full max-w-[400px] bg-white sm:rounded-[2rem] sm:border sm:border-gray-200 sm:shadow-2xl min-h-screen sm:min-h-[800px] flex flex-col relative overflow-hidden">
        
        {/* HEADER DINAMIS */}
        <div className="flex justify-between items-center p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'W'}
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">{user?.name || 'Warga'}</h1>
              <span className="text-[11px] font-medium text-orange-600">Penyetor</span>
            </div>
          </div>
          <button onClick={handleLogout} className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
          </button>
        </div>

        {/* MAIN CARD */}
        <div className="px-6 mt-4">
          <div className="bg-orange-500 rounded-2xl p-5 text-white shadow-lg shadow-orange-500/20">
            <p className="text-white/80 text-[11px] font-medium mb-1 uppercase tracking-wider">Total Saldo</p>
            <h2 className="text-3xl font-bold mb-1">Rp {saldo.toLocaleString('id-ID')}</h2>
            <span className="inline-block bg-white/20 text-[10px] px-2 py-0.5 rounded font-medium">Bisa dibelanjakan</span>
            
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModalSetor(true)} className="flex-1 bg-white text-orange-600 font-semibold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50 active:scale-95 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> Setor
              </button>
              <button onClick={() => setShowModalTarik(true)} className="flex-1 bg-orange-600 text-white font-semibold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 border border-orange-400 hover:bg-orange-700 active:scale-95 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg> Tarik
              </button>
            </div>
          </div>
        </div>

        {/* STATS & LIST */}
        <div className="px-6 mt-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Dampakmu Bulan Ini</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100"><div className="text-orange-500 mb-1 flex justify-center"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg></div><p className="text-sm font-bold text-gray-900">12.5 L</p><p className="text-[9px] text-gray-500">Disetor</p></div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100"><div className="text-blue-500 mb-1 flex justify-center"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12l-8 8-8-8a6 6 0 1112 0" /></svg></div><p className="text-sm font-bold text-gray-900">12.5K L</p><p className="text-[9px] text-gray-500">Air Selamat</p></div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100"><div className="text-emerald-500 mb-1 flex justify-center"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg></div><p className="text-sm font-bold text-gray-900">34 Kg</p><p className="text-[9px] text-gray-500">Emisi Dicegah</p></div>
          </div>
        </div>

        <div className="flex-1 mt-6 px-6 overflow-y-auto pb-24">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Riwayat Terakhir</h3>
            <span className="text-xs font-medium text-orange-500 cursor-pointer hover:underline" onClick={() => window.location.reload()}>Refresh Data</span>
          </div>
          <div className="space-y-3">
            {riwayat.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color === 'orange' ? 'bg-orange-50 text-orange-500' : item.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                  {item.color === 'orange' ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900">{item.title}</p>
                  <p className="text-[10px] text-gray-500">{item.subtitle}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-1 rounded ${item.color === 'orange' ? 'text-orange-600 bg-orange-50' : item.color === 'green' ? 'text-green-600' : 'text-gray-600'}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM NAV */}
        <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 flex justify-between items-center px-6 py-2 pb-4 z-20">
           <div className="flex flex-col items-center text-orange-500"><svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg><span className="text-[9px] font-semibold">Beranda</span></div>
           <div className="flex flex-col items-center text-gray-400"><svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><span className="text-[9px]">Riwayat</span></div>
           <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg -mt-6 cursor-pointer hover:bg-orange-600 active:scale-95 transition-transform" onClick={() => setShowModalSetor(true)}><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" /></svg></div>
           
           <div className="flex flex-col items-center text-gray-400 cursor-pointer hover:text-orange-500" onClick={openToko}>
             <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
             <span className="text-[9px]">Toko</span>
           </div>
           
           <div className="flex flex-col items-center text-gray-400"><svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg><span className="text-[9px]">Profil</span></div>
        </div>

        {/* MODAL TOKO REOIL DENGAN 5 PRODUK */}
        {showModalToko && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-5 w-full shadow-2xl flex flex-col max-h-[85vh]">
              
              {/* Header Toko */}
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="font-bold text-lg">Toko ReOil</h3>
                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">Saldo: Rp {(saldo/1000)}k</span>
              </div>
              
              {/* List Produk (Bisa di-scroll) */}
              <div className="overflow-y-auto pr-1 -mr-2 space-y-3 flex-1 mb-4 custom-scrollbar">
                {daftarProduk.map((prod) => (
                  <div key={prod.id} className="border border-gray-100 rounded-2xl p-3 flex gap-3 items-center bg-gray-50">
                    <div className="w-14 h-14 shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center text-3xl">
                      {prod.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-900">{prod.name}</h4>
                      <p className="text-[9px] text-gray-500 leading-tight mb-2">{prod.desc}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-orange-600 font-bold text-[13px]">Rp {(prod.price).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleBeliProduk(prod)} 
                      className={`px-3 py-2 text-xs font-bold text-white rounded-xl transition-colors ${stokPabrik > 0 && saldo >= prod.price ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'}`}
                    >
                      Beli
                    </button>
                  </div>
                ))}
              </div>

              {/* Status Stok Global & Tombol Tutup */}
              <div className="pt-3 shrink-0 border-t border-gray-100">
                <p className="text-[10px] text-center text-gray-500 mb-3 font-medium">Stok Unit Tersedia di Pabrik: <span className="font-bold text-orange-600">{stokPabrik} Unit</span></p>
                <button onClick={() => setShowModalToko(false)} className="w-full py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200">
                  Tutup Toko
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Modal Setor & Tarik Lama */}
        {showModalSetor && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full shadow-2xl">
              <h3 className="font-bold text-lg mb-2">Request Jemput</h3>
              <form onSubmit={handleSetor}>
                <input type="number" step="0.1" required value={inputVolume} onChange={(e) => setInputVolume(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4 outline-none focus:border-orange-500 font-bold text-gray-800" placeholder="Contoh: 2.5 L" />
                <div className="flex gap-2"><button type="button" onClick={() => setShowModalSetor(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl">Batal</button><button type="submit" className="flex-1 py-3 text-sm font-bold text-white bg-orange-500 rounded-xl">Kirim</button></div>
              </form>
            </div>
          </div>
        )}
        {showModalTarik && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full shadow-2xl">
              <h3 className="font-bold text-lg mb-2">Tarik Saldo</h3>
              <form onSubmit={handleTarik}>
                <input type="number" min="10000" max={saldo} required value={inputTarik} onChange={(e) => setInputTarik(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4 outline-none focus:border-orange-500 font-bold text-gray-800" placeholder="Minimal Rp 10.000" />
                <div className="flex gap-2"><button type="button" onClick={() => setShowModalTarik(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl">Batal</button><button type="submit" className="flex-1 py-3 text-sm font-bold text-white bg-orange-500 rounded-xl">Tarik</button></div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PenyetorDashboardMobile;