import React, { useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase-init';
import { useFirestoreCollection } from './useFirestoreCollection';
import ImgBbUrlImporter from './ImgBbUrlImporter';

const MAX_EVENT_IMAGES = 100;

export default function AdminEvents() {
  const { data: items, loading } = useFirestoreCollection('events', 'date', 'desc');
  
  const initialFormState = { title: '', description: '', date: '', imageUrls: [''], published: true };
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
  };

  const addImageUrlField = () => {
    setFormData(prev => {
      const currentImages = Array.isArray(prev.imageUrls) ? prev.imageUrls : [];
      if (currentImages.length >= MAX_EVENT_IMAGES) {
        alert(`You can add up to ${MAX_EVENT_IMAGES} images for one event.`);
        return prev;
      }
      return { ...prev, imageUrls: [...currentImages, ''] };
    });
  };

  const appendImageUrls = (urls) => {
    setFormData(prev => {
      const existing = Array.isArray(prev.imageUrls) ? prev.imageUrls.filter(url => url.trim() !== '') : [];
      const nextImages = [...existing, ...urls].slice(0, MAX_EVENT_IMAGES);
      if (existing.length + urls.length > MAX_EVENT_IMAGES) {
        alert(`Only the first ${MAX_EVENT_IMAGES} image links were added. For bigger albums, create another event/gallery entry.`);
      }
      return { ...prev, imageUrls: nextImages };
    });
  };

  const removeImageUrlField = (index) => {
    if (formData.imageUrls.length <= 1) return; // Keep at least one
    const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ 
      title: item.title || '', 
      description: item.description || '', 
      date: item.date || '',
      imageUrls: item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls : [''],
      published: item.published !== false 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const cleanedImageUrls = formData.imageUrls.filter(url => url.trim() !== '');
      if (cleanedImageUrls.length > MAX_EVENT_IMAGES) {
        alert(`Save failed: one event can have up to ${MAX_EVENT_IMAGES} image links.`);
        return;
      }

      const payload = {
        ...formData,
        imageUrls: cleanedImageUrls,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'events', editingId), payload);
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'events'), payload);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Save failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try { await deleteDoc(doc(db, 'events', id)); } catch (error) { alert("Delete failed."); }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
        <h2 className="text-xl font-bold mb-6 text-slate-800">{editingId ? 'Edit Event' : 'Add New Event'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Event Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Event Date</label>
              <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-24" />
            </div>
            <div className="md:col-span-2 space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label className="block text-sm font-bold text-slate-700">Image URLs</label>
                <ImgBbUrlImporter
                  multiple
                  label="Extract Multiple ImgBB URLs"
                  onExtracted={appendImageUrls}
                />
              </div>
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input 
                    type="url" 
                    value={url} 
                    onChange={(e) => handleImageUrlChange(index, e.target.value)} 
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                  />
                  <button type="button" onClick={() => removeImageUrlField(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-full disabled:opacity-50" disabled={formData.imageUrls.length <= 1}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              ))}
              <button type="button" onClick={addImageUrlField} className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:bg-emerald-50 py-2 px-3 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                Add Image
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input name="published" type="checkbox" checked={formData.published} onChange={handleChange} className="w-5 h-5 text-emerald-600 rounded" />
              Published
            </label>
            <div className="flex gap-3">
              {editingId && <button type="button" onClick={resetForm} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>}
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
                {isSubmitting ? 'Saving...' : (editingId ? 'Update Event' : 'Save Event')}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Current Events</h3>
        {loading ? <p className="text-slate-500">Loading events...</p> : items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-colors">
            <div>
              <h4 className="font-bold text-slate-900">{item.title}</h4>
              <p className="text-sm text-slate-500">{item.date} | {item.published ? 'Published' : 'Draft'}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleEdit(item)} className="px-3 py-1.5 text-sm font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
