import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Penyetor'); // Default awal diubah ke Penyetor
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = register(name, email, password, role);
      
      if (result.success) {
        setTimeout(() => {
          navigate('/', { replace: true }); 
        }, 500);
      } else {
        setError(result.message);
        setIsLoading(false);
      }
    } catch (err) {
      setError('Terjadi kesalahan pada sistem.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-poppins sm:p-6">
      
      {/* Container utama (Dibatasi lebarnya agar seperti layar HP) */}
      <div className="w-full max-w-[400px] bg-white sm:rounded-[2rem] sm:shadow-2xl overflow-hidden flex flex-col min-h-screen sm:min-h-[800px] relative">
        
        {/* Header Melengkung dengan Branding */}
        <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 pb-12 text-center rounded-b-[2.5rem] relative shadow-md">
          {/* Ornamen Glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-400/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-1 tracking-tight">DropOil</h1>
            <p className="text-green-100/90 text-sm font-medium">Ubah Jelantah Jadi Berkah</p>
          </div>
        </div>

        {/* Area Form */}
        <div className="p-6 flex-1 flex flex-col -mt-8 relative z-10">
          
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 mb-6">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-gray-900">Buat Akun Baru</h2>
              <p className="text-gray-500 text-xs mt-1">Lengkapi data untuk memulai.</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-xs font-bold mb-5 flex items-start gap-2 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Input Nama */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-1 uppercase tracking-wider">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                  </div>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 block p-3 pl-10 transition-all outline-none" placeholder="John Doe" />
                </div>
              </div>
              
              {/* Input Email */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-1 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  </div>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 block p-3 pl-10 transition-all outline-none" placeholder="nama@email.com" />
                </div>
              </div>
              
              {/* Input Password */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-1 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                  </div>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 block p-3 pl-10 transition-all outline-none" placeholder="••••••••" />
                </div>
              </div>

              {/* Dropdown Role yang Sudah Diperbarui */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-1 uppercase tracking-wider">Peran</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                  </div>
                  <select value={role} onChange={(e) => setRole(e.target.value)} disabled={isLoading} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 block p-3 pl-10 transition-all outline-none appearance-none font-medium cursor-pointer">
                    <option value="Penyetor">Penyetor</option>
                    <option value="Pengepul">Pengepul</option>
                    <option value="Pendaur Ulang">Pendaur Ulang</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-auto pb-4">
            <button onClick={handleRegister} disabled={isLoading} className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl shadow-lg shadow-gray-900/20 active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center">
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : 'Daftar Sekarang'}
            </button>
            <p className="text-xs text-center text-gray-500 mt-5 font-medium">
              Sudah punya akun? <Link to="/login" className="text-green-600 font-bold hover:underline">Masuk</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;