import { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, Shield, CheckCircle } from 'lucide-react';

export function SettingsPage({ onBack }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password minimal 8 karakter';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password harus mengandung huruf kecil';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password harus mengandung huruf besar';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password harus mengandung angka';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validasi
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Semua field harus diisi');
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Password baru dan konfirmasi password tidak cocok');
      return;
    }

    if (currentPassword === newPassword) {
      setError('Password baru tidak boleh sama dengan password lama');
      return;
    }

    // Panggilan API biasanya diletakkan di sini
    console.log('Mengubah password...');

    // Simulasi sukses
    setSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
              <p className="text-sm text-gray-600">Kelola keamanan akun Anda</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Change Password Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Ganti Password</h2>
              <p className="text-sm text-gray-600">Perbarui password untuk keamanan akun Anda</p>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800">Password berhasil diubah!</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-2">
                Password Saat Ini
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                  placeholder="Masukkan password saat ini"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                Password Baru
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                  placeholder="Masukkan password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                  placeholder="Masukkan ulang password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Persyaratan Password:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  Minimal 8 karakter
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${/(?=.*[a-z])/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  Mengandung huruf kecil
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${/(?=.*[A-Z])/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  Mengandung huruf besar
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${/(?=.*\d)/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  Mengandung angka
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2"
              >
                <Lock className="h-5 w-5" />
                Ubah Password
              </button>
            </div>
          </form>
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">💡 Tips Keamanan</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Gunakan password yang unik dan tidak digunakan di tempat lain</li>
            <li>• Jangan bagikan password Anda kepada siapa pun</li>
            <li>• Ubah password secara berkala untuk keamanan tambahan</li>
            <li>• Hindari menggunakan informasi pribadi yang mudah ditebak</li>
          </ul>
        </div>
      </div>
    </div>
  );
}