import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './Layout';
import { useContentCollection } from './useContentCollection';

export default function SproutsActivityArticle() {
  const { id } = useParams();
  const { data, loading } = useContentCollection('sproutsActivities', 'date', 'desc', { sheetsOnly: true });
  const activity = useMemo(() => data.find(item => String(item.id) === String(id) && item.published !== false), [data, id]);
  const images = useMemo(() => Array.isArray(activity?.imageUrls) ? activity.imageUrls.filter(Boolean) : [], [activity]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => setActiveImage(0), [id]);

  if (loading) return <Layout><main className="min-h-[60vh] bg-orange-50 px-4 py-24 text-center font-bold text-slate-500">Loading activity...</main></Layout>;
  if (!activity) return <Layout><main className="min-h-[60vh] bg-orange-50 px-4 py-24 text-center"><h1 className="text-3xl font-black text-emerald-950">Activity not found</h1><Link to="/ansar-sprouts" className="mt-6 inline-flex rounded-full bg-orange-500 px-6 py-3 font-black text-white">Back to Ansar Sprouts</Link></main></Layout>;

  const moveImage = step => setActiveImage(current => (current + step + images.length) % images.length);
  const formattedDate = activity.date ? new Date(`${activity.date}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return <Layout>
    <main className="min-h-screen bg-[#fffaf2] pb-20">
      <header className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 px-4 py-14 text-white lg:py-20">
        <div className="mx-auto max-w-5xl">
          <Link to="/ansar-sprouts" className="inline-flex items-center text-sm font-black text-amber-300 hover:text-white">← Back to Ansar Sprouts</Link>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.18em]"><span className="rounded-full bg-orange-500 px-4 py-2">{activity.category || 'Sprouts Activity'}</span>{formattedDate && <time className="text-emerald-100">{formattedDate}</time>}</div>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">{activity.title}</h1>
        </div>
      </header>

      <article className="mx-auto -mt-8 max-w-6xl px-4">
        {images.length > 0 && <section className="overflow-hidden rounded-[2rem] border-4 border-white bg-slate-950 shadow-2xl">
          <div className="relative flex min-h-[22rem] items-center justify-center sm:min-h-[32rem] lg:min-h-[40rem]">
            <AnimatePresence mode="wait"><motion.img key={images[activeImage]} src={images[activeImage]} alt={`${activity.title} – image ${activeImage + 1}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="absolute inset-0 h-full w-full object-contain" /></AnimatePresence>
            {images.length > 1 && <><button type="button" onClick={() => moveImage(-1)} aria-label="Previous photograph" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-3 text-2xl font-black text-emerald-950 shadow-lg">‹</button><button type="button" onClick={() => moveImage(1)} aria-label="Next photograph" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-3 text-2xl font-black text-emerald-950 shadow-lg">›</button><span className="absolute bottom-4 right-4 rounded-full bg-black/70 px-4 py-2 text-xs font-black text-white">{activeImage + 1} / {images.length}</span></>}
          </div>
          {images.length > 1 && <div className="flex gap-3 overflow-x-auto bg-white p-4">{images.map((image, index) => <button key={`${image}-${index}`} type="button" onClick={() => setActiveImage(index)} className={`h-20 w-28 flex-none overflow-hidden rounded-xl border-4 ${index === activeImage ? 'border-orange-500' : 'border-transparent'}`}><img src={image} alt={`Select photograph ${index + 1}`} className="h-full w-full object-cover" loading="lazy" /></button>)}</div>}
        </section>}

        <section className="mx-auto mt-10 max-w-4xl rounded-[2rem] bg-white p-7 shadow-lg sm:p-10 lg:p-12">
          <p className="whitespace-pre-line text-lg font-medium leading-9 text-slate-700">{activity.description}</p>
          <div className="mt-10 border-t border-slate-100 pt-7"><Link to="/ansar-sprouts" className="inline-flex rounded-full bg-emerald-700 px-6 py-3 font-black text-white hover:bg-emerald-800">Explore more Sprouts activities</Link></div>
        </section>
      </article>
    </main>
  </Layout>;
}
