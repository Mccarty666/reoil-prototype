import React, { useState, useEffect } from 'react';
import { 
  FiPlus, FiFileText, FiDownload, FiAward, 
  FiDroplet, FiWind, FiStar, FiPhone, FiMapPin, FiTruck, FiChevronRight, FiShoppingBag,
  FiHome, FiUser, FiBell
} from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// --- CUSTOM ICON LEAFLET ---
const wargaIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3711/3711284.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  className: 'drop-shadow-lg'
});

const kurirIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/7578/7578701.png',
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -45],
  className: 'drop-shadow-lg'
});

const AutoFitBound = ({ rute }) => {
  const map = useMap();
  useEffect(() => {
    if (rute.length > 0) {
      map.fitBounds(L.latLngBounds(rute), { padding: [20, 20], animate: true, duration: 1.5 });
    }
  }, [rute, map]);
  return null;
};

const PenyetorDashboardMobile = () => {
  const [showModalSetor, setShowModalSetor] = useState(false);
  const [showModalTarik, setShowModalTarik] = useState(false);
  const [estimasiVolume, setEstimasiVolume] = useState('');
  const [statusPenjemputan, setStatusPenjemputan] = useState(null);
  const [ruteJalan, setRuteJalan] = useState([]);
  const [activeTab, setActiveTab] = useState('home');

  // Koordinat Bintaro Raya - UPJ
  const posisiWarga = [-6.2926, 106.7254]; 
  const posisiKurir = [-6.2736, 106.7346]; 

  useEffect(() => {
    if (statusPenjemputan === 'menuju') {
      const getRoute = async () => {
        try {
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${posisiKurir[1]},${posisiKurir[0]};${posisiWarga[1]},${posisiWarga[0]}?overview=full&geometries=geojson`);
          const data = await res.json();
          if (data.routes && data.routes[0]) {
            setRuteJalan(data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]));
          }
        } catch (e) { console.error(e); }
      };
      getRoute();
    }
  }, [statusPenjemputan]);

  const [riwayat] = useState([
    { id: 1, tipe: 'setor', deskripsi: 'Setor Jelantah (5 L)', status: 'Berhasil', nominal: 25000, tgl: '18 Sep' },
    { id: 2, tipe: 'beli', deskripsi: 'Sabun Cuci Pakaian', status: 'Selesai', nominal: -15000, tgl: '15 Sep' },
  ]);

  const handleSetor = (e) => {
    e.preventDefault();
    if (estimasiVolume > 0) {
      setStatusPenjemputan('menuju');
      setShowModalSetor(false);
      setEstimasiVolume('');
      // Scroll ke top agar peta terlihat di mobile
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    // pb-24 untuk memberi ruang pada Bottom Navigation Bar
    <main className="w-full bg-[#FAFAFC] min-h-screen pb-24 font-sans max-w-md mx-auto relative shadow-2xl">
      
      {/* APP BAR (Header Mobile) */}
      <header className="bg-white px-5 pt-8 pb-4 sticky top-0 z-40 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Halo, Alyas! 👋</h1>
          <div className="flex items-center gap-1.5 mt-1 text-yellow-600 text-xs font-bold bg-yellow-50 px-2 py-1 rounded-md w-max">
             <FiAward /> Pejuang Lingkungan
          </div>
        </div>
        <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 relative">
          <FiBell className="text-xl" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </header>

      <div className="px-5 mt-5 space-y-6">
        
        {/* KARTU SALDO & AKSI (Layout Vertikal untuk Mobile) */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-400 p-6 rounded-3xl shadow-lg shadow-orange-500/20 text-white relative overflow-hidden">
          <FiDroplet className="absolute -right-4 -bottom-4 text-8xl text-white/10" />
          
          <div className="relative z-10">
            <p className="text-orange-100 text-xs font-semibold tracking-wide uppercase mb-1">Total Saldo</p>
            <h2 className="text-4xl font-black mb-1">Rp 125.000</h2>
            <div className="inline-block bg-white/20 px-2 py-1 rounded text-[10px] font-medium backdrop-blur-sm mb-5">
              + Rp 25.000 bulan ini
            </div>
            
            <div className="flex gap-3">
              <button onClick={() => setShowModalSetor(true)} disabled={statusPenjemputan !== null} 
                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-all ${statusPenjemputan !== null ? 'bg-white/50 text-white/80 cursor-not-allowed' : 'bg-white text-orange-600 active:scale-95 shadow-md'}`}>
                <FiTruck className="text-lg" /> Setor
              </button>
              <button onClick={() => setShowModalTarik(true)} 
                className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm bg-orange-600/50 text-white border border-white/20 active:scale-95">
                <FiDownload className="text-lg" /> Tarik
              </button>
            </div>
          </div>
        </div>

        {/* MAPS TRACKING (Jika Aktif) */}
        {statusPenjemputan === 'menuju' && (
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="px-4 py-3 bg-orange-50/50 border-b border-orange-100 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
              <span className="font-bold text-orange-800 text-xs tracking-wide uppercase">Kurir Menuju Lokasi</span>
            </div>

            <div className="w-full h-48 relative z-0">
              <MapContainer center={posisiWarga} zoom={15} zoomControl={false} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; OSM'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  className="map-tiles"
                />
                <Marker position={posisiWarga} icon={wargaIcon}></Marker>
                <Marker position={posisiKurir} icon={kurirIcon}></Marker>
                {ruteJalan.length > 0 && (
                  <>
                    <Polyline positions={ruteJalan} color="#000000" weight={6} opacity={0.1} />
                    <Polyline positions={ruteJalan} color="#f97316" weight={4} opacity={1} lineCap="round" />
                    <AutoFitBound rute={ruteJalan} />
                  </>
                )}
              </MapContainer>
            </div>

            {/* Info Kurir Ringkas untuk Mobile */}
            <div className="p-4 bg-white relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi&backgroundColor=ffedd5" alt="Kurir" className="w-12 h-12 rounded-full border border-gray-100" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-tight">Budi Santoso</h3>
                  <p className="text-xs font-medium text-gray-500">B 1234 XYZ</p>
                </div>
              </div>
              <div className="text-right">
                <h4 className="text-xl font-black text-orange-500">12<span className="text-xs text-gray-500 font-bold ml-0.5">Min</span></h4>
              </div>
            </div>
            
            <div className="px-4 pb-4 bg-white flex gap-2">
              <button className="flex-1 py-2.5 bg-green-50 text-green-600 font-bold rounded-xl text-sm flex justify-center items-center gap-2"><FiPhone /> Hubungi</button>
              <button onClick={() => setStatusPenjemputan(null)} className="flex-1 py-2.5 bg-gray-900 text-white font-bold rounded-xl text-sm">Selesai</button>
            </div>
          </div>
        )}

        {/* IMPACT STATS HORIZONTAL SCROLL */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 px-1">Dampakmu Bulan Ini</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
            <div className="min-w-[140px] bg-white p-4 rounded-2xl shadow-sm border border-gray-50 snap-start">
              <div className="w-8 h-8 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center mb-2"><FiDroplet /></div>
              <h4 className="text-lg font-black text-gray-900">12.5 L</h4>
              <p className="text-[10px] font-medium text-gray-500 mt-0.5">Minyak Disetor</p>
            </div>
            <div className="min-w-[140px] bg-white p-4 rounded-2xl shadow-sm border border-gray-50 snap-start">
              <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center mb-2"><FiDroplet /></div>
              <h4 className="text-lg font-black text-gray-900">12.5K L</h4>
              <p className="text-[10px] font-medium text-gray-500 mt-0.5">Air Selamat</p>
            </div>
            <div className="min-w-[140px] bg-white p-4 rounded-2xl shadow-sm border border-gray-50 snap-start">
              <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center mb-2"><FiWind /></div>
              <h4 className="text-lg font-black text-gray-900">34 Kg</h4>
              <p className="text-[10px] font-medium text-gray-500 mt-0.5">Emisi Dicegah</p>
            </div>
          </div>
        </div>

        {/* RIWAYAT TERBARU (Versi Compact) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-900">Riwayat Terakhir</h3>
            <button className="text-xs font-bold text-orange-500">Semua</button>
          </div>
          <div className="space-y-3">
            {riwayat.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${item.tipe === 'setor' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    {item.tipe === 'setor' ? <FiPlus /> : <FiShoppingBag />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.deskripsi}</h4>
                    <p className="text-[10px] font-medium text-gray-500">{item.tgl}</p>
                  </div>
                </div>
                <span className={`text-xs font-black ${item.tipe === 'setor' ? 'text-green-600' : 'text-gray-900'}`}>
                  {item.tipe === 'setor' ? '+' : '-'}Rp{(Math.abs(item.nominal))/1000}k
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* BOTTOM NAVIGATION BAR (NATIVE APP FEEL)    */}
      {/* ========================================== */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 rounded-t-3xl px-6 py-3 shadow-[0_-10px_40px_rgb(0,0,0,0.05)] z-40 flex justify-between items-center">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-orange-500' : 'text-gray-400'}`}>
          <FiHome className={`text-xl ${activeTab === 'home' ? 'fill-orange-100' : ''}`} />
          <span className="text-[10px] font-bold">Beranda</span>
        </button>
        <button onClick={() => setActiveTab('riwayat')} className={`flex flex-col items-center gap-1 ${activeTab === 'riwayat' ? 'text-orange-500' : 'text-gray-400'}`}>
          <FiFileText className={`text-xl ${activeTab === 'riwayat' ? 'fill-orange-100' : ''}`} />
          <span className="text-[10px] font-bold">Riwayat</span>
        </button>
        
        {/* Tombol Tengah (Setor/Scan) yang menonjol */}
        <button onClick={() => setShowModalSetor(true)} className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg shadow-orange-500/40 -mt-6 ring-4 ring-white active:scale-95 transition-transform">
          <FiPlus />
        </button>
        
        <button onClick={() => setActiveTab('toko')} className={`flex flex-col items-center gap-1 ${activeTab === 'toko' ? 'text-orange-500' : 'text-gray-400'}`}>
          <FiShoppingBag className={`text-xl ${activeTab === 'toko' ? 'fill-orange-100' : ''}`} />
          <span className="text-[10px] font-bold">Toko</span>
        </button>
        <button onClick={() => setActiveTab('profil')} className={`flex flex-col items-center gap-1 ${activeTab === 'profil' ? 'text-orange-500' : 'text-gray-400'}`}>
          <FiUser className={`text-xl ${activeTab === 'profil' ? 'fill-orange-100' : ''}`} />
          <span className="text-[10px] font-bold">Profil</span>
        </button>
      </div>

      {/* MODAL SETOR (TAMPILAN BOTTOM SHEET UNTUK MOBILE) */}
      {showModalSetor && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[999] flex flex-col justify-end max-w-md mx-auto">
          {/* Area luar untuk menutup modal */}
          <div className="flex-1" onClick={() => setShowModalSetor(false)}></div>
          
          <div className="bg-white rounded-t-[2rem] p-6 pb-10 animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
            
            <h2 className="text-xl font-black text-gray-900 mb-1">Minta Penjemputan</h2>
            <p className="text-gray-500 text-xs font-medium mb-6">Masukkan estimasi liter minyak jelantah Anda.</p>
            
            <form onSubmit={handleSetor}>
              <div className="relative mb-6">
                <input type="number" step="0.1" min="1" required value={estimasiVolume} onChange={(e) => setEstimasiVolume(e.target.value)}
                  className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl focus:border-orange-500 focus:bg-white outline-none text-xl font-bold transition-colors" placeholder="0.0" autoFocus />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Liter</span>
              </div>
              <button type="submit" className="w-full p-4 bg-orange-500 text-white font-bold rounded-2xl active:scale-95 transition-transform shadow-lg shadow-orange-500/30">
                Cari Kurir Sekarang
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CSS Tambahan */}
      <style dangerouslySetInnerHTML={{__html: `
        .map-tiles { filter: brightness(0.95) contrast(1.1) grayscale(0.2); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </main>
  );
};

export default PenyetorDashboardMobile;