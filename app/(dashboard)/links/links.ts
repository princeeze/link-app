"use server";

import { z } from "zod";

import { createClient } from "@/utils/supabase/server";
import { linkFormSchema, linkSchema } from "@/lib/schema";

export async function getLinks(username?: string) {
  const supabase = createClient();
  let userId: string;
  try {
    if (username) {
      const { data: profile, error } = await supabase
        .from("profile")
        .select("*")
        .eq("username", username);
      if (error) {
        throw error;
      }

      userId = profile[0].user_id;
      console.log(userId);
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User is not authenticated");
      }

      userId = user.id;
    }

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
    console.log(links);
    return links;
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateLinks(
  newLinks: z.infer<typeof linkFormSchema>["links"],
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
