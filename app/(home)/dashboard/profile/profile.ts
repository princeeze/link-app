"use server";

import { z } from "zod";

import { createClient } from "@/utils/supabase/server";
import { profileFormSchema } from "@/lib/schema";

export async function updateProfile(
  formData: FormData,
  formText: z.infer<typeof profileFormSchema>,
) {
  const supabase = createClient();

  try {
    // Validate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Authentication error:", authError);
      throw new Error("Failed to authenticate user");
    }

    if (!user) {
      throw new Error("User is not authenticated");
    }

    // Get file from form data
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file uploaded");
    }

    // Define file path
    const userId = user.id;
    const filePath = `${userId}_${file.name}`;

    // Upload file to Supabase
    const { data, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) {
      console.error("File upload error:", uploadError);
      throw new Error("Failed to upload file");
    }

    // Update profile in Supabase
    const { error: updateError } = await supabase.from("profile").upsert(
      {
        user_id: userId,
        name: formText.name,
        username: formText.username,
        email: formText.email,
        avatar: filePath,
      },
      {
        onConflict: "user_id",
      },
    );

    if (updateError) {
      throw new Error("Failed to update profile");
    }

    console.log("File uploaded successfully:", data);
    return data; // Return the data for further processing
  } catch (error: Error | any) {
    console.error("Error during file upload:", error.message);
    throw error; // Re-throw the error to be handled by the caller
  }
}

export async function checkUsernameAvailability(username: string) {
  const supabase = createClient();

  try {
    // Validate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Authentication error:", authError);
      throw new Error("Failed to authenticate user");
    }

    if (!user) {
      throw new Error("User is not authenticated");
    }

    // Get current username from Supabase
    const userId = user.id;
    const { data: currentUsername, error: currentUsernameError } =
      await supabase.from("profile").select("username").eq("user_id", userId);
    if (currentUsernameError) {
      throw new Error("Failed to get username");
    }

    // Check if username is already taken
    const { data, error } = await supabase
      .from("profile")
      .select("username")
      .eq("username", username);
    if (error) {
      throw error;
    }
    if (data && data.length > 0) {
      return data[0].username === currentUsername[0].username ? true : false;
    }
    return true;
  } catch (error: any) {
    console.error("Error checking username availability:", error.message);
    throw error;
  }
}

export async function getProfile() {
  const supabase = createClient();

  try {
    // Validate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Authentication error:", authError);
      throw new Error("Failed to authenticate user");
    }

    if (!user) {
      throw new Error("User is not authenticated");
    }

    // Get profile data from Supabase
    const userId = user.id;
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("user_id", userId);
    if (error) {
      throw error;
    }

    // Get avatar URL from Supabase

    const { data: avatarData } = supabase.storage
      .from("avatars")
      .getPublicUrl(data[0].avatar);

    if (data.length > 0) {
      // Check if data is not empty
      const profile = data[0]; // Assuming data is an array and you need the first item
      console.log("Profile data:", profile);
      console.log("Avatar URL:", avatarData);
      return { profile, avatarData };
    }
  } catch (error: any) {
    console.error("Error getting profile:", error.message);
    throw error;
  }
}
