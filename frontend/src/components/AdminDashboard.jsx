import { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, AlertTriangle, Users, Trash2, ArrowLeft, X, Search } from 'lucide-react'; 
import { api } from '../api/api'; 

export function AdminDashboard({ onExit }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [stats, setStats] = useState({ users: 0, posts: 0, reports: 0 });
  const [userList, setUserList] = useState([]);
  const [postList, setPostList] = useState([]);

  const [postSearchTerm, setPostSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // STATE MODAL ZOOM GAMBAR
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:8081${path}`; 
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const openImageModal = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const postsRes = await api.get('/posts');
        const postsData = postsRes.data.data || [];
        setPostList(postsData);

        let usersData = [];
        try {
          const usersRes = await api.get('/admin/users'); 
          usersData = usersRes.data.data || [];
          setUserList(usersData);
        } catch (err) {
          console.warn("Gagal mengambil data user.");
        }

        setStats({
          users: usersData.length,
          posts: postsData.length,
          reports: 0
        });

      } catch (error) {
        console.error("Gagal mengambil data statistik admin:", error);
      }
    };

    fetchAdminStats();
  }, []);

  const handleDeletePost = async (id) => {
    if (window.confirm("Yakin menghapus diskusi ini? Konten & gambar akan hilang secara permanen.")) {
      try {
        await api.delete(`/posts/${id}`);
        setPostList(prevList => prevList.filter(post => (post.id || post.ID) !== id));
        alert("Diskusi berhasil dihapus dari database.");
      } catch (error) {
        console.error("Gagal hapus diskusi:", error);
        alert(error.response?.data?.message || "Gagal menghapus diskusi. Cek koneksi atau backend.");
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Yakin menghapus user ini? Semua data terkait user ini akan hilang secara permanen.")) {
      try {
        await api.delete(`/admin/users/${id}`);
        setUserList(prevList => prevList.filter(user => (user.id || user.ID) !== id));
        alert("User telah dihapus!");
      } catch (error) {
        console.error("Gagal menghapus user:", error);
        alert("Gagal menghapus user. Pastikan endpoint DELETE /admin/users/:id sudah benar.");
      }
    }
  };

  const filteredPosts = postList.filter((post) => {
    const searchLower = postSearchTerm.toLowerCase();
    const titleMatch = (post.title || '').toLowerCase().includes(searchLower);
    const contentMatch = (post.content || '').toLowerCase().includes(searchLower);
    const authorMatch = (post.user?.username || post.User?.Username || post.user?.name || post.username || post.author || '').toLowerCase().includes(searchLower);
    return titleMatch || contentMatch || authorMatch;
  });

  const filteredUsers = userList.filter((user) => {
    const searchLower = userSearchTerm.toLowerCase();
    const nameMatch = (user.username || user.name || '').toLowerCase().includes(searchLower);
    const emailMatch = (user.email || '').toLowerCase().includes(searchLower);
    return nameMatch || emailMatch;
  });

  return (
    <div className="flex h-screen bg-gray-50 w-full z-50 fixed top-0 left-0">
      {/* Sidebar Admin */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-6">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <div className="bg-indigo-500 h-8 w-8 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white font-bold">A</span>
            </div>
            Admin Panel
          </h2>
        </div>
        
        <nav className="flex-1 mt-6">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-all ${activeTab === 'dashboard' ? 'bg-slate-800 border-l-4 border-indigo-500 text-white' : 'text-slate-400 border-l-4 border-transparent'}`}>
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </button>
          <button onClick={() => setActiveTab('posts')} className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-all ${activeTab === 'posts' ? 'bg-slate-800 border-l-4 border-indigo-500 text-white' : 'text-slate-400 border-l-4 border-transparent'}`}>
            <FileText className="h-5 w-5" />
            Kelola Diskusi
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-slate-800 transition-all ${activeTab === 'users' ? 'bg-slate-800 border-l-4 border-indigo-500 text-white' : 'text-slate-400 border-l-4 border-transparent'}`}>
            <Users className="h-5 w-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Data Pengguna & Admin</span>
          </button>
          <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-all ${activeTab === 'reports' ? 'bg-slate-800 border-l-4 border-indigo-500 text-white' : 'text-slate-400 border-l-4 border-transparent'}`}>
            <AlertTriangle className="h-5 w-5" />
            Laporan
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={onExit} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full px-2 py-2">
            <ArrowLeft className="h-5 w-5" />
            Keluar Mode Admin
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-8 bg-gray-50 relative">
        
        {/* TAB DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-300">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Ringkasan Sistem</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              {/* Card Pengguna */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><Users className="h-6 w-6" /></div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Pengguna</p>
                  {/* 🔥 Cuma hitung user yang role-nya BUKAN admin 🔥 */}
                  <p className="text-2xl font-bold text-gray-900">
                    {userList.filter(user => user.role?.toLowerCase() !== 'admin').length}
                  </p>
                </div>
              </div>
              
              {/* Card Diskusi */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl"><FileText className="h-6 w-6" /></div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Diskusi</p>
                  <p className="text-2xl font-bold text-gray-900">{postList.length}</p>
                </div>
              </div>

              {/* Card Laporan */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-4 bg-red-50 text-red-600 rounded-xl"><AlertTriangle className="h-6 w-6" /></div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Laporan Menunggu</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB POSTS / DISKUSI */}
        {activeTab === 'posts' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Kelola Diskusi</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Cari diskusi atau user..." 
                  value={postSearchTerm}
                  onChange={(e) => setPostSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none w-64 shadow-sm"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                    <th className="p-4 font-semibold">ID</th>
                    <th className="p-4 font-semibold">Pembuat</th>
                    <th className="p-4 font-semibold">Kategori</th>
                    <th className="p-4 font-semibold">Tanggal</th>
                    <th className="p-4 font-semibold">Detail Diskusi</th>
                    <th className="p-4 font-semibold">Gambar</th>
                    <th className="p-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => {
                      const fullImageUrl = getImageUrl(post.image_url || post.image);
                      return (
                        <tr key={post.id || post.ID} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 text-sm text-gray-500">#{post.id || post.ID}</td>
                          <td className="p-4 text-sm font-bold text-gray-800">
                            {post.user?.username || post.User?.Username || post.User?.username || post.user?.name || post.username || post.author || 'User'}
                          </td>
                          <td className="p-4 text-sm">
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
                              {post.category || 'UMUM'}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-500">
                            {formatDate(post.created_at || post.CreatedAt)}
                          </td>
                          <td className="p-4">
                            <div className="max-w-[250px]">
                              <p className="text-sm font-bold text-gray-800 truncate">{post.title || '-'}</p>
                              <p className="text-xs text-gray-500 truncate mt-1">{post.content || '-'}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            {fullImageUrl ? (
                              <img 
                                src={fullImageUrl} 
                                alt="Thumbnail" 
                                onClick={() => openImageModal(fullImageUrl)}
                                className="h-12 w-20 object-cover rounded shadow-sm border border-gray-200 hover:scale-110 transition-transform origin-left cursor-pointer"
                              />
                            ) : (
                              <span className="text-xs text-gray-400 italic">Tanpa gambar</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleDeletePost(post.id || post.ID)} 
                              className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                              title="Hapus Diskusi"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-gray-400">
                        {postSearchTerm ? `Tidak ditemukan diskusi untuk "${postSearchTerm}".` : 'Belum ada diskusi.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB USERS / PENGGUNA */}
        {activeTab === 'users' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Data Pengguna & Admin</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Cari username atau email..." 
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none w-64 shadow-sm"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                    <th className="p-4 font-semibold">ID</th>
                    <th className="p-4 font-semibold">Username / Email</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id || user.ID} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 text-sm text-gray-500">#{user.id || user.ID}</td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800">
                              {user.username || user.name || 'Tanpa Nama'}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5">
                              {user.email || 'Tidak ada email'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-sm">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.role?.toLowerCase() === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button onClick={() => handleDeleteUser(user.id || user.ID)} className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-400">
                        {userSearchTerm ? `Tidak ditemukan user "${userSearchTerm}".` : 'Belum ada data pengguna.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB REPORTS */}
        {activeTab === 'reports' && (
          <div className="animate-in fade-in duration-300">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Laporan Konten</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center text-gray-500 py-12">
              <AlertTriangle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>Fitur report belum dibuat di backend.</p>
            </div>
          </div>
        )}

        {/* MODAL ZOOM GAMBAR */}
        {isImageModalOpen && selectedImageUrl && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] animate-in fade-in" 
            onClick={closeImageModal} 
          >
            <div className="relative p-2" onClick={(e) => e.stopPropagation()}> 
              <button 
                onClick={closeImageModal}
                className="absolute -top-10 right-0 p-2 text-white/70 hover:text-white transition-colors bg-black/40 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
              
              <img 
                src={selectedImageUrl} 
                alt="Zoomed" 
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl border-2 border-white/10"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}