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

  const verifySnap = await getDoc(shopRef);

  if (!verifySnap.exists()) {
    alert(
      "❌ Firestore Shop မတွေ့ပါ\n\n" +
      "Path: shops/" + shopId
    );

    throw new Error("Shop Firestore ထဲမတွေ့ပါ");
  }

  alert(
    "✅ Firestore Shop သိမ်းပြီးပါပြီ\n\n" +
    "Shop ID: " + shopId + "\n" +
    "Shop Name: " + data.shopName
  );
}

export async function getShop(shopId) {
  const snap = await getDoc(
    doc(db, "shops", shopId)
  );

  return snap.exists() ? snap.data() : null;
}

export async function createUserProfile(uid, data) {
  const userRef = doc(db, "users", uid);

  console.log("CREATE USER PROFILE");
  console.log("Path:", "users/" + uid);
  console.log("Data:", {
    uid,
    shopId: data.shopId,
    role: data.role
  });

    try {
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

    alert(
      "USER PROFILE WRITE OK\n\n" +
      "Path: users/" + uid
    );

    console.log(
      "USER PROFILE setDoc OK:",
      "users/" + uid
    );

  } catch (err) {
    alert(
      "USER PROFILE WRITE FAILED\n\n" +
      "Code: " + (err?.code || "") + "\n\n" +
      "Message: " + (err?.message || "")
    );

    console.error("USER PROFILE setDoc FAILED");
    console.error("code:", err?.code);
    console.error("message:", err?.message);

    throw err;
  }

  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    throw new Error(
      "User Profile create ပြီးသော်လည်း မတွေ့ပါ"
    );
  }

  console.log(
    "USER PROFILE CREATED:",
    snap.data()
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
