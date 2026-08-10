import { initDatabase } from "../database/init.js";
import { getCurrentUser } from "../firebase/auth.js";
import { getUserProfile } from "../firebase/firestore.js";

export async function addItem(item) {
  const db = await initDatabase();

  await db.run(
    `
    INSERT INTO items
    (
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
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      item.bundleId,
      item.itemId,
      item.photo,
      item.cost,
      item.price,
      1,
      0,
      item.note,
      Date.now()
    ]
  );
}

export async function generateItems(bundle) {
  const db = await initDatabase();

  for (let i = 1; i <= Number(bundle.qty); i++) {

    const itemId =
      bundle.bundleCode +
      String(i).padStart(3, "0");

    await db.run(
      `
      INSERT INTO items
      (
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
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        bundle.id,
        itemId,
        "",
        0,
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
