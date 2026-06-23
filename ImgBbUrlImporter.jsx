import React, { useState } from 'react';

export function extractImageUrls(value) {
  if (!value || typeof value !== 'string') return [];

  const urls = new Set();
  const patterns = [
    /src=["'](https?:\/\/i\.ibb\.co\/[^"']+)["']/gi,
    /(https?:\/\/i\.ibb\.co\/[^\s"'<>]+)/gi,
    /(https?:\/\/[^\s"'<>]+\.(?:png|jpe?g|webp|gif)(?:\?[^\s"'<>]*)?)/gi
  ];

  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(value)) !== null) {
      urls.add(match[1].replace(/&amp;/g, '&').trim());
    }
  });

  return Array.from(urls);
}

export default function ImgBbUrlImporter({ multiple = false, onExtracted, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rawText, setRawText] = useState('');

  const applyExtractedUrls = () => {
    const urls = extractImageUrls(rawText);
    if (!urls.length) {
      alert('No direct image URL found. Paste the ImgBB HTML code or a direct https://i.ibb.co/... image URL.');
      return;
    }

    onExtracted(multiple ? urls : urls[0]);
    setRawText('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50"
      >
        {label || (multiple ? 'Extract ImgBB URLs' : 'Extract ImgBB URL')}
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-3 shadow-sm">
      <textarea
        value={rawText}
        onChange={(event) => setRawText(event.target.value)}
        placeholder="Paste ImgBB HTML code or direct image URLs here"
        className="h-24 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={applyExtractedUrls}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
        >
          Use URL{multiple ? 's' : ''}
        </button>
        <button
          type="button"
          onClick={() => {
            setRawText('');
            setIsOpen(false);
          }}
          className="rounded-lg px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
