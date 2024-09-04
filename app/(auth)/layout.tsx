import Image from "next/image";
import Link from "next/link";

import logo from "@/public/logo.svg";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen items-center bg-grey-light">
      <div className="flex w-full flex-col items-center justify-center gap-[51px] p-6">
        <Link href="/">
          <Image src={logo} alt="logo" priority={true} />
        </Link>
        <div className="flex flex-col gap-10 rounded-xl bg-white p-10">
          {children}
        </div>
      </div>
    </main>
  );
}
