import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

import { app } from "./config.js";

export const db = getFirestore(app);

export async function createShop(shopId, data) {
  await setDoc(
    doc(db, "shops", shopId),
    {
      shopName: data.shopName,
      ownerName: data.ownerName,
      phone: data.phone,
      adminUid: data.adminUid,
      active: true,
      createdAt: Date.now()
    }
  );
}

export async function getShop(shopId) {
  const snap = await getDoc(
    doc(db, "shops", shopId)
  );

  return snap.exists() ? snap.data() : null;
}

export async function createUserProfile(uid, data) {
  await setDoc(
    doc(db, "users", uid),
    {
      uid,
      shopId: data.shopId,
      role: data.role,
      name: data.name,
      phone: data.phone,
      email: data.email,
      active: true,
      createdAt: Date.now()
    }
  );
}

export async function getUserProfile(uid) {
  const snap = await getDoc(
    doc(db, "users", uid)
  );

  return snap.exists() ? snap.data() : null;
}
