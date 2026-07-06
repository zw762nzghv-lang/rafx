// storage.js — Kayıtlar (localStorage)

const STORAGE_KEY = 'rafx_v1';

function getRecords() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch(e) { return {}; }
}

function saveRecord(difficulty, seconds, moves) {
  const records = getRecords();
  if (!records[difficulty]) records[difficulty] = {};
  const rec = records[difficulty];
  let isNewRecord = false;

  const betterTime  = !rec.bestTime  || seconds < rec.bestTime;
  const betterMoves = !rec.bestMoves || moves   < rec.bestMoves;
  if (betterTime)  rec.bestTime  = seconds;
  if (betterMoves) rec.bestMoves = moves;
  if (betterTime || betterMoves) isNewRecord = true;
  rec.gamesWon = (rec.gamesWon || 0) + 1;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  return isNewRecord;
}

function getRecord(difficulty) {
  return getRecords()[difficulty] || null;
}

const CONTROL_KEY = 'rafx_control';
function getControlMode() {
  return localStorage.getItem(CONTROL_KEY) === 'click' ? 'click' : 'drag';
}
function setControlMode(mode) {
  localStorage.setItem(CONTROL_KEY, mode);
}

const HAPTIC_KEY = 'rafx_haptic';
function getHaptic() { return localStorage.getItem(HAPTIC_KEY) !== 'off'; }
function setHaptic(on) { localStorage.setItem(HAPTIC_KEY, on ? 'on' : 'off'); }

/* ── Profil (ad + avatar) ── */
const PROFILE_KEY            = 'rafx_profile';
const PROFILE_DEFAULT_AVATAR = '★';
const PROFILE_NAME_MAX       = 16;

function isAvatarImage(av) {
  return typeof av === 'string' && av.startsWith('data:image/');
}

function getProfile() {
  try {
    const p = JSON.parse(localStorage.getItem(PROFILE_KEY));
    const avatar = (p && typeof p.avatar === 'string' && p.avatar) ? p.avatar : PROFILE_DEFAULT_AVATAR;
    return {
      name:   (p && typeof p.name === 'string') ? p.name.slice(0, PROFILE_NAME_MAX) : '',
      avatar,
    };
  } catch { return { name: '', avatar: PROFILE_DEFAULT_AVATAR }; }
}

function setProfile({ name, avatar }) {
  const cur = getProfile();
  const clean = {
    name:   typeof name === 'string' ? name.trim().slice(0, PROFILE_NAME_MAX) : cur.name,
    avatar: (typeof avatar === 'string' && avatar) ? avatar : cur.avatar,
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(clean));
  return clean;
}

function getDisplayName() {
  return getProfile().name || 'Oyuncu';
}

function formatTime(sec) {
  if (!sec && sec !== 0) return '—';
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
