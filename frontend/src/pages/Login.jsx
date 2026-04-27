import { useState } from 'react';
import { api } from '../api/api';

export default function Login({ onLoginSuccess, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      // response.data.user isinya id, username, email dari MySQL
      onLoginSuccess(response.data.user);
    } catch (err) {
      alert(err.response?.data?.error || "Email atau Password Salah!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">UNKLAB Hub</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
            onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
            onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">Masuk</button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Belum punya akun? <button onClick={onSwitch} className="text-indigo-600 font-bold hover:underline">Daftar sekarang</button>
        </p>
      </div>
    </div>
  );
}