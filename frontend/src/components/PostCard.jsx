import { useState } from 'react';
import { MessageSquare, Bookmark, Trash2, User, Send } from 'lucide-react';

export function PostCard({ post, currentUser, onBookmark, onAddComment, onDeletePost }) {
  // State untuk buka-tutup kolom komentar & nampung teksnya
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper ngerapihin URL Avatar
  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:8081${path}`;
  };

  // Cek apakah user yang login adalah yang bikin post ini
  const isOwner = currentUser?.username === post.user?.username;

  // Handler saat enter / klik tombol kirim komentar
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (onAddComment) {
        await onAddComment(post.id, commentText);
        setCommentText(''); // Bersihin input kalau sukses
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-indigo-100 transition-colors">
      
      {/* HEADER POSTCARD */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {/* Foto Profil */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-gray-50">
            {post.user?.avatar ? (
              <img src={getAvatarUrl(post.user.avatar)} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              post.user?.username?.charAt(0).toUpperCase() || <User className="w-5 h-5" />
            )}
          </div>
          {/* Info User & Waktu */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-sm">{post.user?.username}</span>
              {post.category && (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded uppercase">
                  {post.category}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">{post.timestamp}</span>
          </div>
        </div>

        {/* TOMBOL DELETE (MUNCUL KALAU DIA OWNERNYA) */}
        {isOwner && onDeletePost && (
          <button 
            onClick={() => onDeletePost(post.id)}
            className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
            title="Hapus Diskusi"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ISI KONTEN */}
      <div className="mb-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{post.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
        
        {/* Gambar jika ada */}
        {post.image && (
          <div className="mt-4 rounded-xl overflow-hidden border border-gray-100">
            <img src={post.image} alt="Post image" className="w-full max-h-96 object-cover" />
          </div>
        )}
      </div>

      {/* TOMBOL AKSI (KOMENTAR & BOOKMARK) */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-50 text-gray-400">
        <button 
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-2 transition-colors text-sm font-medium ${showComments ? 'text-indigo-600' : 'hover:text-indigo-600'}`}
        >
          {/* Warnanya nyala kalau tab komentar lagi dibuka */}
          <MessageSquare className={`w-4 h-4 ${showComments ? 'fill-indigo-50' : ''}`} />
          <span>{post.comments?.length || 0} Komentar</span>
        </button>
        
        <button 
          onClick={() => onBookmark && onBookmark(post.id)}
          className={`flex items-center gap-2 transition-colors text-sm font-medium ${post.isBookmarked ? 'text-indigo-600' : 'hover:text-indigo-600'}`}
        >
          {/* Ikon bakal "terisi" dan tulisan berubah kalau statusnya isBookmarked = true */}
          <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-indigo-600' : ''}`} />
          <span>{post.isBookmarked ? 'Tersimpan' : 'Simpan'}</span>
        </button>
      </div>

      {/* BAGIAN KOMENTAR (MUNCUL KALAU SHOWCOMMENTS = TRUE) */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-50">
          
          {/* List Komentar */}
          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((c, i) => (
                <div key={i} className="flex gap-2 text-sm bg-gray-50 p-3 rounded-xl">
                  <span className="font-bold text-gray-900 whitespace-nowrap">{c.user?.username || 'User'}:</span>
                  <span className="text-gray-700">{c.content}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-2">Belum ada komentar, jadilah yang pertama!</p>
            )}
          </div>

          {/* Form Kirim Komentar */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Tulis komentar..."
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-sm transition"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          
        </div>
      )}

    </div>
  );
}