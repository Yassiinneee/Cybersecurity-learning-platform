import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");

/**
 * Syncs user details directly into the Firestore 'users' collection.
 */
export async function syncUserToFirestore(user) {
  if (!user) return;
  const userId = String(user.id || user._id || user.email || 'user_' + Date.now());
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      username: user.username || user.name || "Operative",
      email: user.email || "",
      age: user.age || 25,
      location: user.location || "Global Node",
      gender: user.gender || "Not specified",
      level: user.level || 1,
      xp: user.xp || 0,
      role: user.role || "student",
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log("User document successfully synced to Firestore:", userId);
  } catch (err) {
    console.warn("Firestore user sync note:", err);
  }
}

export default app;
