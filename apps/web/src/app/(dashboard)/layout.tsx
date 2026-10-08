import { SiteHeader } from "@/components/shared/site-header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        {children}
      </main>
    </>
  );
}
