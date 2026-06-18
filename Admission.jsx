import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import { useFirestoreCollection } from './useFirestoreCollection';
import { useSettings } from './SettingsContext';

export default function Admission() {
  const { data: pages } = useFirestoreCollection('pages');
  const page = pages.find(p => p.slug === 'admission');
  const settings = useSettings();

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
        <div className="max-w-4xl mx-auto py-12 lg:py-20 px-4">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">{page.title}</h1>
          {page.subtitle && <p className="text-xl text-slate-600 mb-12 font-light">{page.subtitle}</p>}
          {page.heroImageUrl && <img src={page.heroImageUrl} alt={page.title} className="w-full h-64 sm:h-80 object-cover rounded-xl shadow-md mb-12" />}
          <div className="prose prose-slate prose-lg sm:prose-xl max-w-none prose-a:text-emerald-600 prose-headings:text-slate-900" dangerouslySetInnerHTML={{ __html: page.bodyHtml }}></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-12 lg:py-20 px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2">Admissions Portal</p>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">Join the Ansar Family</h1>
          <p className="text-xl text-slate-600 font-light leading-relaxed mb-8">We offer a fair, transparent, and merit-based admissions process aligned with NEP guidelines. Discover a community where every student thrives.</p>
          <Link to="/contact" className="inline-flex items-center justify-center bg-emerald-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            Contact Admissions Office
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100 academics-card">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">How to Apply: Step-by-Step</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg">1</div>
                  <div><h3 className="font-bold text-slate-900 text-lg">Submit Application</h3><p className="text-slate-600 mt-1">Applications are open annually from <strong>Jan 01 to March 31</strong>. Apply online or submit a physical form detached from our school prospectus.</p></div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg">2</div>
                  <div><h3 className="font-bold text-slate-900 text-lg">Attend Assessment</h3><p className="text-slate-600 mt-1">For students entering above LKG, a language proficiency and diagnostic assessment is mandatory to understand learning needs.</p></div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg">3</div>
                  <div><h3 className="font-bold text-slate-900 text-lg">Finalize Enrollment</h3><p className="text-slate-600 mt-1">Upon successful assessment, submit the required documents to our school office to secure your child's seat.</p></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100 academics-card">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Documentation Checklist</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <li className="flex items-start gap-3"><svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="text-slate-600">Original Birth Certificate (with photocopy)</span></li>
                <li className="flex items-start gap-3"><svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="text-slate-600">Three recent passport-sized photos</span></li>
                <li className="flex items-start gap-3"><svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="text-slate-600">Transfer Certificate (TC) <em>(AEO/DEO Countersigned if required)</em></span></li>
                <li className="flex items-start gap-3"><svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="text-slate-600">Latest Progress Report from previous year</span></li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white academics-card">
              <h2 className="text-xl font-bold mb-6 text-emerald-400">Eligibility Criteria</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3"><span>LKG</span><span className="font-bold bg-slate-800 px-3 py-1 rounded text-sm">3½+ Years</span></div>
                <div className="flex justify-between items-center border-b border-slate-700 pb-3"><span>UKG</span><span className="font-bold bg-slate-800 px-3 py-1 rounded text-sm">4½+ Years</span></div>
                <div className="flex justify-between items-center pb-1"><span>Class I</span><span className="font-bold bg-slate-800 px-3 py-1 rounded text-sm">5½+ Years</span></div>
                <p className="text-xs text-slate-400 italic mt-4">*Age computed as of June 1st of the academic year.</p>
              </div>
            </div>

            <div className="bg-emerald-50 p-8 rounded-3xl shadow-sm border border-emerald-100 academics-card text-center">
              <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h2 className="text-xl font-bold text-emerald-950 mb-3">Fees & Financial Aid</h2>
              <p className="text-slate-600 text-sm mb-6">Ansar Charitable Trust delivers free education to orphans and targeted financial aid to disadvantaged learners.</p>
              <button 
                onClick={() => handlePdfDownload(settings?.feeStructurePdfUrl)}
                disabled={!settings?.feeStructurePdfUrl}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download Fee Structure
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}