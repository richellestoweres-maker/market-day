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
  apiKey: "AIzaSyDaZo5IidNFidn0Fd5e6jBX1S7zpxfe7A0",
  authDomain: "market-day-261be.firebaseapp.com",
  projectId: "market-day-261be",
  storageBucket: "market-day-261be.firebasestorage.app",
  messagingSenderId: "43577439064",
  appId: "1:43577439064:web:839d2c13c74cad72496b2d"
};

if (firebaseConfig.apiKey.startsWith("PASTE_")) {
  // Loud on purpose. A half configured app fails in confusing ways later.
  console.error("Firebase is not configured yet. See the setup steps at the top of firebase.js.");
  document.addEventListener("DOMContentLoaded", () => {
    document.body.insertAdjacentHTML("afterbegin",
      `<div class="notice bad" style="margin:12px">Firebase is not configured yet.
       Paste your project config into firebase.js.</div>`);
  });
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// Cloud Storage needs the Blaze plan. Until that is switched on, photo uploads
// are the only thing that will not work, and they fail with a clear message
// rather than taking the page down with them.
export let storage = null;
try {
  storage = getStorage(app);
} catch (err) {
  console.warn("Cloud Storage is not enabled on this project yet.", err);
}
export const storageReady = () => storage !== null;
