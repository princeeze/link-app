import Image from "next/image";
import logo from "@/public/logo.svg";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="bg-grey-light flex flex-col gap-[51px] items-center w-screen p-6 justify-center">
        <Link href="/">
          <Image src={logo} alt="logo" />
        </Link>
        <div className="flex flex-col p-10 rounded-xl bg-white gap-10">
          {children}
        </div>
      </div>
    </main>
  );
}
