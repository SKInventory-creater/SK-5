import {
  createShop,
  createUserProfile,
  getShop,
  getUserProfile,
  getStaffList,
  deleteStaff,
  getShopByName
} from "../firebase/firestore.js";
import { registerSecondary } from "../firebase/auth.js";

export async function createShopAccount(data) {
  console.log("createShopAccount", data);

  const existingShop = await getShopByName(data.shopName);

  if (existingShop) {
    throw new Error("ဒီဆိုင်နာမည်ကို အသုံးပြုပြီးသားဖြစ်ပါတယ်");
  }

  const inviteCode =
  Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  await createShop(data.shopId, {
  shopName: data.shopName,
  ownerName: data.ownerName,
  phone: data.phone,
  adminUid: data.adminUid,
  inviteCode: inviteCode,
  active: true,
  createdAt: Date.now()
});

  await createUserProfile(data.adminUid, {
    shopId: data.shopId,
    role: "admin",
    name: data.ownerName,
    phone: data.phone,
    email: data.email
  });
}

export async function getShopInformation(uid) {
  const user = await getUserProfile(uid);

  if (!user) {
    throw new Error("User Profile မတွေ့ပါ");
  }

  const shop = await getShop(user.shopId);

  return {
    shopId: user.shopId,
    role: user.role,
    email: user.email,
    name: user.name,
    phone: user.phone,
    shopName: shop?.shopName || "",
    ownerName: shop?.ownerName || "",
    inviteCode: shop?.inviteCode || ""
  };
}

export async function createStaffAccount(data) {
  const credential = await registerSecondary(
  data.email,
  data.password
);

  try {
  console.log("Before createUserProfile");

  await createUserProfile(credential.user.uid, {
    shopId: data.shopId,
    role: "staff",
    name: data.name,
    phone: data.phone,
    email: data.email
  });

  console.log("After createUserProfile");

} catch (err) {
  console.error("createUserProfile Error:", err);
  alert(JSON.stringify(err));
}

  return credential.user;
}

export async function loadStaffList(shopId) {
  return await getStaffList(shopId);
}

export async function removeStaff(uid) {
  await deleteStaff(uid);
}
