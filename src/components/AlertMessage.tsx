import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type AlertType = "success" | "info" | "warning" | "danger";

export interface AlertMessageProps {
  type?: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

/**
 * Contoh penggunaan:
 * ```tsx
 * <AlertMessage
 *   type="success"
 *   title="Berhasil"
 *   message="Intervensi terkirim ke wali kelas."
 *   onClose={() => setOpen(false)}
 * />
 * ```
 */
export const AlertMessage = ({ type = "info", title, message, onClose, className }: AlertMessageProps) => {
  const colorMap: Record<AlertType, string> = {
    success: "bg-success/10 border-success/30 text-success",
    info: "bg-info/10 border-info/30 text-info",
    warning: "bg-warning/10 border-warning/30 text-warning",
    danger: "bg-danger/10 border-danger/30 text-danger",
  };

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-sm",
        colorMap[type],
        className,
      )}
    >
      <div className="flex-1 space-y-1">
        {title && <p className="text-sm font-semibold text-current">{title}</p>}
        <p className="text-sm text-current/90">{message}</p>
      </div>
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-current hover:bg-current/10"
          aria-label="Tutup notifikasi"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
