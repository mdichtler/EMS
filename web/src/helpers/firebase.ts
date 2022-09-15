import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  query,
  setDoc,
  limit,
  getDocs,
  updateDoc,
  addDoc,
} from "firebase/firestore";

import {
  Config,
  User,
  GeneralConfig,
  EMSConfig,
  EMSProfile,
  APIKey,
} from "./types";
import { useState } from "react";

const firebaseConfig = require("./../firebaseConfig.json");
const app = initializeApp(firebaseConfig);
console.log(app);
const auth = getAuth();

const db = getFirestore();
const provider = new GoogleAuthProvider();

// :HOOKS

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  onAuthStateChanged(auth, (u) => {
    if (u) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User

      const signedUser: User = {
        displayName: u.displayName,
        email: `${u.email}`,
        photoURL: u.photoURL,
        uid: u.uid,
      };
      if (user?.uid !== signedUser.uid) {
        setUser(signedUser);
      }
    } else {
      // User is signed out
      // ...
      setUser(null);
    }
  });
  return user;
}
// :LOAD FIRESTORE
export async function getAppSettings(): Promise<Config | null> {
  const configRef = doc(db, "app", "config");
  const configSnap = await getDoc(configRef);

  if (configSnap.exists()) {
    return configSnap.data() as Config;
  } else {
    return null;
  }
}

export async function getAPIKeys() {
  const q = query(collection(db, "apiKeys"));
  const querySnapshot = await getDocs(q);
  const keys: APIKey[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    let key: APIKey = {
      key: doc.id,
      name: data.name ?? "",
      created_by: data.created_by,
      permissions: data.permissions ?? {},
    };
    keys.push(key);
  });
  return keys;
}

export async function getEMSProfile(
  id: string | null
): Promise<EMSProfile | null> {
  if (!auth.currentUser) {
    return null;
  }
  let profileRef = doc(db, "ems", `${auth.currentUser.email}`);
  if (id) {
    // show profile of other user if Id is provided
    profileRef = doc(db, "ems", `${id}`);
  }

  const profileSnap = await getDoc(profileRef);

  if (profileSnap.exists()) {
    return profileSnap.data() as EMSProfile;
  } else {
    return null;
  }
}

export async function getEMSRecords(
  maxRows: number
): Promise<EMSProfile[] | null> {
  const emsRef = query(collection(db, "ems"), limit(maxRows));
  const emsSnap = await getDocs(emsRef);
  const records: EMSProfile[] = [];

  emsSnap.forEach((doc) => {
    records.push({
      ...doc.data(),
      id: doc.id,
      email: doc.data().email,
    } as EMSProfile);
  });

  return records;
}
// :SAVE FIRESTORE
export async function updateGeneralAppSettings(
  generalConfig: GeneralConfig
): Promise<void> {
  const configRef = doc(db, "app", "config");
  const res = await updateDoc(configRef, "general", generalConfig);
  return res;
}

export async function saveKeySettings(key: APIKey) {
  const keyId = key.key;
  if (keyId) {
    const keyRef = doc(db, "apiKeys", keyId);
    delete key.key;
    delete key.hidden;
    const res = await setDoc(keyRef, key);
    return res;
  } else {
    throw new Error("Key ID is missing");
  }
}

export async function linkEMSProfile(): Promise<void> {
  if (!auth.currentUser) {
    return;
  }
  const profileRef = doc(db, "ems", `${auth.currentUser.email}`);
  const res = await updateDoc(profileRef, {
    uuid: auth.currentUser.uid,
  });
  return res;
}

export async function updateEMSAppSettings(emsConfig: EMSConfig) {
  const configRef = doc(db, "app", "config");
  const res = await updateDoc(configRef, "ems", emsConfig);
  return res;
}

export async function updateEMSEmployee(data: EMSProfile) {
  const res = await updateDoc(doc(db, "ems", data.email), data);
  return res;
}

// :WRITE FIRESTORE
export async function generateAPIKey() {
  const apiKeyRef = collection(db, "apiKeys");
  const res = await addDoc(apiKeyRef, {
    created_by: auth.currentUser?.email,
    permissions: {},
  });
  return res;
}

// This should be object of type any, since we don't know the structure of the object
export async function createEMSEmployee(data: EMSProfile) {
  const res = await setDoc(doc(db, "ems", data.email), data);
  return res;
}

export async function setAppSettings(config: Config) {
  const configRef = doc(db, "app", "config");
  const res = await setDoc(configRef, config);
  return res;
}

// :AUTH
export function signInWithGoogle(): void {
  try {
    signInWithPopup(auth, provider)
      .then((result) => {})
      .catch((error) => {});
  } catch (error) {}
}

export async function signOutUser() {
  return new Promise((resolve, reject) => {
    auth
      .signOut()
      .then(() => {
        resolve("Signed out.");
      })
      .catch((e) => {
        reject(e);
      });
  });
}
