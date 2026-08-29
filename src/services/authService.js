import {
  login,
  register,
  logout,
  getCurrentUser
} from "../firebase/auth.js";

import { getUserProfile, createUserProfile, getShopByInviteCode } from "../firebase/firestore.js";
import { registerSecondary } from "../firebase/auth.js";

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

export async function createStaffAccount(data) {
  if (!data.email || !data.password) {
    throw new Error("Email နှင့် Password ထည့်ပါ");
  }

  if (!data.inviteCode) {
    throw new Error("Invitation Code ထည့်ပါ");
  }

  if (!data.name) {
    throw new Error("Name ထည့်ပါ");
  }

  const shop = await getShopByInviteCode(data.inviteCode);

  if (!shop) {
    throw new Error("Invitation Code မှားနေပါသည်");
  }


  const credential = await registerSecondary(
    data.email,
    data.password
  );

  await createUserProfile(credential.user.uid, {
    shopId: shop.id,
    role: "staff",
    name: data.name,
    phone: data.phone,
    email: data.email
  });

  return credential.user;
}
