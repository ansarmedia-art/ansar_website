import React, { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase-init';
import ImgBbUrlImporter from './ImgBbUrlImporter';
import { DEFAULT_ACADEMIC_SECTIONS, DEFAULT_SPORTS_PAGE, mergeListWithDefaults } from './contentDefaults';

export default function AdminAcademics() {
  const [formData, setFormData] = useState({
    feeStructurePdfUrl: '',
    sportsPageTitle: DEFAULT_SPORTS_PAGE.title,
    sportsPageDescription: DEFAULT_SPORTS_PAGE.description,
    sportsItems: DEFAULT_SPORTS_PAGE.items,
    academicSections: DEFAULT_ACADEMIC_SECTIONS
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const docSnap = await getDoc(doc(db, 'settings', 'global'));
      if (!docSnap.exists()) return;

      const data = docSnap.data();
      setFormData(prev => ({
        ...prev,
        feeStructurePdfUrl: data.feeStructurePdfUrl || prev.feeStructurePdfUrl,
        sportsPageTitle: data.sportsPageTitle || prev.sportsPageTitle,
        sportsPageDescription: data.sportsPageDescription || prev.sportsPageDescription,
        sportsItems: mergeListWithDefaults(data.sportsItems, DEFAULT_SPORTS_PAGE.items),
        academicSections: mergeListWithDefaults(data.academicSections, DEFAULT_ACADEMIC_SECTIONS)
      }));
    };
    fetchSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleListChange = (listName, index, field, value) => {
    const next = [...formData[listName]];
    next[index] = { ...next[index], [field]: value };
    setFormData(prev => ({ ...prev, [listName]: next }));
  };

  const addSport = () => {
    setFormData(prev => ({
      ...prev,
      sportsItems: [
        ...prev.sportsItems,
        { title: '', description: '', imageUrl: '' }
      ]
    }));
  };

  const removeSport = (index) => {
    setFormData(prev => ({
      ...prev,
      sportsItems: prev.sportsItems.filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const normalizeItems = (items) => items.map(item => ({
    title: item.title || '',
    description: item.description || '',
    imageUrl: item.imageUrl || ''
  }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      await setDoc(doc(db, 'settings', 'global'), {
        feeStructurePdfUrl: formData.feeStructurePdfUrl,
        sportsPageTitle: formData.sportsPageTitle,
        sportsPageDescription: formData.sportsPageDescription,
        sportsItems: normalizeItems(formData.sportsItems),
        academicSections: normalizeItems(formData.academicSections),
        updatedAt: serverTimestamp()
      }, { merge: true });
      setMessage('Academics and sports page content updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-xl font-bold text-slate-800">Academics & Sports Page Editor</h2>
        {message && <div className={`mb-6 rounded-lg p-4 text-sm font-bold ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-4 rounded-xl border border-slate-100 bg-slate-50 p-6">
            <h3 className="font-extrabold text-slate-900">Admission Documentation</h3>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Latest Fee Structure (Google Drive PDF URL)</label>
              <input name="feeStructurePdfUrl" type="url" value={formData.feeStructurePdfUrl} onChange={handleChange} placeholder="https://drive.google.com/file/d/..." className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
              <p className="mt-2 text-xs text-slate-500">Paste the shareable link to the PDF. The frontend will use this for the fee structure button.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-slate-100 bg-slate-50 p-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Sports Page</p>
              <h3 className="mt-1 font-extrabold text-slate-900">Sports page text and images</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Page Title</label>
                <input name="sportsPageTitle" value={formData.sportsPageTitle} onChange={handleChange} className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Page Description</label>
                <textarea name="sportsPageDescription" value={formData.sportsPageDescription} onChange={handleChange} className="h-24 w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {formData.sportsItems.map((sport, index) => (
                <div key={`sport-${index}`} className="space-y-3 rounded-xl border border-white bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-bold text-emerald-800">{sport.title || `Sport ${index + 1}`}</h4>
                    <button
                      type="button"
                      onClick={() => removeSport(index)}
                      disabled={formData.sportsItems.length <= 1}
                      className="rounded-lg border border-red-100 px-3 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                  <input value={sport.title || ''} onChange={(event) => handleListChange('sportsItems', index, 'title', event.target.value)} placeholder="Sport title" className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                  <textarea value={sport.description || ''} onChange={(event) => handleListChange('sportsItems', index, 'description', event.target.value)} placeholder="Sport description" className="h-24 w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                  <input value={sport.imageUrl || ''} onChange={(event) => handleListChange('sportsItems', index, 'imageUrl', event.target.value)} placeholder="Image URL" className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                  <ImgBbUrlImporter onExtracted={(url) => handleListChange('sportsItems', index, 'imageUrl', url)} />
                </div>
              ))}
            </div>
            <button type="button" onClick={addSport} className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-100 transition-colors hover:bg-emerald-50">
              + Add Sport
            </button>
          </section>

          <section className="space-y-4 rounded-xl border border-slate-100 bg-slate-50 p-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Academics Page</p>
              <h3 className="mt-1 font-extrabold text-slate-900">Section descriptions and image holders</h3>
            </div>
            <div className="space-y-4">
              {formData.academicSections.map((section, index) => (
                <div key={`academic-section-${index}`} className="grid grid-cols-1 gap-4 rounded-xl border border-white bg-white p-4 shadow-sm lg:grid-cols-[1fr_1.3fr]">
                  <div className="space-y-3">
                    <div className="inline-flex rounded-lg bg-slate-100 px-3 py-2 text-sm font-black text-slate-600">#{index + 1}</div>
                    <input value={section.title || ''} onChange={(event) => handleListChange('academicSections', index, 'title', event.target.value)} placeholder="Section title" className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                    <input value={section.imageUrl || ''} onChange={(event) => handleListChange('academicSections', index, 'imageUrl', event.target.value)} placeholder="Image URL" className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                    <ImgBbUrlImporter onExtracted={(url) => handleListChange('academicSections', index, 'imageUrl', url)} />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Description</label>
                    <textarea value={section.description || ''} onChange={(event) => handleListChange('academicSections', index, 'description', event.target.value)} className="h-40 w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-emerald-600 px-6 py-3.5 text-lg font-bold text-white shadow-md transition-colors hover:bg-emerald-700 disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Deploy Page Updates'}
          </button>
        </form>
      </div>
    </div>
  );
}
