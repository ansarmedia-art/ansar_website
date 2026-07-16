export const ANSAR_TIMES_MONTHS = [
  { label: 'June', value: 'June', index: 1 },
  { label: 'July', value: 'July', index: 2 },
  { label: 'August', value: 'August', index: 3 },
  { label: 'September', value: 'September', index: 4 },
  { label: 'October', value: 'October', index: 5 },
  { label: 'November', value: 'November', index: 6 },
  { label: 'December', value: 'December', index: 7 },
  { label: 'January', value: 'January', index: 8 },
  { label: 'February', value: 'February', index: 9 },
  { label: 'March', value: 'March', index: 10 }
];

export const ANSAR_TIMES_START_YEAR = 2026;

export function getAnsarTimesYears(extraYears = 1) {
  const currentYear = new Date().getFullYear();
  const endYear = Math.max(ANSAR_TIMES_START_YEAR, currentYear + extraYears);
  return Array.from({ length: endYear - ANSAR_TIMES_START_YEAR + 1 }, (_, index) => ANSAR_TIMES_START_YEAR + index);
}

export function getAnsarTimesId(year, month) {
  return `${year}-${String(month || '').toLowerCase()}`;
}

export function getAnsarTimesPdfUrl(item) {
  return item?.pdfUrl || item?.documentUrl || item?.fileUrl || item?.driveLink || item?.link || item?.url || '';
}

const ANSAR_TIMES_DELETED_KEY = 'ansarTimesDeletedIds';

function readDeletedIds() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(ANSAR_TIMES_DELETED_KEY) || '[]');
  } catch (error) {
    return [];
  }
}

function writeDeletedIds(ids) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ANSAR_TIMES_DELETED_KEY, JSON.stringify([...new Set(ids)]));
}

export function getAnsarTimesRecordId(item) {
  // Google Sheets can auto-format values such as `2026-june` as a date and
  // return a differently cased/formatted id. The year/month pair is the
  // stable identity for an Ansar Times edition.
  if (item?.year && item?.month) return getAnsarTimesId(item.year, item.month);
  return item?.id || '';
}

export function markAnsarTimesDeleted(itemOrId) {
  const id = typeof itemOrId === 'string' ? itemOrId : getAnsarTimesRecordId(itemOrId);
  if (!id) return;
  writeDeletedIds([...readDeletedIds(), id]);
}

export function clearAnsarTimesDeleted(itemOrId) {
  const id = typeof itemOrId === 'string' ? itemOrId : getAnsarTimesRecordId(itemOrId);
  if (!id) return;
  writeDeletedIds(readDeletedIds().filter(item => item !== id));
}

export function isAnsarTimesDeleted(item) {
  const id = getAnsarTimesRecordId(item);
  return Boolean(id && readDeletedIds().includes(id));
}
