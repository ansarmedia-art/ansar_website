import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where
} from 'firebase/firestore';
import { db } from './firebase-init';
import { clearGoogleSheetsCache } from './useContentCollection';
import { deleteSheetRecord, saveSheetRecord } from './googleSheetsAdminApi';

export const ADMIN_UNDO_WINDOW_MS = 15 * 60 * 1000;
export const ADMIN_TRASH_COLLECTION = 'adminTrash';
export const ADMIN_UNDO_CREATED_EVENT = 'ansar-admin-undo-created';

function stripLocalFields(item = {}) {
  const { id, recordId, raw, _contentSource, _sheetRowIndex, ...data } = item;
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );
}

function dispatchUndoCreated(trashId) {
  window.dispatchEvent(new CustomEvent(ADMIN_UNDO_CREATED_EVENT, { detail: { trashId } }));
}

export function getUndoTitle(entry) {
  const data = entry?.data || {};
  return data.title || data.name || data.message || data.slug || entry?.docId || 'deleted item';
}

export async function cleanupExpiredUndoItems() {
  const expiredQuery = query(
    collection(db, ADMIN_TRASH_COLLECTION),
    where('expiresAt', '<=', Timestamp.now())
  );
  const snapshot = await getDocs(expiredQuery);
  await Promise.all(snapshot.docs.map(item => deleteDoc(item.ref)));
}

export async function discardUndoRecord(entry) {
  if (!entry?.id) throw new Error('Missing undo record.');
  await deleteDoc(doc(db, ADMIN_TRASH_COLLECTION, entry.id));
}

export async function softDeleteRecord(collectionName, item, options = {}) {
  const docId = options.docId || item?.recordId || item?.id;
  if (!docId) throw new Error('Missing document id for delete.');

  const source = options.source || item?._contentSource || 'firestore';
  const sheetCollection = options.sheetCollection || collectionName;
  const firestoreData = stripLocalFields(options.firestoreData || item?.raw || item);
  const sheetData = stripLocalFields(options.sheetData || item);
  const shouldDeleteFirestore = options.firestore !== false && source !== 'sheets';
  const shouldDeleteSheet = options.sheets === true || source === 'sheets' || source === 'merged';

  const trashRef = await addDoc(collection(db, ADMIN_TRASH_COLLECTION), {
    collectionName,
    docId,
    source,
    sheetCollection,
    data: firestoreData,
    sheetData,
    deletedAt: serverTimestamp(),
    expiresAt: Timestamp.fromMillis(Date.now() + ADMIN_UNDO_WINDOW_MS)
  });

  try {
    if (shouldDeleteFirestore) {
      await deleteDoc(doc(db, collectionName, docId));
    }
    if (shouldDeleteSheet) {
      await deleteSheetRecord(sheetCollection, docId);
      clearGoogleSheetsCache();
    }
  } catch (error) {
    await deleteDoc(trashRef).catch(() => {});
    throw error;
  }

  dispatchUndoCreated(trashRef.id);
  return trashRef.id;
}

export async function softDeleteRecords(collectionName, items, options = {}) {
  const ids = [];
  for (const item of items) {
    ids.push(await softDeleteRecord(collectionName, item, options));
  }
  return ids;
}

export async function undoDeleteRecord(entry) {
  if (!entry?.id) throw new Error('Missing undo record.');
  const expiresAt = entry.expiresAt?.toMillis ? entry.expiresAt.toMillis() : 0;
  if (expiresAt && expiresAt <= Date.now()) {
    await deleteDoc(doc(db, ADMIN_TRASH_COLLECTION, entry.id));
    throw new Error('Undo time expired. This item can no longer be restored.');
  }

  await setDoc(doc(db, entry.collectionName, entry.docId), {
    ...stripLocalFields(entry.data),
    updatedAt: serverTimestamp()
  }, { merge: true });

  if (entry.source === 'sheets' || entry.source === 'merged') {
    await saveSheetRecord(entry.sheetCollection || entry.collectionName, {
      ...stripLocalFields(entry.sheetData || entry.data),
      id: entry.docId
    });
    clearGoogleSheetsCache();
  }

  await deleteDoc(doc(db, ADMIN_TRASH_COLLECTION, entry.id));
}
