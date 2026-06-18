import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase-init';
import { motion, AnimatePresence } from 'framer-motion';

export default function Gallery() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    setLoading(true);
    let updatesData = [];
    let achievementsData = [];
    let galleryData = [];

    const processMedia = () => {
      let allImages = [];

      // Legacy Gallery Collection support
      galleryData.forEach(item => {
        if (item.imageUrl && item.imageUrl.trim() !== '') {
          allImages.push({
            id: item.id + '-gal',
            url: item.imageUrl,
            title: item.title || 'Gallery Image',
            category: item.category || 'General',
            date: item.date || '',
            timestamp: item.createdAt?.toMillis() || 0
          });
        }
      });

      // Updates (News & Events) Collections
      updatesData.forEach(item => {
        const urls = new Set();
        if (item.coverImageUrl) urls.add(item.coverImageUrl);
        if (item.imageUrl) urls.add(item.imageUrl);
        if (Array.isArray(item.eventImages)) item.eventImages.forEach(u => u && urls.add(u));
        if (Array.isArray(item.imageUrls)) item.imageUrls.forEach(u => u && urls.add(u));

        let i = 0;
        urls.forEach(url => {
          if (url && url.trim() !== '') {
            allImages.push({
              id: `${item.id}-upd-${i++}`,
              url: url,
              title: item.title || 'School Update',
              category: item.category || 'News & Events',
              date: item.date || '',
              timestamp: item.createdAt?.toMillis() || 0
            });
          }
        });
      });

      // Achievements Collection
      achievementsData.forEach(item => {
        if (item.imageUrl && item.imageUrl.trim() !== '') {
          allImages.push({
            id: item.id + '-ach',
            url: item.imageUrl,
            title: item.title || 'Achievement',
            category: 'Achievements',
            date: item.date || '',
            timestamp: item.createdAt?.toMillis() || 0
          });
        }
      });

      // Sort strictly chronologically (newest first)
      allImages.sort((a, b) => b.timestamp - a.timestamp);
      setMedia(allImages);
      setLoading(false);
    };

    const unsubUpdates = onSnapshot(collection(db, 'updates'), (snap) => {
      updatesData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(d => d.published !== false);
      processMedia();
    });

    const unsubAchievements = onSnapshot(collection(db, 'achievements'), (snap) => {
      achievementsData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(d => d.published !== false);
      processMedia();
    });
    
    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snap) => {
      galleryData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(d => d.published !== false);
      processMedia();
    });

    return () => {
      unsubUpdates();
      unsubAchievements();
      unsubGallery();
    };
  }, []);

  const categories = ['All', ...new Set(media.map(item => item.category).filter(Boolean))];
  const filteredMedia = filter === 'All' ? media : media.filter(item => item.category === filter);

  // Raw Asset Fetcher (Bypasses browser compression or preview constraints)
  const handleDownload = async (url, title) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network error');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'ansar_gallery_image'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback for strict CORS blocked resources
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 lg:py-20 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900">Photo Gallery</h1>
          <p className="text-lg text-slate-600 mt-4">A visual timeline of moments, events, and achievements at Ansar English School.</p>
        </div>
        
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {categories.map(category => (
            <button key={category} onClick={() => setFilter(category)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${filter === category ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
              {category}
            </button>
          ))}
        </div>
        
        {loading ? (
          <p className="text-center text-slate-500 font-bold animate-pulse">Synchronizing media assets...</p>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            {filteredMedia.map(item => (
              <div key={item.id} className="break-inside-avoid relative group overflow-hidden rounded-xl shadow-sm cursor-pointer mb-4 bg-slate-100 border border-slate-200" onClick={() => setSelectedImg(item)}>
                 <img src={item.url} alt={item.title} className="w-full h-auto block group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <h3 className="text-white font-bold text-sm lg:text-base leading-snug line-clamp-2 drop-shadow-md">{item.title}</h3>
                    <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider mt-1 drop-shadow-md">{item.category}</span>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* High-Fidelity Lightbox View */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedImg(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-50 bg-white/10 rounded-full backdrop-blur-sm transition-colors"
              onClick={() => setSelectedImg(null)}
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImg.url}
              alt={selectedImg.title}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-5 pointer-events-none"
            >
              <div className="text-center px-4">
                <h3 className="text-white font-bold text-xl sm:text-2xl drop-shadow-md">{selectedImg.title}</h3>
                <p className="text-emerald-400 font-medium text-sm drop-shadow-md">{selectedImg.category} {selectedImg.date && `• ${selectedImg.date}`}</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDownload(selectedImg.url, selectedImg.title); }}
                className="pointer-events-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-full font-bold shadow-[0_0_20px_rgba(5,150,105,0.4)] hover:shadow-[0_0_30px_rgba(5,150,105,0.6)] transition-all transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download Original Image
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}