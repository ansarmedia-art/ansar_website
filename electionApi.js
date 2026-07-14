import { GOOGLE_SHEETS_DATABASE } from './googleSheetsConfig';

const DEVICE_KEY = 'ansar-election-device-v1';
const VOTE_PREFIX = 'ansar-election-vote-v1';

function endpoint() {
  if (!GOOGLE_SHEETS_DATABASE.writeEndpoint) throw new Error('Election service is not configured.');
  return GOOGLE_SHEETS_DATABASE.writeEndpoint;
}

async function apiGet(action, params = {}) {
  const url = new URL(endpoint());
  url.searchParams.set('action', action);
  url.searchParams.set('_', String(Date.now()));
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Election service failed (${response.status}).`);
  const result = await response.json();
  if (!result?.ok) throw new Error(result?.error || 'Election service error.');
  return result;
}

export function getElectionDeviceId() {
  let id = window.localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

export function indiaDateKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(date);
}

export function localVoteKey(candidate, voteResetId = 'initial') {
  const bucket = candidate.section === 'Senior Secondary Section' ? `${candidate.section}:${candidate.position}` : candidate.section;
  return `${VOTE_PREFIX}:${voteResetId}:${indiaDateKey()}:${bucket}`;
}

export function hasVotedLocally(candidate, voteResetId = 'initial') {
  if (window.localStorage.getItem(localVoteKey(candidate, voteResetId))) return true;

  // Respect vote markers created before section-wide voting was introduced,
  // but discard them after an admin reset changes the reset ID.
  if (voteResetId !== 'initial' || candidate.section === 'Senior Secondary Section') return false;
  const legacyPrefix = `${VOTE_PREFIX}:${indiaDateKey()}:${candidate.section}:`;
  for (let index = 0; index < window.localStorage.length; index += 1) {
    if (String(window.localStorage.key(index) || '').startsWith(legacyPrefix)) return true;
  }
  return false;
}

export async function loadElectionData() {
  const result = await apiGet('electionData');
  if (!result.election) throw new Error('Election service setup is incomplete.');
  return result.election;
}

export async function loadElectionAnalytics(key) {
  const result = await apiGet('electionAnalytics', { key });
  if (!result.analytics) throw new Error('Election analytics setup is incomplete.');
  return result.analytics;
}

export async function submitElectionVote(candidate, audience, voteResetId = 'initial') {
  const body = JSON.stringify({
    action: 'electionVote',
    candidateId: candidate.id,
    deviceId: getElectionDeviceId(),
    audience
  });
  const response = await fetch(endpoint(), {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body
  });
  if (!response.ok) throw new Error(`Vote submission failed (${response.status}).`);
  const result = await response.json();
  if (!result?.ok) throw new Error(result?.error || 'Vote submission was rejected.');
  const currentResetId = result.vote?.voteResetId || voteResetId;
  window.localStorage.setItem(localVoteKey(candidate, currentResetId), candidate.id);
  return result.vote;
}

export async function setElectionPolling(analyticsKey, enabled) {
  const response = await fetch(endpoint(), {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: 'electionAdminSetPolling',
      key: analyticsKey,
      enabled: Boolean(enabled)
    })
  });
  if (!response.ok) throw new Error(`Polling update failed (${response.status}).`);
  const result = await response.json();
  if (!result?.ok) throw new Error(result?.error || 'Polling status could not be updated.');
  return result.polling;
}

export async function resetElectionVotes(analyticsKey) {
  const response = await fetch(endpoint(), {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: 'electionAdminResetVotes',
      key: analyticsKey
    })
  });
  if (!response.ok) throw new Error(`Poll reset failed (${response.status}).`);
  const result = await response.json();
  if (!result?.ok) throw new Error(result?.error || 'Test votes could not be reset.');
  return result.reset;
}

async function electionAdminPost(action, analyticsKey, extra = {}) {
  const response = await fetch(endpoint(), { method:'POST', mode:'cors', headers:{ 'Content-Type':'text/plain;charset=utf-8' }, body:JSON.stringify({ action, key:analyticsKey, ...extra }) });
  if (!response.ok) throw new Error(`Candidate update failed (${response.status}).`);
  const result = await response.json();
  if (!result?.ok) throw new Error(result?.error || 'Candidate update failed.');
  return result;
}

export const saveElectionCandidate = (key, candidate) => electionAdminPost('electionAdminSaveCandidate', key, { candidate });
export const deleteElectionCandidate = (key, id) => electionAdminPost('electionAdminDeleteCandidate', key, { id });
