import React, { useEffect, useMemo, useState } from 'react';
import Layout from './Layout';
import { subscribeGoogleSheetsRefresh, useContentCollection } from './useContentCollection';
import {
  ANSAR_TIMES_MONTHS,
  ANSAR_TIMES_START_YEAR,
  getAnsarTimesPdfUrl,
  isAnsarTimesDeleted
} from './ansarTimesConfig';

export default function AnsarTimes() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: entries, loading } = useContentCollection('ansarTimes', null, 'desc', { sheetsOnly: true, refreshKey });

  useEffect(() => {
    return subscribeGoogleSheetsRefresh(() => setRefreshKey(key => key + 1));
  }, []);

  const yearSections = useMemo(() => {
    const sections = new Map();
    sections.set(ANSAR_TIMES_START_YEAR, new Map());

    entries
      .filter(item => item.published !== false && getAnsarTimesPdfUrl(item) && !isAnsarTimesDeleted(item))
      .forEach(item => {
        const year = Number(item.year) || ANSAR_TIMES_START_YEAR;
        const key = String(item.month || '').trim().toLowerCase();
        if (!key) return;

        if (!sections.has(year)) sections.set(year, new Map());
        sections.get(year).set(key, item);
      });

    return Array.from(sections.entries())
      .map(([year, entriesByMonth]) => ({ year, entriesByMonth }))
      .sort((a, b) => b.year - a.year);
  }, [entries]);

  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 text-white shadow-2xl sm:px-10 lg:px-14">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-emerald-950/70" />
          <div className="relative z-10 max-w-4xl">
            <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-amber-300">School Publication</p>
            <h1 className="text-4xl font-extrabold leading-tight lg:text-6xl">Ansar Times</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-100/85 lg:text-xl">
              Monthly editions of Ansar Times for each academic year.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-slate-100 pb-6">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Academic Year Archive</p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-950">Monthly Editions</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">New academic years appear above previous years as PDFs are added.</p>
            </div>
          </div>

          {loading ? (
            <p className="py-12 text-center font-bold text-slate-500">Loading Ansar Times...</p>
          ) : (
            <div className="mt-8 space-y-10">
              {yearSections.map(({ year, entriesByMonth }) => (
                <section key={year}>
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h3 className="text-2xl font-extrabold text-slate-950">{year}</h3>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-500">Academic Year</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {ANSAR_TIMES_MONTHS.map(month => {
                      const entry = entriesByMonth.get(month.value.toLowerCase());
                      const pdfUrl = getAnsarTimesPdfUrl(entry);
                      const isActive = Boolean(pdfUrl);

                      if (isActive) {
                        return (
                          <a
                            key={month.value}
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex min-h-20 items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-600 px-4 py-5 text-white shadow-md transition-all hover:-translate-y-1 hover:bg-emerald-700 hover:shadow-xl sm:px-5"
                          >
                            <span className="min-w-0 whitespace-nowrap text-sm font-extrabold sm:text-base">ANSAR TIMES - {month.label}</span>
                            <svg className="h-5 w-5 flex-none transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17 17 7M8 7h9v9" />
                            </svg>
                          </a>
                        );
                      }

                      return (
                        <button
                          key={month.value}
                          type="button"
                          disabled
                          className="flex min-h-20 cursor-not-allowed items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-100 px-4 py-5 text-left text-slate-400 sm:px-5"
                        >
                          <span className="min-w-0 whitespace-nowrap text-sm font-extrabold sm:text-base">ANSAR TIMES - {month.label}</span>
                          <span className="flex-none whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-400 sm:text-xs">Not Added</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}
