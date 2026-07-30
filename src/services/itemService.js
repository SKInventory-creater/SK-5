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
	  note=?,
	  unsold=?,
	  removed=?
	WHERE id=?
    `,
     [
	  item.photo,
	  item.cost,
	  item.price,
	  item.note,
	  item.unsold,
	  item.removed,
	  item.id
	]
  );
}

export async function getTotalProfit() {
  const db = await initDatabase();

  const result = await db.query(`
    SELECT
      SUM(price - cost) AS profit
    FROM items
    WHERE unsold = 0
      AND removed = 0
  `);

  return Number(result.values?.[0]?.profit || 0);
}
