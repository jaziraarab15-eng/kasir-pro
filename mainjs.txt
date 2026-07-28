import './css/style.css';
import { BrowserMultiFormatReader } from "@zxing/browser";
import { initDB } from "./js/db.js";
import {
  tambahBarang,
  semuaBarang,
  updateBarang,
  updateStok,
  simpanTransaksi,
  semuaTransaksi,
  hapusBarang,
  simpanPelanggan,
  semuaPelanggan
} from "./js/barang.js";

let keranjang = [];
let editId = null;

const scanner = new BrowserMultiFormatReader();
let kameraBelakang = null;
let sedangScan = false;

document.querySelector("#app").innerHTML = `

<section id="halamanHome">

<header class="header">
  <h2>👋 Assalamualaikum</h2>
  <h1>Kasir Pro</h1>
  <p>Toko Barokah</p>
</header>

<section class="stats">

<div class="card">
<h3>💰 Penjualan</h3>
<b id="statPenjualan">Rp 0</b>
</div>

<div class="card">
<h3>🧾 Transaksi</h3>
<b id="statTransaksi">0</b>
</div>

<div class="card">
<h3>📦 Barang</h3>
<b id="statBarang">0</b>
</div>

<div class="card">
<h3>📈 Laba</h3>
<b id="statLaba">Rp 0</b>
</div>

</section>

<h3 class="judul">Menu</h3>

<section class="grid">

<div class="box" id="menuKasir">
<span class="icon">🛒</span>
Kasir
</div>

<div class="box" id="menuBarang">
<span class="icon">📦</span>
Barang
</div>

<div class="box" id="menuPelanggan">
<span class="icon">👥</span>
Pelanggan
</div>

<div class="box" id="menuLaporan">
<span class="icon">📊</span>
Laporan
</div>

<div class="box" id="menuScan">
<span class="icon">📷</span>
Scan
</div>

<div class="box" id="menuBackup">
<span class="icon">💾</span>
Backup
</div>

</section>

</section>

<section class="card" id="halamanBackup">

<h2>💾 Backup Database</h2>

<p>Backup semua data barang dan transaksi ke file JSON.</p>

<button id="btnBackup">

Backup Sekarang

</button>

<input
id="fileRestore"
type="file"
accept=".json"
style="display:none">

<button id="btnRestore">

Restore Database

</button>

</section>

<section class="card" id="halamanSetting">

<h2>⚙️ Pengaturan</h2>

<div class="box">🏪 Profil Toko</div>

<div class="box">🖨️ Printer Bluetooth</div>

<div class="box">🌙 Mode Gelap</div>

<div class="box">💾 Backup Database</div>

<div class="box">📂 Restore Database</div>

<div class="box">ℹ️ Tentang Aplikasi</div>

</section>

<section class="card" id="halamanLaporan">

<h2>📊 Laporan Penjualan</h2>

<p>Total Transaksi :
<span id="jumlahTransaksi">0</span></p>

<p>Total Omzet :
Rp <span id="totalOmzet">0</span></p>

<div id="daftarTransaksi">
Belum ada transaksi
</div>

</section>

<section class="card" id="halamanPelanggan">

<h2>👥 Pelanggan</h2>

<input id="namaPelanggan"
placeholder="Nama Pelanggan">

<input id="hpPelanggan"
placeholder="No. HP">

<button id="simpanPelanggan">
💾 Simpan Pelanggan
</button>

<div id="daftarPelanggan"></div>

</section>

<section class="card" id="halamanBarang">

<h2>📦 Tambah Barang</h2>

<input id="nama" placeholder="Nama Barang">
<input id="harga" type="number" placeholder="Harga">
<input id="stok" type="number" placeholder="Stok">
<input id="barcode" placeholder="Barcode">

<button id="simpan">
Simpan Barang
</button>

<h2>Daftar Barang</h2>

<div id="daftarBarang"></div>

</section>

<section class="card" id="halamanKasir">

<h2>🛒 Kasir</h2>

<input id="cariBarang"
placeholder="Cari nama atau barcode">

<div id="hasilCari"></div>

<button id="btnScan">
📷 Scan Barcode
</button>

<video
id="preview"
style="
display:none;
width:100%;
border-radius:12px;
margin-top:10px;
"
></video>

<button id="btnStopScan" style="display:none">
❌ Tutup Scan
</button>

<h3>Keranjang</h3>

<div id="keranjang">
Belum ada barang
</div>

<h2>Total : Rp <span id="totalBayar">0</span></h2>

<input id="uangBayar"
type="number"
placeholder="Uang pelanggan">

<h3>Kembalian :
Rp <span id="kembalian">0</span></h3>

<button id="btnBayar">
Bayar
</button>

</section>

<div id="struk" style="display:none">

<h3>🧾 STRUK BELANJA</h3>

<pre id="isiStruk"></pre>

</div>

<button id="fab" class="fab">+</button>

<nav class="bottom">

<button id="navHome">
🏠
</button>

<button id="navKasir">
🛒
</button>

<button id="navBarang">
📦
</button>

<button id="navLaporan">
📊
</button>

<button id="navSetting">
⚙️
</button>

</nav>
`;


async function tampilkanBarang(){

  const data = await semuaBarang();

  document.getElementById("statBarang").innerText = data.length;

  const daftar = document.getElementById("daftarBarang");

  daftar.innerHTML = "";

  data.forEach(item=>{

    daftar.innerHTML += `
<div class="box">

<b>${item.nama}</b><br>

Rp ${item.harga}<br>

Stok : ${item.stok}<br><br>

<button
class="editBarang"
data-id="${item.id}">
✏️ Edit
</button>

<button
class="hapusBarang"
data-id="${item.id}">
🗑️ Hapus
</button>

</div>
`;

  });

  document.querySelectorAll(".editBarang").forEach(btn=>{

    btn.onclick = async()=>{

      const data = await semuaBarang();

      const barang = data.find(
        x => x.id == btn.dataset.id
      );

      editId = barang.id;

      document.getElementById("nama").value = barang.nama;
      document.getElementById("harga").value = barang.harga;
      document.getElementById("stok").value = barang.stok;
      document.getElementById("barcode").value = barang.barcode;

      document.getElementById("simpan").innerText =
      "Update Barang";

    };

  });

  document.querySelectorAll(".hapusBarang").forEach(btn=>{

    btn.onclick = async()=>{

      if(!confirm("Yakin ingin menghapus barang ini?")){
        return;
      }

      await hapusBarang(Number(btn.dataset.id));

      await tampilkanBarang();

    };

  });

}

async function cariBarang(keyword){

  const data = await semuaBarang();

  const hasil = document.getElementById("hasilCari");

  hasil.innerHTML = "";

  const filter = data.filter(item=>

    item.stok > 0 && (

      item.nama.toLowerCase().includes(keyword.toLowerCase()) ||

      item.barcode.toLowerCase().includes(keyword.toLowerCase())

    )

  );

  if(filter.length===0){

    hasil.innerHTML = "Barang tidak ditemukan";

    return;

  }

  filter.forEach(item=>{

    hasil.innerHTML += `
<div class="box pilihBarang"
data-id="${item.id}"
data-nama="${item.nama}"
data-harga="${item.harga}">
<b>${item.nama}</b><br>
Rp ${item.harga}<br>
Stok : ${item.stok}
</div>
`;

  });

  document.querySelectorAll(".pilihBarang").forEach(box=>{

    box.onclick=()=>{

      const nama = box.dataset.nama;
      const harga = Number(box.dataset.harga);

      const ada = keranjang.find(x=>x.nama===nama);

      if(ada){

        ada.qty++;

      }else{

        keranjang.push({
          nama,
          harga,
          qty:1
        });

      }

      tampilkanKeranjang();

    };

  });

}

function tampilkanKeranjang(){

  const div = document.getElementById("keranjang");

  let total = 0;

  div.innerHTML = "";

  keranjang = keranjang.filter(item=>item.qty>0);

  if(keranjang.length===0){

    div.innerHTML = "Belum ada barang";

  }

  keranjang.forEach(item=>{

    total += item.qty * item.harga;

    div.innerHTML += `
<div class="box">

<b>${item.nama}</b><br>

${item.qty} × Rp ${item.harga}<br>

Subtotal : Rp ${item.qty * item.harga}<br><br>

<button class="minus" data-nama="${item.nama}">➖</button>

<button class="plus" data-nama="${item.nama}">➕</button>

</div>
`;

  });

  document.getElementById("totalBayar").innerText = total;

  document.querySelectorAll(".minus").forEach(btn=>{

    btn.onclick=()=>{

      const item = keranjang.find(x=>x.nama===btn.dataset.nama);

      if(item){

        item.qty--;

        tampilkanKeranjang();

      }

    };

  });

  document.querySelectorAll(".plus").forEach(btn=>{

    btn.onclick=()=>{

      const item = keranjang.find(x=>x.nama===btn.dataset.nama);

      if(item){

        item.qty++;

        tampilkanKeranjang();

      }

    };

  });

}

async function tampilkanLaporan(){

  const data = await semuaTransaksi();

  let omzet = 0;

  document.getElementById("jumlahTransaksi").innerText = data.length;

  const daftar = document.getElementById("daftarTransaksi");

  daftar.innerHTML = "";

  if(data.length===0){

    daftar.innerHTML = "Belum ada transaksi";

  }

  data.forEach(trx=>{

    omzet += trx.total;

    daftar.innerHTML += `
<div class="box">

<b>${new Date(trx.tanggal).toLocaleString()}</b><br>

Total : Rp ${trx.total}<br>

Bayar : Rp ${trx.bayar}<br>

Kembali : Rp ${trx.kembali}

</div>
`;

  });

  document.getElementById("totalOmzet").innerText = omzet;
  document.getElementById("statPenjualan").innerText = "Rp " + omzet;
  document.getElementById("statTransaksi").innerText = data.length;

}

// Tombol FAB tambah barang
document.getElementById("fab").onclick = () => {

  bukaHalaman("halamanBarang");

  document
    .querySelectorAll(".bottom button")
    .forEach(btn => btn.classList.remove("active"));

  document.getElementById("navBarang")
    .classList.add("active");

};


// Menu Kasir
document.getElementById("menuKasir").onclick = ()=>{

  bukaHalaman("halamanKasir");

  document.getElementById("navKasir")
    .classList.add("active");

};


// Menu Barang
document.getElementById("menuBarang").onclick = ()=>{

  bukaHalaman("halamanBarang");

  document.getElementById("navBarang")
    .classList.add("active");

};

// Menu Pelanggan
document.getElementById("menuPelanggan").onclick = ()=>{

  bukaHalaman("halamanPelanggan");

document
    .querySelectorAll(".bottom button")
    .forEach(btn=>btn.classList.remove("active"));

};

// Menu Scan
document.getElementById("menuScan").onclick = ()=>{

  bukaHalaman("halamanKasir");

  document
    .querySelectorAll(".bottom button")
    .forEach(btn=>btn.classList.remove("active"));

  document.getElementById("navKasir")
    .classList.add("active");

  setTimeout(()=>{

    document.getElementById("btnScan").click();

  },300);

};

// Menu Laporan
document.getElementById("menuLaporan").onclick = ()=>{

  bukaHalaman("halamanLaporan");

  document.getElementById("navLaporan")
    .classList.add("active");

};

document.getElementById("menuBackup").onclick = ()=>{

  bukaHalaman("halamanBackup");

};


// Pencarian barang
document.getElementById("cariBarang").oninput = (e)=>{

  cariBarang(e.target.value);

};


// Hitung kembalian
document.getElementById("uangBayar").oninput = ()=>{


  const total = Number(
    document.getElementById("totalBayar").innerText
  );


  const bayar = Number(
    document.getElementById("uangBayar").value
  );


  const kembali = bayar - total;


  document.getElementById("kembalian").innerText =
    kembali >= 0 ? kembali : 0;


};

initDB().then(async()=>{


  await tampilkanBarang();

  await tampilkanPelanggan();

  await tampilkanLaporan();



  // Simpan Barang

  document.getElementById("simpan").onclick = async()=>{


    const nama =
    document.getElementById("nama").value;


    const harga =
    Number(document.getElementById("harga").value);


    const stok =
    Number(document.getElementById("stok").value);


    const barcode =
    document.getElementById("barcode").value;



    if(editId===null){

  await tambahBarang({
    nama,
    harga,
    stok,
    barcode
  });

}else{

  await updateBarang({
    id: editId,
    nama,
    harga,
    stok,
    barcode
  });

  editId = null;

  document.getElementById("simpan").innerText =
  "Simpan Barang";

}



    await tampilkanBarang();



    document.getElementById("nama").value="";
    document.getElementById("harga").value="";
    document.getElementById("stok").value="";
    document.getElementById("barcode").value="";


  };




  // Tombol Bayar

  document.getElementById("btnBayar").onclick = async()=>{


    if(keranjang.length===0){

      alert("Keranjang masih kosong!");

      return;

    }



    const total =
    Number(document.getElementById("totalBayar").innerText);



    const bayar =
    Number(document.getElementById("uangBayar").value);



    if(bayar < total){

      alert("❌ Uang pelanggan kurang!");

      return;

    }




    if(!confirm(
      `Total pembayaran Rp ${total}\n\nLanjutkan pembayaran?`
    )){

      return;

    }



    const dataBarang = await semuaBarang();



    for(const item of keranjang){


      const barang =
      dataBarang.find(
        b=>b.nama===item.nama
      );



      if(barang){


        await updateStok(

          barang.id,

          barang.stok - item.qty

        );


      }


    }




    await simpanTransaksi({

      tanggal:new Date().toISOString(),

      items:[...keranjang],

      total,

      bayar,

      kembali: bayar-total

    });


document.getElementById("isiStruk").innerText =
`================================
        KASIR PRO
       TOKO BAROKAH
================================

Tanggal :
${new Date().toLocaleString()}

--------------------------------
${keranjang.map(item=>
`${item.nama}
${item.qty} x Rp ${item.harga}
= Rp ${item.qty * item.harga}`
).join("\n\n")}

--------------------------------
TOTAL      : Rp ${total}
BAYAR      : Rp ${bayar}
KEMBALIAN  : Rp ${bayar-total}

================================
Terima kasih telah berbelanja
================================`;

document.getElementById("struk").style.display = "block";



    keranjang=[];


    tampilkanKeranjang();



    await tampilkanBarang();


    await tampilkanLaporan();



    document.getElementById("uangBayar").value="";

    document.getElementById("kembalian").innerText="0";


    document.getElementById("hasilCari").innerHTML="";

    document.getElementById("cariBarang").value="";

    document.getElementById("cariBarang").focus();

    alert("✅ Pembayaran berhasil");

  };



});

document.getElementById("fileRestore").onchange = async(e)=>{

  const file = e.target.files[0];

  if(!file) return;

  const text = await file.text();

  const data = JSON.parse(text);

  console.log(data);

  alert(
    `Backup ditemukan\n\nBarang : ${data.barang.length}\nTransaksi : ${data.transaksi.length}`
  );

};

async function backupDatabase(){

alert("Backup dimulai...");

  const barang = await semuaBarang();

  const transaksi = await semuaTransaksi();

  const data = {
    tanggal: new Date().toISOString(),
    barang,
    transaksi
  };

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "KasirPro-Backup.json";

  a.click();

  URL.revokeObjectURL(url);

}

document.getElementById("btnRestore").onclick = ()=>{

  document
    .getElementById("fileRestore")
    .click();

};

document.getElementById("btnScan").onclick = async()=>{

  const video = document.getElementById("preview");

  video.style.display = "block";

document.getElementById("btnStopScan").style.display = "block";

  try{

const devices =
  await BrowserMultiFormatReader.listVideoInputDevices();

if(!kameraBelakang){

  kameraBelakang =
    devices.find(d=>{

      const nama = d.label.toLowerCase();

      return (
        nama.includes("back") ||
        nama.includes("rear") ||
        nama.includes("environment")
      );

    }) || devices[devices.length-1];

}

    await scanner.decodeFromVideoDevice(

    kameraBelakang.deviceId,

      "preview",

     async (result)=>{

      if(result && !sedangScan){

  sedangScan = true;

  const barcode = result.getText();

  const data = await semuaBarang();

  const barang = data.find(
  b => String(b.barcode).trim() === String(barcode).trim()
);

  if(!barang){

    alert("❌ Barang tidak ditemukan");

    return;

  }

  if(barang.stok <= 0){

  alert("❌ Stok barang habis");

  return;

}

  let item = keranjang.find(
    x => x.id === barang.id
  );

  if(item){

    item.qty++;

  }else{

    keranjang.push({

      id: barang.id,

      nama: barang.nama,

      harga: barang.harga,

      qty: 1

    });

  }

 tampilkanKeranjang();

setTimeout(()=>{

  sedangScan = false;

},1000);

if(navigator.vibrate){

  navigator.vibrate(100);

}

      }

    }

  );

  }catch(err){

    alert("Kamera tidak bisa dibuka");

    console.error(err);

  }

};

document.getElementById("btnStopScan").onclick = ()=>{

  const video = document.getElementById("preview");

  if(video.srcObject){

    video.srcObject.getTracks().forEach(track=>track.stop());

    video.srcObject = null;

  }

  scanner.reset();

  sedangScan = false;

  video.style.display = "none";

  document.getElementById("btnStopScan").style.display = "none";

};

// Simpan Pelanggan
document.getElementById("simpanPelanggan").onclick = async()=>{

  const nama = document.getElementById("namaPelanggan").value.trim();

  const hp = document.getElementById("hpPelanggan").value.trim();

  if(!nama){

    alert("Masukkan nama pelanggan");

    return;

  }

  await simpanPelanggan({
    nama,
    hp
  });

  document.getElementById("namaPelanggan").value = "";

  document.getElementById("hpPelanggan").value = "";

  tampilkanPelanggan();

};

// ===== NAVIGASI BAWAH =====

function sembunyikanSemuaHalaman(){

  document.getElementById("halamanHome").style.display = "none";

  document.getElementById("halamanPelanggan").style.display="none";

  document.getElementById("halamanBarang").style.display = "none";

  document.getElementById("halamanKasir").style.display = "none";

  document.getElementById("halamanLaporan").style.display = "none";

  document.getElementById("halamanBackup").style.display = "none";

  document.getElementById("halamanSetting").style.display = "none";

}

function bukaHalaman(id){

  sembunyikanSemuaHalaman();

  document.getElementById(id).style.display = "block";

  document
    .querySelectorAll(".bottom button")
    .forEach(btn=>btn.classList.remove("active"));

  }

document.getElementById("navHome").onclick = ()=>{

  bukaHalaman("halamanHome");

  document.getElementById("navHome")
    .classList.add("active");

};

document.getElementById("navKasir").onclick = ()=>{

  bukaHalaman("halamanKasir");

  document.getElementById("navKasir")
    .classList.add("active");

};

document.getElementById("navBarang").onclick = ()=>{

  bukaHalaman("halamanBarang");

  document.getElementById("navBarang")
    .classList.add("active");

};

document.getElementById("navLaporan").onclick = ()=>{

  bukaHalaman("halamanLaporan");

  document.getElementById("navLaporan")
    .classList.add("active");

};

document.getElementById("navSetting").onclick = ()=>{

  bukaHalaman("halamanSetting");

  document.getElementById("navSetting")
    .classList.add("active");

};

// ===== HALAMAN PERTAMA =====

bukaHalaman("halamanHome");

document.getElementById("navHome")
  .classList.add("active");

async function tampilkanPelanggan(){

  const data = await semuaPelanggan();

  const daftar = document.getElementById("daftarPelanggan");

  daftar.innerHTML = "";

  data.forEach(p=>{

    daftar.innerHTML += `
      <div class="box">
        <b>${p.nama}</b><br>
        📞 ${p.hp}
      </div>
    `;

  });

}
