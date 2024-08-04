"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { loginSchema, signupSchema } from "@/lib/schema";
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

export async function signup(values: z.infer<typeof signupSchema>) {
  const supabase = createClient();
  const data = signupSchema.parse(values);

  try {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/");
    return { message: "Signup successful" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors.map((e) => e.message).join(", ") };
    }
    return { error: "Internal server error" };
  }
}
