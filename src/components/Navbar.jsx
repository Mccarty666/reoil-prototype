import React from 'react';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  if (!user) return null; // Jika tidak ada user login, jangan tampilkan navbar

  return (
    <nav className="bg-white shadow-sm px-6 md:px-10 py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-50 gap-4">
      <div className="flex items-center gap-2">
        <div className="bg-primary text-white p-2 rounded-lg font-bold">R</div>
        <h1 className="text-2xl font-semibold text-primary">ReOil</h1>
      </div>
      
      {/* Profil User dari "Database" */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-dark">{user.name}</p>
          <p className="text-xs text-primary capitalize font-semibold">{user.role}</p>
        </div>
        <div className="w-10 h-10 bg-orange-100 text-primary rounded-full flex items-center justify-center text-xl">
          <FiUser />
        </div>
        
        {/* Tombol Logout */}
        <button 
          onClick={logout}
          className="ml-2 bg-gray-100 text-gray-500 p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition"
          title="Logout"
        >
          <FiLogOut />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;