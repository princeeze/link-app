"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import Card from "@/components/ui/card";
import { useFormDataStore } from "@/lib/store";

export default function MobilePhone() {
  const formData = useFormDataStore((state) => state.formData);
  const profileData = useFormDataStore((state) => state.profileData);

  const [preview, setPreview] = useState<string | undefined>();

  useEffect(() => {
    if (profileData?.avatar && profileData.avatar[0]) {
      const fileOrUrl = profileData.avatar[0];
      if (typeof fileOrUrl === "string") {
        setPreview(fileOrUrl);
      } else {
        setPreview(URL.createObjectURL(fileOrUrl));
      }
    }
  }, [profileData?.avatar]);

  return (
    <div className="col-span-4 hidden bg-white py-4 lg:inline">
      <div className="sticky top-[15vh] flex h-[80vh] w-full items-center justify-center rounded-xl">
        <div className="h-full">
          <svg
            viewBox="0 0 308 632"
            className="h-full"
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
        </div>
        <div className="absolute flex h-full w-[320px] flex-col items-center gap-8 px-8 pt-[9vh]">
          <div className="flex flex-col items-center gap-4">
            {preview ? (
              <Image
                src={preview}
                alt="User Avatar"
                width={100}
                height={100}
                className="h-20 w-20 rounded-full object-cover outline outline-4 outline-purple-default"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-[#EEEEEE]"></div>
            )}
            <div className="flex flex-col items-center gap-1">
              {profileData?.name ? (
                <span className="body-m text-[18px] font-semibold text-grey-dark">
                  {profileData.name}
                </span>
              ) : (
                <div className="h-3 w-32 rounded-full bg-[#EEEEEE]"></div>
              )}
              {profileData?.email ? (
                <span className="body-s text-grey-default">
                  {profileData.email}
                </span>
              ) : (
                <div className="mt-[1vh] h-1.5 w-20 rounded-full bg-[#EEEEEE]"></div>
              )}
            </div>
          </div>
          <div className="flex w-[30vh] flex-col gap-4">
            {formData.map((item: any) => {
              return (
                <Card
                  variant={item.platform}
                  link={item.link}
                  key={item.link}
                />
              );
            })}
            {Array.from({ length: 5 - formData.length }).map((_, i) => (
              <Card key={i} variant={undefined} link={undefined} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
