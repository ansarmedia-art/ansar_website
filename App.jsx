import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Navigate, useLocation, Link } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase-init';
import { useContentCollection } from './useContentCollection';

import Layout from './Layout';
import AdminLayout from './AdminLayout';
import Home from './Home';
import About from './About';
import Academics from './Academics';
import Admission from './Admission';
import News from './News';
import Events from './Events';
import Achievements from './Achievements';
import AnsarTimes from './AnsarTimes';
import Contact from './Contact';
import Gallery from './Gallery';
import AdminUpdates from './AdminUpdates';
import AdminAchievements from './AdminAchievements';
import AdminAnsarTimes from './AdminAnsarTimes';
import AdminGallery from './AdminGallery';
import AdminLeadership from './AdminLeadership';
import AdminNotices from './AdminNotices';
import AdminAcademics from './AdminAcademics';
import ArticleView from './ArticleView';
import AdminSettings from './AdminSettings';
import AdminPublicDisclosure from './AdminPublicDisclosure';
import MandatoryDisclosure from './MandatoryDisclosure';
import ContentPageLayout from './ContentPageLayout';
import { SettingsProvider, useSettings } from './SettingsContext';
import { DEFAULT_SPORTS_PAGE, mergeListWithDefaults } from './contentDefaults';

// --- AUTHORIZED ADMIN EMAILS ---
const ADMIN_EMAILS = [
  'd3ztudio@gmail.com',
  'ansarmedia@ansarschool.in',
  'shafeeqpulikkal32@gmail.com',
  'ansarschooloffice@gmail.com'
];

const SITE_URL = 'https://ansarschool.in';
const DEFAULT_SEO = {
  title: 'Best CBSE School in Thrissur, Kerala | Ansar English School',
  description: 'Ansar English School, Perumpilavu is a leading CBSE Senior Secondary School in Thrissur, Kerala with NABET accreditation, 42+ years of excellence, modern facilities, and value-based education.',
  keywords: 'best CBSE school in Thrissur, CBSE school Thrissur Kerala, Ansar English School, CBSE school Perumpilavu, top school in Thrissur, senior secondary school Kerala'
};

const ROUTE_SEO = {
  '/': DEFAULT_SEO,
  '/about': {
    title: 'About Ansar English School | CBSE School in Thrissur',
    description: 'Learn about Ansar English School, a NABET accredited CBSE Senior Secondary School in Perumpilavu, Thrissur with a legacy of academic excellence and value-based education.',
    keywords: 'about Ansar English School, NABET accredited school Thrissur, CBSE Senior Secondary School Thrissur'
  },
  '/academics': {
    title: 'CBSE Academics in Thrissur | Ansar English School',
    description: 'Explore the CBSE curriculum, smart classrooms, labs, enrichment programmes, and academic pathway at Ansar English School, Perumpilavu, Thrissur.',
    keywords: 'CBSE curriculum Thrissur, CBSE academics Kerala, Ansar English School academics'
  },
  '/admission': {
    title: 'CBSE School Admission in Thrissur | Ansar English School',
    description: 'Apply for admission to Ansar English School, Perumpilavu, a leading CBSE school in Thrissur, Kerala with strong academics, facilities, and student care.',
    keywords: 'CBSE school admission Thrissur, school admission Perumpilavu, Ansar English School admission'
  },
  '/contact': {
    title: 'Contact Ansar English School | Perumpilavu, Thrissur',
    description: 'Contact Ansar English School, Perumpilavu, Karikkad P.O, Thrissur, Kerala for admission queries, campus location, phone, email, and school office support.',
    keywords: 'Ansar English School contact, CBSE school Perumpilavu address, school in Thrissur phone'
  },
  '/gallery': {
    title: 'Campus Gallery | Ansar English School Thrissur',
    description: 'View photos and campus moments from Ansar English School, a CBSE Senior Secondary School in Perumpilavu, Thrissur, Kerala.',
    keywords: 'Ansar English School gallery, CBSE school campus Thrissur, Perumpilavu school photos'
  },
  '/news': {
    title: 'School News | Ansar English School Thrissur',
    description: 'Latest news, announcements, achievements, and updates from Ansar English School, Perumpilavu, Thrissur.',
    keywords: 'Ansar English School news, Thrissur school updates, CBSE school news Kerala'
  },
  '/events': {
    title: 'School Events | Ansar English School Thrissur',
    description: 'Explore school events, celebrations, competitions, and activities at Ansar English School, Perumpilavu, Thrissur.',
    keywords: 'Ansar English School events, CBSE school events Thrissur, Perumpilavu school activities'
  },
  '/achievements': {
    title: 'Achievements | Ansar English School Thrissur',
    description: 'Student achievements, academic honours, competitions, and milestones from Ansar English School, Perumpilavu, Thrissur.',
    keywords: 'Ansar English School achievements, CBSE school achievements Thrissur, student achievements Kerala'
  },
  '/mandatory-public-disclosure': {
    title: 'Mandatory Public Disclosure | Ansar English School',
    description: 'CBSE mandatory public disclosure documents and official school information for Ansar English School, Perumpilavu, Thrissur.',
    keywords: 'CBSE mandatory public disclosure Ansar English School, school disclosure Thrissur'
  }
};

function setMetaTag(selector, attributes) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    document.head.appendChild(tag);
  }
  Object.entries(attributes).forEach(([key, value]) => tag.setAttribute(key, value));
}

function setLinkTag(selector, attributes) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('link');
    document.head.appendChild(tag);
  }
  Object.entries(attributes).forEach(([key, value]) => tag.setAttribute(key, value));
}

function getSeoForPath(pathname) {
  if (pathname.startsWith('/admin')) {
    return {
      ...DEFAULT_SEO,
      title: 'Admin Portal | Ansar English School',
      description: 'Authorized administration portal for Ansar English School.',
      noIndex: true
    };
  }
  if (pathname.startsWith('/news/')) return ROUTE_SEO['/news'];
  if (pathname.startsWith('/events/')) return ROUTE_SEO['/events'];
  if (pathname.startsWith('/achievements/')) return ROUTE_SEO['/achievements'];
  if (pathname.startsWith('/learning/')) {
    return {
      title: 'Learning Facilities | Ansar English School Thrissur',
      description: 'Explore learning facilities, smart classrooms, labs, safety, transport, and student support at Ansar English School, Perumpilavu, Thrissur.',
      keywords: 'CBSE school facilities Thrissur, smart classrooms Thrissur, school transport Perumpilavu'
    };
  }
  return ROUTE_SEO[pathname] || {
    title: 'Ansar English School | CBSE School in Thrissur, Kerala',
    description: 'Explore Ansar English School, a CBSE Senior Secondary School in Perumpilavu, Thrissur, Kerala known for academic excellence, student care, and value-based education.',
    keywords: DEFAULT_SEO.keywords
  };
}

function SiteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getSeoForPath(pathname);
    const canonicalPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
    const canonicalUrl = `${SITE_URL}${canonicalPath}`;
    const imageUrl = `${SITE_URL}/ansar-logo.png`;

    document.title = seo.title;
    setMetaTag('meta[name="description"]', { name: 'description', content: seo.description });
    setMetaTag('meta[name="keywords"]', { name: 'keywords', content: seo.keywords || DEFAULT_SEO.keywords });
    setMetaTag('meta[name="robots"]', {
      name: 'robots',
      content: seo.noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    });
    setLinkTag('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });
    setMetaTag('meta[property="og:title"]', { property: 'og:title', content: seo.title });
    setMetaTag('meta[property="og:description"]', { property: 'og:description', content: seo.description });
    setMetaTag('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    setMetaTag('meta[property="og:image"]', { property: 'og:image', content: imageUrl });
    setMetaTag('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title });
    setMetaTag('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description });
    setMetaTag('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl });
  }, [pathname]);

  return null;
}

const SAMPLE_PAGES = {
  'sports-page': {
    title: 'Sports',
    subtitle: 'Athletics, games, fitness, and team spirit at Ansar English School.',
    sections: ['Sports Programmes', 'Facilities', 'Training & Events', 'Student Highlights']
  },
  atl: {
    title: 'ATL',
    subtitle: 'Innovation, tinkering, STEM exploration, and student-led problem solving.',
    sections: ['Lab Overview', 'Student Projects', 'Innovation Challenges', 'Gallery']
  },
  'ansar-sprouts': {
    title: 'Ansar Sprouts',
    subtitle: 'A joyful early learning environment for foundational growth.',
    sections: ['Learning Approach', 'Daily Activities', 'Parent Connect', 'Classroom Moments']
  },
  'extension-services': {
    title: 'Extension Services',
    subtitle: 'Community outreach, student service, and support initiatives.',
    sections: ['Service Areas', 'Programmes', 'Community Impact', 'How We Participate']
  },
  'life-at-ansar': {
    title: 'Life at Ansar',
    subtitle: 'A look into campus culture, clubs, celebrations, and student life.',
    sections: ['Campus Life', 'Clubs & Activities', 'Celebrations', 'Student Voices']
  },
  'ansar-times': {
    title: 'Ansar Times',
    subtitle: 'School publications, newsletters, and featured stories.',
    sections: ['Latest Issue', 'Archives', 'Student Contributions', 'Editorial Team']
  },
  alumni: {
    title: 'Alumni',
    subtitle: 'Stories, connections, and achievements from the Ansar alumni community.',
    sections: ['Alumni Network', 'Success Stories', 'Events', 'Get Connected']
  },
  sop: {
    title: 'SOP',
    subtitle: 'Standard operating procedures and essential school guidelines.',
    sections: ['General Guidelines', 'Student Safety', 'Academic Procedures', 'Campus Protocols']
  },
  'mandatory-public-disclosure': {
    title: 'Mandatory Public Disclosure',
    subtitle: 'Required school information and public documents.',
    sections: ['General Information', 'Documents', 'Academic Information', 'Infrastructure Details']
  },
  'ansar-media-production': {
    title: 'Ansar Media and Production',
    subtitle: 'An in-house media production unit documenting campus life, student achievements, institutional milestones, and creative communication at Ansar English School.',
    sections: ['Photography', 'Videography', 'Drone Videography', 'Podcast', 'Graphic Designing', 'Editing']
  }
};

const MEDIA_SERVICES = [
  {
    title: 'Photography',
    kicker: 'Moments with meaning',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=90&w=3840&auto=format&fit=crop',
    body: 'Our photography team captures the spirit of school life with clarity and care. From assemblies, celebrations, competitions, classroom activities, portraits, and official documentation, Ansar Media preserves important moments as high-quality visual records for the institution.',
  },
  {
    title: 'Videography',
    kicker: 'Stories in motion',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=90&w=3840&auto=format&fit=crop',
    body: 'We produce event films, highlight videos, awareness clips, reels, institutional presentations, and programme coverage. The unit supports departments by turning school activities into polished video stories that can be shared with parents, students, alumni, and the wider community.',
  },
  {
    title: 'Drone Videography',
    kicker: 'A wider campus view',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=90&w=3840&auto=format&fit=crop',
    body: 'Aerial visuals bring scale, movement, and a fresh perspective to campus documentation. Drone videography is used for major events, campus showcases, infrastructure highlights, outdoor activities, and special productions where a broader view helps tell the story better.',
  },
  {
    title: 'Podcast',
    kicker: 'Voices from Ansar',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=90&w=3840&auto=format&fit=crop',
    body: 'The podcast setup creates space for student conversations, interviews, academic discussions, alumni interactions, awareness programmes, and leadership messages. It gives the Ansar community a clear voice and encourages confident, thoughtful communication.',
  },
  {
    title: 'Graphic Designing',
    kicker: 'Design for every announcement',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=90&w=3840&auto=format&fit=crop',
    body: 'Our design work supports posters, event announcements, certificates, social media creatives, digital banners, brochures, identity materials, and campaign visuals. Every design is prepared to keep school communication attractive, consistent, and easy to understand.',
  },
  {
    title: 'Editing',
    kicker: 'Finishing every story',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=90&w=3840&auto=format&fit=crop',
    body: 'Editing brings together footage, sound, images, captions, color, and rhythm into a complete final output. The in-house team handles photo retouching, video cuts, event recaps, subtitles, audio cleanup, and final exports for web, social media, archives, and presentations.',
  }
];

const LEARNING_FEATURES = {
  'cctv-enabled-safety': {
    title: 'CCTV-enabled safety',
    kicker: 'Safe campus',
    icon: 'shield',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=90&w=2400&auto=format&fit=crop',
    description: 'A monitored learning environment helps students move through the campus with confidence. Safety systems support staff supervision and create a secure setting for academic and co-curricular activity.',
    points: ['CCTV-supported campus monitoring', 'Structured supervision around key areas', 'A calm environment for focused learning']
  },
  'smart-classrooms': {
    title: 'Spacious classrooms with smart boards',
    kicker: 'Interactive learning',
    icon: 'screen',
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?q=90&w=2400&auto=format&fit=crop',
    description: 'Roomy classrooms and smart-board support help teachers blend explanation, visual learning, discussion, and practice. The setup keeps lessons clear, engaging, and easier to follow.',
    points: ['Spacious rooms for comfortable learning', 'Smart-board enabled explanations', 'Better visual support for concepts']
  },
  'qualified-support-staff': {
    title: 'Qualified support staff',
    kicker: 'Care and guidance',
    icon: 'users',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=90&w=2400&auto=format&fit=crop',
    description: 'Support staff help maintain a smooth daily rhythm for students, teachers, and families. Their presence strengthens care, coordination, and readiness across the school day.',
    points: ['Student-focused assistance through the day', 'Coordination that supports teachers and learners', 'A dependable campus support system']
  },
  'digital-classrooms': {
    title: 'Digital classrooms',
    kicker: 'Technology-enabled',
    icon: 'laptop',
    image: 'https://images.unsplash.com/photo-1584697964192-8f473eed4f56?q=90&w=2400&auto=format&fit=crop',
    description: 'Digital classrooms make lessons more dynamic with multimedia, visual references, and modern teaching tools. Students get richer context while teachers can present ideas with clarity.',
    points: ['Multimedia-supported classroom sessions', 'Digital resources for deeper understanding', 'Modern tools that enrich regular lessons']
  },
  'special-play-area': {
    title: 'Special play area',
    kicker: 'Joyful growth',
    icon: 'smile',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=90&w=2400&auto=format&fit=crop',
    description: 'A dedicated play area gives younger learners space to move, imagine, and build social confidence. Play is treated as a meaningful part of physical, emotional, and creative development.',
    points: ['Dedicated space for active play', 'Supports social and motor-skill development', 'Encourages confidence through joyful activity']
  },
  'advanced-labs': {
    title: 'Purpose-built advanced labs',
    kicker: 'Hands-on discovery',
    icon: 'flask',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=90&w=2400&auto=format&fit=crop',
    description: 'Purpose-built labs help students move from theory to observation, experimentation, and analysis. The learning experience becomes practical, curious, and grounded in real exploration.',
    points: ['Spaces designed for practical learning', 'Hands-on science and skill development', 'Encourages observation, testing, and inquiry']
  },
  'multi-sports-play-area': {
    title: 'Multi-sports play area',
    kicker: 'Fitness and teamwork',
    icon: 'trophy',
    image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=90&w=2400&auto=format&fit=crop',
    description: 'The multi-sports play area supports fitness, coordination, teamwork, and healthy competition. Students get structured opportunities to participate, practice, and build sporting spirit.',
    points: ['Space for multiple sports and activities', 'Builds stamina, teamwork, and discipline', 'Encourages regular physical participation']
  },
  'wi-fi-learning-environment': {
    title: 'Wi-Fi enabled learning environment',
    kicker: 'Connected campus',
    icon: 'wifi',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=90&w=2400&auto=format&fit=crop',
    description: 'A Wi-Fi enabled environment supports digital access for teaching, learning, administration, and communication. It keeps the campus ready for modern academic needs.',
    points: ['Connectivity for digital teaching tools', 'Supports academic and administrative workflows', 'Helps classrooms stay resource-ready']
  },
  'safe-school-transport': {
    title: 'Safe school transport',
    kicker: 'Reliable travel',
    icon: 'bus',
    image: 'https://i.ibb.co/XfX9K6Yv/D3-ZTUDIO-PR0.jpg',
    galleryImages: [
      'https://i.ibb.co/XfX9K6Yv/D3-ZTUDIO-PR0.jpg',
      'https://i.ibb.co/mC8JsJD8/D3-ZTUDIO-PR0-2.jpg',
      'https://i.ibb.co/0y8kKwBz/D3-ZTUDIO-PR0-3.jpg',
      'https://i.ibb.co/fbFfzHV/D3-ZTUDIO-PR0-4.jpg'
    ],
    description: 'Safe school transport at Ansar English School provides dependable daily travel support for students across different routes. The facility is planned around safety, punctuality, care, and parent confidence.',
    body: [
      'Ansar English School operates 30+ school buses across different routes, helping students travel between home and campus in a regular, organized, and comfortable way. The transport facility is designed to make the school day easier for families while ensuring that students can reach the campus on time and return home through a dependable route system.',
      'Every bus has staff members assigned to look after students throughout the journey. Their presence helps maintain discipline, assist younger children, guide boarding and dropping routines, and support student safety from the time they enter the bus until they reach their destination. With careful coordination, route coverage, and attentive supervision, the school transport facility reflects Ansar English School\'s commitment to student care beyond the classroom.'
    ],
    points: ['30+ school buses running on different routes', 'Staff present in every bus to care for students', 'Organized travel routines for safe daily movement']
  }
};

function LearningIcon({ name, className = 'h-8 w-8' }) {
  const shared = { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'aria-hidden': 'true' };
  const pathProps = { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '1.8' };

  switch (name) {
    case 'screen':
      return <svg {...shared}><rect width="20" height="14" x="2" y="3" rx="2" {...pathProps} /><path {...pathProps} d="M8 21h8M12 17v4m-2-9 6-4v8l-6-4Z" /></svg>;
    case 'users':
      return <svg {...shared}><path {...pathProps} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" strokeWidth="1.8" /><path {...pathProps} d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case 'laptop':
      return <svg {...shared}><path {...pathProps} d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.3 2.6a1 1 0 0 1-.9 1.4H3.6a1 1 0 0 1-.9-1.4L4 16" /></svg>;
    case 'smile':
      return <svg {...shared}><circle cx="12" cy="12" r="10" strokeWidth="1.8" /><path {...pathProps} d="M8 14s1.5 2 4 2 4-2 4-2" /><path {...pathProps} d="M9 9h.01M15 9h.01" /></svg>;
    case 'flask':
      return <svg {...shared}><path {...pathProps} d="M10 2v7.3L3 20.1A1.9 1.9 0 0 0 4.6 23h14.8a1.9 1.9 0 0 0 1.6-2.9L14 9.3V2M8.5 2h7M7 15h10" /></svg>;
    case 'trophy':
      return <svg {...shared}><path {...pathProps} d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6m12 5h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17a2 2 0 0 1-2 2H6m8-4.3V17a2 2 0 0 0 2 2h2M18 4c0 3-2 5.5-5 5.5h-2C8 9.5 6 7 6 4V2h12v2Z" /></svg>;
    case 'wifi':
      return <svg {...shared}><path {...pathProps} d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" /></svg>;
    case 'bus':
      return <svg {...shared}><path {...pathProps} d="M8 6v6m7-6v6M2 12h19.6M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2s-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" /><circle cx="7" cy="18" r="2" strokeWidth="1.8" /><circle cx="17" cy="18" r="2" strokeWidth="1.8" /></svg>;
    default:
      return <svg {...shared}><path {...pathProps} d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7Z" /><path {...pathProps} d="M12 8v4M12 16h.01" /></svg>;
  }
}

function LearningImageCarousel({ feature }) {
  const images = feature.galleryImages?.length ? feature.galleryImages : [feature.image].filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleImages = images.length > 1;
  const currentImage = images[activeIndex] || feature.image;

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-slate-100">
        <img
          src={currentImage}
          alt={`${feature.title} facility view ${activeIndex + 1}`}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-emerald-950 shadow-md ring-1 ring-black/5 transition-colors hover:bg-white"
              aria-label="Previous facility image"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 18 9 12l6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-emerald-950 shadow-md ring-1 ring-black/5 transition-colors hover:bg-white"
              aria-label="Next facility image"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="flex items-center justify-center gap-2 px-4 py-4">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${activeIndex === index ? 'w-8 bg-emerald-700' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`}
              aria-label={`Show facility image ${index + 1}`}
              aria-current={activeIndex === index ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [pathname, hash]);

  return null;
}

function AnsarMediaProductionPage() {
  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=90&w=3840&auto=format&fit=crop"
            alt="Ansar Media and Production studio workspace"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/88 to-emerald-950/50" />
          <div className="relative z-10 max-w-4xl px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
            <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-amber-300">In-house Media Unit</p>
            <h1 className="text-4xl font-extrabold leading-tight lg:text-6xl">Ansar Media and Production</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-100/85 lg:text-xl">
              A dedicated creative unit for photography, videography, drone visuals, podcasts, graphic design, and editing at Ansar English School.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-4xl text-center">
          <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Creative documentation</p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 lg:text-5xl">Capturing, creating, and sharing the Ansar story</h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Ansar Media and Production works as the institution's own media studio, supporting academic, cultural, social, and administrative communication with professional visual content.
          </p>
        </section>

        <section className="mt-16 space-y-16">
          {MEDIA_SERVICES.map((service, index) => {
            const reverse = index % 2 === 1;
            return (
              <article key={service.title} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
                <div className={reverse ? 'lg:order-2' : ''}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 shadow-xl">
                    <img
                      src={service.image}
                      alt={`${service.title} at Ansar Media and Production`}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading={index < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-black uppercase tracking-widest text-amber-600">{service.kicker}</p>
                  <h3 className="mt-3 text-3xl font-extrabold text-emerald-950 lg:text-4xl">{service.title}</h3>
                  <p className="mt-5 text-lg leading-relaxed text-slate-600">{service.body}</p>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </Layout>
  );
}

function LearningFeaturePage() {
  const { slug } = useParams();
  const feature = LEARNING_FEATURES[slug];

  if (!feature) {
    return (
      <Layout>
        <main className="mx-auto max-w-4xl px-4 py-24 text-center">
          <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Student-Centric Learning</p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Learning feature not found</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">The campus feature you are looking for is not available.</p>
          <Link to="/#student-centric-learning" className="mt-8 inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-800">
            Back to learning features
          </Link>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
        <section className="relative min-h-[28rem] overflow-hidden rounded-3xl bg-emerald-950 text-white shadow-2xl">
          <img
            src={feature.image}
            alt={`${feature.title} at Ansar English School`}
            className="absolute inset-0 h-full w-full object-cover opacity-45"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/88 to-slate-950/45" />
          <div className="relative z-10 flex min-h-[28rem] max-w-4xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-14">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 text-emerald-950 shadow-lg">
              <LearningIcon name={feature.icon} className="h-9 w-9" />
            </div>
            <p className="text-sm font-extrabold uppercase tracking-widest text-amber-300">{feature.kicker}</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight lg:text-6xl">{feature.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-emerald-50/90 lg:text-xl">{feature.description}</p>
          </div>
        </section>

        <section className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Student-Centric Learning</p>
            <h2 className="mt-3 text-3xl font-extrabold text-emerald-950 lg:text-5xl">Built around student comfort, curiosity, and confidence</h2>
            {(feature.body || [
              'Each facility supports the school day in a practical way: safer movement, clearer lessons, stronger participation, and more opportunities for students to learn by seeing, doing, playing, and collaborating.'
            ]).map((paragraph) => (
              <p key={paragraph} className="mt-6 text-lg leading-relaxed text-slate-600">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="space-y-6">
            <LearningImageCarousel feature={feature} />

            <aside className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                <LearningIcon name={feature.icon} className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-emerald-950">Highlights</h3>
              <ul className="mt-4 space-y-3">
                {feature.points.map(point => (
                  <li key={point} className="flex gap-3 text-sm font-semibold leading-relaxed text-slate-700">
                    <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-amber-500" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>
      </main>
    </Layout>
  );
}

function DynamicPage({ slug: propSlug }) {
  const params = useParams();
  const slug = propSlug || params.slug;
  const { data: pages, loading } = useContentCollection('pages', 'createdAt', 'desc', { firestoreOnly: true });
  
  const page = pages.find(p => p.slug === slug);
  const samplePage = SAMPLE_PAGES[slug];

  if (loading && !page) return <Layout><div className="py-24 text-center"><h2 className="text-2xl font-bold text-slate-900 animate-pulse">Loading page...</h2></div></Layout>;

  if (!page && slug === 'ansar-media-production') {
    return <AnsarMediaProductionPage />;
  }
  
  if (!page && samplePage) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto py-12 lg:py-20 px-4">
          <div className="max-w-3xl mb-12">
            <p className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-3">Ansar English School</p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-5">{samplePage.title}</h1>
            <p className="text-xl text-slate-600 leading-relaxed">{samplePage.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {samplePage.sections.map(section => (
              <section key={section} className="border border-slate-100 bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900 mb-3">{section}</h2>
                <p className="text-slate-600 leading-relaxed">Content for this section will be updated soon.</p>
              </section>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!page) return <Layout><div className="py-24 text-center"><h2 className="text-2xl font-bold text-slate-900">Page Not Found</h2><p className="text-slate-600 mt-4">The page you are looking for does not exist or has not been published yet.</p></div></Layout>;

  return (
    <Layout>
      <ContentPageLayout page={page} />
    </Layout>
  );
}

function SportsPage() {
  const settings = useSettings();
  const sportsItems = mergeListWithDefaults(settings?.sportsItems, DEFAULT_SPORTS_PAGE.items);
  const title = settings?.sportsPageTitle || DEFAULT_SPORTS_PAGE.title;
  const description = settings?.sportsPageDescription || DEFAULT_SPORTS_PAGE.description;

  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
        <section className="relative overflow-hidden rounded-3xl bg-emerald-950 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.22),transparent_34%),linear-gradient(135deg,#0b3c5d,#071827)]" />
          <div className="relative z-10 max-w-4xl px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
            <p className="text-sm font-extrabold uppercase tracking-widest text-amber-300">Sports Programme</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight lg:text-6xl">{title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-emerald-50/90 lg:text-xl">{description}</p>
          </div>
        </section>

        <section className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {sportsItems.map((sport, index) => (
            <article key={`${sport.title}-${index}`} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                {sport.imageUrl ? (
                  <img
                    src={sport.imageUrl}
                    alt={`${sport.title} at Ansar English School`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading={index < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
                        <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                      </svg>
                    </div>
                    <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-400">Image Holder</p>
                    <p className="mt-1 text-sm font-bold text-slate-600">{sport.title}</p>
                  </div>
                )}
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-black uppercase tracking-widest text-amber-600">Ansar Sports</p>
                <h2 className="mt-3 text-2xl font-extrabold text-slate-900">{sport.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">{sport.description}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </Layout>
  );
}

// --- SECURE ADMIN LOGIN COMPONENT ---
function AdminLogin() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, e.target.email.value, e.target.password.value);
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message || "Google sign-in failed.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md border-t-4 border-emerald-500">
        <div className="text-center mb-8">
          <p className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2">Secure Access</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Admin Portal</h1>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">This login is only for authorized school administrators.</p>
        </div>
        {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium border border-red-100">{error}</p>}
        
        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          type="button" 
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center mb-6">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="px-3 text-sm text-slate-400 font-medium">OR</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleEmailAuth}>
          <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
          <input name="email" type="email" required className="w-full mb-5 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          
          <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
          <input name="password" type="password" required className="w-full mb-8 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          
          <button disabled={loading} type="submit" className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-70">
            {loading ? "Processing..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- ADMIN DASHBOARD (ANALYTICS & METRICS) ---
function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('lastLogin', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter(u => (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()));
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const activeUsersCount = users.filter(u => u.lastLogin?.toMillis() > sevenDaysAgo.getTime()).length;

  const exportCSV = () => {
    const headers = ["User Email", "Account Creation Date", "Last Sign-in Timestamp"];
    const rows = filteredUsers.map(u => [
      u.email || 'N/A',
      u.createdAt || 'N/A',
      u.lastLogin ? new Date(u.lastLogin.toMillis()).toLocaleString() : 'N/A'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => `"${e.join('","')}"`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ansar_users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">Total Registered Users</span>
          <strong className="text-4xl font-extrabold text-emerald-950">{users.length}</strong>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">Active Users (7-Day Metric)</span>
          <strong className="text-4xl font-extrabold text-emerald-950">{activeUsersCount}</strong>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">Platform Status</span>
          <strong className="text-xl font-extrabold text-emerald-600 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span> Online & Syncing
          </strong>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-bold text-xl text-slate-800">Last Login Activity Feed</h3>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input type="text" placeholder="Search by email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none w-full sm:w-64" />
            <button onClick={exportCSV} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 z-10">
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-slate-100">User Email</th>
                <th className="p-4 font-bold border-b border-slate-100">Account Creation Date</th>
                <th className="p-4 font-bold border-b border-slate-100">Last Sign-in Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length ? filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-semibold text-slate-800">{u.email}</td>
                  <td className="p-4 text-slate-600 text-sm">{u.createdAt || 'N/A'}</td>
                  <td className="p-4 text-slate-600 text-sm">{u.lastLogin ? new Date(u.lastLogin.toMillis()).toLocaleString() : 'N/A'}</td>
                </tr>
              )) : (
                <tr><td colSpan="3" className="p-8 text-center text-slate-500">No users found matching criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Instantly sync Firebase Auth session state with the React application
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await setDoc(doc(db, 'users', currentUser.uid), {
            email: currentUser.email,
            createdAt: currentUser.metadata.creationTime,
            lastLogin: serverTimestamp()
          }, { merge: true });
        } catch (error) {
          console.error("Error updating user tracking:", error);
        }
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <SettingsProvider>
    <Router>
      <SiteSeo />
      <ScrollToTop />
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/admission" element={<Admission />} />
        <Route path="/news" element={<News />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/sports-page" element={<SportsPage />} />
        <Route path="/atl" element={<DynamicPage slug="atl" />} />
        <Route path="/ansar-sprouts" element={<DynamicPage slug="ansar-sprouts" />} />
        <Route path="/extension-services" element={<DynamicPage slug="extension-services" />} />
        <Route path="/life-at-ansar" element={<DynamicPage slug="life-at-ansar" />} />
        <Route path="/ansar-times" element={<AnsarTimes />} />
        <Route path="/alumni" element={<DynamicPage slug="alumni" />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/sop" element={<DynamicPage slug="sop" />} />
        <Route path="/mandatory-public-disclosure" element={<MandatoryDisclosure />} />
        <Route path="/learning/:slug" element={<LearningFeaturePage />} />
        <Route path="/:slug" element={<DynamicPage />} />
        
        {/* Placeholder detail routes for News/Events cards */}
        <Route path="/news/:id" element={<ArticleView />} />
        <Route path="/events/:id" element={<ArticleView />} />
        <Route path="/achievements/:id" element={<ArticleView />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin/*" element={
          authLoading ? (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : user ? (
            ADMIN_EMAILS.includes(user.email) ? (
              <AdminLayout user={user} onLogout={() => signOut(auth)}>
                <Routes>
                  <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/dashboard" element={<AdminDashboard />} />
                  <Route path="/pages" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/updates" element={<AdminUpdates />} />
                  <Route path="/achievements" element={<AdminAchievements />} />
                  <Route path="/ansar-times" element={<AdminAnsarTimes />} />
                  <Route path="/leadership" element={<AdminLeadership />} />
                  <Route path="/academics" element={<AdminAcademics />} />
                  <Route path="/public-disclosure" element={<AdminPublicDisclosure />} />
                  <Route path="/gallery" element={<AdminGallery />} />
                  <Route path="/notices" element={<AdminNotices />} />
                  <Route path="/settings" element={<AdminSettings />} />
                  <Route path="*" element={<div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-red-500"><h2 className="text-xl font-bold text-slate-800">Module Not Found</h2><p className="text-slate-500">Select a valid module from the sidebar.</p></div>} />
                </Routes>
              </AdminLayout>
            ) : (
              <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-4 border-red-500 text-center">
                  <h1 className="text-2xl font-extrabold text-slate-900 mb-4">Access Denied</h1>
                  <p className="text-slate-600 mb-6">
                    The account <strong className="text-slate-900">{user.email}</strong> is not authorized to access the admin portal.
                  </p>
                  <button onClick={() => signOut(auth)} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-lg hover:bg-slate-800 transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            )
          ) : (
            <AdminLogin />
          )
        } />
      </Routes>
    </Router>
    </SettingsProvider>
  );
}
