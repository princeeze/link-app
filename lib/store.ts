import create from "zustand";

interface FormDataState {
  formData: any;
  setFormData: (data: any) => void;
}

export const useFormDataStore = create<FormDataState>((set) => ({
  formData: [],
  setFormData: (data) => set({ formData: data }),
}));
