import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import {
  ActivityHistoryList,
  HistoryFilters,
  PersonnelHistoryList,
} from "@/components/history/history-lists";
import { getActivityHistory, getPersonnelHistory } from "@/lib/queries/reports";

type SearchParams = Promise<{ tab?: string; tanggal?: string; jenis?: string }>;

export default async function RiwayatPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const tab = params.tab === "kegiatan" ? "kegiatan" : "personil";

  const [personnel, activities] = await Promise.all([
    tab === "personil" ? getPersonnelHistory({ tanggal: params.tanggal }) : Promise.resolve([]),
    tab === "kegiatan"
      ? getActivityHistory({
          tanggal: params.tanggal,
          jenis: params.jenis === "GIAT_MASYARAKAT" || params.jenis === "UNRAS" ? params.jenis : undefined,
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-4">
      <PageHeader title="Riwayat Laporan" description="Lihat laporan yang sudah dikirim." backHref="/" />

      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#E8EEF8] p-1">
        <Link
          href={`/riwayat?tab=personil${params.tanggal ? `&tanggal=${params.tanggal}` : ""}`}
          className={`rounded-xl px-3 py-2.5 text-center text-sm font-semibold ${tab === "personil" ? "bg-white text-[#0B2C5F] shadow-sm" : "text-[#0B2C5F]/55"}`}
        >
          Personil
        </Link>
        <Link
          href={`/riwayat?tab=kegiatan${params.tanggal ? `&tanggal=${params.tanggal}` : ""}`}
          className={`rounded-xl px-3 py-2.5 text-center text-sm font-semibold ${tab === "kegiatan" ? "bg-white text-[#0B2C5F] shadow-sm" : "text-[#0B2C5F]/55"}`}
        >
          Kegiatan
        </Link>
      </div>

      <Card className="rounded-2xl border-0 p-4">
        <HistoryFilters tanggal={params.tanggal} jenis={tab === "kegiatan" ? params.jenis : undefined} tab={tab} />
      </Card>

      {tab === "personil" ? <PersonnelHistoryList items={personnel} /> : <ActivityHistoryList items={activities} />}
    </div>
  );
}
