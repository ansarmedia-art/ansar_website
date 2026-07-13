import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadElectionData } from './electionApi';

export default function ElectionFloatingButton() {
  const [pollOpen, setPollOpen] = useState(null);

  useEffect(() => {
    let active = true;

    const refreshPollingStatus = () => {
      loadElectionData()
        .then((election) => {
          if (active) setPollOpen(Boolean(election.isOpen));
        })
        .catch(() => {
          // Keep the election entry available if the status service is temporarily
          // unreachable. A confirmed closed status always hides it.
          if (active) setPollOpen(true);
        });
    };

    refreshPollingStatus();
    const timer = window.setInterval(refreshPollingStatus, 30000);
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') refreshPollingStatus();
    };
    document.addEventListener('visibilitychange', refreshWhenVisible);

    return () => {
      active = false;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, []);

  if (pollOpen !== true) return null;

  return (
    <Link
      to="/school-election"
      aria-label="Open the school election campaign poll"
      className="group fixed bottom-5 right-4 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 p-2.5 pr-4 text-white shadow-[0_12px_35px_rgba(67,56,202,0.4)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(67,56,202,0.5)] sm:bottom-7 sm:right-7"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-indigo-500/25" />
      <span className="grid h-11 w-11 place-items-center rounded-full bg-white/15 ring-1 ring-white/30">
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 3.5h7l1 5h-9l1-5Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m9.5 6 1.5 1.5L14.5 4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 9h14l1.5 11h-17L5 9Z" />
          <path strokeLinecap="round" d="M8 13h8" />
        </svg>
      </span>
      <span className="hidden text-left leading-tight sm:block">
        <strong className="block text-sm font-extrabold">Election 2026</strong>
        <span className="text-[11px] font-semibold text-indigo-100">Meet candidates & vote</span>
      </span>
    </Link>
  );
}
