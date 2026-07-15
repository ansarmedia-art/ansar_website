import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useContentCollection } from './useContentCollection';
import { LEARNING_LABS } from './learningLabsConfig';

function LabCarousel({ lab }) {
  const images = Array.isArray(lab.imageUrls) ? lab.imageUrls.filter(Boolean) : [];
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => setIndex(0), [lab.slug, images.length]);
  useEffect(() => {
    if (images.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex(current => (current + 1) % images.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [images.length, index]);

  const move = step => {
    setDirection(step);
    setIndex(current => (current + step + images.length) % images.length);
  };

  if (!images.length) return <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/60 p-6 text-center text-sm font-bold text-emerald-700">Images for {lab.title} will be added from the admin panel.</div>;

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 shadow-lg">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img key={`${lab.slug}-${index}`} src={images[index]} alt={`${lab.title} ${index + 1}`} custom={direction} initial={{ opacity: 0, x: direction > 0 ? 70 : -70 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction > 0 ? -70 : 70 }} transition={{ duration: 0.45, ease: 'easeInOut' }} className="absolute inset-0 h-full w-full object-cover" />
      </AnimatePresence>
      {images.length > 1 && <>
        <button type="button" onClick={() => move(-1)} aria-label={`Previous ${lab.title} image`} className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-slate-950/60 px-4 py-2 text-2xl text-white">‹</button>
        <button type="button" onClick={() => move(1)} aria-label={`Next ${lab.title} image`} className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-slate-950/60 px-4 py-2 text-2xl text-white">›</button>
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">{images.map((image, dot) => <button key={`${image}-${dot}`} type="button" onClick={() => { setDirection(dot > index ? 1 : -1); setIndex(dot); }} aria-label={`Show ${lab.title} image ${dot + 1}`} className={`h-2.5 rounded-full ${dot === index ? 'w-7 bg-white' : 'w-2.5 bg-white/60'}`} />)}</div>
      </>}
    </div>
  );
}

export default function LearningLabsSection() {
  const { data } = useContentCollection('learningLabs', 'order', 'asc', { firestoreOnly: true });
  const labs = LEARNING_LABS.map(defaultLab => ({ ...defaultLab, ...(data.find(item => item.id === defaultLab.slug || item.slug === defaultLab.slug) || {}) }));

  return (
    <section className="mt-16 space-y-16">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Explore our facilities</p>
        <h2 className="mt-3 text-3xl font-extrabold text-emerald-950 lg:text-5xl">Laboratories for learning by doing</h2>
      </div>
      {labs.map((lab, index) => <article key={lab.slug} className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div className={index % 2 ? 'lg:order-2' : ''}><LabCarousel lab={lab} /></div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-amber-600">Experiential Learning Lab {String(index + 1).padStart(2, '0')}</p>
          <h3 className="mt-3 text-3xl font-extrabold text-emerald-950 lg:text-4xl">{lab.title}</h3>
          <p className="mt-5 text-base leading-8 text-slate-700">{lab.description}</p>
        </div>
      </article>)}
    </section>
  );
}
