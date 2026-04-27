import { useState } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ProfilePage } from './components/ProfilePage';
import { CreatePostModal } from './components/CreatePostModal';
import { PostCard } from './components/PostCard';
import { SettingsPage } from './components/SettingsPage';

export default function App() {
  // --- STATES ---
  const [currentView, setCurrentView] = useState('beranda');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);

  const currentUser = {
    name: "John Doe",
    username: "johndoe"
  };

  const [posts, setPosts] = useState([
    {
      id: 1,
      user: currentUser,
      title: "Selamat datang di UNKLAB Hub!",
      content: "Ini adalah tampilan beranda utama. Silakan buat diskusi baru atau unggah gambar.",
      category: "Akademik", 
      timestamp: "Baru saja",
      likes: 0,
      commentsData: [],
      isBookmarked: false,
      image: null
    }
  ]);

  // --- HANDLERS (Fungsi-fungsi) ---

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewPostImage(imageUrl);
    }
  };

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
      isBookmarked: false,
      image: newPostImage
    };

    setPosts([newPost, ...posts]);
    setIsModalOpen(false); 
    setNewPostImage(null);
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

  // --- LOGIKA FILTERING ---
  let displayedPosts = posts;

  if (currentView === 'bookmark') {
    displayedPosts = posts.filter(post => post.isBookmarked);
  } else if (currentView === 'beranda') {
    if (selectedCategory !== 'Semua') {
      displayedPosts = posts.filter(post => post.category === selectedCategory);
    }
  }

  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    displayedPosts = displayedPosts.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.content.toLowerCase().includes(query)
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. ADMIN DASHBOARD (Hanya muncul jika state 'admin') */}
      {currentView === 'admin' && (
        <AdminDashboard 
          posts={posts} 
          onDeletePost={handleDeletePost} 
          onExit={() => setCurrentView('beranda')} 
        />
      )}

      {/* 2. NAVBAR */}
      <Navbar 
        userName={currentUser.name} 
        onSearch={(query) => setSearchQuery(query)}
        onGoToProfile={() => setCurrentView('profile')} 
        onGoToSettings={() => setCurrentView('settings')}
        onGoToAdmin={() => setCurrentView('admin')} 
        onLogout={() => alert('Logout Berhasil')} 
      />

      {/* 3. LAYOUT UTAMA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        
        {/* SIDEBAR KIRI */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <Sidebar 
            activeMenu={currentView}
            onMenuClick={(menuId) => {
              setCurrentView(menuId);
              if (menuId !== 'beranda') setSelectedCategory('Semua'); 
              setSearchQuery('');
            }}
            onCreatePost={() => setIsModalOpen(true)}
            activeCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setCurrentView('beranda'); 
              setSearchQuery('');
            }}
          />
        </div>

        {/* AREA KONTEN TENGAH */}
        <main className="flex-1">
          {currentView === 'profile' ? (
            <ProfilePage 
              currentUser={currentUser}
              posts={posts}
              onClose={() => setCurrentView('beranda')} 
              onBookmark={handleToggleBookmark}
              onAddComment={handleAddComment}
              onDeletePost={handleDeletePost}
            />
          ) : currentView === 'settings' ? (
            <SettingsPage onBack={() => setCurrentView('beranda')} />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {searchQuery.trim() !== '' 
                    ? `Hasil pencarian: "${searchQuery}"`
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
                  currentUser={currentUser} 
                  onBookmark={handleToggleBookmark} 
                  onAddComment={handleAddComment}
                  onDeletePost={handleDeletePost}
                  onPostClick={(id) => console.log('Buka post:', id)}
                />
              ))}

              {displayedPosts.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                  <p className="text-gray-500">
                    Tidak ada diskusi yang ditemukan.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* 4. MODAL BUAT DISKUSI */}
      <CreatePostModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setNewPostImage(null);
        }}
        onSubmit={handleAddNewPost}
        newPostImage={newPostImage}
        onImageUpload={handleImageUpload}
        onRemoveImage={() => setNewPostImage(null)}
      />
    </div>
  );
}