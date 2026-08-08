import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

import { app } from "./config.js";
import { deleteDoc } from "firebase/firestore";

export const db = getFirestore(app);

export async function createShop(shopId, data) {
  await setDoc(
    doc(db, "shops", shopId),
    {
      shopName: data.shopName,
      ownerName: data.ownerName,
      phone: data.phone,
      adminUid: data.adminUid,

      inviteCode: data.inviteCode,

      active: data.active,
      createdAt: data.createdAt
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

export async function getStaffList(shopId) {

  const q = query(
    collection(db, "users"),
    where("shopId", "==", shopId),
    where("role", "==", "staff")
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    uid: doc.id,
    ...doc.data()
  }));

}

export async function deleteStaff(uid) {
  await deleteDoc(
    doc(db, "users", uid)
  );
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
