import Link from "next/link";

import SignupForm from "@/components/layout/signupform";

export default function SignUp() {
  return (
    <>
      <div>
        <h1 className="heading-m pb-2 text-grey-dark">Create Account</h1>
        <p className="body-m text-grey-default">
          Add your details below to get back into the app
        </p>
      </div>
      <SignupForm />
      <p className="body-m m-auto text-grey-default">
        Already have an account?{" "}
        <Link href={"/Login"} className="text-purple-default">
          Login
        </Link>
      </p>
    </>
  );
}
