# Unklab Hub

A full-stack social discussion web application built with Go (Gin) backend and React + Vite frontend.

## Ringkasan

Proyek ini terdiri dari:
- `backend/`: API server Golang dengan Gin, GORM, MySQL, JWT auth, dan middleware.
- `frontend/`: aplikasi React + Vite yang berinteraksi dengan backend melalui HTTP API.

## Fitur Utama

- Autentikasi user (register/login) dengan JWT
- CRUD post: buat, edit, hapus, lihat detail
- Bookmarking post
- Komentar dan laporan post
- Panel admin untuk mengelola user dan laporan
- Upload profile image / post image

## Struktur Proyek

- `backend/`
  - `main.go` — entrypoint server
  - `config/` — koneksi database dan migrasi
  - `handlers/` — endpoint logic
  - `middleware/` — auth dan admin middleware
  - `models/` — definisi model database
  - `routes/` — set up routing API
  - `API_CONTRACT.md` — dokumentasi endpoint API

- `frontend/`
  - `src/` — source code React
  - `src/api/` — konfigurasi API client dan helper request
  - `src/components/` — komponen UI
  - `src/pages/` — halaman aplikasi

## Persyaratan

- Go 1.25+ untuk backend
- Node.js 18+ / npm 10+ untuk frontend
- MySQL database

## Setup Backend

1. Masuk ke direktori backend:

```bash
cd backend
```

2. Tambahkan environment variable `DSN` pada file `.env` atau environment shell.

Contoh `.env`:

```env
DSN=username:password@tcp(127.0.0.1:3306)/database_name?charset=utf8mb4&parseTime=True&loc=Local
PORT=8081
```

3. Jalankan server:

```bash
go run main.go
```

Jika `PORT` tidak diatur, server akan berjalan di `8081`.

## Setup Frontend

1. Masuk ke direktori frontend:

```bash
cd frontend
```

2. Install dependensi:

```bash
npm install
```

3. Jalankan aplikasi React:

```bash
npm run dev
```

Aplikasi frontend akan berjalan di `http://localhost:5173` secara default.

## Koneksi Frontend ke Backend

Frontend menggunakan base URL API:

```text
http://localhost:8081/api
```

Pastikan backend berjalan terlebih dahulu sebelum membuka frontend.

## Dokumentasi API

Detail endpoint tersedia di `backend/API_CONTRACT.md`.

## Catatan Tambahan

- Backend memuat konfigurasi CORS untuk origin `http://localhost:5173`.
- Pastikan MySQL database aktif dan DSN valid.
- Jika menggunakan server atau database lain, sesuaikan `DSN` dan `PORT`.
