"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  checkUsernameAvailability,
  uploadFile,
} from "@/app/(home)/dashboard/profile/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@phosphor-icons/react";
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

export default function ProfileForm() {
  const [preview, setPreview] = useState<string | undefined>();
  const [validating, setValidating] = useState(false);
  const [validationResponse, setValidationResponse] = useState<string | null>(
    null,
  );
  const [formUser, setFormUser] = useState("");

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
  });
  const [loading, setLoading] = useState(false);

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
        // const result = await uploadFile(formData, formText);
        console.log("File uploaded successfully");
      } catch (error) {
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
            <FormItem className="flex w-full items-center justify-between bg-grey-light p-5">
              <FormLabel className="body-m text-grey-default">
                Profile Picture
              </FormLabel>
              <div className="!m-0 flex items-center gap-6">
                <FormControl>
                  <Input
                    type="file"
                    className="w-6"
                    //For some reason, react hook form needs this for file types
                    onChange={(e) => {
                      handleChange(e);
                      return field.onChange(e.target.files);
                    }}
                  />
                </FormControl>
                {preview && (
                  <Image
                    src={preview}
                    width={100}
                    height={100}
                    alt="Preview"
                    className="h-12 w-12 rounded-full"
                  />
                )}
                <FormDescription className="body-s max-w-[215px] text-grey-default">
                  Image must be below 1024x1024px. Use PNG or JPG format.
                  <FormMessage />
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3 bg-grey-light p-5">
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
                        return field.onChange(e.target.value);
                      }}
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
          {loading ? "Uploading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
