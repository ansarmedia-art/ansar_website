import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from './firebase-init';
import Layout from './Layout';
import Hero from './Hero';
import NewsCard from './NewsCard';
import PrincipalCard from './PrincipalCard';
import AchievementsTicker from './AchievementsTicker';

const FALLBACK_FEATURES = [
  { text: 'CCTV-enabled safety', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16h.01"/></svg> },
  { text: 'Spacious classrooms with smart boards', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="3" rx="2" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 21h8"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17v4"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m10 8 6 4-6 4Z"/></svg> },
  { text: 'Qualified support staff', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 21v-2a4 4 0 0 0-3-3.87"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { text: 'Digital classrooms', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg> },
  { text: 'Special play area', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9" strokeWidth="2"/><line x1="15" x2="15.01" y1="9" y2="9" strokeWidth="2"/></svg> },
  { text: 'Purpose-built advanced labs', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 2v7.31L2 20.5A2 2 0 0 0 3.5 24h17a2 2 0 0 0 1.5-3.5L14 9.31V2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 2h7"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 9.31V6"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9.31V6"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 14h12"/></svg> },
  { text: 'Multi-sports play area', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 22h16"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14.66V17c0 1.1-.9 2-2 2H4"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 14.66V17c0 1.1.9 2 2 2h4"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 4c0 3-2 5.5-5 5.5h-2c-3 0-5-2.5-5-5.5V2h12z"/></svg> },
  { text: 'Wi-Fi enabled learning environment', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12.55a11 11 0 0 1 14.08 0"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1.42 9a16 16 0 0 1 21.16 0"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" x2="12.01" y1="20" y2="20" strokeWidth="2"/></svg> },
  { text: 'Safe school transport', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 6v6"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 6v6"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12h19.6"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2" strokeWidth="2"/><circle cx="17" cy="18" r="2" strokeWidth="2"/></svg> }
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
  const [updates, setUpdates] = useState([]);
  
  // Real-time fetching of Unified 'updates' collection
  useEffect(() => {
    const q = query(collection(db, 'updates'), orderBy('createdAt', 'desc'), limit(6));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUpdates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <Layout isHome={true}>
      <Hero 
        title="Shaping Bright Futures Through Education" 
        subtitle="Quality learning, nurturing care, and strong values help Ansar students grow into responsible citizens."
        // We REMOVED the imageUrl override here, so it ALWAYS defaults to your School Logo!
      />

      <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20 max-w-6xl mx-auto -mt-12 px-4 sm:px-0">
        <div className="p-10 text-center bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 border-b-4 border-b-amber-400 transform hover:-translate-y-2 transition-transform duration-500">
          <strong className="block text-5xl font-extrabold text-emerald-950 mb-2"><AnimatedCounter target={270} suffix="+" /></strong>
          <span className="text-slate-500 font-bold tracking-widest uppercase text-xs">Experienced Staff</span>
        </div>
        <div className="p-10 text-center bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 border-b-4 border-b-amber-400 transform hover:-translate-y-2 transition-transform duration-500 delay-100">
          <strong className="block text-5xl font-extrabold text-emerald-950 mb-2"><AnimatedCounter target={42} /></strong>
          <span className="text-slate-500 font-bold tracking-widest uppercase text-xs">Successful Years</span>
        </div>
        <div className="p-10 text-center bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 border-b-4 border-b-amber-400 transform hover:-translate-y-2 transition-transform duration-500 delay-200">
          <strong className="block text-5xl font-extrabold text-emerald-950 mb-2"><AnimatedCounter target={5000} suffix="+" /></strong>
          <span className="text-slate-500 font-bold tracking-widest uppercase text-xs">Students Enrolled</span>
        </div>
      </AnimatedSection>

      {/* Achievements Ticker */}
      <AchievementsTicker />

      <AnimatedSection className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col justify-center">
          <div className="inline-block w-16 h-1.5 bg-amber-400 rounded-full mb-6"></div>
          <p className="text-emerald-600 font-black uppercase tracking-widest text-sm mb-3">About us</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-emerald-950 mb-6 leading-tight">Welcome to Ansar English School Perumpilavu</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6 font-medium">Founded by Ansari Charitable Trust, Ansar English School is a CBSE-affiliated institution focused on academic growth, inclusive learning, and values-led leadership.</p>
        </div>
        <div className="bg-emerald-950 p-12 md:p-16 rounded-[2.5rem] shadow-2xl text-white flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-amber-500/20 transition-colors duration-700"></div>
          <h3 className="text-3xl font-extrabold mb-6 relative z-10">Our Vision</h3>
          <p className="text-emerald-50/80 text-xl leading-relaxed font-light relative z-10 border-l-4 border-amber-400 pl-6">To empower students with academic rigor, skill and ethical leadership to serve society.</p>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-32">
        <div className="text-center mb-12">
          <p className="text-emerald-600 font-black uppercase tracking-widest text-sm mb-3">Campus Infrastructure</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-emerald-950">Student-centric learning</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FALLBACK_FEATURES.map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-10 group-hover:bg-amber-50 transition-colors duration-500"></div>
              <div className="w-16 h-16 bg-emerald-100/50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-white transition-all duration-500 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-emerald-950 leading-snug">{feature.text}</h3>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-32">
        <div className="text-center mb-12">
          <p className="text-emerald-600 font-black uppercase tracking-widest text-sm mb-3">Updates</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-emerald-950">Latest News</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {updates.length ? updates.map(item => (
            <NewsCard key={item.id} id={item.id} title={item.title} excerpt={item.excerpt || item.description || item.content} date={item.date} imageUrl={item.image || item.imageUrl} type={item.type} />
          )) : <p className="col-span-full text-center text-slate-500">Latest updates will appear here once published from the admin panel.</p>}
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-32">
        <div className="text-center mb-12">
          <p className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2">Location</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">Explore Our Campus</h2>
        </div>
        <div className="w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-slate-200">
          <iframe
            title="Ansar English School Satellite Map"
            src="https://maps.google.com/maps?q=Ansar%20English%20School,%20Perumpilavu&t=k&z=17&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-32 mb-16">
        <div className="mb-12 text-center lg:text-left">
          <p className="text-emerald-600 font-black uppercase tracking-widest text-sm mb-3">Leadership</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-emerald-950">Guiding visionaries behind our success</h2>
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