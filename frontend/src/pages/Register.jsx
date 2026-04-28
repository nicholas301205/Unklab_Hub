import { useState } from 'react';
import { api } from '../api/api';
import gridBg from '../assets/login-background.png';

export default function Register({ onSwitch }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert("Registrasi Berhasil! Silakan Login.");
      onSwitch(); // Balik ke halaman login
    } catch (err) {
      alert(err.response?.data?.error || "Gagal Daftar");
    }
  };

  return (
  <div 
    className="min-h-screen flex items-center justify-center px-4 bg-gray-950 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${gridBg})` }}
  >
    <div className="bg-gray-900/70 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-800">
      
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-100">
        UNKLAB Hub
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          className="w-full p-4 border border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-800 text-gray-100 placeholder-gray-500 text-sm"
          onChange={e => setFormData({ ...formData, username: e.target.value })}
          required
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 border border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-800 text-gray-100 placeholder-gray-500 text-sm"
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 border border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-800 text-gray-100 placeholder-gray-500 text-sm"
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-4 rounded-full font-bold hover:bg-green-600 transition"
        >
          Daftar
        </button>
      </form>

      <p className="mt-6 text-center text-gray-400 text-sm">
        Sudah punya akun?{" "}
        <button
          onClick={onSwitch}
          className="text-indigo-400 font-bold hover:underline"
        >
          Masuk di sini
        </button>
      </p>
    </div>
  </div>
);
}