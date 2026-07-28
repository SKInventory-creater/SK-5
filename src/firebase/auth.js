import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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

export function register(email, password) {
  return createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
}

export function logout() {
  return signOut(auth);
}
