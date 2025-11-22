import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, FolderOpen, RefreshCcw } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const ErrorStates = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar role="guest" activeRoute="/errors" />
      <main className="container mx-auto grid gap-8 px-4 py-16 lg:grid-cols-3">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              <CardTitle>Error 500</CardTitle>
            </div>
            <CardDescription>Sistem mengalami kendala saat memuat data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-destructive">
            <p>Silakan coba lagi dalam beberapa menit atau hubungi admin sekolah.</p>
            <Button variant="outline" className="text-destructive" size="sm">
              Laporkan masalah
            </Button>
          </CardContent>
        </Card>

        <Card className="border-muted/60">
          <CardHeader>
            <div className="flex items-center gap-3 text-muted-foreground">
              <FolderOpen className="h-6 w-6" />
              <CardTitle>Belum Ada Data</CardTitle>
            </div>
            <CardDescription>Halaman laporan belum memiliki data untuk periode ini.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Coba ubah filter atau generate laporan baru untuk melihat hasil.</p>
            <Button size="sm">Generate laporan</Button>
          </CardContent>
        </Card>

        <Card className="border-warning/40 bg-warning/10">
          <CardHeader>
            <div className="flex items-center gap-3 text-warning">
              <RefreshCcw className="h-6 w-6" />
              <CardTitle>Sesi Kedaluwarsa</CardTitle>
            </div>
            <CardDescription>Sesi Anda habis karena tidak ada aktivitas selama 30 menit.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-warning">
            <p>Simpan pekerjaan Anda secara berkala untuk menghindari kehilangan data.</p>
            <Button variant="outline" className="text-warning" size="sm">
              Masuk kembali
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ErrorStates;
