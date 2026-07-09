import React, { useEffect, useMemo, useState } from 'react';
import { clearGoogleSheetsCache, useContentCollection } from './useContentCollection';
import { saveSheetRecord } from './googleSheetsAdminApi';
import ImgBbUrlImporter from './ImgBbUrlImporter';

const MAX_GALLERY_IMAGES = 30;

const DEFAULT_FEATURES = [
  {
    slug: 'cctv-enabled-safety',
    title: 'A Safe & Secure Campus',
    kicker: 'Safe campus',
    icon: 'shield',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=90&w=2400&auto=format&fit=crop',
    description: 'A monitored learning environment helps students move through the campus with confidence. Safety systems support staff supervision and create a secure setting for academic and co-curricular activity.',
    points: ['CCTV-supported campus monitoring', 'Structured supervision around key areas', 'A calm environment for focused learning']
  },
  {
    slug: 'smart-classrooms',
    title: 'Future-Ready Learning Spaces',
    kicker: 'Interactive learning',
    icon: 'screen',
    imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?q=90&w=2400&auto=format&fit=crop',
    description: 'Roomy classrooms and smart-board support help teachers blend explanation, visual learning, discussion, and practice. The setup keeps lessons clear, engaging, and easier to follow.',
    points: ['Spacious rooms for comfortable learning', 'Smart-board enabled explanations', 'Better visual support for concepts']
  },
  {
    slug: 'qualified-support-staff',
    title: 'Dedicated Support Team',
    kicker: 'Care and guidance',
    icon: 'users',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=90&w=2400&auto=format&fit=crop',
    description: 'Support staff help maintain a smooth daily rhythm for students, teachers, and families. Their presence strengthens care, coordination, and readiness across the school day.',
    points: ['Student-focused assistance through the day', 'Coordination that supports teachers and learners', 'A dependable campus support system']
  },
  {
    slug: 'special-play-area',
    title: 'Joyful Play Zone',
    kicker: 'Joyful growth',
    icon: 'smile',
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=90&w=2400&auto=format&fit=crop',
    description: 'A dedicated play area gives younger learners space to move, imagine, and build social confidence. Play is treated as a meaningful part of physical, emotional, and creative development.',
    points: ['Dedicated space for active play', 'Supports social and motor-skill development', 'Encourages confidence through joyful activity']
  },
  {
    slug: 'advanced-labs',
    title: 'Experiential Learning Labs',
    kicker: 'Hands-on discovery',
    icon: 'flask',
    imageUrl: 'https://i.ibb.co/zWwgGQFX/IMG-4790.jpg',
    description: 'Purpose-built labs help students move from theory to observation, experimentation, and analysis. The learning experience becomes practical, curious, and grounded in real exploration.',
    points: ['Spaces designed for practical learning', 'Hands-on science and skill development', 'Encourages observation, testing, and inquiry']
  },
  {
    slug: 'multi-sports-play-area',
    title: "Champions' Arena",
    kicker: 'Fitness and teamwork',
    icon: 'trophy',
    imageUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=90&w=2400&auto=format&fit=crop',
    description: 'The multi-sports play area supports fitness, coordination, teamwork, and healthy competition. Students get structured opportunities to participate, practice, and build sporting spirit.',
    points: ['Space for multiple sports and activities', 'Builds stamina, teamwork, and discipline', 'Encourages regular physical participation']
  },
  {
    slug: 'safe-school-transport',
    title: 'Safe School Transport',
    kicker: 'Reliable travel',
    icon: 'bus',
    imageUrl: 'https://i.ibb.co/XfX9K6Yv/D3-ZTUDIO-PR0.jpg',
    galleryImages: [
      'https://i.ibb.co/XfX9K6Yv/D3-ZTUDIO-PR0.jpg',
      'https://i.ibb.co/mC8JsJD8/D3-ZTUDIO-PR0-2.jpg',
      'https://i.ibb.co/0y8kKwBz/D3-ZTUDIO-PR0-3.jpg',
      'https://i.ibb.co/fbFfzHV/D3-ZTUDIO-PR0-4.jpg'
    ],
    description: 'Safe school transport at Ansar English School provides dependable daily travel support for students across different routes. The facility is planned around safety, punctuality, care, and parent confidence.',
    body: [
      'Ansar English School operates 30+ school buses across different routes, helping students travel between home and campus in a regular, organized, and comfortable way. The transport facility is designed to make the school day easier for families while ensuring that students can reach the campus on time and return home through a dependable route system.',
      "Every bus has staff members assigned to look after students throughout the journey. Their presence helps maintain discipline, assist younger children, guide boarding and dropping routines, and support student safety from the time they enter the bus until they reach their destination. With careful coordination, route coverage, and attentive supervision, the school transport facility reflects Ansar English School's commitment to student care beyond the classroom."
    ],
    points: ['30+ school buses running on different routes', 'Staff present in every bus to care for students', 'Organized travel routines for safe daily movement']
  },
  {
    slug: 'healthy-dining-spaces',
    title: 'Healthy Dining Spaces',
    kicker: 'Nourishing routines',
    icon: 'utensils',
    imageUrl: 'https://i.ibb.co/QFQ4DMQ8/image.png',
    description: 'Healthy dining spaces give students a clean, comfortable place to eat, refresh, and build positive food habits during the school day.',
    points: ['Clean and organized dining areas', 'Supports healthy meal routines', 'Comfortable spaces for student refreshment']
  }
];

function toLines(value) {
  return Array.isArray(value) ? value.join('\n') : String(value || '');
}

function fromLines(value) {
  return String(value || '')
    .split(/\r?\n/)
    .map(item => item.trim())
    .filter(Boolean);
}

function createFormState(feature) {
  return {
    slug: feature.slug,
    title: feature.title || '',
    kicker: feature.kicker || '',
    icon: feature.icon || 'shield',
    description: feature.description || '',
    body: toLines(feature.body),
    points: toLines(feature.points),
    imageUrl: feature.imageUrl || feature.image || '',
    galleryImages: Array.isArray(feature.galleryImages) && feature.galleryImages.length ? feature.galleryImages : [''],
    published: feature.published !== false
  };
}

export default function AdminLearningFeatures() {
  const [selectedSlug, setSelectedSlug] = useState(DEFAULT_FEATURES[0].slug);
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: sheetRows, loading } = useContentCollection('learningFeatures', null, 'asc', { sheetsOnly: true, refreshKey });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const features = useMemo(() => {
    return DEFAULT_FEATURES.map((feature, index) => {
      const saved = sheetRows.find(row => row.slug === feature.slug || row.id === feature.slug);
      return {
        ...feature,
        ...saved,
        order: saved?.order ?? index + 1,
        imageUrl: saved?.imageUrl || saved?.image || feature.imageUrl,
        galleryImages: Array.isArray(saved?.galleryImages) && saved.galleryImages.length ? saved.galleryImages : feature.galleryImages,
        points: Array.isArray(saved?.points) && saved.points.length ? saved.points : feature.points
      };
    });
  }, [sheetRows]);

  const selectedFeature = features.find(feature => feature.slug === selectedSlug) || features[0];
  const [formData, setFormData] = useState(() => createFormState(selectedFeature));

  useEffect(() => {
    if (!loading) setFormData(createFormState(selectedFeature));
  }, [loading, refreshKey, selectedFeature.slug]);

  const selectFeature = (feature) => {
    setSelectedSlug(feature.slug);
    setFormData(createFormState(feature));
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGalleryChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.map((url, urlIndex) => (urlIndex === index ? value : url))
    }));
  };

  const appendGalleryImages = (urls) => {
    setFormData(prev => {
      const existing = prev.galleryImages.filter(url => url.trim());
      const nextImages = [...existing, ...urls].slice(0, MAX_GALLERY_IMAGES);
      if (existing.length + urls.length > MAX_GALLERY_IMAGES) {
        alert(`Only the first ${MAX_GALLERY_IMAGES} image links were added.`);
      }
      return { ...prev, galleryImages: nextImages.length ? nextImages : [''] };
    });
  };

  const addGalleryField = () => {
    setFormData(prev => {
      if (prev.galleryImages.length >= MAX_GALLERY_IMAGES) {
        alert(`You can add up to ${MAX_GALLERY_IMAGES} carousel images for one learning page.`);
        return prev;
      }
      return { ...prev, galleryImages: [...prev.galleryImages, ''] };
    });
  };

  const removeGalleryField = (index) => {
    setFormData(prev => {
      const nextImages = prev.galleryImages.filter((_, imageIndex) => imageIndex !== index);
      return { ...prev, galleryImages: nextImages.length ? nextImages : [''] };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const defaultIndex = DEFAULT_FEATURES.findIndex(feature => feature.slug === formData.slug);
      const galleryImages = formData.galleryImages.map(url => url.trim()).filter(Boolean).slice(0, MAX_GALLERY_IMAGES);
      const payload = {
        id: formData.slug,
        slug: formData.slug,
        title: formData.title.trim(),
        kicker: formData.kicker.trim(),
        description: formData.description.trim(),
        body: fromLines(formData.body),
        points: fromLines(formData.points),
        imageUrl: formData.imageUrl.trim() || galleryImages[0] || '',
        galleryImages,
        icon: formData.icon,
        order: defaultIndex + 1,
        published: !!formData.published
      };

      await saveSheetRecord('learningFeatures', payload);
      clearGoogleSheetsCache();
      setRefreshKey(key => key + 1);
      alert('Student-Centric Learning page saved.');
    } catch (error) {
      console.error('Error saving learning feature:', error);
      alert('Save failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Student-Centric Learning</p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Page content and carousel images</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[20rem_1fr]">
        <aside className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="mb-3 text-sm font-extrabold text-slate-700">Learning Pages</div>
          <div className="space-y-2">
            {features.map(feature => (
              <button
                key={feature.slug}
                type="button"
                onClick={() => selectFeature(feature)}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold transition-colors ${selectedSlug === feature.slug ? 'bg-emerald-700 text-white' : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'}`}
              >
                {feature.title}
              </button>
            ))}
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          {loading && <p className="mb-4 text-sm font-semibold text-slate-500">Loading saved Sheet data...</p>}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Title</span>
              <input name="title" value={formData.title} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" required />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Small Heading</span>
              <input name="kicker" value={formData.kicker} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-bold text-slate-700">Description</span>
            <textarea name="description" value={formData.description} onChange={handleChange} className="mt-1 h-28 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-bold text-slate-700">Article Paragraphs</span>
            <textarea name="body" value={formData.body} onChange={handleChange} placeholder="One paragraph per line" className="mt-1 h-32 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-bold text-slate-700">Key Points</span>
            <textarea name="points" value={formData.points} onChange={handleChange} placeholder="One point per line" className="mt-1 h-28 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
          </label>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Cover Image URL</span>
              <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" />
            </label>
            <ImgBbUrlImporter onExtracted={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))} label="Extract Cover ImgBB URL" />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Carousel Images</h3>
                <p className="text-sm font-semibold text-slate-500">Saved as image links in Google Sheets.</p>
              </div>
              <ImgBbUrlImporter multiple onExtracted={appendGalleryImages} label="Extract Carousel ImgBB URLs" />
            </div>

            <div className="mt-4 space-y-3">
              {formData.galleryImages.map((url, index) => (
                <div key={index} className="grid grid-cols-[1fr_auto] gap-2">
                  <input
                    value={url}
                    onChange={(event) => handleGalleryChange(index, event.target.value)}
                    placeholder={`Carousel image ${index + 1}`}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button type="button" onClick={() => removeGalleryField(index)} className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-red-600 ring-1 ring-slate-200 hover:bg-red-50">
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button type="button" onClick={addGalleryField} className="mt-4 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50">
              Add Image Link
            </button>
          </div>

          <label className="mt-5 flex items-center gap-3 text-sm font-bold text-slate-700">
            <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
            Published
          </label>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={isSubmitting} className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-extrabold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? 'Saving...' : 'Save to Google Sheets'}
            </button>
            <button type="button" onClick={() => setFormData(createFormState(selectedFeature))} className="rounded-xl px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100">
              Reload Selected Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
