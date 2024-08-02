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
import { EnvelopeSimple, Spinner } from "@phosphor-icons/react";
import { login } from "./actions";
import { loginSchema } from "@/lib/schema";
import * as React from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    const result = await login(values);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      setErrorMessage(null);
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
        <h1 className="heading-m text-grey-dark pb-2">Login</h1>
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
                  <EnvelopeSimple
                    className="absolute left-4 top-1/2 -translate-y-1/2 transform text-grey-default"
                    size={16}
                  />
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
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
                  <FormMessage className="absolute right-4 top-1/2 -translate-y-1/2 transform">
                    {errorMessage}
                  </FormMessage>
                </div>
                <span></span>
              </FormItem>
            )}
          />
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
          <p className="body-m text-grey-default m-auto">
            Don&apos;t have an account?{" "}
            <Link href={"/signup"} className="text-purple-default">
              Create account
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
}
