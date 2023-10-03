import sqlite3 from "sqlite3";
export async function isTableEmpty(db: sqlite3.Database): Promise<boolean> {
  const result = await new Promise<number>((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.count);
      }
    });
  });
  return result === 0;
}