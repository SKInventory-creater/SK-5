import { getDatabase } from "./sqlite.js";
import { CREATE_BUNDLES_TABLE } from "./schema.js";

export async function initDatabase() {
  const db = await getDatabase();

  await db.execute(CREATE_BUNDLES_TABLE);

  return db;
}
