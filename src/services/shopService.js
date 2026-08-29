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
  console.log("=== CREATE SHOP START ===");
  console.log("Auth UID:", data.adminUid);
  console.log("Shop ID:", data.shopId);

  try {
    // 1. Shop name စစ်
    const existingShop = await getShopByName(data.shopName);

    if (existingShop) {
      throw new Error("ဒီဆိုင်နာမည်ကို အသုံးပြုပြီးသားဖြစ်ပါတယ်");
    }

    const inviteCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    // =====================================
    // 2. USER PROFILE ကို အရင်ဖန်တီး
    // =====================================

    console.log("STEP 2: createUserProfile");
    console.log("users/" + data.adminUid);

    const profile = await createUserProfile(data.adminUid, {
      shopId: data.shopId,
      role: "admin",
      name: data.ownerName,
      phone: data.phone,
      email: data.email
    });

    console.log("STEP 2 OK: User profile created");
    console.log("PROFILE:", profile);

    // =====================================
    // 3. SHOP ကို ဖန်တီး
    // =====================================

    console.log("STEP 3: createShop");

    await createShop(data.shopId, {
      shopName: data.shopName,
      ownerName: data.ownerName,
      phone: data.phone,
      adminUid: data.adminUid,
      inviteCode,
      active: true,
      createdAt: Date.now()
    });

    console.log("STEP 3 OK: Shop created");

    // =====================================
    // 4. Profile ကို ပြန်စစ်
    // =====================================

    const verifyProfile =
      await getUserProfile(data.adminUid);

    if (!verifyProfile) {
      throw new Error(
        "User Profile မတွေ့ပါ\n\n" +
        "Path: users/" + data.adminUid
      );
    }

    console.log("=== CREATE SHOP SUCCESS ===");

    return verifyProfile;

  } catch (err) {
    console.error("=== CREATE SHOP FAILED ===");
    console.error("Error code:", err?.code);
    console.error("Error message:", err?.message);
    console.error(err);

    throw err;
  }
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


export async function loadStaffList(shopId) {
  return await getStaffList(shopId);
}

export async function removeStaff(uid) {
  await deleteStaff(uid);
}
