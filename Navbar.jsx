import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from './SettingsContext';
import { useFirestoreCollection } from './useFirestoreCollection';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const settings = useSettings();
  
  // Fetch all custom pages to dynamically build the navigation menu
  const { data: pages } = useFirestoreCollection('pages', 'order', 'asc');
  const mainNavSlugs = ['about', 'academics', 'admission'];
  const explorePages = pages.filter(p => p.published !== false && !mainNavSlugs.includes(p.slug));

  return (
    <header className="relative bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Premium Logo Layout */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={settings?.logoUrl || "https://i.ibb.co/7d4mTQVT/image.png"} 
              alt="Ansar English School Logo" 
              className="h-14 w-auto object-contain contrast-125 brightness-105 transition-all duration-300 hover:scale-[1.03] hover:drop-shadow-[0_0_15px_rgba(5,150,105,0.4)]" 
              style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
            />
            <div className="hidden sm:flex flex-col border-l-2 border-emerald-600/20 pl-3 ml-1">
              <span className="block font-extrabold text-slate-900 text-lg leading-tight tracking-tight">Ansar English School</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="block text-emerald-700 text-[10px] font-bold uppercase tracking-widest">Perumpilavu</span>
                <span className="block bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-widest">NABET Accredited</span>
              </div>
            </div>
          </Link>
          
          {/* Fluid Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {['Home', 'About', 'Academics', 'Admission', 'News', 'Events', 'Contact'].map((item) => (
              <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="relative text-sm font-bold text-slate-700 hover:text-emerald-700 transition-colors py-2 group">
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 ease-out group-hover:w-full rounded-full"></span>
              </Link>
            ))}
            
            {/* "More Options" Dropdown relocating the Login mechanism */}
            <div className="relative">
              <button 
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-emerald-700 transition-colors py-2"
              >
                Explore
                <svg className={`w-4 h-4 transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {isMoreOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl py-3 flex flex-col max-h-96 overflow-y-auto z-50 custom-scrollbar ring-1 ring-black/5">
                  {explorePages.map(page => (
                    <Link key={page.id} to={`/${page.slug}`} onClick={() => setIsMoreOpen(false)} className="px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">{page.title}</Link>
                  ))}
                  <Link to="/gallery" className="px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Gallery</Link>
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
      
      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 max-h-[calc(100vh-6rem)] overflow-y-auto border-t border-slate-100 bg-white shadow-xl md:hidden">
          <div className="mx-auto grid w-full max-w-7xl gap-1 px-4 py-4">
            <Link to="/" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-slate-700 font-bold hover:bg-emerald-50 hover:text-emerald-600">Home</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-slate-700 font-bold hover:bg-emerald-50 hover:text-emerald-600">About Us</Link>
            <Link to="/admission" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-slate-700 font-bold hover:bg-emerald-50 hover:text-emerald-600">Admissions</Link>
            <Link to="/academics" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-slate-700 font-bold hover:bg-emerald-50 hover:text-emerald-600">Academics</Link>
            <Link to="/news" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-slate-700 font-bold hover:bg-emerald-50 hover:text-emerald-600">News</Link>
            <Link to="/events" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-slate-700 font-bold hover:bg-emerald-50 hover:text-emerald-600">Events</Link>
            <Link to="/gallery" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-slate-700 font-bold hover:bg-emerald-50 hover:text-emerald-600">Gallery</Link>
            {explorePages.map(page => (
              <Link key={page.id} to={`/${page.slug}`} onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-slate-700 font-bold hover:bg-emerald-50 hover:text-emerald-600">{page.title}</Link>
            ))}
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-slate-700 font-bold hover:bg-emerald-50 hover:text-emerald-600">Contact Us</Link>
            <div className="mt-2 border-t border-slate-100 pt-2">
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block rounded-lg px-4 py-3 text-base text-emerald-700 font-extrabold hover:bg-emerald-50 hover:text-emerald-800">Login / Account</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
