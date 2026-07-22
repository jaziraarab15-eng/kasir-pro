const DB_NAME = "KasirProDB";
const DB_VERSION = 1;
const STORE = "barang";

let db = null;

export function initDB() {
  return new Promise((resolve, reject) => {

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {

      db = e.target.result;

      if (!db.objectStoreNames.contains(STORE)) {

        db.createObjectStore(STORE, {
          keyPath: "id",
          autoIncrement: true
        });

      }

    };

    request.onsuccess = (e) => {

      db = e.target.result;
      resolve();

    };

    request.onerror = reject;

  });
}

export function getStore(mode = "readonly") {
  return db.transaction(STORE, mode).objectStore(STORE);
}
