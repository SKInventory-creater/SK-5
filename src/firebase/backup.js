import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc
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
      version: 2,
      data: [...current, record]
    };

    const recordSize = getByteSize(testChunk);

    if (recordSize > MAX_CHUNK_BYTES) {
      if (current.length > 0) {
        chunks.push(current);
        current = [];
        currentSize = 0;
      }

      const singleSize = getByteSize({
        type,
        version: 2,
        data: [record]
      });

      if (singleSize > MAX_CHUNK_BYTES) {
        throw new Error(
          `${type} ထဲက record တစ်ခုတည်းက အရမ်းကြီးနေပါတယ် (${Math.round(singleSize / 1024)} KB)`
        );
      }

      chunks.push([record]);
      continue;
    }

    if (
      current.length > 0 &&
      currentSize + getByteSize(record) > MAX_CHUNK_BYTES
    ) {
      chunks.push(current);
      current = [];
      currentSize = 0;
    }

    current.push(record);
    currentSize += getByteSize(record);
  }

  if (current.length > 0) {
    chunks.push(current);
  }

  return chunks;
}

async function deleteOldChunks(uid) {
  const chunksRef = collection(
    db,
    "backups",
    uid,
    "chunks"
  );

  const snapshot = await getDocs(chunksRef);

  for (const item of snapshot.docs) {
    await deleteDoc(item.ref);
  }

  console.log(
    "OLD BACKUP CHUNKS DELETED:",
    snapshot.size
  );
}

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

  const bundleChunks = splitIntoChunks(
    bundles,
    "bundles"
  );

  const itemChunks = splitIntoChunks(
    items,
    "items"
  );

  console.log(
    "Bundle chunks:",
    bundleChunks.length
  );

  console.log(
    "Item chunks:",
    itemChunks.length
  );

  try {
    // အဟောင်း chunk တွေရှင်း
    await deleteOldChunks(uid);

    const chunksRef = collection(
      db,
      "backups",
      uid,
      "chunks"
    );

    let chunkIndex = 0;

    // =========================
    // BUNDLES
    // =========================

    for (const chunk of bundleChunks) {
      const chunkId =
        `bundles_${String(chunkIndex).padStart(4, "0")}`;

      await setDoc(
        doc(chunksRef, chunkId),
        {
          type: "bundles",
          version: 2,
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

    // =========================
    // ITEMS
    // =========================

    chunkIndex = 0;

    for (const chunk of itemChunks) {
      const chunkId =
        `items_${String(chunkIndex).padStart(4, "0")}`;

      await setDoc(
        doc(chunksRef, chunkId),
        {
          type: "items",
          version: 2,
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

    // =========================
    // META
    // =========================

    await setDoc(
      doc(db, "backups", uid),
      {
        version: 2,
        updatedAt: Date.now(),
        bundleCount: bundles.length,
        itemCount: items.length,
        bundleChunks: bundleChunks.length,
        itemChunks: itemChunks.length
      }
    );

    console.log("BACKUP META OK");
    console.log("BACKUP FIRESTORE OK");

    return {
      success: true,
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

    throw new Error(
      `Backup မအောင်မြင်ပါ\n\nCODE: ${err.code || "-"}\nMESSAGE: ${err.message || err.message || err}`
    );
  }
}

export async function downloadBackup(uid) {
  if (!uid) {
    throw new Error("Restore UID မတွေ့ပါ");
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
      throw new Error("Backup မတွေ့ပါ");
    }

    const meta = metaSnap.data();

    // =========================
    // NEW CHUNK BACKUP
    // =========================

    if (meta.version >= 2) {
      const chunksRef = collection(
        db,
        "backups",
        uid,
        "chunks"
      );

      const snapshot = await getDocs(chunksRef);

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

      return {
        version: meta.version || 2,
        updatedAt: meta.updatedAt || null,
        bundles,
        items
      };
    }

    // =========================
    // OLD BACKUP COMPATIBILITY
    // =========================

    return {
      version: meta.version || 1,
      updatedAt: meta.updatedAt || null,
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
      `Backup ပြန်ယူ၍မရပါ\n\nCODE: ${err.code || "-"}\nMESSAGE: ${err.message || err.message || err}`
    );
  }
}
