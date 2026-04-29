import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { ProfilePage } from "../components/ProfilePage";
import { PostCard } from "../components/PostCard";
import { CreatePostModal } from "../components/CreatePostModal";

export default function Dashboard() {
  const [currentView, setCurrentView] = useState("beranda");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. BUAT STATE UNTUK MENYIMPAN DAFTAR POSTINGAN
  // Kita isi dengan satu data awal (dummy)
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: { name: "John Doe", username: "johndoe" },
      title: "Selamat datang di UNKLAB Hub!",
      content: "Ini adalah tampilan beranda. Silakan buat diskusi baru.",
      timestamp: "Baru saja",
      likes: 5,
      comments: 2,
      isBookmarked: false
    }
  ]);

  // 2. FUNGSI UNTUK MENAMBAH POSTINGAN BARU
  const handleAddNewPost = (title, content) => {

    console.log("Menerima data dari modal ->", "Judul:", title, "| Isi:", content);
    
    const newPost = {
      id: Date.now(), // Bikin ID unik berdasarkan waktu
      user: { name: "John Doe", username: "johndoe" }, // User yang sedang login
      title: title,
      content: content,
      timestamp: "Baru saja",
      likes: 0,
      comments: 0,
      isBookmarked: false
    };

    // Tambahkan postingan baru ke URUTAN PALING ATAS dari daftar posts
    setPosts([newPost, ...posts]);
    
    // Tutup modal setelah selesai
    setIsModalOpen(false); 
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userName="John Doe"
        onSearch={(q) => console.log("Cari:", q)}
        onGoToProfile={() => setCurrentView("profile")} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <div className="hidden md:block w-64 flex-shrink-0">
          <Sidebar
            activeMenu={currentView}
            onMenuClick={(menu) => setCurrentView(menu)} 
            onCreatePost={() => setIsModalOpen(true)} 
          />
        </div>

        <main className="flex-1">
          {currentView === "profile" ? (
            <ProfilePage onClose={() => setCurrentView("beranda")} />
          ) : (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Beranda Diskusi</h1>
              
              {/* 3. TAMPILKAN SEMUA POSTINGAN DENGAN LOOPING (MAP) */}
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onBookmark={() => console.log("Bookmark diklik untuk post", post.id)}
                  onPostClick={() => console.log("Post diklik", post.id)}
                />
              ))}
              
              {/* Pesan jika belum ada postingan sama sekali */}
              {posts.length === 0 && (
                <p className="text-center text-gray-500 py-10">Belum ada diskusi. Jadilah yang pertama!</p>
              )}
            </div>
          )}
        </main>
      </div>

      <CreatePostModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // 4. HUBUNGKAN FUNGSI SUBMIT KE FUNGSI TAMBAH POSTINGAN DI ATAS
        onSubmit={handleAddNewPost} 
      />
    </div>
  );
}