"use client";

import { useState } from "react";

import { Eye } from "@phosphor-icons/react";

import MobilePhone from "@/components/layout/mobilephone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ResponsiveMobilePhone() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed z-40 h-0 w-0 sm:hidden">
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed inset-x-0 bottom-1 z-10 mx-auto flex w-min gap-2"
      >
        <Eye weight="bold" size={20} />
        Preview
      </Button>
      <div
        className={cn(
          "fixed inset-0 h-screen w-screen bg-white/70 backdrop-blur-[145px]",
          {
            hidden: !isOpen,
          },
        )}
      >
        Mobile Phone is here
        <MobilePhone />
      </div>
    </div>
  );
}
