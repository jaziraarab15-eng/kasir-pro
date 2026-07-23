import './css/style.css';
import { initDB } from "./js/db.js";
import { tambahBarang, semuaBarang } from "./js/barang.js";

let keranjang = [];

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

<div class="box" id="menuKasir">
<span class="material-icons">point_of_sale</span>
Kasir
</div>

<div class="box" id="menuBarang">
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

<section class="card" id="halamanBarang">

<h2>Daftar Barang</h2>

<div id="daftarBarang"></div>

</section>

<section class="card" id="halamanKasir">

<h2>🛒 Kasir</h2>

<input
id="cariBarang"
placeholder="Cari nama atau barcode">

<div id="hasilCari"></div>

<h3>Keranjang</h3>

<div id="keranjang">

Belum ada barang

</div>

<h2>Total : Rp <span id="totalBayar">0</span></h2>

<button id="btnBayar">

Bayar

</button>

</section>

<button class="fab">+</button>

<button id="fab" class="fab">+</button>

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

async function cariBarang(keyword){

const data = await semuaBarang();

const hasil = document.getElementById("hasilCari");

hasil.innerHTML = "";

const filter = data.filter(item =>
item.nama.toLowerCase().includes(keyword.toLowerCase()) ||
item.barcode.toLowerCase().includes(keyword.toLowerCase())
);

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

function tampilkanKeranjang() {

const div = document.getElementById("keranjang");

div.innerHTML = "";

let total = 0;

keranjang.forEach(item => {

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

document.querySelectorAll(".minus").forEach(btn=>{

btn.onclick=()=>{

    const item = keranjang.find(x=>x.nama===btn.dataset.nama);

    item.qty--;

    tampilkanKeranjang();

  };

});

document.querySelectorAll(".plus").forEach(btn=>{

  btn.onclick=()=>{

    const item=keranjang.find(x=>x.nama===btn.dataset.nama);

    item.qty++;

    tampilkanKeranjang();

  };

});

keranjang = keranjang.filter(item => item.qty > 0);

if (keranjang.length === 0) {
  div.innerHTML = "Belum ada barang";
}

document.getElementById("totalBayar").innerText = total;

}

document.getElementById("fab").onclick = () => {
  document
    .querySelector(".tambah-barang")
    .scrollIntoView({ behavior: "smooth" });

  document.getElementById("nama").focus();
};

document.getElementById("menuKasir").onclick=()=>{

document.getElementById("halamanKasir")
.scrollIntoView({
behavior:"smooth"
});

};

document.getElementById("menuBarang").onclick = () => {

document.getElementById("halamanBarang")
.scrollIntoView({
behavior:"smooth"
});

};
document.getElementById("cariBarang").oninput=(e)=>{

cariBarang(e.target.value);

};

initDB().then(async()=>{

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

    document.getElementById("nama").value = "";
    document.getElementById("harga").value = "";
    document.getElementById("stok").value = "";
    document.getElementById("barcode").value = "";

  };

  document.getElementById("cariBarang").oninput = (e)=>{
    cariBarang(e.target.value);
  };

});

document.getElementById("btnBayar").onclick=()=>{

  if(keranjang.length===0){

    alert("Keranjang masih kosong!");

    return;

  }

  const total=Number(
    document.getElementById("totalBayar").innerText
  );

  if(confirm(`Total pembayaran Rp ${total}\n\nLanjutkan pembayaran?`)){

    keranjang=[];

    tampilkanKeranjang();

    alert("✅ Pembayaran berhasil");

  }

};

