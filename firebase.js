/* ============================================================
   SHIVA SAINI PORTFOLIO — firebase.js  v2.0
   Firebase Firestore — Feedback read/write
   ============================================================ */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  limit,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

/* ─── CONFIG ─────────────────────────────────────────────── */
// Replace these values with your actual Firebase project config.
// For production, store sensitive keys as Vercel environment variables
// and inject them at build time. NEVER commit real keys to public repos.
const firebaseConfig = {
  apiKey:            window.__FIREBASE_API_KEY__            || 'YOUR_API_KEY',
  authDomain:        window.__FIREBASE_AUTH_DOMAIN__        || 'YOUR_AUTH_DOMAIN',
  projectId:         window.__FIREBASE_PROJECT_ID__         || 'YOUR_PROJECT_ID',
  storageBucket:     window.__FIREBASE_STORAGE_BUCKET__     || 'YOUR_STORAGE_BUCKET',
  messagingSenderId: window.__FIREBASE_MESSAGING_SENDER_ID__|| 'YOUR_MESSAGING_SENDER_ID',
  appId:             window.__FIREBASE_APP_ID__             || 'YOUR_APP_ID'
};

/* ─── INIT ───────────────────────────────────────────────── */
let db;

try {
  const app = initializeApp(firebaseConfig);
  db         = getFirestore(app);
} catch (err) {
  console.error('[Firebase] Initialization failed:', err.message);
}

/* ─── FEEDBACK COLLECTION ─────────────────────────────────── */
const COLLECTION = 'feedback';

/**
 * Save feedback to Firestore.
 * @param {string} name
 * @param {string} message
 * @returns {Promise<boolean>}
 */
async function saveFeedback(name, message) {
  if (!db) {
    console.warn('[Firebase] DB not initialized.');
    return false;
  }

  try {
    await addDoc(collection(db, COLLECTION), {
      name:      name.trim(),
      message:   message.trim(),
      createdAt: serverTimestamp()
    });
    return true;
  } catch (err) {
    console.error('[Firebase] saveFeedback error:', err.message);
    return false;
  }
}

/**
 * Load latest feedback entries from Firestore.
 * @param {number} [max=20]
 * @returns {Promise<Array<{name: string, message: string}>>}
 */
async function loadFeedback(max = 20) {
  if (!db) return [];

  try {
    const q        = query(
      collection(db, COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(max)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error('[Firebase] loadFeedback error:', err.message);
    return [];
  }
}

/* ─── FEEDBACK UI WIRING ──────────────────────────────────── */
function renderFeedback(items) {
  const list = document.getElementById('feedback-list');
  if (!list) return;

  list.innerHTML = '';

  if (!items.length) {
    const li        = document.createElement('li');
    li.style.color  = 'rgba(240,240,255,0.3)';
    li.style.fontSize = '0.84rem';
    li.textContent  = 'No feedback yet — be the first!';
    list.appendChild(li);
    return;
  }

  items.forEach(({ name, message }) => {
    const li       = document.createElement('li');
    li.innerHTML   = `<strong>${escapeHtml(name)}</strong>${escapeHtml(message)}`;
    list.appendChild(li);
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ─── FORM HANDLER ─────────────────────────────────────────── */
function initFeedbackForm() {
  const form   = document.getElementById('feedbackForm');
  const nameIn = document.getElementById('fb-name');
  const msgIn  = document.getElementById('fb-msg');
  if (!form || !nameIn || !msgIn) return;

  // Load existing feedback on page load
  loadFeedback().then(renderFeedback);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = nameIn.value.trim();
    const message = msgIn.value.trim();

    // Validation
    if (!name || name.length < 2) {
      showToast('⚠️ Please enter your name.');
      nameIn.focus();
      return;
    }
    if (!message || message.length < 5) {
      showToast('⚠️ Message is too short.');
      msgIn.focus();
      return;
    }

    // Disable form while submitting
    const btn       = form.querySelector('button[type="submit"]');
    const origHTML  = btn.innerHTML;
    btn.disabled    = true;
    btn.innerHTML   = '<span>Sending…</span>';

    const success = await saveFeedback(name, message);

    btn.disabled  = false;
    btn.innerHTML = origHTML;

    if (success) {
      nameIn.value = '';
      msgIn.value  = '';
      showToast('✅ Feedback submitted — thank you!');
      const updated = await loadFeedback();
      renderFeedback(updated);
    } else {
      showToast('❌ Failed to submit. Please try again.');
    }
  });
}

/* ─── BOOT ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', initFeedbackForm);

// At the end of firebase.js
initFeedbackForm();

