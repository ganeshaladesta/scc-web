import { PageHeader } from "@/components/layout/page-header";
import { ActivityForm } from "@/components/reports/activity-form";

export default function UnrasPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Unjuk Rasa"
        description="Isi informasi aksi, lokasi, jumlah massa, dan kondisi situasi."
        backHref="/kegiatan"
      />
      <ActivityForm jenis="UNRAS" />
    </div>
  );
}
