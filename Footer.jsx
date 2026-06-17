import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t-4 border-emerald-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Ansar English School</h3>
          <p className="text-sm leading-relaxed mb-4 text-slate-400">
            A CBSE-affiliated, NABET accredited school shaped by the Ansari Charitable Trust commitment to education, healthcare, and social welfare.
          </p>
          <p className="text-sm text-slate-400">Perumpilavu, Thrissur, Kerala</p>
          
          {/* Media Contact Badge */}
          <div className="mt-8 inline-flex items-center gap-3 bg-emerald-900/50 px-5 py-3 rounded-xl border border-emerald-700/50 hover:border-amber-400/50 transition-colors group">
            <svg className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <a href="mailto:ansarmedia@ansarschool.in" className="text-sm font-bold tracking-wide text-emerald-50 hover:text-amber-400 transition-colors">ansarmedia@ansarschool.in</a>
          </div>
        </div>
        
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
          <nav className="flex flex-col space-y-2 text-sm">
            <Link to="/about" className="text-slate-400 hover:text-emerald-400 transition-colors">About Us</Link>
            <Link to="/admission" className="text-slate-400 hover:text-emerald-400 transition-colors">Admissions</Link>
            <Link to="/academics" className="text-slate-400 hover:text-emerald-400 transition-colors">Academics</Link>
          </nav>
        </div>
        
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Connect With Us</h3>
          <div className="flex items-center gap-5">
            <a href="https://www.instagram.com/ansar_english.school/?hl=en" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427C2.013 14.784 2 14.43 2 12s.013-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.488 3.525c.636-.247 1.363-.416 2.427-.465C8.937 2.013 9.291 2 11.725 2h.59zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" clipRule="evenodd" /></svg>
            </a>
            <a href="https://whatsapp.com/channel/0029VbD9HEH23n3kbNrSCN0W" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12.04 20.12c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.31-1.26-2.83-1.26-4.38 0-4.54 3.69-8.23 8.23-8.23 4.54 0 8.23 3.69 8.23 8.23s-3.69 8.23-8.23 8.23zm4.49-5.45c-.25-.12-1.47-.72-1.7-.82s-.39-.12-.56.12c-.17.25-.64.82-.79.98s-.29.17-.54.06c-.25-.12-1.06-.39-2.02-1.25s-1.45-1.94-1.62-2.27c-.17-.33-.02-.51.11-.63.12-.12.25-.29.37-.44s.17-.25.25-.41.12-.3-.02-.54c-.14-.24-.56-1.34-.76-1.84s-.4-.42-.55-.43h-.48c-.17 0-.44.06-.67.3s-.86.84-1.06 2.04c-.2 1.2.88 2.38 1 2.54s1.74 2.65 4.22 3.72c.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18s.2-.98.14-1.18c-.05-.19-.2-.3-.44-.42z" /></svg>
            </a>
            <a href="https://www.youtube.com/@Ansarenglishschoolperumpilavu" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.78 22 12 22 12s0 3.22-.42 4.814a2.506 2.506 0 0 1-1.768 1.768c-1.594.42-7.812.42-7.812.42s-6.218 0-7.812-.42a2.506 2.506 0 0 1-1.768-1.768C2 15.22 2 12 2 12s0-3.22.42-4.814a2.506 2.506 0 0 1 1.768-1.768C5.782 5 12 5 12 5s6.218 0 7.812.418zM9.5 15.5V8.5L15.5 12 9.5 15.5z" clipRule="evenodd" /></svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=100063663592612" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
            </a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} Ansar English School. All rights reserved.</p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0">
          <p>This website was developed and deployed by <a href="https://d3ztudio-main.web.app" target="_blank" rel="noopener noreferrer" className="text-amber-500 font-bold hover:text-amber-400 hover:underline transition-colors tracking-wide">D3ZTUDIO</a></p>
        </div>
      </div>
    </footer>
  );
}