import { useState } from 'react';
import { Camera, Save, X, User, FileText, Mail, Calendar, Edit2 } from 'lucide-react';
import { PostCard } from './PostCard';
import { updateProfile } from '../api/api'; 

export function ProfilePage({ currentUser, posts, onClose, onBookmark, onAddComment, onDeletePost, onUpdateSuccess }) {
  const [isEditing, setIsEditing] = useState(false);
  
  const [username, setUsername] = useState(currentUser?.username || '');
  const [displayName, setDisplayName] = useState(currentUser?.username || ''); 
  // 🔥 TAGLINE UDAH GW HAPUS DARI STATE 🔥
  const [bio, setBio] = useState(currentUser?.bio || '');
  
  const [profileImage] = useState(currentUser?.avatar || '');
  const [imagePreview, setImagePreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null); 
  
  const [email] = useState(currentUser?.email || '');
  const [joinDate] = useState(
    currentUser?.created_at 
      ? new Date(currentUser.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) 
      : ''
  );

  const [activeTab, setActiveTab] = useState('diskusi_saya');

  const myPosts = posts ? posts.filter(p => p.user && p.user.username === currentUser?.username) : [];
  const bookmarkedPosts = posts ? posts.filter(p => p.isBookmarked) : [];
  const displayedPosts = activeTab === 'diskusi_saya' ? myPosts : bookmarkedPosts;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file); 
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('bio', bio);
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const result = await updateProfile(currentUser.id, formData);

      alert('Profil berhasil diperbarui di database!');
      setIsEditing(false);
      setImagePreview('');

      if (onUpdateSuccess) {
        onUpdateSuccess(result.data);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Gagal menyimpan ke database');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImagePreview('');
    setAvatarFile(null);
    setUsername(currentUser?.username || '');
    setDisplayName(currentUser?.username || '');
    setBio(currentUser?.bio || '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-48 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-lg hover:bg-gray-100 shadow-sm transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md -mt-20 relative">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              
              {/* Profile Picture */}
              <div className="relative -mt-16">
                <div className="w-32 h-32 bg-indigo-600 rounded-full border-4 border-white flex items-center justify-center overflow-hidden">
                  {imagePreview || profileImage ? (
                    <img
                      src={imagePreview || (profileImage.startsWith('http') ? profileImage : `http://localhost:8081${profileImage}`)}
                      alt={username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-700 shadow-lg transition-transform hover:scale-105">
                    <Camera className="h-5 w-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    {/* 🔥 KOLOM INPUT TAGLINE UDAH DIMUSNAHKAN DARI SINI 🔥 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-gray-900">{displayName || username}</h1>
                    <p className="text-gray-600">@{username}</p>
                    
                    {/* 🔥 TAMPILAN TAGLINE UDAH DIMUSNAHKAN DARI SINI 🔥 */}
                    {bio && <p className="text-gray-600 mt-2">{bio}</p>}
                  </>
                )}
              </div>

              {/* Edit/Save Button */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm"
                    >
                      <Save className="h-5 w-5" />
                      Simpan
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    <Edit2 className="h-5 w-5" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* STATS & INFO */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-5 w-5" />
                    <span className="text-sm">{email}</span>
                  </div>
                )}
                {joinDate && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-5 w-5" />
                    <span className="text-sm">Bergabung {joinDate}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm font-medium">{myPosts.length} Diskusi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
              <button 
                onClick={() => setActiveTab('diskusi_saya')}
                className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'diskusi_saya' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Diskusi Saya
              </button>
              <button 
                onClick={() => setActiveTab('bookmark')}
                className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'bookmark' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Bookmark
              </button>
            </nav>
          </div>

          <div className="mt-6 space-y-4 pb-8">
            {displayedPosts.length > 0 ? (
              displayedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onBookmark={onBookmark}
                  onAddComment={onAddComment}
                  onDeletePost={onDeletePost}
                  onPostClick={() => {}}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500">
                  {activeTab === 'diskusi_saya' 
                    ? 'Kamu belum membuat diskusi apapun.' 
                    : 'Belum ada diskusi yang kamu simpan.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}