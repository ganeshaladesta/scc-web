import { PageHeader } from "@/components/layout/page-header";
import { PersonnelForm } from "@/components/reports/personnel-form";
import { getActiveMastersForPersonnel } from "@/lib/queries/masters";

export default async function PersonnelPage() {
  const masters = await getActiveMastersForPersonnel();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Personil Harian"
        description="Pilih wilayah, gedung, shift, dan Korsec sesuai kondisi jaga hari ini."
        backHref="/"
      />
      <PersonnelForm {...masters} />
    </div>
  );
}
