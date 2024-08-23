"use server";

import { createClient } from "@/utils/supabase/server";

export async function uploadFile(formData: FormData) {
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

    console.log("File uploaded successfully:", data);
    return data; // Return the data for further processing
  } catch (error: Error | any) {
    console.error("Error during file upload:", error.message);
    throw error; // Re-throw the error to be handled by the caller
  }
}
