import { PageHeader } from "@/components/layout/page-header";
import { DailyAssignmentForm } from "@/components/admin/daily-assignment-form";
import { getAdminMasters } from "@/lib/queries/masters";
import { getDailyAssignments } from "@/lib/actions/masters";
import { todayISODate } from "@/lib/format";

export default async function AdminPenugasanPage() {
  const masters = await getAdminMasters();
  const initial = await getDailyAssignments(todayISODate());

  return (
    <div className="space-y-4">
      <PageHeader title="Penugasan Harian" description="Tentukan siapa yang bertugas sebagai Operational Commander, SCC, dan ESS." backHref="/admin" />
      <DailyAssignmentForm contacts={masters.contact} initial={initial} />
    </div>
  );
}
