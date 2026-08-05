import { getDatabase } from "./sqlite.js";
import {
  CREATE_BUNDLES_TABLE,
  CREATE_ITEMS_TABLE
} from "./schema.js";

export async function initDatabase() {
  const db = await getDatabase();

  await db.execute(CREATE_BUNDLES_TABLE);

  await db.execute(CREATE_ITEMS_TABLE);

  try {
  await db.execute(`
    ALTER TABLE items
    ADD COLUMN soldAt TEXT
  `);
} catch (e) {
  // soldAt column ရှိပြီးသားဆိုရင် Ignore
}

  return db;
}
