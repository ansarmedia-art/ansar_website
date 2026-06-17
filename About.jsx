import React from 'react';
import Layout from './Layout';
import { useFirestoreCollection } from './useFirestoreCollection';

export default function About() {
  const { data: pages } = useFirestoreCollection('pages');
  const page = pages.find(p => p.slug === 'about');

  // If the admin has published an "about" page in the CMS, render that dynamically
  if (page) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12 lg:py-20 px-4">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">{page.title}</h1>
          {page.subtitle && <p className="text-xl text-slate-600 mb-12 font-light">{page.subtitle}</p>}
          {page.heroImageUrl && <img src={page.heroImageUrl} alt={page.title} className="w-full h-64 sm:h-80 object-cover rounded-xl shadow-md mb-12" />}
          <div className="prose prose-slate prose-lg sm:prose-xl max-w-none prose-a:text-emerald-600 prose-headings:text-slate-900" dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
          {page.virtualTourUrl && (
            <div className="mt-12">
              <a href={page.virtualTourUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-emerald-700 transition-colors no-underline">{page.virtualTourText || 'Take a 360° Virtual Tour'}</a>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // Otherwise, render the beautifully structured static code
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 lg:py-20 px-4">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">A Legacy of Excellence, A Future of Promise</h1>
        <p className="text-xl text-slate-600 mb-12 font-light">Empowering generations since 1982 through value-driven education and inclusive learning.</p>
        <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1400&auto=format&fit=crop" alt="About Ansar English School" className="w-full h-64 sm:h-80 object-cover rounded-xl shadow-md mb-12" />
        <div className="prose prose-slate prose-lg sm:prose-xl max-w-none prose-a:text-emerald-600 prose-headings:text-slate-900">
          <h2>Our Story: A Legacy of Excellence</h2>
          <p>Founded in 1982 by the Ansari Charitable Trust under the guidance of Late Jb. A V Abdul Majeed Saheb and visionary leaders, <strong>Ansar English School</strong> has grown into a beacon of holistic education in Perumpilavu, Thrissur. We are proud to be the <strong>first school in Thrissur accredited by NABET</strong> and are affiliated with the CBSE board. Today, our sprawling campus serves over 4,600 students, guided by a dedicated team of 270+ experienced educators.</p>
          <p>Our expansive educational ecosystem goes beyond traditional schooling, encompassing a Senior Secondary School, an NIOS center, an Arts & Science College for Women, a Special School for Mentally Challenged Children, a nurturing Orphanage, and a well-equipped hospital.</p>
          <h2>Our Vision</h2>
          <p>To nurture students to thrive as creative, value-driven, and globally aware citizens in a diverse and rapidly changing world.</p>
          <h2>Our Mission</h2>
          <ul>
            <li><strong>Shape Contributors:</strong> Conduct educational programs that mold students into active contributors to a just and equitable society.</li>
            <li><strong>Build 21st-Century Skills:</strong> Design and implement activities that empower students with critical thinking, creativity, communication, and collaboration.</li>
            <li><strong>Ensure Inclusivity:</strong> Provide quality education to students from deprived sections to drive upward social mobility.</li>
            <li><strong>Foster Character:</strong> Sustain an ecosystem that inculcates strong moral character, self-esteem, and a deep awareness of societal responsibilities.</li>
          </ul>
          <div className="mt-12">
            <a href="https://www.p4panorama.com/360-virtual-tour/ansar-school/" target="_blank" rel="noopener noreferrer" className="inline-block bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-emerald-700 transition-colors no-underline">
              Take a 360° Virtual Tour of Ansar School
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}