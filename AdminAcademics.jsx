import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase-init';

export default function AdminAcademics() {
  const [pdfUrl, setPdfUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const docSnap = await getDoc(doc(db, 'settings', 'global'));
      if (docSnap.exists() && docSnap.data().feeStructurePdfUrl) {
        setPdfUrl(docSnap.data().feeStructurePdfUrl);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    try {
      await setDoc(doc(db, 'settings', 'global'), { feeStructurePdfUrl: pdfUrl, updatedAt: serverTimestamp() }, { merge: true });
      setMessage('Fee Structure PDF updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-100">
        <h2 className="text-xl font-bold mb-6 text-slate-800">Academics & Admissions Tools</h2>
        {message && <div className={`p-4 mb-6 rounded-lg font-bold text-sm ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 p-6 bg-slate-50 border border-slate-100 rounded-xl">
            <h3 className="font-extrabold text-slate-900 mb-2">Admission Documentation</h3>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Latest Fee Structure (Google Drive PDF URL)</label>
              <input type="url" value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} placeholder="https://drive.google.com/file/d/..." className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              <p className="text-xs text-slate-500 mt-2">Paste the shareable link to the PDF. It will automatically convert to a direct download on the frontend.</p>
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full px-6 py-3.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 text-lg shadow-md">
            {isSubmitting ? 'Saving...' : 'Deploy Updates'}
          </button>
        </form>
      </div>
    </div>
  );
}