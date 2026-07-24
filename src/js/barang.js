import { getStore } from "./db.js";

export function tambahBarang(data){

return new Promise((resolve,reject)=>{

const req=getStore("readwrite").add(data);

req.onsuccess=resolve;

req.onerror=reject;

});

}

export function semuaBarang(){

return new Promise((resolve,reject)=>{

const req=getStore().getAll();

req.onsuccess=()=>resolve(req.result);

req.onerror=reject;

});

}

export function updateStok(id, stokBaru){

  return new Promise((resolve,reject)=>{

    const req = getStore("readwrite").get(id);

    req.onsuccess = ()=>{

      const data = req.result;

      data.stok = stokBaru;

      const simpan = getStore("readwrite").put(data);

      simpan.onsuccess = resolve;

      simpan.onerror = reject;

    };

    req.onerror = reject;

  });

}

export function simpanTransaksi(data){

  return new Promise((resolve,reject)=>{

    const req = getStore("readwrite","transaksi").add(data);

    req.onsuccess = resolve;

    req.onerror = reject;

  });

}
export function semuaTransaksi(){

  return new Promise((resolve,reject)=>{

    const req = getStore("readonly","transaksi").getAll();

    req.onsuccess = ()=>resolve(req.result);

    req.onerror = reject;

  });

}
