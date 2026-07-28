import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import { app } from "./config.js";

export const auth = getAuth(app);

export function authState(callback) {
  return onAuthStateChanged(auth, callback);
}

export function login(email, password) {
  return signInWithEmailAndPassword(
    auth,
    email,
    password
  );
}

export function logout() {
  return signOut(auth);
}
