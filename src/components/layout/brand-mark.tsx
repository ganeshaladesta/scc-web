import { Shield } from "lucide-react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
        <Shield className="size-5" aria-hidden />
      </div>
      <div className="leading-tight">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-white/70">
          BANK INDONESIA
        </p>
        <p className={compact ? "text-sm font-semibold text-white" : "text-base font-semibold text-white"}>
          SECURITY COMMAND CENTER
        </p>
      </div>
    </div>
  );
}

