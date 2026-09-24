import { CircleAlert, Inbox } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#0B2C5F]/15 bg-white px-6 py-10 text-center">
      <Inbox className="mb-3 size-8 text-[#0B2C5F]/40" aria-hidden />
      <p className="font-medium text-[#0B2C5F]">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>{message}</p>
    </div>
  );
}

export function SuccessSummary({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(11,44,95,0.06)]">
      <p className="text-sm font-semibold text-emerald-700">{title}</p>
      <dl className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-4 text-sm">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="text-right font-medium text-[#0B2C5F]">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

