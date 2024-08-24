"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import profile from "@/public/image.png";

import Card from "@/components/ui/card";
import { useFormDataStore } from "@/lib/store";

export default function MobilePhone() {
  const formData = useFormDataStore((state) => state.formData);
  const profileData = useFormDataStore((state) => state.profileData);

  const [preview, setPreview] = useState<string | undefined>();

  useEffect(() => {
    if (profileData?.avatar && profileData.avatar[0]) {
      const file = profileData.avatar[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [profileData?.avatar]);

  return (
    <div className="relative hidden h-full w-2/5 items-baseline justify-center rounded-xl bg-white py-4 md:flex">
      <svg
        height="100"
        className="h-[450px]"
        viewBox="0 0 308 632"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 54.5C1 24.9528 24.9528 1 54.5 1H253.5C283.047 1 307 24.9528 307 54.5V577.5C307 607.047 283.047 631 253.5 631H54.5C24.9528 631 1 607.047 1 577.5V54.5Z"
          stroke="#737373"
        />
        <path
          d="M12 55.5C12 30.9233 31.9233 11 56.5 11H80.5C86.8513 11 92 16.1487 92 22.5C92 30.5081 98.4919 37 106.5 37H201.5C209.508 37 216 30.5081 216 22.5C216 16.1487 221.149 11 227.5 11H251.5C276.077 11 296 30.9233 296 55.5V576.5C296 601.077 276.077 621 251.5 621H56.5C31.9233 621 12 601.077 12 576.5V55.5Z"
          fill="white"
          stroke="#737373"
        />
      </svg>
      <div className="absolute flex h-full min-w-[60%] max-w-40 flex-col items-center gap-10 pt-[70px]">
        <div className="flex flex-col items-center gap-5">
          <Image
            src={preview}
            alt="profile"
            width={100}
            height={100}
            className="h-16 w-16 rounded-full object-cover outline outline-4 outline-purple-default"
          />
          <div className="flex flex-col items-center gap-1">
            <span className="body-m text-[18px] font-semibold text-grey-dark">
              {profileData?.name}
            </span>
            <span className="body-s text-grey-default">
              {profileData?.email}
            </span>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4">
          {formData.map((item: any) => {
            return (
              <Card variant={item.platform} link={item.link} key={item.link} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
