"use client";

import { FloppyDiskBack } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ToastExample() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() => {
        toast({
          icon: (
            <FloppyDiskBack
              weight="fill"
              size={15}
              className="text-grey-default shadow-[2px_2px_0px_#FFFFFF]"
            />
          ),
          title: "Saved succesfully!",
        });
      }}
    >
      Show Toast
    </Button>
  );
}
