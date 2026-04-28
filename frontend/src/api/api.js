import axios from 'axios';

// Instance axios untuk konfigurasi global
export const api = axios.create({
  baseURL: 'http://localhost:8081/api', // Port backend Golang lu
  withCredentials: true, // Biar cookie (kalo pake) kekirim
});

// --- FUNGSI AUTH ---
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

// --- FUNGSI USER & POST ---
export const updateProfile = async (userId, formData) => {
  const response = await api.put(`/users/${userId}`, formData);
  return response.data;
};

export const createPost = async (formData) => {
  const response = await api.post('/posts', formData);
  return response.data;
};

// 👇 INI YANG BIKIN ERROR BLANK SCREEN KEMARIN, SEKARANG UDAH GW TAMBAHIN 👇
export const deletePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
};

// --- FUNGSI BOOKMARK ---

// 👇 INI FUNGSI YANG DICARI-CARI SAMA REACT TAPI GAK ADA 👇
export const getBookmarks = async () => {
  const response = await api.get('/bookmarks');
  return response.data;
};

export const addBookmark = async (postId) => {
  // Pake parseInt biar dikirim sebagai angka
  const response = await api.post('/bookmarks', { post_id: parseInt(postId, 10) });
  return response.data;
};

export const removeBookmark = async (postId) => {
  const response = await api.delete(`/bookmarks/${postId}`);
  return response.data;
};

// --- FUNGSI KOMENTAR ---
export const addComment = async (postId, text) => {
  const response = await api.post('/comments', { 
    post_id: parseInt(postId, 10), 
    content: text 
  });
  return response.data;
};