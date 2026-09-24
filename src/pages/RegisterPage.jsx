import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('penyetor'); // Default role
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const result = register(name, email, password, role);
    
    if (result.success) {
      navigate('/'); // Redirect ke dashboard sesuai role otomatis
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-poppins sm:py-6">
      <div className="w-full max-w-[400px] bg-white sm:rounded-[2rem] sm:border sm:border-gray-200 sm:shadow-2xl min-h-screen sm:min-h-[800px] flex flex-col relative p-6">
        
        <div className="mt-8 mb-6">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Akun Baru</h1>
          <p className="text-sm text-gray-500 mt-1">Bergabung dengan ekosistem DropOil.</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold mb-4">{error}</div>}

        <form onSubmit={handleRegister} className="flex-1 flex flex-col">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Nama Lengkap</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-green-500 text-sm font-medium" placeholder="Contoh: Riandra" />
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-green-500 text-sm font-medium" placeholder="email@contoh.com" />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-green-500 text-sm font-medium" placeholder="Minimal 6 karakter" />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Pilih Peran (Role)</label>
              <div className="grid grid-cols-3 gap-2">
                <div onClick={() => setRole('penyetor')} className={`cursor-pointer rounded-xl p-3 text-center border-2 transition-all ${role === 'penyetor' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-100 bg-white text-gray-400 hover:bg-gray-50'}`}>
                  <div className="text-xl mb-1"></div>
                  <p className="text-[10px] font-bold">Warga</p>
                </div>
                <div onClick={() => setRole('pengepul')} className={`cursor-pointer rounded-xl p-3 text-center border-2 transition-all ${role === 'pengepul' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-100 bg-white text-gray-400 hover:bg-gray-50'}`}>
                  <div className="text-xl mb-1"></div>
                  <p className="text-[10px] font-bold">Kurir</p>
                </div>
                <div onClick={() => setRole('pendaur')} className={`cursor-pointer rounded-xl p-3 text-center border-2 transition-all ${role === 'pendaur' ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-100 bg-white text-gray-400 hover:bg-gray-50'}`}>
                  <div className="text-xl mb-1"></div>
                  <p className="text-[10px] font-bold">Pabrik</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-500/30 active:scale-95 transition-transform">
              Daftar Sekarang
            </button>
            <p className="text-xs text-center text-gray-500 mt-4 font-medium">
              Sudah punya akun? <Link to="/login" className="text-green-600 font-bold hover:underline">Masuk di sini</Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
};

export default RegisterPage;