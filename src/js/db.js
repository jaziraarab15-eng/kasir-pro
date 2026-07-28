const DB_NAME = "KasirProDB";
const DB_VERSION = 3;
const STORE = "barang";

let db = null;

export function initDB() {
  return new Promise((resolve, reject) => {

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {

      db = e.target.result;

      if (!db.objectStoreNames.contains("barang")) {
        db.createObjectStore("barang", {
          keyPath: "id",
          autoIncrement: true
        });
      }

      if (!db.objectStoreNames.contains("transaksi")) {
        db.createObjectStore("transaksi", {
          keyPath: "id",
          autoIncrement: true
        });
      }

      if (!db.objectStoreNames.contains("pelanggan")) {
  db.createObjectStore("pelanggan", {
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

export function getStore(mode = "readonly", store = STORE) {

  return db
    .transaction(store, mode)
    .objectStore(store);

}

