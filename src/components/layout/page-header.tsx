import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function PageHeader({
  title,
  description,
  backHref,
}: {
  title: string;
  description?: string;
  backHref?: string;
}) {
  return (
    <header className="mb-5">
      {backHref ? (
        <Link
          href={backHref}
          className="mb-3 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Kembali
        </Link>
      ) : null}
      <h1 className="text-xl font-semibold tracking-tight text-[#0B2C5F]">{title}</h1>
      {description ? (
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      ) : null}
    </header>
  );
}

