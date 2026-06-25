import React, { useEffect, useRef, useState } from 'react';
import Layout from './Layout';
import ContentPageLayout from './ContentPageLayout';
import { useFirestoreCollection } from './useFirestoreCollection';
import { useSettings } from './SettingsContext';

const ANSAR_MILESTONES = [
  { year: '1979', title: 'ACT got registered', color: 'bg-red-600', ring: 'ring-red-100' },
  { year: '1982', title: 'School got registered', color: 'bg-amber-400', ring: 'ring-amber-100' },
  { year: '1988', title: 'Affiliation from CBSE', color: 'bg-cyan-500', ring: 'ring-cyan-100' },
  { year: '1990', title: 'Updated to Senior Secondary', color: 'bg-indigo-700', ring: 'ring-indigo-100' },
  { year: '1992', title: '1st batch of class XII', color: 'bg-red-600', ring: 'ring-red-100' },
  { year: '2021', title: 'New vision & mission', color: 'bg-amber-400', ring: 'ring-amber-100' },
  { year: '2022', title: 'Year of Excellence', color: 'bg-cyan-500', ring: 'ring-cyan-100' },
  { year: '2022', title: 'Year of Talent', color: 'bg-indigo-700', ring: 'ring-indigo-100' },
  { year: '2023', title: 'Year of Quality', color: 'bg-red-600', ring: 'ring-red-100' },
  { year: '2023', title: 'Year of Innovation', color: 'bg-amber-400', ring: 'ring-amber-100' },
  { year: '2024', title: 'NABET Accredited', color: 'bg-cyan-500', ring: 'ring-cyan-100' },
  { year: '2025', title: 'National Silver Medal', color: 'bg-indigo-700', ring: 'ring-indigo-100' },
  { year: '2025', title: 'CBSE Topper', color: 'bg-red-600', ring: 'ring-red-100' },
  { year: '2026', title: 'Year of Sustainability', color: 'bg-indigo-700', ring: 'ring-indigo-100' }
];

function AnimatedSection({ children, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${className}`}>
      {children}
    </div>
  );
}

function AnsarTimeline() {
  return (
    <AnimatedSection className="mt-14 overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Ansar Timeline</p>
        <h2 className="mt-3 text-4xl font-extrabold text-slate-950 lg:text-5xl">Milestones</h2>
      </div>

      <div className="hidden overflow-x-auto pb-4 lg:block">
        <div className="relative min-w-[1220px] px-6 py-24">
          <div className="absolute left-10 right-10 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-800" />
          <div className="grid grid-cols-[repeat(14,minmax(0,1fr))]">
            {ANSAR_MILESTONES.map((milestone, index) => {
              const isTop = index % 2 === 0;
              return (
                <div key={`${milestone.year}-${milestone.title}`} className="relative h-48">
                  <span className={`absolute left-1/2 top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full ${milestone.color} ring-8 ${milestone.ring} shadow-md`} />
                  <span className={`absolute left-1/2 h-16 w-px -translate-x-1/2 bg-slate-700/70 ${isTop ? 'bottom-1/2 mb-3' : 'top-1/2 mt-3'}`} />
                  <div className={`absolute left-1/2 w-32 -translate-x-1/2 text-center ${isTop ? 'bottom-[8.25rem]' : 'top-[8.25rem]'}`}>
                    <p className="text-2xl font-black text-slate-950">{milestone.year}</p>
                    <h3 className="mt-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-extrabold leading-tight text-slate-700 shadow-sm">{milestone.title}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative space-y-6 lg:hidden">
        <div className="absolute bottom-4 left-4 top-4 w-1 rounded-full bg-slate-800" />
        {ANSAR_MILESTONES.map((milestone) => (
          <div key={`${milestone.year}-${milestone.title}-mobile`} className="relative flex gap-5 pl-0.5">
            <span className={`relative z-10 mt-2 h-8 w-8 flex-none rounded-full ${milestone.color} ring-8 ${milestone.ring} shadow-md`} />
            <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-2xl font-black text-slate-950">{milestone.year}</p>
              <h3 className="mt-1 text-base font-extrabold text-slate-700">{milestone.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}

function HistoryAndTrustees({ historyText, trustees = [] }) {
  const visibleTrustees = Array.isArray(trustees) ? trustees.filter(item => item?.imageUrl || item?.name) : [];
  const trusteeSlots = visibleTrustees.length ? visibleTrustees : Array.from({ length: 6 }, (_, index) => ({ name: `Trustee Member ${index + 1}` }));

  return (
    <AnimatedSection className="mt-12 space-y-10">
      <section className="grid gap-8 rounded-[2rem] border border-emerald-100 bg-emerald-50 p-8 lg:grid-cols-[0.8fr_1.2fr] lg:p-12">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-emerald-700">Our Story</p>
          <h2 className="mt-3 text-4xl font-extrabold text-emerald-950">History of ANSAR</h2>
        </div>
        <div className="min-h-48 rounded-2xl bg-white p-6 text-lg leading-relaxed text-slate-600 shadow-sm">
          {historyText ? (
            <p className="whitespace-pre-wrap">{historyText}</p>
          ) : (
            <p>History content will be updated soon.</p>
          )}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm lg:p-12">
        <div className="mb-8 text-center">
          <p className="text-sm font-black uppercase tracking-widest text-amber-600">Ansari Charitable Trust</p>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-950">Trustee Members</h2>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {trusteeSlots.map((trustee, index) => (
            <div key={`${trustee.name || 'trustee'}-${index}`} className="group overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[4/5] bg-slate-100">
                {trustee.imageUrl ? (
                  <img src={trustee.imageUrl} alt={trustee.name || 'Trustee member'} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                    <svg className="h-14 w-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" /></svg>
                  </div>
                )}
              </div>
              <div className="p-4 text-center">
                <h3 className="text-sm font-extrabold text-slate-800">{trustee.name}</h3>
                {trustee.role && <p className="mt-1 text-xs font-bold text-emerald-600">{trustee.role}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </AnimatedSection>
  );
}

function AboutInstitutionSections() {
  const settings = useSettings();

  return (
    <>
      <AnsarTimeline />
      <HistoryAndTrustees historyText={settings?.ansarHistoryText} trustees={settings?.trusteeMembers} />
    </>
  );
}

export default function About() {
  const { data: pages } = useFirestoreCollection('pages');
  const page = pages.find(p => p.slug === 'about');

  if (page) {
    return (
      <Layout>
        <ContentPageLayout
          page={page}
          eyebrow="About Ansar English School"
          actions={page.virtualTourUrl && (
            <a href={page.virtualTourUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition-colors hover:bg-emerald-700 no-underline">
              {page.virtualTourText || 'Take a 360\u00b0 Virtual Tour'}
            </a>
          )}
        />
        <div className="mx-auto max-w-7xl px-4 pb-12 lg:pb-20">
          <AboutInstitutionSections />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop"
            alt="About Ansar English School"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-emerald-950/60" />
          <div className="relative grid min-h-[28rem] grid-cols-1 items-end gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-14 lg:py-16">
            <div>
              <p className="mb-4 text-sm font-extrabold uppercase tracking-widest text-amber-300">About Ansar English School</p>
              <h1 className="max-w-4xl text-4xl font-extrabold leading-tight lg:text-6xl">A Legacy of Excellence, A Future of Promise</h1>
              <p className="mt-6 max-w-3xl text-lg font-light leading-relaxed text-slate-100/90 lg:text-xl">Empowering generations since 1982 through value-driven education and inclusive learning.</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <p className="text-5xl font-extrabold text-amber-300">1982</p>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-100">Founded in 1982 by the Ansari Charitable Trust under the guidance of Late Jb. A V Abdul Majeed Saheb and visionary leaders.</p>
            </div>
          </div>
        </section>

        <section className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <article className="space-y-8">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
              <h2 className="text-3xl font-extrabold text-slate-900">Our Story: A Legacy of Excellence</h2>
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-slate-600">
                <p>Founded in 1982 by the Ansari Charitable Trust under the guidance of Late Jb. A V Abdul Majeed Saheb and visionary leaders, <strong className="text-slate-900">Ansar English School</strong> has grown into a beacon of holistic education in Perumpilavu, Thrissur. We are proud to be the <strong className="text-slate-900">first school in Thrissur accredited by NABET</strong> and are affiliated with the CBSE board. Today, our sprawling campus serves over 4,600 students, guided by a dedicated team of 270+ experienced educators.</p>
                <p>Our expansive educational ecosystem goes beyond traditional schooling, encompassing a Senior Secondary School, an NIOS center, an Arts & Science College for Women, a Special School for Mentally Challenged Children, a nurturing Orphanage, and a well-equipped hospital.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 sm:p-8">
                <h2 className="text-2xl font-extrabold text-slate-900">Our Vision</h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-700">To empower students with academic rigor, skill and ethical leadership  to serve  society.</p>
              </section>
              <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-extrabold text-slate-900">Our Mission</h2>
                <ul className="mt-5 space-y-4 text-slate-600">
                  <li><strong className="text-slate-900">Shape Contributors:</strong> Conduct educational programs that mold students into active contributors to a just and equitable society.</li>
                  <li><strong className="text-slate-900">Build 21st-Century Skills:</strong> Design and implement activities that empower students with critical thinking, creativity, communication, and collaboration.</li>
                  <li><strong className="text-slate-900">Ensure Inclusivity:</strong> Provide quality education to students from deprived sections to drive upward social mobility.</li>
                  <li><strong className="text-slate-900">Foster Character:</strong> Sustain an ecosystem that inculcates strong moral character, self-esteem, and a deep awareness of societal responsibilities.</li>
                </ul>
              </section>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-3xl font-extrabold text-slate-900">4,600</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">students</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-3xl font-extrabold text-slate-900">270+</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">educators</p>
                </div>
              </div>
            </div>
            <a href="https://www.p4panorama.com/360-virtual-tour/ansar-school/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-4 text-center font-bold text-white shadow-lg transition-colors hover:bg-emerald-700">
              Take a 360&deg; Virtual Tour of Ansar School
            </a>
          </aside>
        </section>

        <AboutInstitutionSections />
      </div>
    </Layout>
  );
}
