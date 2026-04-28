import { useState } from 'react';
import { Search, User, Settings, LogOut, ShieldCheck } from 'lucide-react';

export function Navbar({ userName, userAvatar, onSearch, onGoToProfile, onGoToSettings, onGoToAdmin, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Helper untuk merapikan URL Avatar
  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:8081${path}`;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-md">
              <span className="text-white font-black text-xl italic">U</span>
            </div>
            <span className="font-black text-xl text-gray-900 tracking-tight">UNKLAB Hub</span>
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
                onChange={(e) => onSearch && onSearch(e.target.value)} 
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              />
            </div>
          </div>

          {/* Bagian Kanan: Menu Profil */}
          <div className="relative flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:bg-gray-50 px-2 sm:px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-gray-200"
            >
              {/* LOGIKA AVATAR NAVBAR */}
              <div className="h-8 w-8 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-50 shadow-sm">
                {userAvatar ? (
                  <img src={getAvatarUrl(userAvatar)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  userName ? userName.charAt(0).toUpperCase() : <User className="h-5 w-5" />
                )}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-sm font-bold text-gray-700 block leading-tight">{userName || 'User'}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Mahasiswa</span>
              </div>
            </button>

            {/* Pop-up Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-14 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50">
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
                    if (onGoToProfile) onGoToProfile();
                    setIsDropdownOpen(false); 
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