import React, { useState } from 'react';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './firebase-init';
import { clearGoogleSheetsCache, useContentCollection } from './useContentCollection';
import { saveSheetRecord } from './googleSheetsAdminApi';
import ImgBbUrlImporter from './ImgBbUrlImporter';
import { softDeleteRecord } from './adminUndo';

const MAX_SPORTS_ACHIEVEMENT_IMAGES = 30;

function parseFlexibleDate(value) {
  if (!value) return null;
  const text = String(value).trim();
  const ddmmyyyy = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getAchievementTime(item) {
  const parsedDate = parseFlexibleDate(item.date);
  if (parsedDate) return parsedDate.getTime();
  if (item.createdAt?.toMillis) return item.createdAt.toMillis();
  if (item.createdAt?.seconds) return item.createdAt.seconds * 1000;
  return Number.MIN_SAFE_INTEGER;
}

const initialFormState = {
  title: '',
  description: '',
  imageUrls: [''],
  date: '',
  studentName: '',
  published: true
};

export default function AdminSportsAchievements() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: items, loading } = useContentCollection('sportsAchievements', null, 'asc', { refreshKey });
  const dateOrderedItems = [...items].sort((a, b) => getAchievementTime(b) - getAchievementTime(a));
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUrlChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.map((url, urlIndex) => (urlIndex === index ? value : url))
    }));
  };

  const appendImageUrls = (urls) => {
    setFormData(prev => {
      const existing = Array.isArray(prev.imageUrls) ? prev.imageUrls.filter(url => url.trim() !== '') : [];
      const nextImages = [...existing, ...urls].slice(0, MAX_SPORTS_ACHIEVEMENT_IMAGES);
      if (existing.length + urls.length > MAX_SPORTS_ACHIEVEMENT_IMAGES) {
        alert(`Only the first ${MAX_SPORTS_ACHIEVEMENT_IMAGES} image links were added.`);
      }
      return { ...prev, imageUrls: nextImages.length ? nextImages : [''] };
    });
  };

  const addImageUrlField = () => {
    setFormData(prev => {
      if (prev.imageUrls.length >= MAX_SPORTS_ACHIEVEMENT_IMAGES) {
        alert(`You can add up to ${MAX_SPORTS_ACHIEVEMENT_IMAGES} images for one sports achievement.`);
        return prev;
      }
      return { ...prev, imageUrls: [...prev.imageUrls, ''] };
    });
  };

  const removeImageUrlField = (index) => {
    setFormData(prev => {
      const nextImages = prev.imageUrls.filter((_, imageIndex) => imageIndex !== index);
      return { ...prev, imageUrls: nextImages.length ? nextImages : [''] };
    });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      imageUrls: Array.isArray(item.imageUrls) && item.imageUrls.length > 0 ? item.imageUrls : (item.imageUrl ? [item.imageUrl] : ['']),
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const cleanedImageUrls = formData.imageUrls.map(url => url.trim()).filter(Boolean).slice(0, MAX_SPORTS_ACHIEVEMENT_IMAGES);
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        imageUrl: cleanedImageUrls[0] || '',
        imageUrls: cleanedImageUrls,
        date: formData.date || '',
        studentName: formData.studentName.trim(),
        published: !!formData.published
      };

      let recordId = editingId;
      let firestoreError = null;
      let sheetsError = null;

      try {
        if (editingId && (!editingItem?._contentSource || editingItem._contentSource === 'firestore' || editingItem._contentSource === 'merged')) {
          await updateDoc(doc(db, 'sportsAchievements', editingId), {
            ...payload,
            updatedAt: serverTimestamp()
          });
        } else if (!editingId) {
          const docRef = await addDoc(collection(db, 'sportsAchievements'), {
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
        await saveSheetRecord('sportsAchievements', { ...payload, id: recordId || undefined });
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
      console.error('Error saving sports achievement:', error);
      alert('Save failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Delete this sports achievement?')) return;
    try {
      await softDeleteRecord('sportsAchievements', item, { sheets: true });
      clearGoogleSheetsCache();
      setRefreshKey(key => key + 1);
    } catch (error) {
      alert('Delete failed: ' + error.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 rounded-2xl border border-emerald-100 bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-xl font-bold text-slate-800">{editingId ? 'Edit Sports Achievement' : 'Add Sports Achievement'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold text-slate-700">Achievement Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">Date</label>
              <input name="date" value={formData.date} onChange={handleChange} placeholder="dd/mm/yyyy" className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold text-slate-700">Student / Team Name</label>
              <input name="studentName" value={formData.studentName} onChange={handleChange} className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="md:col-span-2">
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label className="block text-sm font-bold text-slate-700">Achievement Image URLs</label>
                <ImgBbUrlImporter multiple label="Extract Multiple ImgBB URLs" onExtracted={appendImageUrls} />
              </div>
              <div className="space-y-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="flex flex-col gap-2 rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <input type="url" value={url} onChange={(event) => handleImageUrlChange(index, event.target.value)} placeholder="https://example.com/sports-achievement.jpg" className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
                      <button type="button" onClick={() => removeImageUrlField(index)} disabled={formData.imageUrls.length <= 1} className="rounded-lg px-3 py-2 font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40">Remove</button>
                    </div>
                    {url && (
                      <div className="relative h-28 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        <img src={url} alt={`Sports achievement preview ${index + 1}`} className="absolute inset-0 h-full w-full object-contain" />
                      </div>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addImageUrlField} className="rounded-lg px-4 py-2 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50">+ Add another image</button>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold text-slate-700">Article / Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="h-28 w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-700">
              <input name="published" type="checkbox" checked={formData.published} onChange={handleChange} className="h-5 w-5 rounded text-emerald-600" />
              Published on sports page
            </label>
            <div className="flex gap-3">
              {editingId && <button type="button" onClick={resetForm} className="rounded-lg px-5 py-2.5 font-bold text-slate-600 transition-colors hover:bg-slate-100">Cancel</button>}
              <button type="submit" disabled={isSubmitting} className="rounded-lg bg-emerald-600 px-6 py-2.5 font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50">
                {isSubmitting ? 'Saving...' : editingId ? 'Update Sports Achievement' : 'Save Sports Achievement'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="mb-4 text-lg font-bold text-slate-800">Current Sports Achievements</h3>
        {loading ? <p className="text-slate-500">Loading sports achievements...</p> : dateOrderedItems.map(item => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-colors hover:border-emerald-200">
            <div>
              <h4 className="font-bold text-slate-900">{item.title}</h4>
              <p className="text-sm text-slate-500">{item.date || 'No date'} | {item.published ? 'Published' : 'Draft'}</p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <button onClick={() => handleEdit(item)} className="rounded-lg px-3 py-1.5 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-50">Edit</button>
              <button onClick={() => handleDelete(item)} className="rounded-lg px-3 py-1.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
