import React, { useMemo, useState } from 'react';
import { clearGoogleSheetsCache, useContentCollection } from './useContentCollection';
import { deleteSheetRecord, saveSheetRecord } from './googleSheetsAdminApi';
import {
  ANSAR_TIMES_MONTHS,
  ANSAR_TIMES_START_YEAR,
  clearAnsarTimesDeleted,
  getAnsarTimesId,
  getAnsarTimesPdfUrl,
  getAnsarTimesYears,
  isAnsarTimesDeleted,
  markAnsarTimesDeleted
} from './ansarTimesConfig';

const createInitialFormState = () => ({
  year: ANSAR_TIMES_START_YEAR,
  month: ANSAR_TIMES_MONTHS[0].value,
  pdfUrl: '',
  published: true
});

function getMonthIndex(month) {
  return ANSAR_TIMES_MONTHS.find(item => item.value === month)?.index || 0;
}

export default function AdminAnsarTimes() {
  const years = getAnsarTimesYears(2);
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: entries, loading } = useContentCollection('ansarTimes', null, 'desc', { sheetsOnly: true, refreshKey });
  const [formData, setFormData] = useState(createInitialFormState);
  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedEntries = useMemo(() => {
    return entries.filter(item => !isAnsarTimesDeleted(item)).sort((a, b) => {
      const yearDiff = Number(b.year || 0) - Number(a.year || 0);
      if (yearDiff) return yearDiff;
      return Number(a.monthIndex || getMonthIndex(a.month)) - Number(b.monthIndex || getMonthIndex(b.month));
    });
  }, [entries]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setEditingItem(null);
    setFormData(createInitialFormState());
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditingItem(item);
    setFormData({
      year: Number(item.year) || years[0],
      month: item.month || ANSAR_TIMES_MONTHS[0].value,
      pdfUrl: getAnsarTimesPdfUrl(item),
      published: item.published !== false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedYear = Number(formData.year);
      const selectedMonth = formData.month;
      const nextRecordId = getAnsarTimesId(selectedYear, selectedMonth);
      const payload = {
        id: nextRecordId,
        year: selectedYear,
        month: selectedMonth,
        monthIndex: getMonthIndex(selectedMonth),
        pdfUrl: formData.pdfUrl.trim(),
        published: !!formData.published
      };

      await saveSheetRecord('ansarTimes', payload);
      clearAnsarTimesDeleted(payload);
      if (editingId && editingId !== nextRecordId) {
        await deleteSheetRecord('ansarTimes', editingId, {
          year: editingItem?.year,
          month: editingItem?.month,
          monthIndex: editingItem?.monthIndex,
          pdfUrl: getAnsarTimesPdfUrl(editingItem)
        });
      }
      clearGoogleSheetsCache();
      setRefreshKey(key => key + 1);
      resetForm();
    } catch (error) {
      alert('Save failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete Ansar Times - ${item.month} ${item.year}?`)) return;
    try {
      markAnsarTimesDeleted(item);
      clearGoogleSheetsCache();
      setRefreshKey(key => key + 1);
      await deleteSheetRecord('ansarTimes', item.id, {
        year: item.year,
        month: item.month,
        monthIndex: item.monthIndex,
        pdfUrl: getAnsarTimesPdfUrl(item)
      });
      if (editingId === item.id) resetForm();
    } catch (error) {
      alert('Delete failed: ' + error.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 rounded-2xl border border-emerald-100 bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-xl font-bold text-slate-800">{editingId ? 'Edit Ansar Times PDF' : 'Add Ansar Times PDF'}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">Year *</label>
              <select name="year" value={formData.year} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500">
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">Month *</label>
              <select name="month" value={formData.month} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500">
                {ANSAR_TIMES_MONTHS.map(month => <option key={month.value} value={month.value}>{month.label}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold text-slate-700">Google Drive / PDF Link *</label>
              <input
                name="pdfUrl"
                type="url"
                value={formData.pdfUrl}
                onChange={handleChange}
                required
                placeholder="https://drive.google.com/file/d/..."
                className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-700">
              <input name="published" type="checkbox" checked={formData.published} onChange={handleChange} className="h-5 w-5 rounded text-emerald-600" />
              Active on website
            </label>
            <div className="flex gap-3">
              {editingId && <button type="button" onClick={resetForm} className="rounded-lg px-5 py-2.5 font-bold text-slate-600 transition-colors hover:bg-slate-100">Cancel</button>}
              <button type="submit" disabled={isSubmitting} className="rounded-lg bg-emerald-600 px-6 py-2.5 font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50">
                {isSubmitting ? 'Saving...' : editingId ? 'Update PDF Link' : 'Save PDF Link'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="mb-4 text-lg font-bold text-slate-800">Current Ansar Times Links</h3>
        {loading ? <p className="text-slate-500">Loading Ansar Times links...</p> : sortedEntries.length ? sortedEntries.map(item => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-colors hover:border-emerald-200">
            <div className="min-w-0">
              <h4 className="truncate font-bold text-slate-900">ANSAR TIMES - {item.month} <span className="text-slate-500">({item.year})</span></h4>
              <p className="truncate text-sm text-slate-500">{item.published !== false ? 'Active' : 'Inactive'} | {getAnsarTimesPdfUrl(item)}</p>
            </div>
            <div className="flex flex-none items-center gap-2">
              <a href={getAnsarTimesPdfUrl(item)} target="_blank" rel="noopener noreferrer" className="rounded-lg px-3 py-1.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100">View</a>
              <button onClick={() => handleEdit(item)} className="rounded-lg px-3 py-1.5 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-50">Edit</button>
              <button onClick={() => handleDelete(item)} className="rounded-lg px-3 py-1.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50">Delete</button>
            </div>
          </div>
        )) : (
          <p className="rounded-xl border border-slate-100 bg-white p-8 text-center font-bold text-slate-500">No Ansar Times links added yet.</p>
        )}
      </div>
    </div>
  );
}
