import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Fungsi untuk berinteraksi dengan LocalStorage secara aman
const getDB = (key, defaultVal) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setDB = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    // Trigger event agar komponen lain tahu localStorage berubah
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.error("Gagal menyimpan ke LocalStorage:", error);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Inisialisasi awal saat aplikasi dimuat
  useEffect(() => {
    const initAuth = () => {
      const users = getDB('DropOil_users', []);
      
      // Buat akun sistem default jika database kosong
      if (users.length === 0) {
        setDB('DropOil_users', [{ 
          id: '1',
          name: 'Sistem Pusat', 
          email: 'admin@dropoil.com', 
          password: 'admin', 
          role: 'Pendaur Ulang' // Role sudah disesuaikan dengan aturan baru
        }]);
      }
      
      // Ambil sesi login saat ini
      const currentSession = getDB('DropOil_session', null);
      if (currentSession) {
        setUser(currentSession);
      }
      setIsInitializing(false);
    };

    initAuth();
  }, []);

  const login = (email, password) => {
    const users = getDB('DropOil_users', []);
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      setDB('DropOil_session', foundUser);
      return { success: true, user: foundUser };
    }
    return { success: false, message: 'Email atau password salah!' };
  };

  const register = (name, email, password, role) => {
    const users = getDB('DropOil_users', []);
    
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'Email sudah terdaftar!' };
    }

    const newUser = { 
      id: Date.now().toString(), // Beri ID unik
      name, 
      email, 
      password, 
      role 
    };

    users.push(newUser);
    setDB('DropOil_users', users);
    
    // Otomatis login setelah daftar
    setUser(newUser);
    setDB('DropOil_session', newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('DropOil_session');
    window.dispatchEvent(new Event("storage"));
  };

  // Jangan render anak-anaknya (aplikasi) sampai pengecekan awal selesai
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-poppins text-green-700 font-bold">
        Memuat DropOil...
      </div>
    );
  }

  return (
    // Mengekspor `user` sekaligus `currentUser` agar tidak terjadi error bentrok variabel di halaman lain
    <AuthContext.Provider value={{ user, currentUser: user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);