// Firebase Config - Replace with YOUR config
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "123456789",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Save Feedback to Firestore
window.saveFeedback = async function(formData) {
    try {
        await db.collection('feedback').add({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            timestamp: firebase.firestore.Timestamp.now()
        });
        console.log('✅ Feedback saved!');
        return true;
    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
};

// Load Feedback (Optional - for admin view)
window.loadFeedback = async function() {
    try {
        const snapshot = await db.collection('feedback')
            .orderBy('timestamp', 'desc')
            .limit(10)
            .get();
        
        snapshot.forEach(doc => {
            console.log(doc.data());
        });
    } catch (error) {
        console.error('Error loading feedback:', error);
    }
};