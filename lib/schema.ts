import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Too short"),
});

export const signupSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),

    password: z
      .string()
      .min(6, "Too short")
      .regex(/[A-Za-z]/, "Password must contain at least one letter")
      .regex(/\d/, "Password must contain at least one number"),

    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const linkSchema = z.object({
  platform: z.enum(["github", "youtube", "linkedin"]),
  link: z
    .string()
    .url("Invalid URL")
    .refine((val) => {
      if (val.includes("github")) return val.includes("github.com/");
      if (val.includes("youtube")) return val.includes("youtube.com/");
      if (val.includes("linkedin")) return val.includes("linkedin.com/in/");
      return true;
    }, "Invalid link for the selected platform"),
});

export const linkFormSchema = z.object({
  links: z.array(linkSchema).min(1, "At least one link is required"),
});

export const profileFormSchema = z.object({
  name: z.string().min(3, "Too short"),
  username: z.string().min(4, "Too short").regex(/^\w+$/, "Invalid Username"),
  email: z.string().min(1, "Required").email("Invalid address"),
  avatar: z
    .any()
    // .refine((files) => files?.length === 1, "Profile picture is required")
    .refine((files) => {
      if (!files || files.length === 0 || files[0].size === 0) {
        return true; // Allow empty file input
      }
      return files[0].size <= 1024 * 1024;
    }, "Image must be less than 1MB")
    .refine((files) => {
      if (!files || files.length === 0 || files[0].size === 0) {
        return true; // Allow empty file input
      }
      return ["image/jpeg", "image/png"].includes(files?.[0]?.type);
    }, "Only PNG or JPG formats are allowed"),
});
