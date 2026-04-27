import { useState } from 'react';
import { Camera, Save, X, User, FileText, Mail, Calendar, Edit2 } from 'lucide-react';
import { PostCard } from './PostCard';

export function ProfilePage({ onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('johndoe');
  const [displayName, setDisplayName] = useState('John Doe');
  const [tagline, setTagline] = useState('Mahasiswa Teknik Informatika | Tech Enthusiast');
  const [bio, setBio] = useState('Suka coding dan belajar hal baru. Always open for collaboration!');
  const [profileImage, setProfileImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [email] = useState('john.doe@unklab.ac.id');
  const [joinDate] = useState('Januari 2024');

  // Dummy user posts
  const userPosts = [
    {
      id: 1,
      user: {
        name: displayName,
        username: username,
      },
      title: 'Pengalaman Pertama Belajar React',
      content: 'Sharing pengalaman aku belajar React dari nol. Awalnya susah banget tapi setelah practice terus akhirnya mulai paham konsep component, state, dan props.',
      timestamp: '3 hari lalu',
      likes: 15,
      comments: 5,
      isBookmarked: false,
    },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log('Saving profile:', { username, displayName, tagline, bio, profileImage });
    setIsEditing(false);
    // Here you would make API call to update profile
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImagePreview('');
    // Reset to original values if needed
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-48 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md -mt-20 relative">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              {/* Profile Picture */}
              <div className="relative -mt-16">
                <div className="w-32 h-32 bg-indigo-600 rounded-full border-4 border-white flex items-center justify-center overflow-hidden">
                  {imagePreview || profileImage ? (
                    <img
                      src={imagePreview || profileImage}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-700 shadow-lg">
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
                    {/* Display Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
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

                    {/* Tagline */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="Deskripsikan dirimu dalam satu kalimat"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
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
                    <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                    <p className="text-gray-600">@{username}</p>
                    <p className="text-gray-700 mt-2">{tagline}</p>
                    <p className="text-gray-600 mt-2">{bio}</p>
                  </>
                )}
              </div>

              {/* Edit/Save Button */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                    >
                      <Save className="h-5 w-5" />
                      Simpan
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    <Edit2 className="h-5 w-5" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Stats & Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-5 w-5" />
                  <span className="text-sm">{email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">Bergabung {joinDate}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm font-medium">12 Diskusi</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">45 Followers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
              <button className="py-4 px-1 border-b-2 border-indigo-600 font-medium text-indigo-600">
                Diskusi Saya
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Bookmark
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Aktivitas
              </button>
            </nav>
          </div>

          {/* User Posts */}
          <div className="mt-6 space-y-4 pb-8">
            {userPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onBookmark={() => {}}
                onPostClick={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}