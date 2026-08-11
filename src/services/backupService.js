import { initDatabase } from "../database/init.js";

export async function exportLocalData() {

  const db = await initDatabase();

  const bundles = await db.query(
    "SELECT * FROM bundles"
  );

  const items = await db.query(
    "SELECT * FROM items"
  );

  return {
    bundles: bundles.values ?? [],
    items: items.values ?? []
  };

}

export async function restoreLocalData(data) {
  const db = await initDatabase();

  // အဟောင်းတွေဖျက်
  await db.execute("DELETE FROM items");
  await db.execute("DELETE FROM bundles");

  // Bundles ပြန်ထည့်
  for (const bundle of data.bundles || []) {
    await db.run(
      `
      INSERT INTO bundles
      (id, shopId, bundleCode, bundleName, qty, cost, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        bundle.id,
        bundle.shopId,
        bundle.bundleCode,
        bundle.bundleName,
        bundle.qty,
        bundle.cost,
        bundle.createdAt
      ]
    );
  }

      // Items ပြန်ထည့်
    for (const item of data.items || []) {
      await db.run(
        `
        INSERT INTO items
        (id, shopId, bundleId, itemId, photo, cost, price,
         unsold, removed, note, soldAt, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          item.id,
          item.shopId,
          item.bundleId,
          item.itemId,
          item.photo || "",
          item.cost || 0,
          item.price || 0,
          item.unsold ?? 1,
          item.removed ?? 0,
          item.note || "",
          item.soldAt || null,
          item.createdAt || Date.now()
        ]
      );
    }
}
