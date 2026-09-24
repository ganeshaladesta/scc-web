import { PageHeader } from "@/components/layout/page-header";
import { ActivityForm } from "@/components/reports/activity-form";

export default function GiatMasyarakatPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Giat Masyarakat"
        description="Isi informasi kegiatan masyarakat yang sedang atau akan berlangsung."
        backHref="/kegiatan"
      />
      <ActivityForm jenis="GIAT_MASYARAKAT" />
    </div>
  );
}
