import './css/style.css';
import { initDB } from "./js/db.js";
import {
  tambahBarang,
  semuaBarang,
  updateStok,
  simpanTransaksi,
  semuaTransaksi
} from "./js/barang.js";

let keranjang = [];

document.querySelector("#app").innerHTML = `
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

<div class="box" id="menuLaporan">
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

  document.getElementById("statBarang").innerText = data.length;

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

  document
  .getElementById("halamanBarang")
  .scrollIntoView({
    behavior:"smooth"
  });

  document.getElementById("nama").focus();

};


// Menu Kasir
document.getElementById("menuKasir").onclick = ()=>{

  document
  .getElementById("halamanKasir")
  .scrollIntoView({
    behavior:"smooth"
  });

};


// Menu Barang
document.getElementById("menuBarang").onclick = ()=>{

  document
  .getElementById("halamanBarang")
  .scrollIntoView({
    behavior:"smooth"
  });

};


// Menu Laporan
document.getElementById("menuLaporan").onclick = async()=>{

  await tampilkanLaporan();

  document
  .getElementById("halamanLaporan")
  .scrollIntoView({
    behavior:"smooth"
  });

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



    await tambahBarang({

      nama,
      harga,
      stok,
      barcode

    });



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





    keranjang=[];


    tampilkanKeranjang();



    await tampilkanBarang();


    await tampilkanLaporan();



    document.getElementById("uangBayar").value="";

    document.getElementById("kembalian").innerText="0";


    document.getElementById("hasilCari").innerHTML="";

    document.getElementById("cariBarang").value="";



    alert("✅ Pembayaran berhasil");


  };



});
