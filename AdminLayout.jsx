import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function AdminLayout({ children, user, onLogout }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const getModuleTitle = () => {
    if (path.includes('/pages')) return 'Pages';
    if (path.includes('/updates')) return 'News & Events';
    if (path.includes('/achievements')) return 'Achievements';
    if (path.includes('/gallery')) return 'Gallery';
    if (path.includes('/notices')) return 'Notices';
    if (path.includes('/settings')) return 'Settings';
    return 'Dashboard';
  };

  const currentModule = getModuleTitle();

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <h2 className="text-xl font-bold tracking-wide text-emerald-400">Admin Portal</h2>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <nav className="p-4 space-y-1">
          <Link to="/admin/dashboard" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Dashboard' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>Dashboard</Link>
          <Link to="/admin/pages" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Pages' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>Pages</Link>
          <Link to="/admin/updates" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'News & Events' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>News & Events</Link>
          <Link to="/admin/achievements" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Achievements' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>Achievements</Link>
          <Link to="/admin/gallery" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Gallery' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>Gallery</Link>
          <Link to="/admin/notices" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Notices' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>Notices</Link>
          <Link to="/admin/settings" className={`block px-4 py-3 rounded-lg font-medium transition-colors ${currentModule === 'Settings' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>Settings</Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 h-20 flex items-center justify-between px-4 sm:px-8 bg-white border-b border-slate-200 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 -ml-2 lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h1 className="text-2xl font-bold text-slate-800">{currentModule || 'Dashboard'}</h1>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hidden sm:inline text-sm font-medium text-slate-500">{user?.email}</span>
            <button onClick={onLogout} className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors border border-transparent hover:border-red-100">
              Sign Out
            </button>
          </div>
        </header>

        {/* Dynamic Inner Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}