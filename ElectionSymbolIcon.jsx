import React from 'react';
export const ELECTION_SYMBOLS = ['Puzzle Piece', 'Scales of Justice', 'Football', 'Clock', 'Bridge', 'Microphone', 'Key', 'Light Bulb', 'Phoenix', 'Lion', 'Spectacles', 'NOTA'];
export default function ElectionSymbolIcon({ name, className = 'h-10 w-10' }) {
  const k = String(name || '').toLowerCase();
  const p = { className, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:1.8, strokeLinecap:'round', strokeLinejoin:'round', 'aria-hidden':true };
  if(k==='nota'||k.includes('none of the above')) return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="m8 8 8 8m0-8-8 8"/></svg>;
  if(k.includes('puzzle')) return <svg {...p}><path d="M8 3h4v3a2 2 0 1 0 4 0V3h5v6h-3a2 2 0 1 0 0 4h3v8h-7v-3a2 2 0 1 0-4 0v3H3v-7h3a2 2 0 1 0 0-4H3V3h5Z"/></svg>;
  if(k.includes('justice')||k.includes('scale')) return <svg {...p}><path d="M12 3v18M7 21h10M5 6h14M6 6l-3 6h6L6 6Zm12 0-3 6h6l-3-6ZM3 12c0 2 1.3 3 3 3s3-1 3-3m6 0c0 2 1.3 3 3 3s3-1 3-3"/></svg>;
  if(k.includes('football')) return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="m8.5 9 3.5-2.5L15.5 9l-1.3 4.2H9.8L8.5 9Zm3.5-2.5V3m3.5 6 4-1.5m-5.3 5.7 2.5 3.5M9.8 13.2l-2.5 3.5M8.5 9 4.5 7.5"/></svg>;
  if(k.includes('clock')||k==='time') return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
  if(k.includes('bridge')) return <svg {...p}><path d="M3 19V9m18 10V9M3 13c4 0 5-5 9-5s5 5 9 5M2 19h20M7 12v7m10-7v7M12 8v11"/></svg>;
  if(k.includes('mic')) return <svg {...p}><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4m-4 0h8"/></svg>;
  if(k.includes('key')) return <svg {...p}><circle cx="8" cy="15" r="4"/><path d="m11 12 8-8m-3 3 2 2m-5 1 2 2"/></svg>;
  if(k.includes('bulb')||k.includes('light')) return <svg {...p}><path d="M9 18h6m-5 3h4m3-8a7 7 0 1 0-10 0c1.2 1 2 2 2 4h6c0-2 .8-3 2-4Z"/></svg>;
  if(k.includes('phoenix')) return <svg {...p}><path d="M12 21c-1-5 1-7 4-10-4 1-5-2-5-7-2 3-5 5-8 5 2 2 4 4 4 7 2-2 3-3 5-3m0 8c2-3 5-4 9-4-2-2-3-4-3-7"/></svg>;
  if(k.includes('lion')) return <svg {...p}><path d="M6 8C3 9 3 15 6 17c1 4 11 4 12 0 3-2 3-8 0-9-2-6-10-6-12 0Z"/><path d="M8 10h.01M16 10h.01M9 15c2 2 4 2 6 0m-3-3v2"/></svg>;
  if(k.includes('spect')||k.includes('glass')) return <svg {...p}><circle cx="7" cy="13" r="4"/><circle cx="17" cy="13" r="4"/><path d="M11 13h2M3 12 2 9m19 3 1-3"/></svg>;
  return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="m12 7 1.5 3 3.5.5-2.5 2.4.6 3.5-3.1-1.7-3.1 1.7.6-3.5L7 10.5l3.5-.5L12 7Z"/></svg>;
}
