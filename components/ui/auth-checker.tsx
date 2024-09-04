"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { checkAuth } from "@/app/(auth)/auth";
import { Confetti } from "@phosphor-icons/react";
import { Warning } from "@phosphor-icons/react/dist/ssr";

import { toast } from "@/hooks/use-toast";

export default function AuthChecker() {
  const router = useRouter();
  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      // Check auth and get session and error
      const { session, error } = await checkAuth();

      // If there is an error, toast the error and redirect to login
      if (error) {
        toast({
          icon: (
            <Warning weight="fill" size={20} className="text-grey-default" />
          ),
          title: error.toString(),
        });

        router.push("/login");
      }

      // If there is no session, redirect to login
      if (session == null) {
        router.push("/login");
      }

      // If there is a session, toast the success
      if (session) {
        console.log(session);
        toast({
          icon: (
            <Confetti weight="fill" size={20} className="text-grey-default" />
          ),
          title: "Welcome back!",
        });
      }
    };

    // Call the function when the component mounts
    checkSessionAndRedirect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
