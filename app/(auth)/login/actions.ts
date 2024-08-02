"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { loginSchema } from "@/lib/schema";
import { createClient } from "@/utils/supabase/server";

export async function login(values: z.infer<typeof loginSchema>) {
  const supabase = createClient();
  const data = loginSchema.parse(values);
  try {
    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/");
    return { message: "Login successful" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors.map((e) => e.message).join(", ") };
    }
    return { error: "Internal server error" };
  }
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
