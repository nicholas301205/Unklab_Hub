import { Home, Bookmark, User, Plus } from 'lucide-react';

// TANGKAP activeCategory DAN onSelectCategory DARI APP.JSX
export function Sidebar({ activeMenu, onMenuClick, onCreatePost, activeCategory, onSelectCategory }) {
  const menuItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'bookmark', label: 'Bookmark', icon: Bookmark },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Tambahkan 'Semua' ke dalam daftar pilihan
  const categories = ['Semua', 'Akademik', 'Organisasi', 'Olahraga', 'Teknologi'];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
      
      <button
        onClick={onCreatePost}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors mb-6"
      >
        <Plus className="h-5 w-5" />
        Buat Diskusi
      </button>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onMenuClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
      
      <div className="mt-8">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">
          Kategori Populer
        </h3>
        <div className="space-y-1">
          {categories.map((kategori) => {
            const isActive = activeCategory === kategori && activeMenu === 'beranda';
            
            return (
              <button 
                key={kategori}
                // SAAT DIKLIK, KIRIM NAMA KATEGORI KE APP.JSX
                onClick={() => onSelectCategory(kategori)}
                className={`w-full text-left px-4 py-2.5 text-sm rounded-lg transition-colors ${
                  isActive 
                    ? 'text-indigo-600 bg-indigo-50 font-semibold' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                {kategori === 'Semua' ? 'Tampilkan Semua' : `#${kategori}`}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}