import { doc, setDoc } from "firebase/firestore";
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
