import Image from "next/image";

import logoSmall from "@/public/logo-small.svg";

export default function DashboardLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Image src={logoSmall} alt="logo" className="animate-pulse" />
    </div>
  );
}
