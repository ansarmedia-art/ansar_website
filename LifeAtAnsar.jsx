import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './Layout';
import { useContentDocument } from './useContentCollection';

export const SPC_CONTENT = `The Student Police Cadet (SPC) programme at Ansar English School, Perumbilavu is a flagship initiative dedicated to shaping students into disciplined, responsible, and socially committed citizens. More than a co-curricular programme, SPC is a platform that nurtures leadership, self-confidence, teamwork, empathy, and civic responsibility through experiential learning and community engagement. Cadets are trained to uphold values such as integrity, respect, compassion, and service while actively participating in awareness campaigns, social outreach programmes, traffic and road safety initiatives, environmental conservation activities, disaster preparedness, and community welfare projects. Through meaningful initiatives such as Joyful Kids, anti-drug awareness campaigns, public service activities, and leadership development programmes, students learn the importance of giving back to society and becoming agents of positive change. At Ansar English School, we believe that education extends beyond academic excellence. By promoting the SPC programme, we aim to develop young individuals who are physically fit, emotionally resilient, morally upright, and socially responsible. The programme instils discipline, strengthens character, fosters patriotism, and equips students with essential life skills, preparing them to become confident leaders and responsible citizens who contribute positively to their communities and the nation.`;

export const NSS_CONTENT = `The National Service Scheme (NSS) is a flagship youth development programme of the Government of India, launched with the vision of nurturing socially responsible citizens through meaningful community service. Guided by its motto, “Not Me But You,” NSS aims to develop students’ personalities by instilling values of selfless service, leadership, social responsibility, national integration, and environmental consciousness.

At Ansar English School, NSS Unit SFU/3 serves as a vibrant platform where students transform compassion into action. Through community outreach programmes, environmental conservation initiatives, health and awareness campaigns, social service activities, disaster preparedness, and volunteer-driven projects, the unit empowers students to become responsible leaders and active contributors to society. By connecting classroom learning with real-life community engagement, NSS SFU/3 nurtures young citizens who are committed to creating a positive and sustainable impact on the nation.`;

export const SPC_IMAGES = [
  'https://i.ibb.co/XHMwf93/Whats-App-Image-2026-07-15-at-2-47-35-PM-2.jpg',
  'https://i.ibb.co/ch5N0sdW/Whats-App-Image-2026-07-15-at-2-47-35-PM.jpg',
  'https://i.ibb.co/v6718ZyZ/Whats-App-Image-2026-07-15-at-2-47-36-PM-1.jpg',
  'https://i.ibb.co/RpTrDkny/Whats-App-Image-2026-07-15-at-2-47-36-PM-2.jpg',
  'https://i.ibb.co/v4qZyHSG/Whats-App-Image-2026-07-15-at-2-47-36-PM.jpg',
  'https://i.ibb.co/JFqnRJ3Z/Whats-App-Image-2026-07-15-at-2-47-37-PM-1.jpg',
  'https://i.ibb.co/VctfxnNG/Whats-App-Image-2026-07-15-at-2-47-37-PM.jpg',
  'https://i.ibb.co/cXTpDPPM/Whats-App-Image-2026-07-15-at-2-47-38-PM-1.jpg',
  'https://i.ibb.co/YT0Q4btp/Whats-App-Image-2026-07-15-at-2-47-38-PM-2.jpg',
  'https://i.ibb.co/cKTk0q8f/Whats-App-Image-2026-07-15-at-2-47-38-PM.jpg',
  'https://i.ibb.co/XZRmjmNB/Whats-App-Image-2026-07-15-at-2-47-39-PM-1.jpg',
  'https://i.ibb.co/pvHpryW2/Whats-App-Image-2026-07-15-at-2-47-39-PM.jpg',
  'https://i.ibb.co/wNb2HvDb/Whats-App-Image-2026-07-15-at-2-47-29-PM-1.jpg',
  'https://i.ibb.co/4wn7JD7c/Whats-App-Image-2026-07-15-at-2-47-29-PM.jpg',
  'https://i.ibb.co/qFXGpXD9/Whats-App-Image-2026-07-15-at-2-47-30-PM-1.jpg',
  'https://i.ibb.co/N2d9W81B/Whats-App-Image-2026-07-15-at-2-47-30-PM.jpg',
  'https://i.ibb.co/d0P10HVZ/Whats-App-Image-2026-07-15-at-2-47-31-PM-1.jpg',
  'https://i.ibb.co/9mhvZ7pd/Whats-App-Image-2026-07-15-at-2-47-31-PM-2.jpg',
  'https://i.ibb.co/TMMbMrHt/Whats-App-Image-2026-07-15-at-2-47-31-PM.jpg',
  'https://i.ibb.co/fzNq3Sm7/Whats-App-Image-2026-07-15-at-2-47-32-PM-1.jpg',
  'https://i.ibb.co/yF9jNLWy/Whats-App-Image-2026-07-15-at-2-47-32-PM.jpg',
  'https://i.ibb.co/Zzs0dYtT/Whats-App-Image-2026-07-15-at-2-47-33-PM-1.jpg',
  'https://i.ibb.co/DfNW4MHx/Whats-App-Image-2026-07-15-at-2-47-33-PM-2.jpg',
  'https://i.ibb.co/HLpBJncB/Whats-App-Image-2026-07-15-at-2-47-33-PM.jpg',
  'https://i.ibb.co/PvKFnkzV/Whats-App-Image-2026-07-15-at-2-47-34-PM-1.jpg',
  'https://i.ibb.co/3m8Y0SrP/Whats-App-Image-2026-07-15-at-2-47-34-PM-2.jpg',
  'https://i.ibb.co/ppBB2z1/Whats-App-Image-2026-07-15-at-2-47-34-PM.jpg',
  'https://i.ibb.co/QvySL4J8/Whats-App-Image-2026-07-15-at-2-47-35-PM-1.jpg'
];

const DEFAULT_SECTIONS = [
  { key: 'clubs', title: 'Clubs', body: '', images: [] },
  { key: 'nss', title: 'National Service Scheme (NSS) – Unit NO: SFU/3, Ansar English School, Perumpilavu', body: NSS_CONTENT, images: [] },
  { key: 'spc', title: 'Student Police Cadet (SPC) – Ansar English School, Perumbilavu', body: SPC_CONTENT, images: SPC_IMAGES }
];

function ImageCarousel({ images, title }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    setIndex(0);
  }, [images]);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex(current => (current + 1) % images.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [images.length, index]);

  if (!images.length) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 px-6 text-center text-sm font-bold text-emerald-700">
        Images for {title} can be added from the admin panel.
      </div>
    );
  }

  const move = step => {
    setDirection(step);
    setIndex(current => (current + step + images.length) % images.length);
  };

  return (
    <div className="relative h-[clamp(24rem,68vh,42rem)] overflow-hidden rounded-2xl bg-slate-950 shadow-xl ring-1 ring-slate-900/10">
      <motion.img
        key={`backdrop-${images[index]}`}
        src={images[index]}
        alt=""
        aria-hidden="true"
        className="absolute -inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)] scale-110 object-cover opacity-35 blur-2xl"
      />
      <div className="absolute inset-0 bg-slate-950/25" />
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.img
          key={`${images[index]}-${index}`}
          src={images[index]}
          alt={`${title} ${index + 1}`}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="absolute inset-0 z-[1] h-full w-full object-contain p-2 sm:p-4"
        />
      </AnimatePresence>
      {images.length > 1 && (
        <>
          <button type="button" onClick={() => move(-1)} aria-label={`Previous ${title} image`} className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-slate-950/60 p-3 text-white backdrop-blur transition hover:bg-slate-950/80">‹</button>
          <button type="button" onClick={() => move(1)} aria-label={`Next ${title} image`} className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-slate-950/60 p-3 text-white backdrop-blur transition hover:bg-slate-950/80">›</button>
        </>
      )}
      <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-slate-950/70 px-4 py-2 text-xs font-extrabold tracking-wider text-white backdrop-blur">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}

export default function LifeAtAnsar() {
  const { data } = useContentDocument('pages', 'life-at-ansar');
  const sections = DEFAULT_SECTIONS.map(section => ({
    ...section,
    title: data?.[`${section.key}Title`] || section.title,
    body: data?.[`${section.key}Body`] || section.body,
    images: Array.isArray(data?.[`${section.key}Images`]) && data[`${section.key}Images`].length ? data[`${section.key}Images`] : section.images
  }));

  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 px-6 py-16 text-white shadow-2xl sm:px-10 lg:px-14 lg:py-24">
          <p className="text-sm font-extrabold uppercase tracking-widest text-amber-300">Campus Culture</p>
          <h1 className="mt-3 text-4xl font-extrabold lg:text-6xl">Life at Ansar</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-emerald-50/90 lg:text-xl">Discover student leadership, service, clubs, and programmes that shape confident and responsible citizens.</p>
        </section>

        <div className="mt-14 space-y-16">
          {sections.map((section, index) => (
            <section key={section.key} className={`grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-10 ${index % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div className="lg:sticky lg:top-24"><ImageCarousel images={section.images} title={section.title} /></div>
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-9">
                <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">Life at Ansar</p>
                <h2 className="mt-3 text-3xl font-extrabold leading-tight text-emerald-950">{section.title}</h2>
                {section.body ? <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-slate-700">{section.body}</p> : <p className="mt-5 text-base italic leading-8 text-slate-500">Content for this section will be added soon.</p>}
              </div>
            </section>
          ))}
        </div>
      </main>
    </Layout>
  );
}
