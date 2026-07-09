import React, { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, Timestamp, where } from 'firebase/firestore';
import { db } from './firebase-init';
import {
  ADMIN_TRASH_COLLECTION,
  ADMIN_UNDO_CREATED_EVENT,
  cleanupExpiredUndoItems,
  discardUndoRecord,
  getUndoTitle,
  undoDeleteRecord
} from './adminUndo';

function formatTimeLeft(expiresAt) {
  const millis = expiresAt?.toMillis ? expiresAt.toMillis() - Date.now() : 0;
  if (millis <= 0) return 'expired';
  const totalSeconds = Math.ceil(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function isTypingTarget(target) {
  const tagName = target?.tagName?.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select' || target?.isContentEditable;
}

export default function AdminUndoCenter() {
  const [undoItems, setUndoItems] = useState([]);
  const [now, setNow] = useState(() => Date.now());
  const [isRestoring, setIsRestoring] = useState(false);
  const [flashId, setFlashId] = useState(null);
  const [isPanelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    cleanupExpiredUndoItems().catch(error => console.warn('Undo cleanup failed:', error));
    const cleanupTimer = window.setInterval(() => {
      cleanupExpiredUndoItems().catch(error => console.warn('Undo cleanup failed:', error));
    }, 60 * 1000);

    const activeTrashQuery = query(
      collection(db, ADMIN_TRASH_COLLECTION),
      where('expiresAt', '>', Timestamp.now())
    );
    const unsubscribe = onSnapshot(activeTrashQuery, (snapshot) => {
      setUndoItems(snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })));
    }, (error) => {
      console.warn('Unable to load admin undo history:', error);
    });

    return () => {
      window.clearInterval(cleanupTimer);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const latestItem = useMemo(() => {
    return undoItems
      .filter(item => !item.expiresAt?.toMillis || item.expiresAt.toMillis() > now)
      .sort((a, b) => {
        const aDeleted = a.deletedAt?.toMillis ? a.deletedAt.toMillis() : 0;
        const bDeleted = b.deletedAt?.toMillis ? b.deletedAt.toMillis() : 0;
        return bDeleted - aDeleted;
      })[0] || null;
  }, [now, undoItems]);

  const activeItems = useMemo(() => {
    return undoItems
      .filter(item => !item.expiresAt?.toMillis || item.expiresAt.toMillis() > now)
      .sort((a, b) => {
        const aDeleted = a.deletedAt?.toMillis ? a.deletedAt.toMillis() : 0;
        const bDeleted = b.deletedAt?.toMillis ? b.deletedAt.toMillis() : 0;
        return bDeleted - aDeleted;
      });
  }, [now, undoItems]);

  const handleUndo = async (item = latestItem) => {
    if (!item || isRestoring) return;
    setIsRestoring(true);
    try {
      await undoDeleteRecord(item);
      if (item.id === latestItem?.id) setPanelOpen(false);
    } catch (error) {
      alert('Undo failed: ' + error.message);
    } finally {
      setIsRestoring(false);
    }
  };

  const handleClosePanel = async () => {
    const shouldDiscard = activeItems.length > 0 && window.confirm('Close and permanently remove these restore options? Deleted records cannot be restored after this.');
    if (!shouldDiscard) {
      setPanelOpen(false);
      return;
    }

    try {
      await Promise.all(activeItems.map(item => discardUndoRecord(item)));
      setPanelOpen(false);
    } catch (error) {
      alert('Unable to clear undo items: ' + error.message);
    }
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!latestItem || isTypingTarget(event.target)) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [latestItem, isRestoring]);

  useEffect(() => {
    const onUndoCreated = (event) => {
      setFlashId(event.detail?.trashId || 'latest');
      setPanelOpen(false);
      window.setTimeout(() => setFlashId(null), 1800);
    };

    window.addEventListener(ADMIN_UNDO_CREATED_EVENT, onUndoCreated);
    return () => window.removeEventListener(ADMIN_UNDO_CREATED_EVENT, onUndoCreated);
  }, []);

  if (!latestItem) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9998]">
      {isPanelOpen && (
        <div className="mb-3 w-[min(92vw,30rem)] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold text-slate-900">Restore Deleted Items</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">Available for 15 minutes</p>
            </div>
            <button type="button" onClick={handleClosePanel} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900" aria-label="Close restore panel">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
            {activeItems.map(item => (
              <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{getUndoTitle(item)}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">Expires in {formatTimeLeft(item.expiresAt)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUndo(item)}
                    disabled={isRestoring}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {isRestoring ? 'Restoring...' : 'Restore'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setPanelOpen(value => !value)}
        className={`flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-900 shadow-2xl transition-all hover:-translate-y-0.5 hover:border-emerald-200 ${flashId ? 'scale-[1.03] ring-4 ring-emerald-100' : ''}`}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-700">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m1 0v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7h10z" />
          </svg>
        </span>
        <span>{activeItems.length} restore option{activeItems.length === 1 ? '' : 's'}</span>
      </button>
    </div>
  );
}
