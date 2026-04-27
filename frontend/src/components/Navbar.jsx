import { useState } from 'react';
import { Search, User, Settings, LogOut, ShieldCheck } from 'lucide-react';

export function Navbar({ userName, onSearch, onGoToProfile, onGoToSettings, onGoToAdmin, onLogout }) {
  // State untuk mengontrol pop-up (dropdown) menu profile
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <span className="font-bold text-xl text-gray-900">UNKLAB Hub</span>
          </div>

          {/* Kolom Pencarian */}
          <div className="flex-1 max-w-2xl px-8 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari topik, diskusi, atau pengguna..."
                onChange={(e) => onSearch(e.target.value)} 
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              />
            </div>
          </div>

          {/* Menu Profil Kanan dengan Dropdown */}
          <div className="relative flex items-center gap-4">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {userName ? userName.charAt(0) : <User className="h-5 w-5" />}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{userName}</span>
            </button>

            {/* Pop-up Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-14 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50">
                
                {/* Tombol Panel Admin */}
                <button
                  onClick={() => {
                    if (onGoToAdmin) onGoToAdmin();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-indigo-600 font-semibold hover:bg-indigo-50 flex items-center gap-3 transition-colors"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Panel Admin
                </button>

                <button
                  onClick={() => {
                    onGoToProfile();
                    setIsDropdownOpen(false); // Tutup pop-up setelah diklik
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 flex items-center gap-3 transition-colors"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>

                <button
                  onClick={() => {
                    if (onGoToSettings) onGoToSettings();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 flex items-center gap-3 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Pengaturan
                </button>
                
                <div className="h-px bg-gray-100 my-1"></div>
                
                <button
                  onClick={() => {
                    if (onLogout) onLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
}