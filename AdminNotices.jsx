import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase-init';

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ title: '', message: '', imageUrl: '', active: false, targetType: 'internal', buttonUrl: '/news' });
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    const isInternal = item.buttonUrl?.startsWith('/') || !item.buttonUrl?.startsWith('http');
    setFormData({ 
      title: item.title || '', 
      message: item.message || '', 
      imageUrl: item.imageUrl || '', 
      active: !!item.active,
      targetType: isInternal ? 'internal' : 'external',
      buttonUrl: item.buttonUrl || '/news'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', message: '', imageUrl: '', active: false, targetType: 'internal', buttonUrl: '/news' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        message: formData.message,
        imageUrl: formData.imageUrl || '',
        buttonUrl: formData.buttonUrl,
        active: formData.active,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'notices', editingId), payload);
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'notices'), payload);
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
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try { await deleteDoc(doc(db, 'notices', id)); } catch (error) { alert("Delete failed."); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-100 mb-8">
        <h2 className="text-xl font-bold mb-6 text-slate-800">{editingId ? 'Edit Notice' : 'Create New Notice'}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Notice Title *</label>
            <input name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Important Admission Update" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Notice Message *</label>
            <textarea name="message" value={formData.message} onChange={handleChange} required className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-28 resize-none" placeholder="Enter the brief details here..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Notice Image URL (Optional Banner)</label>
            <input name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/poster.jpg" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-emerald-50/50 border border-emerald-100 rounded-xl">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Redirect Target</label>
              <select name="targetType" value={formData.targetType} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="internal">Specific Internal Page</option>
                <option value="external">Custom External Link</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Destination URL/Path</label>
              {formData.targetType === 'internal' ? (
                <select name="buttonUrl" value={formData.buttonUrl} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="/news">News</option>
                  <option value="/events">Events</option>
                  <option value="/academics">Academics</option>
                  <option value="/admission">Admissions</option>
                </select>
              ) : (
                <input name="buttonUrl" type="url" value={formData.buttonUrl} onChange={handleChange} required placeholder="https://example.com" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer font-bold text-slate-700">
              <input name="active" type="checkbox" checked={formData.active} onChange={handleChange} className="w-5 h-5 text-emerald-600 rounded" />
              Activate Notice (Show on Homepage immediately)
            </label>
            <div className="flex gap-3">
              {editingId && <button type="button" onClick={resetForm} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>}
              <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
                {isSubmitting ? 'Saving...' : (editingId ? 'Update Notice' : 'Save Notice')}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Notice History</h3>
        {loading ? <p className="text-slate-500">Loading...</p> : notices.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-emerald-300 transition-all duration-300">
            <div className="flex-grow min-w-0 pr-4">
              <div className="flex items-center gap-3 mb-1">
                <span className={`w-2.5 h-2.5 rounded-full ${item.active ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                <h4 className="font-bold text-slate-900 truncate">{item.title}</h4>
              </div>
              <p className="text-sm text-slate-500 truncate ml-5">Target: {item.buttonUrl}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleEdit(item)} className="px-4 py-2 text-sm font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}