import React, { useEffect, useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase-init';
import { useFirestoreCollection } from './useFirestoreCollection';
import { useSettings } from './SettingsContext';

const DEFAULT_DISCLOSURE_TITLE = 'Mandatory Public Disclosure';

const DEFAULT_DISCLOSURE_SECTIONS = [
  'General Information',
  'Infrastructure',
  'Academics',
  'Staff Details',
  'Documents',
  'Others'
];

const createInitialFormState = (section = DEFAULT_DISCLOSURE_SECTIONS[0]) => ({
  title: '',
  section,
  documentUrl: '',
  order: 0,
  published: true
});

function cleanSections(sections) {
  const cleaned = (Array.isArray(sections) ? sections : DEFAULT_DISCLOSURE_SECTIONS)
    .map(section => String(section || '').trim())
    .filter(Boolean);

  return cleaned.length ? [...new Set(cleaned)] : DEFAULT_DISCLOSURE_SECTIONS;
}

export default function AdminPublicDisclosure() {
  const { data: documents, loading } = useFirestoreCollection('publicDisclosure', 'order', 'asc');
  const settings = useSettings();
  const [disclosureTitle, setDisclosureTitle] = useState(DEFAULT_DISCLOSURE_TITLE);
  const [disclosureSections, setDisclosureSections] = useState(DEFAULT_DISCLOSURE_SECTIONS);
  const [newSection, setNewSection] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [formData, setFormData] = useState(createInitialFormState());
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const activeSections = cleanSections(disclosureSections);

  useEffect(() => {
    setDisclosureTitle(settings?.mandatoryDisclosureTitle || DEFAULT_DISCLOSURE_TITLE);
    setDisclosureSections(cleanSections(settings?.mandatoryDisclosureSections));
  }, [settings?.mandatoryDisclosureTitle, settings?.mandatoryDisclosureSections]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(createInitialFormState(activeSections[0]));
  };

  const handleAddSection = () => {
    const section = newSection.trim();
    if (!section) return;
    setDisclosureSections(prev => cleanSections([...prev, section]));
    setNewSection('');
  };

  const handleRemoveSection = (sectionToRemove) => {
    const nextSections = activeSections.filter(section => section !== sectionToRemove);
    setDisclosureSections(cleanSections(nextSections));
    setFormData(prev => ({
      ...prev,
      section: prev.section === sectionToRemove ? (nextSections[0] || DEFAULT_DISCLOSURE_SECTIONS[0]) : prev.section
    }));
  };

  const handleSaveDisclosureSettings = async (event) => {
    event.preventDefault();
    setIsSavingSettings(true);

    try {
      const sections = cleanSections(disclosureSections);
      await setDoc(doc(db, 'settings', 'global'), {
        mandatoryDisclosureTitle: disclosureTitle.trim() || DEFAULT_DISCLOSURE_TITLE,
        mandatoryDisclosureSections: sections,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setDisclosureSections(sections);
    } catch (error) {
      alert('Settings save failed: ' + error.message);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
        section: item.section || activeSections[0] || 'Documents',
      documentUrl: item.documentUrl || item.fileUrl || '',
      order: item.order || 0,
      published: item.published !== false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        section: formData.section || activeSections[0] || 'Documents',
        documentUrl: formData.documentUrl.trim(),
        order: Number(formData.order) || 0,
        published: !!formData.published,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'publicDisclosure', editingId), payload);
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'publicDisclosure'), payload);
      }
      resetForm();
    } catch (error) {
      alert('Save failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this disclosure document?')) return;
    try {
      await deleteDoc(doc(db, 'publicDisclosure', id));
    } catch (error) {
      alert('Delete failed: ' + error.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 rounded-2xl border border-emerald-100 bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-xl font-bold text-slate-800">Mandatory Disclosure Settings</h2>
        <form onSubmit={handleSaveDisclosureSettings} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-bold text-slate-700">Page Title</label>
            <input value={disclosureTitle} onChange={(event) => setDisclosureTitle(event.target.value)} className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Sections</label>
            <div className="flex flex-wrap gap-2">
              {activeSections.map(section => (
                <span key={section} className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">
                  {section}
                  <button type="button" onClick={() => handleRemoveSection(section)} className="text-emerald-500 hover:text-red-600" aria-label={`Remove ${section}`}>x</button>
                </span>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input value={newSection} onChange={(event) => setNewSection(event.target.value)} placeholder="Add new section" className="flex-1 rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
              <button type="button" onClick={handleAddSection} className="rounded-lg bg-slate-900 px-5 py-2.5 font-bold text-white transition-colors hover:bg-slate-700">Add</button>
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button type="submit" disabled={isSavingSettings} className="rounded-lg bg-emerald-600 px-6 py-2.5 font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50">
              {isSavingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      <div className="mb-8 rounded-2xl border border-emerald-100 bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-xl font-bold text-slate-800">{editingId ? 'Edit Disclosure Document' : 'Add Disclosure Document'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">Document Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} required placeholder="Fire and Safety Certificate" className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">Section *</label>
              <select name="section" value={formData.section} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500">
                {activeSections.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">Display Order</label>
              <input name="order" type="number" value={formData.order} onChange={handleChange} className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold text-slate-700">Direct PDF URL *</label>
              <input name="documentUrl" type="url" value={formData.documentUrl} onChange={handleChange} required placeholder="https://ansarschool.in/uploads/documents/file.pdf" className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-700">
              <input name="published" type="checkbox" checked={formData.published} onChange={handleChange} className="h-5 w-5 rounded text-emerald-600" />
              Published
            </label>
            <div className="flex gap-3">
              {editingId && <button type="button" onClick={resetForm} className="rounded-lg px-5 py-2.5 font-bold text-slate-600 transition-colors hover:bg-slate-100">Cancel</button>}
              <button type="submit" disabled={isSubmitting} className="rounded-lg bg-emerald-600 px-6 py-2.5 font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50">
                {isSubmitting ? 'Saving...' : editingId ? 'Update Document' : 'Save Document'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="mb-4 text-lg font-bold text-slate-800">Current Disclosure Documents</h3>
        {loading ? <p className="text-slate-500">Loading documents...</p> : documents.map(item => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-colors hover:border-emerald-200">
            <div className="min-w-0">
              <h4 className="truncate font-bold text-slate-900">{item.title}</h4>
              <p className="text-sm text-slate-500">{item.section || 'Documents'} | Order: {item.order || 0} | {item.published !== false ? 'Published' : 'Draft'}</p>
            </div>
            <div className="flex flex-none items-center gap-2">
              <a href={item.documentUrl || item.fileUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg px-3 py-1.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100">View</a>
              <button onClick={() => handleEdit(item)} className="rounded-lg px-3 py-1.5 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-50">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="rounded-lg px-3 py-1.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
