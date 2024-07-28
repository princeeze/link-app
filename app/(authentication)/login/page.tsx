"use client";
import Image from "next/image";
import logo from "@/public/logo.svg";
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

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="bg-grey-light flex items-center w-screen h-screen justify-center">
      <Image src={logo} alt="logo" />
      <div className="flex flex-col p-10 rounded-xl bg-white gap-10">
        <div>
          <h1 className="heading-m text-grey-dark pb-2">Login</h1>
          <p className="body-m text-grey-default ">
            Add your details below to get back into the app
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormControl>
                <Button>Submit</Button>
              </FormControl>
            </FormItem>
          </form>
        </Form>
        <p className="body-m text-grey-default ">
          Don&apos;t have an account?{" "}
          <Link href={"/signup"} className="text-purple-default">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
