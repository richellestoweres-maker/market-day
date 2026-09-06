// firebase.js
// Shared Firebase initialization. Every page imports from here rather than
// repeating the config, so rotating a key is one edit.
//
// SETUP, do this once:
//   1. Create a new Firebase project at console.firebase.google.com, called market-day.
//   2. Enable Authentication with the Email/Password provider.
//   3. Create a Firestore database, and a Storage bucket for seller documents.
//   4. Add a web app, copy its config, and paste it below.
//   5. Deploy firestore.rules from this repo. Do not skip this, the rules are
//      what actually enforce who may sell what.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "market-day-xxxxx.firebaseapp.com",
  projectId: "market-day-xxxxx",
  storageBucket: "market-day-xxxxx.firebasestorage.app",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
