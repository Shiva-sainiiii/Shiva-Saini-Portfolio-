/* ============================================================
   SHIVA SAINI PORTFOLIO — firebase.js  v2.1
   Firebase Firestore — Feedback read/write
   Bug fixes: robust init, submit guard, proper error UX
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
// Replace with your actual Firebase project credentials.
// In production, inject via Vercel environment variables.
const firebaseConfig = {
  apiKey:            window.__FIREBASE_API_KEY__            || 'YOUR_API_KEY',
  authDomain:        window.__FIREBASE_AUTH_DOMAIN__        || 'YOUR_AUTH_DOMAIN',
  projectId:         window.__FIREBASE_PROJECT_ID__         || 'YOUR_PROJECT_ID',
  storageBucket:     window.__FIREBASE_STORAGE_BUCKET__     || 'YOUR_STORAGE_BUCKET',
  messagingSenderId: window.__FIREBASE_MESSAGING_SENDER_ID__|| 'YOUR_MESSAGING_SENDER_ID',
  appId:             window.__FIREBASE_APP_ID__             || 'YOUR_APP_ID'
};

/* ─── VALIDATE CONFIG ────────────────────────────────────── */
// Detect if the config still has placeholder values so we can
// show a clear error instead of a cryptic Firebase failure.
function isConfigured() {
  return (
    firebaseConfig.apiKey    !== 'YOUR_API_KEY' &&
    firebaseConfig.projectId !== 'YOUR_PROJECT_ID' &&
    firebaseConfig.apiKey    !== '' &&
    firebaseConfig.projectId !== ''
  );
}

/* ─── INIT ───────────────────────────────────────────────── */
let db = null;

if (isConfigured()) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.info('[Firebase] Firestore initialized successfully.');
  } catch (err) {
    console.error('[Firebase] Initialization failed:', err.message);
    db = null;
  }
} else {
  console.warn('[Firebase] Config has placeholder values. Feedback storage is disabled.');
}

/* ─── FEEDBACK COLLECTION ─────────────────────────────────── */
const COLLECTION = 'feedback';

/**
 * Save feedback to Firestore.
 * @param {string} name
 * @param {string} message
 * @returns {Promise<{ok: boolean, reason?: string}>}
 */
async function saveFeedback(name, message) {
  if (!db) {
    return { ok: false, reason: 'not_configured' };
  }
  try {
    await addDoc(collection(db, COLLECTION), {
      name:      name.trim(),
      message:   message.trim(),
      createdAt: serverTimestamp()
    });
    return { ok: true };
  } catch (err) {
    console.error('[Firebase] saveFeedback error:', err.message);
    return { ok: false, reason: 'write_error' };
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

/* ─── RENDER FEEDBACK ─────────────────────────────────────── */
function renderFeedback(items) {
  const list = document.getElementById('feedback-list');
  if (!list) return;

  list.innerHTML = '';

  if (!items.length) {
    const li       = document.createElement('li');
    li.style.cssText = 'color:rgba(240,240,255,0.3);font-size:0.84rem;';
    li.textContent = 'No feedback yet — be the first!';
    list.appendChild(li);
    return;
  }

  items.forEach(({ name, message }) => {
    const li     = document.createElement('li');
    li.innerHTML = `<strong>${escapeHtml(name)}</strong>${escapeHtml(message)}`;
    list.appendChild(li);
  });
}

/* ─── UTILITIES ───────────────────────────────────────────── */
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

  if (!form || !nameIn || !msgIn) {
    // Elements not found — likely an ID mismatch in HTML.
    // Check that your form has: id="feedbackForm", id="fb-name", id="fb-msg"
    console.warn('[Feedback] Form elements not found. Check HTML IDs: feedbackForm, fb-name, fb-msg');
    return;
  }

  // Load existing feedback
  loadFeedback().then(renderFeedback);

  let isSubmitting = false;  // ← Duplicate-submission guard

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (isSubmitting) return;  // Block double-submit

    const name    = nameIn.value.trim();
    const message = msgIn.value.trim();

    // ─── Validation ──────────────────────────────────────────
    if (!name || name.length < 2) {
      showToast('⚠️ Please enter your name (min. 2 characters).');
      nameIn.focus();
      return;
    }
    if (!message || message.length < 5) {
      showToast('⚠️ Message is too short (min. 5 characters).');
      msgIn.focus();
      return;
    }
    if (message.length > 500) {
      showToast('⚠️ Message is too long (max 500 characters).');
      msgIn.focus();
      return;
    }

    // ─── Early exit if Firebase not configured ────────────────
    if (!isConfigured()) {
      showToast('⚠️ Feedback storage is not configured yet. Contact Shiva directly!');
      return;
    }

    // ─── Disable UI during submit ────────────────────────────
    isSubmitting  = true;
    const btn     = form.querySelector('button[type="submit"]');
    const origHTML = btn.innerHTML;
    btn.disabled  = true;
    btn.innerHTML = '<span>Sending…</span>';

    const result = await saveFeedback(name, message);

    // ─── Re-enable UI ────────────────────────────────────────
    isSubmitting  = false;
    btn.disabled  = false;
    btn.innerHTML = origHTML;

    // ─── Handle result ───────────────────────────────────────
    if (result.ok) {
      nameIn.value = '';
      msgIn.value  = '';
      showToast('✅ Feedback submitted — thank you!');
      const updated = await loadFeedback();
      renderFeedback(updated);
    } else if (result.reason === 'not_configured') {
      showToast('⚠️ Database not connected. Please configure Firebase.');
    } else {
      showToast('❌ Submission failed. Please try again in a moment.');
    }
  });
}

/* ─── BOOT ─────────────────────────────────────────────────── */
// ES modules are deferred by default, so DOM is ready when this runs.
// We use DOMContentLoaded as an extra safety net.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFeedbackForm);
} else {
  // DOM already ready (module loaded after parse)
  initFeedbackForm();
         }
