import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label: string;
  name: string;
  helper?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Pembungkus form-field generik untuk Input/Select/File.
 *
 * Contoh penggunaan:
 * ```tsx
 * <FormField label="Email" name="email" helper="Gunakan email sekolah" error={formError}>
 *   <Input id="email" name="email" type="email" autoComplete="email" required />
 * </FormField>
 *
 * <FormField label="Topik" name="topic">
 *   <Select onValueChange={setTopic}>
 *     <SelectTrigger id="topic" name="topic" />
 *     <SelectContent>
 *       <SelectItem value="algebra">Aljabar</SelectItem>
 *     </SelectContent>
 *   </Select>
 * </FormField>
 *
 * <FormField label="Upload materi" name="file">
 *   <Input id="file" name="file" type="file" accept=".pdf,.pptx" />
 * </FormField>
 * ```
 */
export const FormField = ({ label, name, helper, error, required, children, className }: FormFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-danger">*</span>}
        </Label>
        {helper && !error && <span className="text-xs text-muted-foreground">{helper}</span>}
      </div>
      <div className="group relative flex flex-col gap-2">
        {children}
        {error ? (
          <span className="text-xs font-medium text-danger">{error}</span>
        ) : (
          helper && <span className="text-xs text-muted-foreground sm:hidden">{helper}</span>
        )}
      </div>
    </div>
  );
};
