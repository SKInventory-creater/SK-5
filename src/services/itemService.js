import { initDatabase } from "../database/init.js";
import { getCurrentUser } from "../firebase/auth.js";
import {
  getUserProfile,
  createItem,
  getItemsByShop,
  updateItemCloud
} from "../firebase/firestore.js";

export async function addItem(item) {
  const db = await initDatabase();

  const user = getCurrentUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const profile = await getUserProfile(user.uid);

  if (!profile?.shopId) {
    throw new Error("Shop Profile မတွေ့ပါ");
  }

  const createdAt = Date.now();

const result = await db.run(
  `
  INSERT INTO items
  (
    shopId,
    bundleId,
    itemId,
    photo,
    cost,
    price,
    unsold,
    removed,
    note,
    createdAt
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  [
    profile.shopId,
    item.bundleId,
    item.itemId,
    item.photo || "",
    Number(item.cost || 0),
    Number(item.price || 0),
    1,
    0,
    item.note || "",
    createdAt
  ]
);

const localItemId = result.changes.lastId;

// Firestore Item ID
const cloudItemId =
  `${profile.shopId}_${item.itemId}`;

try {
  await createItem(cloudItemId, {
    shopId: profile.shopId,
    bundleId: item.cloudBundleId || "",
    itemId: item.itemId,
    photo: item.photo || "",
    cost: Number(item.cost || 0),
    price: Number(item.price || 0),
    unsold: 1,
    removed: 0,
    note: item.note || "",
    soldAt: null,
    createdAt
  });

  console.log(
    "CLOUD ITEM CREATED:",
    cloudItemId
  );

} catch (err) {
  // Internet မရှိရင် Local data ကို မဖျက်ပါ
  console.warn(
    "Cloud item sync failed:",
    err
  );
}

return {
  id: localItemId,
  shopId: profile.shopId,
  bundleId: item.bundleId,
  itemId: item.itemId,
  photo: item.photo || "",
  cost: Number(item.cost || 0),
  price: Number(item.price || 0),
  unsold: 1,
  removed: 0,
  note: item.note || "",
  soldAt: null,
  createdAt
};
}

export async function generateItems(bundle) {
  const db = await initDatabase();

  if (!bundle?.shopId) {
    throw new Error("Bundle shopId မတွေ့ပါ");
  }

  const qty = Number(bundle.qty || 0);

  if (qty <= 0) {
    throw new Error("Bundle အရေအတွက် မမှန်ပါ");
  }

  const unitCost = Math.floor(Number(bundle.cost || 0) / qty);
  const remainder =
    Number(bundle.cost || 0) - (unitCost * qty);

  for (let i = 1; i <= qty; i++) {

    const itemId =
      bundle.bundleCode +
      String(i).padStart(3, "0");

    const itemCost =
      i === qty
        ? unitCost + remainder
        : unitCost;

    await db.run(
      `
      INSERT INTO items
      (
        shopId,
        bundleId,
        itemId,
        photo,
        cost,
        price,
        unsold,
        removed,
        note,
        createdAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        bundle.shopId,
        bundle.id,
        itemId,
        "",
        itemCost,
        0,
        1,
        0,
        "",
        Date.now()
      ]
    );
  }
}

export async function getItems(bundleId) {
  const db = await initDatabase();

  const user = getCurrentUser();

  if (!user) {
    return [];
  }

  const profile = await getUserProfile(user.uid);

  if (!profile?.shopId) {
    return [];
  }

  // =========================================
  // LOCAL BUNDLE
  // =========================================

  const bundleResult = await db.query(
    `
    SELECT *
    FROM bundles
    WHERE id = ?
      AND shopId = ?
    LIMIT 1
    `,
    [bundleId, profile.shopId]
  );

  const bundle = bundleResult.values?.[0];

  if (!bundle) {
    console.warn(
      "Local bundle မတွေ့ပါ:",
      bundleId
    );

    return [];
  }

  // =========================================
  // CLOUD → LOCAL SYNC
  // =========================================

  try {
    const cloudItems =
      await getItemsByShop(profile.shopId);

    const cloudBundleId =
      bundle.cloudBundleId
        ? String(bundle.cloudBundleId)
        : "";

    const bundleCode =
      String(bundle.bundleCode || "").toUpperCase();

    for (const cloudItem of cloudItems) {

      const cloudItemBundleId =
        cloudItem.bundleId !== undefined &&
        cloudItem.bundleId !== null
          ? String(cloudItem.bundleId)
          : "";

      const cloudItemId =
        String(cloudItem.itemId || "").toUpperCase();

      // New format:
      // Firestore item.bundleId = stable cloudBundleId
      let belongsToBundle =
        cloudBundleId &&
        cloudItemBundleId === cloudBundleId;

      // Legacy format:
      // Firestore item.bundleId may contain
      // the old local SQLite bundle ID such as "4".
      if (!belongsToBundle) {
        const legacyBundleId =
          Number(cloudItemBundleId);

        if (
          Number.isInteger(legacyBundleId) &&
          legacyBundleId === Number(bundleId)
        ) {
          belongsToBundle = true;
        }
      }

      // Legacy generated item IDs:
      // MK001, MK002, MK003 ...
      //
      // Use the exact pattern:
      // bundleCode + 3 digits
      if (!belongsToBundle && bundleCode) {
        const pattern =
          new RegExp(
            "^" +
            bundleCode.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            ) +
            "\\d{3}$"
          );

        if (pattern.test(cloudItemId)) {
          belongsToBundle = true;
        }
      }

      if (!belongsToBundle) {
        continue;
      }

      if (!cloudItem.itemId) {
        continue;
      }

      // =======================================
      // CHECK LOCAL ITEM
      // =======================================

      const existingResult = await db.query(
        `
        SELECT id
        FROM items
        WHERE shopId = ?
          AND itemId = ?
        LIMIT 1
        `,
        [
          profile.shopId,
          cloudItem.itemId
        ]
      );

      const values =
        existingResult.values || [];

      if (values.length > 0) {

        // =====================================
        // UPDATE EXISTING LOCAL ITEM
        // =====================================

        await db.run(
          `
          UPDATE items
          SET
            bundleId = ?,
            photo = ?,
            cost = ?,
            price = ?,
            unsold = ?,
            removed = ?,
            note = ?,
            soldAt = ?,
            createdAt = ?
          WHERE id = ?
          `,
          [
            bundle.id,
            cloudItem.photo || "",
            Number(cloudItem.cost || 0),
            Number(cloudItem.price || 0),
            Number(cloudItem.unsold ?? 1),
            Number(cloudItem.removed ?? 0),
            cloudItem.note || "",
            cloudItem.soldAt || null,
            cloudItem.createdAt || Date.now(),
            values[0].id
          ]
        );

      } else {

        // =====================================
        // INSERT CLOUD ITEM INTO LOCAL SQLITE
        // =====================================

        await db.run(
          `
          INSERT INTO items
          (
            shopId,
            bundleId,
            itemId,
            photo,
            cost,
            price,
            unsold,
            removed,
            note,
            soldAt,
            createdAt
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            profile.shopId,
            bundle.id,
            cloudItem.itemId,
            cloudItem.photo || "",
            Number(cloudItem.cost || 0),
            Number(cloudItem.price || 0),
            Number(cloudItem.unsold ?? 1),
            Number(cloudItem.removed ?? 0),
            cloudItem.note || "",
            cloudItem.soldAt || null,
            cloudItem.createdAt || Date.now()
          ]
        );
      }
    }

    console.log(
      "CLOUD ITEMS SYNC OK:",
      bundle.bundleCode
    );

  } catch (err) {

    console.warn(
      "Cloud item sync skipped:",
      err
    );
  }

  // =========================================
  // RETURN LOCAL ITEMS
  // =========================================

  const result = await db.query(
    `
    SELECT *
    FROM items
    WHERE shopId = ?
      AND bundleId = ?
    ORDER BY itemId ASC
    `,
    [
      profile.shopId,
      bundleId
    ]
  );

  return result.values ?? [];
}

export async function updateItem(item) {
  const db = await initDatabase();

  const user = getCurrentUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const profile = await getUserProfile(user.uid);

  if (!profile?.shopId) {
    throw new Error("Shop Profile မတွေ့ပါ");
  }

  // Local SQLite update
  await db.run(
    `
    UPDATE items
    SET
      photo=?,
      cost=?,
      price=?,
      unsold=?,
      removed=?,
      note=?,
      soldAt=?,
      createdAt=?
    WHERE id=?
    `,
    [
      item.photo || "",
      Number(item.cost || 0),
      Number(item.price || 0),
      Number(item.unsold ?? 1),
      Number(item.removed ?? 0),
      item.note || "",
      item.soldAt || null,
      item.createdAt || Date.now(),
      item.id
    ]
  );

  // =========================================
  // FIRESTORE UPDATE
  // =========================================

  // SQLite bundleId is a local integer ID.
  // Firestore needs the stable cloudBundleId.
  const bundleResult = await db.query(
    `
    SELECT cloudBundleId
    FROM bundles
    WHERE id = ?
      AND shopId = ?
    LIMIT 1
    `,
    [
      item.bundleId,
      profile.shopId
    ]
  );

  const localBundle =
    bundleResult.values?.[0];

  const cloudBundleId =
    localBundle?.cloudBundleId ||
    "";

  const cloudItemId =
    `${profile.shopId}_${item.itemId}`;

  await updateItemCloud(cloudItemId, {
    shopId: profile.shopId,
    bundleId: cloudBundleId,
    itemId: item.itemId,
    photo: item.photo || "",
    cost: Number(item.cost || 0),
    price: Number(item.price || 0),
    unsold: Number(item.unsold ?? 1),
    removed: Number(item.removed ?? 0),
    note: item.note || "",
    soldAt: item.soldAt || null,
    createdAt: item.createdAt || Date.now()
  });

  return true;
}

export async function getTotalProfit() {
  const db = await initDatabase();

  const user = getCurrentUser();

  if (!user) {
    return 0;
  }

  const profile = await getUserProfile(user.uid);

  if (!profile || !profile.shopId) {
    return 0;
  }

  const result = await db.query(
    `
    SELECT
      SUM(items.price - items.cost) AS profit
    FROM items
    INNER JOIN bundles
      ON items.bundleId = bundles.id
    WHERE bundles.shopId = ?
      AND items.unsold = 0
      AND items.removed = 0
    `,
    [profile.shopId]
  );

  return Number(result.values?.[0]?.profit || 0);
}

export async function searchItems(keyword) {
  const db = await initDatabase();

  const text = `%${keyword.trim()}%`;

  const result = await db.query(
    `
    SELECT *
    FROM items
    WHERE
      itemId LIKE ?
      OR note LIKE ?
    ORDER BY itemId ASC
    `,
    [text, text]
  );

  return result.values ?? [];
}

export async function getDailySoldItems(date) {

  const db = await initDatabase();

  const user = getCurrentUser();

  if (!user) {
    return [];
  }

  const profile = await getUserProfile(user.uid);

  if (!profile) {
    return [];
  }

  const result = await db.query(
    `
    SELECT items.*
    FROM items
    INNER JOIN bundles
      ON items.bundleId = bundles.id
    WHERE
      bundles.shopId = ?
      AND items.unsold = 0
      AND items.removed = 0
      AND substr(items.soldAt,1,10) = ?
    ORDER BY items.soldAt DESC
    `,
    [profile.shopId, date]
  );

  return result.values ?? [];
}
