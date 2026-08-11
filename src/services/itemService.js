import { initDatabase } from "../database/init.js";
import { getCurrentUser } from "../firebase/auth.js";
import {
  getUserProfile,
  createItem
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

  const result = await db.query(
    `
    SELECT *
    FROM items
    WHERE bundleId=?
    ORDER BY itemId ASC
    `,
    [bundleId]
  );

  return result.values ?? [];
}

export async function updateItem(item) {
  const db = await initDatabase();

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
      item.photo,
      item.cost,
      item.price,
      item.unsold,
      item.removed,
      item.note,
      item.soldAt,
      item.createdAt,
      item.id
    ]
  );
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
