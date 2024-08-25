import { Suspense } from "react";

import MobilePhone from "@/components/layout/mobilephone";
import Navbar from "@/components/layout/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-screen flex-col gap-4 bg-grey-light p-4">
      <Navbar />
      <main className="flex flex-1 gap-4">
        <MobilePhone />
        <div className="flex max-h-full w-full overflow-y-scroll rounded-md bg-white p-10">
          {children}
        </div>
      </main>
    </section>
  );
}
