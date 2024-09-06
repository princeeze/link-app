"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  checkUsernameAvailability,
  getProfile,
  updateProfile,
} from "@/app/(home)/dashboard/profile/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FloppyDiskBack,
  Image as ImageIcon,
  LinkBreak,
  Spinner,
} from "@phosphor-icons/react";
import { useDebounce } from "@uidotdev/usehooks";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { profileFormSchema } from "@/lib/schema";
import { useFormDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function ProfileForm() {
  const [preview, setPreview] = useState<string | undefined>();
  const [validating, setValidating] = useState(false);
  const [validationResponse, setValidationResponse] = useState<string | null>(
    null,
  );
  const [formUser, setFormUser] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);

  //get profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);

      const result = await getProfile();
      if (result?.profile) {
        const { profile, avatarData } = result;
        form.reset({
          name: profile.name,
          username: profile.username,
          email: profile.email,
          avatar: avatarData,
        });
        setPreview(avatarData.publicUrl);
      } else {
        console.error("Failed to fetch profile data");
      }
      setProfileLoading(false);
    };
    fetchProfile();
  }, []);

  //define form
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
    },
  });
  const [loading, setLoading] = useState(false);

  //onSubmit
  async function onSubmit(data: z.infer<typeof profileFormSchema>) {
    console.log("formData:", data);
    console.log("avatar:", avatar);
    console.log("store:", profileData);
    const formText: z.infer<typeof profileFormSchema> = {
      name: data.name,
      username: data.username,
      email: data.email,
    };
    setLoading(true);
    if (validationResponse?.endsWith("available")) {
      try {
        const formData = new FormData();
        formData.append("file", data.avatar[0]);
        console.log(formData, formText);
        const result = await updateProfile(formData, formText);
        if (result) {
          toast({
            icon: (
              <FloppyDiskBack
                weight="fill"
                size={15}
                className="text-grey-default shadow-[2px_2px_0px_#FFFFFF]"
              />
            ),
            title: "Your changes have been successfully saved!",
          });
        }
      } catch (error) {
        toast({
          icon: (
            <LinkBreak weight="fill" size={20} className="text-grey-default" />
          ),
          title: `Couldn't Save, ${error}`,
        });
        console.error("File upload failed:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      console.error("Username is not available");
    }
  }

  //setup zustand to watch for changes
  const setProfileData = useFormDataStore((state) => state.setProfileData);
  const setAvatar = useFormDataStore((state) => state.setAvatar);
  const avatar = useFormDataStore((state) => state.avatar);
  const profileData = useFormDataStore((state) => state.profileData);
  const watch = useWatch({ control: form.control });
  useEffect(() => {
    setProfileData(watch);
  }, [watch, setProfileData]);

  //handle file upload preview
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setAvatar(preview);
    }
  }

  //USERNAME VALIDATION

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormUser(e.target.value); // Update username state
    // form.trigger("username"); //trigger username form validation
  }

  //debounce username validation
  const debouncedUsername = useDebounce(formUser, 1000);

  //validate username once debouncedusername changes
  useEffect(() => {
    if (debouncedUsername) {
      validateUsername(debouncedUsername);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedUsername]);

  const validateUsername = async (debouncedUsername: string) => {
    setValidationResponse(null);
    //run zod validation
    const currentValues = form.getValues();
    const validation = profileFormSchema.safeParse({
      ...currentValues,
      username: debouncedUsername,
    });

    if (!validation.error?.format().username) {
      setValidating(true);
      // Check if username is available
      const response = await checkUsernameAvailability(debouncedUsername);
      setValidationResponse(
        response
          ? `${debouncedUsername} is available`
          : `${debouncedUsername} is taken`,
      );
      setValidating(false);
    } else {
      console.error(
        "Username validation failed:",
        validation.error.format().username,
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem className="flex w-full items-center justify-between rounded-xl bg-grey-light p-5">
              <FormLabel className="body-m text-grey-default">
                Profile Picture
              </FormLabel>
              <div className="!m-0 flex items-center gap-6">
                <div className="relative h-44 w-44 cursor-pointer overflow-hidden rounded-xl">
                  <div className="absolute z-10 h-full w-full cursor-pointer bg-green-300 opacity-0">
                    <FormControl>
                      <Input
                        type="file"
                        className="h-full cursor-pointer"
                        //For some reason, react hook form needs this for file types
                        onChange={(e) => {
                          handleChange(e);
                          return field.onChange(e.target.files);
                        }}
                      />
                    </FormControl>
                  </div>
                  {preview ? (
                    <div className="relative h-full cursor-pointer">
                      <Image
                        src={preview}
                        width={100}
                        height={100}
                        objectFit="cover"
                        alt="Preview"
                        className="h-full w-full"
                      />
                      <div
                        className="absolute inset-0 flex w-full cursor-pointer flex-col items-center justify-center gap-2 bg-black/50 text-white"
                        // onClick={() => setPreview(undefined)}
                      >
                        <ImageIcon size={40} />
                        <span className="heading-s">Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-full cursor-pointer">
                      <div
                        className="absolute inset-0 flex w-full cursor-pointer flex-col items-center justify-center gap-2 bg-purple-light text-purple-default"
                        // onClick={() => setPreview(undefined)}
                      >
                        <ImageIcon size={40} />
                        <span className="heading-s">+ Upload Image</span>
                      </div>
                    </div>
                  )}
                </div>

                <FormDescription className="body-s max-w-[215px] text-grey-default">
                  Image must be below 1024x1024px. Use PNG or JPG format.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3 rounded-xl bg-grey-light p-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex w-full items-center justify-between">
                <FormLabel className="body-m text-grey-default">
                  Name*
                </FormLabel>
                <div className="relative flex items-center border-borders">
                  <FormControl>
                    <Input
                      type="text"
                      className="w-96 px-4"
                      placeholder="e.g. John"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="absolute right-4 top-1/2 -translate-y-1/2 transform" />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex w-full items-center justify-between">
                <FormLabel className="body-m text-grey-default">
                  Username*
                </FormLabel>
                <div className="relative flex items-center border-borders">
                  <FormControl>
                    <Input
                      type="text"
                      className="w-96 px-4"
                      placeholder="e.g. John"
                      onChange={(e) => {
                        handleUsernameChange(e);
                      }}
                      defaultValue={field.value}
                    />
                  </FormControl>
                  <FormMessage className="absolute right-4 top-1/2 -translate-y-1/2 transform" />
                  {validating && (
                    <Spinner
                      className="absolute right-4 top-4 animate-spin text-grey-default"
                      size={16}
                    />
                  )}
                  {validationResponse && (
                    <p
                      className={cn(
                        "body-s absolute right-4 top-1/2 -translate-y-1/2 transform",
                        {
                          "text-[#22c55e]":
                            validationResponse.endsWith("available"),
                          "text-red": validationResponse.endsWith("taken"),
                        },
                      )}
                    >
                      {validationResponse}
                    </p>
                  )}
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex w-full items-center justify-between">
                <FormLabel className="body-m text-grey-default">
                  Email
                </FormLabel>
                <div className="relative flex items-center border-borders">
                  <FormControl>
                    <Input
                      type="email"
                      className="w-96 px-4"
                      placeholder="e.g. email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="absolute right-4 top-1/2 -translate-y-1/2 transform" />
                </div>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading && <Spinner className="mr-2 animate-spin" size={16} />}
          Save
        </Button>
      </form>
    </Form>
  );
}
