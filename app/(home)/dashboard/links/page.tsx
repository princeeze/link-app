"use client";

import { useEffect, useState } from "react";

import { updateLinks } from "@/app/(home)/dashboard/links/links";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@phosphor-icons/react";
import {
  GithubLogo,
  LinkedinLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
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

export default function Links() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("github");
  const [successMessage, setSuccessMessage] = useState<boolean>(true);

  const placeholders: Record<string, string> = {
    github: "e.g. https://www.github.com/johnappleseed",
    youtube: "e.g. https://www.youtube.com/johnappleseed",
    linkedin: "e.g. https://www.linkedin.com/in/johnappleseed",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      links: [{ platform: "github", link: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "links",
    control: form.control,
  });

  const setFormData = useFormDataStore((state) => state.setFormData);
  const formData = useFormDataStore((state) => state.formData);

  const watch = useWatch({ control: form.control, name: "links" });

  useEffect(() => {
    setFormData(watch);
  }, [watch, setFormData]);

  const onSubmit = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    console.log(formData);
    const result = await updateLinks(formData);
    if (result.error) {
      setErrorMessage(result.error);
    } else {
      setErrorMessage("bEAUTIFYL");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex max-h-full w-full flex-col">
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="heading-m pb-2 text-grey-dark">
            Customize your links
          </h1>
          <p className="body-m text-grey-default">
            Add/edit/remove links below and then share all your profiles with
            the world!
          </p>
        </div>

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
                              <SelectValue placeholder="Dropdown Field Active" />
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
                      <FormLabel className="body-s text-grey-dark">
                        Link
                      </FormLabel>
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

            <FormItem>
              <FormMessage />
              <FormDescription>
                {successMessage && <span>{successMessage}</span>}
                {errorMessage && (
                  <span className="text-red">{errorMessage}</span>
                )}
              </FormDescription>
              <FormControl>
                <Button disabled={isLoading}>
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
      </div>
    </div>
  );
}
