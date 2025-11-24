import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, GraduationCap, UserCircle, Mail, Lock, ArrowLeft, Sparkles, Brain, LineChart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState<"school" | "teacher" | "student">("student");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    setLoading(true);

    try {
      // Determine the login endpoint based on user type
      let endpoint = "";
      switch (loginType) {
        case "school":
          endpoint = "http://localhost:5000/api/school-owner/login";
          break;
        case "teacher":
          endpoint = "http://localhost:5000/api/teacher/login";
          break;
        case "student":
          endpoint = "http://localhost:5000/api/student/login";
          break;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }

      // Store schoolId for school owner (regardless of login type)
      if (data.user.schoolId) {
        localStorage.setItem("schoolId", data.user.schoolId);
      }

      // Store token separately for backward compatibility
      localStorage.setItem("token", data.token);

      // Store token and user data
      login({
        token: data.token,
        user: {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          avatar: data.user.avatar,
          className: data.user.className,
        },
      });

      console.log("Login successful, token stored:", data.token ? "✓" : "✗");

      toast.success("Login berhasil!");

      // Navigate based on user role
      if (data.user.role === "school_owner") {
        navigate("/school-owner-dashboard");
      } else if (data.user.role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat login");
      toast.error(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar role="guest" activeRoute="/login" onRegisterClick={() => navigate('/')} />
      
      <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute top-20 right-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" 
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
            className="absolute bottom-20 left-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" 
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

        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
          {/* Left Side - Branding */}
          <motion.div 
            className="hidden lg:block space-y-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <h1 className="text-5xl font-bold leading-tight">
                Selamat Datang di{" "}
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  EduSmart
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mt-4">
                Platform pembelajaran adaptif berbasis AI untuk siswa, guru, dan sekolah
              </p>
            </motion.div>

            <motion.div className="space-y-4" variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Pembelajaran Adaptif</h3>
                  <p className="text-sm text-muted-foreground">Materi yang menyesuaikan dengan kemampuan Anda</p>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                  <LineChart className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Tracking Real-time</h3>
                  <p className="text-sm text-muted-foreground">Pantau perkembangan belajar secara detail</p>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-500/10">
                  <Sparkles className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Gamifikasi</h3>
                  <p className="text-sm text-muted-foreground">Raih achievement dan bersaing di leaderboard</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-2xl border-2 backdrop-blur-sm bg-card/95">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Masuk ke Akun Anda
                </CardTitle>
                <CardDescription className="text-center text-base">
                  Pilih tipe akun dan masukkan kredensial Anda
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Tabs value={loginType} onValueChange={(v) => setLoginType(v as any)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 h-12 p-1 bg-muted">
                    <TabsTrigger value="student" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                      <UserCircle className="h-4 w-4" />
                      <span className="hidden sm:inline font-medium">Siswa</span>
                    </TabsTrigger>
                    <TabsTrigger value="teacher" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                      <GraduationCap className="h-4 w-4" />
                      <span className="hidden sm:inline font-medium">Guru</span>
                    </TabsTrigger>
                    <TabsTrigger value="school" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                      <Building2 className="h-4 w-4" />
                      <span className="hidden sm:inline font-medium">Sekolah</span>
                    </TabsTrigger>
                  </TabsList>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <Alert variant="destructive" className="border-2">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 border-2 focus-visible:ring-2"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                          <Lock className="h-4 w-4 text-primary" />
                          Password
                        </Label>
                        <Button variant="link" className="px-0 h-auto text-xs" type="button">
                          Lupa password?
                        </Button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 border-2 focus-visible:ring-2"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-semibold bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:opacity-90 transition-opacity shadow-lg"
                      disabled={loading}
                    >
                      {loading ? "Memproses..." : "Masuk"}
                    </Button>
                  </form>
                </Tabs>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 border-t pt-6">
                <p className="text-sm text-center text-muted-foreground">
                  Belum punya akun?{" "}
                  <Link to="/" className="font-semibold text-primary hover:underline">
                    Daftar sekarang
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
