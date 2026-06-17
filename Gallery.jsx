import React, { useState } from 'react';
import Layout from './Layout';
import { useFirestoreCollection } from './useFirestoreCollection';

export default function Gallery() {
  const { data: galleryItems, loading } = useFirestoreCollection('gallery', 'order', 'asc');
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(galleryItems.map(item => item.category).filter(Boolean))];
  const filteredItems = filter === 'All' ? galleryItems : galleryItems.filter(item => item.category === filter);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 lg:py-20 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900">Photo Gallery</h1>
          <p className="text-lg text-slate-600 mt-4">A glimpse into life at Ansar English School.</p>
        </div>
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {categories.map(category => (
            <button key={category} onClick={() => setFilter(category)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${filter === category ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
              {category}
            </button>
          ))}
        </div>
        {loading ? (
          <p className="text-center text-slate-500">Loading gallery...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map(item => (
              <div key={item.id} className="group relative overflow-hidden rounded-xl shadow-md aspect-square"><img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}