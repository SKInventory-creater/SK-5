import {
  getAuth,
  onAuthStateChanged
} from "firebase/auth";

import { app } from "./config.js";

export const auth = getAuth(app);

export function authState(callback) {
  return onAuthStateChanged(auth, callback);
}

