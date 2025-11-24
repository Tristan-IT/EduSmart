export type GradeBand = "SD" | "SMP" | "SMA";

export interface TopicTemplateDefinition {
	topicCode: string;
	subjectCodes: string[];
	gradeBand: GradeBand;
	title: string;
	slug: string;
	description: string;
	icon: string;
	color: string;
	order: number;
	difficulty: "beginner" | "intermediate" | "advanced";
	estimatedMinutes: number;
	learningObjectives: string[];
	tags: string[];
	prerequisiteCodes?: string[];
}

export const topicTemplateDefinitions: TopicTemplateDefinition[] = [
	// ============================================
	// SMA - Matematika
	// ============================================
	{
		topicCode: "ALG-01",
		subjectCodes: ["MAT"],
		gradeBand: "SMA",
		title: "Aljabar",
		slug: "aljabar",
		description: "Persamaan linear, kuadrat, eksponen, dan logaritma",
		icon: "Calculator",
		color: "#3B82F6",
		order: 1,
		difficulty: "intermediate",
		estimatedMinutes: 180,
		learningObjectives: [
			"Menyelesaikan persamaan linear",
			"Menyelesaikan persamaan kuadrat",
			"Memahami sifat eksponen dan logaritma",
			"Menerapkan aljabar pada pemecahan masalah"
		],
		tags: ["aljabar", "persamaan", "eksponen", "logaritma"]
	},
	{
		topicCode: "GEOM-01",
		subjectCodes: ["MAT"],
		gradeBand: "SMA",
		title: "Geometri",
		slug: "geometri",
		description: "Bangun datar, bangun ruang, dan teorema Pythagoras",
		icon: "Shapes",
		color: "#10B981",
		order: 2,
		difficulty: "beginner",
		estimatedMinutes: 120,
		learningObjectives: [
			"Menghitung luas dan keliling bangun datar",
			"Menghitung volume bangun ruang",
			"Menerapkan teorema Pythagoras",
			"Memahami konsep dasar trigonometri"
		],
		tags: ["geometri", "bangun-datar", "bangun-ruang", "pythagoras"]
	},
	{
		topicCode: "TRIG-01",
		subjectCodes: ["MAT"],
		gradeBand: "SMA",
		title: "Trigonometri",
		slug: "trigonometri",
		description: "Sudut, identitas trigonometri, dan grafik fungsi",
		icon: "Triangle",
		color: "#8B5CF6",
		order: 3,
		difficulty: "intermediate",
		estimatedMinutes: 120,
		learningObjectives: [
			"Memahami konversi derajat ke radian",
			"Menguasai perbandingan trigonometri",
			"Menerapkan identitas trigonometri",
			"Memahami grafik fungsi trigonometri"
		],
		tags: ["trigonometri", "sudut", "identitas", "grafik"],
		prerequisiteCodes: ["GEOM-01"]
	},
	{
		topicCode: "CALC-01",
		subjectCodes: ["MAT"],
		gradeBand: "SMA",
		title: "Kalkulus Dasar",
		slug: "kalkulus-dasar",
		description: "Limit, turunan, dan integral fungsi",
		icon: "TrendingUp",
		color: "#EF4444",
		order: 4,
		difficulty: "advanced",
		estimatedMinutes: 150,
		learningObjectives: [
			"Memahami konsep limit",
			"Menghitung turunan fungsi",
			"Menerapkan aturan turunan",
			"Memahami konsep integral"
		],
		tags: ["kalkulus", "limit", "turunan", "integral"],
		prerequisiteCodes: ["ALG-01"]
	},
	{
		topicCode: "STAT-01",
		subjectCodes: ["MAT"],
		gradeBand: "SMA",
		title: "Statistika",
		slug: "statistika",
		description: "Pengolahan data, ukuran pemusatan, dan penyebaran",
		icon: "PieChart",
		color: "#F59E0B",
		order: 5,
		difficulty: "beginner",
		estimatedMinutes: 100,
		learningObjectives: [
			"Mengolah dan menyajikan data",
			"Menghitung mean, median, dan modus",
			"Memahami ukuran penyebaran",
			"Menginterpretasi data statistik"
		],
		tags: ["statistika", "data", "mean", "median"]
	},
	{
		topicCode: "PROB-01",
		subjectCodes: ["MAT"],
		gradeBand: "SMA",
		title: "Peluang",
		slug: "peluang",
		description: "Kombinatorik, permutasi, dan probabilitas",
		icon: "Dice6",
		color: "#EC4899",
		order: 6,
		difficulty: "intermediate",
		estimatedMinutes: 120,
		learningObjectives: [
			"Memahami konsep peluang",
			"Menghitung permutasi dan kombinasi",
			"Menerapkan aturan peluang",
			"Menyelesaikan masalah probabilitas"
		],
		tags: ["peluang", "permutasi", "kombinasi", "probabilitas"]
	},

	// ============================================
	// SMA - Sains
	// ============================================
	{
		topicCode: "FIS-MEK-01",
		subjectCodes: ["FIS"],
		gradeBand: "SMA",
		title: "Mekanika",
		slug: "mekanika",
		description: "Gerak, gaya, usaha, energi, dan momentum",
		icon: "Activity",
		color: "#3B82F6",
		order: 1,
		difficulty: "intermediate",
		estimatedMinutes: 120,
		learningObjectives: [
			"Menganalisis GLB dan GLBB",
			"Memahami hukum Newton",
			"Menghitung usaha dan energi",
			"Memahami konsep momentum"
		],
		tags: ["fisika", "mekanika", "gerak", "gaya"]
	},
	{
		topicCode: "FIS-TERMO-01",
		subjectCodes: ["FIS"],
		gradeBand: "SMA",
		title: "Termodinamika",
		slug: "termodinamika",
		description: "Suhu, kalor, dan hukum termodinamika",
		icon: "Thermometer",
		color: "#EF4444",
		order: 2,
		difficulty: "intermediate",
		estimatedMinutes: 90,
		learningObjectives: [
			"Memahami konsep suhu",
			"Menghitung kalor dan perubahan wujud",
			"Memahami hukum termodinamika",
			"Menganalisis perpindahan kalor"
		],
		tags: ["fisika", "termodinamika", "suhu", "kalor"]
	},
	{
		topicCode: "FIS-LIST-01",
		subjectCodes: ["FIS"],
		gradeBand: "SMA",
		title: "Listrik & Magnet",
		slug: "listrik-magnet",
		description: "Arus listrik, hukum Ohm, rangkaian, dan medan magnet",
		icon: "Zap",
		color: "#F59E0B",
		order: 3,
		difficulty: "intermediate",
		estimatedMinutes: 100,
		learningObjectives: [
			"Memahami arus, tegangan, dan hambatan",
			"Menerapkan hukum Ohm",
			"Menganalisis rangkaian listrik",
			"Memahami medan magnet"
		],
		tags: ["fisika", "listrik", "magnet", "hukum-ohm"]
	},
	{
		topicCode: "KIM-ATOM-01",
		subjectCodes: ["KIM"],
		gradeBand: "SMA",
		title: "Struktur Atom",
		slug: "struktur-atom",
		description: "Partikel penyusun atom dan konfigurasi elektron",
		icon: "CircleDot",
		color: "#10B981",
		order: 1,
		difficulty: "beginner",
		estimatedMinutes: 90,
		learningObjectives: [
			"Memahami struktur atom",
			"Menentukan konfigurasi elektron",
			"Memahami tabel periodik",
			"Menentukan golongan dan periode"
		],
		tags: ["kimia", "atom", "elektron", "tabel-periodik"]
	},
	{
		topicCode: "KIM-IKATAN-01",
		subjectCodes: ["KIM"],
		gradeBand: "SMA",
		title: "Ikatan Kimia",
		slug: "ikatan-kimia",
		description: "Ikatan ion, kovalen, dan logam",
		icon: "Link",
		color: "#8B5CF6",
		order: 2,
		difficulty: "intermediate",
		estimatedMinutes: 80,
		learningObjectives: [
			"Membedakan jenis ikatan",
			"Memahami pembentukan ikatan",
			"Menentukan jenis ikatan",
			"Menghubungkan ikatan dengan sifat senyawa"
		],
		tags: ["kimia", "ikatan", "ion", "kovalen"],
		prerequisiteCodes: ["KIM-ATOM-01"]
	},
	{
		topicCode: "BIO-SEL-01",
		subjectCodes: ["BIO"],
		gradeBand: "SMA",
		title: "Biologi Sel",
		slug: "biologi-sel",
		description: "Struktur dan fungsi sel serta organel",
		icon: "Circle",
		color: "#10B981",
		order: 1,
		difficulty: "beginner",
		estimatedMinutes: 100,
		learningObjectives: [
			"Membedakan sel prokariotik dan eukariotik",
			"Mengidentifikasi organel sel",
			"Memahami membran sel",
			"Memahami transport membran"
		],
		tags: ["biologi", "sel", "organel", "membran"]
	},
	{
		topicCode: "BIO-GEN-01",
		subjectCodes: ["BIO"],
		gradeBand: "SMA",
		title: "Genetika",
		slug: "genetika",
		description: "DNA, RNA, sintesis protein, dan pewarisan",
		icon: "Activity",
		color: "#3B82F6",
		order: 2,
		difficulty: "intermediate",
		estimatedMinutes: 110,
		learningObjectives: [
			"Memahami struktur DNA dan RNA",
			"Memahami replikasi DNA",
			"Memahami sintesis protein",
			"Memahami hukum Mendel"
		],
		tags: ["biologi", "genetika", "dna", "rna"],
		prerequisiteCodes: ["BIO-SEL-01"]
	},
	{
		topicCode: "BIO-EKO-01",
		subjectCodes: ["BIO"],
		gradeBand: "SMA",
		title: "Ekologi",
		slug: "ekologi",
		description: "Ekosistem, rantai makanan, dan siklus biogeokimia",
		icon: "Leaf",
		color: "#10B981",
		order: 3,
		difficulty: "beginner",
		estimatedMinutes: 90,
		learningObjectives: [
			"Memahami komponen ekosistem",
			"Menganalisis rantai makanan",
			"Memahami aliran energi",
			"Memahami siklus materi"
		],
		tags: ["biologi", "ekologi", "ekosistem", "rantai-makanan"]
	},

	// ============================================
	// SMA - Bahasa & Sosial
	// ============================================
	{
		topicCode: "BIND-TEKS-01",
		subjectCodes: ["BIND"],
		gradeBand: "SMA",
		title: "Analisis Teks Kompleks",
		slug: "teks-kompleks",
		description: "Analisis teks argumentasi, eksposisi, dan editorial",
		icon: "BookOpen",
		color: "#EF4444",
		order: 1,
		difficulty: "intermediate",
		estimatedMinutes: 80,
		learningObjectives: [
			"Mengidentifikasi struktur teks",
			"Mengenali gaya bahasa",
			"Menganalisis ide pokok",
			"Menyusun simpulan"
		],
		tags: ["bahasa-indonesia", "teks", "analisis"]
	},
	{
		topicCode: "BIND-SASTRA-01",
		subjectCodes: ["BIND"],
		gradeBand: "SMA",
		title: "Apresiasi Sastra",
		slug: "sastra",
		description: "Puisi modern, cerpen kontemporer, dan drama",
		icon: "BookOpen",
		color: "#F97316",
		order: 2,
		difficulty: "intermediate",
		estimatedMinutes: 85,
		learningObjectives: [
			"Mengidentifikasi unsur intrinsik",
			"Menganalisis gaya bahasa",
			"Menyusun kritik sastra",
			"Mengekspresikan apresiasi"
		],
		tags: ["sastra", "puisi", "cerpen", "drama"]
	},
	{
		topicCode: "BING-GRAM-01",
		subjectCodes: ["BING"],
		gradeBand: "SMA",
		title: "Advanced Grammar",
		slug: "advanced-grammar",
		description: "Complex sentences, conditionals, dan passive voice",
		icon: "BookOpen",
		color: "#06B6D4",
		order: 1,
		difficulty: "intermediate",
		estimatedMinutes: 80,
		learningObjectives: [
			"Memahami complex sentences",
			"Menggunakan conditionals",
			"Mengubah kalimat ke passive voice",
			"Menerapkan grammar dalam konteks"
		],
		tags: ["english", "grammar", "advanced"]
	},
	{
		topicCode: "BING-READ-01",
		subjectCodes: ["BING"],
		gradeBand: "SMA",
		title: "Reading Comprehension",
		slug: "reading-comprehension",
		description: "Analisis teks akademik dan inferensi makna",
		icon: "BookOpen",
		color: "#3B82F6",
		order: 2,
		difficulty: "intermediate",
		estimatedMinutes: 75,
		learningObjectives: [
			"Mengidentifikasi ide pokok",
			"Membuat inferensi",
			"Menganalisis teks akademik",
			"Menjawab pertanyaan berbasis teks"
		],
		tags: ["english", "reading", "comprehension"]
	},
	{
		topicCode: "SEJ-IND-01",
		subjectCodes: ["SEJ"],
		gradeBand: "SMA",
		title: "Sejarah Indonesia",
		slug: "sejarah-indonesia",
		description: "Kerajaan Nusantara, penjajahan, hingga kemerdekaan",
		icon: "ClipboardList",
		color: "#92400E",
		order: 1,
		difficulty: "beginner",
		estimatedMinutes: 80,
		learningObjectives: [
			"Memahami periode kerajaan",
			"Menganalisis masa penjajahan",
			"Memahami proses kemerdekaan",
			"Menghargai tokoh nasional"
		],
		tags: ["sejarah", "indonesia", "kemerdekaan"]
	},
	{
		topicCode: "GEO-FIS-01",
		subjectCodes: ["GEO"],
		gradeBand: "SMA",
		title: "Geografi Fisik",
		slug: "geografi-fisik",
		description: "Litosfer, hidrosfer, atmosfer, dan fenomena alam",
		icon: "Globe",
		color: "#0891B2",
		order: 1,
		difficulty: "beginner",
		estimatedMinutes: 85,
		learningObjectives: [
			"Memahami dinamika litosfer",
			"Menganalisis hidrosfer",
			"Memahami struktur atmosfer",
			"Menghubungkan fenomena alam"
		],
		tags: ["geografi", "litosfer", "hidrosfer", "atmosfer"]
	},
	{
		topicCode: "EKO-DASAR-01",
		subjectCodes: ["EKO"],
		gradeBand: "SMA",
		title: "Ekonomi Dasar",
		slug: "ekonomi-dasar",
		description: "Konsep dasar ekonomi, permintaan, dan penawaran",
		icon: "TrendingUp",
		color: "#CA8A04",
		order: 1,
		difficulty: "beginner",
		estimatedMinutes: 90,
		learningObjectives: [
			"Memahami konsep ekonomi",
			"Menganalisis kurva permintaan",
			"Memahami penawaran",
			"Menganalisis keseimbangan pasar"
		],
		tags: ["ekonomi", "permintaan", "penawaran", "pasar"]
	},
	{
		topicCode: "SOS-DASAR-01",
		subjectCodes: ["SOS"],
		gradeBand: "SMA",
		title: "Sosiologi Dasar",
		slug: "sosiologi-dasar",
		description: "Konsep dasar sosiologi dan interaksi sosial",
		icon: "Users",
		color: "#DB2777",
		order: 1,
		difficulty: "beginner",
		estimatedMinutes: 80,
		learningObjectives: [
			"Memahami konsep sosiologi",
			"Menganalisis interaksi sosial",
			"Memahami nilai dan norma",
			"Mengidentifikasi perubahan sosial"
		],
		tags: ["sosiologi", "interaksi", "norma", "nilai"]
	},

	// ============================================
	// SMP - Matematika & IPA
	// ============================================
	{
		topicCode: "SMP-MTK-BILBULAT-01",
		subjectCodes: ["MAT"],
		gradeBand: "SMP",
		title: "Bilangan Bulat",
		slug: "bilangan-bulat-smp",
		description: "Operasi hitung bilangan bulat positif dan negatif",
		icon: "Calculator",
		color: "#3B82F6",
		order: 1,
		difficulty: "beginner",
		estimatedMinutes: 60,
		learningObjectives: [
			"Menjumlahkan bilangan bulat",
			"Mengurangkan bilangan bulat",
			"Mengalikan dan membagi bilangan bulat",
			"Menyelesaikan soal cerita"
		],
		tags: ["bilangan-bulat", "operasi", "matematika-smp"]
	},
	{
		topicCode: "SMP-MTK-PECAHAN-01",
		subjectCodes: ["MAT"],
		gradeBand: "SMP",
		title: "Pecahan",
		slug: "pecahan-smp",
		description: "Operasi pecahan, penyederhanaan, dan aplikasi",
		icon: "Calculator",
		color: "#10B981",
		order: 2,
		difficulty: "beginner",
		estimatedMinutes: 70,
		learningObjectives: [
			"Menjumlahkan pecahan",
			"Menyederhanakan pecahan",
			"Mengalikan dan membagi pecahan",
			"Menerapkan pecahan dalam kehidupan"
		],
		tags: ["pecahan", "operasi", "matematika-smp"]
	},
	{
		topicCode: "SMP-MTK-ALJABAR-01",
		subjectCodes: ["MAT"],
		gradeBand: "SMP",
		title: "Aljabar Dasar",
		slug: "aljabar-dasar-smp",
		description: "Variabel, persamaan linear, dan penyederhanaan",
		icon: "Calculator",
		color: "#8B5CF6",
		order: 3,
		difficulty: "intermediate",
		estimatedMinutes: 90,
		learningObjectives: [
			"Memahami variabel",
			"Menyelesaikan persamaan linear",
			"Menyederhanakan bentuk aljabar",
			"Menerapkan aljabar pada soal cerita"
		],
		tags: ["aljabar", "persamaan", "matematika-smp"],
		prerequisiteCodes: ["SMP-MTK-BILBULAT-01"]
	},
	{
		topicCode: "SMP-MTK-GEOMETRI-01",
		subjectCodes: ["MAT"],
		gradeBand: "SMP",
		title: "Geometri Dasar",
		slug: "geometri-smp",
		description: "Bangun datar, keliling, luas, dan sudut",
		icon: "Shapes",
		color: "#F59E0B",
		order: 4,
		difficulty: "intermediate",
		estimatedMinutes: 100,
		learningObjectives: [
			"Menghitung keliling",
			"Menghitung luas",
			"Memahami sudut",
			"Menerapkan geometri di kehidupan"
		],
		tags: ["geometri", "bangun-datar", "matematika-smp"],
		prerequisiteCodes: ["SMP-MTK-PECAHAN-01"]
	},
	{
		topicCode: "SMP-IPA-GERAK-01",
		subjectCodes: ["IPA"],
		gradeBand: "SMP",
		title: "Gerak",
		slug: "gerak-smp",
		description: "Kecepatan, percepatan, GLB, dan GLBB",
		icon: "Activity",
		color: "#3B82F6",
		order: 1,
		difficulty: "beginner",
		estimatedMinutes: 80,
		learningObjectives: [
			"Memahami kecepatan dan percepatan",
			"Menganalisis GLB",
			"Menganalisis GLBB",
			"Menerapkan konsep gerak"
		],
		tags: ["fisika", "gerak", "ipa-smp"]
	},
	{
		topicCode: "SMP-IPA-KLASIFIKASI-01",
		subjectCodes: ["IPA"],
		gradeBand: "SMP",
		title: "Klasifikasi Makhluk Hidup",
		slug: "klasifikasi-smp",
		description: "Taksonomi, kingdom, dan ciri makhluk hidup",
		icon: "Leaf",
		color: "#10B981",
		order: 2,
		difficulty: "beginner",
		estimatedMinutes: 75,
		learningObjectives: [
			"Memahami tingkatan takson",
			"Mengidentifikasi kingdom",
			"Membedakan ciri makhluk hidup",
			"Menerapkan klasifikasi"
		],
		tags: ["biologi", "taksonomi", "ipa-smp"]
	},
	{
		topicCode: "SMP-IPA-ENERGI-01",
		subjectCodes: ["IPA"],
		gradeBand: "SMP",
		title: "Energi dan Perubahannya",
		slug: "energi-smp",
		description: "Bentuk energi, konversi, dan kekekalan",
		icon: "Zap",
		color: "#F59E0B",
		order: 3,
		difficulty: "intermediate",
		estimatedMinutes: 90,
		learningObjectives: [
			"Mengidentifikasi bentuk energi",
			"Memahami konversi energi",
			"Menerapkan hukum kekekalan",
			"Menganalisis contoh energi"
		],
		tags: ["energi", "fisika", "ipa-smp"],
		prerequisiteCodes: ["SMP-IPA-GERAK-01"]
	},
	{
		topicCode: "SMP-IPA-EKOSISTEM-01",
		subjectCodes: ["IPA"],
		gradeBand: "SMP",
		title: "Ekosistem",
		slug: "ekosistem-smp",
		description: "Komponen ekosistem, rantai makanan, dan interaksi",
		icon: "Leaf",
		color: "#10B981",
		order: 4,
		difficulty: "intermediate",
		estimatedMinutes: 85,
		learningObjectives: [
			"Memahami komponen ekosistem",
			"Menganalisis rantai makanan",
			"Memahami jaring makanan",
			"Menjelaskan interaksi makhluk hidup"
		],
		tags: ["ekosistem", "biologi", "ipa-smp"],
		prerequisiteCodes: ["SMP-IPA-KLASIFIKASI-01"]
	},

	// ============================================
	// SMP - Bahasa
	// ============================================
	{
		topicCode: "SMP-BIND-TATABAHASA-01",
		subjectCodes: ["BIND"],
		gradeBand: "SMP",
		title: "Tata Bahasa",
		slug: "tata-bahasa-smp",
		description: "Kalimat aktif-pasif, kelas kata, dan struktur kalimat",
		icon: "BookOpen",
		color: "#EF4444",
		order: 5,
		difficulty: "beginner",
		estimatedMinutes: 60,
		learningObjectives: [
			"Membedakan kalimat aktif dan pasif",
			"Memahami kelas kata",
			"Memahami struktur kalimat",
			"Menerapkan tata bahasa dalam tulisan"
		],
		tags: ["bahasa-indonesia", "tata-bahasa", "smp"]
	},
	{
		topicCode: "SMP-BING-GRAMMAR-01",
		subjectCodes: ["BING"],
		gradeBand: "SMP",
		title: "Basic Grammar",
		slug: "basic-grammar-smp",
		description: "Tenses dasar, irregular verbs, dan simple sentences",
		icon: "BookOpen",
		color: "#3B82F6",
		order: 6,
		difficulty: "beginner",
		estimatedMinutes: 70,
		learningObjectives: [
			"Memahami present simple",
			"Memahami past tense",
			"Memahami present continuous",
			"Menyusun kalimat sederhana"
		],
		tags: ["english", "grammar", "smp"]
	},

	// ============================================
	// SD - Matematika
	// ============================================
	{
		topicCode: "SD-MTK-TAMBAHKURANG-01",
		subjectCodes: ["MAT"],
		gradeBand: "SD",
		title: "Penjumlahan & Pengurangan",
		slug: "penjumlahan-pengurangan-sd",
		description: "Operasi tambah dan kurang bilangan cacah",
		icon: "Calculator",
		color: "#3B82F6",
		order: 1,
		difficulty: "beginner",
		estimatedMinutes: 45,
		learningObjectives: [
			"Memahami konsep penjumlahan",
			"Memahami konsep pengurangan",
			"Melakukan penjumlahan dengan menyimpan",
			"Melakukan pengurangan dengan meminjam"
		],
		tags: ["penjumlahan", "pengurangan", "matematika-sd"]
	},
	{
		topicCode: "SD-MTK-KALIBAGI-01",
		subjectCodes: ["MAT"],
		gradeBand: "SD",
		title: "Perkalian & Pembagian",
		slug: "perkalian-pembagian-sd",
		description: "Operasi kali dan bagi serta tabel perkalian",
		icon: "Calculator",
		color: "#10B981",
		order: 2,
		difficulty: "beginner",
		estimatedMinutes: 50,
		learningObjectives: [
			"Memahami konsep perkalian",
			"Menghafal tabel perkalian",
			"Memahami konsep pembagian",
			"Menyelesaikan soal cerita"
		],
		tags: ["perkalian", "pembagian", "matematika-sd"]
	},
	{
		topicCode: "SD-MTK-PECAHAN-01",
		subjectCodes: ["MAT"],
		gradeBand: "SD",
		title: "Pecahan Sederhana",
		slug: "pecahan-sederhana-sd",
		description: "Pengenalan pecahan dan penjumlahan sederhana",
		icon: "PieChart",
		color: "#F59E0B",
		order: 3,
		difficulty: "beginner",
		estimatedMinutes: 40,
		learningObjectives: [
			"Memahami konsep pecahan",
			"Mengenal pecahan umum",
			"Menjumlahkan pecahan senilai",
			"Menerapkan pecahan sehari-hari"
		],
		tags: ["pecahan", "matematika-sd"]
	},
	{
		topicCode: "SD-MTK-BANGUNDATAR-01",
		subjectCodes: ["MAT"],
		gradeBand: "SD",
		title: "Bangun Datar",
		slug: "bangun-datar-sd",
		description: "Mengenal persegi, persegi panjang, segitiga, lingkaran",
		icon: "Shapes",
		color: "#8B5CF6",
		order: 4,
		difficulty: "beginner",
		estimatedMinutes: 45,
		learningObjectives: [
			"Mengenal berbagai bangun datar",
			"Menghitung keliling",
			"Menghitung luas",
			"Mengidentifikasi sifat bangun"
		],
		tags: ["bangun-datar", "geometri", "matematika-sd"]
	},

	// ============================================
	// SD - IPA
	// ============================================
	{
		topicCode: "SD-IPA-TUBUH-01",
		subjectCodes: ["IPA"],
		gradeBand: "SD",
		title: "Bagian Tubuh",
		slug: "bagian-tubuh-sd",
		description: "Mengenal panca indera dan fungsinya",
		icon: "ClipboardList",
		color: "#EF4444",
		order: 5,
		difficulty: "beginner",
		estimatedMinutes: 40,
		learningObjectives: [
			"Mengenal panca indera",
			"Memahami fungsi organ",
			"Menjaga kesehatan tubuh",
			"Memahami bagian tubuh"
		],
		tags: ["tubuh", "panca-indera", "ipa-sd"]
	},
	{
		topicCode: "SD-IPA-TUMBUHAN-01",
		subjectCodes: ["IPA"],
		gradeBand: "SD",
		title: "Tumbuhan",
		slug: "tumbuhan-sd",
		description: "Bagian tumbuhan, fotosintesis, dan manfaatnya",
		icon: "Leaf",
		color: "#10B981",
		order: 6,
		difficulty: "beginner",
		estimatedMinutes: 45,
		learningObjectives: [
			"Mengenal bagian tumbuhan",
			"Memahami fotosintesis",
			"Menjelaskan manfaat tumbuhan",
			"Menjaga kelestarian tumbuhan"
		],
		tags: ["tumbuhan", "fotosintesis", "ipa-sd"]
	},
	{
		topicCode: "SD-IPA-HEWAN-01",
		subjectCodes: ["IPA"],
		gradeBand: "SD",
		title: "Hewan",
		slug: "hewan-sd",
		description: "Klasifikasi hewan, habitat, dan reproduksi",
		icon: "ClipboardList",
		color: "#8B5CF6",
		order: 7,
		difficulty: "beginner",
		estimatedMinutes: 45,
		learningObjectives: [
			"Mengelompokkan hewan",
			"Memahami habitat hewan",
			"Memahami cara berkembang biak",
			"Menjaga keberagaman hewan"
		],
		tags: ["hewan", "klasifikasi", "ipa-sd"]
	},
	{
		topicCode: "SD-IPA-ENERGI-01",
		subjectCodes: ["IPA"],
		gradeBand: "SD",
		title: "Energi",
		slug: "energi-sd",
		description: "Sumber energi, cahaya, panas, dan penggunaannya",
		icon: "Zap",
		color: "#F59E0B",
		order: 8,
		difficulty: "beginner",
		estimatedMinutes: 45,
		learningObjectives: [
			"Mengenal sumber energi",
			"Memahami energi cahaya",
			"Memahami energi panas",
			"Menerapkan penggunaan energi"
		],
		tags: ["energi", "ipa-sd", "cahaya", "panas"]
	},

	// ============================================
	// SD - Bahasa & PKN
	// ============================================
	{
		topicCode: "SD-BIND-MEMBACA-01",
		subjectCodes: ["BIND"],
		gradeBand: "SD",
		title: "Membaca Pemahaman",
		slug: "membaca-sd",
		description: "Membaca teks sederhana dan memahami isi",
		icon: "BookOpen",
		color: "#EF4444",
		order: 9,
		difficulty: "beginner",
		estimatedMinutes: 35,
		learningObjectives: [
			"Membaca teks sederhana",
			"Menemukan ide pokok",
			"Menjawab pertanyaan bacaan",
			"Menjelaskan kembali isi bacaan"
		],
		tags: ["membaca", "bahasa-indonesia", "sd"]
	},
	{
		topicCode: "SD-BIND-MENULIS-01",
		subjectCodes: ["BIND"],
		gradeBand: "SD",
		title: "Menulis Dasar",
		slug: "menulis-sd",
		description: "Menulis kalimat sederhana dengan ejaan benar",
		icon: "BookOpen",
		color: "#F97316",
		order: 10,
		difficulty: "beginner",
		estimatedMinutes: 35,
		learningObjectives: [
			"Menggunakan huruf kapital",
			"Menggunakan tanda baca",
			"Menyusun kalimat sederhana",
			"Menulis paragraf pendek"
		],
		tags: ["menulis", "bahasa-indonesia", "sd"]
	},
	{
		topicCode: "SD-PKN-PANCASILA-01",
		subjectCodes: ["PKN"],
		gradeBand: "SD",
		title: "Pancasila dan Lambangnya",
		slug: "pancasila-sd",
		description: "Memahami sila-sila Pancasila dan maknanya",
		icon: "ClipboardList",
		color: "#DC2626",
		order: 11,
		difficulty: "beginner",
		estimatedMinutes: 35,
		learningObjectives: [
			"Menyebutkan sila Pancasila",
			"Memahami makna sila",
			"Meneladani nilai Pancasila",
			"Mengaplikasikan dalam kehidupan"
		],
		tags: ["pancasila", "pkn", "sd"]
	},
	{
		topicCode: "SD-PKN-NORMA-01",
		subjectCodes: ["PKN"],
		gradeBand: "SD",
		title: "Norma dan Aturan",
		slug: "norma-aturan-sd",
		description: "Tata tertib di rumah, sekolah, dan masyarakat",
		icon: "ClipboardList",
		color: "#8B5CF6",
		order: 12,
		difficulty: "beginner",
		estimatedMinutes: 35,
		learningObjectives: [
			"Memahami tata tertib",
			"Memahami aturan di rumah",
			"Memahami aturan masyarakat",
			"Mematuhi aturan sehari-hari"
		],
		tags: ["norma", "aturan", "pkn", "sd"]
	}
];