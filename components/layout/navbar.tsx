"use client";

import Image from "next/image";
import logo from "@/public/logo.svg";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Link as PLink, UserCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="bg-white flex justify-between items-center w-full px-6 py-2  rounded-xl">
      <Image src={logo} alt="logo" className="w-36" />
      <div className="flex gap-4">
        <Link
          className={cn(
            " rounded-lg px-[27px] heading-s flex items-center gap-2 hover:text-purple-default py-[11px]",
            pathname === "/dashboard/links"
              ? "text-purple-default bg-purple-light"
              : "text-grey-default bg-white"
          )}
          href={"/dashboard/links"}
        >
          <PLink weight="bold" />
          Links
        </Link>
        <Link
          className={cn(
            " rounded-lg px-[27px] heading-s flex items-center gap-2 hover:text-purple-default py-[11px]",
            pathname === "/dashboard/profile"
              ? "text-purple-default bg-purple-light"
              : "text-grey-default bg-white"
          )}
          href={"/dashboard/profile"}
        >
          <UserCircle weight="bold" />
          Profile
        </Link>
      </div>
      <Button variant={"secondary"}>Preview</Button>
    </div>
  );
}
