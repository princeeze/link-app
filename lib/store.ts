import { z } from "zod";
import create from "zustand";

import { formSchema } from "@/lib/schema";

interface FormDataState {
  formData: z.infer<typeof formSchema>["links"];
  setFormData: (data: any) => void;
}

export const useFormDataStore = create<FormDataState>((set) => ({
  formData: [],
  setFormData: (data) => set({ formData: data }),
}));
