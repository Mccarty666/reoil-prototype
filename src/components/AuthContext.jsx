import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Helper Database
const getDB = (key, defaultVal) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};
const setDB = (key, val) => localStorage.setItem(key, JSON.stringify(val));

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getDB('DropOil_session', null));

  // Seed Data: Buat akun Admin otomatis jika belum ada pengguna sama sekali
  useEffect(() => {
    const users = getDB('DropOil_users', []);
    if (users.length === 0) {
      setDB('DropOil_users', [{ 
        name: 'Admin Utama', 
        email: 'admin@DropOil.com', 
        password: 'admin', 
        role: 'admin' 
      }]);
    }
  }, []);

  const login = (email, password) => {
    const users = getDB('DropOil_users', []);
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      setDB('DropOil_session', foundUser);
      return { success: true };
    }
    return { success: false, message: 'Email atau password salah!' };
  };

  const register = (name, email, password, role) => {
    const users = getDB('DropOil_users', []);
    
    // Cek apakah email sudah terdaftar
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email sudah terdaftar!' };
    }

    const newUser = { name, email, password, role };
    users.push(newUser);
    setDB('DropOil_users', users);
    
    // Otomatis login setelah berhasil daftar
    setUser(newUser);
    setDB('DropOil_session', newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('DropOil_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);