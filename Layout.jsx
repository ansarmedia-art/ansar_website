import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingSocials from './FloatingSocials';
import InstallPrompt from './InstallPrompt';

export default function Layout({ children, isHome = false }) {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />
      
      {/* Global strict layout grid wrapper */}
      <main className="flex-grow w-full max-w-7xl overflow-x-hidden mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
      
      <Footer />
      <InstallPrompt />
      
      {/* Sticky Socials dock only renders on the Home screen */}
      {isHome && <FloatingSocials />}
    </div>
  );
}
