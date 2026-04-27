import { useState } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ProfilePage } from './components/ProfilePage';
import { CreatePostModal } from './components/CreatePostModal';
import { PostCard } from './components/PostCard';
import { SettingsPage } from './components/SettingsPage';

export default function App() {
  const [currentView, setCurrentView] = useState('beranda');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  // 1. TAMBAH STATE UNTUK PENCARIAN
  const [searchQuery, setSearchQuery] = useState('');

  const currentUser = {
    name: "John Doe",
    username: "johndoe"
  };

  const [posts, setPosts] = useState([
    {
      id: 1,
      user: currentUser,
      title: "Selamat datang di UNKLAB Hub!",
      content: "Ini adalah tampilan beranda utama. Silakan buat diskusi baru.",
      category: "Akademik", 
      timestamp: "Baru saja",
      likes: 0,
      commentsData: [],
      isBookmarked: false
    }
  ]);

  const handleAddNewPost = (title, content, category) => {
    const newPost = {
      id: Date.now(),
      user: currentUser,
      title: title,
      content: content,
      category: category,
      timestamp: "Baru saja",
      likes: 0,
      commentsData: [],
      isBookmarked: false
    };

    setPosts([newPost, ...posts]);
    setIsModalOpen(false); 
  };

  const handleToggleBookmark = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, isBookmarked: !post.isBookmarked };
      }
      return post;
    }));
  };

  const handleAddComment = (postId, commentText) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: Date.now(),
          user: currentUser,
          text: commentText,
          timestamp: "Baru saja"
        };
        return { ...post, commentsData: [...post.commentsData, newComment] };
      }
      return post;
    }));
  };

  const handleDeletePost = (postId) => {
    const confirmDelete = window.confirm("Apakah kamu yakin ingin menghapus diskusi ini?");
    if (confirmDelete) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  // 2. LOGIKA FILTER GABUNGAN (Kategori, Bookmark, dan PENCARIAN)
  let displayedPosts = posts;

  // Filter Kategori & Bookmark
  if (currentView === 'bookmark') {
    displayedPosts = posts.filter(post => post.isBookmarked);
  } else if (currentView === 'beranda') {
    if (selectedCategory !== 'Semua') {
      displayedPosts = posts.filter(post => post.category === selectedCategory);
    }
  }

  // Filter Pencarian (Berjalan jika searchQuery tidak kosong)
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    displayedPosts = displayedPosts.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.content.toLowerCase().includes(query)
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* JIKA currentView ADALAH 'admin', TAMPILKAN ADMIN DASHBOARD FULL SCREEN */}
      {currentView === 'admin' && (
        <AdminDashboard onExit={() => setCurrentView('beranda')} />

      )}
      <Navbar 
        userName={currentUser.name} 
        onSearch={(query) => setSearchQuery(query)}
        onGoToProfile={() => setCurrentView('profile')} 
        onGoToSettings={() => setCurrentView('settings')}
        onLogout={() => alert('Fitur Logout akan segera datang!')}
        onGoToAdmin={() => setCurrentView('admin')} 
        onLogout={() => alert('Fitur Logout akan segera datang!')} 
        
      />

      {/* KODE UNTUK MEMUNCULKAN ADMIN DASHBOARD */}
      {currentView === 'admin' && (
        <AdminDashboard onExit={() => setCurrentView('beranda')} />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <div className="hidden md:block w-64 flex-shrink-0">
          <Sidebar 
            activeMenu={currentView}
            onMenuClick={(menuId) => {
              setCurrentView(menuId);
              if (menuId !== 'beranda') setSelectedCategory('Semua'); 
              setSearchQuery(''); // Reset pencarian jika pindah menu
            }}
            onCreatePost={() => setIsModalOpen(true)}
            activeCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setCurrentView('beranda'); 
              setSearchQuery(''); // Reset pencarian jika ganti kategori
            }}
          />
        </div>

        <main className="flex-1">
          {currentView === 'profile' ? (
            <ProfilePage onClose={() => setCurrentView('beranda')} />
          ) : currentView === 'settings' ? (
            <SettingsPage onBack={() => setCurrentView('beranda')} />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {searchQuery.trim() !== '' 
                    ? `Hasil pencarian: "${searchQuery}"` // Ganti judul jika sedang mencari
                    : currentView === 'bookmark' 
                      ? 'Bookmark Tersimpan' 
                      : (selectedCategory === 'Semua' ? 'Beranda Diskusi' : `Diskusi: #${selectedCategory}`)
                  }
                </h1>
              </div>
              
              {displayedPosts.map((postItem) => (
                <PostCard 
                  key={postItem.id}
                  post={postItem}
                  // 1. TAMBAHKAN BARIS INI:
                  currentUser={currentUser} 
                  
                  onBookmark={handleToggleBookmark} 
                  onAddComment={handleAddComment}
                  onDeletePost={handleDeletePost}
                  onPostClick={(id) => console.log('Buka post id:', id)}
                />
              ))}

              {displayedPosts.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                  <p className="text-gray-500">
                    {searchQuery.trim() !== '' 
                      ? `Tidak ada hasil yang cocok dengan "${searchQuery}".`
                      : currentView === 'bookmark'
                        ? 'Belum ada diskusi yang disimpan ke Bookmark.'
                        : 'Belum ada diskusi untuk kategori ini.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <CreatePostModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddNewPost}
      />
    </div>
  );
}