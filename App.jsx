import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase-init';
import { useFirestoreCollection } from './useFirestoreCollection';

import Layout from './Layout';
import AdminLayout from './AdminLayout';
import Home from './Home';
import About from './About';
import Academics from './Academics';
import Admission from './Admission';
import News from './News';
import Events from './Events';
import Gallery from './Gallery';

// --- AUTHORIZED ADMIN EMAILS ---
const ADMIN_EMAILS = [
  'd3ztudio@gmail.com',
  'ansarmedia@ansarschool.in',
  'ansarschooloffice@gmail.com'
];

function DynamicPage() {
  const { slug } = useParams();
  const { data: pages, loading } = useFirestoreCollection('pages');
  
  const page = pages.find(p => p.slug === slug);

  if (loading && !page) return <Layout><div className="py-24 text-center"><h2 className="text-2xl font-bold text-slate-900 animate-pulse">Loading page...</h2></div></Layout>;
  
  if (!page) return <Layout><div className="py-24 text-center"><h2 className="text-2xl font-bold text-slate-900">Page Not Found</h2><p className="text-slate-600 mt-4">The page you are looking for does not exist or has not been published yet.</p></div></Layout>;

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

// --- SECURE ADMIN LOGIN COMPONENT ---
function AdminLogin() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, e.target.email.value, e.target.password.value);
      } else {
        await signInWithEmailAndPassword(auth, e.target.email.value, e.target.password.value);
      }
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
          <h1 className="text-2xl font-extrabold text-slate-900">{isSignUp ? 'Create Account' : 'Admin Portal'}</h1>
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
            {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-emerald-600 font-bold hover:underline">
            {isSignUp ? "Sign In" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Instantly sync Firebase Auth session state with the React application
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/admission" element={<Admission />} />
        <Route path="/news" element={<News />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/sports-page" element={<DynamicPage slug="sports-page" />} />
        <Route path="/atl" element={<DynamicPage slug="atl" />} />
        <Route path="/ansar-sprouts" element={<DynamicPage slug="ansar-sprouts" />} />
        <Route path="/extension-services" element={<DynamicPage slug="extension-services" />} />
        <Route path="/life-at-ansar" element={<DynamicPage slug="life-at-ansar" />} />
        <Route path="/ansar-times" element={<DynamicPage slug="ansar-times" />} />
        <Route path="/alumni" element={<DynamicPage slug="alumni" />} />
        <Route path="/achievements" element={<DynamicPage slug="achievements" />} />
        <Route path="/sop" element={<DynamicPage slug="sop" />} />
        <Route path="/mandatory-public-disclosure" element={<DynamicPage slug="mandatory-public-disclosure" />} />
        <Route path="/:slug" element={<DynamicPage />} />
        
        {/* Placeholder detail routes for News/Events cards */}
        <Route path="/news/:id" element={<Layout><div className="py-24 text-center"><h2 className="text-2xl font-bold text-slate-900">Article View Coming Soon</h2></div></Layout>} />
        <Route path="/events/:id" element={<Layout><div className="py-24 text-center"><h2 className="text-2xl font-bold text-slate-900">Event View Coming Soon</h2></div></Layout>} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin/*" element={
          user ? (
            ADMIN_EMAILS.includes(user.email) ? (
              <AdminLayout currentModule="Dashboard" user={user} onLogout={() => signOut(auth)}>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 mb-8">
                  <h2 className="text-2xl font-bold mb-2">Welcome back, Admin</h2>
                  <p className="text-slate-600">Select a module from the sidebar to manage the school website content.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-lg text-slate-800 mb-1">Pages Management</h3>
                    <p className="text-sm text-slate-500">Edit dynamic website pages and update SEO metadata.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-lg text-slate-800 mb-1">News & Events</h3>
                    <p className="text-sm text-slate-500">Post announcements and schedule upcoming school events.</p>
                  </div>
                </div>
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
  );
}