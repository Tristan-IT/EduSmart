import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { DataTable, DataTableColumn } from "@/components/DataTable";
import { AlertMessage } from "@/components/AlertMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockReports, ReportSummary } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { Calendar, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Reports = () => {
  const [fromDate, setFromDate] = useState<string>("2025-01-01");
  const [toDate, setToDate] = useState<string>("2025-01-15");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [activeTab, setActiveTab] = useState<"pdf" | "csv">("pdf");

  const filteredReports = useMemo(() => {
    return mockReports.filter((report) => report.generatedAt >= `${fromDate}T00:00:00Z` && report.generatedAt <= `${toDate}T23:59:59Z`);
  }, [fromDate, toDate]);

  useEffect(() => {
    if (!isGenerating) return;
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 12;
        if (next >= 100) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          setIsGenerating(false);
          return 100;
        }
        return next;
      });
    }, 300);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isGenerating]);

  const handleGenerate = () => {
    setProgress(0);
    setIsGenerating(true);
  };

  const columns: DataTableColumn<ReportSummary>[] = [
    {
      key: "title",
      header: "Judul Laporan",
      render: (row) => (
        <div className="space-y-1">
          <p className="font-semibold">{row.title}</p>
          <p className="text-xs text-muted-foreground">Dibuat {new Date(row.generatedAt).toLocaleString("id-ID")}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Tipe",
      render: (row) => (
        <Badge variant="secondary" className="capitalize">
          {row.type === "kelas" ? "Laporan Kelas" : row.type === "individu" ? "Individu" : "Ringkasan"}
        </Badge>
      ),
    },
    {
      key: "filters",
      header: "Filter",
      render: (row) => (
        <div className="space-y-1 text-xs text-muted-foreground">
          {Object.entries(row.filters).map(([key, value]) => (
            <p key={key}>
              <span className="font-medium capitalize">{key}</span>: {value}
            </p>
          ))}
        </div>
      ),
    },
    {
      key: "url",
      header: "Aksi",
      align: "right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline">
            Pratinjau
          </Button>
          <Button size="sm">{activeTab === "pdf" ? "Download PDF" : "Download CSV"}</Button>
        </div>
      ),
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar role="teacher" />
      <main className="flex-1 w-full">
        {/* Header */}
        <motion.div 
          className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex h-16 items-center gap-4 px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-3 flex-1">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Laporan & Ekspor
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container px-6 py-8 max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Pilih rentang tanggal, lihat pratinjau data, dan ekspor ke PDF atau CSV untuk dibagikan ke pemangku kepentingan.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Rentang Data</CardTitle>
                <CardDescription>Gunakan rentang yang sempit untuk hasil ekspor yang lebih cepat.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 md:flex-row md:items-end">
                <div className="flex flex-1 flex-col gap-2">
                  <label htmlFor="from-date" className="text-sm font-medium text-foreground">
                    Dari
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="from-date" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <label htmlFor="to-date" className="text-sm font-medium text-foreground">
                    Hingga
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="to-date" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:w-40">
                  <label className="text-sm font-medium text-foreground">Format</label>
                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "pdf" | "csv")}> 
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="pdf">PDF</TabsTrigger>
                      <TabsTrigger value="csv">CSV</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <Button onClick={handleGenerate} disabled={isGenerating} className="w-full md:w-auto">
                  {isGenerating ? "Mengolah..." : "Generate laporan"}
                </Button>
              </CardContent>
            </Card>

            {isGenerating && (
              <AlertMessage
                type="info"
                title="Sedang memproses laporan"
                message="Tetap di halaman ini sampai proses selesai untuk memastikan file terunduh dengan benar."
              />
            )}

            <Card>
              <CardHeader>
                <CardTitle>Pratinjau</CardTitle>
                <CardDescription>
                  Progress pembuatan laporan menampilkan estimasi waktu selesai. File akan otomatis tersedia setelah 100%.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress} className="h-3" />
                <div className="rounded-lg border border-muted/60 bg-card p-4">
                  <p className="text-sm font-semibold">Ringkasan kelas</p>
                  <p className="text-xs text-muted-foreground">
                    Statistik penguasaan jalur belajar dan daftar siswa yang memerlukan intervensi dalam rentang tanggal terpilih.
                  </p>
                </div>
              </CardContent>
            </Card>

            <DataTable
              columns={columns}
              rows={filteredReports}
              sortable
              emptyMessage="Belum ada laporan pada rentang ini. Coba perluas rentang tanggal atau generate laporan baru."
            />
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Reports;
