import Link from "next/link";
import { Database, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { requireAdmin } from "@/lib/auth/session";

const links = [
  { href: "/admin/master", title: "Master Data", description: "Wilayah, gedung, shift, Korsec, PAMBI, dan contact person.", icon: Database },
  { href: "/admin/penugasan", title: "Penugasan Harian", description: "Atur Operational Commander, SCC, dan ESS yang bertugas hari ini.", icon: ShieldCheck },
];

export default async function AdminPage() {
  await requireAdmin();
  return (
    <div className="space-y-4">
      <PageHeader title="SCC Admin" description="Kelola master data dan penugasan harian." backHref="/" />
      <div className="grid gap-3">
        {links.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="rounded-2xl border-0 p-5 transition hover:-translate-y-0.5">
              <div className="flex gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#0B2C5F]/8 text-[#0B2C5F]">
                  <Icon className="size-5" aria-hidden />
                </div>
                <div>
                  <h2 className="font-semibold text-[#0B2C5F]">{title}</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      <Card className="rounded-2xl border-0 bg-[#0B2C5F] p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Catatan</p>
        <p className="mt-2 text-sm leading-6 text-white/90">
          Master aktif akan tersedia di form Korsec. Penugasan Operational Commander, SCC, dan ESS berubah sesuai hari dan dikelola SCC.
        </p>
      </Card>
    </div>
  );
}
