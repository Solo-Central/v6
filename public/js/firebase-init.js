import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, deleteDoc, increment } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

const config = {
    apiKey: "AIzaSyAn8fhrMZLS6OTLDWi-S2rKDONVvgB_0s4",
    authDomain: "soloodotwin.firebaseapp.com",
    projectId: "soloodotwin",
    storageBucket: "soloodotwin.firebasestorage.app",
    messagingSenderId: "386483536850",
    appId: "1:386483536850:web:e7e5250863d1a05c9ffe0b",
    measurementId: "G-1VPLNN3Z7E"
};

const app = getApps().length === 0 ? initializeApp(config) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

window.__soloAuth = auth;
window.__soloDB = db;

onAuthStateChanged(auth, (user) => {
    window.__soloUser = user || null;
    if (user) {
        const userRef = doc(db, 'users', user.uid);
        getDoc(userRef).then(snap => {
            const updates = { displayName: user.displayName || '', photoURL: user.photoURL || '' };
            if (!snap.exists() || !snap.data().joinedAt) {
                updates.joinedAt = user.metadata.creationTime;
            }
            setDoc(userRef, updates, { merge: true });
        });
    }
    document.dispatchEvent(new CustomEvent('soloAuthChanged', { detail: { user } }));
});

export { auth, db, googleProvider, signInWithPopup, signOut, doc, getDoc, setDoc, deleteDoc, increment };
