import { z } from "zod";
import { create } from "zustand";

import { formSchema } from "@/lib/schema";

// TODO: Fix Types and Validation

interface FormDataState {
  formData: z.infer<typeof formSchema>["links"];
  profileData: {
    name: string | undefined;
    username: string | undefined;
    email: string | undefined;
    avatar: string | undefined;
  };
  setProfileData: (data: any) => void;
  setFormData: (data: any) => void;
  avatar: string | undefined;
  setAvatar: (link: string | undefined) => void;
}

export const useFormDataStore = create<FormDataState>((set) => ({
  formData: [],
  profileData: {
    name: undefined,
    username: undefined,
    email: undefined,
    avatar: undefined,
  },
  avatar: undefined,
  setAvatar: (link) => set({ avatar: link }),
  setProfileData: (data) => set({ profileData: data }),
  setFormData: (data) => set({ formData: data }),
}));
