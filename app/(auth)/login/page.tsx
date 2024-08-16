import { Metadata } from "next";
import Link from "next/link";

import AuthForm from "@/components/layout/authform";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function Login() {
  return (
    <>
      <div>
        <h1 className="heading-m pb-2 text-grey-dark">Login</h1>
        <p className="body-m text-grey-default">
          Add your details below to get back into the app
        </p>
      </div>
      <AuthForm />
      <p className="body-m m-auto text-grey-default">
        Don&apos;t have an account?{" "}
        <Link href={"/signup"} className="text-purple-default">
          Create account
        </Link>
      </p>
    </>
  );
}
