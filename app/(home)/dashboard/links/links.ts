"use server";

import { z } from "zod";

import { createClient } from "@/utils/supabase/server";

import { formSchema, linkSchema } from "@/lib/schema";

export async function getLinks() {
  const supabase = createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User is not authenticated");
    }

    const userId = user.id;
    const { data, error } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", userId);
    if (error) {
      throw error;
    }

    const links: z.infer<typeof linkSchema>[] = data.map((link) => ({
      platform: link.platform,
      link: link.link,
    }));

    return links;
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateLinks(
  newLinks: z.infer<typeof formSchema>["links"],
) {
  const supabase = createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User is not authenticated");
    }

    const userId = user.id;

    // Step 1: Delete all existing links for the user
    const { error: deleteError } = await supabase
      .from("links")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      throw deleteError;
    }

    // Step 2: Insert the new links
    const { error: insertError } = await supabase.from("links").insert(
      newLinks.map((link: z.infer<typeof linkSchema>) => ({
        user_id: userId,
        platform: link.platform,
        link: link.link,
      })),
    );

    if (insertError) {
      throw insertError;
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
