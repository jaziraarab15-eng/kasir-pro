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
