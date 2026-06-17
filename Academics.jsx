import React from 'react';
import Layout from './Layout';
import { useFirestoreCollection } from './useFirestoreCollection';

export default function Academics() {
  const { data: pages } = useFirestoreCollection('pages');
  const page = pages.find(p => p.slug === 'academics');

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
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">Inspiring Minds, Shaping Futures</h1>
        <p className="text-xl text-slate-600 mb-12 font-light">A student-centric curriculum designed to foster critical thinking, creativity, and lifelong learning.</p>
        <img src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1400&auto=format&fit=crop" alt="Academics at Ansar" className="w-full h-64 sm:h-80 object-cover rounded-xl shadow-md mb-12" />
        <div className="prose prose-slate prose-lg sm:prose-xl max-w-none prose-a:text-emerald-600 prose-headings:text-slate-900">
          <h2>A Dynamic, Student-Centered Approach</h2>
          <p>At Ansar English School, we believe education should be engaging, interactive, and deeply holistic. Our approach seamlessly blends modern infrastructure—including Smart Classrooms, Advanced Science & Computer Labs, and high-speed Wi-Fi—with deep-rooted value education.</p>
          <h2>The 4 Stages of Learning</h2>
          <ul>
            <li><strong>Ansar Sprouts (Pre-Primary):</strong> A sensory and play-based environment focusing on cognitive, physical, and emotional development.</li>
            <li><strong>Primary School:</strong> Building a rock-solid foundation in literacy, numeracy, and basic sciences through interactive learning.</li>
            <li><strong>Middle School:</strong> Emphasizing conceptual understanding, confident communication, and sharp analytical skills.</li>
            <li><strong>Secondary & Senior Secondary:</strong> Subject specialization, hands-on projects, and focused CBSE curriculum exam preparation to ensure future success.</li>
          </ul>
          <h2>Beyond the Textbooks</h2>
          <p>We empower our students to excel globally and serve locally through unique enrichment programs:</p>
          <ul>
            <li><strong>Innovation & Tech:</strong> Hands-on creation at our state-of-the-art <strong>ATL Tinkering Lab</strong>.</li>
            <li><strong>Communication:</strong> Advanced Language Labs and Language Ambassador programs.</li>
            <li><strong>Future Readiness:</strong> Dedicated competitive exam coaching for Medical, Engineering, and NTSE.</li>
            <li><strong>Leadership & Service:</strong> Active chapters of the Student Police Cadet (SPC) and National Service Scheme (NSS).</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}