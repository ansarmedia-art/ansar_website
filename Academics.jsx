import React from 'react';
import Layout from './Layout';
import ContentPageLayout from './ContentPageLayout';
import { useFirestoreCollection } from './useFirestoreCollection';
import { useSettings } from './SettingsContext';
import { DEFAULT_ACADEMIC_SECTIONS, mergeListWithDefaults } from './contentDefaults';

const ACADEMIC_FOCUS = [
  {
    title: 'CBSE Curriculum',
    body: 'Structured learning from foundational literacy to senior secondary subject specialization.'
  },
  {
    title: 'Smart Learning',
    body: 'Digital classrooms, practical labs, and activity-led sessions keep lessons clear and engaging.'
  },
  {
    title: 'Competitive Readiness',
    body: 'Focused support for board exams, skill development, and entrance-oriented preparation.'
  }
];

function AcademicsHighlights() {
  return (
    <section className="mt-10 rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:p-8">
      <div className="max-w-3xl">
        <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Academic Life</p>
        <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Learning that connects knowledge, skill, and character</h2>
        <p className="mt-4 text-base leading-relaxed text-slate-600">The academic programme combines classroom instruction, lab work, reading culture, enrichment activities, and regular mentoring so students can learn with clarity and confidence.</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {ACADEMIC_FOCUS.map((item) => (
          <div key={item.title} className="rounded-xl border border-white bg-white p-5 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-900">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionImage({ imageUrl, title }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`${title} at Ansar English School`}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100">
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 19.5V5.75A2.75 2.75 0 0 1 6.75 3H20v14H6.75A2.75 2.75 0 0 0 4 19.75M4 19.5A1.5 1.5 0 0 0 5.5 21H20M8 7h8M8 11h6" />
        </svg>
      </div>
      <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-400">Image Holder</p>
      <p className="mt-1 px-6 text-sm font-bold text-slate-600">{title}</p>
    </div>
  );
}

function AcademicSections({ sections }) {
  return (
    <section className="mt-16">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Academic Sections</p>
        <h2 className="mt-3 text-3xl font-extrabold text-slate-900 lg:text-4xl">A pathway for every stage of learning</h2>
        <p className="mt-4 text-base leading-relaxed text-slate-600">Each section has its own learning rhythm, mentoring approach, and space for future photographs from the admin panel.</p>
      </div>

      <div className="space-y-8">
        {sections.map((section, index) => {
          const reverse = index % 2 === 1;
          return (
            <article key={`${section.title}-${index}`} className="grid grid-cols-1 items-stretch overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm md:grid-cols-2">
              <div className={`group relative min-h-72 overflow-hidden bg-slate-100 ${reverse ? 'md:order-2' : ''}`}>
                <SectionImage imageUrl={section.imageUrl} title={section.title} />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <p className="text-xs font-black uppercase tracking-widest text-amber-600">Section {index + 1}</p>
                <h3 className="mt-3 text-2xl font-extrabold text-slate-900 lg:text-3xl">{section.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-slate-600">{section.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AcademicsSidebar({ onDownloadFeeStructure, hasFeeStructure }) {
  return (
    <>
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
        <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">Academic Overview</p>
        <h2 className="mt-3 text-xl font-extrabold text-slate-900">CBSE learning pathway</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">A balanced programme for academics, values, communication, technology, and future readiness.</p>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-slate-900">Learning Support</p>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <p>Smart classrooms</p>
          <p>Science and computer labs</p>
          <p>Language enrichment</p>
          <p>Exam preparation support</p>
        </div>
      </div>
      {hasFeeStructure && (
        <button
          type="button"
          onClick={onDownloadFeeStructure}
          className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
        >
          Download Fee Structure
        </button>
      )}
    </>
  );
}

export default function Academics() {
  const { data: pages } = useFirestoreCollection('pages');
  const page = pages.find(p => p.slug === 'academics');
  const settings = useSettings();
  const academicSections = mergeListWithDefaults(settings?.academicSections, DEFAULT_ACADEMIC_SECTIONS);

  const handlePdfDownload = (url) => {
    if (!url) return;
    const downloadUrl = url.includes('drive.google.com') ? url.replace(/\/view.*$/, '/export?format=pdf').replace(/\/edit.*$/, '/export?format=pdf') : url;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.target = '_blank';
    a.download = 'Ansar_Fee_Structure.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (page) {
    return (
      <Layout>
        <ContentPageLayout
          page={page}
          eyebrow="Academics"
          sidebar={<AcademicsSidebar onDownloadFeeStructure={() => handlePdfDownload(settings?.feeStructurePdfUrl)} hasFeeStructure={Boolean(settings?.feeStructurePdfUrl)} />}
        >
          <div
            className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-a:text-emerald-600 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
          />
          <AcademicsHighlights />
          <AcademicSections sections={academicSections} />
        </ContentPageLayout>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-12 lg:py-20 px-4">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <p className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2">Academics</p>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">Inspiring Minds, Shaping Futures</h1>
          <p className="text-xl text-slate-600 font-light leading-relaxed">A student-centric CBSE learning pathway supported by digital classrooms, enrichment programmes, labs, and regular skill-building activities.</p>
        </div>
        
        <div className="relative w-full h-64 sm:h-96 rounded-3xl overflow-hidden shadow-2xl mb-20 group">
          <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
          <img src="/academics/D3ZTUDIO_PR0-02-18.jpg" alt="Students writing in class at Ansar English School" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="academics-card bg-white p-10 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">A Dynamic, Student-Centered Approach</h2>
              <p className="text-slate-600 leading-relaxed">At Ansar English School, we believe education should be engaging, interactive, and deeply holistic. Our approach blends modern infrastructure, including Smart Classrooms, Advanced Science & Computer Labs, and high-speed Wi-Fi, with deep-rooted value education.</p>
            </div>
          </div>

          <div className="academics-card bg-emerald-950 p-10 rounded-3xl shadow-xl border border-emerald-900 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-emerald-800 text-emerald-300 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">Beyond the Textbooks</h2>
              <ul className="space-y-4 text-emerald-100">
                <li className="flex items-start gap-3"><span className="mt-2 h-2 w-2 flex-none rounded-full bg-amber-400"></span> <span><strong>Innovation & Tech:</strong> Hands-on creation at our state-of-the-art ATL Tinkering Lab.</span></li>
                <li className="flex items-start gap-3"><span className="mt-2 h-2 w-2 flex-none rounded-full bg-amber-400"></span> <span><strong>Communication:</strong> Advanced Language Labs and Language Ambassador programs.</span></li>
                <li className="flex items-start gap-3"><span className="mt-2 h-2 w-2 flex-none rounded-full bg-amber-400"></span> <span><strong>Future Readiness:</strong> Dedicated competitive exam coaching for Medical, Engineering, and NTSE.</span></li>
                <li className="flex items-start gap-3"><span className="mt-2 h-2 w-2 flex-none rounded-full bg-amber-400"></span> <span><strong>Leadership & Service:</strong> Active chapters of Student Police Cadet (SPC) and NSS.</span></li>
              </ul>
            </div>
          </div>
        </div>

        <AcademicsHighlights />

        <AcademicSections sections={academicSections} />
      </div>
    </Layout>
  );
}
