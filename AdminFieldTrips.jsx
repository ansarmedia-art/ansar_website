import React, { useState } from 'react';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './firebase-init';
import { useContentCollection } from './useContentCollection';
import { normalizeImageUrl } from './imageUrlUtils';
import ImgBbUrlImporter from './ImgBbUrlImporter';
import { softDeleteRecord } from './adminUndo';
import { FIELD_TRIP_SECTIONS } from './FieldTrips';

const MAX_IMAGES = 30;
const initialForm = { title: '', section: 'Ansar Sprouts', destination: '', date: '', description: '', imageUrls: [''], published: true };

export default function AdminFieldTrips() {
  const { data, loading } = useContentCollection('fieldTrips', null, 'desc', { firestoreOnly: true });
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const setField = event => { const { name, value, type, checked } = event.target; setForm(current => ({ ...current, [name]: type === 'checkbox' ? checked : value })); };
  const appendImages = urls => setForm(current => ({ ...current, imageUrls: [...new Set([...current.imageUrls.filter(Boolean), ...urls])].slice(0, MAX_IMAGES) }));
  const reset = () => { setEditingId(null); setForm(initialForm); };
  const edit = trip => { setEditingId(trip.id); setForm({ title: trip.title || '', section: trip.section || 'General', destination: trip.destination || '', date: trip.date || '', description: trip.description || '', imageUrls: Array.isArray(trip.imageUrls) && trip.imageUrls.length ? trip.imageUrls : [''], published: trip.published !== false }); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const save = async event => {
    event.preventDefault(); setSaving(true);
    try {
      const imageUrls = [...new Set(form.imageUrls.map(normalizeImageUrl).filter(Boolean))].slice(0, MAX_IMAGES);
      const payload = { title: form.title.trim(), section: form.section, destination: form.destination.trim(), date: form.date, description: form.description.trim(), imageUrls, published: !!form.published, updatedAt: serverTimestamp() };
      if (editingId) await updateDoc(doc(db, 'fieldTrips', editingId), payload);
      else await addDoc(collection(db, 'fieldTrips'), { ...payload, createdAt: serverTimestamp() });
      reset();
    } catch (error) { alert(`Save failed: ${error.message}`); }
    finally { setSaving(false); }
  };

  const remove = async trip => { if (!window.confirm(`Delete “${trip.title}”?`)) return; try { await softDeleteRecord('fieldTrips', trip); } catch (error) { alert(`Delete failed: ${error.message}`); } };

  return <div className="space-y-8">
    <form onSubmit={save} className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl sm:p-8">
      <h2 className="text-2xl font-extrabold text-slate-900">{editingId ? 'Edit Field Trip' : 'Add Field Trip'}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block"><span className="text-sm font-bold text-slate-700">Title *</span><input name="title" value={form.title} onChange={setField} required className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
        <label className="block"><span className="text-sm font-bold text-slate-700">Section *</span><select name="section" value={form.section} onChange={setField} className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500">{FIELD_TRIP_SECTIONS.map(section => <option key={section}>{section}</option>)}</select></label>
        <label className="block"><span className="text-sm font-bold text-slate-700">Destination</span><input name="destination" value={form.destination} onChange={setField} className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
        <label className="block"><span className="text-sm font-bold text-slate-700">Date</span><input type="date" name="date" value={form.date} onChange={setField} className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
      </div>
      <label className="mt-4 block"><span className="text-sm font-bold text-slate-700">Description *</span><textarea name="description" value={form.description} onChange={setField} required className="mt-1 h-40 w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" /></label>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-extrabold text-slate-900">Trip images</h3><p className="text-sm text-slate-500">Up to {MAX_IMAGES} images in carousel order.</p></div><ImgBbUrlImporter multiple label="Extract Multiple ImgBB URLs" onExtracted={appendImages} /></div>
      <div className="mt-4 space-y-3">{form.imageUrls.map((url, index) => <div key={index} className="flex gap-2"><input type="url" value={url} onChange={event => setForm(current => ({ ...current, imageUrls: current.imageUrls.map((image, imageIndex) => imageIndex === index ? event.target.value : image) }))} placeholder={`Trip image ${index + 1}`} className="min-w-0 flex-1 rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" /><button type="button" onClick={() => setForm(current => ({ ...current, imageUrls: current.imageUrls.length === 1 ? [''] : current.imageUrls.filter((_, imageIndex) => imageIndex !== index) }))} className="rounded-xl px-4 font-bold text-red-600 hover:bg-red-50">Remove</button></div>)}</div>
      <button type="button" onClick={() => setForm(current => current.imageUrls.length < MAX_IMAGES ? ({ ...current, imageUrls: [...current.imageUrls, ''] }) : current)} className="mt-4 rounded-xl border border-emerald-200 px-4 py-2 text-sm font-bold text-emerald-700">+ Add image</button>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6"><label className="flex items-center gap-2 font-bold text-slate-700"><input type="checkbox" name="published" checked={form.published} onChange={setField} className="h-5 w-5" /> Published</label><div className="flex gap-3">{editingId && <button type="button" onClick={reset} className="rounded-xl px-5 py-3 font-bold text-slate-600">Cancel</button>}<button type="submit" disabled={saving} className="rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save Field Trip'}</button></div></div>
    </form>

    <section className="space-y-3"><h2 className="text-xl font-extrabold text-slate-900">Field Trips</h2>{loading ? <p>Loading...</p> : [...data].sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).map(trip => <article key={trip.id} className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center"><div className="h-20 w-28 flex-none overflow-hidden rounded-lg bg-slate-100">{trip.imageUrls?.[0] && <img src={trip.imageUrls[0]} alt="" className="h-full w-full object-cover" />}</div><div className="min-w-0 flex-1"><p className="text-xs font-extrabold uppercase text-emerald-700">{trip.section}</p><h3 className="truncate font-extrabold text-slate-900">{trip.title}</h3><p className="text-sm text-slate-500">{trip.date || 'No date'} · {trip.published === false ? 'Draft' : 'Published'}</p></div><div className="flex gap-2"><button type="button" onClick={() => edit(trip)} className="rounded-lg px-3 py-2 font-bold text-emerald-700">Edit</button><button type="button" onClick={() => remove(trip)} className="rounded-lg px-3 py-2 font-bold text-red-600">Delete</button></div></article>)}</section>
  </div>;
}
