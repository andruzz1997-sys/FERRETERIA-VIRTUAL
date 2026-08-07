import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

const config = window.FIREBASE_CONFIG;
const hasPlaceholders =
    !config ||
    !config.apiKey ||
    String(config.apiKey).includes("YOUR_") ||
    String(config.projectId || "").includes("YOUR_");
export const firebaseReady = Boolean(config && config.apiKey && !hasPlaceholders);

let app = null;
let auth = null;
let db = null;
let storage = null;

if (firebaseReady) {
    app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
} else {
    console.warn("Firebase config missing. Add it in firebase-config.js.");
}

export { app, auth, db, storage };
