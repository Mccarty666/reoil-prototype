import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { FiX, FiDroplet, FiArrowRight, FiCreditCard, FiSmartphone, FiPlusCircle } from 'react-icons/fi';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liter, setLiter] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Harga per liter (misal: Rp 7.000 / Liter)
  const hargaPerLiter = 7000; 

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (liter < 3) {
      setErrorMsg('Minimal penjemputan 3 Liter agar kurir bisa jalan.');
      return;
    }
    alert(`Berhasil! Request penjemputan ${liter} Liter sedang diproses.`);
    setIsModalOpen(false);
    setLiter('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-10 font-poppins">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-10">
        
        {/* HERO SECTION: Mirip Aplikasi Keuangan (Fokus ke Saldo) */}
        <section className="relative bg-gradient-to-br from-primary to-orange-400 rounded-[2rem] p-8 md:p-12 text-white shadow-xl overflow-hidden">
          {/* Elemen Dekorasi Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <p className="text-orange-100 font-medium mb-1 text-lg">Saldo Penghasilan Jelantah</p>
              <h2 className="text-5xl md:text-6xl font-bold mb-2 tracking-tight">Rp 125.000</h2>
              <p className="text-orange-50 font-medium bg-white bg-opacity-20 inline-block px-4 py-1 rounded-full text-sm mt-2">
                Setara dengan penyelamatan ±17 Liter
              </p>
            </div>

            {/* Tombol Aksi Utama */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto bg-white text-primary px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-lg flex items-center justify-center gap-3"
            >
              <FiPlusCircle className="text-2xl" />
              Setor Jelantah Baru
            </button>
          </div>
        </section>

        {/* METRIK CEPAT & STATUS PENJEMPUTAN */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Info Status Penjemputan */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-green-500 rounded-l-3xl"></div>
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-2xl"><FiDroplet /></div>
            <div className="flex-1">
              <h4 className="font-bold text-dark text-lg">Kurir Menuju Lokasi</h4>
              <p className="text-sm text-gray-500 mt-1">Penjemputan 5 Liter (Estimasi tiba: 12:45)</p>
            </div>
            <div className="hidden sm:block text-green-500 font-bold bg-green-50 px-3 py-1 rounded-full text-sm">Aktif</div>
          </div>

          {/* Opsi Pencairan Dana */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-dark text-lg">Cairkan Saldo</h4>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 border border-gray-200 py-3 rounded-2xl font-semibold text-gray-700 hover:border-primary hover:text-primary transition flex justify-center items-center gap-2">
                <FiSmartphone /> E-Wallet
              </button>
              <button className="flex-1 border border-gray-200 py-3 rounded-2xl font-semibold text-gray-700 hover:border-primary hover:text-primary transition flex justify-center items-center gap-2">
                <FiCreditCard /> Rek. Bank
              </button>
            </div>
          </div>
        </section>

        {/* RIWAYAT TRANSAKSI UANG & JELANTAH */}
        <section className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-dark">Riwayat Transaksi</h3>
            <a href="#" className="text-primary font-semibold hover:underline flex items-center gap-1">
              Lihat Semua <FiArrowRight />
            </a>
          </div>
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Item Riwayat 1 */}
            <div className="flex justify-between items-center p-6 border-b border-gray-50 hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 text-primary flex items-center justify-center text-xl">
                  <FiDroplet />
                </div>
                <div>
                  <h5 className="font-bold text-dark text-lg">Setor Jelantah 5 Liter</h5>
                  <p className="text-sm text-gray-500">15 Sep 2026 • Selesai</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-500 text-lg">+ Rp 35.000</p>
              </div>
            </div>

            {/* Item Riwayat 2 */}
            <div className="flex justify-between items-center p-6 border-b border-gray-50 hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xl">
                  <FiSmartphone />
                </div>
                <div>
                  <h5 className="font-bold text-dark text-lg">Tarik Saldo ke GoPay</h5>
                  <p className="text-sm text-gray-500">10 Sep 2026 • Berhasil</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-dark text-lg">- Rp 50.000</p>
              </div>
            </div>

            {/* Item Riwayat 3 */}
            <div className="flex justify-between items-center p-6 hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 text-primary flex items-center justify-center text-xl">
                  <FiDroplet />
                </div>
                <div>
                  <h5 className="font-bold text-dark text-lg">Setor Jelantah 3.5 Liter</h5>
                  <p className="text-sm text-gray-500">02 Sep 2026 • Selesai</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-500 text-lg">+ Rp 24.500</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL / POP-UP PENJADWALAN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-dark bg-opacity-60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => { setIsModalOpen(false); setErrorMsg(''); }}
              className="absolute top-6 right-6 text-gray-400 hover:text-dark text-2xl"
            >
              <FiX />
            </button>
            
            <h3 className="text-2xl font-bold mb-2 text-dark">Setor Jelantah</h3>
            <p className="text-gray-500 mb-6 text-sm">Masukkan estimasi liter minyak. Semakin banyak, semakin besar uang yang didapat.</p>
            
            <form onSubmit={handleRequestSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Estimasi Volume (Liter)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.5"
                    value={liter}
                    onChange={(e) => setLiter(e.target.value)}
                    placeholder="Misal: 5"
                    className="w-full bg-[#F8F9FA] border border-gray-200 rounded-2xl p-4 pr-16 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xl font-semibold"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">Liter</div>
                </div>
                {errorMsg && <p className="text-red-500 text-sm mt-2 font-medium">{errorMsg}</p>}
                
                {/* Estimasi Pendapatan Real-time */}
                {liter >= 3 && (
                  <p className="text-green-600 font-semibold text-sm mt-3 bg-green-50 p-3 rounded-xl border border-green-100">
                    Estimasi Pendapatan: Rp {(liter * hargaPerLiter).toLocaleString('id-ID')}
                  </p>
                )}
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2">Titik Penjemputan</label>
                <textarea 
                  rows="2"
                  className="w-full bg-[#F8F9FA] border border-gray-200 rounded-2xl p-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                  placeholder="Detail alamat..."
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary text-white font-bold text-lg py-4 rounded-2xl hover:bg-orange-600 transition shadow-lg shadow-orange-200"
              >
                Panggil Kurir Sekarang
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;