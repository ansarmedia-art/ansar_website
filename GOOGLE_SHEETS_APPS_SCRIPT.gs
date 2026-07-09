const DEFAULT_SPREADSHEET_ID = '1ymcRw-HqJfbqcRWa4BXXFzID4prJ20LhrTNK24jpVVE';

const SHEET_COLUMNS = {
  updates: [
    'id',
    'title',
    'category',
    'description',
    'date',
    'thumbnailUrl',
    'coverImageUrl',
    'imageUrls',
    'imageUrls2',
    'imageUrls3',
    'imageUrls4',
    'eventImages',
    'eventImages2',
    'eventImages3',
    'eventImages4',
    'instagramUrl',
    'facebookUrl',
    'youtubeUrl',
    'published'
  ],
  achievements: [
    'id',
    'title',
    'description',
    'date',
    'category',
    'studentName',
    'imageUrl',
    'thumbnailUrl',
    'order',
    'published'
  ],
  sportsAchievements: [
    'id',
    'title',
    'description',
    'date',
    'studentName',
    'imageUrl',
    'thumbnailUrl',
    'imageUrls',
    'order',
    'published'
  ],
  learningFeatures: [
    'id',
    'slug',
    'title',
    'kicker',
    'description',
    'body',
    'points',
    'imageUrl',
    'galleryImages',
    'icon',
    'order',
    'published'
  ],
  contactSubmissions: [
    'id',
    'date',
    'submittedAt',
    'name',
    'phone',
    'email',
    'category',
    'message',
    'published'
  ],
  publicDisclosure: [
    'id',
    'title',
    'section',
    'documentUrl',
    'order',
    'published'
  ],
  ansarTimes: [
    'id',
    'year',
    'month',
    'monthIndex',
    'pdfUrl',
    'published'
  ]
};

function setupWebsiteSheets() {
  const ss = getSpreadsheet_();
  Object.keys(SHEET_COLUMNS).forEach((sheetName) => {
    const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    const headers = SHEET_COLUMNS[sheetName];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  });
}

function testSaveNews() {
  const result = saveRecord_({
    collectionName: 'updates',
    spreadsheetId: DEFAULT_SPREADSHEET_ID,
    record: {
      title: 'Test News From Apps Script',
      category: 'News',
      description: 'If you can see this row, Apps Script can write to the Sheet.',
      date: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
      published: true
    }
  });
  Logger.log(JSON.stringify(result));
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    validateToken_(body.token);

    if (body.action === 'save') {
      return json_({ ok: true, item: saveRecord_(body) });
    }

    if (body.action === 'delete') {
      deleteRecord_(body);
      return json_({ ok: true });
    }

    throw new Error('Unknown action.');
  } catch (error) {
    return json_({ ok: false, error: error.message || String(error) });
  }
}

function doGet(e) {
  try {
    const params = (e && e.parameter) || {};

    if (params.test === '1') {
      const item = saveRecord_({
        collectionName: 'updates',
        spreadsheetId: DEFAULT_SPREADSHEET_ID,
        record: {
          title: 'Test News From Web App',
          category: 'News',
          description: 'If you can see this row, the deployed Web App can write to the Sheet.',
          date: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
          published: true
        }
      });
      return json_({ ok: true, item });
    }

    return json_({
      ok: true,
      spreadsheetId: DEFAULT_SPREADSHEET_ID,
      message: 'Google Sheets write endpoint is running. Add ?test=1 to write a test row.'
    });
  } catch (error) {
    return json_({ ok: false, error: error.message || String(error) });
  }
}

function saveRecord_(body) {
  const collectionName = normalizeCollectionName_(body.collectionName);
  const sheetName = getSheetName_(collectionName);
  const ss = getSpreadsheet_(body.spreadsheetId);
  const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  const headers = ensureHeaders_(sheet, SHEET_COLUMNS[sheetName]);
  const record = normalizeRecord_(collectionName, body.record || {});

  const rowNumber = findRowById_(sheet, headers, record.id);
  const values = headers.map((header) => encodeCellValue_(record[header]));

  if (rowNumber) {
    sheet.getRange(rowNumber, 1, 1, headers.length).setValues([values]);
  } else {
    sheet.appendRow(values);
  }

  return record;
}

function deleteRecord_(body) {
  const collectionName = normalizeCollectionName_(body.collectionName);
  const sheetName = getSheetName_(collectionName);
  const ss = getSpreadsheet_(body.spreadsheetId);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;

  const headers = readHeaders_(sheet);
  let rowNumber = findRowById_(sheet, headers, body.id);
  if (!rowNumber && collectionName === 'ansarTimes') {
    rowNumber = findAnsarTimesRow_(sheet, headers, body.record || {});
  }
  if (rowNumber) sheet.deleteRow(rowNumber);
}

function normalizeCollectionName_(collectionName) {
  const value = String(collectionName || '').trim();
  if (!value) throw new Error('Missing collection name.');
  return value;
}

function getSheetName_(collectionName) {
  if (collectionName === 'events') return 'updates';
  if (!SHEET_COLUMNS[collectionName]) throw new Error('Unsupported collection: ' + collectionName);
  return collectionName;
}

function normalizeRecord_(collectionName, record) {
  const item = Object.assign({}, record);
  item.id = item.id || createId_(item.title || collectionName);
  item.published = item.published !== false;

  if (collectionName === 'events') {
    item.category = 'Events';
    item.eventImages = item.eventImages || item.imageUrls || [];
    item.imageUrls = item.imageUrls || item.eventImages || [];
  }

  if (collectionName === 'updates') {
    item.category = item.category || 'News';
  }

  if (collectionName === 'events' || collectionName === 'updates') {
    splitLargeImageList_(item, 'eventImages');
    splitLargeImageList_(item, 'imageUrls');
  }

  if (collectionName === 'sportsAchievements') {
    item.imageUrl = item.imageUrl || firstImage_(item.imageUrls);
  }

  if (collectionName === 'learningFeatures') {
    item.slug = String(item.slug || item.id || item.title || '').trim();
    item.id = item.slug || item.id || createId_(item.title || collectionName);
    item.imageUrl = item.imageUrl || firstImage_(item.galleryImages);
  }

  if (collectionName === 'contactSubmissions') {
    item.date = item.date || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    item.submittedAt = item.submittedAt || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy hh:mm:ss a');
  }

  return item;
}

function firstImage_(value) {
  if (Array.isArray(value)) return value[0] || '';
  return String(value || '').split(/\r?\n|,\s*/).map(function(url) {
    return String(url || '').trim();
  }).filter(Boolean)[0] || '';
}

function splitLargeImageList_(item, key) {
  const urls = normalizeList_(item[key]);
  if (!urls.length) return;

  const chunks = chunkListForSheetCell_(urls, 45000, 4);
  item[key] = chunks[0] || [];
  for (let index = 1; index < 4; index += 1) {
    item[key + (index + 1)] = chunks[index] || [];
  }
}

function normalizeList_(value) {
  if (Array.isArray(value)) return value.map(function(item) {
    return String(item || '').trim();
  }).filter(Boolean);
  return String(value || '').split(/\r?\n|,\s*/).map(function(item) {
    return String(item || '').trim();
  }).filter(Boolean);
}

function chunkListForSheetCell_(items, maxChars, maxChunks) {
  const chunks = [[]];
  items.forEach(function(item) {
    const current = chunks[chunks.length - 1];
    const currentSize = current.join('\n').length;
    const nextSize = currentSize + (current.length ? 1 : 0) + item.length;
    if (nextSize > maxChars && chunks.length < maxChunks) {
      chunks.push([item]);
    } else {
      current.push(item);
    }
  });
  return chunks;
}

function ensureHeaders_(sheet, requiredHeaders) {
  const currentHeaders = readHeaders_(sheet);
  const headers = currentHeaders.length ? currentHeaders.slice() : requiredHeaders.slice();

  requiredHeaders.forEach((header) => {
    if (headers.indexOf(header) === -1) headers.push(header);
  });

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  return headers;
}

function readHeaders_(sheet) {
  const lastColumn = sheet.getLastColumn();
  if (!lastColumn) return [];
  return sheet.getRange(1, 1, 1, lastColumn).getValues()[0]
    .map((header) => String(header || '').trim())
    .filter(Boolean);
}

function findRowById_(sheet, headers, id) {
  const idColumn = headers.indexOf('id') + 1;
  if (!idColumn || !id) return null;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const values = sheet.getRange(2, idColumn, lastRow - 1, 1).getValues();
  const target = String(id);
  for (let index = 0; index < values.length; index += 1) {
    if (String(values[index][0]) === target) return index + 2;
  }
  return null;
}

function findAnsarTimesRow_(sheet, headers, record) {
  const yearColumn = headers.indexOf('year') + 1;
  const monthColumn = headers.indexOf('month') + 1;
  if (!yearColumn || !monthColumn || !record.year || !record.month) return null;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  const targetYear = String(record.year).trim();
  const targetMonth = String(record.month).trim().toLowerCase();

  for (let index = 0; index < values.length; index += 1) {
    const row = values[index];
    const rowYear = String(row[yearColumn - 1]).trim();
    const rowMonth = String(row[monthColumn - 1]).trim().toLowerCase();
    if (rowYear === targetYear && rowMonth === targetMonth) return index + 2;
  }

  return null;
}

function encodeCellValue_(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join('\n');
  if (value === true) return 'TRUE';
  if (value === false) return 'FALSE';
  return value == null ? '' : value;
}

function createId_(title) {
  const slug = String(title || 'item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60) || 'item';
  return slug + '-' + Date.now();
}

function validateToken_(token) {
  const expected = PropertiesService.getScriptProperties().getProperty('WRITE_TOKEN');
  if (expected && token !== expected) throw new Error('Invalid write token.');
}

function getSpreadsheet_(spreadsheetId) {
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  return SpreadsheetApp.openById(spreadsheetId || DEFAULT_SPREADSHEET_ID);
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
