import axios from 'axios';

// Instance axios untuk konfigurasi global
export const api = axios.create({
  baseURL: 'http://localhost:8081/api', // Port 8081 sesuai log backend lu
  withCredentials: true, // WAJIB: Agar cookie token (JWT) dikirim balik ke backend
});

// Helper untuk fungsi Auth
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (username, email, password) => {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

// Fungsi untuk update data profil ke database
export const updateProfile = async (userId, userData) => {
  // userData isinya bisa { username, email, bio, dll }
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};
