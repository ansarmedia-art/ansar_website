import React from 'react';
import Layout from './Layout';
import ContentPageLayout from './ContentPageLayout';
import { useFirestoreCollection } from './useFirestoreCollection';

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
      </div>
    </Layout>
  );
}
