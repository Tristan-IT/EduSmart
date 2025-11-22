import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  GraduationCap,
  BookOpen,
  Users,
  BarChart3,
  FileText,
  HelpCircle,
  Shield,
  Bell
} from "lucide-react";
import logoImage from "@/assets/logo.png";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 border-t border-slate-700">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={logoImage} 
                alt="EduSmart Logo" 
                className="h-10 w-10 object-contain"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-slate-300">Edu</span>
                <span className="text-lg font-bold text-white">Smart</span>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-md">
              Platform pembelajaran adaptif berbasis AI yang mempersonalisasi pengalaman belajar 
              untuk setiap siswa, guru, dan sekolah di Indonesia.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Dapatkan Update Terbaru</h4>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Email Anda" 
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-primary"
                />
                <Button className="bg-primary hover:bg-primary/90 shrink-0">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-3">
              <Button size="icon" variant="ghost" className="hover:bg-slate-800 hover:text-primary">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-slate-800 hover:text-primary">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-slate-800 hover:text-primary">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-slate-800 hover:text-primary">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-slate-800 hover:text-primary">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Platform
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/student-registration" className="text-slate-300 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-primary transition-colors"></span>
                  Untuk Siswa
                </Link>
              </li>
              <li>
                <Link to="/teacher-registration" className="text-slate-300 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-primary transition-colors"></span>
                  Untuk Guru
                </Link>
              </li>
              <li>
                <Link to="/school-owner-registration" className="text-slate-300 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-primary transition-colors"></span>
                  Untuk Sekolah
                </Link>
              </li>
              <li>
                <Link to="/#fitur" className="text-slate-300 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-primary transition-colors"></span>
                  Fitur Lengkap
                </Link>
              </li>
              <li>
                <Link to="/#harga" className="text-slate-300 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-primary transition-colors"></span>
                  Harga & Paket
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Sumber Daya
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/docs" className="text-slate-300 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-primary transition-colors"></span>
                  Dokumentasi
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-300 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-primary transition-colors"></span>
                  Blog & Artikel
                </Link>
              </li>
              <li>
                <Link to="/tutorial" className="text-slate-300 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-primary transition-colors"></span>
                  Tutorial Video
                </Link>
              </li>
              <li>
                <Link to="/webinar" className="text-slate-300 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-primary transition-colors"></span>
                  Webinar
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-300 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-primary transition-colors"></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Perusahaan
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about" className="text-slate-300 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-primary transition-colors"></span>
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-slate-300 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-primary transition-colors"></span>
                  Karir
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-slate-300 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-primary transition-colors"></span>
                  Mitra Kami
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-slate-300 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-primary transition-colors"></span>
                  Media & Press
                </Link>
              </li>
              <li>
                <Link to="/#kontak" className="text-slate-300 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-primary transition-colors"></span>
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Email</p>
                <a href="mailto:support@edusmart.id" className="text-sm text-slate-300 hover:text-primary transition-colors">
                  support@edusmart.id
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Telepon</p>
                <a href="tel:+622123456789" className="text-sm text-slate-300 hover:text-primary transition-colors">
                  +62 21 2345 6789
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Alamat</p>
                <p className="text-sm text-slate-300">
                  Jakarta, Indonesia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 bg-slate-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              &copy; {currentYear} EduSmart. Semua hak dilindungi.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/privacy" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Kebijakan Privasi
              </Link>
              <Link to="/terms" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Syarat Penggunaan
              </Link>
              <Link to="/cookies" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                <Bell className="h-3 w-3" />
                Kebijakan Cookie
              </Link>
              <Link to="/accessibility" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                Aksesibilitas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
