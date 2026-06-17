import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src="https://i.ibb.co/7d4mTQVT/image.png" alt="Ansar English School Logo" className="h-12 w-auto object-contain" />
            <div className="hidden sm:block">
              <span className="block font-bold text-slate-900 text-lg leading-tight">Ansar English School</span>
              <span className="block text-slate-500 text-xs font-medium uppercase tracking-wider">Perumpilavu</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-600 hover:text-emerald-600 font-semibold transition-colors">Home</Link>
            <Link to="/about" className="text-slate-600 hover:text-emerald-600 font-semibold transition-colors">About</Link>
            <Link to="/academics" className="text-slate-600 hover:text-emerald-600 font-semibold transition-colors">Academics</Link>
            <Link to="/admission" className="text-slate-600 hover:text-emerald-600 font-semibold transition-colors">Admission</Link>
            <Link to="/contact" className="text-slate-600 hover:text-emerald-600 font-semibold transition-colors">Contact</Link>
            
            {/* "More Options" Dropdown relocating the Login mechanism */}
            <div className="relative">
              <button 
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="flex items-center gap-1 text-slate-600 hover:text-emerald-600 font-semibold transition-colors"
              >
                More Options
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {isMoreOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-lg py-2 flex flex-col max-h-96 overflow-y-auto z-50 custom-scrollbar">
                  <Link to="/ansar-sports" className="px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Ansar Sports</Link>
                  <Link to="/atl" className="px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">ATL</Link>
                  <Link to="/ansar-sprouts" className="px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Ansar Sprouts</Link>
                  <Link to="/extension-services" className="px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Extension Services</Link>
                  <Link to="/life-at-ansar" className="px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Life at Ansar</Link>
                  <Link to="/ansar-times" className="px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Ansar Times</Link>
                  <Link to="/alumni" className="px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Alumni</Link>
                  <Link to="/achievements" className="px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Achievements</Link>
                  <Link to="/gallery" className="px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Gallery</Link>
                  <Link to="/sop" className="px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">SOP</Link>
                  <Link to="/mandatory-public-disclosure" className="px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Mandatory Disclosure</Link>
                  <Link to="/news" className="px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">News & Events</Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link to="/admin" className="px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors">Login / Account</Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-emerald-600 focus:outline-none transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Hamburger Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3 shadow-inner max-h-[70vh] overflow-y-auto">
          <Link to="/" className="block text-slate-700 font-semibold hover:text-emerald-600">Home</Link>
          <Link to="/about" className="block text-slate-700 font-semibold hover:text-emerald-600">About</Link>
          <Link to="/academics" className="block text-slate-700 font-semibold hover:text-emerald-600">Academics</Link>
          <Link to="/admission" className="block text-slate-700 font-semibold hover:text-emerald-600">Admission</Link>
          <Link to="/gallery" className="block text-slate-700 font-semibold hover:text-emerald-600">Gallery</Link>
          <Link to="/life-at-ansar" className="block text-slate-700 font-semibold hover:text-emerald-600">Life at Ansar</Link>
          <Link to="/contact" className="block text-slate-700 font-semibold hover:text-emerald-600">Contact</Link>
          <div className="border-t border-slate-100 pt-3">
            <Link to="/admin" className="block text-emerald-700 font-bold hover:text-emerald-800">Login / Account</Link>
          </div>
        </div>
      )}
    </header>
  );
}