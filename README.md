# EduSmart - Sistem Pembelajaran AI-Oriented

Sistem pembelajaran digital terintegrasi AI untuk sekolah dengan fitur gamifikasi, skill tree, dan analisis kemajuan siswa.

## 🚀 Prerequisites

- Node.js (versi 20.x atau lebih tinggi)
- npm (versi 10.x atau lebih tinggi)
- MongoDB Atlas (sudah dikonfigurasi di .env)

## 📦 Instalasi

1. Clone repository ini
2. Install dependencies untuk frontend:
   ```bash
   npm install
   ```
3. Install dependencies untuk backend:
   ```bash
   cd server
   npm install
   cd ..
   ```

## ▶️ Menjalankan Proyek

### Opsi 1: Jalankan Semua Server Sekaligus
Buka 3 terminal terpisah:

**Terminal 1 - Backend API:**
```bash
cd server
npm run dev
```
Server akan berjalan di `http://localhost:5000`

**Terminal 2 - Mock AI Gateway:**
```bash
cd server
npm run ai:mock
```
Gateway akan berjalan di `http://localhost:8000`

**Terminal 3 - Frontend:**
```bash
npm run dev
```
Aplikasi akan terbuka di `http://localhost:8080`

### Opsi 2: Jalankan dengan Script (jika tersedia)
```bash
npm run dev
```

## 🔄 Alur Penggunaan

1. **Login**: Masuk menggunakan akun yang sesuai dengan role Anda
2. **Dashboard**: Lihat ringkasan dan navigasi menu utama
3. **Kelas & Siswa**: Kelola data kelas dan siswa (untuk guru/kepala sekolah)
4. **Materi & Quiz**: Akses konten pembelajaran dan kuis interaktif
5. **Skill Tree**: Pantau perkembangan kompetensi siswa
6. **AI Features**: Gunakan fitur AI untuk analisis dan rekomendasi

## 👤 Akun Test

### Kepala Sekolah
- Email: `kepala.sekolah@smktiglobal.sch.id`
- Password: `made123`

### Guru (Ketua Program PPLG)
- Email: `ade.pranata@smktiglobal.sch.id`
- Password: `putu123`

### Siswa (XI PPLG 1)
- Email: `0088432625@student.smktiglobal.sch.id`
- Password: `i123`

## 🛠️ Troubleshooting

- Pastikan semua dependencies terinstall
- Periksa koneksi MongoDB di file `.env`
- Jika port konflik, ubah port di `vite.config.ts` atau `server/.env`
- Untuk masalah lainnya, lihat dokumentasi di folder `docs/`

## 📚 Dokumentasi Tambahan

- [Panduan Testing API](API-TESTING-GUIDE.md)
- [Arsitektur Sistem](ARCHITECTURE-DIAGRAM.md)
- [Integrasi AI](AI-INTEGRATION-TESTING.md)