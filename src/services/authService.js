import {
  login,
  register,
  logout
} from "../firebase/auth.js";

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
