# 🧪 Integration Testing Guide - School Owner Flow

## 📋 Overview

Dokumen ini menjelaskan cara test complete flow untuk **School Owner Registration & Login** yang sudah fully integrated antara frontend dan backend.

---

## 🔧 Perbaikan yang Sudah Dilakukan

### 1. **Backend Improvements**

✅ **Added Login Endpoint**
```typescript
// File: server/src/routes/schoolOwner.ts
router.post("/login", loginSchoolOwner);
```

✅ **Fixed Response Structure**
```typescript
// Sekarang return nested 'data' object seperti yang frontend expect
return res.status(201).json({
  success: true,
  message: "...",
  data: {              // ← Frontend expect ini!
    school: {...},
    user: {...},
    token: "..."
  }
});
```

✅ **Fixed Field Naming**
```typescript
// Backend sekarang terima 'address' (bukan 'schoolAddress')
const { address, city, province, ... } = req.body;
```

### 2. **Frontend Improvements**

✅ **Consistent Route Names**
```typescript
// Login.tsx navigate to: /school-owner-dashboard
// App.tsx route: /school-owner-dashboard
// Legacy support: /school-dashboard (redirect ke yang sama)
```

✅ **Proper API Integration**
```typescript
// Registration: POST /api/school-owner/register
// Login: POST /api/school-owner/login
```

---

## 🧪 Test Scenario 1: School Owner Registration

### Step 1: Buka Halaman Registrasi

```
URL: http://localhost:5173/school-owner-registration
```

### Step 2: Isi Form dengan Data Test

**Owner Information:**
```
Nama Lengkap: Dr. Budi Santoso
Email: budi@sekolahku.sch.id
Password: password123
Konfirmasi Password: password123
Nomor Telepon: 08123456789 (optional)
```

**School Information:**
```
Nama Sekolah: SMA Negeri 1 Jakarta
Alamat Lengkap: Jl. Pendidikan No. 123
Kota: Jakarta
Provinsi: DKI Jakarta
Nomor Telepon Sekolah: 021-1234567 (optional)
Jumlah Kelas: 36 (optional)
```

### Step 3: Klik "Daftar Sekolah"

### Expected Result:

✅ **Success Dialog Muncul** dengan informasi:
- School ID: `SCH-XXXXXX` (auto-generated, 6 digit random)
- Tombol "Copy School ID"
- Tombol "Lanjut ke Dashboard"

✅ **Backend Response:**
```json
{
  "success": true,
  "message": "School and owner account created successfully",
  "data": {
    "school": {
      "id": "67...",
      "schoolId": "SCH-123456",
      "schoolName": "SMA Negeri 1 Jakarta",
      "city": "Jakarta",
      "province": "DKI Jakarta",
      "totalClasses": 36,
      "academicYear": "2024/2025"
    },
    "user": {
      "id": "67...",
      "name": "Dr. Budi Santoso",
      "email": "budi@sekolahku.sch.id",
      "role": "school_owner",
      "schoolId": "SCH-123456",
      "schoolName": "SMA Negeri 1 Jakarta",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr. Budi Santoso"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

✅ **Frontend Actions:**
1. Token disimpan di `localStorage`
2. User data disimpan di AuthContext
3. Navigate ke `/school-owner-dashboard`

### Step 4: Verify Dashboard

**Expected:**
- URL berubah ke: `http://localhost:5173/school-owner-dashboard`
- Dashboard menampilkan data sekolah
- Navbar menampilkan nama school owner
- Sidebar ada menu untuk manage teachers, classes, students

---

## 🧪 Test Scenario 2: School Owner Login

### Step 1: Logout (jika masih login)

Klik tombol Logout di dashboard

### Step 2: Buka Halaman Login

```
URL: http://localhost:5173/login
```

### Step 3: Pilih Tab "Sekolah"

Klik tab dengan icon **Building2** 🏢

### Step 4: Isi Form Login

```
Email: budi@sekolahku.sch.id
Password: password123
```

### Step 5: Klik "Login"

### Expected Result:

✅ **Backend Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "67...",
    "name": "Dr. Budi Santoso",
    "email": "budi@sekolahku.sch.id",
    "role": "school_owner",
    "schoolId": "SCH-123456",
    "schoolName": "SMA Negeri 1 Jakarta",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr. Budi Santoso"
  },
  "school": {
    "id": "67...",
    "schoolId": "SCH-123456",
    "schoolName": "SMA Negeri 1 Jakarta",
    "city": "Jakarta",
    "province": "DKI Jakarta"
  }
}
```

✅ **Frontend Actions:**
1. Token disimpan di `localStorage`
2. User data disimpan di AuthContext
3. Toast notification: "Login berhasil!"
4. Navigate ke `/school-owner-dashboard`

---

## 🧪 Test Scenario 3: Protected Routes

### Test 3a: Akses Dashboard Tanpa Login

```
1. Logout atau hapus token dari localStorage
2. Buka: http://localhost:5173/school-owner-dashboard
```

**Expected:**
- Redirect ke `/login`
- Toast: "Please login to access this page"

### Test 3b: Teacher Coba Akses School Dashboard

```
1. Login sebagai Teacher
2. Manually navigate ke: /school-owner-dashboard
```

**Expected:**
- Redirect ke `/login` atau `/teacher-dashboard`
- Error: "Unauthorized - role tidak sesuai"

---

## 🧪 Test Scenario 4: Error Handling

### Test 4a: Email Sudah Terdaftar

```
POST /api/school-owner/register
{
  "email": "budi@sekolahku.sch.id", // Email yang sama
  "..."
}
```

**Expected:**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

Frontend menampilkan error di Alert component.

### Test 4b: Password Tidak Cocok

Di halaman registration:
```
Password: password123
Konfirmasi Password: password456
```

**Expected:**
- Frontend validation: "Password tidak cocok"
- Request tidak dikirim ke backend

### Test 4c: Login dengan Password Salah

```
POST /api/school-owner/login
{
  "email": "budi@sekolahku.sch.id",
  "password": "wrongpassword"
}
```

**Expected:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

Frontend menampilkan error: "Invalid credentials"

### Test 4d: Login dengan Email Tidak Terdaftar

```
POST /api/school-owner/login
{
  "email": "notfound@example.com",
  "password": "password123"
}
```

**Expected:**
```json
{
  "success": false,
  "message": "Invalid credentials or account not found"
}
```

---

## 🔍 Debugging Tools

### 1. **Check MongoDB Database**

```bash
# Connect to MongoDB
mongosh "mongodb+srv://..."

# Switch to database
use edusmart

# Check users collection
db.users.find({ role: "school_owner" }).pretty()

# Check schools collection
db.schools.find().pretty()
```

### 2. **Check Browser DevTools**

**Console:**
```javascript
// Check token
localStorage.getItem('token')

// Decode JWT (manual)
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);
```

**Network Tab:**
- Filter: `/api/school-owner/`
- Check Request payload
- Check Response status & body

**Application Tab:**
- Local Storage → Check `token` key
- Session Storage (jika ada)

### 3. **Backend Logs**

Terminal backend akan show:
```
POST /api/school-owner/register 201 234ms
POST /api/school-owner/login 200 123ms
```

Error logs:
```
Error registering school owner: <error detail>
```

---

## ✅ Integration Checklist

### Backend ✓
- [x] POST `/api/school-owner/register` endpoint working
- [x] POST `/api/school-owner/login` endpoint working
- [x] Response structure matches frontend expectations
- [x] Field naming consistent (`address` not `schoolAddress`)
- [x] JWT token generation working
- [x] Password hashing with bcrypt
- [x] MongoDB models (User, School) working
- [x] School ID auto-generation (SCH-XXXXXX)

### Frontend ✓
- [x] `/school-owner-registration` page working
- [x] `/login` page with school owner tab
- [x] Form validation (password match, required fields)
- [x] API calls to correct endpoints
- [x] Token storage in localStorage
- [x] AuthContext integration
- [x] Success dialog with School ID
- [x] Copy School ID to clipboard
- [x] Navigation after registration/login
- [x] Protected routes with role checking
- [x] Error handling & user feedback

### Routes ✓
- [x] `/school-owner-registration` → SchoolOwnerRegistration page
- [x] `/login` → Login page (with school tab)
- [x] `/school-owner-dashboard` → SchoolOwnerDashboard (protected)
- [x] `/school-dashboard` → Redirect to school-owner-dashboard (legacy)

---

## 🚀 Next Steps

1. **Test Teacher Registration**
   - Teacher harus input School ID dari owner
   - Verify teacher terhubung ke sekolah yang benar

2. **Test Student Registration**
   - Student input School ID + Class ID
   - Verify student masuk ke kelas yang benar

3. **Test Dashboard Features**
   - School owner bisa create classes
   - School owner bisa approve teachers
   - School owner bisa view statistics

4. **Test Multi-School Support**
   - Register 2+ schools
   - Verify data isolation (school A tidak bisa akses data school B)

---

## 📞 Support

Jika ada error:

1. **Check browser console** untuk error messages
2. **Check terminal backend** untuk server errors
3. **Check MongoDB** untuk data consistency
4. **Check .env file** untuk configuration
5. **Restart backend server** jika ada perubahan .env

**Common Issues:**

| Issue | Solution |
|-------|----------|
| Token tidak tersimpan | Check browser localStorage support |
| 401 Unauthorized | Token expired atau invalid, login ulang |
| 404 Not Found | Check route di App.tsx dan backend app.ts |
| CORS error | Check backend CORS configuration |
| MongoDB connection error | Check MONGODB_URI di .env |
| JWT error | Check JWT_SECRET di .env |

---

## 🎉 Selamat Testing!

Sistem school owner registration & login sudah **fully integrated** dan siap untuk production testing! 🚀
