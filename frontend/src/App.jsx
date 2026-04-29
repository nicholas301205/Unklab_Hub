import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage'; 
import { PostCard } from './components/PostCard';
import { CreatePostModal } from './components/CreatePostModal'; 
import { AdminDashboard } from './components/AdminDashboard'; 
import Login from './pages/Login';
import Register from './pages/Register';
import { api, getBookmarks, addBookmark, removeBookmark, addComment, deletePost, reportPost } from './api/api';

export default function App() {
  // --- 1. STATE INITIALIZATION ---
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('isLoggedIn') === 'true';
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState(() => {
    try {
      const savedLogin = localStorage.getItem('isLoggedIn');
      return savedLogin === 'true' ? 'beranda' : 'login';
    } catch {
      return 'login';
    }
  });

  const [posts, setPosts] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Semua'); 
  const [searchQuery, setSearchQuery] = useState('');

  // --- 2. FETCH DATA POSTINGAN & BOOKMARK ---
  useEffect(() => {
    if (isLoggedIn && currentUser?.username) {
      Promise.all([
        api.get('/posts'),
        getBookmarks().catch(() => ({ data: [] })) 
      ])
      .then(([postsRes, bookmarksRes]) => {
        const myBookmarks = bookmarksRes.data || [];
        const bookmarkedPostIds = myBookmarks.map(b => b.post_id);

        const mapped = postsRes.data.data.map(p => ({
          id: p.id,
          user: { 
            name: p.user.username, 
            username: p.user.username, 
            avatar: p.user.avatar 
          }, 
          title: p.title,
          content: p.content,
          category: p.category || "Akademik",
          timestamp: new Date(p.created_at).toLocaleDateString('id-ID'),
          isBookmarked: bookmarkedPostIds.includes(p.id), 
          comments: p.comments || [], 
          image: p.image_url ? `http://localhost:8081${p.image_url}` : null 
        }));
        setPosts(mapped);
      })
      .catch(err => {
        console.error("Gagal sinkronisasi data:", err);
        if (err.response?.status === 401) handleLogout();
      });
    }
  }, [isLoggedIn, currentUser]);

  // --- 3. AUTH & PROFILE HANDLERS ---
  const handleLoginSuccess = (userData) => {
    if (!userData) return;
    setCurrentUser(userData);
    setIsLoggedIn(true);
    setCurrentView('beranda');
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentView('login');
  };

  const handleUpdateUser = (updatedData) => {
    if (!updatedData) return;
    const newUser = { ...currentUser, ...updatedData };
    setCurrentUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // --- 4. POST INTERACTION HANDLERS ---
  const handlePostCreated = (newPost) => {
    const formattedPost = {
      id: newPost.id,
      user: { name: currentUser.username, username: currentUser.username, avatar: currentUser.avatar },
      title: newPost.title,
      content: newPost.content,
      category: newPost.category || "Akademik",
      timestamp: new Date().toLocaleDateString('id-ID'),
      isBookmarked: false,
      comments: [],
      image: newPost.image_url ? `http://localhost:8081${newPost.image_url}` : null 
    };
    setPosts([formattedPost, ...posts]);
  };

  const handleBookmark = async (postId) => {
    const postToUpdate = posts.find(p => p.id === postId);
    if (!postToUpdate) return;
    const isCurrentlyBookmarked = postToUpdate.isBookmarked;

    setPosts(posts.map(p => p.id === postId ? { ...p, isBookmarked: !isCurrentlyBookmarked } : p));
    
    try {
      if (isCurrentlyBookmarked) {
        await removeBookmark(postId); 
      } else {
        await addBookmark(postId); 
      }
    } catch (err) {
      setPosts(posts.map(p => p.id === postId ? { ...p, isBookmarked: isCurrentlyBookmarked } : p));
      alert("Gagal update bookmark: " + (err.response?.data?.error || "Koneksi bermasalah"));
    }
  };

  const handleAddComment = async (postId, text) => {
    try {
      const res = await addComment(postId, text);
      const newComment = res.data?.data || res.data; 
      
      setPosts(prevPosts => prevPosts.map(p => {
        if (p.id === postId) {
          return { ...p, comments: [...(p.comments || []), newComment] };
        }
        return p;
      }));
    } catch (err) {
      console.error("Gagal tambah komentar:", err);
      alert("Gagal mengirim komentar: " + (err.response?.data?.error || "Koneksi bermasalah"));
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Yakin mau hapus diskusi ini?")) return;
    try {
      await deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      alert("Gagal menghapus: " + (err.response?.data?.error || "Koneksi bermasalah"));
    }
  };

  const handleReport = async (postId, reason) => {
    try {
      await reportPost(postId, reason);
    } catch (err) {
      console.error('Report failed', err);
      throw err;
    }
  };

  // --- 5. RENDER LOGIC (FILTERING) ---
  
  let displayedPosts = posts;

  if (currentView === 'bookmark') {
    displayedPosts = posts.filter(p => p.isBookmarked);
  }

  if (currentView === 'beranda' && activeCategory !== 'Semua') {
    displayedPosts = posts.filter(p => p.category === activeCategory);
  }

  if (searchQuery.trim() !== '') {
    const lowerQuery = searchQuery.toLowerCase();
    displayedPosts = displayedPosts.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) || 
      p.content.toLowerCase().includes(lowerQuery) ||
      p.user.name.toLowerCase().includes(lowerQuery)
    );
  }

  // --- 6. RENDER HALAMAN ---

  // Jika belum login, tampilkan Login/Register
  if (!isLoggedIn) {
    return currentView === 'register' 
      ? <Register onSwitch={() => setCurrentView('login')} /> 
      : <Login onLoginSuccess={handleLoginSuccess} onSwitch={() => setCurrentView('register')} />;
  }

  if (currentUser?.role === 'admin') {
    return <AdminDashboard onExit={handleLogout} />;
  }

  // Jika role-nya 'user' (atau lainnya), tampilkan halaman Dashboard User biasa
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar 
        userName={currentUser?.username} 
        userAvatar={currentUser?.avatar} 
        onSearch={setSearchQuery} 
        onGoToProfile={() => setCurrentView('profile')} 
        onGoToSettings={() => setCurrentView('pengaturan')} 
        onLogout={handleLogout} 
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        <div className="hidden md:block w-64 flex-shrink-0">
          <Sidebar 
            activeMenu={currentView} 
            onMenuClick={(v) => {
              setCurrentView(v);
              setSearchQuery(''); 
            }} 
            onCreatePost={() => setIsCreateModalOpen(true)}
            activeCategory={activeCategory} 
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              setSearchQuery(''); 
            }} 
          />
        </div>
        
        <main className="flex-1">
          {currentView === 'profile' ? (
            <ProfilePage 
              currentUser={currentUser} 
              posts={posts} 
              onUpdateSuccess={handleUpdateUser}
              onClose={() => setCurrentView('beranda')}
              onBookmark={handleBookmark} 
              onAddComment={handleAddComment}
              onDeletePost={handleDeletePost}
              onReport={handleReport}
            />
          ) : currentView === 'pengaturan' ? (
            <SettingsPage onBack={() => setCurrentView('beranda')} />
          ) : (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                {searchQuery !== ''
                  ? `Hasil pencarian: "${searchQuery}"` 
                  : currentView === 'bookmark' 
                    ? 'Diskusi Tersimpan' 
                    : activeCategory === 'Semua' 
                      ? 'Beranda Diskusi' 
                      : `Diskusi: ${activeCategory}`
                }
              </h1>
              
              {displayedPosts.length > 0 ? (
                displayedPosts.map(p => (
                  <PostCard 
                    key={p.id} 
                    post={p} 
                    currentUser={currentUser} 
                    onBookmark={handleBookmark}
                    onAddComment={handleAddComment}
                    onDeletePost={handleDeletePost}
                    onReport={handleReport}
                  />
                ))
              ) : (
                <div className="p-10 text-center bg-white rounded-xl border border-gray-100 text-gray-400">
                  {searchQuery !== ''
                    ? 'Tidak ada diskusi yang cocok dengan pencarian kamu.'
                    : currentView === 'bookmark' 
                      ? 'Belum ada diskusi yang kamu simpan.' 
                      : 'Belum ada diskusi di kategori ini.'}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={handlePostCreated} 
      />
    </div>
  );
}