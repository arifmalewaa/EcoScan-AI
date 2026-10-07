# ♻️ EcoScan AI

Smart Waste Detection & Sorting berbasis Artificial Intelligence.

## Deskripsi

EcoScan AI adalah prototype web untuk mendeteksi jenis sampah menggunakan kamera dan model AI.

Kelas yang didukung oleh kode saat ini:
- 🟢 Organik
- 🟡 Plastik
- 🔵 Kertas
- ⚫ Residu

## Fitur

- Camera scanner
- AI status
- Confidence score
- Smart bin recommendation
- Statistik scan
- Riwayat scan
- Responsive layout

## Teknologi

- HTML5
- CSS3
- JavaScript
- TensorFlow.js
- Teachable Machine

## Struktur

```text
EcoScan-AI/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── model/
│   └── (masukkan model Teachable Machine di sini)
├── assets/
│   ├── images/
│   └── icons/
├── README.md
└── .gitignore
```

## Model AI

Pada versi sumber, URL model masih berupa placeholder:

`PASTE_MODEL_URL_HERE/`

Jadi model AI belum disertakan dalam ZIP ini.

Jika model Teachable Machine akan disimpan di repository, letakkan file model di folder `model/`, lalu ubah konfigurasi di `js/app.js` menjadi:

```javascript
const MODEL_URL = "./model/";
```

Pastikan file `model.json`, `metadata.json`, dan file weights model tersedia.

## Menjalankan

Untuk GitHub Pages, upload seluruh isi repository dan aktifkan:

Settings → Pages → Deploy from a branch → main → / (root)

Catatan: akses kamera browser membutuhkan HTTPS atau localhost.
