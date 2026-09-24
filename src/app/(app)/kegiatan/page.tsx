import { Megaphone, UsersRound } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { MenuCard } from "@/components/layout/menu-card";

export default function KegiatanPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Kegiatan"
        description="Pilih jenis kegiatan yang ingin dilaporkan. Keduanya bersifat opsional."
        backHref="/"
      />
      <div className="space-y-3">
        <MenuCard
          href="/kegiatan/masyarakat"
          title="GIAT MASYARAKAT"
          description="Pameran, olahraga, konser, acara publik, dan kegiatan masyarakat lainnya."
          icon={<UsersRound className="size-6" aria-hidden />}
        />
        <MenuCard
          href="/kegiatan/unras"
          title="UNJUK RASA"
          description="Laporkan aksi, lokasi, jumlah massa, dan tingkat perhatian situasi."
          icon={<Megaphone className="size-6" aria-hidden />}
        />
      </div>
    </div>
  );
}
