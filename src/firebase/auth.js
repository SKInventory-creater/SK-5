import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

import {
  auth,
  secondaryAuth
} from "./config.js";

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

// Staff Account ဖန်တီးဖို့
export function registerSecondary(email, password) {
  return createUserWithEmailAndPassword(
    secondaryAuth,
    email,
    password
  );
}

export function logoutSecondary() {
  return signOut(secondaryAuth);
}

export function logout() {
  return signOut(auth);
}

export function getCurrentUser() {
  return auth.currentUser;
}
