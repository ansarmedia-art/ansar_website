import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase-init';

// Utility to clean raw Google Image Search URLs
const cleanImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  
  const trimmedUrl = url.trim();
  
  try {
    const urlObj = new URL(trimmedUrl);
    
    // Intercept Google Images redirect URLs
    if (urlObj.hostname.includes('google.com') && urlObj.pathname.includes('/imgres')) {
      const imgUrlParam = urlObj.searchParams.get('imgurl');
      // URLSearchParams automatically handles decodeURIComponent behind the scenes
      if (imgUrlParam) return imgUrlParam; 
    }
    return trimmedUrl;
  } catch (e) {
    return trimmedUrl; // Fallback to raw string if parsing fails
  }
};

export default function AdminUpdates() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const initialFormState = { category: 'News', title: '', description: '', date: '', imageUrl: '', imageUrls: [''], published: true };
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'updates'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
  };

  const addImageUrlField = () => setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }));
  const removeImageUrlField = (index) => {
    if (formData.imageUrls.length <= 1) return;
    setFormData(prev => ({ ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== index) }));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ 
      category: item.category || 'News',
      title: item.title || '', 
      description: item.description || '', 
      date: item.date || '',
      imageUrl: item.imageUrl || '',
      imageUrls: Array.isArray(item.imageUrls) && item.imageUrls.length > 0 ? item.imageUrls : [''],
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
      const cleanedImageUrl = cleanImageUrl(formData.imageUrl);
      // Map, clean, and filter out any empty string entries before saving
      const cleanedImageUrls = (Array.isArray(formData.imageUrls) ? formData.imageUrls : [])
        .map(url => cleanImageUrl(url))
        .filter(url => url.trim() !== '');

      const payload = {
        ...formData,
        imageUrl: cleanedImageUrl,
        imageUrls: cleanedImageUrls,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'updates', editingId), payload);
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'updates'), payload);
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
    if (!window.confirm("Are you sure you want to delete this publication?")) return;
    try { await deleteDoc(doc(db, 'updates', id)); } catch (error) { alert("Delete failed."); }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
        <h2 className="text-xl font-bold mb-6 text-slate-800">{editingId ? 'Edit Publication' : 'Add News / Event'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Category (News or Event) *</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="News">News</option>
                <option value="Events">Events</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Date (e.g., 24 JUN 2024)</label>
              <input name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Description / Content</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-24" />
            </div>
            
            <div className="md:col-span-2 space-y-3 p-4 bg-slate-50 border border-slate-100 rounded-lg">
              {formData.category === 'News' ? (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">News Cover Image URL</label>
                  <input name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/cover.jpg" className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Event Image URLs (Carousel)</label>
                  {Array.isArray(formData.imageUrls) && formData.imageUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input type="url" value={url} onChange={(e) => handleImageUrlChange(index, e.target.value)} placeholder="https://example.com/image.jpg" className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                      <button type="button" onClick={() => removeImageUrlField(index)} disabled={formData.imageUrls.length <= 1} className="p-2 text-red-500 hover:bg-red-50 rounded-full disabled:opacity-50">✕</button>
                    </div>
                  ))}
                  <button type="button" onClick={addImageUrlField} className="text-sm font-bold text-emerald-600 hover:bg-emerald-50 py-1 px-3 rounded-lg transition-colors">+ Add Another Event Image</button>
                </div>
              )}
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
                {isSubmitting ? 'Saving...' : (editingId ? 'Update Post' : 'Publish')}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Current Publications</h3>
        {loading ? <p className="text-slate-500">Loading...</p> : items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-emerald-200 transition-colors">
            
            {/* Defensive Thumbnail Rendering */}
            <div className="flex-shrink-0 w-16 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
              {item.category === 'News' && item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt="Thumbnail" 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/e2e8f0/94a3b8?text=Error'; }} 
                />
              ) : item.category === 'Events' && Array.isArray(item.imageUrls) && item.imageUrls.length > 0 ? (
                <img 
                  src={item.imageUrls[0]} 
                  alt="Thumbnail" 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/e2e8f0/94a3b8?text=Error'; }} 
                />
              ) : (
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              )}
            </div>

            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${item.category === 'News' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{item.category}</span>
                <h4 className="font-bold text-slate-900 truncate">{item.title}</h4>
              </div>
              <p className="text-sm text-slate-500 mt-1">{item.date} | {item.published ? 'Published' : 'Draft'}</p>
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