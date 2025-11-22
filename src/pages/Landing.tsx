import { FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import heroImage from "@/assets/hero-learning.jpg";
import logoImage from "@/assets/logo.png";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  hoverLift,
  pulseGlow,
  scaleIn,
  TIMING,
} from "@/lib/animations";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  GraduationCap,
  LineChart,
  LogIn,
  ShieldCheck,
  Sparkles,
  Users,
  Timer,
  Building2,
} from "lucide-react";

const benefitHighlights = [
  "Analitik real-time untuk guru dan admin",
  "Rekomendasi belajar yang dipersonalisasi",
  "Terintegrasi dengan kurikulum sekolah",
];

const featureCards = [
  {
    icon: Brain,
    label: "Adaptive Engine",
    description:
      "Soal menyesuaikan kemampuan siswa secara otomatis untuk menjaga tingkat tantangan yang ideal.",
  },
  {
    icon: LineChart,
    label: "Insight Progres",
    description: "Dashboard visual menampilkan performa kelas, tren penguasaan, dan rekomendasi tindak lanjut.",
  },
  {
    icon: ShieldCheck,
    label: "Early Warning",
    description: "Sistem peringatan dini membantu guru memberikan intervensi tepat waktu kepada siswa yang berisiko.",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "Gratis",
    description: "Ideal untuk sekolah yang baru mencoba pembelajaran adaptif.",
    perks: [
      "10 akun siswa & 3 guru",
      "Bank soal dasar",
      "Laporan mingguan",
    ],
  },
  {
    name: "Growth",
    price: "Rp399.000",
    tag: "Paling populer",
    description: "Untuk sekolah yang ingin skalakan pengalaman belajar adaptif.",
    perks: [
      "Siswa & guru tanpa batas",
      "Integrasi LMS & SSO",
      "Laporan komprehensif",
      "Onboarding personal",
    ],
  },
  {
    name: "Enterprise",
    price: "Hubungi kami",
    description: "Solusi kustom untuk institusi multi-cabang.",
    perks: [
      "Penyesuaian kurikulum",
      "Integrasi data akademik",
      "SLA dukungan 24/7",
      "Tim keberhasilan khusus",
    ],
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "teacher" || user.role === "admin") {
        navigate("/dashboard-guru");
      } else {
        navigate("/dashboard-siswa");
      }
    }
  }, [user, navigate]);

  const handleRegisterClick = (role: 'student' | 'teacher' | 'school') => {
    setShowRegisterModal(false);
    switch (role) {
      case 'student':
        navigate('/student-registration');
        break;
      case 'teacher':
        navigate('/teacher-registration');
        break;
      case 'school':
        navigate('/school-owner-registration');
        break;
    }
  };

  const { scrollY } = useScroll();
  
  // Smoother parallax with extended range
  const heroY = useTransform(scrollY, [0, 600], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 400, 600], [1, 0.8, 0]); // More gradual fade

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        role="guest"
        activeRoute="/"
        onRegisterClick={() => setShowRegisterModal(true)}
      />

      <main className="flex flex-col gap-16 pb-20">
        {/* Hero Section with Parallax */}
        <motion.section 
          id="hero" 
          className="relative overflow-hidden -mt-12"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Animated Background Gradients */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              className="absolute -top-16 -right-16 h-96 w-96 rounded-full bg-primary/20 blur-3xl" 
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute bottom-0 left-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" 
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </div>
          
          <div className="container relative mx-auto grid items-center gap-12 px-4 py-16 lg:grid-cols-[1fr,0.9fr] lg:py-20">
            <motion.div 
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="secondary" className="rounded-full px-4 py-2 text-sm font-medium shadow-lg">
                  <Sparkles className="mr-2 h-4 w-4 inline" />
                  Adaptif • Data-Driven • Aksesibel
                </Badge>
              </motion.div>
              
              <motion.h1 
                className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
                variants={fadeInUp}
              >
                Belajar Personal untuk Setiap{" "}
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Siswa
                </span>{" "}
                dan{" "}
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Guru
                </span>
              </motion.h1>
              
              <motion.p 
                className="max-w-xl text-lg text-muted-foreground sm:text-xl leading-relaxed"
                variants={fadeInUp}
              >
                Portal Pembelajaran Adaptif menyajikan jalur belajar dinamis, intervensi guru yang terarah,
                serta laporan progres jelas untuk seluruh pemangku kepentingan.
              </motion.p>
              
              <motion.ul 
                className="space-y-3 text-sm text-muted-foreground"
                variants={staggerContainer}
              >
                {benefitHighlights.map((item, i) => (
                  <motion.li 
                    key={item} 
                    className="flex items-center gap-3"
                    variants={fadeInLeft}
                  >
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div 
                className="flex flex-col gap-3 sm:flex-row"
                variants={fadeInUp}
              >
                <motion.div whileHover="hover" whileTap="tap" variants={hoverLift}>
                  <Button size="lg" className="gap-2 shadow-lg" onClick={() => setShowRegisterModal(true)}> 
                    <Sparkles className="h-5 w-5" /> Daftar Sekarang
                  </Button>
                </motion.div>
                <motion.div whileHover="hover" whileTap="tap" variants={hoverLift}>
                  <Button size="lg" variant="outline" className="gap-2" onClick={() => navigate("/login")}>
                    <LogIn className="h-5 w-5" /> Masuk
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div 
                className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
                variants={fadeInUp}
              >
                <motion.div 
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10"
                  whileHover={{ scale: 1.05 }}
                >
                  <Users className="h-4 w-4 text-primary" /> 
                  <span className="font-semibold text-foreground">120+</span> sekolah aktif
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/10"
                  whileHover={{ scale: 1.05 }}
                >
                  <Timer className="h-4 w-4 text-accent" /> 
                  <span className="font-semibold text-foreground">18</span> menit progres harian
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-warning/5 border border-warning/10"
                  whileHover={{ scale: 1.05 }}
                >
                  <GraduationCap className="h-4 w-4 text-warning" /> 
                  <span className="font-semibold text-foreground">92%</span> siswa mencapai target
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="relative"
              initial="hidden"
              animate="visible"
              variants={fadeInRight}
            >
              <motion.div 
                className="absolute inset-4 rounded-3xl border-2 border-primary/30 shadow-focus"
                variants={pulseGlow}
                animate="animate"
              />
              <motion.img
                src={heroImage}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: TIMING.medium }}
                alt="Ilustrasi siswa menggunakan EduSmart"
                className="relative rounded-3xl shadow-card"
              />
              <Card className="absolute -bottom-10 left-10 w-72 shadow-lg">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Adaptasi Berbasis Data</p>
                    <p className="text-xs text-muted-foreground">Soal berikutnya menyesuaikan performa terbaru.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section id="fitur" className="bg-muted/40 py-20">
          <div className="container mx-auto space-y-12 px-4">
            <motion.div 
              className="text-center space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
              <motion.div variants={scaleIn}>
                <Badge variant="outline" className="mb-4 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wider">
                  <Brain className="mr-2 h-3 w-3 inline" />
                  Fitur Utama
                </Badge>
              </motion.div>
              <motion.h2 className="text-4xl font-bold" variants={fadeInUp}>
                Satu Portal untuk Seluruh Ekosistem Sekolah
              </motion.h2>
              <motion.p className="mx-auto mt-4 max-w-2xl text-muted-foreground text-lg" variants={fadeInUp}>
                Mulai dari onboarding siswa hingga intervensi guru, setiap langkah sudah terangkai dalam satu pengalaman digital.
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              {featureCards.map(({ icon: Icon, label, description }, index) => (
                <motion.div key={label} variants={fadeInUp}>
                  <Card 
                    className="group h-full border border-transparent bg-card shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-xl cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="space-y-3 relative z-10">
                      <motion.div 
                        className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="h-7 w-7" />
                      </motion.div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{label}</CardTitle>
                      <CardDescription className="leading-relaxed text-muted-foreground">{description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
            >
              <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm">
                <CardContent className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Alur Onboarding + Assessment Cepat</h3>
                    <p className="text-muted-foreground">
                      10 soal adaptif untuk memetakan level awal siswa dan mengusulkan jalur belajar selama 4 minggu pertama.
                    </p>
                  </div>
                  <motion.div whileHover="hover" whileTap="tap" variants={hoverLift}>
                    <Button size="lg" className="w-full gap-2 lg:w-auto shadow-lg" onClick={() => setShowRegisterModal(true)}>
                      Mulai Tes Awal
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto grid gap-10 px-4 lg:grid-cols-[1.1fr,0.9fr]">
          <Card className="order-2 border-muted/60 lg:order-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ShieldCheck className="h-5 w-5 text-primary" /> Dukungan Guru Berbasis Bukti
              </CardTitle>
              <CardDescription>
                Guru mendapatkan notifikasi intervensi lengkap dengan rekomendasi aksi, riwayat interaksi, dan catatan progres siswa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3 rounded-lg bg-muted/60 p-4">
                <Sparkles className="mt-1 h-4 w-4 text-primary" />
                <p>Rekomendasi otomatis: pilih siswa, tetapkan tindakan, dan pantau dampaknya pada risiko belajar.</p>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-muted/60 p-4">
                <Users className="mt-1 h-4 w-4 text-primary" />
                <p>Kolaborasi guru-bk dengan log intervensi terpusat dan status tindak lanjut yang selalu mutakhir.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="order-1 border-primary/30 bg-primary/5 lg:order-2">
            <CardHeader>
              <CardTitle className="text-xl">Statistik Sekilas</CardTitle>
              <CardDescription>
                Data berdasarkan 15.230 sesi latihan adaptif selama Q3 2025.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="rounded-lg bg-card p-4 shadow-sm">
                <p className="text-sm text-muted-foreground">Waktu belajar efektif</p>
                <p className="text-3xl font-bold">+32%</p>
              </div>
              <div className="rounded-lg bg-card p-4 shadow-sm">
                <p className="text-sm text-muted-foreground">Penurunan siswa berisiko</p>
                <p className="text-3xl font-bold text-accent">-41%</p>
              </div>
              <div className="rounded-lg bg-card p-4 shadow-sm">
                <p className="text-sm text-muted-foreground">Skor diagnostik membaik</p>
                <p className="text-3xl font-bold text-primary">+18 pts</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="harga" className="bg-card py-16">
          <div className="container mx-auto space-y-12 px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Paket untuk Setiap Tahap Transformasi</h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Mulai gratis dan berkembang bersama dukungan tim kami saat adopsi pembelajaran adaptif di sekolah Anda.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {pricingTiers.map(({ name, price, description, perks, tag }) => (
                <Card
                  key={name}
                  className={cn(
                    "relative h-full border-border/60 shadow-sm transition hover:-translate-y-1 hover:shadow-card",
                    tag && "border-primary/50",
                  )}
                >
                  {tag && (
                    <Badge className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary text-primary-foreground">
                      {tag}
                    </Badge>
                  )}
                  <CardHeader className="space-y-1">
                    <CardTitle>{name}</CardTitle>
                    <p className="text-3xl font-bold text-primary">{price}</p>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={tag ? "default" : "outline"} onClick={() => navigate("/school-owner-registration")}>
                      Minta demo
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="kontak" className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.6fr,1fr]">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Siap mempersonalisasi pembelajaran di {"{SCHOOL_NAME}"}?</h2>
            <p className="text-muted-foreground">
              Tim kami siap mendampingi dari analisis kebutuhan hingga peluncuran di kelas. Kirimkan pesan singkat,
              dan kami akan hubungi Anda dalam 1x24 jam.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Data aman dengan enkripsi dan akses berbasis peran.
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" /> Insight cerdas dari machine learning buatan tim lokal.
              </div>
            </div>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Hubungi Tim Kami</CardTitle>
              <CardDescription>Kami dukung Anda membangun pengalaman belajar adaptif terbaik.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama</Label>
                  <Input id="name" name="name" placeholder="{USER_NAME}" autoComplete="name" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email">Email Sekolah</Label>
                    <Input id="email" name="email" type="email" placeholder="nama@sekolah.com" autoComplete="email" />
                  </div>
                  <div>
                    <Label htmlFor="role">Peran</Label>
                    <Input id="role" name="role" placeholder="Guru Matematika" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Pesan</Label>
                  <Textarea id="message" name="message" placeholder="Ceritakan tantangan pembelajaran di sekolah Anda" rows={4} />
                </div>
                <Button className="w-full" variant="default">
                  Kirim intervensi
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />

      {/* Registration Role Selection Modal */}
      <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto p-0 border-0 bg-gradient-to-br from-slate-50 via-white to-slate-50">
          {/* Header Section with Background */}
          <div className="relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-pink-600">
              <motion.div 
                className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/20 rounded-full blur-3xl"
                animate={{
                  scale: [1.3, 1, 1.3],
                  opacity: [0.6, 0.3, 0.6],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            {/* Header Content */}
            <div className="relative z-10 px-4 sm:px-8 py-6 sm:py-8 text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-center mb-3">
                  <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full">
                    <Sparkles className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                </div>
                <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  Mulai Perjalanan Anda
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto px-4">
                  Pilih peran yang sesuai untuk mengakses platform pembelajaran adaptif
                </DialogDescription>
              </motion.div>
            </div>
          </div>

          {/* Cards Section */}
          <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              {/* Student Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card 
                  className="cursor-pointer border-2 border-transparent hover:border-primary/50 transition-all duration-300 overflow-hidden group h-full bg-white shadow-lg hover:shadow-2xl hover:-translate-y-2 will-change-transform"
                  onClick={() => handleRegisterClick('student')}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardHeader className="text-center space-y-2 sm:space-y-3 relative z-10 pb-3">
                    {/* Icon with Gradient Ring */}
                    <div className="mx-auto relative">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-full blur-xl opacity-0 group-hover:opacity-50"
                        transition={{ duration: 0.3 }}
                      />
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                        <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-br from-primary to-purple-600 bg-clip-text text-transparent">
                        Siswa
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Belajar dengan jalur yang dipersonalisasi sesuai kemampuan Anda
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 pb-4 sm:pb-6 space-y-3">
                    <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                    <ul className="space-y-2 text-xs sm:text-sm">
                      <li className="flex items-start gap-3 group/item">
                        <div className="mt-0.5 p-1 bg-primary/10 rounded-full group-hover/item:bg-primary/20 transition-colors">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        </div>
                        <span className="text-muted-foreground">Soal adaptif sesuai level</span>
                      </li>
                      <li className="flex items-start gap-3 group/item">
                        <div className="mt-0.5 p-1 bg-primary/10 rounded-full group-hover/item:bg-primary/20 transition-colors">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        </div>
                        <span className="text-muted-foreground">Gamifikasi & achievement</span>
                      </li>
                      <li className="flex items-start gap-3 group/item">
                        <div className="mt-0.5 p-1 bg-primary/10 rounded-full group-hover/item:bg-primary/20 transition-colors">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        </div>
                        <span className="text-muted-foreground">Tracking progress real-time</span>
                      </li>
                    </ul>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 group/btn mt-3 text-xs sm:text-sm"
                      onClick={() => handleRegisterClick('student')}
                    >
                      Daftar sebagai Siswa
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Teacher Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card 
                  className="cursor-pointer border-2 border-transparent hover:border-teal-500/50 transition-all duration-300 overflow-hidden group h-full bg-white shadow-lg hover:shadow-2xl hover:-translate-y-2 will-change-transform"
                  onClick={() => handleRegisterClick('teacher')}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardHeader className="text-center space-y-2 sm:space-y-3 relative z-10 pb-3">
                    <div className="mx-auto relative">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-full blur-xl opacity-0 group-hover:opacity-50"
                        transition={{ duration: 0.3 }}
                      />
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                        <Users className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-br from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                        Guru
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Monitor dan bimbing siswa dengan insights yang mendalam
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 pb-4 sm:pb-6 space-y-3">
                    <div className="h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />
                    <ul className="space-y-2 text-xs sm:text-sm">
                      <li className="flex items-start gap-3 group/item">
                        <div className="mt-0.5 p-1 bg-teal-500/10 rounded-full group-hover/item:bg-teal-500/20 transition-colors">
                          <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 flex-shrink-0" />
                        </div>
                        <span className="text-muted-foreground">Dashboard analitik siswa</span>
                      </li>
                      <li className="flex items-start gap-3 group/item">
                        <div className="mt-0.5 p-1 bg-teal-500/10 rounded-full group-hover/item:bg-teal-500/20 transition-colors">
                          <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 flex-shrink-0" />
                        </div>
                        <span className="text-muted-foreground">Intervensi tepat waktu</span>
                      </li>
                      <li className="flex items-start gap-3 group/item">
                        <div className="mt-0.5 p-1 bg-teal-500/10 rounded-full group-hover/item:bg-teal-500/20 transition-colors">
                          <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 flex-shrink-0" />
                        </div>
                        <span className="text-muted-foreground">Laporan progress detail</span>
                      </li>
                    </ul>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-600/90 hover:to-cyan-600/90 group/btn mt-4"
                      onClick={() => handleRegisterClick('teacher')}
                    >
                      Daftar sebagai Guru
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* School Owner Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card 
                  className="cursor-pointer border-2 border-transparent hover:border-indigo-500/50 transition-all duration-300 overflow-hidden group h-full bg-white shadow-lg hover:shadow-2xl hover:-translate-y-2 will-change-transform"
                  onClick={() => handleRegisterClick('school')}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardHeader className="text-center space-y-2 sm:space-y-3 relative z-10 pb-3">
                    <div className="mx-auto relative">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full blur-xl opacity-0 group-hover:opacity-50"
                        transition={{ duration: 0.3 }}
                      />
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                        <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Pemilik Sekolah
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Kelola seluruh ekosistem pembelajaran di sekolah Anda
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 pb-4 sm:pb-6 space-y-3">
                    <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                    <ul className="space-y-2 text-xs sm:text-sm">
                      <li className="flex items-start gap-3 group/item">
                        <div className="mt-0.5 p-1 bg-indigo-500/10 rounded-full group-hover/item:bg-indigo-500/20 transition-colors">
                          <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0" />
                        </div>
                        <span className="text-muted-foreground">Manajemen multi-kelas</span>
                      </li>
                      <li className="flex items-start gap-3 group/item">
                        <div className="mt-0.5 p-1 bg-indigo-500/10 rounded-full group-hover/item:bg-indigo-500/20 transition-colors">
                          <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0" />
                        </div>
                        <span className="text-muted-foreground">Kontrol akses & permissions</span>
                      </li>
                      <li className="flex items-start gap-3 group/item">
                        <div className="mt-0.5 p-1 bg-indigo-500/10 rounded-full group-hover/item:bg-indigo-500/20 transition-colors">
                          <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0" />
                        </div>
                        <span className="text-muted-foreground">Laporan komprehensif</span>
                      </li>
                    </ul>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-600/90 hover:to-purple-600/90 group/btn mt-4"
                      onClick={() => handleRegisterClick('school')}
                    >
                      Daftar sebagai Owner
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Footer Link */}
            <motion.div 
              className="mt-4 sm:mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 rounded-full">
                <p className="text-sm text-muted-foreground">
                  Sudah punya akun?
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-primary hover:text-primary/80"
                  onClick={() => {
                    setShowRegisterModal(false);
                    navigate('/login');
                  }}
                >
                  Masuk di sini →
                </Button>
              </div>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Landing;
