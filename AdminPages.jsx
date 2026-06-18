import React, { useState } from 'react';
import { collection, setDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase-init';
import { useFirestoreCollection } from './useFirestoreCollection';

export default function AdminPages() {
  const { data: items, loading } = useFirestoreCollection('pages', 'order', 'asc');
  
  const [formData, setFormData] = useState({ title: '', slug: '', subtitle: '', category: '', heroImageUrl: '', bodyHtml: '', virtualTourUrl: '', order: 0, published: true });
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ 
      title: item.title || '', slug: item.slug || item.id, subtitle: item.subtitle || '', category: item.category || '', 
      heroImageUrl: item.heroImageUrl || '', bodyHtml: item.bodyHtml || '', virtualTourUrl: item.virtualTourUrl || '',
      order: item.order || 0, published: item.published !== false 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', slug: '', subtitle: '', category: '', heroImageUrl: '', bodyHtml: '', virtualTourUrl: '', order: 0, published: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Auto-generate slug if left blank
      const slugId = (formData.slug || formData.title).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      const payload = {
        ...formData,
        slug: slugId,
        order: Number(formData.order),
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'pages', editingId), payload);
      } else {
        payload.createdAt = serverTimestamp();
        await setDoc(doc(db, 'pages', slugId), payload);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving:", error);
      alert("Save failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this page? This will break any links pointing to it!")) return;
    try { await deleteDoc(doc(db, 'pages', id)); } catch (error) { alert("Delete failed."); }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-100 mb-8">
        <h2 className="text-xl font-bold mb-6 text-slate-800">{editingId ? 'Edit Page' : 'Add New Custom Page'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Page Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">URL Slug (e.g., 'sports-page')</label>
              <input name="slug" value={formData.slug} onChange={handleChange} placeholder="Leaves blank to auto-generate" disabled={!!editingId} className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-60" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Subtitle / Excerpt</label>
              <textarea name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-16" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Hero Image URL</label>
              <input name="heroImageUrl" type="url" value={formData.heroImageUrl} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Category (Optional)</label>
              <input name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Page Body (HTML allowed) *</label>
              <textarea name="bodyHtml" value={formData.bodyHtml} onChange={handleChange} required className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-48 font-mono text-sm" placeholder="<h2>Your heading</h2><p>Your content...</p>" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input name="published" type="checkbox" checked={formData.published} onChange={handleChange} className="w-5 h-5 text-emerald-600 rounded" />
              Published (Visible to public)
            </label>
            <div className="flex gap-3">
              {editingId && <button type="button" onClick={resetForm} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>}
              <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
                {isSubmitting ? 'Saving...' : (editingId ? 'Update Page' : 'Save Page')}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Current Published Pages</h3>
        {loading ? <p className="text-slate-500">Loading pages...</p> : items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-colors">
            <div>
              <h4 className="font-bold text-slate-900">{item.title} <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded ml-2">/{item.slug}</span></h4>
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