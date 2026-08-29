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
  const inviteRef = doc(db, "shopInvites", data.inviteCode);

  await setDoc(inviteRef, {
    shopId,
    shopName: data.shopName,
    inviteCode: data.inviteCode,
    active: data.active
  });

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
  const code = inviteCode.trim().toUpperCase();

  if (!code) {
    return null;
  }

  const inviteRef = doc(db, "shopInvites", code);
  const snap = await getDoc(inviteRef);

  if (!snap.exists()) {
    return null;
  }

  const data = snap.data();

  if (data.active !== true) {
    return null;
  }

  return {
    id: data.shopId,
    shopId: data.shopId,
    shopName: data.shopName || "",
    inviteCode: data.inviteCode || code,
    active: data.active
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

// =========================
// BUNDLES
// =========================

export async function createBundle(bundleId, data) {
  const bundleRef = doc(db, "bundles", bundleId);

  await setDoc(bundleRef, {
    shopId: data.shopId,
    bundleId,
    bundleCode: data.bundleCode,
    bundleName: data.bundleName,
    qty: Number(data.qty || 0),
    cost: Number(data.cost || 0),
    createdAt: data.createdAt || Date.now()
  });

  const snap = await getDoc(bundleRef);

  if (!snap.exists()) {
    throw new Error(
      "Bundle Firestore ထဲ မတွေ့ပါ\n\n" +
      "Path: bundles/" + bundleId
    );
  }

  console.log(
    "BUNDLE CREATED:",
    "bundles/" + bundleId
  );

  return {
    id: snap.id,
    ...snap.data()
  };
}


export async function getBundlesByShop(shopId) {
  const q = query(
    collection(db, "bundles"),
    where("shopId", "==", shopId)
  );

  const snap = await getDocs(q);

  return snap.docs.map(item => ({
    id: item.id,
    ...item.data()
  }));
}


export async function deleteBundleCloud(bundleId) {
  await deleteDoc(
    doc(db, "bundles", bundleId)
  );
}


// =========================
// ITEMS
// =========================

export async function createItem(itemId, data) {
  const itemRef = doc(db, "items", itemId);

  await setDoc(itemRef, {
    shopId: data.shopId,
    bundleId: data.bundleId,
    itemId,
    photo: data.photo || "",
    cost: Number(data.cost || 0),
    price: Number(data.price || 0),
    unsold: Number(data.unsold ?? 1),
    removed: Number(data.removed ?? 0),
    note: data.note || "",
    soldAt: data.soldAt || null,
    createdAt: data.createdAt || Date.now()
  });

  const snap = await getDoc(itemRef);

  if (!snap.exists()) {
    throw new Error(
      "Item Firestore ထဲ မတွေ့ပါ\n\n" +
      "Path: items/" + itemId
    );
  }

  console.log(
    "ITEM CREATED:",
    "items/" + itemId
  );

  return {
    id: snap.id,
    ...snap.data()
  };
}


export async function getItemsByShop(shopId) {
  const q = query(
    collection(db, "items"),
    where("shopId", "==", shopId)
  );

  const snap = await getDocs(q);

  return snap.docs.map(item => ({
    id: item.id,
    ...item.data()
  }));
}


export async function getItemsByBundle(bundleId, shopId) {
  const q = query(
    collection(db, "items"),
    where("shopId", "==", shopId),
    where("bundleId", "==", bundleId)
  );

  const snap = await getDocs(q);

  return snap.docs.map(item => ({
    id: item.id,
    ...item.data()
  }));
}


export async function updateItemCloud(itemId, data) {
  const itemRef = doc(db, "items", itemId);

  await setDoc(
    itemRef,
    {
      shopId: data.shopId,
      bundleId: data.bundleId,
      itemId,
      photo: data.photo || "",
      cost: Number(data.cost || 0),
      price: Number(data.price || 0),
      unsold: Number(data.unsold ?? 1),
      removed: Number(data.removed ?? 0),
      note: data.note || "",
      soldAt: data.soldAt || null,
      createdAt: data.createdAt || Date.now()
    },
    { merge: true }
  );

  const snap = await getDoc(itemRef);

  return snap.exists()
    ? {
        id: snap.id,
        ...snap.data()
      }
    : null;
}


export async function deleteItemCloud(itemId) {
  await deleteDoc(
    doc(db, "items", itemId)
  );
}
