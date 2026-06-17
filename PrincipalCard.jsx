import React from 'react';

export default function PrincipalCard({ name, role, qualification, imageUrl }) {
  return (
    <div className="relative group overflow-hidden rounded-[2rem] shadow-md hover:shadow-2xl transition-all duration-500 bg-emerald-950">
      {/* Image Container with 4:5 aspect ratio for portrait feel */}
      <div className="aspect-[4/5] w-full bg-slate-100 overflow-hidden relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <svg className="w-16 h-16 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
        )}
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/60 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Content Reveal Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-8 translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col justify-end h-full">
          <h3 className="text-2xl font-extrabold text-white mb-1 drop-shadow-sm">{name}</h3>
          <p className="text-amber-400 font-bold tracking-wide text-sm mb-4 drop-shadow-sm">{role}</p>
          
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150 border-t border-white/20 pt-4">
            <p className="text-emerald-50 text-sm leading-relaxed">{qualification}</p>
          </div>
        </div>
      </div>
    </div>
  );
}