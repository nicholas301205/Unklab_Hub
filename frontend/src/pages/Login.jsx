import { useState } from 'react';
import { api } from '../api/api';
import gridBg from '../assets/login-background.png'; 

export default function Login({ onLoginSuccess, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State for role, default to 'user'
  const [role, setRole] = useState('user'); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending role with other credentials
      const response = await api.post('/auth/login', { email, password, role });
      
      // onLoginSuccess now ideally accepts role info from the backend
      onLoginSuccess({ ...response.data.user, role });
    } catch (err) {
      alert(err.response?.data?.error || "Email atau Password Salah!");
    }
  };

  return (
    // 2. Kontainer utama dengan latar belakang gambar gelap, cover penuh, dan perataan tengah
    <div 
      className="min-h-screen flex items-center justify-center px-4 bg-gray-950 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${gridBg})` }}
    >
      {/* 3. Kartu Login Transparan Buram (Glassmorphism Effect) */}
      <div className="bg-gray-900/70 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-800">
        
        {/* 4. Bagian Header dengan Teks Judul dan Subtitle yang Lebih Terang */}
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-100">UNKLAB Hub</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 5. Dropdown dengan Latar Belakang Gelap dan Teks Terang */}
          <select 
            value={role} 
            onChange={e => setRole(e.target.value)}
            className="w-full p-4 border border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-800 text-gray-100 text-sm"
          >
            <option value="user">Login sebagai User</option>
            <option value="admin">Login sebagai Admin</option>
          </select>

          {/* 6. Input Fields dengan Latar Belakang Gelap, Teks Terang, dan Placeholder Abu-abu */}
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-4 border border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-800 text-gray-100 placeholder-gray-500 text-sm" 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 border border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-800 text-gray-100 placeholder-gray-500 text-sm" 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          
          {/* 7. Tombol "Masuk" yang Membulat Penuh (rounded-full) dengan Teks Putih Tebal */}
          <button 
            type="submit" 
            className="w-full bg-indigo-500 text-white py-4 rounded-full font-bold hover:bg-indigo-600 transition"
          >
            Masuk
          </button>
        </form>
        
        {/* 8. Teks Footer dengan Warna Terang dan Tautan yang Menarik */}
        <p className="mt-6 text-center text-gray-400 text-sm">
          Belum punya akun? <button onClick={onSwitch} className="text-indigo-400 font-bold hover:underline">Daftar sekarang</button>
        </p>
      </div>
    </div>
  );
}