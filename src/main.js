import './css/style.css';

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

<button class="fab">+</button>

<nav class="bottom">

<button><span class="material-icons">home</span></button>
<button><span class="material-icons">shopping_cart</span></button>
<button><span class="material-icons">inventory_2</span></button>
<button><span class="material-icons">bar_chart</span></button>
<button><span class="material-icons">settings</span></button>

</nav>
`;
