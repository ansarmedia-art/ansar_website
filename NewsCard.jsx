import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewsCard({ id, title, excerpt, imageUrl, date, type = 'news' }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/${type}/${id}`)}
      className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 group flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Image with fallback skeleton */}
      <div className="relative h-56 w-full bg-slate-100 overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Image+Unavailable'; }}
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full text-slate-300">
            {/* Clean SVG skeleton placeholder */}
            <svg className="w-16 h-16 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
        )}
      </div>
      
      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase mb-2">{date}</span>
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">{title}</h3>
        <p className="text-slate-600 text-sm flex-grow line-clamp-3 leading-relaxed">{excerpt}</p>
      </div>
    </div>
  );
}