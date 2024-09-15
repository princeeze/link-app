"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { getLinks } from "@/app/(dashboard)/links/links";
import { getProfile } from "@/app/(dashboard)/profile/profile";
import bgFilter from "@/public/bg-filter.svg";
import logoSmall from "@/public/logo-small.svg";
import { ClipboardText, Share, SmileyMelting } from "@phosphor-icons/react";

import { Button, buttonVariants } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { useFormDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function Page({ params }: { params: { portfolio: string } }) {
  const setProfileStore = useFormDataStore((state) => state.setProfileStore);
  const setAvatarURL = useFormDataStore((state) => state.setAvatarURL);
  const setLinkStore = useFormDataStore((state) => state.setLinkStore);
  const linkStore = useFormDataStore((state) => state.linkStore);
  const profileStore = useFormDataStore((state) => state.profileStore);
  const avatarURL = useFormDataStore((state) => state.avatarURL);
  const fetchedData = useFormDataStore((state) => state.fetchedData);
  const setFetchedData = useFormDataStore((state) => state.setFetchedData);
  const [authStatus, setAuthStatus] = useState(false);

  const getData = async () => {
    const profileResult = await getProfile(params.portfolio);

    setAuthStatus(profileResult.authStatus);

    if (profileResult?.profile && profileResult.profile.length > 0) {
      const firstProfile = profileResult.profile[0];
      setProfileStore({
        name: firstProfile.name,
        username: firstProfile.username,
        email: firstProfile.email,
        // avatar: firstProfile.avatar,
      });
      if (firstProfile.avatar) {
        setAvatarURL(profileResult.avatarData?.publicUrl);
      }
    }

    //fetch links from supabase
    const linkResult = await getLinks(params.portfolio);
    if (Array.isArray(linkResult)) {
      setLinkStore(linkResult);
    } else {
      toast({
        title: `Couldn't fetch links: ${linkResult.error}`,
        icon: (
          <SmileyMelting
            weight="fill"
            size={20}
            className="text-grey-default"
          />
        ),
      });
    }

    setFetchedData(true);
  };

  useEffect(() => {
    if (fetchedData === false) {
      getData();
    }
  }, []);

  const handleShare = () => {
    if (profileStore.username) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        icon: (
          <ClipboardText
            weight="fill"
            size={20}
            className="animate-bounce text-grey-default duration-500"
          />
        ),
        title: "Copied to clipboard!",
      });
    } else {
      toast({
        icon: (
          <SmileyMelting
            weight="fill"
            size={20}
            className="text-grey-default"
          />
        ),
        title: "This profile isn't ready",
      });
    }
  };

  return (
    <div className="relative">
      <div className="fixed inset-0 -z-10 h-screen w-screen">
        {avatarURL && (
          <Image
            src={avatarURL}
            alt="User Avatar Background"
            fill={true}
            className="object-cover"
          />
        )}
        <div>
          <Image
            src={bgFilter}
            alt="User Avatar filter"
            fill={true}
            className="z-10 object-cover backdrop-blur-[20px]"
          />
        </div>
      </div>
      <div className="sticky top-1 z-10 flex w-full justify-between px-4 py-2 sm:px-6">
        <Link
          href="/links"
          className={cn(
            buttonVariants({
              variant: "secondary",
            }),
            "bg-transparent",
          )}
        >
          {authStatus ? (
            "Back to Editor"
          ) : (
            <span className="flex items-center gap-1">
              <Image src={logoSmall} width={20} height={20} alt="logo" />
              Join {params.portfolio} on DevLinks
            </span>
          )}
        </Link>
        <Button
          variant={"default"}
          className="flex gap-2 px-3 py-3 sm:px-[27px] sm:py-[11px]"
          onClick={handleShare}
        >
          <Share weight="bold" size={20} />
          <span>Share</span>
        </Button>
      </div>
      <div className="y-8 flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          {avatarURL ? (
            <div className="relative h-32 w-32 overflow-clip rounded-full">
              <Image
                src={avatarURL}
                alt="User Avatar"
                fill={true}
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className={cn(
                "h-32 w-32 rounded-full",
                fetchedData === false
                  ? "animate-pulse bg-[#EEEEEE]"
                  : "bg-[#EEEEEE]",
              )}
            ></div>
          )}
          <div className="flex flex-col items-center gap-1">
            {profileStore.name ? (
              <span className="body-m text-xl font-semibold text-grey-dark">
                {profileStore.name}
              </span>
            ) : (
              <div
                className={cn(
                  "h-3 w-32 rounded-full",
                  fetchedData === false
                    ? "animate-pulse bg-[#EEEEEE]"
                    : "bg-[#EEEEEE]",
                )}
              ></div>
            )}
            {profileStore.email ? (
              <span className="body-s text-l text-grey-default">
                {profileStore.email}
              </span>
            ) : (
              <div
                className={cn(
                  "mt-[1vh] h-1.5 w-20 rounded-full",
                  fetchedData === false
                    ? "animate-pulse bg-[#EEEEEE]"
                    : "bg-[#EEEEEE]",
                )}
              ></div>
            )}
          </div>
        </div>
        <div className="flex w-full max-w-md flex-col gap-4 px-6">
          {linkStore.map((item: any) => {
            return (
              <Card
                variant={item.platform}
                link={item.link}
                key={`${item.platform}-${Math.random().toString(36).slice(7)}`}
                className="py-5"
              />
            );
          })}
          {fetchedData === false &&
            Array.from({ length: 5 }).map((_, i) => (
              <Card
                key={i}
                variant={undefined}
                link={undefined}
                className="animate-pulse py-5"
              />
            ))}
        </div>
      </div>
    </div>
  );
}
