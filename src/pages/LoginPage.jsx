import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const result = login(email, password);
    
    if (result.success) {
      navigate('/'); 
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-poppins sm:py-6">
      <div className="w-full max-w-[400px] bg-white sm:rounded-[2rem] sm:border sm:border-gray-200 sm:shadow-2xl min-h-screen sm:min-h-[800px] flex flex-col relative p-6">
        
        <div className="mt-12 mb-8">
          <div className="w-14 h-14 bg-green-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.315 48.315 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang</h1>
          <p className="text-sm text-gray-500">Masuk untuk melanjutkan ke ReOil.</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="flex-1 flex flex-col">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-green-500 text-sm font-medium" placeholder="Masukkan email" />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-green-500 text-sm font-medium" placeholder="Masukkan password" />
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl shadow-lg shadow-gray-900/20 active:scale-95 transition-transform">
              Masuk
            </button>
            <p className="text-xs text-center text-gray-500 mt-4 font-medium">
              Belum punya akun? <Link to="/register" className="text-green-600 font-bold hover:underline">Daftar sekarang</Link>
            </p>
            
            {/* Info untuk dosen/penguji */}
            <div className="mt-8 p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
              <p className="text-[9px] text-slate-400 font-medium">INFO LOGIN DEFAULT</p>
              <p className="text-[10px] text-slate-600 font-bold mt-1">Admin: admin@reoil.com | Pass: admin</p>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;