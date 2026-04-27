import { useState } from 'react';
import { MessageSquare, Bookmark, MoreHorizontal, Send, Trash2, Flag } from 'lucide-react'; 

// 1. TANGKAP currentUser DI SINI
export function PostCard({ post, currentUser, onBookmark, onPostClick, onAddComment, onDeletePost }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;
    
    onAddComment(post.id, newComment);
    setNewComment('');
  };

  const commentCount = post.commentsData ? post.commentsData.length : 0;

  // 2. CEK APAKAH INI POSTINGAN MILIK SENDIRI
  const isMyPost = currentUser && post.user.username === currentUser.username;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
            {post.user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900">{post.user.name}</h3>
              <span className="text-gray-400 text-sm">@{post.user.username}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-400 text-sm">{post.timestamp}</span>
            </div>
            {post.category && (
              <span className="inline-block mt-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                #{post.category}
              </span>
            )}
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-colors"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-10">
              
              {/* 3. TAMPILKAN TOMBOL HAPUS HANYA JIKA isMyPost == TRUE */}
              {isMyPost && (
                <button
                  onClick={() => {
                    onDeletePost(post.id);
                    setIsMenuOpen(false); 
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus Diskusi
                </button>
              )}

              <button
                onClick={() => {
                  alert('Postingan telah dilaporkan ke admin.');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
              >
                <Flag className="h-4 w-4" />
                Laporkan
              </button>
            </div>
          )}
        </div>

      </div>

      <div className="cursor-pointer" onClick={() => onPostClick(post.id)}>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-600 mb-4">{post.content}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex gap-6">
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm">{commentCount}</span>
          </button>
        </div>
        <button 
          onClick={() => onBookmark(post.id)}
          className={`transition-colors ${post.isBookmarked ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
        >
          <Bookmark className={`h-5 w-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          
          <div className="space-y-4 mb-4">
            {post.commentsData && post.commentsData.map((comment) => (
              <div key={comment.id} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                  {comment.user.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm text-gray-900">{comment.user.name}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5">{comment.text}</p>
                </div>
              </div>
            ))}
            {commentCount === 0 && (
              <p className="text-sm text-gray-500 text-center italic">Belum ada komentar. Jadilah yang pertama!</p>
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tulis komentar..."
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              type="submit"
              disabled={newComment.trim() === ''}
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}