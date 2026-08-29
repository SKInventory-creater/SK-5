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

  console.log("STAFF STEP 1: Checking invite code");

  const shop = await getShopByInviteCode(data.inviteCode);

  console.log("STAFF STEP 2: Invite result:", shop);

  if (!shop) {
    throw new Error("Invitation Code မတွေ့ပါ");
  }

  console.log("STAFF STEP 3: Creating secondary account");

  let credential;

  try {
    credential = await registerSecondary(
      data.email,
      data.password
    );
  } catch (err) {
    console.error("STAFF STEP 3 ERROR:", err);
    throw err;
  }

  console.log(
    "STAFF STEP 3 OK:",
    credential.user.uid
  );

  console.log("STAFF STEP 4: Creating staff profile");

  try {
    await createUserProfile(credential.user.uid, {
      shopId: shop.shopId,
      role: "staff",
      name: data.name,
      phone: data.phone,
      email: data.email
    });
  } catch (err) {
    console.error("STAFF STEP 4 ERROR:", err);
    throw err;
  }

  console.log("STAFF STEP 4 OK");

  return credential.user;
}
