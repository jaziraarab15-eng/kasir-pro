import './css/style.css';

document.querySelector('#app').innerHTML = `
<header class="header">
  <h1>🏪 Kasir Pro</h1>
  <p>Toko Barokah</p>
</header>

<section class="card">
  <h2>Penjualan Hari Ini</h2>
  <h1>Rp 0</h1>
</section>

<section class="grid">
  <div class="box">🛒<br>Kasir</div>
  <div class="box">📦<br>Barang</div>
  <div class="box">👥<br>Pelanggan</div>
  <div class="box">📊<br>Laporan</div>
</section>

<nav class="bottom">
  <button>🏠</button>
  <button>🛒</button>
  <button>📦</button>
  <button>📈</button>
  <button>⚙️</button>
</nav>
`;
