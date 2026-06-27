import React, { useState } from 'react';
import ShareButton from './ShareButton';

export default function EventCard({ id, title, description, date, thumbnailUrl, coverImageUrl, imageUrl, eventImages, imageUrls, type = 'events', priority = false }) {
  const primaryImage = thumbnailUrl || coverImageUrl || imageUrl || (eventImages && eventImages[0]) || (imageUrls && imageUrls[0]) || null;
  const [imgError, setImgError] = useState(false);
  const shareUrl = `${window.location.origin}/${type}/${id}`;

  return (
    <div className="relative bg-white rounded-xl shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 overflow-hidden border border-slate-100 group flex flex-col h-full transform hover:-translate-y-2">
      {/* Liquid Flow Animation Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/80 to-teal-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

      {/* Image Grid Presentation */}
      <div className="relative w-full bg-[#f7f9fa] overflow-hidden flex-shrink-0 border-b border-slate-100" style={{ minHeight: '224px' }}>
        {primaryImage && !imgError ? (
          <img
            src={primaryImage}
            alt={title}
            width="640"
            height="360"
            style={{ width: '100%', height: '224px', objectFit: 'cover', backgroundColor: '#f7f9fa', display: 'block', margin: '0 auto' }}
            className="transition-transform duration-700 group-hover:scale-105"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full bg-slate-100 text-slate-400">
            <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Image Unavailable</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow">
        {date && <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase mb-2">{date}</span>}
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">{title}</h3>
        <p className="text-slate-600 text-sm flex-grow line-clamp-3 leading-relaxed">{description}</p>
        <button className="mt-5 w-full bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold py-2.5 rounded-lg transition-colors duration-300">
          Read More
        </button>
        <ShareButton
          url={shareUrl}
          title={title}
          text={description}
          className="mt-3 w-full border border-slate-200 bg-white px-4 py-2.5 text-slate-700 hover:bg-slate-50"
        />
      </div>
    </div>
  );
}
