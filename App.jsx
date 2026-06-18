import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase-init';
import { useFirestoreCollection } from './useFirestoreCollection';

import Layout from './Layout';
import AdminLayout from './AdminLayout';
import Home from './Home';
import About from './About';
import Academics from './Academics';
import Admission from './Admission';
import News from './News';
import Events from './Events';
import Contact from './Contact';
import Gallery from './Gallery';
import AdminPages from './AdminPages';
import AdminUpdates from './AdminUpdates';
import AdminAchievements from './AdminAchievements';
import AdminLeadership from './AdminLeadership';
import AdminNotices from './AdminNotices';
import AdminAcademics from './AdminAcademics';
import ArticleView from './ArticleView';
import AdminSettings from './AdminSettings';
import { SettingsProvider } from './SettingsContext';

// --- AUTHORIZED ADMIN EMAILS ---
const ADMIN_EMAILS = [
  'd3ztudio@gmail.com',
  'ansarmedia@ansarschool.in',
  'ansarschooloffice@gmail.com'
];

function DynamicPage({ slug: propSlug }) {
  const params = useParams();
  const slug = propSlug || params.slug;
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
        <Route path="/news/:id" element={<ArticleView />} />
        <Route path="/events/:id" element={<ArticleView />} />

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
                  {/* Fallbacks to prevent white screens on empty routes */}
                  <Route path="/pages" element={<AdminPages />} />
                  <Route path="/updates" element={<AdminUpdates />} />
                  <Route path="/achievements" element={<AdminAchievements />} />
                  <Route path="/leadership" element={<AdminLeadership />} />
                  <Route path="/academics" element={<AdminAcademics />} />
                  <Route path="/gallery" element={<div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100"><h2 className="text-xl font-bold">Gallery</h2><p className="text-slate-500">Module under construction.</p></div>} />
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