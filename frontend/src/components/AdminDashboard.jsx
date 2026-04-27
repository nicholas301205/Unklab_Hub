import { useState } from 'react';
import { LayoutDashboard, FileText, AlertTriangle, Users, Trash2, ArrowLeft } from 'lucide-react';

export function AdminDashboard({ onExit }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-50 w-full z-50 fixed top-0 left-0">
      {/* Sidebar Admin */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <div className="bg-indigo-500 h-8 w-8 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            Admin Panel
          </h2>
        </div>
        
        <nav className="flex-1 mt-6">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${activeTab === 'dashboard' ? 'bg-slate-800 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('posts')}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${activeTab === 'posts' ? 'bg-slate-800 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'}`}
          >
            <FileText className="h-5 w-5" />
            Kelola Diskusi
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${activeTab === 'users' ? 'bg-slate-800 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'}`}
          >
            <Users className="h-5 w-5" />
            Data Pengguna
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-800 transition-colors ${activeTab === 'reports' ? 'bg-slate-800 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'}`}
          >
            <AlertTriangle className="h-5 w-5" />
            Laporan
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onExit} 
            className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full px-2 py-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Keluar Mode Admin
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-8">
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Ringkasan Sistem</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users className="h-6 w-6" /></div>
                  <div>
                    <p className="text-sm text-gray-500">Total Pengguna</p>
                    <p className="text-2xl font-bold text-gray-900">1,248</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><FileText className="h-6 w-6" /></div>
                  <div>
                    <p className="text-sm text-gray-500">Total Diskusi</p>
                    <p className="text-2xl font-bold text-gray-900">8,432</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 text-red-600 rounded-lg"><AlertTriangle className="h-6 w-6" /></div>
                  <div>
                    <p className="text-sm text-gray-500">Laporan Menunggu</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Kelola Diskusi</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center text-gray-500 py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>Tabel daftar diskusi akan muncul di sini.</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Data Pengguna</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center text-gray-500 py-12">
              <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>Tabel daftar pengguna akan muncul di sini.</p>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Laporan Konten</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center text-gray-500 py-12">
              <AlertTriangle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>Daftar postingan yang dilaporkan pengguna akan muncul di sini.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}