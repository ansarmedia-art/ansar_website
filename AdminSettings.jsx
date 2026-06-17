import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase-init';

export default function AdminSettings() {
  const [formData, setFormData] = useState({
    heroTitle: '',
    logoUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    youtubeUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const docSnap = await getDoc(doc(db, 'settings', 'global'));
      if (docSnap.exists()) {
        setFormData(prev => ({ ...prev, ...docSnap.data() }));
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    try {
      await setDoc(doc(db, 'settings', 'global'), {
        ...formData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving settings: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-100">
        <h2 className="text-xl font-bold mb-8 text-slate-800">Global Website Settings</h2>
        
        {message && (
          <div className={`p-4 mb-6 rounded-lg font-bold text-sm ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 p-5 bg-slate-50 border border-slate-100 rounded-xl">
            <h3 className="font-extrabold text-slate-900 mb-2">Core Branding</h3>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Hero Headline Text</label>
              <input name="heroTitle" value={formData.heroTitle} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Main School Logo (Image URL)</label>
              <input name="logoUrl" type="url" value={formData.logoUrl} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>

          <div className="space-y-4 p-5 bg-slate-50 border border-slate-100 rounded-xl">
            <h3 className="font-extrabold text-slate-900 mb-2">Social Media Handles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['facebookUrl', 'instagramUrl', 'youtubeUrl'].map(network => (
                <div key={network}>
                  <label className="block text-sm font-bold text-slate-700 mb-2 capitalize">{network.replace('Url', '')}</label>
                  <input name={network} type="url" value={formData[network]} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full px-6 py-3.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 text-lg shadow-md">
            {isSubmitting ? 'Saving Configurations...' : 'Deploy Global Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}