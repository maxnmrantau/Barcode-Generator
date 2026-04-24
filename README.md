<img width="1920" height="911" alt="image" src="https://github.com/user-attachments/assets/a3ec7a93-b2dc-4b74-8d7a-892acdd0abed" />

# Bulk Barcode Pro ⚡

**Bulk Barcode Pro** adalah aplikasi web modern berperforma tinggi yang dirancang untuk menghasilkan barcode dalam jumlah besar secara cepat dan efisien. Aplikasi ini mendukung kustomisasi penuh terhadap dimensi fisik barcode, jenis barcode, serta layout tampilan.

## ✨ Fitur Utama

- **Generasi Massal**: Mendukung pembuatan hingga **1.000 barcode** dalam satu sesi.
- **Validasi Data**: Sistem validasi otomatis untuk memastikan input tidak melebihi batas dan data valid.
- **Kustomisasi Dimensi Fisik**:
  - Mengatur **Lebar (Width)** dan **Tinggi (Height)** secara akurat.
  - Pilihan unit: **Inci (inch)**, **Centimeter (cm)**, dan **Millimeter (mm)**.
- **Kontrol Tampilan**:
  - **Layout Grid (Kotak)**: Untuk tampilan ringkas yang memaksimalkan ruang.
  - **Layout List (Baris)**: Untuk hasil yang lebih detail per baris.
- **Sistem Paginasi Pintar**: Membagi hasil menjadi **100 barcode per halaman** untuk menjaga performa aplikasi tetap ringan.
- **Kustomisasi Label**:
  - Opsi untuk menampilkan atau menyembunyikan teks di bawah barcode.
  - Pilihan font (Arial, Space Mono, dll) dan ukuran font.
- **Responsif & Modern**: Antarmuka yang bersih, intuitif, dan ramah pengguna dengan animasi halus.

## 🚀 Cara Penggunaan

1. **Input Data**: Masukkan data yang ingin dijadikan barcode di kolom teks sebelah kiri. Pastikan setiap satu baris mewakili satu barcode.
2. **Konfigurasi**:
   - Pilih **Jenis Barcode** (misal: Code 128).
   - Atur **Dimensi** (Width & Height) serta **Unit** yang diinginkan.
   - Aktifkan/Nonaktifkan **Label Teks** jika diperlukan.
3. **Generate**: Klik tombol **"Generate Barcodes"**.
4. **Navigasi**: Gunakan kontrol paginasi di bagian atas atau bawah area hasil untuk berpindah halaman.
5. **Layout**: Klik ikon Grid atau List di bagian atas hasil untuk mengubah gaya tampilan.
6. **Hapus Data**: Gunakan tombol **"Clear Data"** jika ingin mereset semua input dan hasil.

## 🛠️ Teknologi yang Digunakan

- **React 19**: Library JavaScript untuk membangun antarmuka pengguna.
- **Vite**: Build tool super cepat untuk pengembangan frontend.
- **Tailwind CSS**: Framework CSS untuk desain yang responsif dan modern.
- **JsBarcode**: Library utama untuk proses render barcode.
- **Framer Motion**: Untuk animasi transisi yang halus.
- **Lucide React**: Set ikon vektor yang cantik dan konsisten.

## 📦 Instalasi Lokal

Jika Anda ingin menjalankan proyek ini di komputer lokal:

1. Clone repositori:
   ```bash
   git clone https://github.com/username/bulk-barcode-pro.git
   ```
2. Masuk ke direktori proyek:
   ```bash
   cd bulk-barcode-pro
   ```
3. Instal dependensi:
   ```bash
   npm install
   ```
4. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
5. Buka browser dan akses `http://localhost:3000`.

---
Dibuat dengan ❤️ untuk efisiensi inventaris Anda.
