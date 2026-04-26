import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { PostCard } from '../components/PostCard';
import { CreatePostModal } from '../components/CreatePostModal';

// Dummy data untuk demonstrasi
const dummyPosts = [
  {
    id: 1,
    user: {
      name: 'Sarah Wijaya',
      username: 'sarahw',
    },
    title: 'Halo semua! Aku yang baru kuliah di UNKLAB tahun ini',
    content: 'Halo teman-teman! Perkenalkan nama aku Sarah. Aku mahasiswa baru di prodi Teknik Informatika. Ada yang bisa kasih tips buat survive semester pertama? Terutama soal organisasi yang recommended buat diikuti. Thanks!',
    timestamp: '2 jam lalu',
    likes: 24,
    comments: 8,
    isBookmarked: false,
  },
  {
    id: 2,
    user: {
      name: 'Rudi Harrison',
      username: 'rudiharrison',
    },
    title: 'Tips Coding untuk Pemula',
    content: 'Halo! Untuk kalian yang baru belajar coding, jangan takut untuk membuat kesalahan. Debugging adalah bagian dari proses belajar. Beberapa tips dari pengalaman aku:\n\n1. Konsisten practice setiap hari\n2. Ikuti tutorial tapi jangan copy paste, ketik manual\n3. Join komunitas coding\n4. Build project kecil-kecil\n\nAda yang mau nambahin tips lainnya?',
    timestamp: '5 jam lalu',
    likes: 42,
    comments: 15,
    isBookmarked: true,
  },
  {
    id: 3,
    user: {
      name: 'Maria Tanaka',
      username: 'mariatanaka',
    },
    title: 'Info Lomba Debat Bahasa Inggris',
    content: 'Hai guys! Ada info nih buat yang suka debat. Kampus kita akan mengadakan kompetisi debat bahasa Inggris tingkat regional. Pendaftaran dibuka sampai akhir bulan ini. Hadiah juara 1 lumayan banget! Siapa yang mau ikut? 🏆',
    timestamp: '1 hari lalu',
    likes: 18,
    comments: 6,
    isBookmarked: false,
  },
];

export default function App() {
  const [activeMenu, setActiveMenu] = useState('beranda');
  const [posts, setPosts] = useState(dummyPosts);
  const [sortBy, setSortBy] = useState('latest');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = dummyPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.content.toLowerCase().includes(query.toLowerCase())
      );
      setPosts(filtered);
    } else {
      setPosts(dummyPosts);
    }
  };

  const handleBookmark = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post
      )
    );
  };

  const handlePostClick = (postId) => {
    console.log('Navigate to post:', postId);
    // Navigation logic akan ditambahkan nanti
  };

  const handleCreatePost = (title, content, image) => {
    const newPost = {
      id: posts.length + 1,
      user: {
        name: 'Current User',
        username: 'currentuser',
      },
      title,
      content,
      image: image ? URL.createObjectURL(image) : undefined,
      timestamp: 'Baru saja',
      likes: 0,
      comments: 0,
      isBookmarked: false,
    };
    setPosts([newPost, ...posts]);
  };

  const handleSort = () => {
    const newSort = sortBy === 'latest' ? 'popular' : 'latest';
    setSortBy(newSort);

    const sorted = [...posts].sort((a, b) => {
      if (newSort === 'popular') {
        return b.likes - a.likes;
      }
      return 0; // Latest order (default)
    });
    setPosts(sorted);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar onSearch={handleSearch} userName="John Doe" />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          activeMenu={activeMenu}
          onMenuClick={setActiveMenu}
          onCreatePost={() => setIsCreateModalOpen(true)}
        />

        {/* Main Content */}
        <main className="flex-1 max-w-4xl mx-auto p-6">
          {/* Sort Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeMenu === 'beranda' && 'Beranda'}
              {activeMenu === 'trending' && 'Trending'}
              {activeMenu === 'teratas' && 'Teratas'}
              {activeMenu === 'bookmark' && 'Bookmark Saya'}
              {activeMenu === 'profile' && 'Profile'}
            </h2>
            <button
              onClick={handleSort}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {sortBy === 'latest' ? 'Terbaru' : 'Terpopuler'}
              </span>
            </button>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onBookmark={handleBookmark}
                  onPostClick={handlePostClick}
                />
              ))
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-500">Tidak ada diskusi ditemukan</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}