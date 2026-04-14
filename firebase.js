// 🔥 firebase.js (FULL WORKING)

// Import Firebase core
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";

// Firestore import
import {
getFirestore,
collection,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// 🔐 Firebase Config
const firebaseConfig = {
apiKey: "AIzaSyB9uCmYs0teDFqq2Gz-AbOjP35YnVSwaBc",
authDomain: "portfolio-shivasaini.firebaseapp.com",
projectId: "portfolio-shivasaini",
storageBucket: "portfolio-shivasaini.firebasestorage.app",
messagingSenderId: "302309151982",
appId: "1:302309151982:web:cb3abc344cb10d2b1f4fff",
measurementId: "G-6DQENZQ9W3"
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 📦 Firestore DB
const db = getFirestore(app);

// ==============================
// 🧠 SAVE AI CHAT
// ==============================
export async function saveChat(userMessage, aiResponse) {
try {
await addDoc(collection(db, "chats"), {
user: userMessage,
ai: aiResponse,
createdAt: serverTimestamp()
});
console.log("✅ Chat saved");
} catch (error) {
console.error("❌ Error saving chat:", error);
}
}

// ==============================
// 📩 SAVE FEEDBACK / CONTACT
// ==============================
export async function saveFeedback(name, message) {
try {
await addDoc(collection(db, "feedbacks"), {
name: name,
message: message,
createdAt: serverTimestamp()
});
console.log("✅ Feedback saved");
} catch (error) {
console.error("❌ Error saving feedback:", error);
}
}

// ==============================
// ⚡ EXPORT DB (optional future use)
// ==============================
export { db };