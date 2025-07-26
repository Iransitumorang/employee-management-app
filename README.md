# Employee Management System

Aplikasi manajemen karyawan yang dibangun dengan Angular framework. Aplikasi ini memiliki fitur CRUD (Create, Read, Update, Delete) untuk mengelola data karyawan dengan antarmuka yang responsif dan modern.

## Fitur Utama

### 1. Login Page
- Form login dengan username dan password
- Validasi form yang berfungsi
- Credentials hardcoded: username: `admin`, password: `admin123`
- Navigasi otomatis ke halaman employee list setelah login berhasil

### 2. Employee List Page
- Menampilkan 100 data dummy karyawan
- Fitur paging dengan opsi 5, 10, 20, 50 item per halaman
- Sorting pada semua kolom (ascending/descending)
- Searching dengan 5 parameter (firstName, lastName, email, group, status)
- Logika pencarian menggunakan AND (semua filter harus cocok)
- Action buttons: View Detail, Edit (dummy), Delete
- Notifikasi dengan warna berbeda (edit = kuning, delete = merah)

### 3. Add Employee Page
- Form lengkap untuk menambah karyawan baru
- Validasi form yang ketat (semua field mandatory)
- Date picker untuk birth date (tidak boleh melebihi hari ini)
- Validasi format email
- Input basic salary hanya menerima angka
- Dropdown group dengan search functionality
- 10 dummy group options

### 4. Employee Detail Page
- Menampilkan detail lengkap karyawan
- Formatting data yang sesuai (currency, date, datetime)
- Button OK untuk kembali ke employee list

## Environment Requirements

### Prerequisites
- **Node.js** versi 18.0.0 atau lebih baru
- **npm** versi 9.0.0 atau lebih baru
- **Angular CLI** versi 17.0.0 atau lebih baru

### Cara Install Dependencies
```bash
npm install
```

### Cara Menjalankan Aplikasi

1. **Development Mode**
   ```bash
   ng serve
   ```
   Aplikasi akan berjalan di `http://localhost:4200`

2. **Production Build**
   ```bash
   ng build
   ```

3. **Running Tests**
   ```bash
   ng test
   ```

## Struktur Aplikasi

```
src/
├── app/
│   ├── auth/
│   │   └── login/           # Login page
│   ├── employee/
│   │   ├── models/          # Employee data models
│   │   ├── services/        # Employee service
│   │   ├── employee-list/   # Employee list page
│   │   ├── add-edit-employee/ # Add/Edit employee form
│   │   ├── employee-detail/ # Employee detail page
│   │   ├── employee-module.ts
│   │   └── employee-routing-module.ts
│   ├── app.routes.ts
│   ├── app.config.ts
│   └── app.ts
├── styles.scss
└── main.ts
```

## Teknologi yang Digunakan

- **Angular 17** - Framework utama
- **TypeScript** - Bahasa pemrograman
- **SCSS** - Styling
- **Angular Router** - Navigation
- **Angular Forms** - Form handling
- **RxJS** - Reactive programming

## Fitur Responsive Design

Aplikasi dirancang responsif untuk berbagai ukuran layar:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## Data Model Employee

```typescript
interface Employee {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  basicSalary: number;
  status: string;
  group: string;
  description: Date;
}
```

## Demo Credentials

- **Username:** iransitumorang
- **Password:** iransitumorang

## Browser Support

- Chrome (versi terbaru)
- Firefox (versi terbaru)
- Safari (versi terbaru)
- Edge (versi terbaru)

## Troubleshooting

Jika mengalami masalah saat menjalankan aplikasi:

1. Pastikan Node.js dan npm sudah terinstall dengan benar
2. Hapus folder `node_modules` dan `package-lock.json`
3. Jalankan `npm install` ulang
4. Jalankan `ng serve` untuk memulai development server

## Kontribusi

Untuk berkontribusi pada project ini:
1. Fork repository
2. Buat feature branch
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request
