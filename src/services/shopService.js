import {
  createShop,
  createUserProfile
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
