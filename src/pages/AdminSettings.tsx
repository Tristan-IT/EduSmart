import { useState } from "react";
import { LeftNav } from "@/components/LeftNav";
import { Topbar } from "@/components/Topbar";
import { FormField } from "@/components/FormField";
import { AlertMessage } from "@/components/AlertMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const AdminSettings = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [allowSSO, setAllowSSO] = useState(true);
  const [autoProvision, setAutoProvision] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <LeftNav role="admin" activeRoute="/admin" collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />
        <div className="flex flex-1 flex-col">
          <Topbar
            user={{ name: "{USER_NAME}", role: "Administrator" }}
            onMenuToggle={() => setCollapsed((prev) => !prev)}
            notifications={2}
          />

          <main className="flex-1 space-y-6 bg-muted/30 px-4 py-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Pengaturan Sekolah</h1>
                <p className="text-sm text-muted-foreground">
                  Kelola informasi institusi, akses pengguna, dan integrasi SSO untuk EduSmart.
                </p>
              </div>

              <AlertMessage
                type="warning"
                title="Perlu persetujuan"
                message="Aktivasi integrasi baru memerlukan verifikasi keamanan oleh tim IT sekolah."
              />

              <Card>
                <CardHeader>
                  <CardTitle>Profil Sekolah</CardTitle>
                  <CardDescription>Nama dan identitas yang tampil untuk seluruh pengguna.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Nama Sekolah" name="school-name" required>
                    <Input id="school-name" defaultValue="{SCHOOL_NAME}" />
                  </FormField>
                  <FormField label="Alamat Website" name="school-site" helper="Opsional">
                    <Input id="school-site" type="url" placeholder="https://{SCHOOL_NAME}.sch.id" />
                  </FormField>
                  <FormField label="Alamat" name="school-address" className="sm:col-span-2">
                    <Input id="school-address" placeholder="Jl. Pendidikan No. 1, Jakarta" />
                  </FormField>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Single Sign-On (SSO)</CardTitle>
                  <CardDescription>Kelola akses menggunakan Google Workspace atau Microsoft Entra ID.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-muted/60 bg-card p-4">
                    <div>
                      <p className="text-sm font-semibold">Aktifkan SSO</p>
                      <p className="text-xs text-muted-foreground">Pengguna masuk menggunakan akun institusi.</p>
                    </div>
                    <Switch checked={allowSSO} onCheckedChange={setAllowSSO} aria-label="Aktifkan SSO" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between rounded-lg border border-muted/60 bg-card p-4">
                    <div>
                      <p className="text-sm font-semibold">Auto-provision akun</p>
                      <p className="text-xs text-muted-foreground">Setiap akun baru di domain sekolah otomatis memiliki akses.</p>
                    </div>
                    <Switch checked={autoProvision} onCheckedChange={setAutoProvision} aria-label="Aktifkan auto-provision" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Tes koneksi</Button>
                    <Button>Simpan pengaturan</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hak Akses & Peran</CardTitle>
                  <CardDescription>Atur level akses untuk guru, wali kelas, BK, dan admin.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-muted/60 bg-card p-4">
                    <p className="text-sm font-semibold">Guru</p>
                    <p className="text-xs text-muted-foreground">Manajemen kelas, intervensi, laporan detail.</p>
                  </div>
                  <div className="rounded-lg border border-muted/60 bg-card p-4">
                    <p className="text-sm font-semibold">BK & Konselor</p>
                    <p className="text-xs text-muted-foreground">Akses risk list siswa, catatan intervensi, dan log komunikasi.</p>
                  </div>
                  <div className="rounded-lg border border-muted/60 bg-card p-4">
                    <p className="text-sm font-semibold">Admin Sekolah</p>
                    <p className="text-xs text-muted-foreground">Pengaturan SSO, struktur kelas, dan integrasi data.</p>
                  </div>
                  <Button variant="outline">Kelola peran lanjutan</Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
