"use server";

import { z } from "zod";

import { createClient } from "@/utils/supabase/server";
import { profileFormSchema } from "@/lib/schema";

export async function updateProfile(
  formText: z.infer<typeof profileFormSchema>,
  formData?: FormData,
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

    let filePath: string | undefined;

    // Get file from form data
    if (formData) {
      const file = formData.get("file") as File;

      if (!file) {
        throw new Error("No file uploaded");
      }

      // Define file path
      const userId = user.id;
      filePath = `${userId}_${file.name}`;

      // Upload file to Supabase
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) {
        console.error("File upload error:", uploadError);
        throw new Error("Failed to upload file");
      }
    }

    // Prepare profile update data
    const profileUpdate = {
      user_id: user.id,
      name: formText.name,
      username: formText.username,
      email: formText.email,
      ...(filePath ? { avatar: filePath } : { avatar: formText.avatar }), // Only include avatar if filePath is defined
    };

    // Update profile in Supabase
    const { error: updateError } = await supabase
      .from("profile")
      .upsert(profileUpdate, {
        onConflict: "user_id",
      });

    if (updateError) {
      console.log("Profile update error:", updateError);
      throw new Error("Failed to update profile");
    }

    // Return success message
    return { success: true };
    console.log("Profile updated successfully");
  } catch (error: Error | any) {
    console.error("Error during profile update:", error.message);
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

export async function getProfile(username?: string) {
  const supabase = createClient();
  try {
    //check if username is provided
    if (username) {
      const { data: profile, error } = await supabase
        .from("profile")
        .select("*")
        .eq("username", username);
      if (error) {
        throw error;
      }
      console.log("Profile data:", profile);
      // Get avatar URL from Supabase
      if (profile.length > 0) {
        console.log("Avatar URL:", profile[0].avatar);
        const { data: avatarData } = supabase.storage
          .from("avatars")
          .getPublicUrl(profile[0].avatar);

        console.log("Avatar data:", avatarData);
        return { profile, avatarData };
      } else {
        return { profile };
      }
    } else {
      // Validate user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw new Error(`Authentication error: ${authError.message}`);
      }

      if (!user) {
        throw new Error("User is not authenticated");
      }

      const userId = user.id;
      // Get profile data from Supabase
      const { data: profile, error } = await supabase
        .from("profile")
        .select("*")
        .eq("user_id", userId);
      if (error) {
        throw error;
      }
      console.log("Profile data:", profile);
      // Get avatar URL from Supabase
      if (profile.length > 0) {
        console.log("Avatar URL:", profile[0].avatar);
        const { data: avatarData } = supabase.storage
          .from("avatars")
          .getPublicUrl(profile[0].avatar);

        console.log("Avatar data:", avatarData);
        return { profile, avatarData };
      } else {
        return { profile };
      }
    }
  } catch (error: any) {
    console.error("Error getting profile:", error.message);
    throw error;
  }
}
