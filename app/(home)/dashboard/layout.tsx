import MobilePhone from "@/components/layout/mobilephone";
import Navbar from "@/components/layout/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-grey-light p-6 flex flex-col gap-6 h-screen">
      <Navbar />
      <main className="flex flex-1">
        <MobilePhone />
        {children}
      </main>
    </section>
  );
}
