"use client";

import { useEffect } from "react";

import { getLinks } from "@/app/(dashboard)/links/links";
import { getProfile } from "@/app/(dashboard)/profile/profile";
import { SmileyMelting } from "@phosphor-icons/react";

import MobilePhone from "@/components/layout/mobilephone";
import { useFormDataStore } from "@/lib/store";
import { toast } from "@/hooks/use-toast";

export default function Page({ params }: { params: { portfolio: string } }) {
  const setProfileStore = useFormDataStore((state) => state.setProfileStore);
  const setAvatarURL = useFormDataStore((state) => state.setAvatarURL);
  const setLinkStore = useFormDataStore((state) => state.setLinkStore);

  const getData = async () => {
    const profileResult = await getProfile(params.portfolio);
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
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <MobilePhone />
    </div>
  );
}
