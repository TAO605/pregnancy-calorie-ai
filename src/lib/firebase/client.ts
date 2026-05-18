"use client";

import { initializeApp, getApp, getApps } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { getFirebaseConfig, isFirebaseConfigured } from "@/lib/firebase/config";

type FirebaseClient = {
  auth: ReturnType<typeof getAuth>;
  db: ReturnType<typeof getFirestore>;
  googleProvider: GoogleAuthProvider;
};

let clientCache: FirebaseClient | null = null;
let persistencePromise: Promise<void> | null = null;

export function getFirebaseClient(): FirebaseClient | null {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (clientCache) {
    return clientCache;
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig());
  const auth = getAuth(app);
  const db = getFirestore(app);
  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });

  if (!persistencePromise) {
    persistencePromise = setPersistence(auth, browserLocalPersistence).then(() => undefined);
  }

  clientCache = {
    auth,
    db,
    googleProvider,
  };

  return clientCache;
}

export async function waitForFirebaseUser() {
  const client = getFirebaseClient();

  if (!client) {
    return null;
  }

  await persistencePromise;

  if (client.auth.currentUser) {
    return client.auth.currentUser;
  }

  return await new Promise<ReturnType<typeof getAuth>["currentUser"]>((resolve) => {
    const unsubscribe = onAuthStateChanged(client.auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}
