import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase-init';
import { useNavigate } from 'react-router-dom';

export default function NoticePopup() {
  const [notice, setNotice] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'notices'), where('active', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setNotice({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsVisible(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!notice) return null;

  const handleClick = () => {
    setIsVisible(false);
    if (notice.buttonUrl) {
      if (notice.buttonUrl.startsWith('http')) {
        window.open(notice.buttonUrl, '_blank', 'noopener,noreferrer');
      } else {
        navigate(notice.buttonUrl);
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="notice-popup-overlay"
          onClick={() => setIsVisible(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="notice-container-fluid"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating Close Button */}
            <button 
              onClick={() => setIsVisible(false)} 
              className="absolute -top-12 right-0 sm:-right-4 z-50 text-white/70 hover:text-white p-2 transition-colors"
              aria-label="Close Notice"
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            {notice.imageUrl ? (
              <div className="relative w-full h-full flex flex-col rounded-xl overflow-hidden shadow-2xl bg-black/80 ring-1 ring-white/10">
              <img 
                src={notice.imageUrl} 
                alt={notice.title || "Notice Banner"} 
                  className="notice-popup-img"
              />
                <div className="notice-overlay-content flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight drop-shadow-lg text-left flex-grow">
                    {notice.title}
                  </h3>
                  {notice.buttonUrl && (
                    <button onClick={handleClick} className="flex-shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold py-3 px-6 sm:py-3.5 sm:px-8 rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(251,191,36,0.4)] whitespace-nowrap w-full sm:w-auto text-sm sm:text-base">
                      {notice.buttonText || "Learn More"}
                    </button>
                  )}
                </div>
                <motion.div initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: 10, ease: 'linear' }} className="absolute bottom-0 left-0 h-1.5 bg-amber-400 z-10" />
              </div>
            ) : (
              <div className="p-8 sm:p-12 relative bg-white rounded-2xl shadow-2xl max-w-lg w-full text-center">
                <p className="text-sm font-black tracking-widest text-amber-500 uppercase mb-3">New Update</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 leading-tight">{notice.title}</h3>
                {notice.buttonUrl && (
                  <button onClick={handleClick} className="mt-6 inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-full transition-colors shadow-md hover:shadow-lg">
                    <span>{notice.buttonText || "Learn More"}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                )}
                <motion.div initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: 10, ease: 'linear' }} className="absolute bottom-0 left-0 h-1.5 bg-amber-400 rounded-b-2xl" />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}