import {
  login,
  register,
  logout,
  getCurrentUser
} from "../firebase/auth.js";

import { getUserProfile } from "../firebase/firestore.js";

export async function loginUser(email, password) {
  if (!email || !password) {
    throw new Error("Email နှင့် Password ထည့်ပါ");
  }

  return await login(email, password);
}

export async function registerUser(email, password) {
  if (!email || !password) {
    throw new Error("Email နှင့် Password ထည့်ပါ");
  }

  return await register(email, password);
}

export async function logoutUser() {
  return await logout();
}

export function currentUser() {
  return getCurrentUser();
}

export async function currentUserProfile() {

  const user = getCurrentUser();

  if (!user) {
    return null;
  }

  return await getUserProfile(user.uid);

}
