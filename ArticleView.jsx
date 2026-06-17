import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase-init';
import Layout from './Layout';
import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const fallbackImageSvg = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600' viewBox='0 0 1200 600'%3E%3Crect width='1200' height='600' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' font-weight='bold' fill='%2394a3b8'%3EImage Unavailable%3C/text%3E%3C/svg%3E";

export default function ArticleView() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const [[page, direction], setPage] = useState([0, 0]);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'updates', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const imageIndex = page % (article?.imageUrls?.length || 1);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  if (loading) {
    return <Layout><div className="text-center py-24 font-bold text-xl">Loading Article...</div></Layout>;
  }

  if (!article) {
    return <Layout><div className="text-center py-24 font-bold text-xl text-red-600">Article not found.</div></Layout>;
  }

  const fallbackImage = article.coverImageUrl || article.imageUrl;
  const arrayImages = article.eventImages?.length > 0 ? article.eventImages : (article.imageUrls || []);
  
  let validImages = arrayImages.filter(url => url && url.trim() !== '');
  if (validImages.length === 0 && fallbackImage) {
      validImages = [fallbackImage];
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 lg:py-20 px-4">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-emerald-950 mb-4">{article.title}</h1>
        
        {article.date && (
          <div className="flex items-center gap-2 text-slate-500 font-semibold mb-8">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span>{article.date}</span>
          </div>
        )}

        {article.description && (
          <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap mb-12">{article.description}</p>
        )}

        {validImages.length === 1 && (
          <div className="relative w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden shadow-xl border border-slate-200">
            <img 
              src={validImages[0]} 
              alt={article.title} 
              className="w-full h-full object-cover" 
              onError={(e) => { e.target.onerror = null; e.target.src = fallbackImageSvg; }} 
            />
          </div>
        )}

        {validImages.length > 1 && (
          <div className="relative w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden shadow-xl border border-slate-200">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={page}
                src={validImages[imageIndex]}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="absolute h-full w-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = fallbackImageSvg; }}
              />
            </AnimatePresence>
            
            <>
              <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10 bg-white/50 p-2 rounded-full hover:bg-white transition-colors cursor-pointer" onClick={() => paginate(-1)}>
                <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-4 z-10 bg-white/50 p-2 rounded-full hover:bg-white transition-colors cursor-pointer" onClick={() => paginate(1)}>
                <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {validImages.map((_, i) => (
                  <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all shadow-sm ${i === imageIndex ? 'bg-white scale-125' : 'bg-white/50'}`} />
                ))}
              </div>
            </>
          </div>
        )}
      </div>
    </Layout>
  );
}