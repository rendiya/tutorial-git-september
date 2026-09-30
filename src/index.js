import { env } from "cloudflare:workers";
import { httpServerHandler } from "cloudflare:node";
import express from "express";

const app = express();
app.use(express.urlencoded({ extended: false }));

// Mengubah karakter HTML menjadi entitas agar input pengguna tampil sebagai teks (mencegah XSS)
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// GET / : halaman form
app.get("/", (req, res) => {
  res.send(`
    <h1>Buku Tamu</h1>
    <form method="POST" action="/kirim">
      <input name="nama" placeholder="Nama" required>
      <textarea name="pesan" placeholder="Pesan" required></textarea>
      <button>Kirim</button>
    </form>
    <p><a href="/tamu">Lihat daftar tamu</a></p>`);
});

// POST /kirim : simpan ke D1
app.post("/kirim", async (req, res) => {
  const { nama, pesan } = req.body;

  if (!nama || !pesan) {
    return res.status(400).send("Nama dan pesan wajib diisi");
  }

  await env.DB
    .prepare("INSERT INTO tamu (nama, pesan) VALUES (?, ?)")
    .bind(nama, pesan)
    .run();

  res.redirect("/tamu");
});

// GET /tamu : daftar tamu
app.get("/tamu", async (req, res) => {
  const { results } = await env.DB
    .prepare("SELECT nama, pesan FROM tamu ORDER BY id DESC")
    .all();
  const daftar = results
    .map((t) => `<li><b>${esc(t.nama)}</b>: ${esc(t.pesan)}</li>`)
    .join("");
  res.send(`<h1>Daftar Tamu</h1><ul>${daftar}</ul><p><a href="/">Isi lagi</a></p>`);
});

app.listen(3000);
export default httpServerHandler({ port: 3000 });
