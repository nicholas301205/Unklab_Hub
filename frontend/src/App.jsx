import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ProfilePage } from './components/ProfilePage';
import { PostCard } from './components/PostCard';
import Login from './pages/Login';
import Register from './pages/Register';
import { api } from './api/api';

export default function App() {
  // --- STATE DENGAN PROTEKSI ---
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      // Pastikan data user ada dan bukan string "undefined"
      return savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true' ? 'beranda' : 'login';
  });

  const [posts, setPosts] = useState([]);

  // --- FETCH DATA SAAT LOGIN ---
  useEffect(() => {
    if (isLoggedIn && currentUser?.username) {
      api.get('/posts')
        .then(res => {
          const mapped = res.data.data.map(p => ({
            id: p.id,
            user: { name: p.user.username, username: p.user.username },
            title: p.title,
            content: p.content,
            category: "Teknologi",
            timestamp: new Date(p.created_at).toLocaleDateString('id-ID'),
            isBookmarked: false,
            image: p.image_url ? `http://localhost:8081${p.image_url}` : null 
          }));
          setPosts(mapped);
        })
        .catch(err => {
          console.error("Gagal ambil post:", err);
        });
    }
  }, [isLoggedIn, currentUser]);

  // --- HANDLERS ---
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

  // --- LOGIC RENDER ---

  // Proteksi: Jika data user ilang tapi status login true, paksa logout
  if (isLoggedIn && !currentUser) {
    handleLogout();
    return null;
  }

  // Tampilan sebelum login
  if (!isLoggedIn) {
    return currentView === 'register' 
      ? <Register onSwitch={() => setCurrentView('login')} /> 
      : <Login onLoginSuccess={handleLoginSuccess} onSwitch={() => setCurrentView('register')} />;
  }

  // Tampilan sesudah login (Dashboard)
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        userName={currentUser?.username} 
        onGoToProfile={() => setCurrentView('profile')} 
        onLogout={handleLogout} 
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        <div className="hidden md:block w-64 flex-shrink-0">
          <Sidebar 
            activeMenu={currentView} 
            onMenuClick={(v) => setCurrentView(v)} 
          />
        </div>
        
        <main className="flex-1">
          {currentView === 'profile' ? (
            <ProfilePage 
              currentUser={currentUser} 
              posts={posts} 
              onUpdateSuccess={handleUpdateUser}
              onClose={() => setCurrentView('beranda')}
              onBookmark={() => {}} 
              onAddComment={() => {}}
              onDeletePost={(id) => setPosts(posts.filter(p => p.id !== id))}
            />
          ) : (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">Beranda Diskusi</h1>
              {posts.length > 0 ? (
                posts.map(p => <PostCard key={p.id} post={p} currentUser={currentUser} />)
              ) : (
                <div className="p-10 text-center bg-white rounded-xl border border-gray-100 text-gray-400">
                  Belum ada diskusi tersedia...
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}