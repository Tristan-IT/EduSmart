import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { Fragment } from "react";

export type StepStatus = "pending" | "active" | "complete" | "disabled";

export interface StepItem {
  /** Label utama yang ditampilkan pada step */
  title: string;
  /** Deskripsi singkat yang membantu pengguna memahami konteks step */
  description?: string;
  /** Status override. Jika tidak diisi akan dihitung berdasarkan `activeIndex`. */
  status?: StepStatus;
}

export interface StepperProps {
  /** Deretan step yang akan ditampilkan dalam stepper. */
  steps: StepItem[];
  /** Indeks step yang sedang aktif (dimulai dari 0). */
  activeIndex: number;
  /** Orientasi tampilan stepper. Default horizontal. */
  orientation?: "horizontal" | "vertical";
  /** Apakah step dapat diklik untuk navigasi. */
  interactive?: boolean;
  /** Callback ketika step diklik. */
  onStepClick?: (index: number) => void;
  /** Kelas tambahan untuk kustomisasi. */
  className?: string;
}

/**
 * Contoh penggunaan:
 * ```tsx
 * <Stepper
 *   steps={[
 *     { title: "Diagnostik", description: "10 soal adaptif" },
 *     { title: "Rekomendasi", description: "Jalur belajar personal" },
 *     { title: "Mulai Latihan" },
 *   ]}
 *   activeIndex={1}
 *   orientation="horizontal"
 *   onStepClick={(index) => setCurrent(index)}
 * />
 * ```
 */
export const Stepper = ({
  steps,
  activeIndex,
  orientation = "horizontal",
  interactive = false,
  onStepClick,
  className,
}: StepperProps) => {
  const isHorizontal = orientation === "horizontal";

  const renderConnector = (isLast: boolean) => {
    if (isLast) return null;
    return (
      <span
        aria-hidden
        className={cn(
          "bg-border",
          isHorizontal ? "h-px flex-1" : "w-px h-8 self-center",
        )}
      />
    );
  };

  return (
    <ol
      className={cn(
        "flex gap-4",
        isHorizontal ? "flex-row" : "flex-col",
        className,
      )}
    >
      {steps.map((step, index) => {
        const resolvedStatus = step.status ??
          (index < activeIndex ? "complete" : index === activeIndex ? "active" : "pending");
        const isDisabled = resolvedStatus === "disabled";
        const baseButtonClasses = cn(
          "flex min-w-[7rem] flex-col gap-1 rounded-lg border bg-card p-3 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          {
            "border-accent/60 bg-accent/10 text-accent-foreground": resolvedStatus === "complete",
            "border-primary/60 bg-primary/5": resolvedStatus === "active",
            "border-border/70 text-muted-foreground": resolvedStatus === "pending",
            "pointer-events-none opacity-50": isDisabled,
          },
        );

        const iconClasses = cn("h-5 w-5", {
          "text-accent": resolvedStatus === "complete",
          "text-primary": resolvedStatus === "active",
          "text-muted-foreground": resolvedStatus === "pending",
        });

        const content = (
          <Fragment>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border",
                  resolvedStatus === "complete" && "border-accent bg-accent/10 text-accent",
                  resolvedStatus === "active" && "border-primary bg-primary/10 text-primary",
                  resolvedStatus === "pending" && "border-border text-muted-foreground",
                  isDisabled && "border-border/50 text-muted-foreground",
                )}
              >
                {resolvedStatus === "complete" ? (
                  <CheckCircle2 className={iconClasses} />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{step.title}</p>
                {step.description && (
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                )}
              </div>
            </div>
          </Fragment>
        );

        return (
          <li key={step.title} className={cn("flex items-center", isHorizontal ? "gap-4" : "gap-2")}
          >
            {interactive ? (
              <button
                type="button"
                className={baseButtonClasses}
                onClick={() => onStepClick?.(index)}
                aria-pressed={index === activeIndex}
                disabled={isDisabled}
              >
                {content}
              </button>
            ) : (
              <div className={baseButtonClasses} aria-current={index === activeIndex ? "step" : undefined}>
                {content}
              </div>
            )}
            {renderConnector(index === steps.length - 1)}
          </li>
        );
      })}
    </ol>
  );
};
