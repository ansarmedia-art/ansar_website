import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import ContentPageLayout from './ContentPageLayout';
import { useFirestoreCollection } from './useFirestoreCollection';
import { useSettings } from './SettingsContext';

const DEFAULT_FEE_STRUCTURE_URL = 'https://drive.google.com/file/d/1BlRQIlD4U4RjRGvVIq2Kah4xYxNjChoa/view?usp=drive_link';
const DEFAULT_FEE_STRUCTURE_TITLE = 'Fee Structure 2026 - 2027';
const ADMISSION_PAYMENT_PORTAL_URL = 'https://ansartrust.atcampussolutions.com/school/';

function getDriveFileId(url = '') {
  const match = url.match(/\/file\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
  return match ? match[1] : '';
}

function getDriveDownloadUrl(url = '') {
  const fileId = getDriveFileId(url);
  if (fileId) return `https://drive.google.com/uc?export=download&id=${fileId}`;
  return url;
}

function FeeStructureActions({ title, url, onDownload }) {
  if (!url) return null;

  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-emerald-600 text-white">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" /></svg>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black uppercase tracking-widest text-emerald-700">Admission Document</p>
          <h2 className="mt-2 text-2xl font-extrabold text-emerald-950">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">View the official fee structure in Google Drive or download a copy for reference.</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          View Fee Structure
        </a>
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download
        </button>
      </div>
    </div>
  );
}

function AdmissionPaymentPortal() {
  return (
    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-amber-500 text-white">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v-1m9-4a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black uppercase tracking-widest text-amber-700">Online Portal</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-950">Admissions & Payments</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Use the official AT Campus portal for admission-related services and online payments.</p>
        </div>
      </div>
      <a
        href={ADMISSION_PAYMENT_PORTAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-amber-600"
      >
        Open Admission & Payments Portal
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17 17 7M8 7h9v9" />
        </svg>
      </a>
    </div>
  );
}

export default function Admission() {
  const { data: pages } = useFirestoreCollection('pages');
  const page = pages.find(p => p.slug === 'admission');
  const settings = useSettings();
  const feeStructureUrl = settings?.feeStructurePdfUrl?.trim() || DEFAULT_FEE_STRUCTURE_URL;
  const feeStructureTitle = settings?.feeStructureTitle?.trim() || DEFAULT_FEE_STRUCTURE_TITLE;

  const handlePdfDownload = (url) => {
    if (!url) return;
    const downloadUrl = url.includes('drive.google.com') ? getDriveDownloadUrl(url) : url;
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
          eyebrow="Admissions"
          sidebar={(
            <>
              <AdmissionPaymentPortal />
              <FeeStructureActions title={feeStructureTitle} url={feeStructureUrl} onDownload={() => handlePdfDownload(feeStructureUrl)} />
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-slate-900">Admissions Office</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">Contact the school office for application support, eligibility, and document verification.</p>
                <Link to="/contact" className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700">Contact Office</Link>
              </div>
            </>
          )}
        >
          <div
            className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-a:text-emerald-600 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
          />
          <div className="mt-10">
            <AdmissionPaymentPortal />
          </div>
          <div className="mt-6">
            <FeeStructureActions title={feeStructureTitle} url={feeStructureUrl} onDownload={() => handlePdfDownload(feeStructureUrl)} />
          </div>
        </ContentPageLayout>
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
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/contact" className="inline-flex items-center justify-center bg-emerald-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              Contact Admissions Office
            </Link>
            <a href={ADMISSION_PAYMENT_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-amber-600 hover:shadow-xl">
              Admission & Payments
            </a>
            <a href={feeStructureUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-4 font-bold text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:text-emerald-700">
              View Fee Structure
            </a>
          </div>
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
            <AdmissionPaymentPortal />

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
              <div className="grid grid-cols-1 gap-3">
                <a href={feeStructureUrl} target="_blank" rel="noopener noreferrer" className="w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white shadow-md transition-colors hover:bg-slate-800">
                  View {feeStructureTitle}
                </a>
                <button 
                  onClick={() => handlePdfDownload(feeStructureUrl)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md flex justify-center items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Download Fee Structure
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
