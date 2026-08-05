import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./config.js";

export async function uploadBackup(uid, data) {

  await setDoc(
    doc(db, "backups", uid),
    {
      updatedAt: Date.now(),
      bundles: data.bundles,
      items: data.items
    }
  );

}

export async function downloadBackup(uid) {
  const snap = await getDoc(doc(db, "backups", uid));

  if (!snap.exists()) {
    throw new Error("Backup မတွေ့ပါ");
  }

  return snap.data();
}
