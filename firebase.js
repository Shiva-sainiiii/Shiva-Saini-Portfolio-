
  // Firebase v12 Modular SDK
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
  import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, limit } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

  // Your Firebase Config ✅
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

  // 🔥 Save Feedback to Firestore (Global function for script.js)
  window.saveFeedback = async function(formData) {
    try {
      await addDoc(collection(db, 'feedback'), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        timestamp: serverTimestamp()
      });
      console.log('✅ Feedback saved to Firestore!');
      return true;
    } catch (error) {
      console.error('❌ Firebase Error:', error);
      throw error;
    }
  };

  // 🔥 Load Recent Feedback (Optional)
  window.loadFeedback = async function(callback) {
    try {
      const q = query(collection(db, 'feedback'), 
        orderBy('timestamp', 'desc'), 
        limit(5)
      );
      
      onSnapshot(q, (snapshot) => {
        const feedbackList = [];
        snapshot.forEach((doc) => {
          feedbackList.push({ id: doc.id, ...doc.data() });
        });
        if (callback) callback(feedbackList);
      });
    } catch (error) {
      console.error('Error loading feedback:', error);
    }
  };

  console.log('🔥 Firebase initialized! Ready for feedback & chat!');
