import { initDatabase } from "../database/init.js";
import { getCurrentUser } from "../firebase/auth.js";

import {
  getUserProfile,
  createBundle,
  getBundlesByShop,
  deleteBundleCloud
} from "../firebase/firestore.js";

export async function addBundle(bundle) {
  const db = await initDatabase();

  const user = getCurrentUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const profile = await getUserProfile(user.uid);

  if (!profile?.shopId) {
    throw new Error("Shop Profile မတွေ့ပါ");
  }

  const qty = Number(bundle.qty || 0);
  const cost = Number(bundle.cost || 0);
  const createdAt = Date.now();

  if (qty <= 0) {
    throw new Error("အရေအတွက် မှန်ကန်စွာထည့်ပါ");
  }

  // =========================================
  // 1. LOCAL SQLITE
  // =========================================

  const result = await db.run(
    `
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
    `,
    [
      profile.shopId,
      bundle.bundleCode,
      bundle.bundleName,
      qty,
      cost,
      createdAt
    ]
  );

  const localBundleId = result.changes.lastId;

  // =========================================
  // 2. FIRESTORE
  // =========================================

  const cloudBundleId =
    `${profile.shopId}_${bundle.bundleCode}`;

  try {
    await createBundle(cloudBundleId, {
      shopId: profile.shopId,
      bundleCode: bundle.bundleCode,
      bundleName: bundle.bundleName,
      qty,
      cost,
      createdAt
    });

    console.log(
      "CLOUD BUNDLE CREATED:",
      cloudBundleId
    );

  } catch (err) {
    // Internet မရှိရင် Local data ကို မဖျက်ပါ
    console.warn(
      "Cloud bundle sync failed:",
      err
    );
  }

  return {
    id: localBundleId,
    shopId: profile.shopId,
    bundleCode: bundle.bundleCode,
    bundleName: bundle.bundleName,
    qty,
    cost,
    createdAt
  };
}


// =========================================
// GET BUNDLES
// =========================================

export async function getBundles() {
  const db = await initDatabase();

  const user = getCurrentUser();

  if (!user) {
    return [];
  }

  const profile = await getUserProfile(user.uid);

  if (!profile?.shopId) {
    return [];
  }

  // Cloud → Local
  try {
    const cloudBundles =
      await getBundlesByShop(profile.shopId);

    for (const cloudBundle of cloudBundles) {

      const existing = await db.query(
        `
        SELECT id
        FROM bundles
        WHERE shopId = ?
          AND bundleCode = ?
        LIMIT 1
        `,
        [
          profile.shopId,
          cloudBundle.bundleCode
        ]
      );

      if (existing.values?.length) {

        await db.run(
          `
          UPDATE bundles
          SET
            bundleName = ?,
            qty = ?,
            cost = ?,
            createdAt = ?
          WHERE id = ?
          `,
          [
            cloudBundle.bundleName,
            Number(cloudBundle.qty || 0),
            Number(cloudBundle.cost || 0),
            cloudBundle.createdAt || Date.now(),
            existing.values[0].id
          ]
        );

      } else {

        await db.run(
          `
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
          `,
          [
            profile.shopId,
            cloudBundle.bundleCode,
            cloudBundle.bundleName,
            Number(cloudBundle.qty || 0),
            Number(cloudBundle.cost || 0),
            cloudBundle.createdAt || Date.now()
          ]
        );
      }
    }

  } catch (err) {
    console.warn(
      "Cloud bundle sync skipped:",
      err
    );
  }

  // Local data ပြန်ယူ
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


// =========================================
// BUNDLE CODE EXISTS
// =========================================

export async function bundleCodeExists(code) {
  const bundles = await getBundles();

  return bundles.some(
    b =>
      b.bundleCode.trim().toUpperCase() ===
      code.trim().toUpperCase()
  );
}


// =========================================
// DELETE BUNDLE
// =========================================

export async function deleteBundle(bundleId) {
  const db = await initDatabase();

  const user = getCurrentUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const profile = await getUserProfile(user.uid);

  if (!profile?.shopId) {
    throw new Error("Shop Profile မတွေ့ပါ");
  }

  // Local bundle ရှာ
  const result = await db.query(
    `
    SELECT *
    FROM bundles
    WHERE id = ?
      AND shopId = ?
    LIMIT 1
    `,
    [bundleId, profile.shopId]
  );

  const bundle = result.values?.[0];

  if (!bundle) {
    throw new Error("Bundle မတွေ့ပါ");
  }

  // Local items
  await db.run(
    `DELETE FROM items WHERE bundleId = ?`,
    [bundleId]
  );

  // Local bundle
  await db.run(
    `
    DELETE FROM bundles
    WHERE id = ?
      AND shopId = ?
    `,
    [bundleId, profile.shopId]
  );

  // Cloud bundle
  const cloudBundleId =
    `${profile.shopId}_${bundle.bundleCode}`;

  try {
    await deleteBundleCloud(cloudBundleId);

    console.log(
      "CLOUD BUNDLE DELETED:",
      cloudBundleId
    );

  } catch (err) {
    console.warn(
      "Cloud bundle delete failed:",
      err
    );
  }
}
