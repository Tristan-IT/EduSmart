import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/apiClient";
import { AlertMessage } from "@/components/AlertMessage";

interface SemesterToggleProps {
  currentSemester: 1 | 2;
  onSemesterChange: (newSemester: 1 | 2) => void;
  disabled?: boolean;
}

export function SemesterToggle({ currentSemester, onSemesterChange, disabled }: SemesterToggleProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(currentSemester);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSemesterClick = (semester: 1 | 2) => {
    if (semester === currentSemester || disabled) return;
    setSelectedSemester(semester);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);

      await apiClient.post("/api/student/switch-semester", {
        semester: selectedSemester,
      });

      onSemesterChange(selectedSemester);
      setShowConfirm(false);
    } catch (err: any) {
      console.error("Error switching semester:", err);
      setError(err.message || "Gagal mengubah semester");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-lg">
        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onClick={() => handleSemesterClick(1)}
          disabled={disabled}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
            currentSemester === 1
              ? "bg-white shadow-sm text-primary"
              : "text-muted-foreground hover:text-foreground"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Semester 1
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onClick={() => handleSemesterClick(2)}
          disabled={disabled}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
            currentSemester === 2
              ? "bg-white shadow-sm text-primary"
              : "text-muted-foreground hover:text-foreground"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Semester 2
          </div>
        </motion.button>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Semester?</DialogTitle>
            <DialogDescription>
              Anda akan beralih dari Semester {currentSemester} ke Semester {selectedSemester}.
              Jalur pembelajaran akan disesuaikan dengan semester baru.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <AlertMessage type="danger" message={error} onClose={() => setError(null)} />
          )}

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Yang akan berubah:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Materi pembelajaran sesuai semester {selectedSemester}</li>
                  <li>• Jalur pembelajaran tersedia</li>
                  <li>• Rekomendasi konten belajar</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button onClick={handleConfirm} disabled={loading}>
              {loading ? "Mengubah..." : "Ya, Ubah Semester"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
