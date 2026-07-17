import React, { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './firebase-init';
import ImgBbUrlImporter from './ImgBbUrlImporter';
import { softDeleteRecord, softDeleteRecords } from './adminUndo';
import { imageCandidates, normalizeImageUrl } from './imageUrlUtils';
import { formatDisplayDate, getDateTime } from './dateUtils';
import { clearGoogleSheetsCache, useContentCollection } from './useContentCollection';
import { saveSheetRecord } from './googleSheetsAdminApi';

function getMillis(item) {
  const dateTime = getDateTime(item.date, null);
  if (dateTime != null) return dateTime;
  if (item.createdAt?.toMillis) return item.createdAt.toMillis();
  if (item.createdAt?.seconds) return item.createdAt.seconds * 1000;
  return 0;
}

function imageFromGalleryItem(item) {
  const url = normalizeImageUrl(item.imageUrl);
  if (!url) return null;

  return {
    id: item.id,
    recordId: item.id,
    source: 'gallery',
    sourceLabel: 'Gallery',
    url,
    title: item.title || 'Gallery Image',
    category: item.category || 'General',
    date: formatDisplayDate(item.date),
    published: item.published !== false,
    timestamp: getMillis(item),
    raw: item
  };
}

function collectSourceImages(updates, achievements, sportsAchievements) {
  const imagesByUrl = new Map();
  const addImage = (url, item, meta) => {
    const normalizedUrl = normalizeImageUrl(url);
    if (!normalizedUrl) return;

    const image = {
      id: meta.id,
      recordId: item.id,
      source: meta.source,
      sourceLabel: meta.sourceLabel,
      url: normalizedUrl,
      title: meta.title,
      category: meta.category,
      date: formatDisplayDate(item.date),
      published: true,
      timestamp: getMillis(item),
      raw: item
    };
    const existing = imagesByUrl.get(normalizedUrl);
    if (!existing || image.timestamp > existing.timestamp) imagesByUrl.set(normalizedUrl, image);
  };

  updates.filter(item => item.published !== false).forEach(item => {
    let index = 0;
    imageCandidates(item.coverImageUrl, item.imageUrl, item.eventImages, item.imageUrls).forEach(url => {
      addImage(url, item, {
        id: `${item.id}-update-${index++}`,
        source: 'updates',
        sourceLabel: item.category === 'Events' ? 'Event' : 'News',
        title: item.title || 'School Update',
        category: item.category || 'News & Events'
      });
    });
  });

  achievements.filter(item => item.published !== false).forEach(item => {
    let index = 0;
    imageCandidates(item.imageUrl, item.imageUrls).forEach(url => {
      addImage(url, item, {
        id: `${item.id}-achievement-${index++}`,
        source: 'achievements',
        sourceLabel: 'Achievement',
        title: item.title || 'Achievement',
        category: 'Achievements'
      });
    });
  });

  sportsAchievements.filter(item => item.published !== false).forEach(item => {
    let index = 0;
    imageCandidates(item.imageUrl, item.imageUrls).forEach(url => {
      addImage(url, item, {
        id: `${item.id}-sports-achievement-${index++}`,
        source: 'sportsAchievements',
        sourceLabel: 'Sports Achievement',
        title: item.title || 'Sports Achievement',
        category: 'Sports Achievements'
      });
    });
  });

  return Array.from(imagesByUrl.values()).sort((a, b) => b.timestamp - a.timestamp);
}

function collectWebsiteImages(galleryItems, updates, achievements, sportsAchievements) {
  const sourceImages = collectSourceImages(updates, achievements, sportsAchievements);
  const imagesByUrl = new Map(sourceImages.map(item => [item.url, item]));

  galleryItems.forEach(item => {
    const galleryImage = imageFromGalleryItem(item);
    if (galleryImage && galleryImage.published && !imagesByUrl.has(galleryImage.url)) {
      imagesByUrl.set(galleryImage.url, galleryImage);
    }
  });

  return Array.from(imagesByUrl.values()).sort((a, b) => b.timestamp - a.timestamp);
}

function removeUrlsFromRecord(item, urlsToDelete) {
  const deleted = new Set(urlsToDelete.map(normalizeImageUrl));
  const next = { ...item };
  ['coverImageUrl', 'imageUrl', 'thumbnailUrl'].forEach(field => {
    if (deleted.has(normalizeImageUrl(next[field]))) next[field] = '';
  });
  ['eventImages', 'imageUrls'].forEach(field => {
    if (Array.isArray(next[field])) {
      next[field] = next[field].filter(url => !deleted.has(normalizeImageUrl(url)));
    }
  });
  if (!next.imageUrl && next.imageUrls?.length) next.imageUrl = next.imageUrls[0];
  if (!next.coverImageUrl && next.eventImages?.length) next.coverImageUrl = next.eventImages[0];
  return next;
}

function sheetSafeRecord(item) {
  const { _contentSource, _sheetRowIndex, recordId, raw, ...record } = item;
  return record;
}

const initialFormState = {
  title: '',
  category: 'General',
  date: '',
  imageUrls: [''],
  published: true
};

const GALLERY_BATCH_SIZE = 48;

export default function AdminGallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [sportsAchievements, setSportsAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [visibleLimit, setVisibleLimit] = useState(GALLERY_BATCH_SIZE);
  const [contentRefreshKey, setContentRefreshKey] = useState(0);
  const { data: mergedUpdates, loading: loadingUpdates } = useContentCollection('updates', null, 'desc', { refreshKey: contentRefreshKey });
  const { data: mergedAchievements, loading: loadingAchievements } = useContentCollection('achievements', null, 'desc', { refreshKey: contentRefreshKey });
  const { data: mergedSportsAchievements, loading: loadingSportsAchievements } = useContentCollection('sportsAchievements', null, 'desc', { refreshKey: contentRefreshKey });

  useEffect(() => {
    let loadedGallery = false;
    const publishLoading = () => setLoading(!loadedGallery);

    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      loadedGallery = true;
      setGalleryItems(snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })));
      publishLoading();
    }, (error) => {
      loadedGallery = true;
      publishLoading();
      console.error('Unable to load gallery:', error);
    });

    return () => {
      unsubGallery();
    };
  }, []);

  useEffect(() => setUpdates(mergedUpdates), [mergedUpdates]);
  useEffect(() => setAchievements(mergedAchievements), [mergedAchievements]);
  useEffect(() => setSportsAchievements(mergedSportsAchievements), [mergedSportsAchievements]);

  const websiteImages = useMemo(() => {
    return collectWebsiteImages(galleryItems, updates, achievements, sportsAchievements);
  }, [galleryItems, updates, achievements, sportsAchievements]);

  const managedImages = websiteImages;

  const duplicateGalleryItems = useMemo(() => {
    const sourceUrls = new Set(collectSourceImages(updates, achievements, sportsAchievements).map(item => item.url));
    const seenGalleryUrls = new Set();
    const duplicates = [];

    galleryItems
      .slice()
      .sort((a, b) => getMillis(b) - getMillis(a))
      .forEach(item => {
        const url = normalizeImageUrl(item.imageUrl);
        if (!url) {
          duplicates.push(item);
          return;
        }
        if (sourceUrls.has(url) || seenGalleryUrls.has(url)) {
          duplicates.push(item);
          return;
        }
        seenGalleryUrls.add(url);
      });

    return duplicates;
  }, [galleryItems, updates, achievements, sportsAchievements]);

  const categories = useMemo(() => {
    return ['All', ...new Set(managedImages.map(item => item.category).filter(Boolean))];
  }, [managedImages]);

  const visibleManagedImages = managedImages.filter(item => {
    const matchesFilter = filter === 'All' || item.category === filter;
    const haystack = `${item.title} ${item.category} ${item.date}`.toLowerCase();
    return matchesFilter && haystack.includes(searchTerm.toLowerCase());
  });
  const displayedManagedImages = visibleManagedImages.slice(0, visibleLimit);

  const allVisibleSelected = displayedManagedImages.length > 0 && displayedManagedImages.every(item => selectedIds.includes(item.id));

  useEffect(() => {
    setVisibleLimit(GALLERY_BATCH_SIZE);
  }, [filter, searchTerm]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUrlChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.map((url, urlIndex) => (urlIndex === index ? value : url))
    }));
  };

  const appendImageUrls = (urls) => {
    setFormData(prev => {
      const currentUrls = prev.imageUrls.filter(url => url.trim() !== '');
      return { ...prev, imageUrls: [...currentUrls, ...urls] };
    });
  };

  const addImageUrlField = () => {
    setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }));
  };

  const removeImageUrlField = (index) => {
    setFormData(prev => {
      const nextUrls = prev.imageUrls.filter((_, urlIndex) => urlIndex !== index);
      return { ...prev, imageUrls: nextUrls.length ? nextUrls : [''] };
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleEdit = (item) => {
    setEditingId(item.recordId);
    setFormData({
      title: item.raw.title || '',
      category: item.raw.category || 'General',
      date: item.raw.date || '',
      imageUrls: [item.raw.imageUrl || ''],
      published: item.raw.published !== false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanedUrls = [...new Set(formData.imageUrls.map(url => normalizeImageUrl(url)).filter(Boolean))];

    if (!cleanedUrls.length) {
      alert('Please add at least one image URL.');
      return;
    }

    setIsSubmitting(true);
    try {
      const basePayload = {
        title: formData.title.trim() || 'Gallery Image',
        category: formData.category.trim() || 'General',
        date: formData.date || '',
        published: !!formData.published
      };

      if (editingId) {
        await updateDoc(doc(db, 'gallery', editingId), {
          ...basePayload,
          imageUrl: cleanedUrls[0],
          updatedAt: serverTimestamp()
        });
      } else {
        await Promise.all(cleanedUrls.map((imageUrl, index) => addDoc(collection(db, 'gallery'), {
          ...basePayload,
          title: cleanedUrls.length > 1 && basePayload.title === 'Gallery Image' ? `Gallery Image ${index + 1}` : basePayload.title,
          imageUrl,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })));
      }

      resetForm();
    } catch (error) {
      console.error('Gallery save failed:', error);
      alert('Save failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    const visibleIds = displayedManagedImages.map(item => item.id);
    setSelectedIds(prev => {
      if (visibleIds.every(id => prev.includes(id))) {
        return prev.filter(id => !visibleIds.includes(id));
      }
      return [...new Set([...prev, ...visibleIds])];
    });
  };

  const clearSelection = () => setSelectedIds([]);

  const deleteSourceImages = async (images) => {
    const galleryImages = images.filter(item => item.source === 'gallery');
    for (const item of galleryImages) {
      await softDeleteRecord('gallery', item.raw || item, { docId: item.recordId });
    }

    const sourceGroups = new Map();
    images.filter(item => item.source !== 'gallery').forEach(item => {
      const key = `${item.source}:${item.recordId}`;
      const group = sourceGroups.get(key) || { collectionName: item.source, item: item.raw, urls: [] };
      group.urls.push(item.url);
      sourceGroups.set(key, group);
    });

    for (const group of sourceGroups.values()) {
      const nextRecord = removeUrlsFromRecord(group.item, group.urls);
      const source = group.item._contentSource || 'firestore';
      if (source !== 'sheets') {
        const imagePayload = group.collectionName === 'updates'
          ? {
              coverImageUrl: nextRecord.coverImageUrl || '',
              imageUrl: nextRecord.imageUrl || '',
              thumbnailUrl: nextRecord.thumbnailUrl || '',
              eventImages: nextRecord.eventImages || [],
              imageUrls: nextRecord.imageUrls || []
            }
          : {
              imageUrl: nextRecord.imageUrl || '',
              imageUrls: nextRecord.imageUrls || []
            };
        await updateDoc(doc(db, group.collectionName, group.item.id), { ...imagePayload, updatedAt: serverTimestamp() });
      }
      if (source === 'sheets' || source === 'merged') {
        await saveSheetRecord(group.collectionName, sheetSafeRecord(nextRecord));
      }
    }
    clearGoogleSheetsCache();
    setContentRefreshKey(key => key + 1);
  };

  const updateSelectedPublished = async (published) => {
    if (!selectedIds.length) return;
    try {
      const records = new Map();
      websiteImages.filter(item => selectedIds.includes(item.id)).forEach(item => {
        records.set(`${item.source}:${item.recordId}`, item);
      });
      for (const item of records.values()) {
        const source = item.raw?._contentSource || 'firestore';
        if (source !== 'sheets') {
          await updateDoc(doc(db, item.source, item.recordId), { published, updatedAt: serverTimestamp() });
        }
        if (source === 'sheets' || source === 'merged') {
          await saveSheetRecord(item.source, { ...sheetSafeRecord(item.raw), published });
        }
      }
      clearGoogleSheetsCache();
      setContentRefreshKey(key => key + 1);
      clearSelection();
    } catch (error) {
      alert('Bulk update failed: ' + error.message);
    }
  };

  const deleteSelected = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected gallery image${selectedIds.length === 1 ? '' : 's'}?`)) return;

    try {
      const selectedItems = websiteImages.filter(item => selectedIds.includes(item.id));
      await deleteSourceImages(selectedItems);
      clearSelection();
      if (selectedItems.some(item => item.recordId === editingId)) resetForm();
    } catch (error) {
      alert('Delete failed: ' + error.message);
    }
  };

  const cleanupDuplicateGalleryItems = async () => {
    if (!duplicateGalleryItems.length) return;
    if (!window.confirm(`Clean ${duplicateGalleryItems.length} duplicate or stale gallery image${duplicateGalleryItems.length === 1 ? '' : 's'}?`)) return;

    try {
      await softDeleteRecords('gallery', duplicateGalleryItems);
      setSelectedIds(prev => prev.filter(id => !duplicateGalleryItems.some(item => item.id === id)));
      if (duplicateGalleryItems.some(item => item.id === editingId)) resetForm();
    } catch (error) {
      alert('Cleanup failed: ' + error.message);
    }
  };

  const deleteSingle = async (item) => {
    if (!window.confirm(`Delete "${item.title}" from gallery?`)) return;
    try {
      await deleteSourceImages([item]);
      setSelectedIds(prev => prev.filter(id => id !== item.id));
      if (editingId === item.recordId) resetForm();
    } catch (error) {
      alert('Delete failed: ' + error.message);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900">{editingId ? 'Edit Gallery Image' : 'Add Gallery Images'}</h2>
        <p className="mt-2 text-sm text-slate-500">Images saved here appear directly in the public website gallery.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">Title</label>
              <input name="title" value={formData.title} onChange={handleChange} placeholder="Annual Day Moments" className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">Category</label>
              <input name="category" value={formData.category} onChange={handleChange} placeholder="Campus, Events, Sports..." className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-700">Date</label>
              <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="block text-sm font-bold text-slate-700">Image URL{editingId ? '' : 's'}</label>
              <ImgBbUrlImporter
                multiple={!editingId}
                label={editingId ? 'Extract ImgBB URL' : 'Extract Multiple ImgBB URLs'}
                onExtracted={(value) => {
                  if (Array.isArray(value)) appendImageUrls(value);
                  else setFormData(prev => ({ ...prev, imageUrls: [value] }));
                }}
              />
            </div>

            {formData.imageUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(event) => handleImageUrlChange(index, event.target.value)}
                  required={index === 0}
                  placeholder="https://example.com/gallery-image.jpg"
                  className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {!editingId && (
                  <button type="button" onClick={() => removeImageUrlField(index)} className="rounded-lg px-3 font-bold text-red-600 transition-colors hover:bg-red-50">Remove</button>
                )}
              </div>
            ))}

            {!editingId && (
              <button type="button" onClick={addImageUrlField} className="rounded-lg px-3 py-2 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50">
                Add another image URL
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-700">
              <input name="published" type="checkbox" checked={formData.published} onChange={handleChange} className="h-5 w-5 rounded text-emerald-600" />
              Published in website gallery
            </label>
            <div className="flex gap-3">
              {editingId && <button type="button" onClick={resetForm} className="rounded-lg px-5 py-2.5 font-bold text-slate-600 transition-colors hover:bg-slate-100">Cancel</button>}
              <button type="submit" disabled={isSubmitting} className="rounded-lg bg-emerald-600 px-6 py-2.5 font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50">
                {isSubmitting ? 'Saving...' : editingId ? 'Update Image' : 'Save Images'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Manage Gallery Collection</p>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">Gallery Images</h3>
            <p className="mt-2 text-sm text-slate-500">{managedImages.length} published image{managedImages.length === 1 ? '' : 's'} loaded from Gallery, News, Events, Achievements, Sports, Firestore, and Google Sheets.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search gallery..." className="rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500" />
            <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-lg border border-slate-200 px-4 py-2.5 font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500">
              {categories.map(category => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex cursor-pointer items-center gap-2 font-bold text-slate-700">
            <input type="checkbox" checked={allVisibleSelected} onChange={toggleSelectAll} className="h-5 w-5 rounded text-emerald-600" />
            Select all visible
          </label>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-2 text-sm font-bold text-slate-600">{selectedIds.length} selected</span>
            <button type="button" onClick={clearSelection} disabled={!selectedIds.length} className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-white disabled:opacity-40">Clear selection</button>
            <button type="button" onClick={() => updateSelectedPublished(true)} disabled={!selectedIds.length} className="rounded-lg px-3 py-2 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-40">Publish</button>
            <button type="button" onClick={() => updateSelectedPublished(false)} disabled={!selectedIds.length} className="rounded-lg px-3 py-2 text-sm font-bold text-amber-700 transition-colors hover:bg-amber-50 disabled:opacity-40">Unpublish</button>
            <button type="button" onClick={deleteSelected} disabled={!selectedIds.length} className="rounded-lg px-3 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40">Delete</button>
            <button type="button" onClick={cleanupDuplicateGalleryItems} disabled={!duplicateGalleryItems.length} className="rounded-lg px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-white disabled:opacity-40">
              Clean duplicates ({duplicateGalleryItems.length})
            </button>
          </div>
        </div>

        {loading || loadingUpdates || loadingAchievements || loadingSportsAchievements ? (
          <p className="py-12 text-center font-bold text-slate-500">Loading gallery images...</p>
        ) : visibleManagedImages.length ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedManagedImages.map(item => (
              <article key={item.id} className={`overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-all hover:shadow-lg ${selectedIds.includes(item.id) ? 'border-emerald-500 ring-4 ring-emerald-100' : 'border-transparent hover:border-emerald-200'}`}>
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <button type="button" onClick={() => setPreviewImage(item)} className="absolute inset-0 block h-full w-full">
                    <img src={item.url} alt={item.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
                  </button>
                  <label className="absolute left-3 top-3 z-10 flex cursor-pointer items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-xs font-extrabold text-slate-800 shadow-lg backdrop-blur-sm">
                    <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelection(item.id)} className="h-5 w-5 rounded text-emerald-600" />
                    Select
                  </label>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{selectedIds.includes(item.id) ? 'Selected' : item.sourceLabel}</span>
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${item.published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {item.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div>
                    <h4 className="line-clamp-2 font-extrabold text-slate-900">{item.title}</h4>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{item.category}{item.date ? ` | ${item.date}` : ''}</p>
                  </div>
                  <div className="flex gap-2">
                    {item.source === 'gallery' && <button type="button" onClick={() => handleEdit(item)} className="flex-1 rounded-lg px-3 py-2 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50">Edit</button>}
                    <button type="button" onClick={() => deleteSingle(item)} className="flex-1 rounded-lg px-3 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-50">Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="py-12 text-center font-bold text-slate-500">No gallery images match the current filter.</p>
        )}
        {displayedManagedImages.length < visibleManagedImages.length && (
          <div className="mt-8 flex justify-center">
            <button type="button" onClick={() => setVisibleLimit(limit => limit + GALLERY_BATCH_SIZE)} className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-extrabold text-white transition-colors hover:bg-slate-800">
              Load {Math.min(GALLERY_BATCH_SIZE, visibleManagedImages.length - displayedManagedImages.length)} more images
            </button>
          </div>
        )}
      </section>

      {previewImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4" onClick={() => setPreviewImage(null)}>
          <button type="button" className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20" onClick={() => setPreviewImage(null)} aria-label="Close preview">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
          <div className="max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <img src={previewImage.url} alt={previewImage.title} className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl" />
            <div className="mt-4 rounded-xl bg-white p-4 text-center">
              <h4 className="text-lg font-extrabold text-slate-900">{previewImage.title}</h4>
              <p className="mt-1 text-sm font-semibold text-slate-500">{previewImage.sourceLabel} | {previewImage.category}{previewImage.date ? ` | ${previewImage.date}` : ''}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
