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
