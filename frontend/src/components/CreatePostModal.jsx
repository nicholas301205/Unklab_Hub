import { useState, useRef } from 'react';
import { X, Image as ImageIcon, Send } from 'lucide-react';
import { createPost } from '../api/api';

export function CreatePostModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Akademik'); // State baru untuk Kategori (Default: Akademik)
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef(null);

  // Daftar kategori (Tanpa 'Semua' karena ini buat bikin post)
  const categories = ['Akademik', 'Organisasi', 'Olahraga', 'Teknologi'];

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Judul dan isi diskusi tidak boleh kosong, twin!");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category); // Kirim kategori yang dipilih ke Golang
      
      if (imageFile) {
        formData.append('image', imageFile); 
      }

      const result = await createPost(formData);
      
      alert("Diskusi berhasil dibuat!");
      
      // Bersihkan form
      setTitle('');
      setContent('');
      setCategory('Akademik'); // Reset ke default
      setImageFile(null);
      setImagePreview('');
      
      if (onSuccess) {
        onSuccess(result.data);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Gagal membuat diskusi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden">
        {/* Header Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Buat Diskusi Baru</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Judul Diskusi</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Apa yang ingin kamu diskusikan?"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
              disabled={isLoading}
            />
          </div>

          {/* Kategori Dropdown */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition cursor-pointer"
              disabled={isLoading}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Isi Diskusi</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ceritakan lebih detail di sini..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none resize-none transition"
              disabled={isLoading}
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Lampiran Gambar (Opsional)</label>
            {imagePreview ? (
              <div className="relative w-full h-40 rounded-xl border border-gray-200 overflow-hidden group">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(''); }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-6 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
              >
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="font-medium">Klik untuk upload gambar</span>
              </button>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          </div>

          {/* Footer Modal */}
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition shadow-lg shadow-indigo-200"
            >
              <Send className="w-4 h-4" />
              {isLoading ? 'Memposting...' : 'Posting Diskusi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}