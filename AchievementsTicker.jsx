import React from 'react';
import { useFirestoreCollection } from './useFirestoreCollection';

export default function AchievementsTicker() {
  const { data: achievements, loading } = useFirestoreCollection('achievements', 'order', 'asc');

  const publishedAchievements = achievements.filter(a => a.published !== false);

  if (loading || publishedAchievements.length === 0) {
    return null; // Don't render anything if loading or no achievements
  }

  // Duplicate the list to create a seamless loop
  const tickerItems = [...publishedAchievements, ...publishedAchievements];

  return (
    <div className="mt-20 w-full overflow-hidden bg-slate-900 text-white py-4">
      <div className="flex animate-ticker">
        {tickerItems.map((ach, index) => (
          <div key={index} className="flex items-center flex-shrink-0 px-8">
            <span className="text-amber-400 text-2xl mr-3">★</span>
            <span className="font-semibold whitespace-nowrap">{ach.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}