import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import ShareButton from './ShareButton';
import { useFirestoreCollection } from './useFirestoreCollection';

function AchievementCard({ achievement }) {
  const navigate = useNavigate();
  const shareUrl = `${window.location.origin}/achievements/${achievement.id}`;

  return (
    <div
      onClick={() => navigate(`/achievements/${achievement.id}`)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
    >
      <div className="relative min-h-56 overflow-hidden border-b border-slate-100 bg-slate-100">
        {achievement.imageUrl ? (
          <img
            src={achievement.imageUrl}
            alt={achievement.title}
            className="absolute inset-0 h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v18m14-18v18M5 8h14M5 16h14" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {achievement.date && <span className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-600">{achievement.date}</span>}
        <h3 className="mb-3 line-clamp-2 text-xl font-bold text-slate-900 group-hover:text-emerald-700">{achievement.title}</h3>
        {achievement.studentName && <p className="mb-2 text-sm font-bold text-slate-500">{achievement.studentName}</p>}
        {achievement.description && <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{achievement.description}</p>}
        <button className="mt-5 w-full rounded-lg bg-emerald-50 py-2.5 font-bold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white">
          Read More
        </button>
        <ShareButton
          url={shareUrl}
          title={achievement.title}
          text={achievement.description}
          className="mt-3 w-full border border-slate-200 bg-white px-4 py-2.5 text-slate-700 hover:bg-slate-50"
        />
      </div>
    </div>
  );
}

export default function Achievements() {
  const { data: achievements, loading } = useFirestoreCollection('achievements', 'order', 'asc');
  const publishedAchievements = achievements.filter(item => item.published !== false);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 lg:text-5xl">Achievements</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600">Celebrating the accomplishments of Ansar English School students and community.</p>
        </div>

        {loading ? (
          <p className="text-center text-slate-500">Loading achievements...</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {publishedAchievements.length ? (
              publishedAchievements.map(item => <AchievementCard key={item.id} achievement={item} />)
            ) : (
              <p className="col-span-full text-center text-slate-500">Achievements will appear here once published.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
