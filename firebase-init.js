// Firebase project configuration
window.firebaseConfig = {
  apiKey: "AIzaSyApBeUtd8i7VC6wpOSxjD1PPYjQEQBGQ4Y",
  authDomain: "ansar-english-school.firebaseapp.com",
  projectId: "ansar-english-school",
  storageBucket: "ansar-english-school.firebasestorage.app",
  messagingSenderId: "729617648651",
  appId: "1:729617648651:web:f5d90b86b9b387d86b0b0e",
  measurementId: "G-Y7YNPNVFP1"
};

// Firebase compat SDKs loaded via CDN (for backward compatibility with existing code)
const firebaseScripts = [
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics-compat.js'
];

function loadFirebaseScripts() {
  return Promise.all(firebaseScripts.map(src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  })));
}

async function initFirebase() {
  // If compat SDK loaded and no apps initialized yet
  if (window.firebase && !window.firebase.apps.length) {
    window.firebase.initializeApp(window.firebaseConfig);
    try {
      // initialize analytics if available
      if (window.firebase.analytics) {
        window.firebase.analytics();
      }
    } catch (e) {
      console.warn('Analytics init skipped', e);
    }
    window.app = window.firebase.app();
    window.auth = window.firebase.auth();
    window.db = window.firebase.firestore();
    window.FieldValue = window.firebase.firestore.FieldValue;
  }
}

// Initialize Firebase when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFirebase);
} else {
  initFirebase();
}

window.addEventListener('load', async () => {
  try {
    await loadFirebaseScripts();
    await initFirebase();
    console.info('Firebase initialized for project:', firebaseConfig.projectId);
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
});
