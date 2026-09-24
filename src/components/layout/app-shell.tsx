import { BottomNav } from "@/components/layout/bottom-nav";
import { BrandMark } from "@/components/layout/brand-mark";
import type { AuthUserContext } from "@/types/database";

export function AppShell({
  user,
  children,
}: {
  user: AuthUserContext;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[#F4F7FB]">
      <div className="bg-linear-to-br from-[#0B2C5F] via-[#123A73] to-[#1B4F9C] px-4 pb-8 pt-[calc(env(safe-area-inset-top)+16px)]">
        <div className="mx-auto max-w-md">
          <BrandMark compact />
        </div>
      </div>
      <main className="relative mx-auto -mt-4 w-full max-w-md px-4 pb-28">{children}</main>
      <BottomNav role={user.role} />
    </div>
  );
}

