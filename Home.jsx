import React, { useState, useEffect, useRef } from 'react';
import { useFirestoreCollection } from './useFirestoreCollection';
import Layout from './Layout';
import Hero from './Hero';
import NewsCard from './NewsCard';
import PrincipalCard from './PrincipalCard';

const FALLBACK_FEATURES = [
  'CCTV-enabled safety', 'Spacious classrooms with smart boards', 'Qualified support staff',
  'Digital classrooms', 'Special play area', 'Purpose-built advanced labs',
  'Multi-sports play area', 'Wi-Fi enabled learning environment', 'Safe school transport'
];

const FALLBACK_LEADERS = [
  { name: 'Shyny Hamza', role: 'Principal', detail: 'MSc, MA, B.Ed, CIDTT, SET' },
  { name: 'Sajidha Razack', role: 'Junior Principal', detail: 'Senior Secondary Section' },
  { name: 'Ravya K R', role: 'Junior Principal', detail: 'Secondary Section' },
  { name: 'Fareeda E Mohammed', role: 'Junior Principal', detail: 'Middle Section' },
  { name: 'Saleena Kader', role: 'Junior Principal', detail: 'Primary Section' },
  { name: 'Babitha KN', role: 'Junior Principal', detail: 'Sprouts' }
];

function AnimatedSection({ children, className = "" }) {
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
    <div ref={ref} className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}>
      {children}
    </div>
  );
}

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 60));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(current);
          }
        }, 20);
        observer.unobserve(entry.target);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home() {
  const { data: carousel } = useFirestoreCollection('carousel');
  const { data: news } = useFirestoreCollection('news', 'date', 'desc');
  const { data: events } = useFirestoreCollection('events', 'date', 'desc');

  const activeSlide = carousel.find(item => item.active !== false) || {};
  
  const updates = [...news.map(n => ({...n, type: 'news'})), ...events.map(e => ({...e, type: 'events'}))]
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : (a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0));
      const dateB = b.date ? new Date(b.date) : (b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0));
      return dateB - dateA;
    })
    .slice(0, 6);

  return (
    <Layout isHome={true}>
      <Hero 
        title={activeSlide.title || "Shaping Bright Futures Through Education"} 
        subtitle={activeSlide.description || "Quality learning, nurturing care, and strong values help Ansar students grow into responsible citizens."}
        imageUrl={activeSlide.imageUrl || activeSlide.image}
      />

      <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-0 relative z-20 max-w-4xl mx-auto -mt-10 bg-white rounded-xl shadow-xl overflow-hidden border border-slate-100 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        <div className="p-8 text-center bg-white">
          <strong className="block text-4xl font-extrabold text-slate-900 mb-1"><AnimatedCounter target={270} suffix="+" /></strong>
          <span className="text-slate-500 font-medium tracking-wide uppercase text-sm">Experienced Staff</span>
        </div>
        <div className="p-8 text-center bg-white">
          <strong className="block text-4xl font-extrabold text-slate-900 mb-1"><AnimatedCounter target={42} /></strong>
          <span className="text-slate-500 font-medium tracking-wide uppercase text-sm">Successful Years</span>
        </div>
        <div className="p-8 text-center bg-white">
          <strong className="block text-4xl font-extrabold text-slate-900 mb-1"><AnimatedCounter target={5000} suffix="+" /></strong>
          <span className="text-slate-500 font-medium tracking-wide uppercase text-sm">Students</span>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
        <div className="flex flex-col justify-center">
          <p className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-3">About us</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">Welcome to Ansar English School Perumpilavu</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">Founded by Ansari Charitable Trust, Ansar English School is a CBSE-affiliated institution focused on academic growth, inclusive learning, and values-led leadership.</p>
        </div>
        <div className="bg-slate-900 p-10 rounded-2xl shadow-xl text-white flex flex-col justify-center border-b-4 border-emerald-500">
          <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
          <p className="text-slate-300 text-lg leading-relaxed font-light">Nurture students to thrive as creative and value-driven citizens in a diverse and rapidly changing world.</p>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-32">
        <div className="text-center mb-12">
          <p className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2">Campus</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">Student-centric learning environment</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FALLBACK_FEATURES.map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-10 h-1.5 bg-amber-400 rounded-full mb-6 group-hover:w-16 transition-all duration-500"></div>
              <h3 className="text-lg font-bold text-slate-800">{feature}</h3>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-32">
        <div className="text-center mb-12">
          <p className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2">Updates</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">News and Events</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {updates.length ? updates.map(item => (
            <NewsCard key={item.id} id={item.id} title={item.title} excerpt={item.excerpt || item.description || item.content} date={item.date} imageUrl={item.image || item.imageUrl} type={item.type} />
          )) : <p className="col-span-full text-center text-slate-500">Latest updates will appear here once published from the admin panel.</p>}
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-32 mb-16">
        <div className="mb-12 text-center lg:text-left">
          <p className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2">Leadership</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">Guiding visionaries behind our success</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FALLBACK_LEADERS.map((leader, i) => (
            <PrincipalCard key={i} name={leader.name} role={leader.role} qualification={leader.detail} />
          ))}
        </div>
      </AnimatedSection>
    </Layout>
  );
}