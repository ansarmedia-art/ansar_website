import { GOOGLE_SHEETS_DATABASE } from './googleSheetsConfig';

function assertWriteEndpoint() {
  if (!GOOGLE_SHEETS_DATABASE.writeEndpoint) {
    throw new Error('Google Sheets write endpoint is not configured. Deploy the Apps Script Web App and paste its URL into googleSheetsConfig.js.');
  }
}

async function postToSheets(action, payload) {
  assertWriteEndpoint();

  const body = JSON.stringify({
    action,
    token: GOOGLE_SHEETS_DATABASE.writeToken || '',
    spreadsheetId: GOOGLE_SHEETS_DATABASE.spreadsheetId,
    ...payload
  });

  const response = await fetch(GOOGLE_SHEETS_DATABASE.writeEndpoint, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body
  });

  if (response.type === 'opaque') {
    return { ok: true, opaque: true };
  }

  if (!response.ok) {
    throw new Error(`Google Sheets write failed (${response.status}).`);
  }

  const result = await response.json();
  if (!result.ok) {
    throw new Error(result.error || 'Google Sheets write failed.');
  }

  return result;
}

export function saveSheetRecord(collectionName, record) {
  return postToSheets('save', { collectionName, record });
}

export function deleteSheetRecord(collectionName, id, record) {
  return postToSheets('delete', { collectionName, id, record });
}
