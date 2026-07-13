import React, { useEffect, useMemo, useState } from 'react';
import Layout from './Layout';
import { hasVotedLocally, loadElectionData, submitElectionVote } from './electionApi';

const DEFAULT_ELECTION = {
  title: 'Ansar School Council Election 2026',
  electionDate: '2026-07-23',
  closesAt: '2026-07-23T00:00:00+05:30',
  isOpen: false,
  announcement: 'Candidate profiles and positions will be published soon.',
  audienceOptions: ['Student', 'Staff', 'Parent', 'Alumni', 'Other'],
  sections: ['Middle Section', 'Secondary Section', 'Senior Secondary Section'],
  voteResetId: 'initial',
  candidates: [],
  rule: 'You may cast one vote in each section per day: one in Middle, one in Secondary, and one in Senior Secondary.'
};

function CandidatePlaceholder() {
  return (
    <div className="rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/50 p-8 text-center">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-white text-indigo-600 shadow-sm">
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 8h4M19 6v4" /></svg>
      </div>
      <h3 className="font-extrabold text-slate-800">Candidates coming soon</h3>
      <p className="mt-2 text-sm font-medium text-slate-500">Positions, student photos, election symbols and campaign messages can be added when nominations are finalized.</p>
    </div>
  );
}

function CandidateCard({ candidate, audience, onVote, busy, voted, isOpen }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-indigo-100 via-white to-amber-50">
        {candidate.photoUrl ? <img src={candidate.photoUrl} alt={candidate.name} className="h-full w-full object-cover" loading="lazy" decoding="async" /> : (
          <div className="grid h-full place-items-center text-indigo-300"><svg className="h-24 w-24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" /></svg></div>
        )}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-2xl bg-white/95 p-2 pr-3 shadow-lg backdrop-blur">
          {candidate.symbolUrl ? <img src={candidate.symbolUrl} alt="" className="h-10 w-10 rounded-xl object-contain" /> : <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-xl">★</span>}
          <span className="text-xs font-extrabold text-slate-700">{candidate.symbolName || 'Symbol pending'}</span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-600">{candidate.position}</p>
        <h3 className="mt-2 text-xl font-black text-slate-900">{candidate.name}</h3>
        {candidate.className && <p className="mt-1 text-sm font-semibold text-slate-500">{candidate.className}</p>}
        {candidate.manifesto && <p className="mt-4 text-sm font-medium leading-6 text-slate-600">{candidate.manifesto}</p>}
        <button
          type="button"
          disabled={busy || voted || !audience || !isOpen}
          onClick={() => onVote(candidate)}
          className="mt-5 w-full rounded-xl bg-indigo-700 px-4 py-3 font-extrabold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {!isOpen ? 'Polling closed' : voted ? 'Voted today' : busy ? 'Sending vote…' : audience ? 'Vote for this candidate' : 'Choose audience above'}
        </button>
      </div>
    </article>
  );
}

export default function ElectionPage() {
  const [election, setElection] = useState(DEFAULT_ELECTION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [audience, setAudience] = useState('');
  const [activeSection, setActiveSection] = useState(DEFAULT_ELECTION.sections[0]);
  const [busyId, setBusyId] = useState('');
  const [notice, setNotice] = useState('');
  const [voteVersion, setVoteVersion] = useState(0);

  useEffect(() => {
    let active = true;
    const refreshElection = (initialLoad = false) => loadElectionData().then((data) => {
      if (!active) return;
      setElection({ ...DEFAULT_ELECTION, ...data });
      if (initialLoad) setActiveSection(data.sections?.[0] || DEFAULT_ELECTION.sections[0]);
      setError('');
    }).catch(() => {
      if (active && initialLoad) setError('Election setup is being prepared. Candidate profiles will appear here soon.');
    }).finally(() => {
      if (active && initialLoad) setLoading(false);
    });

    refreshElection(true);
    const refreshTimer = window.setInterval(() => refreshElection(false), 10000);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
    };
  }, []);

  const candidates = useMemo(() => election.candidates.filter((candidate) => candidate.section === activeSection), [election.candidates, activeSection]);
  const positions = useMemo(() => [...new Set(candidates.map((candidate) => candidate.position))], [candidates]);

  const handleVote = async (candidate) => {
    if (!election.isOpen || !audience || hasVotedLocally(candidate, election.voteResetId)) return;
    if (!window.confirm(`Submit today's campaign vote for ${candidate.name} as ${candidate.position}?`)) return;
    setBusyId(candidate.id);
    setNotice('');
    try {
      await submitElectionVote(candidate, audience, election.voteResetId);
      setVoteVersion((value) => value + 1);
      setNotice(`Your vote for ${candidate.name} in ${candidate.section} was sent. You can still cast one vote in each of the other sections today.`);
    } catch (voteError) {
      setNotice(voteError.message || 'The vote could not be sent. Please try again.');
    } finally {
      setBusyId('');
    }
  };

  return (
    <Layout fullWidth>
      <main className="min-h-screen bg-slate-50 pb-20">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 px-4 pb-20 pt-20 text-white">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="relative mx-auto max-w-6xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-amber-300">Campaign popularity poll</p>
            <h1 className="mx-auto mt-5 w-full max-w-4xl break-words px-2 text-[2rem] font-black leading-[1.08] tracking-tight sm:text-6xl">{election.title}</h1>
            <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-7 text-indigo-100 sm:text-lg">Discover the student candidates, learn about their symbols and campaign ideas, and show your support before the official offline election on 23 July.</p>
            <div className="mx-auto mt-8 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
              {election.sections.map((section) => <div key={section} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center font-bold backdrop-blur">{section}</div>)}
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-7">
            <div role="note" className="mb-6 rounded-2xl border-2 border-amber-400 bg-amber-50 px-5 py-4 text-amber-950 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">Important voting notice</p>
              <p className="mt-2 text-lg font-black leading-7">Everyone can vote in all 3 sections — one vote for Middle, one for Secondary, and one for Senior Secondary.</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-amber-900">Choose a section below, cast one vote, then visit the other two sections to complete your three votes.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900">Before you participate</h2>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{election.rule} This is an informal campaign preference poll, not the official election ballot. The official result will be decided through the school election on 23 July.</p>
              </div>
              <label className="min-w-56 text-sm font-extrabold text-slate-700">
                I am participating as
                <select value={audience} onChange={(event) => setAudience(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select audience</option>
                  {election.audienceOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
            </div>
            {notice && <p role="status" className="mt-5 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-800">{notice}</p>}
          </div>

          <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
            {election.sections.map((section) => (
              <button key={section} onClick={() => setActiveSection(section)} className={`whitespace-nowrap rounded-full px-5 py-3 text-sm font-extrabold transition ${activeSection === section ? 'bg-indigo-700 text-white shadow-lg' : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-300'}`}>{section}</button>
            ))}
          </div>

          <div className="mt-8">
            <div className="mb-6">
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-indigo-600">Candidate directory</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">{activeSection}</h2>
              {election.announcement && <p className="mt-2 font-medium text-slate-500">{election.announcement}</p>}
            </div>
            {loading ? <div className="grid min-h-52 place-items-center rounded-3xl bg-white"><span className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-700" /></div> : error || !candidates.length ? <CandidatePlaceholder /> : (
              <div className="space-y-10">
                {positions.map((position) => (
                  <section key={position}>
                    <h3 className="mb-4 text-xl font-black text-slate-800">{position}</h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {candidates.filter((candidate) => candidate.position === position).map((candidate) => (
                        <CandidateCard key={`${candidate.id}-${voteVersion}`} candidate={candidate} audience={audience} onVote={handleVote} busy={busyId === candidate.id} voted={hasVotedLocally(candidate, election.voteResetId)} isOpen={election.isOpen} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}
