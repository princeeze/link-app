"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { logout } from "@/app/(auth)/auth-client";
import logoSmall from "@/public/logo-small.svg";
import logo from "@/public/logo.svg";
import {
  Eye,
  Link as LinkLogo,
  SignOut,
  Smiley,
  SmileyMelting,
  UserCircle,
} from "@phosphor-icons/react";

import { Button, buttonVariants } from "@/components/ui/button";
import { useFormDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSticky, setIsSticky] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const resetStore = useFormDataStore((state) => state.resetStore);
  const profileStore = useFormDataStore((state) => state.profileStore);

  const handleLogout = async () => {
    // clear stores
    resetStore();
    await logout();

    toast({
      icon: <Smiley weight="fill" size={20} className="text-grey-default" />,
      title: "Sign in soon!",
    });
    router.push("/");
  };

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > 100) {
        // If scrolling down and the scroll position is beyond a threshold
        setIsSticky(true);
      } else {
        // If scrolling up
        setIsSticky(false);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  const handleNoProfile = () => {
    toast({
      icon: (
        <SmileyMelting weight="fill" size={20} className="text-grey-default" />
      ),
      title: "You need a username to preview",
    });
  };

  return (
    <div
      className={cn(
        "z-20 flex w-full items-center justify-between rounded-xl bg-white px-3 py-2 transition-all duration-300 ease-in-out sm:px-6",
        isSticky ? "sticky top-0 bg-white" : "bg-white",
      )}
    >
      <Image src={logo} alt="logo" className="hidden w-36 sm:inline" />
      <Image src={logoSmall} alt="logo" className="sm:hidden" />
      <div className="flex sm:gap-4">
        <Link
          className={cn(
            "heading-s flex items-center gap-2 rounded-lg px-6 py-[11px] hover:text-purple-default sm:px-[27px]",
            pathname === "/links"
              ? "bg-purple-light text-purple-default"
              : "bg-white text-grey-default",
          )}
          href={"/links"}
        >
          <LinkLogo weight="bold" className="h-5 w-5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline"> Links</span>
        </Link>
        <Link
          className={cn(
            "heading-s flex items-center gap-2 rounded-lg px-6 py-[11px] hover:text-purple-default sm:px-[27px]",
            pathname === "/profile"
              ? "bg-purple-light text-purple-default"
              : "bg-white text-grey-default",
          )}
          href={"/profile"}
        >
          <UserCircle weight="bold" className="h-5 w-5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline"> Profile</span>
        </Link>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant={"destructive"}
          className="px-2 text-red hover:bg-red/10 sm:px-4"
          onClick={handleLogout}
        >
          <SignOut weight="bold" size={20} />
        </Button>
        {profileStore.username ? (
          <Link
            className={buttonVariants({
              variant: "secondary",
            })}
            href={`/${profileStore.username}`}
          >
            <Eye weight="bold" size={20} className="sm:hidden" />
            <span className="hidden sm:inline">Preview</span>
          </Link>
        ) : (
          <Button variant={"secondary"} onClick={handleNoProfile}>
            <Eye weight="bold" size={20} className="sm:hidden" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
        )}
      </div>
    </div>
  );
}
