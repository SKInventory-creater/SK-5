import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./config.js";

export async function uploadBackup(uid, data) {
  if (!uid) {
    throw new Error("Backup UID မတွေ့ပါ");
  }

  if (!data || typeof data !== "object") {
    throw new Error("Backup Data မမှန်ပါ");
  }

  const bundles = Array.isArray(data.bundles)
    ? data.bundles
    : [];

  const items = Array.isArray(data.items)
    ? data.items
    : [];

  const backupData = {
    version: 1,
    updatedAt: Date.now(),
    bundles,
    items
  };

  // Firestore document size ကို ကြိုစစ်
  const sizeKB =
    new TextEncoder().encode(
      JSON.stringify(backupData)
    ).length / 1024;

  console.log("BACKUP START");
  console.log("UID:", uid);
  console.log("Bundles:", bundles.length);
  console.log("Items:", items.length);
  console.log("Backup size:", sizeKB.toFixed(2), "KB");

  if (sizeKB > 900) {
    throw new Error(
      `Backup data ကြီးလွန်းပါသည် (${sizeKB.toFixed(2)} KB)`
    );
  }

  try {
    await setDoc(
      doc(db, "backups", uid),
      backupData,
      { merge: true }
    );

    console.log("BACKUP FIRESTORE OK");

    return {
      success: true,
      bundles: bundles.length,
      items: items.length,
      sizeKB
    };

  } catch (err) {
    console.error("BACKUP FIRESTORE FAILED:", err);

    throw new Error(
      `Backup မအောင်မြင်ပါ\n\nCODE: ${err.code || "-"}\nMESSAGE: ${err.message || err}`
    );
  }
}

export async function downloadBackup(uid) {
  if (!uid) {
    throw new Error("Restore UID မတွေ့ပါ");
  }

  console.log("RESTORE START");
  console.log("UID:", uid);

  try {
    const snap = await getDoc(
      doc(db, "backups", uid)
    );

    if (!snap.exists()) {
      throw new Error("Backup မတွေ့ပါ");
    }

    const data = snap.data();

    return {
      version: data.version || 1,
      updatedAt: data.updatedAt || null,
      bundles: Array.isArray(data.bundles)
        ? data.bundles
        : [],
      items: Array.isArray(data.items)
        ? data.items
        : []
    };

  } catch (err) {
    console.error("RESTORE FIRESTORE FAILED:", err);

    throw new Error(
      `Backup ပြန်ယူ၍မရပါ\n\nCODE: ${err.code || "-"}\nMESSAGE: ${err.message || err}`
    );
  }
}
