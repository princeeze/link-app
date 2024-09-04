import MobilePhone from "@/components/layout/mobilephone";
import Navbar from "@/components/layout/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-grey-light">
      <div className="mx-auto flex h-screen max-w-screen-2xl flex-col gap-4 p-4">
        <Navbar />
        <main className="flex flex-1 gap-4">
          <MobilePhone />
          <div className="flex max-h-full w-full overflow-y-scroll rounded-md bg-white p-10">
            {children}
          </div>
        </main>
      </div>
    </section>
  );
}
