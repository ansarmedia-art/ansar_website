import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadElectionAnalytics } from './electionApi';

function CandidateResults({ candidates }) {
  const groups = useMemo(() => {
    const result = {};
    candidates.forEach((candidate) => {
      const key = `${candidate.section}|||${candidate.position}`;
      (result[key] ||= []).push(candidate);
    });
    return result;
  }, [candidates]);

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([key, items]) => {
        const [section, position] = key.split('|||');
        const maximum = Math.max(1, ...items.map((item) => item.votes || 0));
        return (
          <section key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-600">{section}</p>
            <h3 className="mt-1 text-lg font-black text-slate-900">{position}</h3>
            <div className="mt-5 space-y-4">
              {[...items].sort((a, b) => b.votes - a.votes).map((candidate) => (
                <div key={candidate.id}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <span className="font-bold text-slate-700">{candidate.name}</span>
                    <strong className="text-slate-950">{candidate.votes || 0}</strong>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-all duration-700" style={{ width: `${((candidate.votes || 0) / maximum) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
      {!Object.keys(groups).length && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center font-semibold text-slate-500">Candidate results will appear after candidates are added.</div>}
    </div>
  );
}

export function ElectionAnalyticsDashboard({ analyticsKey, compact = false }) {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!analyticsKey) return undefined;
    let active = true;
    const refresh = async () => {
      setRefreshing(true);
      try {
        const data = await loadElectionAnalytics(analyticsKey);
        if (active) { setAnalytics(data); setError(''); }
      } catch (loadError) {
        if (active) setError(loadError.message || 'Could not load analytics.');
      } finally {
        if (active) setRefreshing(false);
      }
    };
    refresh();
    const timer = window.setInterval(refresh, 10000);
    return () => { active = false; window.clearInterval(timer); };
  }, [analyticsKey]);

  if (!analyticsKey) return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 font-semibold text-amber-900">Enter the analytics share key to view live results.</div>;
  if (error && !analytics) return <div className="rounded-2xl border border-red-200 bg-red-50 p-5 font-semibold text-red-700">{error}</div>;
  if (!analytics) return <div className="grid min-h-52 place-items-center rounded-2xl bg-white"><span className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-700" /></div>;

  const audienceEntries = Object.entries(analytics.byAudience || {}).sort((a, b) => b[1] - a[1]);
  const dayEntries = Object.entries(analytics.byDay || {}).sort((a, b) => a[0].localeCompare(b[0]));
  return (
    <div className={compact ? 'space-y-5' : 'space-y-7'}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-2xl font-black text-slate-900">Live campaign analytics</h2><p className="mt-1 text-sm font-medium text-slate-500">Automatically refreshes every 10 seconds. {refreshing ? 'Refreshing…' : `Last update: ${new Date(analytics.generatedAt).toLocaleTimeString('en-IN')}`}</p></div>
        <span className={`rounded-full px-4 py-2 text-sm font-extrabold ${analytics.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>{analytics.isOpen ? 'Polling open' : 'Polling closed'}</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-indigo-700 p-5 text-white shadow-lg"><p className="text-xs font-bold uppercase tracking-wider text-indigo-200">Total votes</p><strong className="mt-2 block text-4xl font-black">{analytics.totalVotes}</strong></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Unique devices</p><strong className="mt-2 block text-4xl font-black text-slate-900">{analytics.uniqueDevices}</strong></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Election day</p><strong className="mt-2 block text-xl font-black text-slate-900">23 July 2026</strong></div>
      </div>
      <CandidateResults candidates={analytics.candidates || []} />
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-black text-slate-900">Votes by day</h3><div className="mt-4 space-y-2">{dayEntries.map(([day, count]) => <div key={day} className="flex justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"><span className="font-semibold text-slate-600">{day}</span><strong>{count}</strong></div>)}{!dayEntries.length && <p className="text-sm text-slate-500">No votes yet.</p>}</div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-black text-slate-900">Audience participation</h3><div className="mt-4 space-y-2">{audienceEntries.map(([audience, count]) => <div key={audience} className="flex justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"><span className="font-semibold text-slate-600">{audience}</span><strong>{count}</strong></div>)}{!audienceEntries.length && <p className="text-sm text-slate-500">No votes yet.</p>}</div></section>
      </div>
    </div>
  );
}

export default function ElectionAnalytics() {
  const [params] = useSearchParams();
  const key = params.get('key') || '';
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-3xl bg-gradient-to-r from-slate-950 to-indigo-950 p-7 text-white shadow-xl sm:p-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-300">Ansar English School</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Election campaign live report</h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-indigo-100">Read-only analytics for authorized school leadership. Keep this link private.</p>
        </header>
        <ElectionAnalyticsDashboard analyticsKey={key} />
      </div>
    </main>
  );
}

