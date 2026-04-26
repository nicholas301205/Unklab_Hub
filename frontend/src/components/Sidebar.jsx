import { Home, TrendingUp, Star, Bookmark, User, Plus } from 'lucide-react';

export function Sidebar({ activeMenu, onMenuClick, onCreatePost }) {
  const menuItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'teratas', label: 'Teratas', icon: Star },
    { id: 'bookmark', label: 'Bookmark', icon: Bookmark },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4">
        {/* Create Post Button */}
        <button
          onClick={onCreatePost}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 flex items-center justify-center gap-2 mb-6"
        >
          <Plus className="h-5 w-5" />
          Buat Diskusi
        </button>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onMenuClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Categories */}
        <div className="mt-8">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Kategori Popular
          </h3>
          <div className="space-y-1">
            {['Akademik', 'Organisasi', 'Olahraga', 'Teknologi'].map((category) => (
              <button
                key={category}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                #{category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}