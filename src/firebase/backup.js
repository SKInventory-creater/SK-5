import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs
} from "firebase/firestore";

import { db } from "./config.js";

const MAX_CHUNK_BYTES = 700 * 1024;

function getByteSize(value) {
  return new TextEncoder().encode(
    JSON.stringify(value)
  ).length;
}

function splitIntoChunks(records, type) {
  const chunks = [];
  let current = [];
  let currentSize = 0;

  for (const record of records) {
    const testChunk = {
      type,
      version: 3,
      data: [...current, record]
    };

    const testSize = getByteSize(testChunk);

    if (
      current.length > 0 &&
      testSize > MAX_CHUNK_BYTES
    ) {
      chunks.push(current);
      current = [];
      currentSize = 0;
    }

    const singleSize = getByteSize({
      type,
      version: 3,
      data: [record]
    });

    if (singleSize > MAX_CHUNK_BYTES) {
      throw new Error(
        `${type} record တစ်ခုတည်းက အရမ်းကြီးနေပါတယ် (${Math.round(
          singleSize / 1024
        )} KB)`
      );
    }

    current.push(record);
    currentSize += getByteSize(record);
  }

  if (current.length > 0) {
    chunks.push(current);
  }

  return chunks;
}

function createBackupId() {
  const now = new Date();

  const pad = value =>
    String(value).padStart(2, "0");

  return (
    `${now.getFullYear()}` +
    `${pad(now.getMonth() + 1)}` +
    `${pad(now.getDate())}_` +
    `${pad(now.getHours())}` +
    `${pad(now.getMinutes())}` +
    `${pad(now.getSeconds())}_` +
    `${Date.now()}`
  );
}

/*
  Version structure:

  backups/{uid}
      latest -> metadata only

  backups/{uid}/versions/{backupId}
      metadata

  backups/{uid}/versions/{backupId}/chunks/*
      actual data
*/

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

  console.log("================================");
  console.log("BACKUP START");
  console.log("UID:", uid);
  console.log("Bundles:", bundles.length);
  console.log("Items:", items.length);
  console.log("================================");

  /*
    Empty backup ကို မတင်ပါ။
    Data ပျောက်ပြီး backup နှိပ်မိရင်
    အရင် valid backup ကို overwrite မဖြစ်စေရန်။
  */
  if (bundles.length === 0 && items.length === 0) {
    throw new Error(
      "Backup Data ထဲမှာ Bundles / Items မရှိပါ။ Empty backup မတင်ပါ။"
    );
  }

  const bundleChunks = splitIntoChunks(
    bundles,
    "bundles"
  );

  const itemChunks = splitIntoChunks(
    items,
    "items"
  );

  const backupId = createBackupId();

  console.log("NEW BACKUP ID:", backupId);
  console.log(
    "Bundle chunks:",
    bundleChunks.length
  );
  console.log(
    "Item chunks:",
    itemChunks.length
  );

  try {
    /*
      IMPORTANT:
      အဟောင်း backup ကို မဖျက်ပါ။
      Backup အသစ်ကို versions အောက်မှာ အရင်တင်ပါ။
    */

    const versionRef = doc(
      db,
      "backups",
      uid,
      "versions",
      backupId
    );

    const chunksRef = collection(
      versionRef,
      "chunks"
    );

    /*
      BUNDLES
    */

    let chunkIndex = 0;

    for (const chunk of bundleChunks) {
      const chunkId =
        `bundles_${String(chunkIndex).padStart(4, "0")}`;

      await setDoc(
        doc(chunksRef, chunkId),
        {
          type: "bundles",
          version: 3,
          index: chunkIndex,
          data: chunk
        }
      );

      console.log(
        "BUNDLE CHUNK OK:",
        chunkId,
        chunk.length
      );

      chunkIndex++;
    }

    /*
      ITEMS
    */

    chunkIndex = 0;

    for (const chunk of itemChunks) {
      const chunkId =
        `items_${String(chunkIndex).padStart(4, "0")}`;

      await setDoc(
        doc(chunksRef, chunkId),
        {
          type: "items",
          version: 3,
          index: chunkIndex,
          data: chunk
        }
      );

      console.log(
        "ITEM CHUNK OK:",
        chunkId,
        chunk.length
      );

      chunkIndex++;
    }

    /*
      Version metadata
    */

    await setDoc(
      versionRef,
      {
        version: 3,
        backupId,
        updatedAt: Date.now(),

        bundleCount: bundles.length,
        itemCount: items.length,

        bundleChunks: bundleChunks.length,
        itemChunks: itemChunks.length,

        status: "complete"
      }
    );

    /*
      Upload ပြီးတဲ့နောက်မှာပဲ
      data count ကို ပြန်စစ်ပါ။
    */

    const verifySnapshot =
      await getDocs(chunksRef);

    let verifiedBundles = 0;
    let verifiedItems = 0;

    for (const snap of verifySnapshot.docs) {
      const chunk = snap.data();

      if (!Array.isArray(chunk.data)) {
        continue;
      }

      if (chunk.type === "bundles") {
        verifiedBundles += chunk.data.length;
      }

      if (chunk.type === "items") {
        verifiedItems += chunk.data.length;
      }
    }

    console.log(
      "VERIFY BUNDLES:",
      verifiedBundles
    );

    console.log(
      "VERIFY ITEMS:",
      verifiedItems
    );

    if (
      verifiedBundles !== bundles.length ||
      verifiedItems !== items.length
    ) {
      throw new Error(
        `Backup Verify မအောင်မြင်ပါ။ ` +
        `Local=${bundles.length}/${items.length}, ` +
        `Cloud=${verifiedBundles}/${verifiedItems}`
      );
    }

    /*
      အားလုံးမှန်ပြီးမှ latest ကို update လုပ်ပါ။
    */

    await setDoc(
      doc(db, "backups", uid),
      {
        version: 3,
        latestBackupId: backupId,
        updatedAt: Date.now(),

        bundleCount: bundles.length,
        itemCount: items.length,

        bundleChunks: bundleChunks.length,
        itemChunks: itemChunks.length,

        status: "complete"
      }
    );

    console.log(
      "LATEST BACKUP UPDATED:",
      backupId
    );

    console.log(
      "BACKUP FIRESTORE OK"
    );

    return {
      success: true,
      backupId,
      bundles: bundles.length,
      items: items.length,
      bundleChunks: bundleChunks.length,
      itemChunks: itemChunks.length
    };

  } catch (err) {
    console.error(
      "BACKUP FIRESTORE FAILED:",
      err
    );

    /*
      IMPORTANT:
      ဒီမှာ latest ကို မထိပါ။
      အဟောင်း backup မပျောက်ပါ။
    */

    throw new Error(
      `Backup မအောင်မြင်ပါ\n\n` +
      `CODE: ${err.code || "-"}\n` +
      `MESSAGE: ${err.message || err}`
    );
  }
}

export async function downloadBackup(uid) {
  if (!uid) {
    throw new Error(
      "Restore UID မတွေ့ပါ"
    );
  }

  console.log("================================");
  console.log("RESTORE START");
  console.log("UID:", uid);
  console.log("================================");

  try {
    const metaSnap = await getDoc(
      doc(db, "backups", uid)
    );

    if (!metaSnap.exists()) {
      throw new Error(
        "Backup မတွေ့ပါ"
      );
    }

    const meta = metaSnap.data();

    /*
      VERSION 3
    */

    if (
      meta.version >= 3 &&
      meta.latestBackupId
    ) {
      const versionRef = doc(
        db,
        "backups",
        uid,
        "versions",
        meta.latestBackupId
      );

      const versionSnap =
        await getDoc(versionRef);

      if (!versionSnap.exists()) {
        throw new Error(
          "Latest Backup Version မတွေ့ပါ"
        );
      }

      const versionData =
        versionSnap.data();

      if (
        versionData.status !== "complete"
      ) {
        throw new Error(
          "Latest Backup က complete မဖြစ်သေးပါ"
        );
      }

      const chunksRef = collection(
        versionRef,
        "chunks"
      );

      const snapshot =
        await getDocs(chunksRef);

      const bundles = [];
      const items = [];

      for (const snap of snapshot.docs) {
        const chunk = snap.data();

        if (!Array.isArray(chunk.data)) {
          continue;
        }

        if (chunk.type === "bundles") {
          bundles.push(...chunk.data);
        }

        if (chunk.type === "items") {
          items.push(...chunk.data);
        }
      }

      console.log(
        "RESTORE BUNDLES:",
        bundles.length
      );

      console.log(
        "RESTORE ITEMS:",
        items.length
      );

      /*
        Restore မလုပ်ခင် count verify
      */

      if (
        bundles.length !==
          Number(versionData.bundleCount || 0) ||
        items.length !==
          Number(versionData.itemCount || 0)
      ) {
        throw new Error(
          `Backup data မပြည့်စုံပါ။ ` +
          `Expected=${versionData.bundleCount}/${versionData.itemCount}, ` +
          `Actual=${bundles.length}/${items.length}`
        );
      }

      return {
        version: 3,
        backupId: meta.latestBackupId,
        updatedAt:
          versionData.updatedAt ||
          meta.updatedAt ||
          null,
        bundles,
        items
      };
    }

    /*
      VERSION 2
      Old backup compatibility
    */

    if (meta.version >= 2) {
      const chunksRef = collection(
        db,
        "backups",
        uid,
        "chunks"
      );

      const snapshot =
        await getDocs(chunksRef);

      const bundles = [];
      const items = [];

      for (const snap of snapshot.docs) {
        const chunk = snap.data();

        if (!Array.isArray(chunk.data)) {
          continue;
        }

        if (chunk.type === "bundles") {
          bundles.push(...chunk.data);
        }

        if (chunk.type === "items") {
          items.push(...chunk.data);
        }
      }

      return {
        version: 2,
        updatedAt:
          meta.updatedAt || null,
        bundles,
        items
      };
    }

    /*
      VERSION 1
      Old backup compatibility
    */

    return {
      version: meta.version || 1,
      updatedAt:
        meta.updatedAt || null,

      bundles: Array.isArray(meta.bundles)
        ? meta.bundles
        : [],

      items: Array.isArray(meta.items)
        ? meta.items
        : []
    };

  } catch (err) {
    console.error(
      "RESTORE FIRESTORE FAILED:",
      err
    );

    throw new Error(
      `Backup ပြန်ယူ၍မရပါ\n\n` +
      `CODE: ${err.code || "-"}\n` +
      `MESSAGE: ${err.message || err}`
    );
  }
}
