import {
  createShop,
  createUserProfile,
  getShop,
  getUserProfile
} from "../firebase/firestore.js";

export async function createShopAccount(data) {
  console.log("createShopAccount", data);
  await createShop(data.shopId, {
    shopName: data.shopName,
    ownerName: data.ownerName,
    phone: data.phone,
    adminUid: data.adminUid
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
    ownerName: shop?.ownerName || ""
  };
}
