"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { logout } from "@/app/(auth)/auth-client";
import logo from "@/public/logo.svg";
import { Link as PLink, UserCircle } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="flex w-full items-center justify-between rounded-xl bg-white px-6 py-2">
      <Image src={logo} alt="logo" className="w-36" />
      <div className="flex gap-4">
        <Link
          className={cn(
            "heading-s flex items-center gap-2 rounded-lg px-[27px] py-[11px] hover:text-purple-default",
            pathname === "/dashboard/links"
              ? "bg-purple-light text-purple-default"
              : "bg-white text-grey-default",
          )}
          href={"/dashboard/links"}
        >
          <PLink weight="bold" />
          Links
        </Link>
        <Link
          className={cn(
            "heading-s flex items-center gap-2 rounded-lg px-[27px] py-[11px] hover:text-purple-default",
            pathname === "/dashboard/profile"
              ? "bg-purple-light text-purple-default"
              : "bg-white text-grey-default",
          )}
          href={"/dashboard/profile"}
        >
          <UserCircle weight="bold" />
          Profile
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={"destructive"}
          className="text-red hover:bg-red/10"
          onClick={handleLogout}
        >
          Logout
        </Button>
        <Button variant={"secondary"}>Preview</Button>
      </div>
    </div>
  );
}
