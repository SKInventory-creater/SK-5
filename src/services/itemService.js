import { initDatabase } from "../database/init.js";

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
