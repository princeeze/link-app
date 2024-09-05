import MobilePhone from "@/components/layout/mobilephone";
import Navbar from "@/components/layout/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-grey-light">
      <div className="mx-auto grid max-w-screen-2xl grid-rows-[auto,1fr] gap-4 p-4">
        <Navbar />
        <div className="flex h-full flex-col">
          <main className="grid flex-1 grid-cols-10 gap-4">
            <MobilePhone />
            <div className="col-span-6 flex min-h-0 w-full flex-grow overflow-y-auto rounded-md bg-white p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
