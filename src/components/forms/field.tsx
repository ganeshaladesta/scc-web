import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
};

export function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const controlClassName = cn(
  "h-11 min-h-11 w-full rounded-xl border border-input bg-white px-3 text-base text-foreground shadow-none outline-none",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive",
);

export function NativeSelect({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select className={cn(controlClassName, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-size-[20px] bg-position-[right_12px_center] bg-no-repeat pr-10", className)} {...props}>
      {children}
    </select>
  );
}

