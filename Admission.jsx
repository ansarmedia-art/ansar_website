import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import { useFirestoreCollection } from './useFirestoreCollection';

export default function Admission() {
  const { data: pages } = useFirestoreCollection('pages');
  const page = pages.find(p => p.slug === 'admission');

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
      <div className="max-w-4xl mx-auto py-12 lg:py-20 px-4">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">Join the Ansar Family</h1>
        <p className="text-xl text-slate-600 mb-12 font-light">Your child's journey to excellence starts here. Discover a community where every student thrives.</p>
        <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1400&auto=format&fit=crop" alt="Admissions at Ansar" className="w-full h-64 sm:h-80 object-cover rounded-xl shadow-md mb-12" />
        <div className="prose prose-slate prose-lg sm:prose-xl max-w-none prose-a:text-emerald-600 prose-headings:text-slate-900">
          <h2>Welcome to the Admissions Portal</h2>
          <p>We are thrilled that you are considering Ansar English School for your child's education. We offer admissions from LKG to Class IX, as well as Class XI. <em>(Note: Direct admissions to Class X & XII are only permitted under rare, board-approved transfer conditions.)</em></p>
          <p>Our admissions policy is fair, transparent, merit-based, and fully aligned with NEP guidelines. We warmly welcome students from all communities and proudly offer reservation support through the Ansar Poor Fund and Ansar Care for orphaned children.</p>
          <h2>How to Apply: A Step-by-Step Guide</h2>
          <ol>
            <li><strong>Submit Your Application:</strong> Applications are open annually from <strong>January 01 to March 31</strong>. You can apply conveniently online or submit a physical form detached from our school prospectus.</li>
            <li><strong>Attend the Assessment:</strong> For students entering classes above LKG, a language proficiency and diagnostic assessment test is mandatory to understand the child's learning needs.</li>
            <li><strong>Finalize Enrollment:</strong> Upon successful assessment, submit the required documents to our school office to secure your child's seat.</li>
          </ol>
          <h2>Checklist of Required Documents</h2>
          <ul>
            <li>Original Birth Certificate (along with one photocopy).</li>
            <li>Three recent passport-sized photographs.</li>
            <li>Transfer Certificate (TC) from the previous school <em>(Countersigned if coming from non-CBSE or foreign boards)</em>.</li>
            <li>Latest Progress Report from the previous academic year.</li>
          </ul>
          <p><strong><Link to="/contact">Ready to join our legacy? Contact our Admissions Office today!</Link></strong></p>
        </div>
      </div>
    </Layout>
  );
}