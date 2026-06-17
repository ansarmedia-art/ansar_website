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
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-8 right-8 z-[100] max-w-sm w-full bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border-t-4 border-amber-400 overflow-hidden cursor-pointer"
          onClick={handleClick}
        >
          <div className="p-6 relative">
            <button onClick={(e) => { e.stopPropagation(); setIsVisible(false); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <p className="text-xs font-black tracking-widest text-amber-500 uppercase mb-2">New Update</p>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2 leading-tight">{notice.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{notice.message}</p>
            <div className="flex items-center text-emerald-600 font-bold text-sm group">
              <span>Learn More</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </div>
          <motion.div initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: 10, ease: 'linear' }} className="h-1.5 bg-amber-400" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}