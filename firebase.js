// ==============================
// 🔥 FIREBASE SETUP
// ==============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB9uCmYs0teDFqq2Gz-AbOjP35YnVSwaBc",
  authDomain: "portfolio-shivasaini.firebaseapp.com",
  projectId: "portfolio-shivasaini",
  storageBucket: "portfolio-shivasaini.firebasestorage.app",
  messagingSenderId: "302309151982",
  appId: "1:302309151982:web:cb3abc344cb10d2b1f4fff",
  measurementId: "G-6DQENZQ9W3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ==============================
// 💬 SAVE CHAT FUNCTION
// ==============================
window.saveChat = async (message, reply) => {
  try {
    await addDoc(collection(db, "chats"), {
      userMessage: message,
      aiReply: reply,
      createdAt: serverTimestamp()
    });
    console.log("Chat saved");
  } catch (error) {
    console.error("Error saving chat:", error);
  }
};


// ==============================
// 📩 SAVE FEEDBACK FUNCTION
// ==============================
window.saveFeedback = async (name, message) => {
  try {
    await addDoc(collection(db, "feedback"), {
      name: name,
      message: message,
      createdAt: serverTimestamp()
    });
    console.log("Feedback saved");
  } catch (error) {
    console.error("Error saving feedback:", error);
  }
};
