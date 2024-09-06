"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { getLinks, updateLinks } from "@/app/(home)/dashboard/links/links";
import noLinks from "@/public/no-links.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FloppyDiskBack,
  GithubLogo,
  LinkedinLogo,
  SmileyMelting,
  Spinner,
  YoutubeLogo,
} from "@phosphor-icons/react";
import { LucideLink } from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formSchema } from "@/lib/schema";
import { useFormDataStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function LinkForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [linksLoading, setLinksLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("github");
  const loadingStates = [
    {
      text: "Grabbing your links",
    },
    {
      text: "Sliding through socials",
    },
    {
      text: "Connecting the dots",
    },
    {
      text: "Prepping the link drop",
    },
    {
      text: "Almost there, fam",
    },
    {
      text: "Oops, starting over! 🤷‍♂️",
    },
  ];

  //placeholders for input
  const placeholders: Record<string, string> = {
    github: "e.g. https://www.github.com/johnappleseed",
    youtube: "e.g. https://www.youtube.com/johnappleseed",
    linkedin: "e.g. https://www.linkedin.com/in/johnappleseed",
  };

  //define react hook form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      links: [],
    },
  });
  const { isDirty } = form.formState;
  const { fields, append, remove } = useFieldArray({
    name: "links",
    control: form.control,
  });

  //setup zustand to watch for changes
  const setFormData = useFormDataStore((state) => state.setFormData);
  const formData = useFormDataStore((state) => state.formData);
  const watch = useWatch({ control: form.control, name: "links" });
  useEffect(() => {
    setFormData(watch);
  }, [watch, setFormData]);

  //fetch links from supabase
  useEffect(() => {
    setLinksLoading(true);
    async function fetchLinks() {
      const result = await getLinks();
      if (Array.isArray(result)) {
        console.log(result);
        form.reset({ links: result });
        setLinksLoading(false);
      } else {
        console.error("Error fetching links:", result.error);
        setLinksLoading(false);
      }
    }
    fetchLinks();
  }, [form]);

  //submit links to supabase
  const onSubmit = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    const result = await updateLinks(formData);
    if (result.error) {
      setErrorMessage(result.error);
    } else {
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
    setIsLoading(false);
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

  const allLinks = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => append({ platform: "github", link: "" })}
        >
          + Add New Link
        </Button>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex w-full flex-col gap-3 rounded-xl bg-grey-light p-5"
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-3 border-y border-grey-default"></div>
                <span className="font-bold text-grey-default">
                  Link #{index + 1}
                </span>
              </div>
              <Button
                className="body-m p-0 text-grey-default"
                variant={"ghost"}
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
            <FormField
              control={form.control}
              name={`links.${index}.platform`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="body-s text-grey-dark">
                    Platform
                  </FormLabel>
                  <Select
                    defaultValue="github"
                    onValueChange={(value: string) => {
                      field.onChange(value);
                      setSelectedPlatform(value);
                    }}
                  >
                    <div className="relative flex w-full items-center border-borders">
                      <FormControl>
                        <SelectTrigger className="px-4">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                    </div>
                    <SelectContent className="w-full">
                      <SelectItem value="github">
                        <div className="flex items-center gap-3">
                          <GithubLogo
                            className="text-grey-default"
                            weight="fill"
                            size={20}
                          />{" "}
                          <span>Github</span>
                          <span className="hidden data-[state=checked]:block">
                            (Selected)
                          </span>
                        </div>
                      </SelectItem>
                      <Separator className="m-auto w-[95%]" />
                      <SelectItem value="youtube">
                        <div className="flex items-center gap-3">
                          <YoutubeLogo
                            className="text-grey-default"
                            weight="fill"
                            size={20}
                          />{" "}
                          <span>Youtube</span>
                          <span className="hidden data-[state=checked]:block">
                            (Selected)
                          </span>
                        </div>
                      </SelectItem>
                      <Separator className="m-auto w-[95%]" />
                      <SelectItem value="linkedin">
                        <div className="flex items-center gap-3">
                          <LinkedinLogo
                            className="text-grey-default"
                            weight="fill"
                            size={20}
                          />{" "}
                          <span>Linkedin</span>
                          <span className="hidden data-[state=checked]:inline">
                            (Selected)
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`links.${index}.link`}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="body-s text-grey-dark">Link</FormLabel>
                  <div className="relative flex items-center border-borders">
                    <LucideLink
                      className="absolute left-4 top-1/2 -translate-y-1/2 transform text-grey-default"
                      size={16}
                    />
                    <FormControl>
                      <Input
                        placeholder={placeholders[selectedPlatform]}
                        className={cn(
                          "pl-11 pr-4",
                          fieldState.error && "border-red text-red",
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="absolute right-4 top-1/2 -translate-y-1/2 transform" />
                  </div>
                </FormItem>
              )}
            />
          </div>
        ))}

        {fields.length === 0 && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-grey-light p-10">
            <Image src={noLinks} alt="No links found" />
            <p className="heading-m text-center text-2xl text-grey-dark">
              Let&apos;s get you started
            </p>
            <p className="body-m text-center text-grey-default">
              Use the “Add new link” button to get started. Once you have more
              than one link, you can reorder and edit them. We&apos;re here to
              help you share your profiles with everyone!
            </p>
          </div>
        )}

        <Separator />

        <FormItem className="flex w-full items-center">
          <FormMessage />
          <FormDescription>
            {errorMessage && <span className="text-red">{errorMessage}</span>}
          </FormDescription>
          <FormControl
            onClick={() => {
              if (formData.length === 0) {
                toast({
                  icon: (
                    <SmileyMelting
                      weight="fill"
                      size={20}
                      className="text-grey-default"
                    />
                  ),
                  title: "No links found",
                });
              }
            }}
          >
            <Button disabled={isLoading} className="ml-auto">
              {isLoading && (
                <Spinner
                  weight="bold"
                  size={24}
                  className="mr-2 animate-spin"
                />
              )}
              Save
            </Button>
          </FormControl>
        </FormItem>
      </form>
    </Form>
  );

  return linksLoading ? (
    <div className="flex h-full w-full">
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={true}
        duration={2000}
      />
    </div>
  ) : (
    <>{allLinks}</>
  );
}
