import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc
} from "firebase/firestore";

import { app } from "./config.js";

export const db = getFirestore(app);


// =========================
// SHOPS
// =========================

export async function createShop(shopId, data) {
  const shopRef = doc(db, "shops", shopId);

  await setDoc(shopRef, {
    shopName: data.shopName,
    ownerName: data.ownerName,
    phone: data.phone,
    adminUid: data.adminUid,
    inviteCode: data.inviteCode,
    active: data.active,
    createdAt: data.createdAt
  });

  const snap = await getDoc(shopRef);

  if (!snap.exists()) {
    throw new Error(
      "Shop Firestore ထဲ မတွေ့ပါ\n\n" +
      "Path: shops/" + shopId
    );
  }

  console.log(
    "SHOP CREATED:",
    "shops/" + shopId
  );

  return snap.data();
}


export async function getShop(shopId) {
  const snap = await getDoc(
    doc(db, "shops", shopId)
  );

  return snap.exists()
    ? snap.data()
    : null;
}


// =========================
// USERS
// =========================

export async function createUserProfile(uid, data) {
  const userRef = doc(db, "users", uid);

  console.log(
    "CREATE USER PROFILE:",
    "users/" + uid
  );

  await setDoc(userRef, {
    uid,
    shopId: data.shopId,
    role: data.role,
    name: data.name,
    phone: data.phone,
    email: data.email,
    active: true,
    createdAt: Date.now()
  });

  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    throw new Error(
      "User Profile create ပြီးသော်လည်း မတွေ့ပါ\n\n" +
      "Path: users/" + uid
    );
  }

  console.log(
    "USER PROFILE CREATED:",
    snap.data()
  );

  return snap.data();
}


export async function getUserProfile(uid) {
  const snap = await getDoc(
    doc(db, "users", uid)
  );

  return snap.exists()
    ? snap.data()
    : null;
}


// =========================
// STAFF
// =========================

export async function getStaffList(shopId) {
  const q = query(
    collection(db, "users"),
    where("shopId", "==", shopId),
    where("role", "==", "staff")
  );

  const snap = await getDocs(q);

  return snap.docs.map(item => ({
    uid: item.id,
    ...item.data()
  }));
}


export async function deleteStaff(uid) {
  await deleteDoc(
    doc(db, "users", uid)
  );
}


// =========================
// SHOP SEARCH
// =========================

export async function getShopByInviteCode(inviteCode) {
  const q = query(
    collection(db, "shops"),
    where("inviteCode", "==", inviteCode)
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    return null;
  }

  return {
    id: snap.docs[0].id,
    ...snap.docs[0].data()
  };
}


export async function getShopByName(shopName) {
  const q = query(
    collection(db, "shops"),
    where("shopName", "==", shopName.trim())
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    return null;
  }

  return {
    id: snap.docs[0].id,
    ...snap.docs[0].data()
  };
}
