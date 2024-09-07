"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { getLinks } from "@/app/(home)/dashboard/links/links";
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
  SmileyMelting,
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
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { Separator } from "@/components/ui/separator";
import { profileFormSchema } from "@/lib/schema";
import { useFormDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function ProfileForm() {
  const [validating, setValidating] = useState(false);
  const [validationResponse, setValidationResponse] = useState<string | null>(
    null,
  );
  const [formUser, setFormUser] = useState("");
  const loadingStates = [
    {
      text: "Connecting to Supabase",
    },
    {
      text: "Searching for your profile",
    },
    {
      text: "Found you",
    },
    {
      text: "Fetching your details",
    },
    {
      text: "Locking down your links",
    },
    {
      text: "Trying again 🤦‍♂️",
    },
  ];

  //define react hook form
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
    },
  });
  const { isDirty } = form.formState;
  const [loading, setLoading] = useState(false);

  //fetch data from supabase
  useEffect(() => {
    if (fetchedData === false) {
      getData();
    } else {
      form.reset({
        name: profileStore.name,
        email: profileStore.email,
        username: profileStore.username,
      });
      setTimeout(() => {
        form.setValue("username", profileStore.username);
      }, 0);
    }

    async function getData() {
      // fetch profile from supabase

      const profileResult = await getProfile();
      if (profileResult?.profile && profileResult.profile.length > 0) {
        const firstProfile = profileResult.profile[0];
        form.reset({
          name: firstProfile.name,
          username: firstProfile.username,
          email: firstProfile.email,
          // avatar: firstProfile.avatar,
        });
        if (firstProfile.avatar) {
          setAvatarURL(profileResult.avatarData?.publicUrl);
        }
        // setAvatarURL(avatarData.publicUrl);
      }
      //fetch links from supabase
      const linkResult = await getLinks();
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
    }
  }, []);

  //onSubmit
  async function onSubmit(data: z.infer<typeof profileFormSchema>) {
    console.log("formData:", data);
    console.log("avatar:", avatarURL);
    console.log("store:", profileStore);
    const formText: z.infer<typeof profileFormSchema> = {
      name: data.name,
      username: data.username,
      email: data.email,
    };
    setLoading(true);
    if (validationResponse?.endsWith("available")) {
      try {
        let result: any = null;
        const formData = new FormData();
        if (
          data.avatar &&
          data.avatar.length > 0 &&
          data.avatar[0] !== undefined
        ) {
          formData.append("file", data.avatar[0]);
          console.log(formData, formText);
          result = await updateProfile(formText, formData);
        } else if (avatarURL) {
          const formTextWithAvatar: z.infer<typeof profileFormSchema> = {
            ...formText,
            avatar: avatarURL.replace(/^.*\/avatars\//, ""),
          };
          result = await updateProfile(formTextWithAvatar);
        }

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
      toast({
        icon: (
          <LinkBreak weight="fill" size={20} className="text-grey-default" />
        ),
        title: `That username might not be available`,
      });
    }
  }

  //setup zustand to watch for changes
  const setProfileStore = useFormDataStore((state) => state.setProfileStore);
  const setAvatarURL = useFormDataStore((state) => state.setAvatarURL);
  const avatarURL = useFormDataStore((state) => state.avatarURL);
  const fetchedData = useFormDataStore((state) => state.fetchedData);
  const setFetchedData = useFormDataStore((state) => state.setFetchedData);
  const setLinkStore = useFormDataStore((state) => state.setLinkStore);
  const profileStore = useFormDataStore((state) => state.profileStore);
  const watch = useWatch({ control: form.control });
  useEffect(() => {
    setProfileStore({
      ...watch,
      name: watch.name || "",
      username: watch.username || "",
      email: watch.email || "",
    });
  }, [watch, setProfileStore]);

  //handle file upload preview
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarURL(URL.createObjectURL(file));
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

  // Prevent user from leaving page without saving
  //
  // ------ 1. Listen for browser window/tab close
  useEffect(() => {
    const handleWindowBeforeUnload = (e: { returnValue: string }) => {
      if (isDirty) {
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleWindowBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleWindowBeforeUnload);
    };
  }, [isDirty]);

  // ------ 2. Listen for route change

  const allProfile = (
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
                  {avatarURL ? (
                    <div className="relative h-full cursor-pointer">
                      <Image
                        src={avatarURL}
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
                        field.onChange(e.target.value);
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

        <Separator />

        <Button type="submit" disabled={loading} className="ml-auto">
          {loading && <Spinner className="mr-2 animate-spin" size={16} />}
          Save
        </Button>
      </form>
    </Form>
  );
  return fetchedData ? (
    <>{allProfile}</>
  ) : (
    <div className="flex h-full w-full">
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={true}
        duration={2000}
      />
    </div>
  );
}
