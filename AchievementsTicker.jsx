import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useContentCollection } from './useContentCollection';

function getAchievementTime(item) {
  if (item.createdAt?.toMillis) return item.createdAt.toMillis();
  if (item.createdAt?.seconds) return item.createdAt.seconds * 1000;
  if (item.date) return new Date(item.date).getTime() || 0;
  return 0;
}

export default function AchievementsTicker() {
  const scrollerRef = useRef(null);
  const { data: achievements, loading } = useContentCollection('achievements', null);
  const publishedAchievements = achievements
    .filter(item => item.published !== false)
    .sort((a, b) => getAchievementTime(b) - getAchievementTime(a))
    .slice(0, 10);

  const tickerItems = [...publishedAchievements, ...publishedAchievements, ...publishedAchievements];
  const canScroll = publishedAchievements.length > 1;

  useEffect(() => {
    if (!canScroll) return undefined;

    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const timer = window.setInterval(() => {
      const resetPoint = scroller.scrollWidth / 3;

      if (scroller.scrollLeft >= resetPoint * 2) {
        scroller.scrollTo({ left: resetPoint, behavior: 'auto' });
      } else {
        scroller.scrollBy({ left: 2, behavior: 'auto' });
      }
    }, 24);

    return () => window.clearInterval(timer);
  }, [canScroll, publishedAchievements.length]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !canScroll) return;

    const startAt = scroller.scrollWidth / 3;
    scroller.scrollTo({ left: startAt, behavior: 'auto' });
  }, [canScroll, tickerItems.length]);

  const scrollManually = (direction) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: direction * Math.min(360, scroller.clientWidth * 0.75),
      behavior: 'smooth'
    });
  };

  if (loading || publishedAchievements.length === 0) {
    return null;
  }

  return (
    <section className="mt-24 overflow-hidden rounded-[2rem] bg-slate-950 py-8 text-white shadow-2xl">
      <div className="mb-7 flex flex-col items-center justify-between gap-5 px-6 text-center sm:flex-row sm:text-left">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-amber-300">Achievements</p>
          <h2 className="mt-2 text-3xl font-extrabold lg:text-4xl">Proud moments at Ansar</h2>
        </div>

        {canScroll && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollManually(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white hover:text-slate-950"
              aria-label="Previous achievements"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19 8 12l7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollManually(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white hover:text-slate-950"
              aria-label="Next achievements"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="achievement-ticker-mask px-5">
        <div ref={scrollerRef} className="achievement-ticker-scroll flex gap-5 overflow-x-auto scroll-smooth pb-2">
          {tickerItems.map((achievement, index) => {
            const imageUrl = achievement.thumbnailUrl || achievement.coverImageUrl || achievement.imageUrl;

            return (
              <Link
                key={`${achievement.id}-${index}`}
                to={`/achievements/${achievement.id}`}
                className="group block w-72 flex-none overflow-hidden rounded-2xl border border-white/10 bg-white text-slate-900 shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl sm:w-80"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={achievement.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading={index < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                      <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15.5 8.5 17.7l1-4-3.1-2.6 4.1-.3L12 7l1.5 3.8 4.1.3-3.1 2.6 1 4L12 15.5z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  {achievement.date && <p className="mb-2 text-xs font-black uppercase tracking-widest text-emerald-600">{achievement.date}</p>}
                  <h3 className="line-clamp-2 text-lg font-extrabold leading-snug text-slate-900 group-hover:text-emerald-700">{achievement.title}</h3>
                  {achievement.studentName && <p className="mt-2 truncate text-sm font-bold text-slate-500">{achievement.studentName}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
