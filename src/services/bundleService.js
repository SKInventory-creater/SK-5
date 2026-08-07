import { addItem } from "./itemService.js";
import { initDatabase } from "../database/init.js";
import { getCurrentUser } from "../firebase/auth.js";
import { getUserProfile } from "../firebase/firestore.js";

export async function addBundle(bundle) {
  const db = await initDatabase();

  const user = getCurrentUser();

if (!user) {
  throw new Error("User is not logged in");
}

const profile = await getUserProfile(user.uid);

if (!profile) {
  throw new Error("User Profile မတွေ့ပါ");
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
  profile.shopId,
  bundle.bundleCode,
  bundle.bundleName,
  bundle.qty,
  bundle.cost,
  Date.now()
]);

const bundleId = result.changes.lastId;

const unitCost = Math.floor(bundle.cost / bundle.qty);
const remainder = bundle.cost - (unitCost * bundle.qty);

for (let i = 1; i <= bundle.qty; i++) {
  await addItem({
    bundleId,
    itemId:
      bundle.bundleCode +
      String(i).padStart(3, "0"),
    photo: "",
    cost:
  i === bundle.qty
    ? unitCost + remainder
    : unitCost,
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

  const profile = await getUserProfile(user.uid);

if (!profile) {
  return [];
}

const result = await db.query(
  `
  SELECT *
  FROM bundles
  WHERE shopId = ?
  ORDER BY createdAt DESC
  `,
  [profile.shopId]
);

  return result.values ?? [];
}

export async function bundleCodeExists(code) {
  const bundles = await getBundles();

  return bundles.some(
    b => b.bundleCode.trim().toUpperCase() === code.trim().toUpperCase()
  );
}

export async function deleteBundle(bundleId) {
  const db = await initDatabase();

  // Items အရင်ဖျက်
  await db.run(
    `DELETE FROM items WHERE bundleId=?`,
    [bundleId]
  );

  // Bundle ဖျက်
  await db.run(
    `DELETE FROM bundles WHERE id=?`,
    [bundleId]
  );
}
