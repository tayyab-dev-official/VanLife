const firebaseConfig = {
  apiKey: "AIzaSyD7NftMu_kJate38lOOSNa73XkzotuwDjA",
  authDomain: "keshf-vanlife.firebaseapp.com",
  projectId: "keshf-vanlife",
  storageBucket: "keshf-vanlife.appspot.com",
  messagingSenderId: "652985773035",
  appId: "1:652985773035:web:1ea8f33d714c7e6bd647ae",
};

// App initialization
import { initializeApp } from "firebase/app";
export const app = initializeApp(firebaseConfig);

// Firestore setup
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  getFirestore,
} from "firebase/firestore"; 

// Firebase Auth setup
import { getAuth } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
export const db = getFirestore(app);
export const auth = getAuth(app);

export async function createUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return {
      user: userCredential.user,
      error: null,
    };
  } catch (error) {
    let message = "Failed to create account";
    switch (error.code) {
      case "auth/email-already-in-use":
        message = "Email already in use";
        break;
      case "auth/invalid-email":
        message = "Invalid email address";
        break;
      case "auth/weak-password":
        message = "Password should be at least 6 characters";
        break;
      case "auth/operation-not-allowed":
        message =
          "Email/password accounts are not enabled. Please contact support.";
        break;
      default:
        message = error.message;
    }
    console.error("Firebase auth error:", error);
    return { user: null, error: message };
  }
}

export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return {
      user: userCredential.user,
      token: await userCredential.user.getIdToken(),
      error: null,
    };
  } catch (error) {
    let message = "Failed to login: ";
    switch (error.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        message = "Invalid email or password";
        break;
      case "auth/invalid-email":
        message = "Invalid email address";
        break;
      case "auth/user-disabled":
        message = "This account has been disabled";
        break;
      case "auth/too-many-requests":
        message = "Too many failed attempts. Please try again later";
        break;
      default:
        message = error.message;
        console.log(message);
    }
    console.error("Firebase auth error:", error);
    return { user: null, token: null, error: message };
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback);
}


export async function getVans() {
  try {
    const vansCollectionRef = collection(db, "vans");
    const snapshot = await getDocs(vansCollectionRef);
    const vans = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return vans;
  } catch (error) {
    console.error("Error getting vans:", error);
    throw error;
  }
}

export async function getVan(id) {
  try {
    const docRef = doc(db, "vans", id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      throw new Error("No van found with that id");
    }
    return {
      ...snapshot.data(),
      id: snapshot.id,
    };
  } catch (error) {
    console.error("Error getting van:", error);
    throw error;
  }
}

export async function getHostVans() {
  try {
    const vansCollectionRef = collection(db, "vans");
    const q = query(vansCollectionRef, where("hostId", "==", "123"));
    const snapshot = await getDocs(q);
    const vans = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return vans;
  } catch (error) {
    console.error("Error getting host vans:", error);
    throw error;
  }
}


