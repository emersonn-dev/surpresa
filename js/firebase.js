import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
    getAuth,
    setPersistence,
    browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB9gyjz45UvG3OSbalWXXTx50HHnA0zPa4",
    authDomain: "presente-e3dca.firebaseapp.com",
    projectId: "presente-e3dca",
    storageBucket: "presente-e3dca.firebasestorage.app",
    messagingSenderId: "786122962039",
    appId: "1:786122962039:web:4adaab23aa9c0143894272"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

await setPersistence(auth, browserSessionPersistence);

export { db, auth };