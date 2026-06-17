import React from 'react';

export default function PrincipalCard({ name, role, qualification, imageUrl }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col sm:flex-row group hover:shadow-xl transition-all duration-300">
      <div className="sm:w-1/3 relative bg-slate-100 flex-shrink-0 min-h-[200px]">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <svg className="w-16 h-16 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col justify-center sm:w-2/3">
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{name}</h3>
        <p className="text-emerald-600 font-semibold mb-2">{role}</p>
        <p className="text-slate-500 text-sm">{qualification}</p>
      </div>
    </div>
  );
}