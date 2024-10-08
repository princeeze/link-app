import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Too short"),
});

export const signupSchema = z
  .object({
    email: z.string().email("Invalid email").min(1, "Required"),

    password: z.string().min(6, "Too short"),

    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Doesn't match",
    path: ["confirmPassword"],
  });

export const linkSchema = z.object({
  platform: z.enum(["github", "youtube", "linkedin"]),
  link: z
    .string()
    .min(1, "Link is required")
    .transform((val) => {
      // Automatically prepend 'https://' if no scheme is provided
      if (!/^https?:\/\//.test(val)) {
        return `https://${val}`;
      }
      return val;
    })
    .refine(
      (val) => {
        // A more permissive URL pattern
        const urlPattern = /^(https?:\/\/)?([\d./A-Za-z-]+)\.([\d./A-Za-z-]+)$/;
        return urlPattern.test(val);
      },
      {
        message: "Invalid link",
      },
    )
    .refine((val) => {
      if (val.includes("github")) return val.includes("github.com/");
      if (val.includes("youtube")) return val.includes("youtube.com/");
      if (val.includes("linkedin")) return val.includes("linkedin.com/in/");
      return true;
    }, "Invalid link for platform"),
});

export const linkFormSchema = z.object({
  links: z.array(linkSchema),
});

export const profileFormSchema = z.object({
  name: z.string().min(3, "Too short"),
  username: z.string().min(4, "Too short").regex(/^\w+$/, "Invalid Username"),
  email: z.string().min(1, "Required"),
  avatar: z
    .any()
    // .refine((files) => files?.length === 1, "Profile picture is required")
    .refine((files) => {
      if (!files || files.length === 0 || files[0].size === 0) {
        return true; // Allow empty file input
      }
      return files[0].size <= 1024 * 1024;
    }, "Must be less than 1MB")
    .refine((files) => {
      if (!files || files.length === 0 || files[0].size === 0) {
        return true; // Allow empty file input
      }
      return ["image/jpeg", "image/png"].includes(files?.[0]?.type);
    }, "Only PNG or JPG are allowed"),
});
