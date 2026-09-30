# Buku Tamu: Express + Cloudflare D1

Contoh untuk materi **Dari Kode ke Rilis** (VINIX7). Aplikasi form buku tamu yang berjalan di Cloudflare Workers dan menyimpan data di D1.

## Isi folder

| Berkas | Fungsi |
|---|---|
| `src/index.js` | kode Express: `GET /`, `POST /kirim`, `GET /tamu` |
| `wrangler.jsonc` | konfigurasi Worker, flag `nodejs_compat`, binding D1 `DB` |
| `schema.sql` | struktur tabel `tamu` |
| `.gitignore` | berkas yang tidak ikut di-commit |

## 1. Siapkan database D1

1. Dashboard Cloudflare › Storage & databases › D1 SQL database › **Create Database**, nama `bukutamu-db`.
2. Tab **Console**: tempel isi `schema.sql`, lalu **Execute**.
3. Salin **Database ID** ke `database_id` di `wrangler.jsonc`.

## 2. Jalankan di laptop

```bash
npm install
npm start          # buat tabel lokal, lalu buka http://localhost:8787
```

`npm start` menjalankan `schema.sql` ke D1 lokal lebih dulu. Aman diulang karena memakai `IF NOT EXISTS`.

## Script yang tersedia

| Perintah | Fungsi |
|---|---|
| `npm start` | buat tabel D1 lokal, lalu jalankan server di http://localhost:8787 |
| `npm run deploy` | deploy manual ke Cloudflare (biasanya tidak perlu karena ada auto deploy) |
| `npm run rollback` | kembali ke versi sebelumnya |
| `npm run logs` | lihat log aplikasi yang sedang berjalan |

## 3. Push ke GitHub

```bash
git init
git add .
git commit -m "feat: aplikasi buku tamu dengan D1"
git branch -M main
git remote add origin https://github.com/USERNAME/buku-tamu.git
git push -u origin main
```

## 4. Auto deploy dari GitHub

1. Dashboard Cloudflare › Workers & Pages › **Create application** › **Import a repository**.
2. Hubungkan akun GitHub dan pilih repo `buku-tamu`.
3. Project name: `buku-tamu` (sama dengan `name` di `wrangler.jsonc`).
4. Deploy command: ganti bawaan `npx wrangler deploy` menjadi `npm run deploy` › **Save and Deploy**.

Setelah itu, setiap push ke `main` men-deploy versi baru. Branch lain mendapat preview URL.

## Catatan

- Preview memakai database D1 yang sama dengan production.
- Rollback: Workers & Pages › buku-tamu › Deployments › menu di versi sebelumnya › Rollback, atau `npm run rollback`. Isi database tidak ikut kembali.
