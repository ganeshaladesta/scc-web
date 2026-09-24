import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MenuCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href} className="block">
      <Card
        className={cn(
          "min-h-[132px] rounded-2xl border-0 bg-white p-5 shadow-[0_8px_30px_rgba(11,44,95,0.06)]",
          "transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(11,44,95,0.1)]",
        )}
      >
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[#0B2C5F]/8 text-[#0B2C5F]">
            {icon}
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-[#0B2C5F]">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

