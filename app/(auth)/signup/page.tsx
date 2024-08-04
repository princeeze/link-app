"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { cn } from "@/lib/utils";
import { EnvelopeSimple, Spinner, LockKey } from "@phosphor-icons/react";
import { login, signup } from "../actions";
import { signupSchema } from "@/lib/schema";
import * as React from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    const result = await signup(values);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      result.message ? setErrorMessage(result.message) : "";
      router.push("/");
    }

    setIsLoading(false);
  }

  const handleInputChange = () => {
    setErrorMessage(null);
  };

  return (
    <>
      <div>
        <h1 className="heading-m text-grey-dark pb-2">Create Account</h1>
        <p className="body-m text-grey-default ">
          Add your details below to get back into the app
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 max-w-[396px]"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="body-s text-grey-dark">
                  Email Address
                </FormLabel>
                <div className="relative border-borders flex items-center max-w-full">
                  <EnvelopeSimple
                    weight="fill"
                    className="absolute left-4 top-1/2 -translate-y-1/2 transform text-grey-default"
                    size={16}
                  />
                  <FormControl>
                    <Input
                      placeholder="e.g. alex@email.com"
                      className={cn(
                        "pl-11 pr-4",
                        fieldState.error && "border-red text-red"
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
                <div className="relative border-borders flex items-center max-w-full">
                  <LockKey
                    weight="fill"
                    className="absolute left-4 top-1/2 -translate-y-1/2 transform text-grey-default"
                    size={16}
                  />
                  <FormControl>
                    <Input
                      placeholder="At least 8 characters"
                      type="password"
                      className={cn(
                        "pl-11 pr-4",
                        fieldState.error && "border-red text-red"
                      )}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e); // Ensure react-hook-form updates its state
                        handleInputChange(); // Clear error message on change
                      }}
                    />
                  </FormControl>
                  <FormMessage className="absolute right-4 top-1/2 -translate-y-1/2 transform"></FormMessage>
                </div>
                <span></span>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  <span className="body-s text-grey-dark">
                    Confirm Password
                  </span>
                </FormLabel>
                <div className="relative border-borders flex items-center max-w-full">
                  <LockKey
                    weight="fill"
                    className="absolute left-4 top-1/2 -translate-y-1/2 transform text-grey-default"
                    size={16}
                  />
                  <FormControl>
                    <Input
                      placeholder="At least 8 characters"
                      type="password"
                      className={cn(
                        "pl-11 pr-4",
                        fieldState.error && "border-red text-red"
                      )}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e); // Ensure react-hook-form updates its state
                        handleInputChange(); // Clear error message on change
                      }}
                    />
                  </FormControl>
                  <FormMessage className="absolute right-4 top-1/2 -translate-y-1/2 transform"></FormMessage>
                </div>
                <span></span>
              </FormItem>
            )}
          />
          <FormDescription>
            {errorMessage ? (
              <span>{errorMessage}</span>
            ) : (
              "Passwords must contain at least 8 characters"
            )}
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
                Create New Account
              </Button>
            </FormControl>
          </FormItem>
          <p className="body-m text-grey-default m-auto">
            Already have an account?{" "}
            <Link href={"/Login"} className="text-purple-default">
              Login
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
}
