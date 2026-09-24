import { ClipboardList, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MenuCard } from "@/components/layout/menu-card";
import { requireUser } from "@/lib/auth/session";

export default async function Home() {
  const user = await requireUser();

  return (
    <div className="space-y-5">
      <Card className="rounded-3xl border-0 bg-white p-5 shadow-[0_10px_32px_rgba(11,44,95,0.08)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0B2C5F]/55">
              Security Command Center
            </p>
            <h1 className="mt-1 truncate text-xl font-bold text-[#0B2C5F]">
              Halo, {user.fullName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pilih data yang ingin kamu laporkan hari ini.
            </p>
          </div>
          <Badge variant="secondary">{user.role === "SCC_ADMIN" ? "SCC Admin" : "Korsec"}</Badge>
        </div>
      </Card>

      <section className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0B2C5F]/55">
            Laporan Harian
          </p>
          <h2 className="mt-1 text-lg font-bold text-[#0B2C5F]">Apa yang ingin Anda laporkan?</h2>
        </div>

        <MenuCard
          href="/personil"
          title="PERSONIL HARIAN"
          description="Isi jumlah personil berdasarkan wilayah, gedung, shift, dan Korsec."
          icon={<UsersRound className="size-6" aria-hidden />}
        />
        <MenuCard
          href="/kegiatan"
          title="KEGIATAN"
          description="Laporkan giat masyarakat atau unjuk rasa yang sedang berlangsung."
          icon={<ClipboardList className="size-6" aria-hidden />}
        />
      </section>
    </div>
  );
}
