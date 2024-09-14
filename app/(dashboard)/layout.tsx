import MobilePhone from "@/components/layout/mobilephone";
import Navbar from "@/components/layout/navbar";
import ResponsiveMobilePhone from "@/components/layout/responsive-mobile-phone";

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
            <div className="col-span-10 flex min-h-0 w-full flex-grow rounded-md bg-white p-4 sm:p-8 lg:col-span-6">
              {children}
            </div>
          </main>
        </div>
        <ResponsiveMobilePhone />
      </div>
    </section>
  );
}
