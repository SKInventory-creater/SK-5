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

  await db.run(sql, [
    user.uid,
    bundle.bundleCode,
    bundle.bundleName,
    bundle.qty,
    bundle.cost,
    Date.now()
  ]);
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
