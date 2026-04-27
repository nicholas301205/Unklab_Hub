import { useState } from 'react';
import { api } from '../api/api';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Daftar Akun</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Username" className="w-full p-3 border rounded" onChange={e => setFormData({...formData, username: e.target.value})} required />
          <input type="email" placeholder="Email" className="w-full p-3 border rounded" onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded" onChange={e => setFormData({...formData, password: e.target.value})} required />
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold">Daftar</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Sudah punya akun? <button onClick={onSwitch} className="text-indigo-600 font-medium">Masuk di sini</button>
        </p>
      </div>
    </div>
  );
}