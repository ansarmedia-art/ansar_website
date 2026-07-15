import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './Layout';
import { useContentCollection } from './useContentCollection';
import { formatDisplayDate } from './dateUtils';

export const FIELD_TRIP_SECTIONS = ['Ansar Sprouts', 'Primary Section', 'Middle Section', 'Secondary Section', 'Senior Secondary Section', 'General'];

function TripCarousel({ trip }) {
  const images = Array.isArray(trip.imageUrls) ? trip.imageUrls.filter(Boolean) : [];
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => setIndex(0), [trip.id, images.length]);
  useEffect(() => {
    if (images.length < 2) return undefined;
    const timer = window.setInterval(() => { setDirection(1); setIndex(current => (current + 1) % images.length); }, 4500);
    return () => window.clearInterval(timer);
  }, [images.length, index]);

  if (!images.length) return <div className="flex aspect-[16/10] items-center justify-center bg-slate-100 px-6 text-center text-sm font-bold text-slate-500">Trip photographs will be added soon.</div>;
  const move = step => { setDirection(step); setIndex(current => (current + step + images.length) % images.length); };

  return <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
    <AnimatePresence initial={false} custom={direction}>
      <motion.img key={`${images[index]}-${index}`} src={images[index]} alt={`${trip.title} photograph ${index + 1}`} custom={direction} initial={{ opacity: 0, x: direction > 0 ? 70 : -70 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction > 0 ? -70 : 70 }} transition={{ duration: 0.4, ease: 'easeInOut' }} className="absolute inset-0 h-full w-full object-cover" />
    </AnimatePresence>
    {images.length > 1 && <>
      <button type="button" onClick={() => move(-1)} aria-label="Previous trip image" className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-slate-950/60 px-4 py-2 text-2xl text-white backdrop-blur">‹</button>
      <button type="button" onClick={() => move(1)} aria-label="Next trip image" className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-slate-950/60 px-4 py-2 text-2xl text-white backdrop-blur">›</button>
      <span className="absolute bottom-3 right-3 z-10 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-bold text-white">{index + 1} / {images.length}</span>
    </>}
  </div>;
}

export default function FieldTrips() {
  const { data, loading } = useContentCollection('fieldTrips', null, 'desc', { firestoreOnly: true });
  const [section, setSection] = useState('All');
  const trips = useMemo(() => data.filter(item => item.published !== false).sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))), [data]);
  const visibleTrips = section === 'All' ? trips : trips.filter(trip => trip.section === section);

  return <Layout>
    <main className="bg-slate-50 pb-20">
      <section className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 px-4 py-20 text-white lg:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-amber-300">Experiential Learning</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-tight lg:text-6xl">Learning Beyond the Classroom</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-emerald-50/85 lg:text-xl">Educational visits connect classroom ideas with communities, places, people, nature, and real-life experiences—turning every trip into a meaningful journey of discovery.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-6">
          {['All', ...FIELD_TRIP_SECTIONS].map(item => <button key={item} type="button" onClick={() => setSection(item)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${section === item ? 'bg-emerald-700 text-white shadow' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-emerald-50'}`}>{item}</button>)}
        </div>

        {loading ? <p className="py-20 text-center font-bold text-slate-500">Loading field trips...</p> : visibleTrips.length ? <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {visibleTrips.map(trip => <article key={trip.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg">
            <TripCarousel trip={trip} />
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-800">{trip.section}</span>
                {trip.date && <time className="text-sm font-bold text-slate-500">{formatDisplayDate(trip.date)}</time>}
              </div>
              <h2 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">{trip.title}</h2>
              {trip.destination && <p className="mt-2 text-sm font-bold text-amber-700">Destination: {trip.destination}</p>}
              <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">{trip.description}</p>
            </div>
          </article>)}
        </div> : <div className="mt-10 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center"><h2 className="text-xl font-extrabold text-slate-800">No field trips in this category yet</h2><p className="mt-2 text-slate-500">New educational journeys will appear here after they are published.</p></div>}
      </section>
    </main>
  </Layout>;
}
