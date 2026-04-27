import { useState } from 'react';
import { X } from 'lucide-react';

export function CreatePostModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // 1. TAMBAH STATE UNTUK KATEGORI (Default-nya kita set ke 'Akademik')
  const [category, setCategory] = useState('Akademik');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (title.trim() === '' || content.trim() === '') {
      alert("Judul dan isi diskusi harus diisi!");
      return;
    }

    // 2. KIRIM CATEGORY BERSAMA TITLE DAN CONTENT
    onSubmit(title, content, category); 
    
    // 3. KOSONGKAN FORM TERMASUK KATEGORI
    setTitle('');
    setContent('');
    setCategory('Akademik');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Buat Diskusi Baru</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            
            {/* Input Judul */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Diskusi</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
                placeholder="Apa yang ingin Anda diskusikan?"
              />
            </div>

            {/* 4. INPUT DROPDOWN KATEGORI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
              >
                <option value="Akademik">#Akademik</option>
                <option value="Organisasi">#Organisasi</option>
                <option value="Olahraga">#Olahraga</option>
                <option value="Teknologi">#Teknologi</option>
              </select>
            </div>

            {/* Input Konten */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Isi Diskusi</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
                placeholder="Ceritakan lebih detail..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Posting
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}