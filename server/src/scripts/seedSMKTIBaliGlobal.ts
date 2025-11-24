/**
 * Seed Script untuk SMK TI Bali Global Badung
 * Sekolah contoh lengkap dengan semua data real
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import UserModel from '../models/User.js';
import SchoolModel from '../models/School.js';
import ClassModel from '../models/Class.js';
import SubjectModel from '../models/Subject.js';
import TopicModel from '../models/Topic.js';
import QuizQuestionModel from '../models/QuizQuestion.js';
import UserProgressModel from '../models/UserProgress.js';
import SkillTreeNodeModel from '../models/SkillTreeNode.js';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// =============================================
// DATA SEKOLAH
// =============================================
const schoolData = {
  name: 'SMK TI Bali Global Badung',
  address: 'Jl. Tibungsari No. 1, Desa Dalung, Kuta Utara, Badung, Bali',
  phone: '+62 361-419097',
  email: 'info@smktibaliglobalbadung.sch.id',
  website: 'www.smktibaliglobalbadung.sch.id',
  npsn: '69945796',
  type: 'SMK',
  accreditation: 'A',
  principal: 'I Made Indra Aribawa, SH',
  vision: 'Menjadi SMK Teknologi Informasi Terdepan yang Menghasilkan Lulusan Kompeten, Berkarakter, dan Siap Kerja',
  mission: [
    'Menyelenggarakan pendidikan berbasis teknologi informasi yang berkualitas',
    'Mengembangkan kerjasama dengan dunia usaha dan industri',
    'Membentuk karakter siswa yang berintegritas dan profesional',
    'Menghasilkan lulusan yang siap kerja dan berwirausaha'
  ],
  majors: ['TJKT', 'PPLG', 'DKV', 'BD'] // Teknik Jaringan, Pengembangan Perangkat Lunak, Desain Komunikasi Visual, Bisnis Digital
};

// =============================================
// DATA GURU & MANAJEMEN (31 ORANG)
// =============================================
const teachers = [
  // Manajemen
  { name: 'Gede Putu Agustyawan, S.Pd', email: 'agustyawan@smktiglobal.sch.id', subjects: ['Kurikulum'], nip: 'WKK001' },
  { name: 'I Made Dwi Adnyana, SH', email: 'dwi.adnyana@smktiglobal.sch.id', subjects: ['Sarpras'], nip: 'WKS001' },
  { name: 'Ida Ayu Cempaka Putri, S.Pd', email: 'cempaka.putri@smktiglobal.sch.id', subjects: ['Kesiswaan'], nip: 'WKI001' },
  { name: 'Ida Ayu Made Ari Widyawati, S.Pd.H', email: 'ari.widyawati@smktiglobal.sch.id', subjects: ['Humas'], nip: 'WKH001' },
  { name: 'Ni Kadek Lala Mistariadi, S.Pd', email: 'lala.mistariadi@smktiglobal.sch.id', subjects: ['BK'], nip: 'BK001' },
  
  // Ketua Program
  { name: 'Bagas Alif Rizkianto, S.Kom', email: 'bagas.alif@smktiglobal.sch.id', subjects: ['Desain Grafis'], nip: 'KP-DKV' },
  { name: 'Putu Ade Pranata, S.Kom', email: 'ade.pranata@smktiglobal.sch.id', subjects: ['Pemrograman Web'], nip: 'KP-PPLG' },
  { name: 'I Gede Bagus Ardiyana Irawan, S.Kom', email: 'ardiyana.irawan@smktiglobal.sch.id', subjects: ['Jaringan Komputer'], nip: 'KP-TJKT' },
  { name: 'A.A Ngurah Putra Agung Amurvabhumi Yoga Cara, S.M', email: 'ngurah.putra@smktiglobal.sch.id', subjects: ['E-Commerce'], nip: 'KP-BD' },
  
  // Guru Produktif
  { name: 'Ni Nyoman Murni, S.Kom, M.Kom', email: 'nyoman.murni@smktiglobal.sch.id', subjects: ['Pemrograman Web'], nip: 'GP001' },
  { name: 'A.A Sandatya Widhiyanti, S.Kom, M.Kom', email: 'sandatya.widhiyanti@smktiglobal.sch.id', subjects: ['Database'], nip: 'GP002' },
  { name: 'I Gst Pt Wahyu Armandha Kumara, S.Kom', email: 'wahyu.armandha@smktiglobal.sch.id', subjects: ['Sistem Operasi'], nip: 'GP003' },
  { name: 'I Wayan Cikayana, S.Pd', email: 'wayan.cikayana@smktiglobal.sch.id', subjects: ['Animasi'], nip: 'GP004' },
  { name: 'Thessa Sahara Umami, S.Pd', email: 'thessa.sahara@smktiglobal.sch.id', subjects: ['Desain Grafis'], nip: 'GP005' },
  { name: 'Ni Putu Anik Parwati Utami, S.Kom', email: 'anik.parwati@smktiglobal.sch.id', subjects: ['Algoritma'], nip: 'GP006' },
  { name: 'Dapa Putra', email: 'dapa.putra@smktiglobal.sch.id', subjects: ['Digital Marketing'], nip: 'GP007' },
  
  // Guru Agama
  { name: 'Putu Meira Yanti, S.Pd', email: 'meira.yanti@smktiglobal.sch.id', subjects: ['Agama Hindu'], nip: 'GA001' },
  { name: 'Samsul Arifin, S.Pd', email: 'samsul.arifin@smktiglobal.sch.id', subjects: ['Agama Islam'], nip: 'GA002' },
  { name: 'Masri Kagatanaribe, S.Th, M.Pd', email: 'masri.kagatanaribe@smktiglobal.sch.id', subjects: ['Agama Kristen'], nip: 'GA003' },
  
  // Guru Matematika
  { name: 'Ni Wayan Kantiani, S.Pd', email: 'wayan.kantiani@smktiglobal.sch.id', subjects: ['Matematika'], nip: 'GM001' },
  { name: 'I Gede Made Darma Wiguna, S.Pd', email: 'darma.wiguna@smktiglobal.sch.id', subjects: ['Matematika'], nip: 'GM002' },
  
  // Guru Bahasa
  { name: 'Ni Luh Candra Dewi, S.Pd', email: 'candra.dewi@smktiglobal.sch.id', subjects: ['Bahasa Indonesia'], nip: 'GB001' },
  { name: 'Binta Lestari Putry, S.Pd', email: 'binta.lestari@smktiglobal.sch.id', subjects: ['Bahasa Indonesia'], nip: 'GB002' },
  { name: 'Ni Kadek Dwi Sintya Dewi, S.Pd', email: 'sintya.dewi@smktiglobal.sch.id', subjects: ['Bahasa Inggris'], nip: 'GB003' },
  { name: 'Gusti Ayu Oktianingsih, S.Pd', email: 'ayu.oktianingsih@smktiglobal.sch.id', subjects: ['Bahasa Inggris'], nip: 'GB004' },
  { name: 'Ni Putu Ayu Imelda Sasiandari, S.S', email: 'imelda.sasiandari@smktiglobal.sch.id', subjects: ['Bahasa Jepang'], nip: 'GB005' },
  { name: 'Kadek Sri Ranika Marcheliana', email: 'ranika.marcheliana@smktiglobal.sch.id', subjects: ['Bahasa Bali'], nip: 'GB006' },
  
  // Guru Umum
  { name: 'Yan Anugrah Wisesa, S.Sos.H., M.Pd', email: 'yan.anugrah@smktiglobal.sch.id', subjects: ['PKn'], nip: 'GU001' },
  { name: 'I Gusti Ayu Ary Ratih, SE. MM', email: 'ary.ratih@smktiglobal.sch.id', subjects: ['PKWU'], nip: 'GU002' },
  { name: 'Ni Putu Juli Ratna Dewi, S.Sn', email: 'juli.ratna@smktiglobal.sch.id', subjects: ['Seni Budaya'], nip: 'GU003' },
  { name: 'Ni Nyoman Dita Tri Pramida, S.Pd', email: 'dita.pramida@smktiglobal.sch.id', subjects: ['IPAS'], nip: 'GU004' },
  { name: 'I Wayan Muliawan', email: 'wayan.muliawan@smktiglobal.sch.id', subjects: ['PJOK'], nip: 'GU005' },
];

// =============================================
// DATA SISWA DARI FILE
// =============================================
// Kelas 10 - 4 kelas (X TJKT 1, X TJKT 2, X PPLG 1, X PPLG 2, X DKV, X BD)
const siswaKelas10 = [
  // X TJKT 1
  { nisn: '0097620060', nama: 'ADNAN RAGHIB CHESTA ARDANSA', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '3094692575', nama: 'Agung Bagus Arta Wiguna', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '3099292029', nama: 'Althaf Danish Firmansyah', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 40 },
  { nisn: '3096724021', nama: 'Andika Pratama', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 20 },
  { nisn: '0109531526', nama: 'April Lia Nur Rahma', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 55 },
  { nisn: '0092358533', nama: 'Aurellya Ramadhani', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 40 },
  { nisn: '3098094650', nama: 'Ayu Rahmawati', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 40 },
  { nisn: '0092029084', nama: 'Azriel Muhammad Fattah', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 85 },
  { nisn: '3091065397', nama: 'Cahaya Fitri Rahmadiana', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 45 },
  { nisn: '0103339475', nama: 'Citra Permata Hati', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 30 },
  { nisn: '0108049582', nama: 'DERREN HUANGSAJAYA', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 85 },
  { nisn: '3098362902', nama: 'Devita Nuruliah Ningtias', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 45 },
  { nisn: '0101968594', nama: 'dewa ayu made wiandari kania', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 30 },
  { nisn: '3090127211', nama: 'ECHA SEPTYA ANANTA', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 35 },
  { nisn: '3099700936', nama: 'FITRI RAMADHANI EFENDI', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 40 },
  { nisn: '0102697852', nama: 'I Kadek Bayu Juniawan Putra', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 45 },
  { nisn: '0101220403', nama: 'I Made Angga Kusama Wijaya', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 55 },
  { nisn: '0096364498', nama: 'I PUTU AGUS ARI SEPTIAWAN', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0109103917', nama: 'Irham Nazriel Azzam Saputra', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 65 },
  { nisn: '0103577211', nama: 'Janeeta Alisha', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 40 },
  { nisn: '0108411305', nama: 'KOMANG WIDHANTARA', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 80 },
  { nisn: '0103886328', nama: 'M.Dzakwan Purbaleo', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 30 },
  { nisn: '0101370864', nama: 'Muhamad Andika Pratama', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 75 },
  { nisn: '0093558144', nama: 'Muhamad Yusuf perdana', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 80 },
  { nisn: '0101990603', nama: 'Muhammad Reza Rifqy Rauther', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 70 },
  { nisn: '0103560399', nama: 'Ni Kadek Cantika Putri Purnama Dewi', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 55 },
  { nisn: '0091679676', nama: 'Ni Luh Dea Puspita Sari', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 55 },
  { nisn: '0082291181', nama: 'NOVAL RIVALDI', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 20 },
  { nisn: '3096699524', nama: 'Panji Notorogo', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 35 },
  { nisn: '0095457297', nama: 'PUTU HARI SAPUTRA', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0091980898', nama: 'Putu Renita Rayi Nariswari', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '3097619310', nama: 'Rosul Asmahful Kahfi', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 75 },
  { nisn: '0103101512', nama: 'Salma Sakina Haris', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 50 },
  { nisn: '0105317316', nama: 'Sang Putu Aditya Putra', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 80 },
  { nisn: '3075574147', nama: 'Sela Dewi Amelia', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 20 },
  { nisn: '0099554468', nama: 'Stafa Prasetya Wibowo', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 30 },
  { nisn: '0084931005', nama: 'Tristan Zachely Famador', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0095377802', nama: 'ZAFIRA ALANA SACHIKO', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 30 },
  
  // X TJKT 2
  { nisn: '0094412907', nama: 'Ahmad Fauzan', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 25 },
  { nisn: '0097316991', nama: 'AKBAR GALIH DZULHIZA', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 75 },
  { nisn: '3105128261', nama: 'Alfira ananda setiawati', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 45 },
  { nisn: '0099353116', nama: 'Elok Mahda Sifana', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 55 },
  { nisn: '0091411876', nama: 'Fajri Rahmad Hidayat', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 20 },
  { nisn: '3105155021', nama: 'FEBI MELISA PUTRI', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 30 },
  { nisn: '0104846931', nama: 'Firnanda Sultan Kholit Almansur', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 20 },
  { nisn: '0105812481', nama: 'Herdiyan Fajar Surya Kusuma', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 35 },
  { nisn: '0103039188', nama: 'ICHA ANASTASYA PUTRI', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 40 },
  { nisn: '0102605776', nama: 'I Kadek Rajendra Windu Adinatha', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 60 },
  { nisn: '0093894072', nama: 'I MADE NANDU ARYA KUSUMA', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 85 },
  { nisn: '0107002911', nama: 'Intan Aulia Putri', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 20 },
  { nisn: '0098611598', nama: 'I PUTU BAYU MERTA DINATA', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 55 },
  { nisn: '0083169600', nama: 'I Putu Chandra Mandala', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 85 },
  { nisn: '0098236148', nama: 'I Putu Dylan Widya Nugraha', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 55 },
  { nisn: '3093074788', nama: 'kevin rama aditya', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 60 },
  { nisn: '0108914749', nama: 'MADE AYU KEZIA LAKSMI DEWI', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 20 },
  { nisn: '0109893856', nama: 'Michelle Noni Frans', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 15 },
  { nisn: '3091706151', nama: 'Michel Rizki Ragileo', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 80 },
  { nisn: '3100618856', nama: 'Mirta Ayu Lestari', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 80 },
  { nisn: '3107128082', nama: 'Moch Rafiq Ilhami', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 20 },
  { nisn: '3091420243', nama: 'MUHAMAD RIZAL PRATAMA', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 65 },
  { nisn: '3093941195', nama: 'Muhammad Albar Alkamil', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 55 },
  { nisn: '0098823204', nama: 'Nabil Tirta Mustika', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 75 },
  { nisn: '0109944203', nama: 'Naylaturrahmah Dwi Kanaya Putri', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 35 },
  { nisn: '0105432462', nama: 'Ni Komang Rani Utari', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 50 },
  { nisn: '0107265806', nama: 'NI PUTU ANANDA DEVI', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 75 },
  { nisn: '0099327673', nama: 'PUTU OKTA INDRA SWARI', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 30 },
  { nisn: '0093606832', nama: 'Putu Vany Meidyanthi', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0092930708', nama: 'Putu Wahyu Kirana Dewi', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 25 },
  { nisn: '0108145396', nama: 'QIRANI MAULIDATUN NAJMA FAHIRA', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 40 },
  { nisn: '0101821753', nama: 'RAYNALDI BINTANG PRATAMA', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 40 },
  { nisn: '0103370295', nama: 'Satria Atma Adi Saputra', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 80 },
  { nisn: '0099676099', nama: 'SHOLAHUDIN SYAIFUL HAKIM', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 35 },
  { nisn: '0092684983', nama: 'Tangguh Noniyanto', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 80 },
  { nisn: '3101513929', nama: 'Tegar eka setiyaji', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 75 },
  { nisn: '0107849791', nama: 'Titan Jawa Dari', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 50 },
  { nisn: '0096563676', nama: 'vebri Apnu saputra', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 60 },
  { nisn: '0081925886', nama: 'wilda putri faurina', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 10 },
  { nisn: '0099911202', nama: 'ZAHWA TITANIA HANNABILA', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 35 },
  { nisn: '0105023038', nama: 'Zia Ulhafiz', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 80 },

  // X PPLG 1
  { nisn: '3096005819', nama: 'Abramovic Addemanuel Nugroho', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 15 },
  { nisn: '3090345722', nama: 'Adrian Maulana Hidayat', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 20 },
  { nisn: '0116622555', nama: 'ALEXANDER ARYA TEJA KUSUMA', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 35 },
  { nisn: '0109373895', nama: 'ARIFKY EKA PUTRA', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 30 },
  { nisn: '3097651382', nama: 'Bagus Ardianata', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 30 },
  { nisn: '0105203550', nama: 'Dave Alfa Deo', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 20 },
  { nisn: '0101044716', nama: 'DEAN SURYA DINATHA', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 70 },
  { nisn: '3102281688', nama: 'Dhika Pratama Heryanto', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 35 },
  { nisn: '0116749120', nama: 'Dira Ananda Brahmantara', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 35 },
  { nisn: '0094742827', nama: 'Doni prasetyo', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 85 },
  { nisn: '0095281087', nama: 'Fahevan Pramestyanggra Putra', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 20 },
  { nisn: '0108176371', nama: 'I GEDE RAMA NANDA RAY', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 55 },
  { nisn: '0103020152', nama: 'I Gede Sila Merta Dana', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 35 },
  { nisn: '0095359383', nama: 'I Kade Krisna Dwi Aditya', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 20 },
  { nisn: '0098684787', nama: 'I Komang Candra Wiguna', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 45 },
  { nisn: '0097435611', nama: 'I Made Candra Darma', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 50 },
  { nisn: '0101011054', nama: 'I Made Oka Bagus Mahera', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 30 },
  { nisn: '0106565857', nama: 'i putu ajus satria Pratama', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 35 },
  { nisn: '0092958557', nama: 'I Wayan Sura Vidyanta', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 15 },
  { nisn: '0094656829', nama: 'Muhammad Ferdian Syahputra', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 35 },
  { nisn: '0082250454', nama: 'Muhammad Rasya Dwi Pranata', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 15 },
  { nisn: '0109321597', nama: 'Naufal Azka Hadi Subyantoro', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 35 },
  { nisn: '3097854003', nama: 'oktavia annastasya melati putri', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 45 },
  { nisn: '0091083306', nama: 'RADINKA MAULANA EFALDO', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 70 },
  { nisn: '9831908493', nama: 'Rafael Christiano Kolo', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 40 },
  { nisn: '0094246124', nama: 'Stanislaus Fareliano Mon', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 30 },

  // X DKV
  { nisn: '3090094434', nama: 'Cahaya fitri Rahmadiani', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 50 },
  { nisn: '3084110341', nama: 'CHAMIM AZZAYADI', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 45 },
  { nisn: '0101245014', nama: 'CHIKA IRHAMNA DARMAWAN', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 30 },
  { nisn: '3096601086', nama: 'Dandung Banyu Tohpati', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 30 },
  { nisn: '0106501429', nama: 'Fitri Dewi Lestari', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 65 },
  { nisn: '0098199228', nama: 'gede desta doni pratama', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 65 },
  { nisn: '0099241554', nama: 'Heny Anisa Dwi Nur\'aini', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 45 },
  { nisn: '0107421129', nama: 'I Gusti Ngurah Angga Satria Wiguna', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 55 },
  { nisn: '0103170956', nama: 'I Kadek Dwi Andika Putra', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 45 },
  { nisn: '0101883971', nama: 'I KOMANG ACHARYA JAYA PRATIKA', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 70 },
  { nisn: '0105647897', nama: 'I Made Arthya Putra', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 85 },
  { nisn: '0109978155', nama: 'I MADE BAYU SAPUTRA', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 95 },
  { nisn: '0094968594', nama: 'i made dika dwiantara', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 35 },
  { nisn: '0104965563', nama: 'I Putu Aditya Darma Wijaya', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 85 },
  { nisn: '0093045044', nama: 'I Putu Duta Widiantara', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 60 },
  { nisn: '0106228387', nama: 'I Putu Eka Candra Suartana', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 45 },
  { nisn: '0099905257', nama: 'I Putu Eka Kusuma Putra', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 50 },
  { nisn: '0098374281', nama: 'IVANDRO GARY WILLIAMS YUSUF', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 85 },
  { nisn: '0094377568', nama: 'Jihan Dealova Wicaksana', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 65 },
  { nisn: '0091944588', nama: 'Komang Gede Geltra An Mahendra', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 15 },
  { nisn: '0098026787', nama: 'mifta fahjari', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 75 },
  { nisn: '3105784191', nama: 'Moh. Jauharrohmi Arifin', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 75 },
  { nisn: '738478372189234', nama: 'Moh Nadi Galih Putra', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 0 },
  { nisn: '0097670628', nama: 'MUHAMMAT REFAN DWI PUTRA', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 65 },
  { nisn: '0101197038', nama: 'Ni Kadek Biella Nida Arsita', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 65 },
  { nisn: '0094168982', nama: 'Ni Kadek Dezy Restyarini', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 75 },
  { nisn: '0099653517', nama: 'ni kadek putri natasha', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 40 },
  { nisn: '0092125815', nama: 'ni luh gede septiani', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 90 },
  { nisn: '0093968135', nama: 'Ni Putu Feby Arwelia', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 80 },
  { nisn: '0106529353', nama: 'ni Putu Julia Sunita Sari', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 90 },
  { nisn: '0107003438', nama: 'Panji Timur Wijayanto', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 40 },
  { nisn: '0107937997', nama: 'Princessa Jasmine shasha angel', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 50 },
  { nisn: '0092488008', nama: 'PUTU KRISHNA ADITYA', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 25 },
  { nisn: '0109324650', nama: 'RAI DONI CAKA ADI WIGUNA', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 60 },
  { nisn: '0104893034', nama: 'VALFRID EVAN REWA', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 60 },
  { nisn: '0104707199', nama: 'Vincentius ananta welem balle', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 35 },
  { nisn: '0097317828', nama: 'Vino Febriyan Sanjaya', kelas: 10, jurusan: 'DKV', semester: 1, nilai_sts: 60 },

  // X BD (Bisnis Digital)
  { nisn: '0102700583', nama: 'Ahmad Hilmy Mubarok', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 80 },
  { nisn: '3103847012', nama: 'AKHDANA DELARD MUHAMMAD GHANIM', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 60 },
  { nisn: '0101983391', nama: 'Alfian Tri Nariya', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 80 },
  { nisn: '3101624509', nama: 'Alzhrah Shafa Jelita', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 35 },
  { nisn: '0106001244', nama: 'Arifah Putri Sulthany', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 40 },
  { nisn: '0109649519', nama: 'ARSYLA DYSTI ISMIA RACHMI', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 70 },
  { nisn: '0099280752', nama: 'Azizah Salsabila Putri Darmawan', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 65 },
  { nisn: '3098406464', nama: 'Birru Kakilangit Bramanza', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 85 },
  { nisn: '0094655886', nama: 'Charolus Christiano Kia Nuka', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 25 },
  { nisn: '0091491582', nama: 'DAMAR GILANG KHADAVI', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 60 },
  { nisn: '3091483443', nama: 'Deka Gentar Pratama', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 25 },
  { nisn: '3085035261', nama: 'Dinda Tri Rosiatul Hanifah', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 75 },
  { nisn: '0104497206', nama: 'Elios Yedutun Landu Ratu', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 35 },
  { nisn: '0085599814', nama: 'Erlangga rahmanda', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 60 },
  { nisn: '0095728414', nama: 'GALIH REZKY AULIA', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 60 },
  { nisn: '0094542697', nama: 'Gede Adit Arya Saputra', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 20 },
  { nisn: '0093641802', nama: 'Hasbi Barokah', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 75 },
  { nisn: '0109592333', nama: 'I Gusti Ayu Agung Putri Raka Dewi', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 45 },
  { nisn: '0096150047', nama: 'I Kadek Agus Pramudia', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 50 },
  { nisn: '0102916490', nama: 'I kadek Aldiana', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 40 },
  { nisn: '0102649804', nama: 'I Komang Darma Yoga', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 50 },
  { nisn: '0093695048', nama: 'I Made Damar Yogi Paramatma', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 60 },
  { nisn: '0097166319', nama: 'I Made Galang Widiatmika', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 65 },
  { nisn: '0091012145', nama: 'I Made Wira Adi Satria Wiguna', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 40 },
  { nisn: '0092114879', nama: 'I Nyoman Kevin Artawan', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 60 },
  { nisn: '0104745532', nama: 'I Putu Eka Wahyu Sastrawan', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '0107467738', nama: 'Irgy Fahriza', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 45 },
  { nisn: '0103376978', nama: 'I Wayan Agus Aldy Pranantha Putra', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 95 },
  { nisn: '0099964279', nama: 'Ketut Alisha Ristika Putri', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 25 },
  { nisn: '0104273189', nama: 'Made Fenita Aurelina Meiyori', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 0 },
  { nisn: '3108510583', nama: 'Moh. Nady Galih Putra', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 30 },
  { nisn: '0106780923', nama: 'Nadia Rachel Suwandhi', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 50 },
  { nisn: '0107806811', nama: 'Ni Kadek Aulia Dwiandani', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 10 },
  { nisn: '0106328543', nama: 'Ni Kadek Nara Marta Pratiwi', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 60 },
  { nisn: '0106502472', nama: 'Ni Komang Putri Ayu Armawati', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 55 },
  { nisn: '0109066321', nama: 'Nyoman Dea Sawitrisna Putri', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 65 },
  { nisn: '0103517327', nama: 'RICKY FABY ARJUNA WIJAYA', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 60 },
  { nisn: '0093204691', nama: 'Stifanny Agatha Talia Huhunggini', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 40 },
  { nisn: '3100701748', nama: 'Yugies Fildan Troy', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 80 },
  { nisn: '0094412485', nama: 'Yvaine Charisya Nadya Nalle', kelas: 10, jurusan: 'BD', semester: 1, nilai_sts: 50 },

  // X PPLG 2
  { nisn: '0106112153', nama: 'Andhika Maraville Gazelle', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 70 },
  { nisn: '3102535567', nama: 'Antonius alfa danielo lotu', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 85 },
  { nisn: '0102970918', nama: 'Arviogalvin Evaldo Simanjuntak', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 85 },
  { nisn: '3098669710', nama: 'Bintang Ramadani', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 85 },
  { nisn: '3106522403', nama: 'Excel Febriano', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0098894465', nama: 'Gede Satria Abdi Utama', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 95 },
  { nisn: '0104317727', nama: 'Given Aidenly Pilatus Kandores', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 55 },
  { nisn: '0102148209', nama: 'Ida Bagus Altissimo Nareswara', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 85 },
  { nisn: '0103522431', nama: 'I Dewa Made Adyaksa Bayusena', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 95 },
  { nisn: '0093648296', nama: 'I Gede Agus Aditiya', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0095782521', nama: 'I Gede Made Dwipa Chandra Sedana', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0103147524', nama: 'I Gede Mahesh Weda Prayata', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 35 },
  { nisn: '0103317815', nama: 'I Gede Pande Prama Daniswara', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 80 },
  { nisn: '0106994131', nama: 'I Gusti Ayu Intan Pradnyani', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0102561256', nama: 'I Kadek Abhysastra Wirawan', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 80 },
  { nisn: '0095905845', nama: 'I Kadek Dwika Pradnyana', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 40 },
  { nisn: '0107161385', nama: 'I Kadek Satya Semara Putra', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '0094048391', nama: 'I Komang Dito Pradnya', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '0105025590', nama: 'I Komang Hendra Ardi Pratama', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 75 },
  { nisn: '0099401766', nama: 'I Made Arie Pinandhita', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 60 },
  { nisn: '0101149581', nama: 'I Made Dwi Dharma Yasa', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 30 },
  { nisn: '0104031023', nama: 'I Made Suranadi', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 40 },
  { nisn: '0096463079', nama: 'I Nyoman Pandu Kusuma Wijaya', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 85 },
  { nisn: '0091588869', nama: 'I Putu Gede Widiardana', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 55 },
  { nisn: '0102376852', nama: 'I Putu Krishna Paramartha Putra', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 75 },
  { nisn: '0104659642', nama: 'I Wayan Bagus Aditya Prawira', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 80 },
  { nisn: '0093880799', nama: 'Jefferson Edbert Wiranata', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 75 },
  { nisn: '0099695556', nama: 'Kadek Radithya Danadyaksa', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 85 },
  { nisn: '0099660906', nama: 'Kadek Rama Adiputra', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '0108234977', nama: 'Melkior Majesta Kapu', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '3105999271', nama: 'Muhamad Kevin Akarim', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 80 },
  { nisn: '0094612522', nama: 'Ni Kadek Diah Purnama Dewi', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 55 },
  { nisn: '0106894513', nama: 'Putu Mahesa Kris Mulyana', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '3090481530', nama: 'Revan Zaelani', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 65 },
  { nisn: '3107429718', nama: 'Tristan Ibni Pratama', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 60 },
  { nisn: '3095445488', nama: 'Zala Ilal Akbar', kelas: 10, jurusan: 'PPLG', semester: 1, nilai_sts: 65 },

  // X TJKT 3
  { nisn: '20581693', nama: 'Akbar Arshavin Rosyidi', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 60 },
  { nisn: '8456156822', nama: 'Akhdan Fachri Noverta', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 50 },
  { nisn: '0097719218', nama: 'ALIEF REYFASTO SAJID', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 20 },
  { nisn: '25070530', nama: 'Alvabrian Gracia Parameswara', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 35 },
  { nisn: '0092606698', nama: 'Anak Agung Gede Gustriana', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 45 },
  { nisn: '3107696148', nama: 'Caesar Aprilio Indrayana', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 30 },
  { nisn: '0105444613', nama: 'DEWA MADE PRADIPTA UMBARA', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 10 },
  { nisn: '0101377637', nama: 'Gabriel Kenzie Salim', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 20 },
  { nisn: '0093172913', nama: 'Gede Agus Ade Hariningrat', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 20 },
  { nisn: '0108913215', nama: 'Gusti Ngurah Andhika Kusuma', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 45 },
  { nisn: '0102961118', nama: 'Ida Bagus Nyoman Semaradana Putra', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 25 },
  { nisn: '0094968806', nama: 'I Gede Adi Putra Baskara', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 40 },
  { nisn: '0104017463', nama: 'I Gede Devdan Adi Adnyana', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 70 },
  { nisn: '0101890847', nama: 'I GEDE SAMUEL OKA SETIAWAN', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 25 },
  { nisn: '0093018580', nama: 'I Kadek Indra Cahya Kartika', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 30 },
  { nisn: '0098749168', nama: 'I Komang Bagus Tegar Kusuma Putra', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 30 },
  { nisn: '0095387833', nama: 'I Komang Ian Adiwiraguna', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 40 },
  { nisn: '0103978874', nama: 'I Komang Krisna Prajasvara', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 35 },
  { nisn: '0091459598', nama: 'I Putu Bagus Sanjaya Putra', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 20 },
  { nisn: '0106465471', nama: 'I PUTUDENA SUPUTRA', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 15 },
  { nisn: '0107650527', nama: 'I Putu Gede Rista Wijaya', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 40 },
  { nisn: '0093376242', nama: 'I Putu Harris Emeraldy Parta', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 50 },
  { nisn: '0102651330', nama: 'I Putu Jagannatha', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 60 },
  { nisn: '0096501665', nama: 'I PUTU MERSA CANDRA WINATA', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 30 },
  { nisn: '0107064980', nama: 'I Putu Risky Ardian Mahaputra', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 35 },
  { nisn: '0104904942', nama: 'I Wayan Arya Wiguna Putra Penyarikan', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 15 },
  { nisn: '2092008775', nama: 'Joseph Matthew Ramschie', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 45 },
  { nisn: '0103430863', nama: 'Ketut Suardinata', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 55 },
  { nisn: '0095164886', nama: 'Made Bagas Arya Dwipayana', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 15 },
  { nisn: '2089806713', nama: 'Maxwell Brian Hosea', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 45 },
  { nisn: '0107368608', nama: 'Mohammad Virgi Satrio Rahmadian', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 30 },
  { nisn: '0108593974', nama: 'Moh. Yoga Dika Dewata', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0103035944', nama: 'Naufan Fawwas Abdillah Firdaus', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 30 },
  { nisn: '2092867780', nama: 'PROSPER CHIMECHEFULAM RICHARD UZOWULU', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0107361513', nama: 'Radoslaw Ngo', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 50 },
  { nisn: '6136345656', nama: 'RAFAEL PASCHA AGUNG', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '009141010', nama: 'Rahadian Raka Firdaus', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 70 },
  { nisn: '3104418091', nama: 'Reyhan Maulana Rifarma', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 25 },
  { nisn: '0106375407', nama: 'Sabdhy Sameydho benu', kelas: 10, jurusan: 'TJKT', semester: 1, nilai_sts: 55 },
];

// =============================================
// DATA SISWA KELAS XI (Batch 1: 3 Kelas)
// =============================================
const siswaKelas11 = [
  // XI TJKT 1 (25 siswa)
  { nisn: '0094706773', nama: 'ABI KESWARA PUTRA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 60 },
  { nisn: '0083632660', nama: 'AKBAR JAYA KUSSWARA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0093425175', nama: 'AKMA BARRA MUHAMMAD HAWWARI UTAMA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0097670762', nama: 'ANAK AGUNG PUTU GEDE JAYA NUGRAHA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 80 },
  { nisn: '0081428558', nama: 'BAGOS PRASETYO', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0085866433', nama: 'BAGUS NANDIKA PRATAMA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 85 },
  { nisn: '3081319944', nama: 'GANEVA HESA PUTRA PRADANA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0081761464', nama: 'IDA BAGUS WIDYAJAYA LAKSANA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 75 },
  { nisn: '0094718067', nama: 'I GEDE KEVIN JANU ARDIKA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 65 },
  { nisn: '0073288346', nama: 'I GEDE PASEK ARI SAPUTRA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0087235912', nama: 'I MADE EVAN JULIANTA PUTRA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 35 },
  { nisn: '0082340386', nama: 'I MADE SEMADI ARTHA YASA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 65 },
  { nisn: '0083574482', nama: 'I MADE TAMTAYANA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 60 },
  { nisn: '0096996133', nama: 'I PUTU AJUZ SUMERTHA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0091368695', nama: 'I PUTU GEDE MAHENDRA DITHA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 85 },
  { nisn: '0098022169', nama: 'I PUTU SUMANTARA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 65 },
  { nisn: '0064753283', nama: 'JOKO SATRIA PUTRA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 55 },
  { nisn: '0083514730', nama: 'KADEK CAHYA KRISNA DIARTHA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 85 },
  { nisn: '0094133297', nama: 'MUHAMMAD IZYAN DAVINO RIHI TUNGGA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0097780293', nama: 'MUHAMMAD MIRZA YAHYA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 80 },
  { nisn: '0089711395', nama: 'MUHAMMAD ZIDAN FAHMI', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 70 },
  { nisn: '0086846259', nama: 'PUTU DIMAS REDITYA PRATAMA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0081052474', nama: 'RADITYA RAMADHAN SEPTRIANSYAH', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0087228116', nama: 'REFA GENTA KAMARASTRA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0086984855', nama: 'STANLEY GIOVANI SIKU', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 70 },

  // XI PPLG 1 (30 siswa)
  { nisn: '0086352400', nama: 'ABI HU SYAHFAREL', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 95 },
  { nisn: '3082700271', nama: 'ACHMAD MARFIN PRAYOGA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '3075131447', nama: 'Andi Saputra', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 0 },
  { nisn: '0071044738', nama: 'ARIS MAULANA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '0091520255', nama: 'AZZAM SANDRIAN PUTRA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 60 },
  { nisn: '3098113733', nama: 'CHRISTIAN NAJUAR LUWISANDRO', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0083823257', nama: 'COKORDA GEDE SURYA NATHA PEMAYUN', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 95 },
  { nisn: '0091332742', nama: 'DEWA NYOMAN EGGY KURNIAWAN', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 60 },
  { nisn: '0094539109', nama: 'FAATI HANDARU WIRA ATMAJA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '0085525038', nama: 'GIGA REZKA GHAZALAH', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 80 },
  { nisn: '0099844008', nama: 'I GEDE AGUS SANDYA GINA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 65 },
  { nisn: '0096304637', nama: 'I GEDE DANAN DARMA KRESNA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 95 },
  { nisn: '0096021088', nama: 'I GUSTI NGURAH AGUNG NARARYA SURYA PRAMANA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 70 },
  { nisn: '0095335718', nama: 'I KADEK GALIH MURTIOBAMA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '0098423619', nama: 'I KADEK NGURAH YAGNA MAHADI PUTRA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 20 },
  { nisn: '0085376567', nama: 'I KADEK WIRA DARMAWAN', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0084101544', nama: 'I MADE ARNATA PRADITYA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 0 },
  { nisn: '0092585596', nama: 'I MADE PUTRA SANJAYA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0088432625', nama: 'I MADE TRISTAN HOPE FIRDAUS', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0076036881', nama: 'INDRA PURNAMA PUTRA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0089574218', nama: 'KOMANG KHANYA PARASTYA CHANDRA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 80 },
  { nisn: '0082171848', nama: 'MOH GALANG RAHMANALLAH', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '3086323790', nama: 'MUHAMMAD AZKA MIRZA AZIZI', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0092569943', nama: 'MUHAMMAD GLENN VALENTINO', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 95 },
  { nisn: '0082613699', nama: 'MUHAMMAD ZAIDAN RINALDI', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 95 },
  { nisn: '0095317056', nama: 'NI MADE AYU CITRA DEWI', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 85 },
  { nisn: '0099705906', nama: 'NI PUTU ANGGI DIARTINI', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '0085861826', nama: 'NOVANDA PUTRA NADINDA KAMAL', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 35 },
  { nisn: '0098173819', nama: 'RIDWAN DARWIN DINEJAD', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '0081735198', nama: 'VUGUH KUSUMA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },

  // XI TJKT 2 (31 siswa)
  { nisn: '0093838878', nama: 'AHMAD ADITYA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0098624583', nama: 'ANAK AGUNG GHANI KESHAWA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '3086171837', nama: 'ANGGORO BAYU SAMUDRA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 85 },
  { nisn: '0085459343', nama: 'BAGUS RADITHIA PUTRA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0099518563', nama: 'DANI RIKO SETIAWAN', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 75 },
  { nisn: '0089697068', nama: 'DHESTA DANENDRA SAJJANA PUTRA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 85 },
  { nisn: '0088972929', nama: 'DINDA ZAHRA HOIRIN NISSA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0091441555', nama: 'FARI WIRA PRATAMA SUTRISNO', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0095959147', nama: 'GABRIEL EDO PRATAMA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 80 },
  { nisn: '0089063259', nama: 'GEDE DWIKA ARTA NUGRAHA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 85 },
  { nisn: '0096269303', nama: 'GEDE PUTRA TRI PRAWIRA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 65 },
  { nisn: '0086099434', nama: 'GUSTI PUTU AGUNG SURYANATA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0097570906', nama: 'I GEDE PUTRA SURYA ATMAJA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0094728404', nama: 'I GUSTI NGURAH AGUNG NARYYAMA CANDRA PRAMANA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 80 },
  { nisn: '0095030351', nama: 'I KADEK BINTANG DARMA PUTRA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0099757682', nama: 'I KADEK FIO OKAYANA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 85 },
  { nisn: '0083676697', nama: 'I KETUT YOGA ADITYAWARMAN', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0092388637', nama: 'I KOMANG DIKA PERMANA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 80 },
  { nisn: '0092699207', nama: 'I MADE ARYA BRAMANANDA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0083181594', nama: 'I NYOMAN ANDIKA REVANANDA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0094573012', nama: 'I PUTU PARAMANANDA KRSNA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0091429669', nama: 'I PUTU SANI RENATA PUTRA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 45 },
  { nisn: '0085251754', nama: 'I WAYAN AGUS NANDA SATRIA ADINATA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0095266225', nama: 'MOHAMAD REZKI NARARIA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 80 },
  { nisn: '0098376405', nama: 'NI KADEK AYU APRILIA SAFITRI', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0082230038', nama: 'NYOMAN HERU MANDALA PUTRA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 35 },
  { nisn: '0095681138', nama: 'NYOMAN RADITYA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0093530207', nama: 'PUTU AGUS ARDIANA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0083987580', nama: 'PUTU ANDIKA LIBRIAN PUTRA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 75 },
  { nisn: '0083672161', nama: 'RIZAL RASYID EFENDI WIJAYA', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '3099035526', nama: 'RIZKY MUBAROK', kelas: 11, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },

  // XI PPLG 2 (38 siswa)
  { nisn: '3090419903', nama: 'AHMAD FEBRIANTO', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 95 },
  { nisn: '0088008922', nama: 'ALFREY AFRAN ALFAWAS', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 50 },
  { nisn: '0095919111', nama: 'ANGGI DWI PARYANDA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '0085071914', nama: 'ANISA DWIAPSARI WIRANATA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 85 },
  { nisn: '0081566999', nama: 'AYUDYA RAHMA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 95 },
  { nisn: '3095815168', nama: 'AZA KAMEL ALMIRA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 70 },
  { nisn: '3093168748', nama: 'CINDY ARISTAWATI', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 95 },
  { nisn: '0086505610', nama: 'FAJRIL HUSEIN ALMA\'RUF', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 45 },
  { nisn: '0097747039', nama: 'HUMAIRA DWI RAHMAYANI', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0083473467', nama: 'I KADEK DWI RENDRA HADI PUTRA WIDYANTARA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 60 },
  { nisn: '0093975600', nama: 'I KADEK RESKA SUPARMANTARA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 85 },
  { nisn: '3099838329', nama: 'I KADEK SAMUEL ANUGRAHA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 65 },
  { nisn: '0083768237', nama: 'I MADE DWIPAYANA PUTRA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 70 },
  { nisn: '0099244210', nama: 'INNA MELATI PUTRIYANI', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 95 },
  { nisn: '0083625084', nama: 'I NYOMAN DONY SEDANA PUTRA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 80 },
  { nisn: '0094069868', nama: 'I PUTU DHARMA WIBAWA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 55 },
  { nisn: '0095611629', nama: 'JACOB WILLMINGSON ELOHIM SEU', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 80 },
  { nisn: '0081802242', nama: 'MADE DWIKI ARTA KUSUMA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 15 },
  { nisn: '0087771249', nama: 'MADE JONATHAN HIKMAYANA SURYA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 70 },
  { nisn: '3084547843', nama: 'MUHAMMAD AZKAL FIKRI', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 60 },
  { nisn: '3076925476', nama: 'MUHAMMAD RAYHAN AKBAR', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 70 },
  { nisn: '0095767275', nama: 'NADHIFAH KARIMA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 95 },
  { nisn: '0092747738', nama: 'NAMIRA ZAHRA RAMADHANI', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 95 },
  { nisn: '0097369666', nama: 'NI GUSTI AYU PUTU TASYA PRAMESTI', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '0095918660', nama: 'NI MADE ARUM TUNGGA DEWI', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0093088123', nama: 'NI PUTU CISTA MAHARANI', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '0094813987', nama: 'NI PUTU CLARA BELLA ALVIRA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0093442957', nama: 'NI PUTU NURINA APRILIANI', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '0073988157', nama: 'NOVEGA RADIKA FARIS', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 60 },
  { nisn: '0099350084', nama: 'PUTU ARI WANGSA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 95 },
  { nisn: '0085417715', nama: 'RANA PUTRI AURELLYA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 95 },
  { nisn: '0064063135', nama: 'RISKY DIMAS MUHAMMAD FADLI', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 40 },
  { nisn: '0094572994', nama: 'SALSABILLA ALIVIA FITRI', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '3096696383', nama: 'SILVI MAHENDRA DEWI', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 80 },
  { nisn: '3095954389', nama: 'THALYTA AURORA ZAKHRA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 85 },
  { nisn: '0096142841', nama: 'WAYAN JAMIE SASTRA DIANTA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 0 },
  { nisn: '3092938213', nama: 'ZAKIYA ZULFA SYAFANI', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 65 },
  { nisn: '3089457786', nama: 'ZEZA ALIFATUL KHAIRUNNISA', kelas: 11, jurusan: 'PPLG', semester: 1, nilai_sts: 85 },

  // XI DKV (38 siswa)
  { nisn: '0088411563', nama: 'AHMAD HISBUTTAHRIL', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 80 },
  { nisn: '0084518125', nama: 'Anak Agung Wisnu Demung Darmawan', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 0 },
  { nisn: '0092849436', nama: 'AZKA ZIA HAYA', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 0 },
  { nisn: '0092849437', nama: 'CHRISTOFEL PASCAL WIBOWO', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 85 },
  { nisn: '0086500622', nama: 'DIANDRA LEVELY KHOIRUN NISSA', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 0 },
  { nisn: '0093648463', nama: 'GILANG PRATAMA', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 65 },
  { nisn: '0098252288', nama: 'GUSTI AYU PUJI ARNITI PUTRI', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '3083825900', nama: 'HANNYNDA ADZRA UFAIRA', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 70 },
  { nisn: '0086130938', nama: 'IDA AYU GEDE MAHADEWI ARTIKA', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 85 },
  { nisn: '0097824043', nama: 'IDA AYU PUTU INTAN WIDYASTUTI', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 85 },
  { nisn: '0089827782', nama: 'IDA BAGUS NGURAH PUTRA KENITEN', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 30 },
  { nisn: '0097538609', nama: 'I GEDE MARGONO ADI PUTRA', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 40 },
  { nisn: '0094381809', nama: 'I GUSTI AGUNG ISTRI AKHILA SASIKIRANA', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 55 },
  { nisn: '0097934377', nama: 'I GUSTI NGURAH AGUNG GEDE AGRAPRANA', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 95 },
  { nisn: '0098607429', nama: 'I KADEK ADITYA PRADNYANA PUTRA', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 80 },
  { nisn: '0087743950', nama: 'I KOMANG AGUS SENTANA PUTRA', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 90 },
  { nisn: '0095599188', nama: 'I KOMANG RAMA TRI PRAMANA', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '0094638925', nama: 'I PUTU ABI DHARMA PUTRA', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 80 },
  { nisn: '0087015334', nama: 'I PUTU CALVIN PURNAMANTARA', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 50 },
  { nisn: '0097587317', nama: 'JHEVO CLEAMENS JELIRA', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 90 },
  { nisn: '0098536818', nama: 'KADEK MEISYA DWI ANASTASYA PUTRI', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 0 },
  { nisn: '0093338484', nama: 'KALILA INNAYA ALMAQVIERA', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 90 },
  { nisn: '0071044394', nama: 'KHESSYA CINTIA BELLA', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '0091079908', nama: 'MAYLA BUNGA INDRIANI', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 90 },
  { nisn: '3088807563', nama: 'MITA DESI ANA LUFI', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 70 },
  { nisn: '0083177539', nama: 'MOHAMAD SULTAN MAULANA', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 80 },
  { nisn: '0085381380', nama: 'NI LUH PUTU RATIH ARIATI KEDEP', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 70 },
  { nisn: '0094076855', nama: 'NI LUH YASNI MAWAR NINGSIH', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 65 },
  { nisn: '0098593545', nama: 'NI MADE PUSPA GIRI PRADNYANI', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 55 },
  { nisn: '0095027507', nama: 'Ni Putu Maya Prashanti Widiantari', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '0081746644', nama: 'NI PUTU OKTA WIDIASIH', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 85 },
  { nisn: '0096994062', nama: 'PANDE PUTU DEVA DAFFANZARA NARAYANSYAH', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 40 },
  { nisn: '0092535855', nama: 'PUTU RATIH SEVIA DEWI', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 85 },
  { nisn: '0085415254', nama: 'RAHEINAFS WIDYANANTA MAULANA FIRDAUS', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 80 },
  { nisn: '0091318562', nama: 'SHEILA MAJID', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 65 },
  { nisn: '0089171098', nama: 'SHERIL ENGEL KLAUDIA', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 70 },
  { nisn: '0079516857', nama: 'SI NGURAH MADE DWI SANJAYA RAHARJO PUTRA', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 35 },
  { nisn: '3091081353', nama: 'STEVI TRI MITA SUCI', kelas: 11, jurusan: 'DKV', semester: 1, nilai_sts: 90 },

  // XI BD (52 siswa - termasuk BD 1 dan BD 2)
  { nisn: '3083504912', nama: 'ALAIKA IBRAHIM', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 65 },
  { nisn: '0092556057', nama: 'AL SYAH ROZI QULYUBI', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 70 },
  { nisn: '0099352767', nama: 'ANGELITA PRADEU', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 95 },
  { nisn: '0099365969', nama: 'ANISA JELITA A. NUPU', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 80 },
  { nisn: '0061200231', nama: 'ARJUNA PUTRA ROHMAN', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 0 },
  { nisn: '0086206029', nama: 'ARUM GURITNO', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 50 },
  { nisn: '0098402795', nama: 'BRINZA CAHYA MAILZA', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 70 },
  { nisn: '0088312441', nama: 'BULAN RISTY SYAKILA', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '0084623736', nama: 'DZAKY ALMER RAFIF PRASTYO', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 100 },
  { nisn: '3098377397', nama: 'ERIC KAVIN BHAKTIAN', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 100 },
  { nisn: '0095836083', nama: 'FERDINAND GUNAWAN', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 100 },
  { nisn: '3081194691', nama: 'FIA ARINA RAMADHANI', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 80 },
  { nisn: '0082303208', nama: 'HERNANDA DIAH ARTANTI', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 85 },
  { nisn: '0095741636', nama: 'I DEWA GEDE INDRA PRADNYANA', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '0096085613', nama: 'I GEDE ADITYA PRATAMA', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 0 },
  { nisn: '0094836206', nama: 'I MADE SUTIKA PRAYOGA', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '3089281115', nama: 'ISMU JIBRIL MUZAKKI', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '3093529973', nama: 'MEILANI NUR AZIJAH', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 80 },
  { nisn: '0079192084', nama: 'MESYA MASITA RAMSYA HAKIKI', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 70 },
  { nisn: '3086315442', nama: 'MICHAEL GEOFFREY CHURCHILL', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 80 },
  { nisn: '0099387831', nama: 'MOCHAMAD ROMLI', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 35 },
  { nisn: '3098747773', nama: 'MOHAMMAD RAKA MAULANA AFRIANSYAH', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 70 },
  { nisn: '0083563243', nama: 'MUHAMMAT DICKY KURNIAWAN', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '3086719066', nama: 'MUNAJAT INADSUGARA', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 100 },
  { nisn: '3095676296', nama: 'NABILA HUMAIROH ROSADI', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '0094649461', nama: 'NI NENGAH SISELIA AGUSTIN', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 95 },
  { nisn: '0088366782', nama: 'NI PUTU ANGGI CESYA WIDIAPUTRI', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 70 },
  { nisn: '0087542401', nama: 'NURUSSODEK', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 80 },
  { nisn: '0096756264', nama: 'PUTU KEDY ADNYANI', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 80 },
  { nisn: '0085009688', nama: 'PUTU KRISNANDA PUTRA', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 60 },
  { nisn: '3091612729', nama: 'RAISYA AURELIA MAHARANI', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 100 },
  { nisn: '0092092225', nama: 'RIHKASIHIMI AISLI', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 100 },
  { nisn: '3090102184', nama: 'RITA KHARISMA', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '0087563557', nama: 'STANLEY PURNAMA TANSIA', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '0089779307', nama: 'YUMEKO VALENCIA CASSIE', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 40 },
  { nisn: '0093720376', nama: 'ZENI MUHAMAD RAMDAN', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 20 },
  { nisn: '3085457121', nama: 'AKHMAD TAUFIKUL HAKIM', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 50 },
  { nisn: '0087202327', nama: 'ALDY ABDY FATHA', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 85 },
  { nisn: '0091775774', nama: 'ATTAYA GHOZALI REZA', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '0082707435', nama: 'CLARA CITRA DWI WINDARI', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 100 },
  { nisn: '0085958195', nama: 'GST AYU PUTRI CAHYARANI', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '0098224106', nama: 'IDA BAGUS MADE ANOM MANUABA', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '0092838583', nama: 'I GD BGS IVAN KUSUMA NARENDRA', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 100 },
  { nisn: '3094253006', nama: 'I GUSTI AYU DIAH SINTHA PRABASWARI', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 100 },
  { nisn: '0086463729', nama: 'I MADE DENI SARJAYA', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 75 },
  { nisn: '0091734156', nama: 'JESSICA NOVIANTI', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 95 },
  { nisn: '0081283153', nama: 'NAJWA IZZA NAILA AZZA', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 80 },
  { nisn: '0087756882', nama: 'NANSA GANI RAMADHAN', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 75 },
  { nisn: '0082307971', nama: 'NI PUTU ARIK MAHARANI WIJAYANTI', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 85 },
  { nisn: '3088004985', nama: 'SYAHRIZAL RAMLI', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 60 },
  { nisn: '0086179252', nama: 'THIARA RAMADHANI', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 85 },
  { nisn: '0089261224', nama: 'ZAKYA DINDA RAMADHANI', kelas: 11, jurusan: 'BD', semester: 1, nilai_sts: 90 },
];

// =============================================
// DATA SISWA KELAS XII
// =============================================
const siswaKelas12 = [
  // XII TJKT 1 (30 siswa)
  { nisn: '0087709756', nama: 'AUREL PUTRI ERICA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0084135691', nama: 'DANIEL RAJA ISRAEL META', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0075728237', nama: 'DAVID SURYA PRATAMA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 20 },
  { nisn: '0079692855', nama: 'FABIAN ADITYA ARNAN', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0074441467', nama: 'FIDEL FELIX WELLINGTON', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0075866692', nama: 'GUSTI BAGUS TRIADI NANDIKA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 75 },
  { nisn: '0081152691', nama: 'IDA BAGUS GEDE WAHYU WIDIATMIKA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 60 },
  { nisn: '0082182041', nama: 'IDA BAGUS MADE ADI JATI PRAMANA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0086472298', nama: 'IDA BAGUS RADITYA DWIPAYANA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0072740873', nama: 'I GEDE ADI PRASATYA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0081739531', nama: 'I GUSTI RAI PAUNDRAKARNA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0074133060', nama: 'I KOMANG GILANG ARYA PERMANA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0076419326', nama: 'I MADE ADITYA MAHESTA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0085477301', nama: 'I MADE SURYA DHARMA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0082787210', nama: 'I PUTU GEDE NANDA ASTIKA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0087492330', nama: 'I PUTU KIRTIH ANANTA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '9585271050', nama: 'I PUTU RIO ANANDA PUTRA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0089688047', nama: 'I PUTU WAHYU DIRGANTARA PUTRA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0086711108', nama: 'JHOSUA VICKY WIBOWO', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0089194384', nama: 'JUNIOR SATRIA WIJAYA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0079463289', nama: 'KADEK EDWIN WIJANA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0074674156', nama: 'MUHAMMAD RIZAL', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 70 },
  { nisn: '0073605896', nama: 'MUHAMMAD TAUFIQ HIDAYAT', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0075043383', nama: 'NICO SETYA ANDRILLIANO', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 20 },
  { nisn: '0072845775', nama: 'PAULUS KADEK NOVA ADI PURNAMA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0088044065', nama: 'PUTU CHANDRA DITYA ARIANA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0087081955', nama: 'RESTU ENGGAR WIJAYA KUSUMA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0089058213', nama: 'RIZKI FIRMANSYAH', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0078225077', nama: 'SYAILENDRA NAFFI SUHARTAWAN', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0073406753', nama: 'TEGAR DANU DARMA SAPUTRA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },

  // XII TJKT 2 (40 siswa)
  { nisn: '0083160617', nama: 'ANAK AGUNG BAGUS CAHYA DWIPAYANA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0085271152', nama: 'ANAK AGUNG MADE DWI ANTARI', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0071242103', nama: 'BACHRUL ULUM ZAINI', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 85 },
  { nisn: '0078759565', nama: 'CAHYO SAPUTRO', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0086997116', nama: 'CARLOS DARRYL XAVIER IMMANUEL', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0078300098', nama: 'CHRISTIAN BERNANDES BENU', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0087488534', nama: 'DEWA GEDE TOBY DIATMIKA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0085334501', nama: 'GEDE ARVE PUTRA KURNIAWAN', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0087440938', nama: 'GEDE ARYA SATYA DHARMA SEDANA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0087741971', nama: 'IDA BAGUS ANDIKA DWI PUTRA PIDADA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0088436984', nama: 'I GEDE ALDI NAYAKA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 85 },
  { nisn: '0073443974', nama: 'I GUSTI GEDE BAGUS LASMANA PUTRA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 85 },
  { nisn: '0089046120', nama: 'I KADEK DWIDHANA DHARMA DIVTA YASA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0073418445', nama: 'I MADE BAGUS DIVA PUTRA DINATA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0088478911', nama: 'I MADE DWI LAKSMANA PUTRA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0081214761', nama: 'I PUTU ADI YOGA PREBAWA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0089251493', nama: 'I PUTU DARMA YOGA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0078254923', nama: 'I PUTU RYAN DANA PUTRA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0088410013', nama: 'KADEK DWI ARJUNA ADITYA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0074440907', nama: 'KIVAN ADITYA SHAHAB', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0084425101', nama: 'KOMANG ARYA WIGUNA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0069443452', nama: 'MOHAMMAD FANNI RISMAWANTO', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0082130464', nama: 'MOHAMMAD IKHSAN FAJRY', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0077098162', nama: 'MUHAMMAD NABIL', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0077400269', nama: 'NABIL SETYA ABIANSYAH', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0084929245', nama: 'NI KADEK BINTANG APRILLIASTA DEVI', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0081906321', nama: 'NI KADEK VARASTRI UDAYANTI NANDA ADITI', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0071770791', nama: 'NI NYOMAN SRI PARWATI', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0079706757', nama: 'NI PUTU CITRA NATALIDYA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 85 },
  { nisn: '0086005306', nama: 'NI PUTU GALUH CAHYANI', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0081533060', nama: 'NI PUTU NADILA SUPARDAN', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0075638717', nama: 'NYOMAN REKSA ADHINATA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0086941719', nama: 'PANDE I PUTU PUTRA WIJAYA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0076295551', nama: 'PUTRA RIZKI HIDAYAT', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0079507971', nama: 'RAYYANUL ULA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0078461832', nama: 'REFADIVA MATAHARI FARIGIA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0089019636', nama: 'UBAIDILLAH', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0077997854', nama: 'WAHYU HIDAYATULLAH PRATAMA P', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 60 },
  { nisn: '0094082922', nama: 'YOHANES DAVA STRADELIN', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 0 },
  { nisn: '0088856688', nama: 'ZAHRA NABILA ADHWA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },

  // XII TJKT 3 (40 siswa)
  { nisn: '0095043988', nama: 'ACHMAD GOJALI WIBOWO', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0075914318', nama: 'AUREL RADINA PUTRI', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0088872792', nama: 'AURORA MUHAMMAD YUSUF IBRAHIM', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0064616558', nama: 'BINTI HABIBATUS SANIYAH', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 80 },
  { nisn: '0076295100', nama: 'DEVA FEBRIAN ARINATA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 80 },
  { nisn: '0078886108', nama: 'GUSTI BAYU ARTA ADIPUTRA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0077303301', nama: 'I GUSTI NGURAH BAGUS SATRIA YUDHANA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 80 },
  { nisn: '0076752230', nama: 'I KADEK DEVA SETYAWAN PUTRA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0085777321', nama: 'I KADEK FARREL ANANTA WIJAYA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0089325896', nama: 'I KADEK RAMA PUTRA WENDRANATA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0079594647', nama: 'I KETUT ODE DIASTYA DARSANA PUTRA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0083836712', nama: 'I KOMANG ADITYA PUTRA MAHENDRA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0083693619', nama: 'I KOMANG AGASTYA DHIVAYANA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0083866982', nama: 'I MADE EVAN ADITIYA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0087668058', nama: 'I MADE EVAN LEO ANANDA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0071967875', nama: 'I MADE PRANA DIVA YOGA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 85 },
  { nisn: '0081683404', nama: 'I MADE WISNU SABDA HUTAMA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0087599411', nama: 'I NYOMAN SURYAWANDANA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0081894784', nama: 'I NYOMAN YOGA ANDIKA SETYAWAN', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0074727496', nama: 'I PUTU FAJAR RANDIKA ASTRAWAN', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0078566451', nama: 'I PUTU RAMA ADITYA WIDHIANTARA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0076286309', nama: 'JHON ZENIUS BENEDIKTUS SURI', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0077067388', nama: 'KEVIN ZAIDAN', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0082976917', nama: 'LIONEL CRISTIAN TIMOTHY', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0082630642', nama: 'MADE YUNA CELSY PRATIWI', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0071468161', nama: 'MOHAMAT RIFA\'I', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0077250113', nama: 'MOHAMMAD ALFIANNUR ROZIQ', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0084099587', nama: 'MUHAMMAD ALIF PRATAMA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0082777182', nama: 'MUHAMMAD RAIHAN PRATAMA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0083840189', nama: 'NI MADE PADMA AYU MAHARANI', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0085758789', nama: 'NI PUTU AYU BIDIANTARI ASTUTI', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0089490132', nama: 'NI PUTU DESY ARTHASARI', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0086903995', nama: 'NI WAYAN ASIH PRADNYA DEWI', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0085338878', nama: 'NYOMAN REZKY SEDATA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0076077492', nama: 'PANDU SURYA ATMAJA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0075468036', nama: 'RAHUL AL BUHORI', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0082083221', nama: 'RISWAN SISWORO HALIM', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },
  { nisn: '0074809045', nama: 'YOSEF GERRIT DV', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 90 },
  { nisn: '0084759472', nama: 'YUDIASTA', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 100 },
  { nisn: '0086923182', nama: 'ZERLINDA RAJNI DANICA CHOZIN', kelas: 12, jurusan: 'TJKT', semester: 1, nilai_sts: 95 },

  // XII PPLG 1 (39 siswa)
  { nisn: '0066032762', nama: 'ACHMAD SYAIFULLAH', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 95 },
  { nisn: '0077201365', nama: 'ALVERA SYAIFA DINA', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 0 },
  { nisn: '0089859383', nama: 'ANINDYA HASNA AQILAH', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0083202795', nama: 'ARIES PUTRA NABILA', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0083957435', nama: 'DEWI ARIS MAHARANI', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0075148574', nama: 'DHINI NATA SURYA PUTRI RIMIN', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 65 },
  { nisn: '0079100780', nama: 'EVAN INDRA PRATAMA', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '3074330361', nama: 'GILBRAN DWI LESMANA', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0084363586', nama: 'GUSTI AGUNG AYU CINTA KASIH MAHADEWI', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0073868348', nama: 'I KADEK DEXZA PRADNYANA KUSUMA', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0074153760', nama: 'I KETUT AGUS GIRINATHA ABHIRAMA', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 65 },
  { nisn: '0074322487', nama: 'I KOMANG RISKI', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0085898947', nama: 'I MADE DWIKA SAPUTRA', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0087806804', nama: 'I PUTU BAGUS ANANTA KUSUMA', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 0 },
  { nisn: '0077520178', nama: 'KADEK DINDA AMANDA PUTRI', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0071922707', nama: 'KADEK EDY SETIAWAN', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '0076506369', nama: 'KESYA ADRIENA LESTARI', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0073305968', nama: 'KEVIN ADITYA SHAHAB', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0084169884', nama: 'KHAILA AMAR', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 85 },
  { nisn: '0083729983', nama: 'KOMANG DANUAJI ADNYANA', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 0 },
  { nisn: '0087511160', nama: 'LEVIANO KURNIAWAN', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0072014336', nama: 'MADE OCTA PRADNYA PUTRA', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0076573655', nama: 'MUHAMAD EGI SYAHID FIRMANSYAH', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 45 },
  { nisn: '0074333578', nama: 'NABILA NURRAHMALIA', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 0 },
  { nisn: '0074818384', nama: 'NGURAH KADEK ABHY KRISHNA MARDANA', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 95 },
  { nisn: '0084535277', nama: 'NI KADEK DIAH WULANDARI', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '0087308145', nama: 'NI KOMANG AYU SUANDANI', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0082283132', nama: 'NI PUTU GHITA DWIRAMAWASTI', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0089783937', nama: 'NI PUTU NOELLA JANUSTYA ARINDINI', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 0 },
  { nisn: '0079181690', nama: 'PUTU BAYU WIDYANTARA', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 85 },
  { nisn: '0076411264', nama: 'PUTU DHIYO SANZANA', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '0082729666', nama: 'PUTU ESA RADITYA', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0076687406', nama: 'RACHEL NATHANIA BUDIONO', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 0 },
  { nisn: '0077847158', nama: 'RENI RIANTI', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 75 },
  { nisn: '0071888334', nama: 'REVAN DAVI RACHMADHANI', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 90 },
  { nisn: '0085080183', nama: 'RIZKY WAHYU PRAMUDYA', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 0 },
  { nisn: '0084280257', nama: 'SELVIANA CHANDRA DEWI', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 100 },
  { nisn: '0072716413', nama: 'WAHYU SATRIO ANDIKA', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 0 },
  { nisn: '0078869224', nama: 'ZALKY NUR MUHAMMAD ADRIAN PUTRA', kelas: 12, jurusan: 'PPLG', semester: 1, nilai_sts: 95 },

  // XII DKV (40 siswa)
  { nisn: '0088602919', nama: 'ADAM ADITYA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '0088042657', nama: 'AFGHANI ILHAM RIZQI ZARKASI', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 75 },
  { nisn: '0075332806', nama: 'AHMAD RANGGI SAPUTRA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 85 },
  { nisn: '0075535189', nama: 'AHMAD RIZQI DIKA ARDIANSYAH', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 95 },
  { nisn: '0077270289', nama: 'ALIF PUTRA AKBAR', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 90 },
  { nisn: '0086210003', nama: 'ALOISIUS KADEK DIKA PRAMANA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '0074734818', nama: 'ANANDA ADITYA SAPUTRA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '3060616958', nama: 'ARI SETIAWAN', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 80 },
  { nisn: '0084361920', nama: 'CLARISA ROSSMEYLINDA PUTRI', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 95 },
  { nisn: '0088452527', nama: 'CLAUDYA SELLA IFFANIA PERMADANI', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 75 },
  { nisn: '3082011928', nama: 'FEBY EKA AULIA PUTRI KOUNTUR', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '0085027043', nama: 'GRACIA PUTU YUANDA WIJAYA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '0082246916', nama: 'I GEDE KOMANG SATRIA PALGUNA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '0081753091', nama: 'I GUSTI NGURAH AGUNG GALANG SURYA BUWANA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 95 },
  { nisn: '0089820362', nama: 'I KADEK SONY AMBARA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 90 },
  { nisn: '0072108624', nama: 'I KADEK WILLYANTARA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '0088736948', nama: 'I KOMANG ANDIKA PRADITHYA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 80 },
  { nisn: '0076460330', nama: 'I KOMANG GEDE RANGGA RADJ PRATAMA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '0082531650', nama: 'I KOMANG YUDIT SAPUTRA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 90 },
  { nisn: '0075462745', nama: 'I NYOMAN DIPTA PRASETYA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '0076713658', nama: 'I PUTU ADIT CAHYADI', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 85 },
  { nisn: '0072349343', nama: 'I PUTU DANAN JAYA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 90 },
  { nisn: '0087942441', nama: 'I PUTU GANESH OCEAN PUTRA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '0086370196', nama: 'IQBAL FEBRIANTHONI', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '0091841949', nama: 'ISABELLA JASMINE AZ ZAHRA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '0081003137', nama: 'KEENAN KHRISNA MAJID', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 95 },
  { nisn: '0089954135', nama: 'KHANSA SAFFA KAMILA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 90 },
  { nisn: '0072714828', nama: 'LAURA TARA GEMINTANG', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '0082324216', nama: 'MERRY HAPPY SKYLLA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 90 },
  { nisn: '0089246151', nama: 'MISTY', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '0074039630', nama: 'MUHAMMAD KHALID AL FIRDAUS', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 90 },
  { nisn: '0083063396', nama: 'NI LUH SINTA ARIANI PUTRI', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 95 },
  { nisn: '0081559076', nama: 'NI MADE NANIK DWI ANTARI', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 95 },
  { nisn: '0083948752', nama: 'NI PUTU PANDE ANGEL', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '0079308650', nama: 'NURHIDAYAH', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '0073130252', nama: 'NYOMAN ARJUN TUDUNG PRIYANGGA PUTRA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 85 },
  { nisn: '0073582506', nama: 'PUTU PRISKA PRATIWI', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 100 },
  { nisn: '0072993831', nama: 'QUEENNA RAHMA NATSIR', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 60 },
  { nisn: '3078778486', nama: 'RAKHA ADYATAMA KURNIA PUTRA', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 95 },
  { nisn: '0075338845', nama: 'YAYA MATSUO', kelas: 12, jurusan: 'DKV', semester: 1, nilai_sts: 100 },

  // XII BD (40 siswa)
  { nisn: '0088602920', nama: 'ABDUL AZIZ', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 95 },
  { nisn: '0088042658', nama: 'ADITYA PRATAMA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '0075332807', nama: 'AHMAD FAUZI', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 85 },
  { nisn: '0075535190', nama: 'ALDIANSYAH', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 100 },
  { nisn: '0077270290', nama: 'ANDIKA PUTRA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 95 },
  { nisn: '0086210004', nama: 'ANGGA PRAMANA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '0074734819', nama: 'ARDIANSYAH', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 100 },
  { nisn: '3060616959', nama: 'BAGUS SETIAWAN', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 85 },
  { nisn: '0084361921', nama: 'BAYU SAPUTRA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 95 },
  { nisn: '0088452528', nama: 'CAHYA PERMADANI', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '3082011929', nama: 'DANANG PUTRA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 100 },
  { nisn: '0085027044', nama: 'DEWI WIJAYA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 95 },
  { nisn: '0082246917', nama: 'DONI PALGUNA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '0081753092', nama: 'EKO SURYA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 100 },
  { nisn: '0089820363', nama: 'FAJAR AMBARA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 85 },
  { nisn: '0072108625', nama: 'GALANG WILLY', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 95 },
  { nisn: '0088736949', nama: 'HADI PRADITHYA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '0076460331', nama: 'INDRA PRATAMA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 100 },
  { nisn: '0082531651', nama: 'JOKO SAPUTRA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 85 },
  { nisn: '0075462746', nama: 'KURNIA PRASETYA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 95 },
  { nisn: '0076713659', nama: 'LUKMAN CAHYADI', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '0072349344', nama: 'MAHENDRA JAYA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 100 },
  { nisn: '0087942442', nama: 'NUGROHO PUTRA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 85 },
  { nisn: '0086370197', nama: 'PANJI FEBRIAN', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 95 },
  { nisn: '0091841950', nama: 'PUTRI AZAHRA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '0081003138', nama: 'RAFI MAJID', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 100 },
  { nisn: '0089954136', nama: 'SARI KAMILA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 85 },
  { nisn: '0072714829', nama: 'SETIAWAN GEMINTANG', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 95 },
  { nisn: '0082324217', nama: 'SULISTYO SKYLLA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '0089246152', nama: 'TAMARA MISTY', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 100 },
  { nisn: '0074039631', nama: 'UJANG FIRDAUS', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 85 },
  { nisn: '0083063397', nama: 'VINA ARIANI', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 95 },
  { nisn: '0081559077', nama: 'WAHYU ANTARI', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '0083948753', nama: 'YUDI ANGEL', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 100 },
  { nisn: '0079308651', nama: 'ZAINA HIDAYAH', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 85 },
  { nisn: '0073130253', nama: 'ZULFA PRIYANGGA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 95 },
  { nisn: '0073582507', nama: 'ZULFA PRATIWI', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 90 },
  { nisn: '0072993832', nama: 'ZULFA NATSIR', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 100 },
  { nisn: '3078778487', nama: 'ZULFA KURNIA', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 85 },
  { nisn: '0075338846', nama: 'ZULFA MATSUO', kelas: 12, jurusan: 'BD', semester: 1, nilai_sts: 95 },
];

// Helper functions
function generatePassword(name: string): string {
  // Password: FirstName + "123"  
  const firstName = name.split(' ')[0].toLowerCase();
  return firstName + '123';
}

function calculateXPFromScore(score: number): number {
  // Konversi nilai ke XP: nilai 100 = 500 XP, skala linear
  return Math.floor((score / 100) * 500);
}

function determineLeague(avgScore: number): string {
  if (avgScore >= 90) return 'diamond';
  if (avgScore >= 80) return 'platinum';
  if (avgScore >= 70) return 'gold';
  if (avgScore >= 60) return 'silver';
  return 'bronze';
}

function generateStreak(): number {
  // Random streak 0-30 hari
  return Math.floor(Math.random() * 31);
}

function generateLevel(xp: number): number {
  // Setiap 1000 XP = 1 level
  return Math.floor(xp / 1000) + 1;
}

// =============================================
// MAIN SEEDING LOGIC
// =============================================

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/adapti_portal');
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function clearDatabase() {
  console.log('\n🗑️  Clearing existing data...');
  await Promise.all([
    UserModel.deleteMany({ email: { $regex: '@smktiglobal.sch.id$|@student.smktiglobal.sch.id$' } }),
    SchoolModel.deleteMany({ $or: [{ schoolName: schoolData.name }, { email: schoolData.email }] }),
    ClassModel.deleteMany({ schoolName: schoolData.name }),
    SubjectModel.deleteMany({ school: { $exists: true } }),
  ]);
  console.log('✓ Database cleared');
}

async function seedSchoolOwner() {
  console.log('\n👤 Creating school owner (temporary)...');
  
  const hashedPassword = await bcrypt.hash('made123', 10);
  
  const owner = await UserModel.create({
    name: 'I Made Indra Aribawa, SH',
    email: 'kepala.sekolah@smktiglobal.sch.id',
    passwordHash: hashedPassword,
    role: 'school_owner',
    isSchoolOwner: true,
  });
  
  console.log(`✓ School owner created (temporary): ${owner.name}`);
  return owner;
}

async function seedSchool(ownerId: mongoose.Types.ObjectId) {
  console.log('\n🏫 Creating school...');
  
  const school = await SchoolModel.create({
    schoolName: schoolData.name,
    address: schoolData.address,
    city: 'Badung',
    province: 'Bali',
    phone: schoolData.phone,
    email: schoolData.email,
    website: schoolData.website,
    owner: ownerId,
    ownerName: 'I Made Indra Aribawa, SH',
    ownerEmail: 'kepala.sekolah@smktiglobal.sch.id',
    schoolTypes: ['SMK'],
    schoolType: 'SMK',
    smkMajors: [
      { code: 'TJKT', name: 'Teknik Jaringan Komputer dan Telekomunikasi', description: 'Kompetensi keahlian yang mempelajari tentang jaringan komputer dan telekomunikasi' },
      { code: 'PPLG', name: 'Pengembangan Perangkat Lunak dan Gim', description: 'Kompetensi keahlian yang mempelajari tentang pemrograman dan pengembangan software' },
      { code: 'DKV', name: 'Desain Komunikasi Visual', description: 'Kompetensi keahlian yang mempelajari tentang desain grafis dan multimedia' },
      { code: 'BD', name: 'Bisnis Digital', description: 'Kompetensi keahlian yang mempelajari tentang e-commerce dan digital marketing' },
    ],
    totalClasses: 0,
    totalTeachers: 0,
    totalStudents: 0,
    academicYear: '2025/2026',
    subscriptionPlan: 'premium',
    subscriptionStatus: 'active',
    isActive: true,
  });
  
  console.log(`✓ School created: ${school.schoolName}`);
  return school;
}

async function updateSchoolOwner(ownerId: mongoose.Types.ObjectId, schoolId: mongoose.Types.ObjectId) {
  console.log('\n🔄 Updating school owner with school reference...');
  
  await UserModel.findByIdAndUpdate(ownerId, {
    school: schoolId,
    schoolId: 'SCH-00001', // Add the schoolId string
    schoolName: schoolData.name,
    ownedSchool: schoolId,
  });
  
  console.log('✓ School owner updated');
}

// Generate siswa dummy untuk kelas XI dan XII
function generateStudents(grade: number, major: string, count: number, startNISN: number) {
  const students = [];
  const firstNames = [
    'Adi', 'Agung', 'Bagus', 'Bayu', 'Dewa', 'Gede', 'Kadek', 'Komang', 'Made', 'Putu', 'Wayan',
    'Ayu', 'Dewi', 'Komang', 'Luh', 'Ni', 'Putri', 'Sari', 'Sri', 'Wayan', 'Kadek'
  ];
  const lastNames = [
    'Adiputra', 'Adnyana', 'Ardana', 'Artawan', 'Dharma', 'Mahendra', 'Pratama', 'Saputra', 'Wijaya', 'Wiranata',
    'Anggraeni', 'Cahyani', 'Dewanti', 'Lestari', 'Pramesti', 'Pratiwi', 'Saraswati', 'Suryani', 'Utami', 'Wulandari'
  ];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const nisn = String(startNISN + i).padStart(10, '0');
    let score;
    
    // Kelas lebih tinggi rata-rata nilai lebih baik
    if (grade === 12) {
      score = Math.floor(Math.random() * 40) + 60; // 60-100
    } else if (grade === 11) {
      score = Math.floor(Math.random() * 45) + 50; // 50-95
    } else {
      score = Math.floor(Math.random() * 60) + 40; // 40-100
    }
    
    students.push({
      nisn,
      nama: `${firstName} ${lastName}`,
      kelas: grade,
      jurusan: major,
      semester: grade === 12 ? 5 : grade === 11 ? 3 : 1,
      nilai_sts: score
    });
  }
  
  return students;
}

async function seedTeachers(schoolId: mongoose.Types.ObjectId) {
  console.log('\n👨‍🏫 Creating teachers...');
  
  const teacherDocs = await Promise.all(
    teachers.map(async (teacher) => {
      const hashedPassword = await bcrypt.hash(generatePassword(teacher.name), 10);
      
      return {
        name: teacher.name,
        email: teacher.email,
        passwordHash: hashedPassword,
        role: 'teacher',
        school: schoolId,
        schoolName: schoolData.name,
        teacherProfile: {
          employeeId: teacher.nip,
          subjects: teacher.subjects,
          subjectRefs: [],
          classes: [],
          classIds: [],
        },
      };
    })
  );
  
  const createdTeachers = await UserModel.insertMany(teacherDocs);
  console.log(`✓ Created ${createdTeachers.length} teachers`);
  return createdTeachers;
}

async function seedClasses(schoolId: mongoose.Types.ObjectId) {
  console.log('\n🎓 Creating classes...');
  
  const majorNames: Record<string, string> = {
    'TJKT': 'Teknik Jaringan Komputer dan Telekomunikasi',
    'PPLG': 'Pengembangan Perangkat Lunak dan Gim',
    'DKV': 'Desain Komunikasi Visual',
    'BD': 'Bisnis Digital',
  };
  
  const classData = [
    // Kelas X (7 kelas - TJKT hanya 2)
    { name: 'X TJKT 1', grade: 10, section: '1', major: 'TJKT', maxStudents: 40 },
    { name: 'X TJKT 2', grade: 10, section: '2', major: 'TJKT', maxStudents: 40 },
    { name: 'X PPLG 1', grade: 10, section: '1', major: 'PPLG', maxStudents: 40 },
    { name: 'X PPLG 2', grade: 10, section: '2', major: 'PPLG', maxStudents: 40 },
    { name: 'X DKV', grade: 10, section: '1', major: 'DKV', maxStudents: 40 },
    { name: 'X BD', grade: 10, section: '1', major: 'BD', maxStudents: 40 },
    { name: 'X TJKT 3', grade: 10, section: '3', major: 'TJKT', maxStudents: 40 },
    
    // Kelas XI (7 kelas)
    { name: 'XI TJKT 1', grade: 11, section: '1', major: 'TJKT', maxStudents: 40 },
    { name: 'XI TJKT 2', grade: 11, section: '2', major: 'TJKT', maxStudents: 40 },
    { name: 'XI PPLG 1', grade: 11, section: '1', major: 'PPLG', maxStudents: 40 },
    { name: 'XI PPLG 2', grade: 11, section: '2', major: 'PPLG', maxStudents: 40 },
    { name: 'XI DKV', grade: 11, section: '1', major: 'DKV', maxStudents: 40 },
    { name: 'XI BD', grade: 11, section: '1', major: 'BD', maxStudents: 40 },
    { name: 'XI TJKT 3', grade: 11, section: '3', major: 'TJKT', maxStudents: 40 },
    
    // Kelas XII (7 kelas)
    { name: 'XII TJKT 1', grade: 12, section: '1', major: 'TJKT', maxStudents: 40 },
    { name: 'XII TJKT 2', grade: 12, section: '2', major: 'TJKT', maxStudents: 40 },
    { name: 'XII PPLG 1', grade: 12, section: '1', major: 'PPLG', maxStudents: 40 },
    { name: 'XII PPLG 2', grade: 12, section: '2', major: 'PPLG', maxStudents: 40 },
    { name: 'XII DKV', grade: 12, section: '1', major: 'DKV', maxStudents: 40 },
    { name: 'XII BD', grade: 12, section: '1', major: 'BD', maxStudents: 40 },
    { name: 'XII TJKT 3', grade: 12, section: '3', major: 'TJKT', maxStudents: 40 },
  ];
  
  const classDocs = classData.map((c, idx) => ({
    classId: `SMK-${schoolId.toString().slice(-6)}-${c.major}-${c.grade}-${c.section}`,
    className: c.name,
    grade: c.grade,
    section: c.section,
    school: schoolId,
    schoolId: schoolId.toString(),
    schoolName: schoolData.name,
    schoolType: 'SMK' as const,
    majorCode: c.major,
    majorName: majorNames[c.major],
    displayName: `Kelas ${c.name}`,
    shortName: c.name,
    academicYear: '2025/2026',
    maxStudents: c.maxStudents,
    currentStudents: 0,
    subjectTeachers: [],
    isActive: true,
  }));
  
  const createdClasses = await ClassModel.insertMany(classDocs);
  console.log(`✓ Created ${createdClasses.length} classes`);
  return createdClasses;
}

async function seedStudents(schoolId: mongoose.Types.ObjectId, classes: any[]) {
  console.log('\n👨‍🎓 Creating students...');
  
  try {
    // Combine all students
    const allStudents = [...siswaKelas10, ...siswaKelas11, ...siswaKelas12];
    
    // Group students by grade and major
    const studentsByGradeAndMajor: Record<string, any[]> = {};
    
    allStudents.forEach(siswa => {
      const key = `${siswa.kelas}-${siswa.jurusan}`;
      if (!studentsByGradeAndMajor[key]) {
        studentsByGradeAndMajor[key] = [];
      }
      studentsByGradeAndMajor[key].push(siswa);
    });
    
    console.log('Students grouped by grade-major:', Object.keys(studentsByGradeAndMajor));
    console.log('Group sizes:', Object.fromEntries(Object.entries(studentsByGradeAndMajor).map(([k, v]) => [k, v.length])));
    // Extra debug for XII
    Object.entries(studentsByGradeAndMajor).forEach(([key, arr]) => {
      if (key.startsWith('12-')) {
        console.log(`DEBUG: XII students group key: ${key}, count: ${arr.length}`);
      }
    });
    
    const studentDocs = [];
  
  // Group classes by grade and major to distribute students evenly
  const classesByGradeAndMajor: Record<string, any[]> = {};
  classes.forEach(cls => {
    const key = `${cls.grade}-${cls.majorCode}`;
    if (!classesByGradeAndMajor[key]) {
      classesByGradeAndMajor[key] = [];
    }
    classesByGradeAndMajor[key].push(cls);
  });
  
  console.log('Classes grouped by grade-major:', Object.keys(classesByGradeAndMajor));
  console.log('Class group sizes:', Object.fromEntries(Object.entries(classesByGradeAndMajor).map(([k, v]) => [k, v.length])));
  // Extra debug for XII
  Object.entries(classesByGradeAndMajor).forEach(([key, arr]) => {
    if (key.startsWith('12-')) {
      console.log(`DEBUG: XII classes group key: ${key}, count: ${arr.length}`);
    }
  });
  
  for (const [key, classGroup] of Object.entries(classesByGradeAndMajor)) {
    const studentsForMajor = studentsByGradeAndMajor[key] || [];
    const numClasses = classGroup.length;
    const studentsPerClass = numClasses > 0 ? Math.floor(studentsForMajor.length / numClasses) : 0;
    const remainder = numClasses > 0 ? studentsForMajor.length % numClasses : 0;

    if (key.startsWith('12-')) {
      console.log(`DEBUG: Processing XII key ${key}: ${studentsForMajor.length} students, ${numClasses} classes, ${studentsPerClass} per class, remainder ${remainder}`);
    }

    let studentIndex = 0;
    let docsForThisGroup = 0;

    for (let i = 0; i < numClasses; i++) {
      const cls = classGroup[i];
      const numStudentsForThisClass = studentsPerClass + (i < remainder ? 1 : 0);
      const classStudents = studentsForMajor.slice(studentIndex, studentIndex + numStudentsForThisClass);

      if (key.startsWith('12-')) {
        console.log(`DEBUG: XII Class ${cls.className}: ${numStudentsForThisClass} students, studentIndex ${studentIndex}`);
      }

      let rollNumber = 1;
      for (const siswa of classStudents) {
        const hashedPassword = await bcrypt.hash(generatePassword(siswa.nama), 10);
        const xp = calculateXPFromScore(siswa.nilai_sts);
        const level = generateLevel(xp);
        const streak = generateStreak();
        const league = determineLeague(siswa.nilai_sts);

        studentDocs.push({
          name: siswa.nama,
          email: `${siswa.nisn}@student.smktiglobal.sch.id`,
          passwordHash: hashedPassword,
          role: 'student',
          school: schoolId,
          schoolName: schoolData.name,
          class: cls._id,
          className: cls.className,
          classId: cls._id.toString(),
          rollNumber: rollNumber++,
          studentId: siswa.nisn,
          studentProfile: {
            currentGrade: 'SMK',
            currentClass: siswa.kelas,
            currentSemester: siswa.semester,
            major: cls.majorCode,
            onboardingComplete: true,
          },
          // Gamification
          xp,
          weeklyXP: Math.floor(xp * 0.3), // 30% dari total XP
          level,
          streak,
          bestStreak: streak + Math.floor(Math.random() * 10),
          league,
          gems: Math.floor(Math.random() * 500),
          hearts: 5,
        });
        docsForThisGroup++;
      }

      studentIndex += numStudentsForThisClass;
    }
    
    console.log(`DEBUG: Created ${docsForThisGroup} student docs for group ${key}`);
  }
  
  console.log(`DEBUG: Total studentDocs created: ${studentDocs.length}`);
  const createdStudents = await UserModel.insertMany(studentDocs);
  console.log(`✓ Created ${createdStudents.length} students`);
  return createdStudents;
  } catch (error) {
    console.error('❌ Error in seedStudents:', error);
    throw error;
  }
}

async function assignTeachersToClasses(teachers: any[], classes: any[], subjects: any[]) {
  console.log('\n👨‍🏫 Assigning teachers to classes...');
  
  // Create subject mapping for easier lookup
  const subjectMap: Record<string, any> = {};
  subjects.forEach(subject => {
    subjectMap[subject.name] = subject;
  });
  
  // Create teacher mapping by subject
  const teachersBySubject: Record<string, any[]> = {};
  teachers.forEach(teacher => {
    teacher.teacherProfile.subjects.forEach((subjectName: string) => {
      if (!teachersBySubject[subjectName]) {
        teachersBySubject[subjectName] = [];
      }
      teachersBySubject[subjectName].push(teacher);
    });
  });
  
  // Assign teachers to classes
  for (const cls of classes) {
    const classTeachers: any[] = [];
    
    // Assign subject teachers based on class major
    if (cls.majorCode === 'TJKT') {
      // For TJKT classes, assign Jaringan Komputer and Sistem Operasi teachers
      const jarkomTeachers = teachersBySubject['Jaringan Komputer'] || [];
      const sysopTeachers = teachersBySubject['Sistem Operasi'] || [];
      
      if (jarkomTeachers.length > 0) {
        const teacher = jarkomTeachers[Math.floor(Math.random() * jarkomTeachers.length)];
        classTeachers.push({
          teacher: teacher._id,
          subject: subjectMap['Jaringan Komputer']?._id,
          subjectName: 'Jaringan Komputer',
          teacherName: teacher.name,
        });
      }
      
      if (sysopTeachers.length > 0) {
        const teacher = sysopTeachers[Math.floor(Math.random() * sysopTeachers.length)];
        classTeachers.push({
          teacher: teacher._id,
          subject: subjectMap['Sistem Operasi']?._id,
          subjectName: 'Sistem Operasi',
          teacherName: teacher.name,
        });
      }
    } else if (cls.majorCode === 'PPLG') {
      // For PPLG classes, assign Pemrograman Web and Algoritma teachers
      const pwebTeachers = teachersBySubject['Pemrograman Web'] || [];
      const algoTeachers = teachersBySubject['Algoritma'] || [];
      
      if (pwebTeachers.length > 0) {
        const teacher = pwebTeachers[Math.floor(Math.random() * pwebTeachers.length)];
        classTeachers.push({
          teacher: teacher._id,
          subject: subjectMap['Pemrograman Web']?._id,
          subjectName: 'Pemrograman Web',
          teacherName: teacher.name,
        });
      }
      
      if (algoTeachers.length > 0) {
        const teacher = algoTeachers[Math.floor(Math.random() * algoTeachers.length)];
        classTeachers.push({
          teacher: teacher._id,
          subject: subjectMap['Algoritma']?._id,
          subjectName: 'Algoritma',
          teacherName: teacher.name,
        });
      }
    } else if (cls.majorCode === 'DKV') {
      // For DKV classes, assign Desain Grafis and Fotografi teachers
      const desgrafTeachers = teachersBySubject['Desain Grafis'] || [];
      const fotoTeachers = teachersBySubject['Fotografi'] || [];
      
      if (desgrafTeachers.length > 0) {
        const teacher = desgrafTeachers[Math.floor(Math.random() * desgrafTeachers.length)];
        classTeachers.push({
          teacher: teacher._id,
          subject: subjectMap['Desain Grafis']?._id,
          subjectName: 'Desain Grafis',
          teacherName: teacher.name,
        });
      }
      
      if (fotoTeachers.length > 0) {
        const teacher = fotoTeachers[Math.floor(Math.random() * fotoTeachers.length)];
        classTeachers.push({
          teacher: teacher._id,
          subject: subjectMap['Fotografi']?._id,
          subjectName: 'Fotografi',
          teacherName: teacher.name,
        });
      }
    } else if (cls.majorCode === 'BD') {
      // For BD classes, assign E-Commerce and Digital Marketing teachers
      const ecomTeachers = teachersBySubject['E-Commerce'] || [];
      const digmarkTeachers = teachersBySubject['Digital Marketing'] || [];
      
      if (ecomTeachers.length > 0) {
        const teacher = ecomTeachers[Math.floor(Math.random() * ecomTeachers.length)];
        classTeachers.push({
          teacher: teacher._id,
          subject: subjectMap['E-Commerce']?._id,
          subjectName: 'E-Commerce',
          teacherName: teacher.name,
        });
      }
      
      if (digmarkTeachers.length > 0) {
        const teacher = digmarkTeachers[Math.floor(Math.random() * digmarkTeachers.length)];
        classTeachers.push({
          teacher: teacher._id,
          subject: subjectMap['Digital Marketing']?._id,
          subjectName: 'Digital Marketing',
          teacherName: teacher.name,
        });
      }
    }
    
    // Assign home room teacher (random teacher for each class)
    const randomTeacher = teachers[Math.floor(Math.random() * teachers.length)];
    cls.homeRoomTeacher = randomTeacher._id;
    cls.homeRoomTeacherName = randomTeacher.name;
    
    // Update class with subject teachers
    cls.subjectTeachers = classTeachers;
    
    // Update teachers with assigned classes
    classTeachers.forEach((assignment: any) => {
      const teacher = teachers.find(t => t._id.equals(assignment.teacher));
      if (teacher) {
        if (!teacher.teacherProfile.classes) {
          teacher.teacherProfile.classes = [];
        }
        if (!teacher.teacherProfile.classIds) {
          teacher.teacherProfile.classIds = [];
        }
        
        // Add class to teacher's profile if not already added
        if (!teacher.teacherProfile.classes.some((c: any) => c._id && c._id.equals(cls._id))) {
          teacher.teacherProfile.classes.push({
            _id: cls._id,
            classId: cls.classId,
            className: cls.className,
            grade: cls.grade,
            major: cls.majorCode,
          });
          teacher.teacherProfile.classIds.push(cls._id);
        }
      }
    });
    
    // Also add home room teacher assignment
    if (!randomTeacher.teacherProfile.classes) {
      randomTeacher.teacherProfile.classes = [];
    }
    if (!randomTeacher.teacherProfile.classIds) {
      randomTeacher.teacherProfile.classIds = [];
    }
    
    if (!randomTeacher.teacherProfile.classes.some((c: any) => c._id && c._id.equals(cls._id))) {
      randomTeacher.teacherProfile.classes.push({
        _id: cls._id,
        classId: cls.classId,
        className: cls.className,
        grade: cls.grade,
        major: cls.majorCode,
      });
      randomTeacher.teacherProfile.classIds.push(cls._id);
    }
  }
  
  // Save updated classes
  await Promise.all(classes.map(cls => cls.save()));
  
  // Save updated teachers
  await Promise.all(teachers.map(teacher => teacher.save()));
  
  console.log(`✓ Assigned teachers to ${classes.length} classes`);
}

async function seedSubjects(schoolId: mongoose.Types.ObjectId) {
  console.log('\n📚 Creating subjects...');
  
  const subjectData = [
    { code: 'MAT', name: 'Matematika', category: 'WAJIB', description: 'Matematika untuk SMK' },
    { code: 'IND', name: 'Bahasa Indonesia', category: 'WAJIB', description: 'Bahasa Indonesia' },
    { code: 'ING', name: 'Bahasa Inggris', category: 'WAJIB', description: 'Bahasa Inggris' },
    { code: 'PKN', name: 'PKn', category: 'WAJIB', description: 'Pendidikan Kewarganegaraan' },
    { code: 'PJOK', name: 'PJOK', category: 'WAJIB', description: 'Pendidikan Jasmani' },
    // TJKT
    { code: 'JARKOM', name: 'Jaringan Komputer', category: 'PEMINATAN', major: 'TJKT', description: 'Jaringan Komputer untuk TJKT' },
    { code: 'SYSOP', name: 'Sistem Operasi', category: 'PEMINATAN', major: 'TJKT', description: 'Sistem Operasi' },
    // PPLG
    { code: 'PWEB', name: 'Pemrograman Web', category: 'PEMINATAN', major: 'PPLG', description: 'Pemrograman Web' },
    { code: 'ALGO', name: 'Algoritma', category: 'PEMINATAN', major: 'PPLG', description: 'Algoritma dan Pemrograman' },
    // DKV
    { code: 'DESGRAF', name: 'Desain Grafis', category: 'PEMINATAN', major: 'DKV', description: 'Desain Grafis' },
    { code: 'FOTO', name: 'Fotografi', category: 'PEMINATAN', major: 'DKV', description: 'Fotografi' },
    // BD
    { code: 'ECOM', name: 'E-Commerce', category: 'PEMINATAN', major: 'BD', description: 'E-Commerce' },
    { code: 'DIGMARK', name: 'Digital Marketing', category: 'PEMINATAN', major: 'BD', description: 'Digital Marketing' },
  ];
  
  const subjectDocs = subjectData.map(s => ({
    code: s.code,
    name: s.name,
    description: s.description,
    category: s.category,
    school: schoolId,
    schoolTypes: ['SMK'],
    grades: [10, 11, 12],
    smkMajors: s.major ? [s.major] : undefined,
    isActive: true,
  }));
  
  const createdSubjects = await SubjectModel.insertMany(subjectDocs);
  console.log(`✓ Created ${createdSubjects.length} subjects`);
  return createdSubjects;
}

async function seedData() {
  console.log('\n========================================');
  console.log('  SMK TI Bali Global Badung - Seeding');
  console.log('========================================');
  
  console.log('Array lengths:');
  console.log(`- siswaKelas10: ${siswaKelas10.length}`);
  console.log(`- siswaKelas11: ${siswaKelas11.length}`);
  console.log(`- siswaKelas12: ${siswaKelas12.length}`);
  console.log(`- Total: ${siswaKelas10.length + siswaKelas11.length + siswaKelas12.length}`);
  
  await clearDatabase();
  
  const owner = await seedSchoolOwner();
  const school = await seedSchool(owner._id as mongoose.Types.ObjectId);
  await updateSchoolOwner(owner._id as mongoose.Types.ObjectId, school._id as mongoose.Types.ObjectId);
  const teachers = await seedTeachers(school._id as mongoose.Types.ObjectId);
  const classes = await seedClasses(school._id as mongoose.Types.ObjectId);
  const students = await seedStudents(school._id as mongoose.Types.ObjectId, classes);
  const subjects = await seedSubjects(school._id as mongoose.Types.ObjectId);
  
  // Assign teachers to classes
  await assignTeachersToClasses(teachers, classes, subjects);
  
  console.log('\n✅ SEEDING COMPLETED SUCCESSFULLY!');
  console.log('========================================');
  console.log(`School: ${schoolData.name}`);
  console.log(`Total Students: ${siswaKelas10.length + siswaKelas11.length + siswaKelas12.length}`);
  console.log(`  - Kelas X: ${siswaKelas10.length} siswa`);
  console.log(`  - Kelas XI: ${siswaKelas11.length} siswa`);
  console.log(`  - Kelas XII: ${siswaKelas12.length} siswa`);
  console.log(`Classes: ${classes.length}`);
  console.log(`\nLogin Test Credentials:`);
  console.log(`Kepala Sekolah: kepala.sekolah@smktiglobal.sch.id / made123`);
  console.log(`Guru (Ketua Program PPLG): ade.pranata@smktiglobal.sch.id / putu123`);
  console.log(`Siswa (XI PPLG 1): 0088432625@student.smktiglobal.sch.id / i123`);
  console.log(`\nFormat Login:`);
  console.log(`- Guru lain: [firstname.lastname]@smktiglobal.sch.id / [firstname]123`);
  console.log(`- Siswa lain: [nisn]@student.smktiglobal.sch.id / [firstname]123`);
  console.log('========================================\n');
}

async function main() {
  await connectDB();
  await seedData();
  await mongoose.disconnect();
  console.log('✓ Disconnected from MongoDB\n');
}

main().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
