Project MyTutor adalah platform web yang dirancang khusus untuk menjembatani kebutuhan antara siswa yang mencari bimbingan belajar dengan tutor yang bersedia mengajar. Platform ini menyediakan antarmuka yang intuitif bagi siswa untuk menemukan tutor sesuai kriteria mereka, melihat jadwal yang tersedia, serta melakukan pemesanan sesi les privat. Bagi tutor, platform ini berfungsi sebagai manajemen kelas digital yang memudahkan mereka dalam mengelola jadwal, melacak pemesanan, serta memantau pendapatan secara efisien.

Fitur utama yang ditawarkan meliputi:

- **Pencarian dan Filter Tutor**:
  Siswa dapat dengan mudah mencari tutor berdasarkan subjek yang ditawarkan, tingkat kesulitan, serta ketersediaan waktu.

- **Manajemen Jadwal dan Pemesanan**:
  Sistem menyediakan kalender interaktif yang memungkinkan siswa memesan sesi les pada slot waktu yang kosong. Tutor dapat melihat semua permintaan pemesanan masuk, mengkonfirmasi atau menolak permintaan tersebut, serta mengatur ketersediaan jadwal mereka secara mandiri.

- **Notifikasi Real-time**:
  Platform ini dilengkapi dengan sistem notifikasi untuk menginformasikan pengguna tentang perubahan status pemesanan, pengingat sesi les yang akan datang, serta pesan baru dari tutor atau siswa.

- **Integrasi Pembayaran**:
  Proses transaksi pembayaran diintegrasikan langsung ke dalam sistem, memudahkan siswa untuk membayar sesi les mereka dan memastikan tutor menerima pembayaran secara akurat.

- **Ulasan dan Reputasi**:
  Setelah sesi les selesai, siswa dapat memberikan ulasan dan rating kepada tutor. Data ini dikumpulkan untuk membangun reputasi tutor di platform, membantu siswa lain dalam memilih tutor yang berkualitas.

Secara teknologi, proyek ini dibangun menggunakan Next.js yang menyediakan struktur server-side rendering (SSR) dan static-site generation (SSG) untuk performa yang optimal. Basis data dikelola menggunakan Supabase, sebuah platform backend as a service yang menyediakan fitur autentikasi, database SQL, dan penyimpanan file. Desain antarmuka pengguna dibuat responsif dan modern dengan bantuan Tailwind CSS dan shadcn/ui, memastikan pengalaman pengguna yang mulus di berbagai perangkat.

Untuk menjalankan proyek MyTutor di komputer Anda, ikuti langkah-langkah berikut:

1. **Instalasi Node.js dan npm**
   Pastikan Anda telah menginstal Node.js (versi 18.0.0 atau lebih baru) dan npm (biasanya terinstal bersama Node.js) di komputer Anda. Anda dapat mengunduhnya dari [nodejs.org](https://nodejs.org/).

2. **Kloning Repositori**
   Buka terminal atau command prompt, navigasikan ke direktori tempat Anda ingin menyimpan proyek, lalu jalankan perintah berikut untuk mengunduh kode dari GitHub:

   ```bash
   git clone https://github.com/JeremyTjahjana/MyTutor.git
   cd MyTutor
   ```

3. **Instalasi Dependensi**
   Setelah berhasil mengunduh kode, Anda perlu menginstal semua library atau paket yang dibutuhkan oleh proyek. Jalankan perintah berikut di terminal:

   ```bash
   npm install
   ```

   Proses ini akan membaca file `package.json` dan mengunduh semua dependensi ke dalam folder `node_modules`.

4. **Konfigurasi Environment Variables**
   Proyek ini menggunakan file `.env.local` untuk menyimpan konfigurasi sensitif seperti kunci API dan URL database. Meskipun beberapa nilai default mungkin sudah tersedia, disarankan untuk memeriksa file ini dan memperbaruinya sesuai kebutuhan akun Supabase Anda.

   ```bash
   # Buat file .env.local jika belum ada (biasanya otomatis)
   cp .env.example .env.local
   # Edit .env.local dengan kredensial Anda
   ```

   Pastikan variabel seperti `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah benar.

5. **Menjalankan Server Development**
   Setelah semua dependensi terinstal dan konfigurasi selesai, Anda dapat menjalankan server pengembangan dengan perintah:
   ```bash
   npm run dev
   ```
   Setelah server berhasil dijalankan, Anda akan melihat output yang menunjukkan URL lokal (biasanya `http://localhost:3000`). Buka browser Anda, masukkan URL tersebut, dan Anda akan dapat mengakses aplikasi MyTutor.
