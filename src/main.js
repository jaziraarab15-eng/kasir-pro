import './css/style.css';
import { initDB } from "./js/db.js";
import { tambahBarang, semuaBarang } from "./js/barang.js";

document.querySelector('#app').innerHTML = `
<header class="header">
  <h2>👋 Assalamualaikum</h2>
  <h1>Kasir Pro</h1>
  <p>Toko Barokah</p>
</header>

<section class="stats">

<div class="card">
<h3>💰 Penjualan</h3>
<b>Rp 0</b>
</div>

<div class="card">
<h3>🧾 Transaksi</h3>
<b>0</b>
</div>

<div class="card">
<h3>📦 Barang</h3>
<b>0</b>
</div>

<div class="card">
<h3>📈 Laba</h3>
<b>Rp 0</b>
</div>

</section>

<h3 class="judul">Menu</h3>

<section class="grid">

<div class="box">
<span class="material-icons">point_of_sale</span>
Kasir
</div>

<div class="box">
<span class="material-icons">inventory_2</span>
Barang
</div>

<div class="box">
<span class="material-icons">groups</span>
Pelanggan
</div>

<div class="box">
<span class="material-icons">analytics</span>
Laporan
</div>

<div class="box">
<span class="material-icons">qr_code_scanner</span>
Scan
</div>

<div class="box">
<span class="material-icons">settings</span>
Setting
</div>

</section>

<section class="card">

<h2>📦 Tambah Barang</h2>

<input id="nama" placeholder="Nama Barang">

<input id="harga" type="number" placeholder="Harga">

<input id="stok" type="number" placeholder="Stok">

<input id="barcode" placeholder="Barcode">

<button id="simpan">
Simpan Barang
</button>

</section>

<section class="card">

<h2>Daftar Barang</h2>

<div id="daftarBarang"></div>

</section>

<button class="fab">+</button>

<nav class="bottom">

<button><span class="material-icons">home</span></button>
<button><span class="material-icons">shopping_cart</span></button>
<button><span class="material-icons">inventory_2</span></button>
<button><span class="material-icons">bar_chart</span></button>
<button><span class="material-icons">settings</span></button>

</nav>
`;

async function tampilkanBarang(){

const data = await semuaBarang();

const daftar = document.getElementById("daftarBarang");

daftar.innerHTML = "";

data.forEach(item=>{

daftar.innerHTML += `
<div class="box">
<b>${item.nama}</b><br>
Rp ${item.harga}<br>
Stok : ${item.stok}
</div>
`;

});

}

initDB().then(()=>{

  tampilkanBarang();

  document.getElementById("simpan").onclick = async()=>{

    const nama = document.getElementById("nama").value;
    const harga = Number(document.getElementById("harga").value);
    const stok = Number(document.getElementById("stok").value);
    const barcode = document.getElementById("barcode").value;

    await tambahBarang({
      nama,
      harga,
      stok,
      barcode
    });

    tampilkanBarang();

  };

});
