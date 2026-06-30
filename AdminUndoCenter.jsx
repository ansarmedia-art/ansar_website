import React, { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, Timestamp, where } from 'firebase/firestore';
import { db } from './firebase-init';
import {
  ADMIN_TRASH_COLLECTION,
  ADMIN_UNDO_CREATED_EVENT,
  cleanupExpiredUndoItems,
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

  const handleUndo = async () => {
    if (!latestItem || isRestoring) return;
    setIsRestoring(true);
    try {
      await undoDeleteRecord(latestItem);
    } catch (error) {
      alert('Undo failed: ' + error.message);
    } finally {
      setIsRestoring(false);
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
      window.setTimeout(() => setFlashId(null), 1800);
    };

    window.addEventListener(ADMIN_UNDO_CREATED_EVENT, onUndoCreated);
    return () => window.removeEventListener(ADMIN_UNDO_CREATED_EVENT, onUndoCreated);
  }, []);

  if (!latestItem) return null;

  const title = getUndoTitle(latestItem);
  const timeLeft = formatTimeLeft(latestItem.expiresAt);

  return (
    <div className={`fixed bottom-5 right-5 z-[9998] max-w-md rounded-xl border border-slate-200 bg-white p-4 shadow-2xl transition-all duration-300 ${flashId ? 'scale-[1.02] ring-4 ring-emerald-100' : ''}`}>
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-amber-50 text-amber-700">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m1 0v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7h10z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-slate-900">Deleted item can be restored</p>
          <p className="mt-1 truncate text-sm text-slate-600">{title}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">Undo expires in {timeLeft}</p>
        </div>
        <button
          type="button"
          onClick={handleUndo}
          disabled={isRestoring}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
        >
          {isRestoring ? 'Restoring...' : 'Undo'}
        </button>
      </div>
    </div>
  );
}
