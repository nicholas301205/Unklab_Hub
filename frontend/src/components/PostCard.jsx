import { MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

export function PostCard({ post, onBookmark, onPostClick }) {
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark(post.id);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
            {post.user.avatar ? (
              <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full" />
            ) : (
              <span className="text-white font-medium">{post.user.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{post.user.name}</h3>
            <p className="text-sm text-gray-500">@{post.user.username} · {post.timestamp}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div onClick={() => onPostClick(post.id)} className="cursor-pointer">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-3 line-clamp-3">{post.content}</p>

        {/* Image */}
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full rounded-lg mb-3 max-h-96 object-cover"
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-gray-600 hover:text-indigo-600">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{post.comments}</span>
          </button>
          <button
            onClick={handleBookmark}
            className={`flex items-center gap-2 ${
              isBookmarked ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-indigo-600">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}