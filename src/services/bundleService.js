import { addItem } from "./itemService.js";
import { initDatabase } from "../database/init.js";
import { getCurrentUser } from "../firebase/auth.js";

export async function addBundle(bundle) {
  const db = await initDatabase();

  const user = getCurrentUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const sql = `
    INSERT INTO bundles
    (
      shopId,
      bundleCode,
      bundleName,
      qty,
      cost,
      createdAt
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

const result = await db.run(sql, [
  user.uid,
  bundle.bundleCode,
  bundle.bundleName,
  bundle.qty,
  bundle.cost,
  Date.now()
]);

const bundleId = result.changes.lastId;

const unitCost = Math.round(bundle.cost / bundle.qty);

for (let i = 1; i <= bundle.qty; i++) {
  await addItem({
    bundleId,
    itemId:
      bundle.bundleCode +
      String(i).padStart(3, "0"),
    photo: "",
    cost: unitCost,
    price: 0,
    note: ""
  });
}
}

export async function getBundles() {
  const db = await initDatabase();

  const user = getCurrentUser();

  if (!user) {
    return [];
  }

  const result = await db.query(
    `
    SELECT *
    FROM bundles
    WHERE shopId = ?
    ORDER BY createdAt DESC
    `,
    [user.uid]
  );

  return result.values ?? [];
}
