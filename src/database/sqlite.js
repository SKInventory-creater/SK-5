import { SQLiteConnection } from "@capacitor-community/sqlite";

let sqlite;
let db;

export async function getDatabase() {
  if (db) {
    return db;
  }

  sqlite = new SQLiteConnection();

  db = await sqlite.createConnection(
    "skinventory",
    false,
    "no-encryption",
    1,
    false
  );

  await db.open();

  return db;
}
