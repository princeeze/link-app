"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { login } from "@/app/(auth)/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Confetti,
  EnvelopeSimple,
  LockKey,
  Spinner,
} from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
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
import { loginSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function AuthForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  /* const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null,
  ); */
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    const result = await login(values);
    if (result.error) {
      setErrorMessage(result.error);
      setIsLoading(false);
    } else {
      // setSuccessMessage(result.message || null);
      toast({
        icon: (
          <Confetti weight="fill" size={20} className="text-grey-default" />
        ),
        title: "Welcome back!",
      });
      setTimeout(() => {
        router.push("/links");
      }, 100); // Small delay to ensure session is fully updated
      // successMessage ? setIsLoading(true) : setIsLoading(false);
    }
  }

  const handleInputChange = () => {
    setErrorMessage(null);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex max-w-[396px] flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="body-s text-grey-dark">
                Email Address
              </FormLabel>
              <div className="relative flex max-w-full items-center border-borders">
                <EnvelopeSimple
                  weight="fill"
                  className="absolute left-4 top-1/2 -translate-y-1/2 transform text-grey-default"
                  size={16}
                />
                <FormControl>
                  <Input
                    autoComplete="email"
                    placeholder="e.g. alex@email.com"
                    className={cn(
                      "pl-11 pr-4",
                      fieldState.error && "border-red text-red",
                    )}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e); // Ensure react-hook-form updates its state
                      handleInputChange(); // Clear error message on change
                    }}
                  />
                </FormControl>
                <FormMessage className="absolute right-4 top-1/2 -translate-y-1/2 transform" />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                <span className="body-s text-grey-dark">Password</span>
              </FormLabel>
              <div className="relative flex max-w-full items-center border-borders">
                <LockKey
                  weight="fill"
                  className="absolute left-4 top-1/2 -translate-y-1/2 transform text-grey-default"
                  size={16}
                />
                <FormControl>
                  <Input
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    type="password"
                    className={cn(
                      "pl-11 pr-4",
                      fieldState.error && "border-red text-red",
                    )}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e); // Ensure react-hook-form updates its state
                      handleInputChange(); // Clear error message on change
                    }}
                  />
                </FormControl>
                <FormMessage className="absolute right-4 top-1/2 -translate-y-1/2 transform">
                  {errorMessage}
                </FormMessage>
              </div>
              <span></span>
            </FormItem>
          )}
        />
        <FormDescription>
          {/* {successMessage && <span>{successMessage}</span>} */}
        </FormDescription>
        <FormItem>
          <FormControl>
            <Button className="w-full" disabled={isLoading}>
              {isLoading && (
                <Spinner
                  weight="bold"
                  size={24}
                  className="mr-2 animate-spin"
                />
              )}
              Submit
            </Button>
          </FormControl>
        </FormItem>
      </form>
    </Form>
  );
}
