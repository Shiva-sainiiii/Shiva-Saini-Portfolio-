/* ============================================================
   SHIVA SAINI PORTFOLIO — firebase.js
   Production-ready Firebase module
   ============================================================ */

import { initializeApp }      from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ─────────────────────────────────────────
   FIREBASE CONFIG
   ⚠️  Keep this file out of public repos.
   Add your config to Vercel env vars and
   inject at build time for production use.
───────────────────────────────────────── */
const firebaseConfig = {
  apiKey:            "AIzaSyB9uCmYs0teDFqq2Gz-AbOjP35YnVSwaBc",
  authDomain:        "portfolio-shivasaini.firebaseapp.com",
  projectId:         "portfolio-shivasaini",
  storageBucket:     "portfolio-shivasaini.firebasestorage.app",
  messagingSenderId: "302309151982",
  appId:             "1:302309151982:web:cb3abc344cb10d2b1f4fff",
  measurementId:     "G-6DQENZQ9W3"
};

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
let app, db;

try {
  app = initializeApp(firebaseConfig);
  db  = getFirestore(app);
} catch (err) {
  console.error("Firebase init failed:", err);
}

/* ─────────────────────────────────────────
   SAVE CHAT
   Stores user message + AI reply in Firestore
───────────────────────────────────────── */
window.saveChat = async (userMessage, aiReply) => {
  if (!db) return;
  try {
    await addDoc(collection(db, "chats"), {
      userMessage: String(userMessage).slice(0, 500),
      aiReply:     String(aiReply).slice(0, 1000),
      createdAt:   serverTimestamp()
    });
  } catch (err) {
    // Non-blocking — don't surface to user
    console.warn("saveChat error:", err.message);
  }
};

/* ─────────────────────────────────────────
   SAVE FEEDBACK
   Stores user name + message in Firestore
───────────────────────────────────────── */
window.saveFeedback = async (name, message) => {
  if (!db) throw new Error("Database not available");
  await addDoc(collection(db, "feedback"), {
    name:      String(name).slice(0, 80),
    message:   String(message).slice(0, 300),
    createdAt: serverTimestamp()
  });
  // Re-throw so caller can catch if needed (handled in script.js)
};

/* ─────────────────────────────────────────
   LOAD FEEDBACK
   Fetches latest 10 feedback items and
   passes them to script.js renderFeedback()
───────────────────────────────────────── */
async function loadFeedback() {
  if (!db) return;
  try {
    const q       = query(
      collection(db, "feedback"),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    const snap    = await getDocs(q);
    const items   = snap.docs.map(doc => doc.data());

    // Render via script.js helper (defined there to avoid circular dep)
    if (typeof window.renderFeedback === "function") {
      window.renderFeedback(items);
    }
  } catch (err) {
    console.warn("loadFeedback error:", err.message);
  }
}

// Auto-load feedback once DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadFeedback);
} else {
  loadFeedback();
}
