export function parseFlexibleDate(value) {
  if (!value) return null;
  if (value?.toMillis) return new Date(value.toMillis());
  if (value?.seconds) return new Date(value.seconds * 1000);

  const text = String(value).trim();
  const ddmmyyyy = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getDateTime(value, fallback = 0) {
  const parsed = parseFlexibleDate(value);
  return parsed ? parsed.getTime() : fallback;
}

export function getDisplayYear(value, fallback = 'Undated') {
  const parsed = parseFlexibleDate(value);
  return parsed ? parsed.getFullYear() : fallback;
}

export function formatDisplayDate(value) {
  const parsed = parseFlexibleDate(value);
  if (!parsed) return String(value || '').trim();

  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function isYearOnly(value) {
  return /^\d{4}$/.test(String(value || '').trim());
}
