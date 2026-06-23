import React, { useState } from 'react';

export default function ShareButton({ url, title, text, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const shareUrl = url || window.location.href;
    const payload = {
      title: title || 'Ansar English School',
      text: text || title || 'Ansar English School',
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.error('Unable to share link:', error);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-colors ${className}`}
      aria-label={`Share ${title || 'link'}`}
      title={copied ? 'Link copied' : 'Share'}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.59 13.51l6.83 3.98M15.41 6.51 8.59 10.49M21 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
      {copied ? 'Copied' : 'Share'}
    </button>
  );
}
