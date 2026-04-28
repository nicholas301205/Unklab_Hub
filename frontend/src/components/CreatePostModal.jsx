import { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

export function CreatePostModal({ isOpen, onClose, onSubmit, newPostImage, onImageUpload, onRemoveImage }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Akademik');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    onSubmit(title, content, category);
    
    // Reset form
    setTitle('');
    setContent('');
    setCategory('Akademik');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-white/20">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Buat Diskusi Baru</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body Modal */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            
            <input
              type="text"
              placeholder="Judul Diskusi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg font-semibold px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            
            <textarea
              placeholder="Tuliskan detail diskusi kamu di sini..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 resize-none px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            {/* PREVIEW GAMBAR JIKA ADA */}
            {newPostImage && (
              <div className="relative inline-block mt-2">
                <img src={newPostImage} alt="Preview" className="h-40 rounded-lg object-cover border border-gray-200" />
                <button 
                  type="button"
                  onClick={onRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-md transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Footer Modal */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              
              {/* KATEGORI DIKEMBALIKAN KE MILIKMU */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Akademik">Akademik</option>
                <option value="Organisasi">Organisasi</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Teknologi">Teknologi</option>
              </select>

              {/* TOMBOL UPLOAD GAMBAR */}
              <div>
                <input 
                  type="file" 
                  id="image-upload" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={onImageUpload}
                />
                <label 
                  htmlFor="image-upload" 
                  className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 cursor-pointer transition-colors px-3 py-2 rounded-lg hover:bg-indigo-50"
                >
                  <ImageIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Foto</span>
                </label>
              </div>
            </div>

            <button 
              type="submit"
              disabled={!title.trim() || !content.trim()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              Posting
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
