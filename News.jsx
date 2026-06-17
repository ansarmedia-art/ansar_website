import React from 'react';
import Layout from './Layout';
import { useFirestoreCollection } from './useFirestoreCollection';
import NewsCard from './NewsCard';

export default function News() {
  const { data: news, loading } = useFirestoreCollection('news', 'date', 'desc');

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 lg:py-20 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900">News & Updates</h1>
          <p className="text-lg text-slate-600 mt-4">The latest announcements and happenings at Ansar English School.</p>
        </div>
        {loading ? (
          <p className="text-center text-slate-500">Loading news...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.length ? news.map(item => (
              <NewsCard key={item.id} id={item.id} title={item.title} excerpt={item.excerpt || item.description || item.content} date={item.date} imageUrl={item.image || item.imageUrl} type="news" />
            )) : <p className="col-span-full text-center text-slate-500">No news articles have been published yet.</p>}
          </div>
        )}
      </div>
    </Layout>
  );
}