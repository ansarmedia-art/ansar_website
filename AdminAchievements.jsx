import React, { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './firebase-init';
import { clearGoogleSheetsCache, useContentCollection } from './useContentCollection';
import { deleteSheetRecord, saveSheetRecord } from './googleSheetsAdminApi';
import ImgBbUrlImporter from './ImgBbUrlImporter';

function getAchievementTime(item) {
  if (item.createdAt?.toMillis) return item.createdAt.toMillis();
  if (item.createdAt?.seconds) return item.createdAt.seconds * 1000;
  if (item.date) return new Date(item.date).getTime() || 0;
  return 0;
}

export default function AdminAchievements() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: items, loading } = useContentCollection('achievements', null, 'desc', { refreshKey });
  const newestFirstItems = [...items].sort((a, b) => getAchievementTime(b) - getAchievementTime(a));
  
  const initialFormState = { title: '', description: '', imageUrl: '', date: '', studentName: '', published: true };
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditingItem(item);
    setFormData({ 
      title: item.title || '',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      date: item.date || '',
      studentName: item.studentName || '',
      published: item.published !== false 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setEditingItem(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData
      };

      let recordId = editingId;
      let firestoreError = null;
      let sheetsError = null;

      try {
        if (editingId && (!editingItem?._contentSource || editingItem._contentSource === 'firestore' || editingItem._contentSource === 'merged')) {
          await updateDoc(doc(db, 'achievements', editingId), {
            ...payload,
            updatedAt: serverTimestamp()
          });
        } else if (!editingId) {
          const docRef = await addDoc(collection(db, 'achievements'), {
            ...payload,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          recordId = docRef.id;
        }
      } catch (error) {
        firestoreError = error;
      }

      try {
        await saveSheetRecord('achievements', { ...payload, id: recordId || undefined });
      } catch (error) {
        sheetsError = error;
      }

      if (firestoreError && sheetsError) {
        throw new Error(`Firestore: ${firestoreError.message}. Sheets: ${sheetsError.message}`);
      }

      clearGoogleSheetsCache();
      setRefreshKey(key => key + 1);
      resetForm();
      if (firestoreError || sheetsError) {
        alert(`Saved with warning: ${firestoreError ? 'Firestore failed. ' : ''}${sheetsError ? 'Google Sheets failed.' : ''}`);
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Save failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Are you sure you want to delete this achievement?")) return;
    try {
      if (!item._contentSource || item._contentSource === 'firestore' || item._contentSource === 'merged') {
        await deleteDoc(doc(db, 'achievements', item.id));
      }
      if (item._contentSource === 'sheets' || item._contentSource === 'merged') {
        await deleteSheetRecord('achievements', item.id);
      }
      clearGoogleSheetsCache();
      setRefreshKey(key => key + 1);
    } catch (error) {
      alert("Delete failed: " + error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-100 mb-8">
        <h2 className="text-xl font-bold mb-6 text-slate-800">{editingId ? 'Edit Achievement' : 'Add New Achievement'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Achievement Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
              <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Student / Team Name</label>
              <input name="studentName" value={formData.studentName} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Image URL</label>
              <div className="space-y-2">
                <input name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/achievement.jpg" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                <ImgBbUrlImporter
                  onExtracted={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-24" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input name="published" type="checkbox" checked={formData.published} onChange={handleChange} className="w-5 h-5 text-emerald-600 rounded" />
              Published (Visible on website)
            </label>
            <div className="flex gap-3">
              {editingId && <button type="button" onClick={resetForm} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>}
              <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
                {isSubmitting ? 'Saving...' : (editingId ? 'Update Achievement' : 'Save Achievement')}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Current Achievements</h3>
        {loading ? <p className="text-slate-500">Loading achievements...</p> : newestFirstItems.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-colors">
            <div>
              <h4 className="font-bold text-slate-900">{item.title}</h4>
              <p className="text-sm text-slate-500">{item.date || 'No date'} | {item.published ? 'Published' : 'Draft'}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleEdit(item)} className="px-3 py-1.5 text-sm font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">Edit</button>
              <button onClick={() => handleDelete(item)} className="px-3 py-1.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
